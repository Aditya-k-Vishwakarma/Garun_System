import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  FileText, 
  MapPin, 
  Upload, 
  Search, 
  MessageSquare, 
  User, 
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Bell,
  Eye,
  Calendar,
  Phone,
  Mail,
  Home,
  Building,
  FileCheck,
  MessageCircle,
  Download,
  Share2,
  RefreshCw,
  Shield,
  Activity,
  BarChart3,
  Settings,
  HelpCircle,
  Zap,
  FileBarChart,
  Building2,
  AlertCircle,
  Users,
  Map,
  Globe,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import AuthContext from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const CitizenDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [error, setError] = useState(null);
  const [statsAnimation, setStatsAnimation] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Enhanced fetch function with better error handling
  const fetchDashboardData = useCallback(async (showToast = false) => {
    if (!user?.contactNumber) {
      console.log('No user contact number available');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`http://localhost:8000/api/dashboard/stats/${user.contactNumber}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setDashboardData(statsData.stats);
        
        // Trigger stats animation
        setStatsAnimation(true);
        setTimeout(() => setStatsAnimation(false), 1000);
      } else {
        throw new Error(`Stats API returned ${statsResponse.status}`);
      }

      // Fetch recent activities
      const activityResponse = await fetch(`http://localhost:8000/api/dashboard/recent-activity/${user.contactNumber}`);
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivities(activityData.recent_activities);
      } else {
        throw new Error(`Activity API returned ${activityResponse.status}`);
      }

      // Fetch notifications
      const notificationsResponse = await fetch(`http://localhost:8000/api/dashboard/notifications/${user.contactNumber}`);
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData.notifications);
      } else {
        throw new Error(`Notifications API returned ${notificationsResponse.status}`);
      }

      setLastUpdate(new Date());
      if (showToast) {
        toast.success('Dashboard updated successfully');
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user?.contactNumber]);

  // Refresh dashboard data
  const refreshDashboard = async () => {
    setRefreshing(true);
    await fetchDashboardData(true);
    setRefreshing(false);
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.success(autoRefresh ? 'Auto-refresh disabled' : 'Auto-refresh enabled');
  };

  // Change refresh interval
  const changeRefreshInterval = (interval) => {
    setRefreshInterval(interval);
    toast.success(`Refresh interval set to ${interval / 1000} seconds`);
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/dashboard/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ));
        toast.success('Notification marked as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Check connection status
  const checkConnectionStatus = () => {
    if (navigator.onLine) {
      setConnectionStatus('online');
    } else {
      setConnectionStatus('offline');
      toast.error('You are currently offline');
    }
  };

  // Track complaint function
  const trackComplaint = async () => {
    if (!trackingId.trim()) {
      toast.error('Please enter a complaint ID');
      return;
    }

    setTrackingLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/complaints/track/${trackingId.trim()}`);
      
      if (response.ok) {
        const result = await response.json();
        setTrackingResult(result);
        toast.success('Complaint found successfully!');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Complaint not found');
        setTrackingResult(null);
      }
    } catch (error) {
      console.error('Error tracking complaint:', error);
      toast.error('Failed to track complaint. Please try again.');
      setTrackingResult(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchDashboardData, refreshInterval);
    }
    
    // Set up connection status monitoring
    window.addEventListener('online', checkConnectionStatus);
    window.addEventListener('offline', checkConnectionStatus);
    
    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener('online', checkConnectionStatus);
      window.removeEventListener('offline', checkConnectionStatus);
    };
  }, [fetchDashboardData, autoRefresh, refreshInterval]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'approved':
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in progress':
      case 'under review':
      case 'assigned':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
      case 'new':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'approved':
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'in progress':
      case 'under review':
      case 'assigned':
        return <Clock className="w-4 h-4" />;
      case 'pending':
      case 'new':
        return <AlertTriangle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'complaint':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'property_verification':
        return <FileCheck className="w-5 h-5 text-blue-500" />;
      case 'building_approval':
        return <Building2 className="w-5 h-5 text-green-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Garun System</h1>
                  <p className="text-sm text-gray-500">Indore Municipal Corporation</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100">
                <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">{connectionStatus}</span>
              </div>

              {/* Last Update */}
              {lastUpdate && (
                <div className="text-xs text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                            onClick={() => markNotificationRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(notification.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">New</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Citizen'}</p>
                  <p className="text-xs text-gray-500">{user?.contactNumber || 'User'}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Performance Score */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.fullName || 'Citizen'}! 👋
                </h2>
                <p className="text-blue-100 text-lg mb-4">
                  Track your complaints, property verifications, and building approvals in real-time
                </p>
                

              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-gray-900">Dashboard Controls</h3>
          <div className="flex items-center space-x-4">
            {/* Auto-refresh toggle */}
            <button
              onClick={toggleAutoRefresh}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>Auto-refresh {autoRefresh ? 'ON' : 'OFF'}</span>
            </button>

            {/* Refresh interval selector */}
            <select
              value={refreshInterval}
              onChange={(e) => changeRefreshInterval(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={15000}>15s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
              <option value={300000}>5m</option>
            </select>

            {/* Manual refresh */}
            <button
              onClick={refreshDashboard}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Now'}</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Connection Error</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => fetchDashboardData()}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/register-complaint"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Register Complaint</h4>
                  <p className="text-sm text-gray-500">Report an issue</p>
                </div>
              </div>
            </Link>

            <Link
              to="/property-verification"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Property Verification</h4>
                  <p className="text-sm text-gray-500">Verify documents</p>
                </div>
              </div>
            </Link>

            <Link
              to="/building-approval"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Building Approval</h4>
                  <p className="text-sm text-gray-500">Apply for construction</p>
                </div>
              </div>
            </Link>

            <Link
              to="/track-complaint"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Track Complaint</h4>
                  <p className="text-sm text-gray-500">Check status</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Statistics Overview */}
        {dashboardData && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Statistics Overview</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Last updated: {lastUpdate?.toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Complaints Stats */}
              <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-500 ${
                statsAnimation ? 'scale-105 shadow-lg' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.complaints.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Resolved</span>
                    <span className="font-medium text-green-600">{dashboardData.complaints.resolved}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${dashboardData.complaints.resolution_rate}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Resolution Rate: {dashboardData.complaints.resolution_rate}%
                  </div>
                </div>
              </div>

              {/* Property Verifications Stats */}
              <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-500 ${
                statsAnimation ? 'scale-105 shadow-lg' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Property Verifications</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.property_verifications.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Verified</span>
                    <span className="font-medium text-green-600">{dashboardData.property_verifications.verified}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${dashboardData.property_verifications.verification_rate}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Verification Rate: {dashboardData.property_verifications.verification_rate}%
                  </div>
                </div>
              </div>

              {/* Building Approvals Stats */}
              <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-500 ${
                statsAnimation ? 'scale-105 shadow-lg' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Building Approvals</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.building_approvals.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Approved</span>
                    <span className="font-medium text-green-600">{dashboardData.building_approvals.approved}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${dashboardData.building_approvals.approval_rate}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Approval Rate: {dashboardData.building_approvals.approval_rate}%
                  </div>
                </div>
              </div>

              {/* Recent Activity Stats */}
              <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-500 ${
                statsAnimation ? 'scale-105 shadow-lg' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardData.recent_activity.complaints_last_30_days + 
                       dashboardData.recent_activity.property_verifications_last_30_days + 
                       dashboardData.recent_activity.building_approvals_last_30_days}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Last 30 days</p>
                  <div className="mt-2 flex space-x-1">
                    <div className="flex-1 bg-blue-500 h-2 rounded-full"></div>
                    <div className="flex-1 bg-green-500 h-2 rounded-full"></div>
                    <div className="flex-1 bg-purple-500 h-2 rounded-full"></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Complaints: {dashboardData.recent_activity.complaints_last_30_days}</span>
                      <span>Property: {dashboardData.recent_activity.property_verifications_last_30_days}</span>
                      <span>Building: {dashboardData.recent_activity.building_approvals_last_30_days}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Tracking */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Track Your Complaints</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex space-x-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter Complaint ID (e.g., GRV20250820034301b945a803)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                <button
                  onClick={trackComplaint}
                  disabled={!trackingId.trim() || trackingLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {trackingLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Tracking...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Track</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setTrackingId('');
                    setTrackingResult(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
              
              {trackingResult && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Complaint Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">ID:</span> 
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-blue-800">{trackingResult.complaint.id}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(trackingResult.complaint.id);
                            toast.success('Complaint ID copied to clipboard!');
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trackingResult.complaint.status)}`}>
                        {trackingResult.complaint.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Title:</span> {trackingResult.complaint.title}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Category:</span> {trackingResult.complaint.category}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Submitted:</span> {new Date(trackingResult.complaint.submitted_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Priority:</span> {trackingResult.complaint.priority}
                    </div>
                  </div>
                  {trackingResult.complaint.updates && trackingResult.complaint.updates.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-blue-900 mb-2">Latest Updates</h5>
                      <div className="space-y-2">
                        {trackingResult.complaint.updates.slice(-3).reverse().map((update, index) => (
                          <div key={index} className="text-sm bg-white p-2 rounded border">
                            <div className="flex justify-between">
                              <span className="font-medium">{update.status}</span>
                              <span className="text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-600">{update.message}</p>
                            {update.officer && <p className="text-xs text-gray-500">By: {update.officer}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-102">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                        <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{activity.category}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">Priority: {activity.priority}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                          <span className="ml-1">{activity.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activities</p>
                  <p className="text-sm text-gray-400">Your activities will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/direct-communication"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <MessageCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Direct Communication</h4>
                  <p className="text-sm text-gray-500">Contact officials directly</p>
                </div>
              </div>
            </Link>

            <Link
              to="/anonymous-complaint"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Anonymous Complaint</h4>
                  <p className="text-sm text-gray-500">Report without revealing identity</p>
                </div>
              </div>
            </Link>

            <Link
              to="/profile"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Profile Settings</h4>
                  <p className="text-sm text-gray-500">Manage your account</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;
