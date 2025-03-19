import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { fadeUpAnimation, initScrollAnimations } from '../utils/animations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const controls = useAnimation();

  useEffect(() => {
    initScrollAnimations();
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-black opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
          />
          <motion.img
            src="/hero-bg.jpg"
            alt="Background"
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-4xl sm:text-6xl font-bold text-white mb-6"
            variants={fadeUpAnimation}
            initial="initial"
            animate="animate"
          >
            Sweet Moments, Perfect Celebrations
          </motion.h1>
          <motion.p
            className="text-xl text-white mb-8"
            variants={fadeUpAnimation}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            Discover our handcrafted cakes and desserts
          </motion.p>
          <motion.div
            variants={fadeUpAnimation}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="primary"
              className="text-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Our Collection
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </motion.section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Handpicked selections just for you</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                variants={fadeUpAnimation}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 * index }}
              >
                <ProductCard
                  product={{
                    id: index + 1,
                    name: 'Delicious Cake',
                    description: 'A perfect blend of flavors that melts in your mouth.',
                    price: 29.99,
                    image: '/cake-image.jpg',
                    categories: ['Birthday', 'Chocolate'],
                    rating: 4.5,
                    reviewCount: 128,
                    stock: 10
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600">What makes our cakes special</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎂',
                title: 'Fresh Ingredients',
                description: 'We use only the finest and freshest ingredients in all our products.'
              },
              {
                icon: '🚚',
                title: 'Fast Delivery',
                description: 'Same day delivery available for orders placed before 2 PM.'
              },
              {
                icon: '⭐',
                title: 'Custom Orders',
                description: 'Create your perfect cake with our customization options.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-lg bg-gray-50"
                variants={fadeUpAnimation}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 * index }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Order Your Perfect Cake?
            </h2>
            <p className="text-white text-opacity-90 mb-8">
              Join thousands of satisfied customers who trust us with their celebrations.
            </p>
            <Button
              variant="secondary"
              className="text-primary-600 bg-white hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Order Now
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;