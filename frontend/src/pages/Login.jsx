import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import axios from 'axios';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const response = await axios.post('http://localhost:3000/api/auth/signin', formData);

        const data = response.data;

        localStorage.setItem('authToken', `Bearer ${data.token}`);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        if (data.user.role === 'admin') {
        navigate('/dashboard');
        } else {
        navigate('/user-dashboard');
        }
    } catch (error) {
        setError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Login failed. Please try again.'
        );
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      <header className="bg-white border-b-4 border-orange-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <img src="/logo.png" alt="DRDO Logo" className="w-15 h-15 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">DRDO</h1>
                <p className="text-sm text-gray-600">Defence Research and Development Organisation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <img src="/govt.png" alt="DRDO Logo" className="w-15 h-15 object-contain" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">Government of India</p>
                <p className="text-xs text-gray-500">Ministry of Defence</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="bg-white rounded-lg shadow-2xl border-t-4 border-orange-500 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-800 to-blue-900 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Secure Login</h2>
            <p className="text-gray-600 text-sm">DRDO Form Management System</p>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white py-3 px-4 rounded-md font-semibold hover:from-blue-900 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg border-2 border-blue-900"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  LOGIN
                </div>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              This is a secure government system. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-2">DRDO</h3>
              <p className="text-sm text-gray-300">Defence Research and Development Organisation</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-sm text-gray-300">Ministry of Defence, Government of India</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Security</h3>
              <p className="text-sm text-gray-300">Classified System - Level II</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-400">
              DRDO - All rights reserved. This system is for authorized personnel only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
