import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Shield, User, MapPin, Phone, Calendar, Globe, Languages, Heart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
    alternateContact: '',
    permanentAddress: {
      house: '',
      street: '',
      ward: '',
      city: '',
      pin: ''
    },
    currentAddress: '',
    autoGeolocation: false,
    userType: 'Citizen',
    preferredLanguage: 'English',
    specialAssistance: '',
    consentInfo: false,
    consentPrivacy: false,
    consentNotifications: false
  });
  
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.mobileNumber || !formData.permanentAddress.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.consentInfo || !formData.consentPrivacy) {
      toast.error('Please accept the required consent terms');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        email: formData.email || 'user@gmail.com',
        role: 'citizen',
        name: formData.fullName,
        profile: formData
      };

      login(userData);
      toast.success('Registration successful! Welcome to Garun System.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Navigation Bar */}
      <nav className="relative z-10 flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Link to="/login" className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Garun System</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm">
            Home
          </Link>
          <Link to="/login" className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-300 border border-blue-200 text-sm">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200 mb-3">
              <MapPin className="w-3 h-3 text-blue-500 mr-1.5" />
              <span className="text-xs text-blue-700">Indore Municipal Corporation</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
                Create Account
              </span>
            </h2>
            <p className="text-sm text-gray-600">Join our grievance management platform</p>
          </div>

          {/* Signup Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {/* Personal Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
                  Personal Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-xs font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-xs font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="mobileNumber" className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                      Email ID
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="alternateContact" className="block text-xs font-medium text-gray-700 mb-1">
                      Alternate Contact
                    </label>
                    <input
                      type="tel"
                      id="alternateContact"
                      name="alternateContact"
                      value={formData.alternateContact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter alternate contact"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
                  Address Information
                </h4>
                
                <div className="space-y-3">
                  <h5 className="text-xs font-medium text-gray-700">Permanent Address *</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="house" className="block text-xs font-medium text-gray-700 mb-1">House/Flat Number</label>
                      <input
                        type="text"
                        id="house"
                        name="permanentAddress.house"
                        value={formData.permanentAddress.house}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="House/Flat number"
                      />
                    </div>
                    <div>
                      <label htmlFor="street" className="block text-xs font-medium text-gray-700 mb-1">Street/Area</label>
                      <input
                        type="text"
                        id="street"
                        name="permanentAddress.street"
                        value={formData.permanentAddress.street}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Street name and area"
                      />
                    </div>
                    <div>
                      <label htmlFor="ward" className="block text-xs font-medium text-gray-700 mb-1">Ward Number</label>
                      <input
                        type="text"
                        id="ward"
                        name="permanentAddress.ward"
                        value={formData.permanentAddress.ward}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ward number"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="permanentAddress.city"
                        value={formData.permanentAddress.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pin" className="block text-xs font-medium text-gray-700 mb-1">PIN Code</label>
                      <input
                        type="text"
                        id="pin"
                        name="permanentAddress.pin"
                        value={formData.permanentAddress.pin}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="6-digit PIN code"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="currentAddress" className="block text-xs font-medium text-gray-700 mb-1">
                      Current Address (if different)
                    </label>
                    <textarea
                      id="currentAddress"
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="2"
                      placeholder="Enter current address if different"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
                  Preferences & Settings
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="userType" className="block text-xs font-medium text-gray-700 mb-1">
                      User Type
                    </label>
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Citizen">Citizen</option>
                      <option value="NGO">NGO</option>
                      <option value="Govt Official">Government Official</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferredLanguage" className="block text-xs font-medium text-gray-700 mb-1">
                      Preferred Language
                    </label>
                    <select
                      id="preferredLanguage"
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Regional">Regional Language</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="specialAssistance" className="block text-xs font-medium text-gray-700 mb-1">
                    Special Assistance Needs
                  </label>
                  <textarea
                    id="specialAssistance"
                    name="specialAssistance"
                    value={formData.specialAssistance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    placeholder="Any special assistance requirements"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoGeolocation"
                    name="autoGeolocation"
                    checked={formData.autoGeolocation}
                    onChange={handleInputChange}
                    className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoGeolocation" className="text-xs text-gray-700">
                    Allow auto-geolocation for better service
                  </label>
                </div>
              </div>

              {/* Consent */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1">
                  Consent & Agreements
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="consentInfo"
                      name="consentInfo"
                      checked={formData.consentInfo}
                      onChange={handleInputChange}
                      className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                      required
                    />
                    <label htmlFor="consentInfo" className="text-xs text-gray-700">
                      I confirm that all information provided is true and correct
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="consentPrivacy"
                      name="consentPrivacy"
                      checked={formData.consentPrivacy}
                      onChange={handleInputChange}
                      className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                      required
                    />
                    <label htmlFor="consentPrivacy" className="text-xs text-gray-700">
                      I agree to the Privacy Policy and Terms of Service
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="consentNotifications"
                      name="consentNotifications"
                      checked={formData.consentNotifications}
                      onChange={handleInputChange}
                      className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                    />
                    <label htmlFor="consentNotifications" className="text-xs text-gray-700">
                      I agree to receive notifications via SMS and Email
                    </label>
                  </div>
                </div>
              </div>
            </form>

            {/* Submit Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg flex items-center justify-center space-x-2 group text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 underline decoration-blue-400/30 hover:decoration-blue-500/60">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Government Notice */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium text-blue-900">Official Government Platform</p>
                  <p className="mt-0.5">This is an authorized government grievance management system. Your data is secure and protected.</p>
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
        /* Custom scrollbar for the form */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Signup;
