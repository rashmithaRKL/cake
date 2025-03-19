import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-['Playfair_Display'] font-bold text-primary-600"
            >
              Sweet Delights
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <i className="fas fa-shopping-cart text-xl text-gray-600 hover:text-primary-500 transition-colors duration-300"></i>
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </motion.div>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Sign In
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary-500 focus:outline-none"
            >
              <i className={`fas fa-${isOpen ? 'times' : 'bars'} text-2xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="flex flex-col space-y-4 pb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-lg font-medium transition-colors duration-300 ${
                      location.pathname === link.path
                        ? 'text-primary-600'
                        : 'text-gray-600 hover:text-primary-500'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/cart" className="flex items-center space-x-2">
                  <i className="fas fa-shopping-cart text-xl text-gray-600"></i>
                  <span>Cart (0)</span>
                </Link>
                <Link to="/login">
                  <button className="w-full btn-primary">Sign In</button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;