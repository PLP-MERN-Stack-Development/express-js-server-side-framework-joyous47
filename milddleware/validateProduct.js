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

module.exports = validateProduct;



