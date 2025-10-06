// server.js - Complete Express API for Week 2 Assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Custom logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication middleware
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'your-secret-key') {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  next();
});

// Validation middleware for product creation/update
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;

  if (req.method === 'POST') {
    if (
      !name || !description || typeof price !== 'number' ||
      !category || typeof inStock !== 'boolean'
    ) {
      return res.status(400).json({ error: 'Invalid product data for creation' });
    }
  }

  if (req.method === 'PUT') {
    if (price !== undefined && typeof price !== 'number') {
      return res.status(400).json({ error: 'Price must be a number' });
    }
    if (inStock !== undefined && typeof inStock !== 'boolean') {
      return res.status(400).json({ error: 'inStock must be a boolean' });
    }
    if (name !== undefined && typeof name !== 'string') {
      return res.status(400).json({ error: 'Name must be a string' });
    }
    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Description must be a string' });
    }
    if (category !== undefined && typeof category !== 'string') {
      return res.status(400).json({ error: 'Category must be a string' });
    }
  }

  next();
}

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - List all products with filtering and pagination
app.get('/api/products', (req, res) => {
  let result = [...products];
  const { category, page = 1, limit = 10 } = req.query;

  if (category) {
    result = result.filter(p => p.category === category);
  }

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  res.json(result.slice(start, end));
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', validateProduct, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products.splice(index, 1);
  res.status(204).send();
});

// GET /api/products/search?name=... - Search products by name
app.get('/api/products/search', (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing search query' });

  const result = products.filter(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json(result);
});

// GET /api/products/stats/category - Product count by category
app.get('/api/products/stats/category', (req, res) => {
  const stats = {};
  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;



