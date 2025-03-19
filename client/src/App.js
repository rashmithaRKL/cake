import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const OrderTracking = React.lazy(() => import('./pages/OrderTracking'));
const Profile = React.lazy(() => import('./pages/Profile'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  useEffect(() => {
    // Initialize GSAP animations
    const initGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
      gsap.registerPlugin(ScrollTrigger);

      // Animate elements with scroll-reveal class
      gsap.utils.toArray('.scroll-reveal').forEach(element => {
        ScrollTrigger.create({
          trigger: element,
          start: 'top 80%',
          onEnter: () => element.classList.add('active'),
        });
      });
    };

    initGSAP();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <React.Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;