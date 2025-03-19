import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a submission
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Visit Us',
      content: '123 Cake Street, Sweet City, SC 12345'
    },
    {
      icon: 'fas fa-phone',
      title: 'Call Us',
      content: '+1 (555) 123-4567'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email Us',
      content: 'hello@sweetdelights.com'
    },
    {
      icon: 'fas fa-clock',
      title: 'Opening Hours',
      content: 'Mon - Sat: 9:00 AM - 8:00 PM'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-primary-50">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center px-4"
        >
          <h1 className="font-['Playfair_Display'] text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Let us know how we can help make your celebration special.
          </p>
        </motion.div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center"
              >
                <i className={`${info.icon} text-3xl text-primary-500 mb-4`}></i>
                <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map and Contact Form */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="h-[500px] rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Store Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596698663!2d-74.25987368715491!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1656805997615!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Contact Form */}
            <div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="card"
              >
                <h2 className="font-['Playfair_Display'] text-3xl font-bold mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="name">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="subject">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="input-field"
                      required
                    ></textarea>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Send Message
                  </motion.button>
                </form>

                {/* Success Message */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg text-center"
                    >
                      Thank you for your message! We'll get back to you soon.
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-12">
            Connect With Us
          </h2>
          <div className="flex justify-center space-x-8">
            {['facebook', 'instagram', 'twitter', 'pinterest'].map((platform) => (
              <motion.a
                key={platform}
                href={`https://${platform}.com`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-3xl text-gray-600 hover:text-primary-500 transition-colors duration-300"
              >
                <i className={`fab fa-${platform}`}></i>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;