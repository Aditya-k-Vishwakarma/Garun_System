import React, { useState, useContext, useEffect } from 'react';
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
  Bell
} from 'lucide-react';
import AuthContext from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const CitizenDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userComplaints, setUserComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  // Fetch user complaints from backend
  useEffect(() => {
    const fetchUserComplaints = async () => {
      if (!user?.contactNumber) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/complaints/user/${user.contactNumber}`);
        if (response.ok) {
          const data = await response.json();
          setUserComplaints(data.complaints || []);
          
          // Calculate stats
          const total = data.complaints?.length || 0;
          const resolved = data.complaints?.filter(c => c.status === 'Resolved').length || 0;
          const inProgress = data.complaints?.filter(c => c.status === 'In Progress').length || 0;
          const pending = data.complaints?.filter(c => c.status === 'New' || c.status === 'Under Review').length || 0;
          
          setStats({
            totalComplaints: total,
            resolved,
            inProgress,
            pending
          });
        } else {
          console.error('Failed to fetch user complaints');
        }
      } catch (error) {
        console.error('Error fetching user complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserComplaints();
  }, [user?.contactNumber]);

  const complaintCategories = [
    { id: 1, name: 'Illegal Construction', icon: '🏗️', color: 'bg-red-100 text-red-800' },
    { id: 2, name: 'Encroachment', icon: '🚧', color: 'bg-orange-100 text-orange-800' },
    { id: 3, name: 'Sanitation', icon: '🧹', color: 'bg-yellow-100 text-yellow-800' },
    { id: 4, name: 'Water Supply', icon: '💧', color: 'bg-blue-100 text-blue-800' },
    { id: 5, name: 'Road Issues', icon: '🛣️', color: 'bg-gray-100 text-gray-800' },
    { id: 6, name: 'Street Lighting', icon: '💡', color: 'bg-purple-100 text-purple-800' }
  ];

  const recentComplaints = userComplaints.slice(0, 3).map(complaint => ({
    id: complaint.id,
    title: complaint.title,
    status: complaint.status,
    category: complaint.category,
    date: new Date(complaint.submitted_at).toLocaleDateString('en-IN')
  }));



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Garun System</h1>
                <p className="text-sm text-gray-600">Citizen Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Citizen User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Citizen'}! 👋
          </h2>
          <p className="text-gray-600">
            Manage your grievances and track their progress. Your voice matters in building a better community.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Functionality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Register Complaint */}
          <div className="card p-6 hover:shadow-medium transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Register Your Complaint</h3>
              <p className="text-gray-600 text-sm mb-4">
                Report new issues with photo/video upload, location tagging, and category selection
              </p>
              <button 
                onClick={() => navigate('/register-complaint')}
                className="btn-primary w-full"
              >
                File New Complaint
              </button>
            </div>
          </div>

          {/* Track Status */}
          <div className="card p-6 hover:shadow-medium transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-success-500 to-green-500 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Your Complaint Status</h3>
              <p className="text-gray-600 text-sm mb-4">
                Monitor progress from New → In-progress → Resolved → Closed with real-time updates
              </p>
              <button 
                onClick={() => navigate('/track-complaint')}
                className="btn-success w-full"
              >
                Track Status
              </button>
            </div>
          </div>

          {/* Property Documents */}
          <div className="card p-6 hover:shadow-medium transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-warning-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Property Documents</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upload and verify your property documents with government officials
              </p>
              <button 
                onClick={() => navigate('/property-verification')}
                className="btn-secondary w-full"
              >
                Verify Documents
              </button>
            </div>
          </div>

          {/* Building Approval */}
          <div className="card p-6 hover:shadow-medium transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply for Building Approval</h3>
              <p className="text-gray-600 text-sm mb-4">
                Submit building plans and get approval from municipal authorities
              </p>
              <button 
                onClick={() => navigate('/building-approval')}
                className="btn-primary w-full"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Direct Communication */}
          <div className="card p-6 hover:shadow-medium transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Communication</h3>
              <p className="text-gray-600 text-sm mb-4">
                Chat directly with officials and get real-time updates on your complaints
              </p>
              <button 
                onClick={() => navigate('/direct-communication')}
                className="btn-secondary w-full"
              >
                Open Chat
              </button>
            </div>
          </div>

          {/* Anonymous Complaints */}
          <div className="card p-6 hover:shadow-medium transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Anonymous Complaints</h3>
              <p className="text-gray-600 text-sm mb-4">
                Submit complaints anonymously with limited tracking for sensitive issues
              </p>
              <button 
                onClick={() => navigate('/anonymous-complaint')}
                className="btn-secondary w-full"
              >
                Submit Anonymously
              </button>
            </div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
            <Link to="/track-complaint" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{complaint.title}</p>
                    <p className="text-sm text-gray-600">ID: {complaint.id} • {complaint.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {complaint.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{complaint.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complaint Categories */}
        <div className="card p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Complaint Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {complaintCategories.map((category) => (
              <div key={category.id} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-2xl mb-2">{category.icon}</div>
                <p className="text-sm font-medium text-gray-700">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
