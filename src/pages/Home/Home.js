import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiRefreshCw, FiStar, FiClock, FiZap, FiTrendingUp, FiGift, FiChevronLeft, FiChevronRight, FiMail, FiPlay } from 'react-icons/fi';
import ProductCard from '../../components/Products/ProductCard';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });

  // Countdown timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hero slider
  const heroSlides = [
    {
      id: 1,
      title: "Winter Collection 2025",
      subtitle: "UP TO 70% OFF",
      description: "Discover premium fashion and tech gadgets",
      bgImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      cta: "Shop Now"
    },
    {
      id: 2,
      title: "Latest iPhone & Samsung",
      subtitle: "BEST DEALS",
      description: "Get the newest smartphones at unbeatable prices",
      bgImage: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      cta: "Explore Phones"
    },
    {
      id: 3,
      title: "Fashion Forward",
      subtitle: "TRENDY STYLES",
      description: "Express your unique style with our latest collection",
      bgImage: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      cta: "Shop Fashion"
    }
  ];

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Features
  const features = [
    { icon: <FiTruck />, title: "Free Shipping", description: "Free shipping on orders over ₹999", color: "text-blue-500" },
    { icon: <FiShield />, title: "Secure Payment", description: "100% secure payment processing", color: "text-green-500" },
    { icon: <FiHeadphones />, title: "24/7 Support", description: "Round-the-clock customer service", color: "text-purple-500" },
    { icon: <FiRefreshCw />, title: "Easy Returns", description: "30-day hassle-free returns", color: "text-orange-500" }
  ];

  // Categories
  const categories = [
    {
      name: 'Electronics',
      icon: '📱',
      image: '/images/iphone.svg',
      link: '/products?category=electronics',
      count: '50+ Products',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Fashion',
      icon: '👕',
      image: '/images/tshirt.svg',
      link: '/products?category=fashion',
      count: '100+ Products',
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Mobiles',
      icon: '📱',
      image: '/images/samsung.svg',
      link: '/products?category=electronics&subcategory=mobiles',
      count: '25+ Products',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Audio',
      icon: '🎧',
      image: '/images/headphones.svg',
      link: '/products?category=electronics&subcategory=audio',
      count: '15+ Products',
      color: 'from-purple-500 to-violet-500'
    }
  ];

  // Sample products for different sections
  const sampleProducts = [
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
    }
  ];

  // Brands
  const brands = [
    { name: 'Apple', logo: '/images/iphone.svg' },
    { name: 'Samsung', logo: '/images/samsung.svg' },
    { name: 'Sony', logo: '/images/headphones.svg' },
    { name: 'Fashion', logo: '/images/tshirt.svg' }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Rahul Sharma',
      rating: 5,
      review: 'Amazing shopping experience! Fast delivery and excellent customer service.',
      avatar: 'RS'
    },
    {
      name: 'Priya Patel',
      rating: 5,
      review: 'Love the quality of products. Will definitely shop again!',
      avatar: 'PP'
    },
    {
      name: 'Amit Kumar',
      rating: 4,
      review: 'Great prices and easy returns. Highly recommended!',
      avatar: 'AK'
    }
  ];

  return (
    <div className="home-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: slide.bgImage }}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <div className="container">
                  <motion.div
                    className="hero-text"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div className="hero-badge">{slide.subtitle}</div>
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-description">{slide.description}</p>
                    <div className="hero-actions">
                      <Link to="/products" className="btn btn-primary btn-lg hero-cta">
                        {slide.cta}
                        <FiArrowRight />
                      </Link>
                      <button className="btn btn-outline btn-lg hero-video">
                        <FiPlay />
                        Watch Video
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Slider Controls */}
          <button className="slider-control prev" onClick={prevSlide}>
            <FiChevronLeft />
          </button>
          <button className="slider-control next" onClick={nextSlide}>
            <FiChevronRight />
          </button>

          {/* Slider Indicators */}
          <div className="slider-indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className={`feature-icon ${feature.color}`}>{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FLASH SALE SECTION ===== */}
      <section className="flash-sale-section">
        <div className="container">
          <div className="sale-header">
            <div className="sale-info">
              <FiZap className="sale-icon" />
              <div>
                <h2>Flash Sale</h2>
                <p>Up to 70% off on selected items</p>
              </div>
            </div>
            <div className="countdown-timer">
              <FiClock />
              <div className="timer">
                <span className="time-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="time-label">H</span>
              </div>
              <div className="timer">
                <span className="time-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="time-label">M</span>
              </div>
              <div className="timer">
                <span className="time-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="time-label">S</span>
              </div>
            </div>
          </div>

          <div className="sale-products">
            {sampleProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore our wide range of products</p>
          </div>

          <div className="categories-grid">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="category-card"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link to={category.link} className="category-link">
                  <div className={`category-bg bg-gradient-to-br ${category.color}`}>
                    <div className="category-icon">{category.icon}</div>
                  </div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{category.count}</p>
                    <span className="category-arrow"><FiArrowRight /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEALS SECTION ===== */}
      <section className="deals-section">
        <div className="container">
          <div className="deals-header">
            <h2>Today's Best Deals</h2>
            <Link to="/products" className="view-all-link">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="deals-grid">
            <div className="deal-banner">
              <div className="deal-content">
                <FiGift className="deal-icon" />
                <h3>Special Offer</h3>
                <p>Get 20% extra off on electronics</p>
                <Link to="/products?category=electronics" className="btn btn-primary">
                  Shop Electronics
                </Link>
              </div>
            </div>

            <div className="deal-products">
              {sampleProducts.slice(0, 3).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ x: 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRENDING PRODUCTS ===== */}
      <section className="trending-section">
        <div className="container">
          <div className="section-header">
            <h2><FiTrendingUp /> Trending Now</h2>
            <p>Most popular products this week</p>
          </div>

          <div className="trending-products">
            {sampleProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BRANDS SECTION ===== */}
      <section className="brands-section">
        <div className="container">
          <h2>Popular Brands</h2>
          <div className="brands-grid">
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="brand-card"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img src={brand.logo} alt={brand.name} />
                <span>{brand.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from satisfied customers</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="star filled" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.review}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <span className="author-name">{testimonial.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-info">
              <FiMail className="newsletter-icon" />
              <div>
                <h2>Stay Updated</h2>
                <p>Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.</p>
              </div>
            </div>

            <form className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="btn btn-primary newsletter-btn">
                  Subscribe
                </button>
              </div>
              <p className="newsletter-note">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="final-cta-section">
        <div className="container">
          <div className="final-cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>Join millions of satisfied customers and discover amazing products today.</p>
            <div className="cta-buttons">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
