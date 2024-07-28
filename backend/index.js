const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const client = new twilio(accountSid, authToken);

// Ruta GET para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/send-text', (req, res) => {
  const { name, email, message } = req.body;

  const textMessage = `
    Name: ${name}
    Email: ${email}
    Message: ${message}
  `;

  client.messages.create({
    body: textMessage,
    to: process.env.TO_PHONE_NUMBER,  // Text this number from environment variable
    from: process.env.FROM_PHONE_NUMBER // From a valid Twilio number from environment variable
  })
  .then((message) => res.status(200).send({ success: true, sid: message.sid }))
  .catch((error) => {
    console.error('Error:', error);
    res.status(500).send({ success: false, error });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
