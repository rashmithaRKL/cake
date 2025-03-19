import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Toast } from '../components/ui';
import { fadeUpAnimation } from '../utils/animations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowToast(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    setTimeout(() => setShowToast(false), 3000);
  };

  const contactInfo = [
    {
      icon: '📞',
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      action: 'Call us',
    },
    {
      icon: '📧',
      title: 'Email',
      details: ['info@sweetdelights.com', 'support@sweetdelights.com'],
      action: 'Write to us',
    },
    {
      icon: '📍',
      title: 'Location',
      details: ['123 Bakery Street', 'Sweet City, SC 12345'],
      action: 'Visit us',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative py-20 bg-primary-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-black opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
          />
          <motion.img
            src="/contact-hero.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            variants={fadeUpAnimation}
            initial="initial"
            animate="animate"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-xl text-white max-w-3xl mx-auto"
            variants={fadeUpAnimation}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            We'd love to hear from you. Let us know how we can help.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
                variants={fadeUpAnimation}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 * index }}
              >
                <div className="text-4xl mb-4">{info.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600">{detail}</p>
                ))}
                <Button
                  variant="outline"
                  className="mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {info.action}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeUpAnimation}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={fadeUpAnimation}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              rows="6"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            />

            <div className="text-center">
              <Button
                type="submit"
                variant="primary"
                className="px-8 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white rounded-lg shadow-sm overflow-hidden"
            variants={fadeUpAnimation}
            initial="initial"
            animate="animate"
          >
            <iframe
              title="location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-73.123456!3d40.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zIDEyLjM0NiJOIDczwrAwNy40MDciVw!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message="Message sent successfully! We'll get back to you soon."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Contact;