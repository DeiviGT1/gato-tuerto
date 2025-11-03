// backend/controllers/orderController.js

const axios = require('axios');
const Order = require('../models/Order');

// ====== SSE clients (simple in-memory pub-sub) ======
const sseClients = new Set();
function sendSseToAll(eventName, payload) {
  const data = `event: ${eventName}\n` + `data: ${JSON.stringify(payload)}\n\n`;
  for (const res of sseClients) {
    try { res.write(data); } catch (_) { /* ignore */ }
  }
}

// Lee las variables de entorno para Telegram
// Ahora TELEGRAM_CHAT_ID es un array
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// Habilitado por defecto salvo que TELEGRAM_ENABLED sea "false"
const TELEGRAM_ENABLED = process.env.TELEGRAM_ENABLED !== 'false';
const TELEGRAM_CHAT_IDS = [
  process.env.TELEGRAM_CHAT_ID,
  process.env.TELEGRAM_CHAT_ID_2,
];

// Controlador para crear un nuevo pedido (checkout)
exports.createOrder = async (req, res) => {
  try {
    const {
      name,
      address,
      phoneNumber,
      email,
      paymentMethod,
      cardNumber,
      items,
      total,
      notes,
      zipCode,
      subTotal,
      salesTax,
      tipPercentage,
    } = req.body;

    // Validación básica
    if (!name || !address || !phoneNumber || !items || items.length === 0 || !total) {
      return res
        .status(400)
        .send({ success: false, error: 'Missing required fields' });
    }

    // Guarda el pedido en la base de datos
    const newOrder = new Order({
      name,
      address,
      phoneNumber,
      email,
      paymentMethod,
      cardNumber,
      zipCode,
      items,
      total,
      subTotal,
      salesTax,
      tipPercentage,
      notes,
    });

    const order = await newOrder.save();

    // Detalles del pedido (para enviar por Telegram)
    const orderDetails = `
      *Nuevo Pedido Recibido*:
      *Nombre:* ${name}
      *Dirección:* ${address}
      *ZIP:* ${zipCode || 'N/A'}
      *Teléfono:* ${phoneNumber}
      *Email:* ${email}
      *Método de pago:* ${paymentMethod}
      ${
        paymentMethod === 'card'
          ? `*Últimos 4 dígitos de tarjeta:* ${cardNumber}`
          : ''
      }
      *Subtotal:* $${Number(subTotal || 0).toFixed(2)}
      *Impuestos:* $${Number(salesTax || 0).toFixed(2)}
      *Propina:* ${typeof tipPercentage === 'number' ? tipPercentage : '0'}%
      *Total:* $${Number(total).toFixed(2)}
      *Notas:* ${notes || 'No hay notas'}
      
      *Items:*
      ${items
        .map((item) => `• ${item.name} - ${item.size} x ${item.quantity}`)
        .join('\n')}
    `;

    // Envía el mensaje a Telegram si está habilitado
    // Enviar sólo si tenemos token y al menos un chat id
    if (TELEGRAM_ENABLED && TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_IDS.filter(Boolean).length) {
      await Promise.all(
        TELEGRAM_CHAT_IDS.filter(Boolean).map((chatId) =>
          axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: orderDetails,
            parse_mode: 'Markdown',
          })
        )
      );
    }

    // Notificar a clientes SSE (panel /orders)
    sendSseToAll('new_order', {
      id: order._id,
      name,
      address,
      zipCode: zipCode || null,
      phoneNumber,
      total,
      createdAt: order.createdAt,
      items: items.map(i => ({ name: i.name, size: i.size, quantity: i.quantity })),
    });

    // Respuesta al frontend
    res.status(200).send({ success: true, orderId: order._id });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// Controlador para completar un pedido
exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.body;

    await Order.findByIdAndUpdate(id, { status: 'completed' });
    res.send({ success: true });
  } catch (error) {
    console.error('Error al completar el pedido:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// Controlador para cancelar un pedido
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: 'canceled' },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).send({ success: false, message: 'Pedido no encontrado' });
    }
    res.send({ success: true });
  } catch (error) {
    console.error('Error al cancelar el pedido:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// Controlador para mostrar pedidos y renderizar la página HTML de administración
exports.getOrdersPage = async (req, res) => {
  let pendingOrders = [];
  let completedOrders = [];
  let canceledOrders = [];
  let dbError = '';
  try {
    pendingOrders = await Order.find({ status: 'pending' });
    completedOrders = await Order.find({ status: 'completed' });
    canceledOrders = await Order.find({ status: 'canceled' });

    // Tu lógica de renderización HTML
    let html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Orders Admin</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 20px; }
      h1 { margin-bottom: 8px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
      .card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px; }
      .meta { color: #555; font-size: 12px; }
      .pill { display:inline-block; padding:2px 8px; border-radius:999px; background:#eef2ff; color:#3730a3; font-size:12px; }
      .toast { position: fixed; right: 16px; bottom: 16px; background:#111827; color:#fff; padding:10px 14px; border-radius:8px; opacity:0.92; }
    </style>
  </head>
  <body>
    <h1>Orders</h1>
    <p class="meta">This page will request notification permission and alert you when a new order arrives.</p>
    <h2>Pending</h2>
    <div class="grid" id="pending">
      ${pendingOrders.map(o => `
        <div class="card">
          <div><span class="pill">pending</span></div>
          <strong>${o.name}</strong>
          <div class="meta">${o.address} ${o.zipCode ? '('+o.zipCode+')' : ''}</div>
          <div class="meta">$${Number(o.total).toFixed(2)} • ${new Date(o.createdAt).toLocaleString()}</div>
          <ul>
            ${o.items.map(i => `<li>${i.name} - ${i.size} x ${i.quantity}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <script>
      (function() {
        // 1) Solicitar permiso de notificación al cargar
        if ("Notification" in window) {
          if (Notification.permission === 'default') {
            Notification.requestPermission().catch(() => {});
          }
        }

        // Fallback mini-toast en página
        function showToast(text) {
          var el = document.createElement('div');
          el.className = 'toast';
          el.textContent = text;
          document.body.appendChild(el);
          setTimeout(() => { el.remove(); }, 4000);
        }

        // 2) Suscribir a eventos SSE
        var es = new EventSource('/orders/events');
        es.addEventListener('new_order', function(ev) {
          try {
            var order = JSON.parse(ev.data);
            var title = 'New Order: $' + Number(order.total).toFixed(2);
            var body = order.name + ' — ' + (order.items[0] ? (order.items[0].name + ' x' + order.items[0].quantity) : '')
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(title, { body: body });
            } else {
              showToast(title + ' — ' + body);
            }

            // Agregar tarjeta rápida en la sección Pending
            var pending = document.getElementById('pending');
            var card = document.createElement('div');
            card.className = 'card';
            pending.prepend(card);
          } catch (e) { console.error(e); }
        });

        es.addEventListener('ping', function(){});
        es.onerror = function(){ /* mantén vivo en reconexiones */ };
      })();
    </script>
  </body>
</html>
    `;

    res.send(html);
  } catch (error) {
    // Fallback: renderizar la página vacía para permitir permisos/escuchar SSE
    console.error('Error obteniendo página de pedidos:', error);
    dbError = (error && error.message) || 'Database unavailable';
    const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Orders Admin</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 20px; }
      .warn { background:#fef3c7; color:#92400e; padding:10px 12px; border-radius:8px; margin-bottom:12px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
      .toast { position: fixed; right: 16px; bottom: 16px; background:#111827; color:#fff; padding:10px 14px; border-radius:8px; opacity:0.92; }
    </style>
  </head>
  <body>
    <h1>Orders</h1>
    <div class="warn">Database not connected: ${dbError}. Notifications will still work; orders will append live.</div>
    <div id="pending" class="grid"></div>
    <script>
      if ("Notification" in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
      function showToast(text){var el=document.createElement('div');el.className='toast';el.textContent=text;document.body.appendChild(el);setTimeout(()=>{el.remove();},4000);} 
      var es = new EventSource('/orders/events');
      es.addEventListener('new_order', function(ev){
        try { var order = JSON.parse(ev.data);
          var title = 'New Order: $' + Number(order.total).toFixed(2);
          var body = order.name;
          if ('Notification' in window && Notification.permission === 'granted') new Notification(title,{body:body}); else showToast(title+' — '+body);
          var pending=document.getElementById('pending'); var card=document.createElement('div'); card.style.border='1px solid #e0e0e0'; card.style.borderRadius='8px'; card.style.padding='12px'; card.innerHTML='<strong>'+order.name+'</strong><div>$'+Number(order.total).toFixed(2)+'</div>'; pending.prepend(card);
        } catch(e) {}
      });
    </script>
  </body>
</html>`;
    res.send(html);
  }
};

// Controlador para obtener todos los pedidos en JSON (API)
exports.getAllOrdersJson = async (req, res) => {
  try {
    const pending = await Order.find({ status: 'pending' });
    const completed = await Order.find({ status: 'completed' });
    const canceled = await Order.find({ status: 'canceled' });

    res.json({ 
      pending,
      completed,
      canceled
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// ====== SSE endpoint ======
exports.orderEvents = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();

  // Keepalive pings
  const keepAlive = setInterval(() => {
    try { res.write('event: ping\n' + 'data: keepalive\n\n'); } catch (_) {}
  }, 25000);

  sseClients.add(res);
  req.on('close', () => {
    clearInterval(keepAlive);
    sseClients.delete(res);
  });
};