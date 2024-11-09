// backend/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const multer = require('multer'); // For handling file uploads
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Enable Mongoose Debugging (Logs all queries)
mongoose.set('debug', true);

// Middleware Setup
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Log the MongoDB URI (masking sensitive information)
const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in environment variables.');
  process.exit(1); // Exit the process with failure
}
console.log(
  'Connecting to MongoDB with URI:',
  MONGODB_URI.replace(/password=.*@/, 'password=******@')
);

// Connect to MongoDB with Options
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'el-gato-tuerto', 
  })
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Current Database:', mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit process if connection fails
  });

// Define Product Schema
const productSchema = new mongoose.Schema(
  {
    alcoholicBeverage: { type: String, required: true },
    type: { type: String, required: true },
    subtype: { type: String },
    brand: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    route: { type: String },
    modal: { type: Boolean, default: false },
    sizes: [
      {
        id: { type: String },
        size: { type: String },
        price: { type: Number, required: true },
        img: { type: String },
        inventory: { type: Number, default: 0 },
        size_ml: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

// Create Product Model with Explicit Collection Name

// Root Route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});


// API Endpoint to List All Collections
app.get('/api/collections', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);
    console.log('Collections in the database:', collectionNames);
    res.json(collectionNames);
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// API Endpoint to Get All Data from Each Collection
app.get('/api/collections/data', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);

    // Fetch all documents from each collection
    const dataPromises = collectionNames.map(async (collectionName) => {
      const documents = await mongoose.connection.db
        .collection(collectionName)
        .find()
        .toArray();
      return { collection: collectionName, documents };
    });

    const collectionsData = await Promise.all(dataPromises);
    console.log('Retrieved data from all collections');
    res.json(collectionsData);
  } catch (err) {
    console.error('Error fetching collections data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Additional Test Route to Add a Test Product
app.post('/api/add-test-product', async (req, res) => {
  try {
    const testProduct = new Product({
      alcoholicBeverage: 'Wine',
      type: 'Red',
      subtype: 'Merlot',
      brand: 'Brand A',
      name: 'Merlot 2018',
      description: 'A smooth red wine.',
      route: '/products/merlot-2018',
      modal: false,
      sizes: [
        {
          id: '1',
          size: '750ml',
          price: 20,
          img: 'image_url',
          inventory: 50,
          size_ml: 750,
        },
      ],
    });

    const savedProduct = await testProduct.save();
    console.log('Added Test Product:', savedProduct);
    res.json(savedProduct);
  } catch (err) {
    console.error('Error adding test product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});