// backend/controllers/webhookController.js

const crypto = require('crypto');
const axios = require('axios');

/**
 * Verifica la firma de la solicitud para asegurar que proviene de Facebook.
 * @param {string} body - Cuerpo de la solicitud.
 * @param {string} signature - Firma enviada en los encabezados de la solicitud.
 * @returns {boolean} - Retorna true si la firma es válida, de lo contrario false.
 */
function verifySignature(body, signature) {
  const APP_SECRET = process.env.FB_APP_SECRET;

  if (!APP_SECRET) {
    console.error('FB_APP_SECRET no está definido en el archivo .env');
    return false;
  }

  const hash = crypto.createHmac('sha256', APP_SECRET).update(body).digest('base64');
  return hash === signature;
}

/**
 * Función para enviar mensajes de WhatsApp usando la API de Meta.
 * @param {string} to - Número de teléfono del destinatario en formato internacional, por ejemplo, "1234567890".
 * @param {string} message - Mensaje de texto a enviar.
 */
async function sendMessage(to, message) {
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    text: { body: message },
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    console.log('Mensaje enviado:', response.data);
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.response ? error.response.data : error.message);
  }
}

/**
 * Maneja la verificación inicial del webhook.
 * Meta envía una solicitud GET con los parámetros 'hub.mode', 'hub.verify_token' y 'hub.challenge'.
 */
exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
      console.log('Webhook verificado correctamente');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403); // Forbidden
    }
  } else {
    res.sendStatus(400); // Bad Request
  }
};

/**
 * Maneja las solicitudes POST del webhook.
 * Procesa los mensajes entrantes de WhatsApp.
 */
exports.handleWebhook = async (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const body = JSON.stringify(req.body);

  if (!verifySignature(body, signature)) {
    console.error('Firma de la solicitud no válida');
    return res.sendStatus(403);
  }

  // Procesa el evento
  const entry = req.body.entry;
  if (entry && Array.isArray(entry)) {
    for (const entryItem of entry) {
      const changes = entryItem.changes;
      if (changes && Array.isArray(changes)) {
        for (const change of changes) {
          if (change.value.messages && Array.isArray(change.value.messages)) {
            for (const message of change.value.messages) {
              const from = message.from; // Número de teléfono del remitente
              const msgBody = message.text.body; // Contenido del mensaje
              
              console.log(`Mensaje recibido de ${from}: ${msgBody}`);

              // Ejemplo: Responder automáticamente al recibir un mensaje
              const responseMessage = `Hola, gracias por tu mensaje: "${msgBody}". ¿En qué puedo ayudarte hoy?`;
              await sendMessage(from, responseMessage);
            }
          }
        }
      }
    }
  }

  // Responde con 200 OK para indicar que se recibió el mensaje correctamente
  res.sendStatus(200);
};