import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui';
import { cardHoverAnimation, imageHoverAnimation } from '../utils/animations';

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden"
      variants={cardHoverAnimation}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-w-4 aspect-h-3 overflow-hidden">
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-gray-200 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          variants={imageHoverAnimation}
          initial="initial"
          animate="animate"
          onLoad={handleImageLoad}
        />

        {/* Quick View Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="primary"
                className="transform -translate-y-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Quick View
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link to={`/products/${product.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        </motion.div>

        <div className="mt-4 flex items-center justify-between">
          <motion.span
            className="text-lg font-bold text-primary-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            ${product.price}
          </motion.span>

          {product.stock > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Add to Cart</span>
              </Button>
            </motion.div>
          ) : (
            <span className="text-red-500 text-sm font-medium">Out of Stock</span>
          )}
        </div>

        {/* Tags/Categories */}
        <div className="mt-4 flex flex-wrap gap-2">
          {product.categories?.map((category, index) => (
            <motion.span
              key={category}
              className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              {category}
            </motion.span>
          ))}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <motion.svg
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviewCount} reviews)
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;