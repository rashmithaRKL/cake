import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import {
  buttonHoverAnimation,
  cardHoverAnimation,
  modalAnimation,
  dropdownAnimation,
  loadingAnimation
} from '../../utils/animations';

// Enhanced Button Component
export const Button = ({ children, className, variant = 'primary', isLoading, ...props }) => {
  const baseStyle = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <motion.button
      className={twMerge(baseStyle, variants[variant], className)}
      whileHover={buttonHoverAnimation}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.div
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          animate={loadingAnimation.animate}
        />
      ) : children}
    </motion.button>
  );
};

// Enhanced Card Component
export const Card = ({ children, className, ...props }) => {
  return (
    <motion.div
      className={twMerge(
        'bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200',
        className
      )}
      whileHover={cardHoverAnimation}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Modal Component
export const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className={twMerge(
          'relative bg-white rounded-xl shadow-xl p-6 m-4 max-w-lg w-full',
          className
        )}
        variants={modalAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Dropdown Component
export const Dropdown = ({ trigger, children, className }) => {
  return (
    <div className="relative">
      {trigger}
      <motion.div
        className={twMerge(
          'absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5',
          className
        )}
        variants={dropdownAnimation}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Tab Component
export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={twMerge(
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
            onClick={() => onChange(tab.id)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ className }) => {
  return (
    <motion.div
      className={twMerge('w-8 h-8 border-4 border-primary-500 rounded-full', className)}
      style={{ borderTopColor: 'transparent' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

// Toast Notification Component
export const Toast = ({ message, type = 'success', onClose }) => {
  const types = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <motion.div
      className={twMerge(
        'fixed top-4 right-4 px-6 py-3 rounded-lg text-white shadow-lg',
        types[type]
      )}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
    >
      <div className="flex items-center space-x-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 hover:opacity-80">
          ×
        </button>
      </div>
    </motion.div>
  );
};

// Badge Component
export const Badge = ({ children, variant = 'primary', className }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

// Avatar Component
export const Avatar = ({ src, alt, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <motion.img
      src={src}
      alt={alt}
      className={twMerge(
        'rounded-full object-cover',
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.1 }}
    />
  );
};

// Input Component
export const Input = ({ className, error, ...props }) => {
  return (
    <div className="space-y-1">
      <input
        className={twMerge(
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Checkbox Component
export const Checkbox = ({ label, className, ...props }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className={twMerge(
          'w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500',
          className
        )}
        {...props}
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
};

// Progress Bar Component
export const ProgressBar = ({ progress, className }) => {
  return (
    <div className={twMerge('w-full bg-gray-200 rounded-full h-2', className)}>
      <motion.div
        className="bg-primary-600 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};