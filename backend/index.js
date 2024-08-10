const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;  
const client = new twilio(accountSid, authToken);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/checkout', (req, res) => {
  const { name, address, phoneNumber, email, paymentMethod, cardNumber, items, total } = req.body;

  if (!name || !address || !phoneNumber || !items || items.length === 0 || !total) {
    return res.status(400).send({ success: false, error: 'Missing required fields' });
  }

  const orderDetails = `
    Name: ${name}
    Address: ${address}
    Phone Number: ${phoneNumber}
    Email: ${email}
    Payment Method: ${paymentMethod}
    ${paymentMethod === 'card' ? `Card Number (last 4 digits): ${cardNumber}` : ''}
    Total: $${total.toFixed(2)}
    Items: \n ${items.map(item => `${item.name}-${item.size}  x ${item.quantity}`).join('\n')}
  `;

  client.messages.create({
    body: `New Order Received:\n${orderDetails}`,
    to: process.env.TO_PHONE_NUMBER, 
    from: process.env.FROM_PHONE_NUMBER
  })
  .then((message) => res.status(200).send({ success: true, sid: message.sid }))
  .catch((error) => {
    console.error('Error:', error);
    res.status(500).send({ success: false, error: error.message });
  });
});


app.post('/send-text', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send({ success: false, error: 'Missing required fields' });
  }

  const textMessage = `
    Name: ${name}
    Email: ${email}
    Message: ${message}
  `;

  client.messages.create({
    body: textMessage,
    to: process.env.TO_PHONE_NUMBER, 
    from: process.env.FROM_PHONE_NUMBER
  })
  .then((message) => res.status(200).send({ success: true, sid: message.sid }))
  .catch((error) => {
    console.error('Error:', error);
    res.status(500).send({ success: false, error: error.message });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
