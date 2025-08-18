import React, { useState, useContext } from 'react';
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
  Search
} from 'lucide-react';
import AuthContext from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const systemStats = {
    totalComplaints: 1247,
    pending: 89,
    inProgress: 156,
    resolved: 1002,
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

  const handleStatusChange = (type, id, newStatus) => {
    toast.success(`${type} status updated to ${newStatus}`);
    // In real app, this would update the backend
  };

  const handleResponseSubmit = (id, response) => {
    toast.success('Response submitted successfully');
    // In real app, this would update the backend
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
          <div className="card p-6">
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

          <div className="card p-6">
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

          <div className="card p-6">
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

          <div className="card p-6">
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
          <div className="card p-6">
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

          <div className="card p-6">
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

          <div className="card p-6">
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

        {/* Priority Alerts */}
        <div className="card p-6 mb-8">
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

        {/* Grievance Platform Responses */}
        <div className="card p-6 mb-8">
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

        {/* Document Verification Requests */}
        <div className="card p-6 mb-8">
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

        {/* Building Permission Requests */}
        <div className="card p-6 mb-8">
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

        {/* Illegal Construction Reports */}
        <div className="card p-6 mb-8">
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

        {/* Department Performance */}
        <div className="card p-6 mb-8">
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
        <div className="card p-6 mb-8">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Manage Users</h3>
            <p className="text-xs text-gray-600">Add, edit, or remove system users</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Analytics</h3>
            <p className="text-xs text-gray-600">View detailed system analytics</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">System Settings</h3>
            <p className="text-xs text-gray-600">Configure system parameters</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Broadcast</h3>
            <p className="text-xs text-gray-600">Send system-wide notifications</p>
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
    </div>
  );
};

export default AdminDashboard;
