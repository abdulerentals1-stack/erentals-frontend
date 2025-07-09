'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ordersData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Orders',
      data: [50, 75, 120, 90, 140, 180],
      backgroundColor: '#3b82f6',
    },
  ],
};

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue (₹)',
      data: [50000, 72000, 85000, 69000, 91000, 105000],
      backgroundColor: '#10b981',
    },
  ],
};

export default function AdminDashboard() {
  const newProducts = [
    { name: 'MacBook Pro', date: 'Jun 28' },
    { name: 'iPhone 15', date: 'Jun 27' },
    { name: 'Canon DSLR', date: 'Jun 26' },
  ];

  const newOrders = [
    { user: 'Rahul Sharma', product: 'MacBook', date: 'Jun 28' },
    { user: 'Sneha Verma', product: 'iPhone 15', date: 'Jun 27' },
    { user: 'Amit Yadav', product: 'Canon DSLR', date: 'Jun 26' },
  ];

  const cancelledOrders = [
    { user: 'Sandeep', reason: 'Address not reachable', date: 'Jun 25' },
    { user: 'Kiran', reason: 'Payment failed', date: 'Jun 24' },
  ];

  return (
    <div className="p-6 space-y-6 mt-12 md:mt-0">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="font-medium mb-2">Monthly Orders</h3>
          <Bar data={ordersData} />
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="font-medium mb-2">Monthly Revenue</h3>
          <Bar data={revenueData} />
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Products */}
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="text-lg font-semibold mb-4">🆕 New Products</h3>
          <ul className="space-y-2 text-sm">
            {newProducts.map((p, i) => (
              <li key={i} className="flex justify-between text-gray-700">
                <span>{p.name}</span>
                <span className="text-gray-400">{p.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* New Orders */}
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="text-lg font-semibold mb-4">🛒 New Orders</h3>
          <ul className="space-y-2 text-sm">
            {newOrders.map((o, i) => (
              <li key={i} className="flex justify-between text-gray-700">
                <span>{o.user} — <span className="font-medium">{o.product}</span></span>
                <span className="text-gray-400">{o.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="text-lg font-semibold mb-4">❌ Cancelled Orders</h3>
          <ul className="space-y-2 text-sm">
            {cancelledOrders.map((c, i) => (
              <li key={i} className="text-gray-700">
                <div className="font-medium">{c.user}</div>
                <div className="text-xs text-red-500">{c.reason}</div>
                <div className="text-xs text-gray-400">{c.date}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Calendar (static preview) */}
      <div className="bg-white p-4 rounded shadow border">
        <h3 className="text-lg font-semibold mb-4">📅 Monthly Calendar</h3>
        <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                [5, 12, 20].includes(i + 1)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
