import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, Shield, User, Lock, ArrowRight, CheckCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const allowedEmails = ['user@gmail.com', 'admin@gmail.com', 'incharge@gmail.com'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!allowedEmails.includes(formData.email)) {
      toast.error('Access denied. Only authorized users can login.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        email: formData.email,
        role: formData.email === 'admin@gmail.com' ? 'admin' : 
              formData.email === 'incharge@gmail.com' ? 'incharge' : 'citizen',
        name: formData.email === 'admin@gmail.com' ? 'Administrator' : 
              formData.email === 'incharge@gmail.com' ? 'Department Incharge' : 'Citizen User'
      };

      login(userData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Navigation Bar */}
      <nav className="relative z-10 flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-gray-800">Garun System</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-300">
            Home
          </Link>
          <Link to="/signup" className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-300 border border-blue-200 text-sm">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Hero Section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200 mb-4">
              <MapPin className="w-3 h-3 text-blue-500 mr-1.5" />
              <span className="text-xs text-blue-700">Indore Municipal Corporation</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 transform hover:scale-[1.01] transition-all duration-500">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Sign In
              </h2>
              <p className="text-sm text-gray-600">
                Access your secure government portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:bg-gray-100 text-sm"
                    placeholder="Enter your email"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:bg-gray-100 text-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg flex items-center justify-center space-x-2 group text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                New to Garun System?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 underline decoration-blue-400/30 hover:decoration-blue-500/60">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Government Notice */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium text-blue-900">Official Government Platform</p>
                  <p className="mt-0.5">This is an authorized government grievance management system. Only registered users can access.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute top-1/4 right-10 w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-1/4 left-10 w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform:translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }

        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Login;
