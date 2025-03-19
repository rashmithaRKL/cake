import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Button, Card } from '../../components/ui';
import { fadeUpAnimation } from '../../utils/animations';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [salesData, setSalesData] = useState({
    daily: [],
    monthly: [],
    yearly: []
  });
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    lowStock: 0
  });
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    averageOrderValue: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch data from your API
      const response = await fetch('/api/admin/dashboard-stats');
      const data = await response.json();
      
      // Update state with fetched data
      setSalesData(data.salesData);
      setProductStats(data.productStats);
      setOrderStats(data.orderStats);
      setRevenueStats(data.revenueStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Chart configurations
  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: salesData.monthly,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const productCategoryData = {
    labels: ['Cakes', 'Cupcakes', 'Pastries', 'Cookies'],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ]
      }
    ]
  };

  const orderStatusData = {
    labels: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: 'Orders by Status',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ]
      }
    ]
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        variants={fadeUpAnimation}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
            <p className="text-3xl font-bold text-primary-600">
              ${revenueStats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {revenueStats.monthlyGrowth > 0 ? '+' : ''}{revenueStats.monthlyGrowth}% from last month
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-primary-600">
              {orderStats.totalOrders}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {orderStats.pendingOrders} pending orders
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Products</h3>
            <p className="text-3xl font-bold text-primary-600">
              {productStats.totalProducts}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {productStats.outOfStock} out of stock
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-700">Avg. Order Value</h3>
            <p className="text-3xl font-bold text-primary-600">
              ${revenueStats.averageOrderValue}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Per order average
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales Overview</h3>
            <Line data={salesChartData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Monthly Sales Trend'
                }
              }
            }} />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Orders by Status</h3>
            <Bar data={orderStatusData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Order Distribution'
                }
              }
            }} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Categories</h3>
            <div className="aspect-w-2 aspect-h-1">
              <Pie data={productCategoryData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  title: {
                    display: true,
                    text: 'Products by Category'
                  }
                }
              }} />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">New order received</p>
                    <p className="text-sm text-gray-500">Order #1234</p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="flex space-x-4">
            <Button variant="primary">Add New Product</Button>
            <Button variant="outline">View All Orders</Button>
            <Button variant="outline">Generate Report</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;