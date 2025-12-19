import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageCircle, FiHeadphones, FiUser, FiAtSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: <FiPhone />,
      title: 'Phone Support',
      details: ['+1 (555) 123-4567', '+1 (555) 123-4568'],
      description: 'Mon-Fri 9AM-6PM IST'
    },
    {
      icon: <FiMail />,
      title: 'Email Support',
      details: ['support@shopsmart.com', 'sales@shopsmart.com'],
      description: 'We respond within 24 hours'
    },
    {
      icon: <FiMapPin />,
      title: 'Head Office',
      details: ['123 Commerce Street', 'Business City, ABC 12345', 'India'],
      description: 'Visit us for in-person support'
    },
    {
      icon: <FiClock />,
      title: 'Business Hours',
      details: ['Mon-Fri: 9AM-6PM', 'Sat: 10AM-4PM', 'Sun: Closed'],
      description: 'Timezone: IST (UTC+5:30)'
    }
  ];

  const offices = [
    {
      city: 'Mumbai',
      address: '123 MG Road, Bandra West, Mumbai - 400050',
      phone: '+91 22 1234 5678',
      email: 'mumbai@shopsmart.com'
    },
    {
      city: 'Delhi',
      address: '456 Connaught Place, New Delhi - 110001',
      phone: '+91 11 2345 6789',
      email: 'delhi@shopsmart.com'
    },
    {
      city: 'Bangalore',
      address: '789 Brigade Road, Bangalore - 560025',
      phone: '+91 80 3456 7890',
      email: 'bangalore@shopsmart.com'
    }
  ];

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days delivery.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day return policy for most items. Items must be in original condition with all accessories and packaging.'
    },
    {
      question: 'Do you offer warranty?',
      answer: 'Yes, all our products come with manufacturer warranty. Electronics have 1-2 year warranty, fashion items have 6 months.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track orders from your account dashboard.'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Hero Section */}
        <div className="contact-hero">
          <div className="hero-content">
            <h1>Contact Us</h1>
            <p className="hero-subtitle">
              We'd love to hear from you. Get in touch with our team for any questions,
              feedback, or support you need.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="contact-info-section">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="info-icon">{info.icon}</div>
                <div className="info-content">
                  <h3>{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="info-detail">{detail}</p>
                  ))}
                  <p className="info-description">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <FiUser />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <FiAtSign />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  <FiMessageCircle />
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="What can we help you with?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  <FiSend />
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
                <FiSend />
              </button>
            </form>
          </div>

          {/* Quick Help & Offices */}
          <div className="contact-sidebar">
            {/* Quick Help */}
            <div className="quick-help-card">
              <div className="help-header">
                <FiHeadphones />
                <h3>Need Quick Help?</h3>
              </div>
              <div className="help-content">
                <p>Check our FAQ section for instant answers to common questions.</p>
                <a href="#faq" className="btn btn-outline">View FAQ</a>
              </div>
            </div>

            {/* Office Locations */}
            <div className="offices-card">
              <h3>Our Offices</h3>
              <div className="offices-list">
                {offices.map((office, index) => (
                  <div key={index} className="office-item">
                    <h4>{office.city}</h4>
                    <div className="office-details">
                      <p><FiMapPin /> {office.address}</p>
                      <p><FiPhone /> {office.phone}</p>
                      <p><FiMail /> {office.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="faq-section">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about our products and services.</p>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <div className="map-header">
            <h2>Visit Our Headquarters</h2>
            <p>Located in the heart of Business City, easily accessible by all major transport.</p>
          </div>

          <div className="map-container">
            {/* Placeholder for map - in real app, integrate Google Maps or similar */}
            <div className="map-placeholder">
              <FiMapPin className="map-icon" />
              <div className="map-content">
                <h3>ShopSmart Headquarters</h3>
                <p>123 Commerce Street, Business City, ABC 12345, India</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Email: info@shopsmart.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="contact-cta">
          <div className="cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>Browse our wide selection of premium products and enjoy exceptional service.</p>
            <a href="/products" className="btn btn-primary">Shop Now</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
