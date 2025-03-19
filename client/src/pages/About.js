import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lottie from 'lottie-react';

// Import baker animation JSON
const bakerAnimation = {
  // This is a placeholder. In production, you would import actual Lottie JSON file
  v: "5.7.6",
  fr: 29.9700012207031,
  ip: 0,
  op: 180.00000733155,
  w: 512,
  h: 512,
  nm: "Baker Animation",
  ddd: 0,
  assets: [],
  layers: []
};

const About = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax effect for images
    gsap.utils.toArray('.parallax').forEach(section => {
      const image = section.querySelector('img');
      
      gsap.to(image, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }, []);

  const timelineEvents = [
    {
      year: '2010',
      title: 'Our Beginning',
      description: 'Started as a small home-based bakery with a passion for creating delicious cakes.'
    },
    {
      year: '2015',
      title: 'First Store Opening',
      description: 'Opened our first physical store, bringing our creations to a wider audience.'
    },
    {
      year: '2018',
      title: 'Award-Winning Creations',
      description: 'Recognized as the Best Cake Shop in the city, known for our unique designs.'
    },
    {
      year: '2020',
      title: 'Online Expansion',
      description: 'Launched our e-commerce platform to serve customers nationwide.'
    },
    {
      year: '2023',
      title: 'Growing Family',
      description: 'Expanded to multiple locations while maintaining our commitment to quality.'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="parallax absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg"
            alt="Bakery interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="font-['Playfair_Display'] text-5xl md:text-7xl font-bold mb-6"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto"
          >
            Crafting sweet memories since 2010
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                At Sweet Delights, we believe that every celebration deserves something special. 
                Our mission is to create not just cakes, but moments of joy that bring people together.
              </p>
              <p className="text-gray-600 text-lg">
                We take pride in using only the finest ingredients, combining traditional baking methods 
                with innovative designs to create unique and delicious masterpieces for your special occasions.
              </p>
            </div>
            <div className="relative h-[400px]">
              <Lottie
                animationData={bakerAnimation}
                className="w-full h-full"
                loop={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-center mb-16">
            Our Journey
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200"></div>
            
            {/* Timeline events */}
            {timelineEvents.map((event, index) => (
              <div
                key={event.year}
                className={`timeline-item relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`w-full md:w-5/12 ${
                    index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                  }`}
                >
                  <div className="card">
                    <span className="text-primary-500 font-bold text-xl mb-2 block">
                      {event.year}
                    </span>
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-center mb-16">
            Our Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="card text-center"
            >
              <i className="fas fa-heart text-4xl text-primary-500 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Passion</h3>
              <p className="text-gray-600">
                We pour our hearts into every creation, ensuring each cake is made with love and dedication.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="card text-center"
            >
              <i className="fas fa-gem text-4xl text-primary-500 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">
                Only the finest ingredients and attention to detail go into our products.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="card text-center"
            >
              <i className="fas fa-users text-4xl text-primary-500 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Building relationships and creating moments that bring people together.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;