import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui';

const Footer = () => {
  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Safety Center', href: '/safety' },
      { label: 'Community Guidelines', href: '/guidelines' }
    ],
    legal: [
      { label: 'Cookies Policy', href: '/cookies' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Law Enforcement', href: '/law-enforcement' }
    ],
    social: [
      { label: 'Instagram', href: 'https://instagram.com', icon: 'fab fa-instagram' },
      { label: 'Twitter', href: 'https://twitter.com', icon: 'fab fa-twitter' },
      { label: 'Facebook', href: 'https://facebook.com', icon: 'fab fa-facebook' },
      { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'fab fa-linkedin' }
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Subscribe to our newsletter
            </h3>
            <p className="text-gray-600 mb-6">
              Get the latest updates, news and product offers delivered right to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button
                variant="primary"
                className="whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </Button>
            </form>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1 * linkIndex + categoryIndex * 0.2
                      }}
                    >
                      <Link
                        to={link.href}
                        className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center gap-2"
                      >
                        {link.icon && <i className={link.icon} />}
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              <span className="text-gray-600">
                © {new Date().getFullYear()} Sweet Delights. All rights reserved.
              </span>
            </div>

            <div className="flex space-x-6">
              {footerLinks.social.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 260,
                    damping: 20
                  }}
                >
                  <i className={`${social.icon} text-xl`} />
                  <span className="sr-only">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <motion.div
            className="mt-8 flex justify-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <img src="/payment-methods.png" alt="Payment Methods" className="h-8" />
            <img src="/security-badges.png" alt="Security Badges" className="h-8" />
            <img src="/delivery-partners.png" alt="Delivery Partners" className="h-8" />
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;