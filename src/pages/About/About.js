import React from 'react';
import { FiAward, FiUsers, FiTrendingUp, FiShield, FiHeart, FiGlobe, FiTarget, FiStar } from 'react-icons/fi';

const About = () => {
  const stats = [
    { icon: <FiUsers />, value: '10,000+', label: 'Happy Customers' },
    { icon: <FiAward />, value: '50+', label: 'Products' },
    { icon: <FiTrendingUp />, value: '95%', label: 'Satisfaction Rate' },
    { icon: <FiGlobe />, value: '25+', label: 'Cities Served' }
  ];

  const values = [
    {
      icon: <FiShield />,
      title: 'Quality Assurance',
      description: 'We ensure every product meets the highest quality standards before reaching our customers.'
    },
    {
      icon: <FiHeart />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We provide exceptional service and support around the clock.'
    },
    {
      icon: <FiTarget />,
      title: 'Innovation',
      description: 'We continuously innovate to bring you the latest technology and best shopping experience.'
    },
    {
      icon: <FiStar />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from product selection to customer service.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjM0I4MkY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0yMCA3NVEyMCA2NSA0MCA2NVE2MCA2NSA2MCA3NVY4NUgxMFY3NVoiIGZpbGw9IiNmZmZmZmYiLz4KPHRleHQgeD0iNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TRSZ0L3RleHQ+Cjwvc3ZnPg==',
      bio: 'Visionary leader with 15+ years in e-commerce and technology.'
    },
    {
      name: 'Mike Chen',
      role: 'Head of Products',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjMTBINjgxIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0yMCA3NVEyMCA2NSA0MCA2NVE2MCA2NSA2MCA3NVY4NUgxMFY3NVoiIGZpbGw9IiNmZmZmZmYiLz4KPHRleHQgeD0iNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NQzwvdGV4dD4KPHN2Zz4K',
      bio: 'Product expert ensuring we offer only the best technology and gadgets.'
    },
    {
      name: 'Emily Davis',
      role: 'Customer Success Manager',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjRUI0Njg5Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0yMCA3NVEyMCA2NSA0MCA2NVE2MCA2NSA2MCA3NVY4NUgxMFY3NVoiIGZpbGw9IiNmZmZmZmYiLz4KPHRleHQgeD0iNTAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FRDwvdGV4dD4KPHN2Zz4K',
      bio: 'Dedicated to ensuring every customer has an amazing shopping experience.'
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <div className="about-hero">
          <div className="hero-content">
            <h1>About ShopSmart</h1>
            <p className="hero-subtitle">
              Your trusted destination for premium electronics, fashion, and lifestyle products.
              We're passionate about bringing you the best shopping experience with quality,
              innovation, and exceptional service.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                To revolutionize online shopping by providing an unparalleled selection of premium products,
                seamless user experience, and exceptional customer service. We believe that shopping should
                be enjoyable, convenient, and trustworthy.
              </p>
              <p>
                Founded in 2020, ShopSmart has grown from a small startup to a leading e-commerce platform,
                serving thousands of satisfied customers across the country. Our commitment to quality,
                innovation, and customer satisfaction drives everything we do.
              </p>
            </div>
            <div className="mission-image">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IiMyNTYzZWIiIG9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSIyNDAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSIjMTBCOTgxIiBvcGFjaXR5PSIwLjA4Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjIwMCIgcj0iMzUiIGZpbGw9IiNGNTlFMEIiIG9wYWNpdHk9IjAuMDYiLz4KPHRleHQgeD0iMjAwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TWlzc2lvbiZuYnNwOyYjeDc5ODg7PC90ZXh0Pgo8L3N2Zz4K"
                alt="Our Mission"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="values-section">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>What drives us to deliver excellence every day</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>The passionate people behind ShopSmart</p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="story-section">
          <div className="story-content">
            <h2>Our Story</h2>
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h4>The Beginning</h4>
                  <p>ShopSmart was founded with a vision to make online shopping simple, trustworthy, and enjoyable for everyone.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2021</div>
                <div className="timeline-content">
                  <h4>Growth & Innovation</h4>
                  <p>Expanded our product catalog and introduced innovative features like real-time inventory and personalized recommendations.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2022</div>
                <div className="timeline-content">
                  <h4>Customer Excellence</h4>
                  <p>Achieved 95% customer satisfaction rate and expanded to serve customers in 25+ cities across India.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2023</div>
                <div className="timeline-content">
                  <h4>Future Forward</h4>
                  <p>Continuing to innovate and grow, with plans for new categories, improved technology, and enhanced customer experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Shop with Us?</h2>
            <p>Discover amazing products and enjoy a seamless shopping experience.</p>
            <div className="cta-buttons">
              <a href="/products" className="btn btn-primary">Shop Now</a>
              <a href="/contact" className="btn btn-outline">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
