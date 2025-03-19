import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '/careers' },
      { label: 'Blog', path: '/blog' },
    ],
    shop: [
      { label: 'Birthday Cakes', path: '/products?category=birthday' },
      { label: 'Wedding Cakes', path: '/products?category=wedding' },
      { label: 'Custom Cakes', path: '/products?category=custom' },
      { label: 'Party Decorations', path: '/products?category=decorations' },
    ],
    support: [
      { label: 'FAQs', path: '/faqs' },
      { label: 'Shipping Info', path: '/shipping' },
      { label: 'Returns', path: '/returns' },
      { label: 'Order Status', path: '/order-tracking' },
    ],
    social: [
      { label: 'Facebook', icon: 'fab fa-facebook', url: 'https://facebook.com' },
      { label: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com' },
      { label: 'Pinterest', icon: 'fab fa-pinterest', url: 'https://pinterest.com' },
      { label: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com' },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-primary-600">
                Sweet Delights
              </h2>
            </Link>
            <p className="mt-4 text-gray-600 max-w-md">
              Crafting moments of joy through delicious cakes and beautiful party decorations. 
              Making your special occasions unforgettable since 2010.
            </p>
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Newsletter</h3>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field flex-grow"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary whitespace-nowrap"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-500 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-500 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary-500 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Sweet Delights. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {footerLinks.social.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-600 hover:text-primary-500 transition-colors duration-300"
                >
                  <i className={`${social.icon} text-xl`}></i>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;