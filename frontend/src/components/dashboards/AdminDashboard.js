import React, { useState, useContext, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings, 
  LogOut,
  User,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  BarChart3,
  MapPin,
  MessageSquare,
  Eye,
  CheckSquare,
  XSquare,
  Building2,
  DocumentText,
  MessageCircle,
  Filter,
  Search,
  Camera,
  Plane,
  Database,
  Activity,
  ClipboardList,
  Globe,
  Wifi,
  Satellite,
  Zap,
  ShieldCheck,
  AlertOctagon,
  TrendingDown,
  Users2,
  Building,
  FileSpreadsheet,
  BarChart2,
  PieChart,
  LineChart
} from 'lucide-react';
import AuthContext from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showFieldSurveyModal, setShowFieldSurveyModal] = useState(false);
  const [showDroneFleetModal, setShowDroneFleetModal] = useState(false);
  const [showDataOverviewModal, setShowDataOverviewModal] = useState(false);
  const [showCommunicationHub, setShowCommunicationHub] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [propertyVerifications, setPropertyVerifications] = useState([]);
  const [buildingApprovals, setBuildingApprovals] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [illegalConstructions, setIllegalConstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    message: '',
    officer: '',
    priority: '',
    assignedTo: '',
    estimatedResolution: ''
  });
  const [statistics, setStatistics] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    totalPropertyVerifications: 0,
    pendingVerifications: 0,
    totalBuildingApprovals: 0,
    pendingApprovals: 0
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/dashboard');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setComplaints(data.data.complaints || []);
            setPropertyVerifications(data.data.property_verifications || []);
            setBuildingApprovals(data.data.building_approvals || []);
            setSurveys(data.data.surveys || []);
            setIllegalConstructions(data.data.illegal_constructions || []);
            
            // Update statistics
            setStatistics({
              totalComplaints: data.data.overview.total_complaints,
              pendingComplaints: data.data.complaints.filter(c => c.status === 'New').length,
              inProgressComplaints: data.data.complaints.filter(c => c.status === 'In Progress').length,
              resolvedComplaints: data.data.complaints.filter(c => c.status === 'Resolved').length,
              totalPropertyVerifications: data.data.overview.total_property_verifications,
              pendingVerifications: data.data.property_verifications.filter(v => v.status === 'Pending').length,
              totalBuildingApprovals: data.data.overview.total_building_approvals,
              pendingApprovals: data.data.building_approvals.filter(a => a.status === 'Pending').length
            });
          }
        } else {
          console.error('Failed to fetch admin data');
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const systemStats = {
    totalComplaints: statistics.totalComplaints || 0,
    pending: statistics.pendingComplaints || 0,
    inProgress: statistics.inProgressComplaints || 0,
    resolved: statistics.resolvedComplaints || 0,
    totalUsers: 3456,
    activeOfficials: 45,
    departments: 12,
    avgResolutionTime: '3.2 days'
  };

  const recentComplaints = [
    { id: 'GRV1247', title: 'Major road damage on Highway 101', priority: 'High', status: 'New', department: 'Public Works', date: '2024-01-15' },
    { id: 'GRV1246', title: 'Water supply disruption in Ward 5', priority: 'High', status: 'In Progress', department: 'Water Supply', date: '2024-01-15' },
    { id: 'GRV1245', title: 'Illegal construction in residential area', priority: 'Medium', status: 'Assigned', department: 'Building Inspector', date: '2024-01-14' },
    { id: 'GRV1244', title: 'Street light malfunction', priority: 'Low', status: 'Resolved', department: 'Electricity', date: '2024-01-14' }
  ];

  const departmentPerformance = [
    { name: 'Public Works', resolved: 89, pending: 12, avgTime: '2.1 days' },
    { name: 'Water Supply', resolved: 67, pending: 8, avgTime: '1.8 days' },
    { name: 'Building Inspector', resolved: 45, pending: 15, avgTime: '4.2 days' },
    { name: 'Electricity', resolved: 78, pending: 5, avgTime: '1.5 days' },
    { name: 'Sanitation', resolved: 92, pending: 3, avgTime: '1.2 days' }
  ];

  const priorityAlerts = [
    { id: 1, type: 'SLA Breach', message: '5 complaints exceeding SLA deadline', count: 5, severity: 'high' },
    { id: 2, type: 'High Priority', message: '12 high priority complaints pending', count: 12, severity: 'medium' },
    { id: 3, type: 'Department Overload', message: 'Building Inspector department overloaded', count: 15, severity: 'medium' }
  ];

  // New data for enhanced functionality
  const grievanceResponses = [
    { id: 'GR001', citizen: 'Rajesh Kumar', complaint: 'Illegal construction in Ward 5', response: 'Survey completed, awaiting verification', status: 'Pending Review', date: '2024-01-15' },
    { id: 'GR002', citizen: 'Priya Sharma', complaint: 'Water logging issue', response: 'Department assigned, work in progress', status: 'In Progress', date: '2024-01-14' },
    { id: 'GR003', citizen: 'Amit Patel', complaint: 'Street light malfunction', response: 'Issue resolved, please verify', status: 'Completed', date: '2024-01-13' }
  ];

  const documentVerificationRequests = [
    { id: 'DOC001', citizen: 'Sneha Reddy', documentType: 'Property Papers', ward: 'Ward 3', status: 'Pending', submittedDate: '2024-01-15', priority: 'High' },
    { id: 'DOC002', citizen: 'Vikram Singh', documentType: 'Building Plans', ward: 'Ward 7', status: 'Under Review', submittedDate: '2024-01-14', priority: 'Medium' },
    { id: 'DOC003', citizen: 'Anjali Gupta', documentType: 'Land Records', ward: 'Ward 2', status: 'Pending', submittedDate: '2024-01-13', priority: 'Low' }
  ];

  const buildingPermissionRequests = [
    { id: 'BPR001', applicant: 'Construction Corp Ltd', project: 'Residential Complex', ward: 'Ward 4', status: 'Pending Approval', submittedDate: '2024-01-15', estimatedCost: '₹2.5 Cr' },
    { id: 'BPR002', applicant: 'Green Builders', project: 'Commercial Plaza', ward: 'Ward 6', status: 'Under Review', submittedDate: '2024-01-14', estimatedCost: '₹5.2 Cr' },
    { id: 'BPR003', applicant: 'Metro Developers', project: 'Apartment Block', ward: 'Ward 1', status: 'Pending', submittedDate: '2024-01-13', estimatedCost: '₹3.8 Cr' }
  ];

  const illegalConstructionReports = [
    { id: 'ICR001', location: 'Ward 5, Sector A', reporter: 'Anonymous', severity: 'High', status: 'New Report', date: '2024-01-15', coordinates: '28.7041°N, 77.1025°E' },
    { id: 'ICR002', location: 'Ward 3, Sector B', reporter: 'Local Resident', severity: 'Medium', status: 'Under Investigation', date: '2024-01-14', coordinates: '28.7041°N, 77.1025°E' },
    { id: 'ICR003', location: 'Ward 7, Sector C', reporter: 'Ward Officer', severity: 'Low', status: 'Resolved', date: '2024-01-13', coordinates: '28.7041°N, 77.1025°E' }
  ];

  // Enhanced data for Admin Dashboard
  const fieldSurveys = [
    { id: 'FS001', incharge: 'Rajesh Kumar', location: 'Ward 5, Sector A', type: 'Drone Survey', status: 'Completed', date: '2024-01-15', droneModel: 'DJI Mavic 3', dataCollected: 'Images, Lidar, GPS', coordinates: '28.7041°N, 77.1025°E' },
    { id: 'FS002', incharge: 'Priya Sharma', location: 'Ward 3, Sector B', type: 'Manual Survey', status: 'In Progress', date: '2024-01-15', droneModel: 'N/A', dataCollected: 'Photos, Measurements', coordinates: '28.7041°N, 77.1025°E' },
    { id: 'FS003', incharge: 'Amit Patel', location: 'Ward 7, Sector C', type: 'Drone Survey', status: 'Scheduled', date: '2024-01-16', droneModel: 'DJI Mavic 3', dataCollected: 'Pending', coordinates: '28.7041°N, 77.1025°E' }
  ];

  const droneFleet = [
    { id: 'DRONE001', model: 'DJI Mavic 3 Enterprise', status: 'Active', operator: 'Rajesh Kumar', lastMission: '2024-01-15', batteryLevel: 85, sensors: ['GPS', 'Lidar', 'Camera', 'ADS-B'], location: 'Ward 5', missionType: 'Survey' },
    { id: 'DRONE002', model: 'DJI Mavic 3 Enterprise', status: 'Maintenance', operator: 'Priya Sharma', lastMission: '2024-01-14', batteryLevel: 45, sensors: ['GPS', 'Camera'], location: 'Hangar', missionType: 'Inspection' },
    { id: 'DRONE003', model: 'Custom Quadcopter', status: 'Active', operator: 'Amit Patel', lastMission: '2024-01-15', batteryLevel: 92, sensors: ['GPS', 'Thermal', 'Multispectral'], location: 'Ward 7', missionType: 'Agriculture' }
  ];

  const dataCollectionOverview = [
    { sheet: 'Ward 5 Survey Data', records: 1247, lastUpdated: '2024-01-15 14:30', incharge: 'Rajesh Kumar', status: 'Complete', dataTypes: ['GPS', 'Images', 'Measurements'] },
    { sheet: 'Ward 3 Construction Data', records: 892, lastUpdated: '2024-01-15 16:45', incharge: 'Priya Sharma', status: 'In Progress', dataTypes: ['Photos', 'Documents', 'Coordinates'] },
    { sheet: 'Ward 7 Infrastructure Data', records: 1567, lastUpdated: '2024-01-15 12:15', incharge: 'Amit Patel', status: 'Pending Review', dataTypes: ['Lidar', 'Thermal', 'Satellite'] }
  ];

  const realTimeActivityFeed = [
    { id: 1, user: 'Rajesh Kumar (Incharge)', action: 'Started Field Survey', location: 'Ward 5', time: '2 minutes ago', type: 'survey', priority: 'normal' },
    { id: 2, user: 'Priya Sharma (Incharge)', action: 'Uploaded Survey Data', location: 'Ward 3', time: '5 minutes ago', type: 'data', priority: 'normal' },
    { id: 3, user: 'Citizen User', action: 'Submitted Complaint', location: 'Ward 7', time: '8 minutes ago', type: 'complaint', priority: 'high' },
    { id: 4, user: 'Amit Patel (Incharge)', action: 'Connected Drone', location: 'Ward 7', time: '12 minutes ago', type: 'drone', priority: 'normal' },
    { id: 5, user: 'System', action: 'SLA Alert Triggered', location: 'Ward 2', time: '15 minutes ago', type: 'alert', priority: 'critical' }
  ];

  const communicationMessages = [
    { id: 1, from: 'Rajesh Kumar', to: 'Admin', message: 'Field survey completed in Ward 5. Data uploaded successfully.', time: '2 minutes ago', status: 'read', priority: 'normal' },
    { id: 2, from: 'Priya Sharma', to: 'Admin', message: 'Need approval for additional drone deployment in Ward 3.', time: '15 minutes ago', status: 'unread', priority: 'high' },
    { id: 3, from: 'Amit Patel', to: 'Admin', message: 'Thermal sensor malfunction detected on DRONE003. Requesting maintenance.', time: '1 hour ago', status: 'read', priority: 'medium' },
    { id: 4, from: 'System', to: 'All', message: 'Scheduled maintenance for all drones tomorrow 9 AM.', time: '2 hours ago', status: 'read', priority: 'normal' }
  ];

  const auditTrail = [
    { id: 1, user: 'Rajesh Kumar', action: 'Approved Building Permission', target: 'BPR001', timestamp: '2024-01-15 14:30:25', ipAddress: '192.168.1.100', status: 'Success' },
    { id: 2, user: 'Admin', action: 'Modified User Permissions', target: 'User: Priya Sharma', timestamp: '2024-01-15 14:25:10', ipAddress: '192.168.1.001', status: 'Success' },
    { id: 3, user: 'System', action: 'Automatic Backup', target: 'Database', timestamp: '2024-01-15 14:00:00', ipAddress: 'System', status: 'Success' },
    { id: 4, user: 'Amit Patel', action: 'Updated Survey Data', target: 'Ward 7 Data', timestamp: '2024-01-15 13:45:30', ipAddress: '192.168.1.105', status: 'Success' }
  ];

  const handleStatusChange = (type, id, newStatus) => {
    toast.success(`${type} status updated to ${newStatus}`);
    // In real app, this would update the backend
  };

  const handleResponseSubmit = (id, response) => {
    toast.success('Response submitted successfully');
    // In real app, this would update the backend
  };

  const handleSurveyApproval = (surveyId, action) => {
    toast.success(`Field survey ${action} successfully`);
    // In real app, this would update the backend
  };

  const handleDroneDeployment = (droneId, action) => {
    toast.success(`Drone ${action} successfully`);
    // In real app, this would update the backend
  };

  const handleDataApproval = (dataId, action) => {
    toast.success(`Data ${action} successfully`);
    // In real app, this would update the backend
  };

  // Handle complaint status update
  const handleComplaintUpdate = async (complaintId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          status: updateForm.status,
          message: updateForm.message,
          officer: updateForm.officer,
          priority: updateForm.priority || '',
          assigned_to: updateForm.assignedTo || '',
          estimated_resolution: updateForm.estimatedResolution || ''
        })
      });

      if (response.ok) {
        toast.success('Complaint status updated successfully');
        setShowComplaintModal(false);
        // Refresh data
        window.location.reload();
      } else {
        toast.error('Failed to update complaint status');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint status');
    }
  };

  // Handle property verification update
  const handleVerificationUpdate = async (ticketId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/property/verifications/${ticketId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          status: updateForm.status,
          notes: updateForm.message || '',
          verified_by: updateForm.officer
        })
      });

      if (response.ok) {
        toast.success('Property verification updated successfully');
        setShowVerificationModal(false);
        // Refresh data
        window.location.reload();
      } else {
        toast.error('Failed to update verification status');
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      toast.error('Failed to update verification status');
    }
  };

  // Handle building approval update
  const handleApprovalUpdate = async (ticketId) => {
    try {
      const action = updateForm.status === 'Approved' ? 'approve' : 'reject';
      const response = await fetch(`http://localhost:8000/api/building/approvals/${ticketId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: action,
          notes: updateForm.message || '',
          approved_by: updateForm.officer,
          rejection_reason: action === 'reject' ? updateForm.message : ''
        })
      });

      if (response.ok) {
        toast.success(`Building application ${action}d successfully`);
        setShowApprovalModal(false);
        // Refresh data
        window.location.reload();
      } else {
        toast.error(`Failed to ${action} building application`);
      }
    } catch (error) {
      console.error('Error updating building approval:', error);
      toast.error('Failed to update building approval status');
    }
  };

  const sendBroadcastMessage = (message) => {
    toast.success('Broadcast message sent to all users');
    // In real app, this would send to all users
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'survey': return <Camera className="h-4 w-4" />;
      case 'data': return <Database className="h-4 w-4" />;
      case 'complaint': return <FileText className="h-4 w-4" />;
      case 'drone': return <Plane className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'normal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Garun System</h1>
                <p className="text-sm text-gray-600">Admin Panel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setShowChat(!showChat)}
                className="p-2 text-gray-400 hover:text-gray-600 relative"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-blue-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Administrator'}</span>
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
            Welcome, {user?.name || 'Administrator'}! 🛡️
          </h2>
          <p className="text-gray-600">
            Monitor system performance, manage departments, and ensure efficient grievance resolution.
          </p>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalComplaints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.resolved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Officials</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeOfficials}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-teal-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.avgResolutionTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Activity Feed</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Live updates from all dashboards</span>
              <div className="flex space-x-2">
                <button className="btn-secondary text-xs px-3 py-1">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </button>
                <button className="btn-primary text-xs px-3 py-1">
                  <Activity className="h-3 w-3 mr-1" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {realTimeActivityFeed.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-full ${getPriorityColor(activity.priority)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500">Location: {activity.location}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                  {activity.priority}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Priority Alerts</h3>
            <span className="text-sm text-gray-500">Real-time monitoring</span>
          </div>
          
          <div className="space-y-4">
            {priorityAlerts.map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'bg-red-50 border-red-400' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'high' ? 'text-red-500' :
                    alert.severity === 'medium' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{alert.type}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.count} items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Field Survey Monitoring */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Field Survey Monitoring</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Track all surveys from Incharge Dashboard</span>
              <button 
                onClick={() => setShowFieldSurveyModal(true)}
                className="btn-primary text-xs px-3 py-1"
              >
                <Camera className="h-3 w-3 mr-1" />
                View All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fieldSurveys.map((survey) => (
              <div key={survey.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">{survey.id}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    survey.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    survey.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {survey.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600"><span className="font-medium">Incharge:</span> {survey.incharge}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Location:</span> {survey.location}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Type:</span> {survey.type}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Drone:</span> {survey.droneModel}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Data:</span> {survey.dataCollected}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Coordinates:</span> {survey.coordinates}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSurveyApproval(survey.id, 'approved')}
                    className="btn-success text-xs px-3 py-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleSurveyApproval(survey.id, 'rejected')}
                    className="btn-danger text-xs px-3 py-1"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setSelectedRequest(survey)}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Surveys and Illegal Constructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">📊 Surveys & Illegal Constructions</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Monitor field surveys and violations</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Surveys Summary */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-blue-600" />
                Recent Surveys
              </h4>
              {surveys && surveys.length > 0 ? (
                <div className="space-y-3">
                  {surveys.slice(0, 3).map((survey) => (
                    <div key={survey.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{survey.id}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Ward {survey.ward_no}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Date:</span> {survey.survey_date}</p>
                        <p><span className="font-medium">Drone:</span> {survey.drone_id}</p>
                        <p><span className="font-medium">Violations:</span> {survey.total_violations}</p>
                        <p><span className="font-medium">Compliance:</span> {survey.compliance_score || 'N/A'}%</p>
                        <p><span className="font-medium">Area:</span> {survey.total_area_sq_meters || 'N/A'} sq m</p>
                      </div>
                      {survey.severity_summary && (
                        <div className="mt-2 flex space-x-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            H: {survey.severity_summary.high || 0}
                          </span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            M: {survey.severity_summary.medium || 0}
                          </span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            L: {survey.severity_summary.low || 0}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {surveys.length > 3 && (
                    <div className="text-center pt-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All Surveys ({surveys.length})
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No surveys available</p>
                </div>
              )}
            </div>

            {/* Illegal Constructions Summary */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Illegal Constructions
              </h4>
              {illegalConstructions && illegalConstructions.length > 0 ? (
                <div className="space-y-3">
                  {illegalConstructions.slice(0, 3).map((violation) => (
                    <div key={violation.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{violation.violation_type}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          violation.severity === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : violation.severity === 'medium'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {violation.severity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Ward:</span> {violation.ward_name || `Ward ${violation.ward_no}`}</p>
                        <p><span className="font-medium">Status:</span> {violation.status}</p>
                        <p><span className="font-medium">Detected:</span> {new Date(violation.detected_at).toLocaleDateString()}</p>
                        {violation.description && (
                          <p><span className="font-medium">Issue:</span> {violation.description}</p>
                        )}
                        {violation.priority && (
                          <p><span className="font-medium">Priority:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                              violation.priority === 'high' ? 'bg-red-100 text-red-800' :
                              violation.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {violation.priority}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {illegalConstructions.length > 3 && (
                    <div className="text-center pt-2">
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        View All Violations ({illegalConstructions.length})
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No violations detected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Survey Analytics Dashboard */}
        {surveys && surveys.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">📈 Survey Analytics & Compliance Metrics</h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Real-time compliance monitoring</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Total Surveys */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Camera className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Surveys</p>
                    <p className="text-2xl font-bold text-blue-900">{surveys.length}</p>
                  </div>
                </div>
              </div>

              {/* Total Violations */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-600">Total Violations</p>
                    <p className="text-2xl font-bold text-red-900">
                      {surveys.reduce((total, survey) => total + (survey.total_violations || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Average Compliance Score */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Avg Compliance</p>
                    <p className="text-2xl font-bold text-green-900">
                      {Math.round(surveys.reduce((total, survey) => total + (survey.compliance_score || 100), 0) / surveys.length)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Area Covered */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Area Covered</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {Math.round(surveys.reduce((total, survey) => total + (survey.total_area_sq_meters || 0), 0) / 1000)}K sq m
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ward-wise Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🏘️ Ward-wise Violation Distribution</h4>
                <div className="space-y-3">
                  {Object.entries(
                    surveys.reduce((acc, survey) => {
                      const ward = survey.ward_no;
                      acc[ward] = (acc[ward] || 0) + (survey.total_violations || 0);
                      return acc;
                    }, {})
                  )
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([ward, violations]) => (
                    <div key={ward} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Ward {ward}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(violations / Math.max(...Object.values(surveys.reduce((acc, s) => { acc[s.ward_no] = (acc[s.ward_no] || 0) + (s.total_violations || 0); return acc; }, {})))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8 text-right">{violations}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Severity Breakdown</h4>
                <div className="space-y-3">
                  {(() => {
                    const severityCounts = surveys.reduce((acc, survey) => {
                      if (survey.severity_summary) {
                        acc.high += survey.severity_summary.high || 0;
                        acc.medium += survey.severity_summary.medium || 0;
                        acc.low += survey.severity_summary.low || 0;
                      }
                      return acc;
                    }, { high: 0, medium: 0, low: 0 });

                    return [
                      { label: 'High Priority', count: severityCounts.high, color: 'bg-red-500', textColor: 'text-red-800' },
                      { label: 'Medium Priority', count: severityCounts.medium, color: 'bg-orange-500', textColor: 'text-orange-800' },
                      { label: 'Low Priority', count: severityCounts.low, color: 'bg-yellow-500', textColor: 'text-yellow-800' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full`}
                              style={{ width: `${(item.count / Math.max(severityCounts.high, severityCounts.medium, severityCounts.low)) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium w-8 text-right ${item.textColor}`}>{item.count}</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grievance Platform Responses */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Grievance Platform Responses</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search responses..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button className="btn-secondary">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citizen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grievanceResponses.map((response) => (
                  <tr key={response.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{response.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{response.citizen}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{response.complaint}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{response.response}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        response.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        response.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {response.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedRequest(response)}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange('Grievance Response', response.id, 'Approved')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckSquare className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange('Grievance Response', response.id, 'Rejected')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drone Fleet Management */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Drone Fleet Management</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Monitor all drone operations and sensor data</span>
              <button 
                onClick={() => setShowDroneFleetModal(true)}
                className="btn-primary text-xs px-3 py-1"
              >
                <Plane className="h-3 w-3 mr-1" />
                Manage Fleet
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {droneFleet.map((drone) => (
              <div key={drone.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">{drone.id}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    drone.status === 'Active' ? 'bg-green-100 text-green-800' :
                    drone.status === 'Maintenance' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {drone.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600"><span className="font-medium">Model:</span> {drone.model}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Operator:</span> {drone.operator}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Location:</span> {drone.location}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Mission:</span> {drone.missionType}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Battery:</span> {drone.batteryLevel}%</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Sensors:</span> {drone.sensors.join(', ')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDroneDeployment(drone.id, 'deployed')}
                    className="btn-success text-xs px-3 py-1"
                  >
                    Deploy
                  </button>
                  <button
                    onClick={() => handleDroneDeployment(drone.id, 'recalled')}
                    className="btn-danger text-xs px-3 py-1"
                  >
                    Recall
                  </button>
                  <button
                    onClick={() => setSelectedRequest(drone)}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Verification Requests */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Document Verification Requests</h3>
            <span className="text-sm text-gray-500">Ward-wise verification</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentVerificationRequests.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">{doc.id}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doc.priority === 'High' ? 'bg-red-100 text-red-800' :
                    doc.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {doc.priority}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600"><span className="font-medium">Citizen:</span> {doc.citizen}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Document:</span> {doc.documentType}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Ward:</span> {doc.ward}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Status:</span> {doc.status}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Submitted:</span> {doc.submittedDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatusChange('Document', doc.id, 'Verified')}
                    className="btn-success text-xs px-3 py-1"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleStatusChange('Document', doc.id, 'Rejected')}
                    className="btn-danger text-xs px-3 py-1"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setSelectedRequest(doc)}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Collection Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Data Collection Overview</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Monitor all Excel data and changes from Incharge Dashboard</span>
              <button 
                onClick={() => setShowDataOverviewModal(true)}
                className="btn-primary text-xs px-3 py-1"
              >
                <Database className="h-3 w-3 mr-1" />
                View All Data
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataCollectionOverview.map((data, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">{data.sheet}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    data.status === 'Complete' ? 'bg-green-100 text-green-800' :
                    data.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {data.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600"><span className="font-medium">Records:</span> {data.records.toLocaleString()}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Incharge:</span> {data.incharge}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Last Updated:</span> {data.lastUpdated}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Data Types:</span> {data.dataTypes.join(', ')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDataApproval(data.sheet, 'approved')}
                    className="btn-success text-xs px-3 py-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDataApproval(data.sheet, 'review')}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => setSelectedRequest(data)}
                    className="btn-primary text-xs px-3 py-1"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Building Permission Requests */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Building Construction Permission Requests</h3>
            <span className="text-sm text-gray-500">Large scale projects</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buildingPermissionRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.applicant}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.project}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.ward}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.estimatedCost}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'Pending Approval' ? 'bg-red-100 text-red-800' :
                        request.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStatusChange('Building Permission', request.id, 'Approved')}
                          className="btn-success text-xs px-3 py-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange('Building Permission', request.id, 'Rejected')}
                          className="btn-danger text-xs px-3 py-1"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="btn-secondary text-xs px-3 py-1"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Communication Hub */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Communication Hub</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Centralized messaging system for all users</span>
              <button 
                onClick={() => setShowCommunicationHub(true)}
                className="btn-primary text-xs px-3 py-1"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Open Hub
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Recent Messages</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {communicationMessages.slice(0, 3).map((message) => (
                  <div key={message.id} className={`p-3 rounded-lg border ${
                    message.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{message.from}</span>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">To: {message.to}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.priority === 'high' ? 'bg-red-100 text-red-800' :
                        message.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {message.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Quick Actions</h4>
              <div className="space-y-3">
                <button className="w-full btn-secondary text-left px-3 py-2">
                  <MessageSquare className="h-4 w-4 mr-2 inline" />
                  Send Broadcast Message
                </button>
                <button className="w-full btn-secondary text-left px-3 py-2">
                  <Users className="h-4 w-4 mr-2 inline" />
                  Notify All Incharges
                </button>
                <button className="w-full btn-secondary text-left px-3 py-2">
                  <AlertTriangle className="h-4 w-4 mr-2 inline" />
                  Send Emergency Alert
                </button>
                <button className="w-full btn-secondary text-left px-3 py-2">
                  <FileText className="h-4 w-4 mr-2 inline" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Illegal Construction Reports */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Illegal Construction Reports</h3>
            <span className="text-sm text-gray-500">Ward-wise monitoring</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {illegalConstructionReports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">{report.id}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.severity === 'High' ? 'bg-red-100 text-red-800' :
                    report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.severity}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600"><span className="font-medium">Location:</span> {report.location}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Reporter:</span> {report.reporter}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Coordinates:</span> {report.coordinates}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Status:</span> {report.status}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Date:</span> {report.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatusChange('Illegal Construction', report.id, 'Under Investigation')}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Investigate
                  </button>
                  <button
                    onClick={() => handleStatusChange('Illegal Construction', report.id, 'Resolved')}
                    className="btn-success text-xs px-3 py-1"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => setSelectedRequest(report)}
                    className="btn-primary text-xs px-3 py-1"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Track all system changes and approvals</span>
              <button 
                onClick={() => setShowAuditTrail(true)}
                className="btn-primary text-xs px-3 py-1"
              >
                <ClipboardList className="h-3 w-3 mr-1" />
                View Full Trail
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditTrail.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{entry.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{entry.target}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.ipAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View Detailed Report
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentPerformance.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dept.resolved}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dept.pending}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dept.avgTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dept.pending > 10 ? 'bg-red-100 text-red-800' :
                        dept.pending > 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {dept.pending > 10 ? 'Overloaded' :
                         dept.pending > 5 ? 'Busy' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
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
                    <p className="text-sm text-gray-600">ID: {complaint.id} • {complaint.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                      complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{complaint.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Manage Users</h3>
            <p className="text-xs text-gray-600">Add, edit, or remove system users</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Analytics</h3>
            <p className="text-xs text-gray-600">View detailed system analytics</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">System Settings</h3>
            <p className="text-xs text-gray-600">Configure system parameters</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Broadcast</h3>
            <p className="text-xs text-gray-600">Send system-wide notifications</p>
          </div>
        </div>

        {/* Additional Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Camera className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Survey Monitor</h3>
            <p className="text-xs text-gray-600">Monitor all field surveys</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Plane className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Drone Control</h3>
            <p className="text-xs text-gray-600">Manage drone fleet operations</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Data Monitor</h3>
            <p className="text-xs text-gray-600">Track all data collection</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <ClipboardList className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Audit Log</h3>
            <p className="text-xs text-gray-600">View system audit trail</p>
          </div>
        </div>
      </div>

      {/* Direct Communication Chat Panel */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Direct Communication</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-900">Hello, I have a question about the new building permission process.</p>
                    <p className="text-xs text-gray-500 mt-1">2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-primary-600 text-white rounded-lg p-3 max-w-xs">
                    <p className="text-sm">Hello! I'd be happy to help you with the building permission process. What specific question do you have?</p>
                    <p className="text-xs text-primary-100 mt-1">2:32 PM</p>
                  </div>
                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 input-field"
                />
                <button className="btn-primary px-4">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(selectedRequest).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex space-x-3">
                <button className="btn-success">Approve</button>
                <button className="btn-danger">Reject</button>
                <button className="btn-secondary">Request More Info</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Survey Modal */}
      {showFieldSurveyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Field Survey Monitoring</h3>
              <button
                onClick={() => setShowFieldSurveyModal(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">All Field Surveys</h4>
                <p className="text-gray-600">Monitor and manage all field surveys conducted by Incharge users</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Survey ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incharge</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fieldSurveys.map((survey) => (
                      <tr key={survey.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{survey.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{survey.incharge}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{survey.location}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{survey.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            survey.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            survey.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {survey.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{survey.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleSurveyApproval(survey.id, 'approved')}
                              className="btn-success text-xs px-3 py-1"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleSurveyApproval(survey.id, 'rejected')}
                              className="btn-danger text-xs px-3 py-1"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => setSelectedRequest(survey)}
                              className="btn-secondary text-xs px-3 py-1"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drone Fleet Modal */}
      {showDroneFleetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Drone Fleet Management</h3>
              <button
                onClick={() => setShowDroneFleetModal(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Drone Fleet Overview</h4>
                <p className="text-gray-600">Monitor and control all drone operations, sensor data, and fleet status</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {droneFleet.map((drone) => (
                  <div key={drone.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">{drone.id}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        drone.status === 'Active' ? 'bg-green-100 text-green-800' :
                        drone.status === 'Maintenance' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {drone.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600"><span className="font-medium">Model:</span> {drone.model}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Operator:</span> {drone.operator}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Location:</span> {drone.location}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Mission:</span> {drone.missionType}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Battery:</span> {drone.batteryLevel}%</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Sensors:</span> {drone.sensors.join(', ')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDroneDeployment(drone.id, 'deployed')}
                        className="btn-success text-xs px-3 py-1"
                      >
                        Deploy
                      </button>
                      <button
                        onClick={() => handleDroneDeployment(drone.id, 'recalled')}
                        className="btn-danger text-xs px-3 py-1"
                      >
                        Recall
                      </button>
                      <button
                        onClick={() => setSelectedRequest(drone)}
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Overview Modal */}
      {showDataOverviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-pink-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Data Collection Overview</h3>
              <button
                onClick={() => setShowDataOverviewModal(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">All Data Collections</h4>
                <p className="text-gray-600">Monitor all Excel data, changes, and data collection activities from Incharge Dashboard</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sheet Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incharge</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Types</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dataCollectionOverview.map((data, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.sheet}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.records.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.incharge}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.lastUpdated}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            data.status === 'Complete' ? 'bg-green-100 text-green-800' :
                            data.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {data.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{data.dataTypes.join(', ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDataApproval(data.sheet, 'approved')}
                              className="btn-success text-xs px-3 py-1"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDataApproval(data.sheet, 'review')}
                              className="btn-secondary text-xs px-3 py-1"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => setSelectedRequest(data)}
                              className="btn-primary text-xs px-3 py-1"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communication Hub Modal */}
      {showCommunicationHub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Communication Hub</h3>
              <button
                onClick={() => setShowCommunicationHub(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Centralized Communication System</h4>
                <p className="text-gray-600">Send messages, notifications, and alerts to all system users</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">All Messages</h5>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {communicationMessages.map((message) => (
                      <div key={message.id} className={`p-3 rounded-lg border ${
                        message.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{message.from}</span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">To: {message.to}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            message.priority === 'high' ? 'bg-red-100 text-red-800' :
                            message.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {message.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Send Message</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>All Users</option>
                        <option>All Incharges</option>
                        <option>Specific User</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>Normal</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea 
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Type your message here..."
                      />
                    </div>
                    <button 
                      onClick={() => sendBroadcastMessage('Test message')}
                      className="w-full btn-primary"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Modal */}
      {showAuditTrail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-yellow-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Audit Trail</h3>
              <button
                onClick={() => setShowAuditTrail(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Complete System Audit Trail</h4>
                <p className="text-gray-600">Track all system changes, user actions, and approvals for compliance and security</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditTrail.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.user}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{entry.action}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{entry.target}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.ipAddress}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            entry.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedRequest(entry)}
                            className="btn-secondary text-xs px-3 py-1"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
