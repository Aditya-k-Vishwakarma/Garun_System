import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  Download,
  Share2,
  RefreshCw,
  Eye,
  MessageSquare,
  Building,
  Shield,
  Award,
  Activity,
  TrendingUp,
  BarChart3,
  Info
} from 'lucide-react';
import AuthContext from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ComplaintTracking = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [userComplaints, setUserComplaints] = useState([]);
  const [showUserComplaints, setShowUserComplaints] = useState(false);

  // Fetch user's complaints on component mount
  useEffect(() => {
    if (user?.contactNumber) {
      fetchUserComplaints();
    }
  }, [user?.contactNumber]);

  const fetchUserComplaints = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/complaints/user/${user.contactNumber}`);
      if (response.ok) {
        const data = await response.json();
        setUserComplaints(data.complaints || []);
      }
    } catch (error) {
      console.error('Error fetching user complaints:', error);
    }
  };

  const trackComplaint = async () => {
    if (!complaintId.trim()) {
      toast.error('Please enter a complaint ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/complaints/track/${complaintId.trim()}`);
      
      if (response.ok) {
        const data = await response.json();
        setComplaint(data.complaint);
        setSearchPerformed(true);
        toast.success('Complaint found successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Complaint not found');
        setComplaint(null);
        setSearchPerformed(true);
      }
    } catch (error) {
      console.error('Error tracking complaint:', error);
      toast.error('Failed to track complaint. Please try again.');
      setComplaint(null);
      setSearchPerformed(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in progress':
      case 'under review':
      case 'assigned':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'new':
      case 'pending':
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
        return <CheckCircle className="w-5 h-5" />;
      case 'in progress':
      case 'under review':
      case 'assigned':
        return <Clock className="w-5 h-5" />;
      case 'new':
      case 'pending':
        return <AlertTriangle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateResolutionTime = (submittedAt, resolvedAt) => {
    if (!submittedAt || !resolvedAt) return null;
    
    const submitted = new Date(submittedAt);
    const resolved = new Date(resolvedAt);
    const diffTime = Math.abs(resolved - submitted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Complaint Tracking</h1>
                  <p className="text-sm text-gray-500">Track your complaint status in real-time</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUserComplaints(!showUserComplaints)}
                className="btn-secondary"
              >
                <Eye className="w-4 h-4 mr-2" />
                My Complaints
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Track Your Complaint</h2>
              <p className="text-gray-600">Enter your complaint ID to get real-time updates</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    placeholder="Enter Complaint ID (e.g., GRV20250115123456)"
                    className="form-input text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && trackComplaint()}
                  />
                </div>
                <button
                  onClick={trackComplaint}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  <span className="ml-2">Track</span>
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Don't have your complaint ID?{' '}
                  <button
                    onClick={() => setShowUserComplaints(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all your complaints
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Complaints Section */}
        {showUserComplaints && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Your Complaints</h3>
                <button
                  onClick={() => setShowUserComplaints(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              {userComplaints.length > 0 ? (
                <div className="grid gap-4">
                  {userComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="card p-4 hover:shadow-medium transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        setComplaintId(complaint.id);
                        setComplaint(complaint);
                        setSearchPerformed(true);
                        setShowUserComplaints(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                              {getStatusIcon(complaint.status)}
                              <span className="ml-1">{complaint.status}</span>
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{complaint.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{complaint.description.substring(0, 100)}...</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>ID: {complaint.id}</span>
                            <span>•</span>
                            <span>{complaint.category}</span>
                            <span>•</span>
                            <span>{formatDate(complaint.submitted_at)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No complaints found</p>
                  <p className="text-sm text-gray-400">You haven't registered any complaints yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complaint Details */}
        {complaint && searchPerformed && (
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{complaint.title}</h2>
                    <p className="text-blue-100">Complaint ID: {complaint.id}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm`}>
                      {getStatusIcon(complaint.status)}
                      <span className="ml-2">{complaint.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Information */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{complaint.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <h4 className="font-medium text-gray-900">Location</h4>
                        </div>
                        <p className="text-gray-700">{complaint.address}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Ward: {complaint.ward} • Zone: {complaint.zone}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <h4 className="font-medium text-gray-900">Timeline</h4>
                        </div>
                        <p className="text-gray-700">Submitted: {formatDate(complaint.submitted_at)}</p>
                        {complaint.resolved_at && (
                          <p className="text-gray-700 mt-1">
                            Resolved: {formatDate(complaint.resolved_at)}
                          </p>
                        )}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          <h4 className="font-medium text-gray-900">Category & Priority</h4>
                        </div>
                        <p className="text-gray-700">{complaint.category}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-2 ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority} Priority
                        </span>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <User className="w-5 h-5 text-purple-600" />
                          <h4 className="font-medium text-gray-900">Complainant</h4>
                        </div>
                        <p className="text-gray-700">{complaint.complainant.full_name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {complaint.complainant.contact_number}
                        </p>
                      </div>
                    </div>

                    {/* Status Updates Timeline */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Updates</h3>
                      <div className="space-y-4">
                        {complaint.updates.map((update, index) => (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(update.status)}`}>
                                  {getStatusIcon(update.status)}
                                  <span className="ml-1">{update.status}</span>
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatDate(update.date)}
                                </span>
                              </div>
                              <p className="text-gray-700">{update.message}</p>
                              {update.officer && (
                                <p className="text-sm text-gray-500 mt-2">
                                  Officer: {update.officer}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full btn-primary text-sm py-2">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Officer
                        </button>
                        <button className="w-full btn-secondary text-sm py-2">
                          <Download className="w-4 h-4 mr-2" />
                          Download Details
                        </button>
                        <button className="w-full btn-secondary text-sm py-2">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Status
                        </button>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Days Since Submission</span>
                          <span className="font-medium text-gray-900">
                            {Math.ceil((new Date() - new Date(complaint.submitted_at)) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                        {complaint.resolved_at && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Resolution Time</span>
                            <span className="font-medium text-green-600">
                              {calculateResolutionTime(complaint.submitted_at, complaint.resolved_at)} days
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Updates</span>
                          <span className="font-medium text-gray-900">{complaint.updates.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    {complaint.assigned_to && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-3">Assigned Officer</h4>
                        <div className="space-y-2">
                          <p className="text-green-800 font-medium">{complaint.assigned_to}</p>
                          <div className="flex items-center space-x-2 text-sm text-green-700">
                            <Phone className="w-4 h-4" />
                            <span>+91-731-1234567</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-green-700">
                            <Mail className="w-4 h-4" />
                            <span>officer@indore.gov.in</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {searchPerformed && !complaint && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Complaint Not Found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find a complaint with the ID "{complaintId}". Please check the ID and try again.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => setSearchPerformed(false)}
                className="btn-secondary"
              >
                Try Another ID
              </button>
              <button
                onClick={() => setShowUserComplaints(true)}
                className="btn-primary"
              >
                View My Complaints
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ComplaintTracking;
