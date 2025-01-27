const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOrderNotification = async (order) => {
  const message = `
    New Order Received:
    Name: ${order.name}
    Address: ${order.address}
    Total: $${order.total.toFixed(2)}
  `;
  await client.messages.create({
    body: message,
    to: process.env.TO_PHONE_NUMBER,
    from: process.env.FROM_PHONE_NUMBER,
  });
};