import React, { useState, useContext } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  LogOut,
  User,
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  MapPin,
  MessageSquare,
  Filter,
  Camera,
  Database,
  Save,
  Plane
} from 'lucide-react';
import AuthContext from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const InchargeDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [droneConnected, setDroneConnected] = useState(false);
  const [surveyData, setSurveyData] = useState({
    surveyDetails: '',
    nearestLandmark: '',
    geoCoordinates: '',
    wardNo: '',
    localityDetails: '',
    inspectionParameters: {
      illegalConstruction: false,
      temperature: false,
      lidarSensor: false,
      imageSensor: false,
      satelliteOverview: false
    },
    droneInfo: {
      modelNo: '',
      serialNo: '',
      operatorName: ''
    },
    manualData: ''
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const departmentStats = {
    totalComplaints: 89,
    pending: 12,
    inProgress: 23,
    resolved: 54,
    teamMembers: 8,
    avgResolutionTime: '2.1 days',
    slaCompliance: '94.2%'
  };

  const teamMembers = [
    { id: 1, name: 'Rajesh Kumar', role: 'Senior Inspector', status: 'Active', complaints: 12, avgTime: '1.8 days' },
    { id: 2, name: 'Priya Sharma', role: 'Inspector', status: 'Active', complaints: 8, avgTime: '2.3 days' },
    { id: 3, name: 'Amit Patel', role: 'Field Officer', status: 'On Leave', complaints: 5, avgTime: '2.1 days' },
    { id: 4, name: 'Sneha Reddy', role: 'Inspector', status: 'Active', complaints: 15, avgTime: '1.9 days' }
  ];

  const assignedComplaints = [
    { id: 'GRV1247', title: 'Major road damage on Highway 101', priority: 'High', assignee: 'Rajesh Kumar', status: 'In Progress', date: '2024-01-15', sla: '2 days left' },
    { id: 'GRV1246', title: 'Water supply disruption in Ward 5', priority: 'High', assignee: 'Priya Sharma', status: 'Assigned', date: '2024-01-15', sla: '3 days left' },
    { id: 'GRV1245', title: 'Illegal construction in residential area', priority: 'Medium', assignee: 'Sneha Reddy', status: 'In Progress', date: '2024-01-14', sla: '1 day left' },
    { id: 'GRV1244', title: 'Street light malfunction', priority: 'Low', assignee: 'Amit Patel', status: 'New', date: '2024-01-14', sla: '5 days left' }
  ];

  const slaAlerts = [
    { id: 1, complaintId: 'GRV1244', title: 'Street light malfunction', assignee: 'Amit Patel', timeLeft: '1 day', severity: 'critical' },
    { id: 2, complaintId: 'GRV1245', title: 'Illegal construction', assignee: 'Sneha Reddy', timeLeft: '2 days', severity: 'warning' },
    { id: 3, complaintId: 'GRV1246', title: 'Water supply issue', assignee: 'Priya Sharma', timeLeft: '3 days', severity: 'warning' }
  ];

  const performanceMetrics = [
    { metric: 'Response Time', current: '2.1 days', target: '2.0 days', status: 'good' },
    { metric: 'Resolution Rate', current: '94.2%', target: '90%', status: 'excellent' },
    { metric: 'Customer Satisfaction', current: '4.2/5', target: '4.0/5', status: 'good' },
    { metric: 'SLA Compliance', current: '94.2%', target: '95%', status: 'warning' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSurveyData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.includes('inspectionParameters.')) {
      const param = name.split('.')[1];
      setSurveyData(prev => ({
        ...prev,
        inspectionParameters: {
          ...prev.inspectionParameters,
          [param]: checked
        }
      }));
    } else {
      setSurveyData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const connectDrone = () => {
    setDroneConnected(true);
    toast.success('Drone connected successfully!');
  };

  const disconnectDrone = () => {
    setDroneConnected(false);
    toast.success('Drone disconnected');
  };

  const startSurvey = () => {
    if (!droneConnected && !surveyData.manualData) {
      toast.error('Please connect drone or enter manual data first');
      return;
    }
    toast.success('Survey started successfully!');
    setShowSurveyForm(false);
    // In real app, this would start the actual survey
  };

  const saveSurveyData = () => {
    toast.success('Survey data saved and uploaded to admin!');
    setShowSurveyForm(false);
    // In real app, this would save to backend
  };

  const autoFetchCoordinates = () => {
    // Simulate GPS coordinates fetch
    const coordinates = `${(28.7041 + Math.random() * 0.01).toFixed(4)}°N, ${(77.1025 + Math.random() * 0.01).toFixed(4)}°E`;
    setSurveyData(prev => ({
      ...prev,
      geoCoordinates: coordinates
    }));
    toast.success('Coordinates fetched automatically!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Garun System</h1>
                <p className="text-sm text-gray-600">Department Incharge Panel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Department Incharge'}</span>
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
            Welcome, {user?.name || 'Department Incharge'}! 🏢
          </h2>
          <p className="text-gray-600">
            Manage your department's complaints, monitor team performance, and conduct field surveys.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setShowSurveyForm(true)}>
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Field Survey</h3>
            <p className="text-gray-600 text-sm">Conduct drone-based or manual field inspections</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drone Management</h3>
            <p className="text-gray-600 text-sm">Connect and manage drone equipment</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Database className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
            <p className="text-gray-600 text-sm">View and manage survey data</p>
          </div>
        </div>

        {/* Department Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{departmentStats.totalComplaints}</p>
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
                <p className="text-2xl font-bold text-gray-900">{departmentStats.resolved}</p>
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
                <p className="text-2xl font-bold text-gray-900">{departmentStats.inProgress}</p>
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
                <p className="text-2xl font-bold text-gray-900">{departmentStats.pending}</p>
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
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{departmentStats.teamMembers}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-bold text-gray-900">{departmentStats.avgResolutionTime}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-teal-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{departmentStats.slaCompliance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SLA Alerts */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">SLA Alerts</h3>
            <span className="text-sm text-gray-500">Time-sensitive actions required</span>
          </div>
          
          <div className="space-y-4">
            {slaAlerts.map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-400' :
                alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'warning' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">ID: {alert.complaintId} • Assigned to: {alert.assignee}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.timeLeft} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View Detailed Report
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Complaints
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Resolution Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'Active' ? 'bg-green-100 text-green-800' :
                        member.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.complaints}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.avgTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    metric.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    metric.status === 'good' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {metric.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{metric.current}</span>
                  <span className="text-sm text-gray-500">Target: {metric.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Complaints */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Assigned Complaints</h3>
            <div className="flex items-center space-x-3">
              <button className="btn-secondary">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="btn-primary">
                <Filter className="h-4 w-4 mr-2" />
                Assign New
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {assignedComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{complaint.title}</p>
                    <p className="text-sm text-gray-600">ID: {complaint.id} • Assigned to: {complaint.assignee}</p>
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
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{complaint.date}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      complaint.sla.includes('1 day') ? 'bg-red-100 text-red-800' :
                      complaint.sla.includes('2 days') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.sla}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Filter className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Assign Complaints</h3>
            <p className="text-xs text-gray-600">Distribute work among team members</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Team Reports</h3>
            <p className="text-xs text-gray-600">Generate performance reports</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Team Chat</h3>
            <p className="text-xs text-gray-600">Communicate with team members</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer">
            <div className="mx-auto h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">SLA Monitor</h3>
            <p className="text-xs text-gray-600">Track SLA compliance</p>
          </div>
        </div>
      </div>

      {/* Survey Form Modal */}
      {showSurveyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Field Survey Form</h3>
              <button
                onClick={() => setShowSurveyForm(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Drone Connection Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Drone Connection</h4>
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    droneConnected ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <Plane className={`h-6 w-6 ${droneConnected ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {droneConnected ? 'Drone Connected' : 'Drone Not Connected'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {droneConnected ? 'Ready for survey' : 'Connect drone to start automated survey'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!droneConnected ? (
                      <button onClick={connectDrone} className="btn-success">
                        Connect Drone
                      </button>
                    ) : (
                      <button onClick={disconnectDrone} className="btn-danger">
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Survey Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="form-label">Survey Details</label>
                  <textarea
                    name="surveyDetails"
                    value={surveyData.surveyDetails}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="3"
                    placeholder="Enter survey purpose and details"
                  />
                </div>

                <div>
                  <label className="form-label">Nearest Landmark</label>
                  <input
                    type="text"
                    name="nearestLandmark"
                    value={surveyData.nearestLandmark}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Metro Station, Shopping Mall"
                  />
                </div>

                <div>
                  <label className="form-label">Geo Coordinates</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="geoCoordinates"
                      value={surveyData.geoCoordinates}
                      onChange={handleInputChange}
                      className="input-field flex-1"
                      placeholder="28.7041°N, 77.1025°E"
                    />
                    <button onClick={autoFetchCoordinates} className="btn-secondary px-4">
                      <MapPin className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">Ward Number</label>
                  <input
                    type="text"
                    name="wardNo"
                    value={surveyData.wardNo}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Ward 5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="form-label">Locality Details</label>
                  <textarea
                    name="localityDetails"
                    value={surveyData.localityDetails}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="2"
                    placeholder="Enter locality description, street names, etc."
                  />
                </div>
              </div>

              {/* Inspection Parameters */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Inspection Parameters</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inspectionParameters.illegalConstruction"
                      checked={surveyData.inspectionParameters.illegalConstruction}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Illegal Construction Detection</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inspectionParameters.temperature"
                      checked={surveyData.inspectionParameters.temperature}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Temperature Sensing</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inspectionParameters.lidarSensor"
                      checked={surveyData.inspectionParameters.lidarSensor}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">LiDAR Sensor</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inspectionParameters.imageSensor"
                      checked={surveyData.inspectionParameters.imageSensor}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Image Sensing</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inspectionParameters.satelliteOverview"
                      checked={surveyData.inspectionParameters.satelliteOverview}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Satellite Overview</span>
                  </label>
                </div>
              </div>

              {/* Drone Information */}
              {droneConnected && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Drone Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Drone Model No.</label>
                      <input
                        type="text"
                        name="droneInfo.modelNo"
                        value={surveyData.droneInfo.modelNo}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., DJI Mavic 3"
                      />
                    </div>
                    <div>
                      <label className="form-label">Serial Number</label>
                      <input
                        type="text"
                        name="droneInfo.serialNo"
                        value={surveyData.droneInfo.serialNo}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., SN123456789"
                      />
                    </div>
                    <div>
                      <label className="form-label">Operator Name</label>
                      <input
                        type="text"
                        name="droneInfo.operatorName"
                        value={surveyData.droneInfo.operatorName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., John Doe"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Data Entry */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Manual Data Entry (JSON Format)</h4>
                <p className="text-sm text-gray-600 mb-2">
                  If you prefer not to use drone, you can enter survey data manually in JSON format
                </p>
                <textarea
                  name="manualData"
                  value={surveyData.manualData}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="6"
                  placeholder='{"location": "Ward 5, Sector A", "findings": "Illegal construction detected", "coordinates": "28.7041°N, 77.1025°E", "images": ["img1.jpg", "img2.jpg"]}'
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowSurveyForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSurveyData}
                  className="btn-success"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save & Upload
                </button>
                <button
                  onClick={startSurvey}
                  className="btn-primary"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InchargeDashboard;
