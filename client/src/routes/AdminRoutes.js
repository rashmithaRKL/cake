import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import ProductManagement from '../pages/admin/ProductManagement';
import OrderManagement from '../pages/admin/OrderManagement';

// Admin Guard Component
const AdminGuard = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Check if user is authenticated and has admin role
  if (!user || !user.email.endsWith('@admin.com')) { // You can implement your own admin check logic
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoutes = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="customers" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
              <p>Coming soon...</p>
            </div>
          } />
          <Route path="analytics" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Analytics</h1>
              <p>Coming soon...</p>
            </div>
          } />
          <Route path="settings" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Settings</h1>
              <p>Coming soon...</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminRoutes;