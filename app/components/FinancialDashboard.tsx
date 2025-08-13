"use client"

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, ScatterChart, Scatter, Cell
} from 'recharts';
import { 
  Menu, Bell, User, TrendingUp, TrendingDown, Eye, 
  Sun, Moon, BarChart3, PieChart, Users, CreditCard 
} from 'lucide-react';

// Mock data
const aumData = { value: '₹2,45,67,890', change: '+12.5%', isPositive: true };
const sipData = { value: '₹45,23,567', change: '-2.3%', isPositive: false };

const statCards = [
  { title: 'Purchases', value: '₹12,34,567', count: '143' },
  { title: 'Redemptions', value: '₹8,45,123', count: '89' },
  { title: 'Rejected Transactions', value: '₹1,23,456', count: '12' },
  { title: 'SIP Rejections', value: '₹45,678', count: '8' },
  { title: 'New SIP', value: '₹23,45,678', count: '67' }
];

const clientsData = [
  { x: 10, y: 20, z: 300, name: 'Mumbai' },
  { x: 25, y: 35, z: 200, name: 'Delhi' },
  { x: 40, y: 15, z: 400, name: 'Bangalore' },
  { x: 60, y: 45, z: 150, name: 'Chennai' },
  { x: 75, y: 25, z: 250, name: 'Kolkata' }
];

const sipBusinessData = [
  { month: 'Jan', sip: 12000, business: 15000 },
  { month: 'Feb', sip: 15000, business: 18000 },
  { month: 'Mar', sip: 18000, business: 22000 },
  { month: 'Apr', sip: 14000, business: 19000 },
  { month: 'May', sip: 20000, business: 25000 },
  { month: 'Jun', sip: 22000, business: 28000 }
];

const monthlyMisData = [
  { month: 'Jan', mutual: 5000, insurance: 3000, assets: 4000 },
  { month: 'Feb', mutual: 6000, insurance: 3500, assets: 4500 },
  { month: 'Mar', mutual: 7000, insurance: 4000, assets: 5000 },
  { month: 'Apr', mutual: 6500, insurance: 3800, assets: 4800 },
  { month: 'May', mutual: 8000, insurance: 4200, assets: 5500 },
  { month: 'Jun', mutual: 9000, insurance: 4500, assets: 6000 }
];

const navItems = [
  'CRM', 'Utilities', 'Insurance', 'Assets', 'Mutual', 
  'Research', 'Transact Online', 'Goal GPS', 
  'Financial Planning', 'Wealth Report', 'Other'
];

const timeRanges = ['3 Days', '7 Days', '10 Days', '30 Days'];

const FinancialDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState('30 Days');
  const [loading, setLoading] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTimeRangeChange = async (range) => {
    setLoading(true);
    setActiveTimeRange(range);
    // Simulate API call
    setTimeout(() => setLoading(false), 800);
  };

  const theme = darkMode ? 'dark' : '';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">FinDash</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Bell className="h-5 w-5 cursor-pointer" />
            <User className="h-5 w-5 cursor-pointer" />
            <Menu className="h-5 w-5 cursor-pointer lg:hidden" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AUM</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{aumData.value}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${aumData.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  MoM {aumData.change}
                </span>
                <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>View Report</span>
                </button>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">SIP</h3>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{sipData.value}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${sipData.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  MoM {sipData.change}
                </span>
                <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span>View Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                  ${activeTimeRange === range 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : darkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {statCards.map((card, index) => (
            <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm`}>
              <h4 className="text-sm font-medium text-gray-500 mb-2">{card.title}</h4>
              <p className="text-xl font-bold mb-1">{card.value}</p>
              <p className="text-sm text-gray-400">{card.count} transactions</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Clients Bubble Chart */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm col-span-1`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Clients Distribution
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart data={clientsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                      color: darkMode ? '#f9fafb' : '#111827'
                    }}
                  />
                  <Scatter dataKey="z" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* SIP Business Chart */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm col-span-1`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              SIP Business
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={sipBusinessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                      color: darkMode ? '#f9fafb' : '#111827'
                    }}
                  />
                  <Bar dataKey="sip" fill="#3b82f6" />
                  <Line type="monotone" dataKey="business" stroke="#ef4444" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Monthly MIS Chart */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm col-span-1 lg:col-span-2 xl:col-span-1`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Monthly MIS
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyMisData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                      color: darkMode ? '#f9fafb' : '#111827'
                    }}
                  />
                  <Line type="monotone" dataKey="mutual" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="insurance" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="assets" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;