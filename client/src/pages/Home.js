import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const Home = () => {
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline();
    
    tl.from(heroRef.current.querySelector('.hero-title'), {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    })
    .from(heroRef.current.querySelector('.hero-subtitle'), {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    }, '-=0.5')
    .from(heroRef.current.querySelector('.hero-cta'), {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out'
    }, '-=0.5');

    // Initialize scroll animations
    gsap.utils.toArray('.scroll-reveal').forEach(element => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });
  }, []);

  const featuredProducts = [
    {
      id: 1,
      name: 'Birthday Special Cake',
      image: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg',
      price: 49.99,
      category: 'birthday'
    },
    {
      id: 2,
      name: 'Wedding Elegance',
      image: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg',
      price: 149.99,
      category: 'wedding'
    },
    {
      id: 3,
      name: 'Custom Party Cake',
      image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg',
      price: 79.99,
      category: 'custom'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="hero-title font-['Playfair_Display'] text-5xl md:text-7xl font-bold mb-6">
            Sweet Moments, <br />
            Perfect Celebrations
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Crafting delicious cakes and beautiful decorations for your special occasions
          </p>
          <motion.div
            className="hero-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/products" className="btn-primary text-lg">
              Explore Our Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="scroll-reveal text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-center mb-16">
            Featured Creations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="scroll-reveal card group"
                whileHover={{ y: -10 }}
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-primary-600 font-semibold mb-4">${product.price}</p>
                <Link
                  to={`/products/${product.id}`}
                  className="inline-block btn-secondary w-full text-center"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="scroll-reveal text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-center mb-16">
            Why Choose Sweet Delights?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="scroll-reveal card text-center">
              <i className="fas fa-birthday-cake text-4xl text-primary-500 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Custom Designs</h3>
              <p className="text-gray-600">
                Personalized cakes crafted to match your unique style and occasion
              </p>
            </div>
            
            <div className="scroll-reveal card text-center">
              <i className="fas fa-star text-4xl text-primary-500 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Using only the finest ingredients for exceptional taste and freshness
              </p>
            </div>
            
            <div className="scroll-reveal card text-center">
              <i className="fas fa-truck text-4xl text-primary-500 mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">On-Time Delivery</h3>
              <p className="text-gray-600">
                Reliable delivery service to ensure your celebrations go as planned
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-primary-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="scroll-reveal text-4xl md:text-5xl font-['Playfair_Display'] font-bold mb-6">
            Ready to Make Your Celebration Special?
          </h2>
          <p className="scroll-reveal text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let us help you create unforgettable moments with our delicious cakes and beautiful decorations
          </p>
          <motion.div
            className="scroll-reveal"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/contact" className="btn-primary text-lg">
              Contact Us Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;