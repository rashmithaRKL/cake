import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { fadeUpAnimation } from '../utils/animations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui';

const About = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Master Baker',
      image: '/team/sarah.jpg',
      description: 'With over 15 years of experience in pastry arts.',
    },
    {
      name: 'Michael Chen',
      role: 'Creative Director',
      image: '/team/michael.jpg',
      description: 'Award-winning cake designer and decorator.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Experience',
      image: '/team/emily.jpg',
      description: 'Ensuring every order exceeds expectations.',
    },
  ];

  const milestones = [
    {
      year: '2010',
      title: 'Founded',
      description: 'Started our journey in a small kitchen with big dreams.',
    },
    {
      year: '2015',
      title: 'Expansion',
      description: 'Opened our first flagship store in the city center.',
    },
    {
      year: '2018',
      title: 'Award Winning',
      description: 'Recognized as the Best Bakery of the Year.',
    },
    {
      year: '2023',
      title: 'Going Digital',
      description: 'Launched our online ordering platform.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative py-20 bg-primary-600 overflow-hidden"
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
            src="/about-hero.jpg"
            alt="About Us"
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
            Our Story
          </motion.h1>
          <motion.p
            className="text-xl text-white max-w-3xl mx-auto"
            variants={fadeUpAnimation}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            Crafting sweet moments and delightful memories since 2010
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={controls}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At Sweet Delights, we believe that every celebration deserves the perfect cake. 
                Our mission is to create not just desserts, but memorable experiences that bring 
                joy to our customers' special moments.
              </p>
              <p className="text-gray-600 mb-8">
                We combine traditional baking methods with innovative techniques, using only the 
                finest ingredients to ensure every bite is pure delight.
              </p>
              <Button
                variant="primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </Button>
            </motion.div>
            <motion.div
              className="relative h-96"
              initial={{ opacity: 0, x: 50 }}
              animate={controls}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="/mission-image.jpg"
                alt="Our Mission"
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600">The passionate people behind our delicious creations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-gray-50 rounded-lg overflow-hidden"
                variants={fadeUpAnimation}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 * index }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600">Key milestones in our sweet adventure</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className="relative p-6 bg-white rounded-lg shadow-sm"
                variants={fadeUpAnimation}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 * index }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{milestone.year}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">{milestone.title}</h3>
                <p className="text-gray-600">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌟',
                title: 'Quality',
                description: 'We never compromise on ingredients or preparation methods.',
              },
              {
                icon: '💝',
                title: 'Passion',
                description: 'Every creation is made with love and attention to detail.',
              },
              {
                icon: '🤝',
                title: 'Service',
                description: 'Customer satisfaction is at the heart of our business.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center p-6"
                variants={fadeUpAnimation}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 * index }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;