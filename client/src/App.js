import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';
import AdminRoutes from './routes/AdminRoutes';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import { Toast } from './components/ui';
import LoadingScreen from './components/LoadingScreen';

const App = () => {
  const [user, loading] = useAuthState(auth);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        console.log('User is signed in:', user.email);
      } else {
        // User is signed out
        console.log('User is signed out');
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const showToastMessage = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/" replace /> : <Login showToast={showToastMessage} />
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? <Navigate to="/" replace /> : <Register showToast={showToastMessage} />
            } 
          />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart showToast={showToastMessage} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout showToast={showToastMessage} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/*"
            element={
              <ProtectedRoute>
                <Profile showToast={showToastMessage} />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={<AdminRoutes />}
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Toast Notifications */}
        {showToast.show && (
          <Toast
            message={showToast.message}
            type={showToast.type}
            onClose={() => setShowToast({ show: false, message: '', type: '' })}
          />
        )}
      </div>
    </Router>
  );
};

export default App;