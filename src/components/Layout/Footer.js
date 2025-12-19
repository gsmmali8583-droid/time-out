import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3>ShopSmart</h3>
            <p>
              Your trusted e-commerce destination for quality products at unbeatable prices. 
              We're committed to providing exceptional shopping experiences with fast delivery 
              and outstanding customer service.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <FiPhone />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FiMail />
                <span>support@shopsmart.com</span>
              </div>
              <div className="contact-item">
                <FiMapPin />
                <span>123 Commerce St, Business City, ABC 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h3>Customer Service</h3>
            <ul className="footer-links">
              <li><Link to="/shipping-info">Shipping Information</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/track-order">Track Your Order</Link></li>
              <li><Link to="/customer-support">Customer Support</Link></li>
              <li><Link to="/warranty">Warranty</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
              <li><Link to="/security">Security</Link></li>
              <li><Link to="/compliance">Compliance</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="footer-section">
            <h3>Stay Connected</h3>
            <p>Subscribe to our newsletter for exclusive deals and updates.</p>
            <form className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </div>
            </form>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FiFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FiTwitter />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FiInstagram />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FiLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {currentYear} ShopSmart. All rights reserved.</p>
          </div>
          
          <div className="footer-bottom-center">
            <div className="payment-methods">
              <span>We Accept:</span>
              <div className="payment-icons">
                <img src="/images/visa.png" alt="Visa" />
                <img src="/images/mastercard.png" alt="Mastercard" />
                <img src="/images/paypal.png" alt="PayPal" />
                <img src="/images/amex.png" alt="American Express" />
              </div>
            </div>
          </div>

          <div className="footer-bottom-right">
            <div className="certifications">
              <img src="/images/ssl-secure.png" alt="SSL Secure" />
              <img src="/images/trusted-site.png" alt="Trusted Site" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;