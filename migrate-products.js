const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIyUyKEn8KVMO-BVQj_YoJxP4RGSnCJ34",
  authDomain: "ecommerce-de3f5.firebaseapp.com",
  projectId: "ecommerce-de3f5",
  storageBucket: "ecommerce-de3f5.firebasestorage.app",
  messagingSenderId: "49777945568",
  appId: "1:49777945568:web:40cde9b4645837662c1985",
  measurementId: "G-8MD6H6J6H7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample products data (from your routes/products.js)
const products = [
  // Electronics
  {
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

async function migrateProducts() {
  try {
    console.log('Starting product migration to Firebase...');

    for (const product of products) {
      const docRef = await addDoc(collection(db, 'products'), product);
      console.log(`Added product: ${product.name} with ID: ${docRef.id}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

// Run the migration
migrateProducts();
