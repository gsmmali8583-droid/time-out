const express = require('express');
const router = express.Router();

// Sample products data
const products = [
  // Electronics
  {
    _id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip',
    category: 'electronics',
    subcategory: 'mobiles',
    basePrice: 82999,
    finalPrice: 78999,
    images: [{ url: '/images/iphone.svg', isPrimary: true }],
    stock: 25,
    averageRating: 4.8,
    totalReviews: 156,
    featured: true
  },
  {
    _id: '2',
    name: 'Samsung Galaxy S24',
    description: 'Premium Android smartphone',
    category: 'electronics',
    subcategory: 'mobiles',
    basePrice: 74999,
    finalPrice: 70999,
    images: [{ url: '/images/samsung.svg', isPrimary: true }],
    stock: 18,
    averageRating: 4.6,
    totalReviews: 89,
    featured: true
  },
  {
    _id: '3',
    name: 'MacBook Air M3',
    description: '13-inch laptop with M3 chip',
    category: 'electronics',
    subcategory: 'laptops',
    basePrice: 108999,
    finalPrice: 99999,
    images: [{ url: '/images/macbook.svg', isPrimary: true }],
    stock: 12,
    averageRating: 4.9,
    totalReviews: 234,
    featured: true
  },
  {
    _id: '4',
    name: 'Sony WH-1000XM5',
    description: 'Wireless noise canceling headphones',
    category: 'electronics',
    subcategory: 'audio',
    basePrice: 33299,
    finalPrice: 29099,
    images: [{ url: '/images/headphones.svg', isPrimary: true }],
    stock: 35,
    averageRating: 4.7,
    totalReviews: 178
  },
  // Men's Fashion
  {
    _id: '5',
    name: 'Classic Suit Jacket',
    description: 'Premium wool blend suit jacket',
    category: 'fashion',
    subcategory: 'mens',
    basePrice: 24999,
    finalPrice: 20799,
    images: [{ url: '/images/suit.svg', isPrimary: true }],
    stock: 20,
    averageRating: 4.4,
    totalReviews: 67
  },
  {
    _id: '6',
    name: 'Casual Polo Shirt',
    description: 'Cotton polo shirt for everyday wear',
    category: 'fashion',
    subcategory: 'mens',
    basePrice: 4899,
    finalPrice: 3749,
    images: [{ url: '/images/polo.svg', isPrimary: true }],
    stock: 50,
    averageRating: 4.2,
    totalReviews: 123
  },
  {
    _id: '7',
    name: 'Denim Jeans',
    description: 'Classic fit blue jeans',
    category: 'fashion',
    subcategory: 'mens',
    basePrice: 7399,
    finalPrice: 6579,
    images: [{ url: '/images/jeans.svg', isPrimary: true }],
    stock: 30,
    averageRating: 4.3,
    totalReviews: 89
  },
  // Women's Fashion
  {
    _id: '8',
    name: 'Elegant Evening Dress',
    description: 'Beautiful black evening dress',
    category: 'fashion',
    subcategory: 'womens',
    basePrice: 16599,
    finalPrice: 13249,
    images: [{ url: '/images/dress.svg', isPrimary: true }],
    stock: 15,
    averageRating: 4.6,
    totalReviews: 45,
    featured: true
  },
  {
    _id: '9',
    name: 'Summer Floral Dress',
    description: 'Light and breezy floral print dress',
    category: 'fashion',
    subcategory: 'womens',
    basePrice: 6579,
    finalPrice: 5419,
    images: [{ url: '/images/floral.svg', isPrimary: true }],
    stock: 25,
    averageRating: 4.5,
    totalReviews: 78
  },
  {
    _id: '10',
    name: 'Business Blazer',
    description: 'Professional blazer for office wear',
    category: 'fashion',
    subcategory: 'womens',
    basePrice: 12399,
    finalPrice: 10749,
    images: [{ url: '/images/blazer.svg', isPrimary: true }],
    stock: 18,
    averageRating: 4.4,
    totalReviews: 56
  },
  {
    _id: '11',
    name: 'Casual T-Shirt',
    description: 'Comfortable cotton t-shirt',
    category: 'fashion',
    subcategory: 'womens',
    basePrice: 2419,
    finalPrice: 1999,
    images: [{ url: '/images/tshirt.svg', isPrimary: true }],
    stock: 40,
    averageRating: 4.1,
    totalReviews: 134
  }
];

// Categories data
const categories = [
  { _id: '1', name: 'Electronics', slug: 'electronics' },
  { _id: '2', name: 'Fashion', slug: 'fashion' },
  { _id: '3', name: 'Mobiles', slug: 'mobiles', parent: 'electronics' },
  { _id: '4', name: 'Mens Wear', slug: 'mens', parent: 'fashion' },
  { _id: '5', name: 'Womens Wear', slug: 'womens', parent: 'fashion' }
];

// GET /api/products (main products route - must be first)
router.get('/', async (req, res) => {
  try {
    console.log('Products API called with query:', req.query);
    const { category, subcategory, search } = req.query;
    let filteredProducts = [...products];
    
    console.log('Total products before filtering:', filteredProducts.length);

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
      console.log('After category filter:', filteredProducts.length);
    }

    // Filter by subcategory
    if (subcategory) {
      filteredProducts = filteredProducts.filter(p => p.subcategory === subcategory);
      console.log('After subcategory filter:', filteredProducts.length);
    }

    // Search filter
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
      console.log('After search filter:', filteredProducts.length);
    }

    console.log('Final filtered products:', filteredProducts.length);

    res.json({
      success: true,
      data: {
        products: filteredProducts,
        total: filteredProducts.length
      }
    });
  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = products.filter(p => p.featured);
    res.json({
      success: true,
      data: {
        products: featuredProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        categories: categories
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/products/:id (must be last)
router.get('/:id', async (req, res) => {
  try {
    const product = products.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
