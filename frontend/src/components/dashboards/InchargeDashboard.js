import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Plane,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  Map,
  X
} from 'lucide-react';
import AuthContext from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const InchargeDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showDroneManagement, setShowDroneManagement] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [droneConnected, setDroneConnected] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Map state variables
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [heatLayer, setHeatLayer] = useState(null);
  const [markerCluster, setMarkerCluster] = useState(null);
  const [wardSummary, setWardSummary] = useState({});
  const [mapLoading, setMapLoading] = useState(false);
  
  // Wards data
  const wards = [
    { name: 'Sirpur', lat: 22.7006, lng: 75.8133 },
    { name: 'Chandan Nagar', lat: 22.7128, lng: 75.8208 },
    { name: 'Kalani Nagar', lat: 22.7217, lng: 75.8235 },
    { name: 'Sukhdev Nagar', lat: 22.726955, lng: 75.823616 },
    { name: 'Raj Nagar', lat: 22.6696, lng: 75.8294 },
    { name: 'Malharganj', lat: 22.7201, lng: 75.8443 },
    { name: 'Janata Colony', lat: 22.7409, lng: 75.8746 },
    { name: 'Juna Risala', lat: 22.7238, lng: 75.8501 },
    { name: 'Vrindavan', lat: 22.7179, lng: 75.8573 },
    { name: 'Banganga', lat: 22.7496, lng: 75.8429 },
    { name: 'Bhagiratpura', lat: 22.7650, lng: 75.8550 },
    { name: 'Govind Colony', lat: 22.7700, lng: 75.8580 },
    { name: 'Sangam Nagar', lat: 22.7750, lng: 75.8520 },
    { name: 'Ashok Nagar', lat: 22.7800, lng: 75.8570 },
    { name: 'Bijasan', lat: 22.7850, lng: 75.8600 },
    { name: 'Nandbag', lat: 22.7900, lng: 75.8530 },
    { name: 'Kushwa Nagar', lat: 22.7950, lng: 75.8560 },
    { name: 'Santkabir', lat: 22.8000, lng: 75.8520 },
    { name: 'Vishvkarma', lat: 22.8050, lng: 75.8570 },
    { name: 'Gori Nagar', lat: 22.8100, lng: 75.8590 },
    { name: 'Shyam Nagar', lat: 22.8150, lng: 75.8530 },
    { name: 'Pandit Deen Dayal Upadhyay', lat: 22.8200, lng: 75.8570 },
    { name: 'Swargi Rajesh Joshi', lat: 22.8250, lng: 75.8600 },
    { name: 'Sant Balaji Nath Maharaj', lat: 22.8300, lng: 75.8540 },
    { name: 'Shree Ganesh', lat: 22.8350, lng: 75.8560 },
    { name: 'Jeend Mata', lat: 22.8400, lng: 75.8520 },
    { name: 'Pashupati Nath', lat: 22.8450, lng: 75.8570 },
    { name: 'Ma Tulaja Bhawani', lat: 22.8500, lng: 75.8590 },
    { name: 'Dr. Shyama Prasad Mukharji', lat: 22.8550, lng: 75.8530 },
    { name: 'Sant Ravi Das', lat: 22.8600, lng: 75.8570 },
    { name: 'Maharaja Chatrasal', lat: 22.8650, lng: 75.8600 },
    { name: 'Atal Bihari Wajpai', lat: 22.8700, lng: 75.8540 },
    { name: 'Sukhliya', lat: 22.8750, lng: 75.8570 },
    { name: 'Sahid Bhagat Singh', lat: 22.8800, lng: 75.8590 },
    { name: 'Lasudiya Mori', lat: 22.8850, lng: 75.8520 },
    { name: 'Nipaniya', lat: 22.8900, lng: 75.8560 },
    { name: 'Sai Kirpa', lat: 22.8950, lng: 75.8600 },
    { name: 'Haji Colony', lat: 22.9000, lng: 75.8540 },
    { name: 'Naharshawali', lat: 22.9050, lng: 75.8570 },
    { name: 'Khajrana Ganesh', lat: 22.9100, lng: 75.8590 },
    { name: 'Kelash Puri', lat: 22.9150, lng: 75.8530 },
    { name: 'Suwami Vivekanand', lat: 22.9200, lng: 75.8560 },
    { name: 'Shree Nagar', lat: 22.9250, lng: 75.8600 },
    { name: 'H.I.G', lat: 22.9300, lng: 75.8540 },
    { name: 'Dr. Bhimrao Ambedkar', lat: 22.9350, lng: 75.8570 },
    { name: 'Somnath', lat: 22.9400, lng: 75.8590 },
    { name: 'Sardar Wallabh bhai', lat: 22.9450, lng: 75.8530 },
    { name: 'Geeta Bhawan', lat: 22.9500, lng: 75.8560 },
    { name: 'Tilak Nagar', lat: 22.9550, lng: 75.8600 },
    { name: 'Brajeshwari', lat: 22.9600, lng: 75.8540 },
    { name: 'Bhagwati Nagar', lat: 22.9650, lng: 75.8570 },
    { name: 'Musakhedi', lat: 22.9700, lng: 75.8590 },
    { name: 'Dr. Molana Ajad Nagar', lat: 22.9750, lng: 75.8530 },
    { name: 'Residence', lat: 22.9800, lng: 75.8560 },
    { name: 'South Tukuganj', lat: 22.9850, lng: 75.8600 },
    { name: 'Shanelatagunj', lat: 22.9900, lng: 75.8540 },
    { name: 'Devi Ahilyabai', lat: 22.9950, lng: 75.8570 },
    { name: 'Imli Bazar', lat: 23.0000, lng: 75.8590 },
    { name: 'Harsaddi', lat: 23.0050, lng: 75.8530 },
    { name: 'Ranipura', lat: 23.0100, lng: 75.8560 },
    { name: 'Tatiya Sarwate', lat: 23.0150, lng: 75.8600 },
    { name: 'Rauji Bazar', lat: 23.0200, lng: 75.8540 },
    { name: 'Nolakhkha', lat: 23.0250, lng: 75.8570 },
    { name: 'Chitawad', lat: 23.0300, lng: 75.8590 },
    { name: 'Sant Kawar ram', lat: 23.0350, lng: 75.8530 },
    { name: 'Sahid Hemu Kalani', lat: 23.0400, lng: 75.8560 },
    { name: 'Maharaja Holkar', lat: 23.0450, lng: 75.8600 },
    { name: 'Bambai Bazar', lat: 23.0500, lng: 75.8540 },
    { name: 'Jawahar Marg', lat: 23.0550, lng: 75.8570 },
    { name: 'Loknayak Nagar', lat: 23.0600, lng: 75.8590 },
    { name: 'Dravind Nagar', lat: 23.0650, lng: 75.8530 },
    { name: 'Lokmaniya Nagar', lat: 23.0700, lng: 75.8560 },
    { name: 'Lakshman Singh Choun', lat: 23.0750, lng: 75.8600 },
    { name: 'Vishnupuri', lat: 23.0800, lng: 75.8540 },
    { name: 'Palda', lat: 23.0850, lng: 75.8570 },
    { name: 'Mundla Nayta', lat: 23.0900, lng: 75.8590 },
    { name: 'Bilawali', lat: 23.0950, lng: 75.8530 },
    { name: 'Chohitram', lat: 23.1000, lng: 75.8560 },
    { name: 'Sukh Niwas', lat: 23.1050, lng: 75.8600 },
    { name: 'Dr. Rajendra Prasad', lat: 23.1100, lng: 75.8540 },
    { name: 'Annpurna', lat: 23.1150, lng: 75.8570 },
    { name: 'Sudama Nagar', lat: 23.1200, lng: 75.8590 },
    { name: 'Gumasta Nagar', lat: 23.1250, lng: 75.8530 },
    { name: 'Duwarkapuri', lat: 23.1300, lng: 75.8560 },
    { name: 'Prajapat Nagar', lat: 23.1350, lng: 75.8600 }
  ];

  // Fixed constructions data
  const fixedConstructions = wards.map((w, index) => {
    return {
      wardName: w.name,
      wardNumber: index + 1,
      constructions: [
        { status: 'Illegal', severity: 'Medium', confidence: 90, lat: w.lat + 0.001, lng: w.lng + 0.001, address: `${w.name}, Indore, MP` },
        { status: 'Legal', severity: null, confidence: 95, lat: w.lat - 0.001, lng: w.lng - 0.001, address: `${w.name}, Indore, MP` },
        { status: 'Illegal', severity: 'High', confidence: 88, lat: w.lat, lng: w.lng + 0.002, address: `${w.name}, Indore, MP` }
      ]
    };
  });
  
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
      operatorName: '',
      memoryType: '',
      wifiStatus: false
    },
    measuringParameters: {
      roadWidth: '',
      maxBuildingHeight: '',
      buildingArea: '',
      setbackDistance: '',
      floorCount: '',
      constructionType: ''
    },
    dataProcessing: {
      method: '',
      realTimeProcessing: false,
      fileUploadProcessing: false,
      externalDataProcessing: false
    },
    manualData: '',
    uploadedFiles: []
  });

  const [droneManagementData, setDroneManagementData] = useState({
    drones: [
      {
        id: 'DRONE001',
        uin: 'UIN123456789',
        make: 'DJI',
        model: 'Mavic 3 Enterprise',
        status: 'Active',
        batteryLevel: 85,
        flightMode: 'Auto',
        altitudeLimit: 120,
        speedLimit: 25,
        payloadType: 'Camera + Lidar',
        communicationLink: '2.4GHz + 4G',
        geoFencing: {
          enabled: true,
          coordinates: '28.7041°N, 77.1025°E, 28.7141°N, 77.1125°E'
        },
        npntCompliance: true,
        sensors: {
          gps: {
            enabled: true,
            accuracy: '±2m',
            updateRate: '5 Hz',
            dataFormat: 'NMEA + JSON'
          },
          imu: {
            enabled: true,
            sensitivity: 'High',
            drift: 'Low',
            updateRate: '100 Hz'
          },
          barometer: {
            enabled: true,
            heightRange: '0-500m',
            accuracy: '±15cm',
            dataFormat: 'JSON'
          },
          lidar: {
            enabled: true,
            maxRange: '200m',
            resolution: 'High',
            dataFormat: 'Point Cloud (.LAS)'
          },
          camera: {
            enabled: true,
            resolution: '4K',
            fps: '30',
            zoom: '10x Optical'
          },
          adsb: {
            enabled: true,
            icaoCode: 'ABCD1234',
            transmissionInterval: '1s'
          },
          payload: {
            multispectral: false,
            gasSensor: false,
            thermal: true
          }
        }
      }
    ],
    selectedDrone: 0,
    fleetMode: false,
    swarmSettings: {
      enabled: false,
      collisionAvoidance: true,
      dataSync: true,
      meshNetworking: false
    }
  });

  const [excelData, setExcelData] = useState({
    sheets: [],
    selectedSheet: 0,
    data: [],
    headers: [],
    expandedRows: new Set(),
    searchTerm: '',
    filteredData: [],
    isLoading: false
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  // Fetch surveys from backend
  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/surveys/all');
        if (response.ok) {
          const data = await response.json();
          setSurveys(data.surveys || []);
        } else {
          console.error('Failed to fetch surveys');
        }
      } catch (error) {
        console.error('Error fetching surveys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

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
    // Navigate to the survey form
    navigate('/survey-form');
  };

  const confirmStartSurvey = () => {
    toast.success('Survey started successfully!');
    setShowVerificationPopup(false);
    setShowSurveyForm(false);
    // In real app, this would start the actual survey
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSurveyData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }));
    toast.success(`${files.length} file(s) uploaded successfully!`);
  };

  const removeFile = (index) => {
    setSurveyData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  };

  const handleDroneInputChange = (e, droneIndex, sensorType = null, sensorKey = null) => {
    const { name, value, type, checked } = e.target;
    
    if (sensorType && sensorKey) {
      setDroneManagementData(prev => ({
        ...prev,
        drones: prev.drones.map((drone, index) => 
          index === droneIndex 
            ? {
                ...drone,
                sensors: {
                  ...drone.sensors,
                  [sensorType]: {
                    ...drone.sensors[sensorType],
                    [sensorKey]: type === 'checkbox' ? checked : value
                  }
                }
              }
            : drone
        )
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setDroneManagementData(prev => ({
        ...prev,
        drones: prev.drones.map((drone, index) => 
          index === droneIndex 
            ? {
                ...drone,
                [parent]: {
                  ...drone[parent],
                  [child]: type === 'checkbox' ? checked : value
                }
              }
            : drone
        )
      }));
    } else {
      setDroneManagementData(prev => ({
        ...prev,
        drones: prev.drones.map((drone, index) => 
          index === droneIndex 
            ? { ...drone, [name]: type === 'checkbox' ? checked : value }
            : drone
        )
      }));
    }
  };

  const addNewDrone = () => {
    const newDrone = {
      id: `DRONE${String(droneManagementData.drones.length + 1).padStart(3, '0')}`,
      uin: `UIN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      make: 'DJI',
      model: 'Mavic 3 Enterprise',
      status: 'Inactive',
      batteryLevel: 100,
      flightMode: 'Manual',
      altitudeLimit: 120,
      speedLimit: 25,
      payloadType: 'Camera',
      communicationLink: '2.4GHz',
      geoFencing: {
        enabled: false,
        coordinates: ''
      },
      npntCompliance: false,
      sensors: {
        gps: { enabled: true, accuracy: '±5m', updateRate: '1 Hz', dataFormat: 'NMEA' },
        imu: { enabled: true, sensitivity: 'Medium', drift: 'Medium', updateRate: '50 Hz' },
        barometer: { enabled: true, heightRange: '0-300m', accuracy: '±20cm', dataFormat: 'CSV' },
        lidar: { enabled: false, maxRange: '100m', resolution: 'Medium', dataFormat: 'CSV' },
        camera: { enabled: true, resolution: '1080p', fps: '24', zoom: 'None' },
        adsb: { enabled: false, icaoCode: '', transmissionInterval: '5s' },
        payload: { multispectral: false, gasSensor: false, thermal: false }
      }
    };
    
    setDroneManagementData(prev => ({
      ...prev,
      drones: [...prev.drones, newDrone]
    }));
    toast.success('New drone added successfully!');
  };

  const removeDrone = (droneIndex) => {
    setDroneManagementData(prev => ({
      ...prev,
      drones: prev.drones.filter((_, index) => index !== droneIndex)
    }));
    toast.success('Drone removed successfully!');
  };

  const toggleFleetMode = () => {
    setDroneManagementData(prev => ({
      ...prev,
      fleetMode: !prev.fleetMode
    }));
  };

  const loadExcelData = async () => {
    try {
      setExcelData(prev => ({ ...prev, headers: [], data: [], isLoading: true })); // Reset data while loading
      
      const response = await fetch('/Indore Data Collection 2025.xlsx');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      const sheets = workbook.SheetNames;
      if (sheets.length === 0) {
        throw new Error('No sheets found in Excel file');
      }
      
      const firstSheet = workbook.Sheets[sheets[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      
      if (jsonData.length > 0) {
        const headers = jsonData[0];
        const data = jsonData.slice(1).map((row, index) => {
          const rowData = {};
          headers.forEach((header, colIndex) => {
            rowData[header] = row[colIndex] || '';
          });
          rowData.id = index;
          return rowData;
        });

        setExcelData(prev => ({
          ...prev,
          sheets,
          data,
          headers,
          filteredData: data,
          isLoading: false
        }));
        
        toast.success(`Loaded ${data.length} records from ${sheets[0]} sheet`);
      } else {
        throw new Error('No data found in Excel file');
      }
    } catch (error) {
      console.error('Error loading Excel file:', error);
      toast.error(`Failed to load Excel data: ${error.message}`);
      
      // Set some sample data for demonstration
      setExcelData(prev => ({
        ...prev,
        sheets: ['Sample Sheet'],
        data: [],
        headers: [],
        filteredData: [],
        isLoading: false
      }));
    }
  };

  const handleSheetChange = async (sheetIndex) => {
    try {
      setExcelData(prev => ({ ...prev, selectedSheet: sheetIndex, headers: [], data: [], isLoading: true }));
      
      const response = await fetch('/Indore Data Collection 2025.xlsx');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      const sheetName = workbook.SheetNames[sheetIndex];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      if (jsonData.length > 0) {
        const headers = jsonData[0];
        const data = jsonData.slice(1).map((row, index) => {
          const rowData = {};
          headers.forEach((header, colIndex) => {
            rowData[header] = row[colIndex] || '';
          });
          rowData.id = index;
          return rowData;
        });

        setExcelData(prev => ({
          ...prev,
          data,
          headers,
          filteredData: data,
          expandedRows: new Set(), // Reset expanded rows for new sheet
          isLoading: false
        }));
        
        toast.success(`Loaded ${data.length} records from ${sheetName} sheet`);
      } else {
        throw new Error('No data found in selected sheet');
      }
    } catch (error) {
      console.error('Error loading sheet:', error);
      toast.error(`Failed to load sheet: ${error.message}`);
      setExcelData(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleRowExpansion = (rowId) => {
    setExcelData(prev => {
      const newExpandedRows = new Set(prev.expandedRows);
      if (newExpandedRows.has(rowId)) {
        newExpandedRows.delete(rowId);
      } else {
        newExpandedRows.add(rowId);
      }
      return { ...prev, expandedRows: newExpandedRows };
    });
  };

  const handleSearch = (searchTerm) => {
    setExcelData(prev => {
      const filtered = prev.data.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      return { ...prev, searchTerm, filteredData: filtered };
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      excelData.headers.join(','),
      ...excelData.filteredData.map(row => 
        excelData.headers.map(header => 
          `"${String(row[header] || '').replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Indore_Data_${excelData.sheets[excelData.selectedSheet]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Data exported to CSV successfully!');
  };

  useEffect(() => {
    if (showDataManagement) {
      loadExcelData();
    }
  }, [showDataManagement]);

  // Map functionality
  useEffect(() => {
    if (showMapView) {
      // Load Leaflet CSS and JS dynamically
      const loadLeaflet = async () => {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!window.L) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => {
            // After Leaflet loads, load the marker cluster plugin
            loadMarkerCluster();
          };
          document.head.appendChild(script);
        } else {
          loadMarkerCluster();
        }
      };

      const loadMarkerCluster = () => {
        // Load marker cluster CSS
        if (!document.querySelector('link[href*="markercluster"]')) {
          const clusterCSS = document.createElement('link');
          clusterCSS.rel = 'stylesheet';
          clusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css';
          document.head.appendChild(clusterCSS);
          
          const clusterDefaultCSS = document.createElement('link');
          clusterDefaultCSS.rel = 'stylesheet';
          clusterDefaultCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
          document.head.appendChild(clusterDefaultCSS);
        }

        // Load marker cluster JS
        if (!window.L.markerClusterGroup) {
          const clusterScript = document.createElement('script');
          clusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
          clusterScript.onload = loadHeatLayer;
          document.head.appendChild(clusterScript);
        } else {
          loadHeatLayer();
        }
      };

      const loadHeatLayer = () => {
        // Load heat layer plugin if not available
        if (!window.L.heatLayer) {
          const heatScript = document.createElement('script');
          heatScript.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
          heatScript.onload = initializeMap;
          document.head.appendChild(heatScript);
        } else {
          initializeMap();
        }
      };

      loadLeaflet();
    }

    // Cleanup when map view is closed
    return () => {
      if (!showMapView) {
        // Cleanup map resources
        if (mapInstance && mapInstance._container) {
          mapInstance.remove();
          setMapInstance(null);
        }
        setMarkers([]);
        setHeatLayer(null);
        setMarkerCluster(null);
        setWardSummary({});
        setMapLoading(false);
      }
    };
  }, [showMapView]); // Removed mapInstance dependency to prevent infinite loops

  // Initialize map
  const initializeMap = () => {
    if (window.L && !mapInstance) {
      setMapLoading(true);
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
          const map = window.L.map('map').setView([22.7196, 75.8577], 12);
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          setMapInstance(map);
          
          // Initialize marker cluster if available, otherwise use regular layer group
          if (window.L.markerClusterGroup) {
            setMarkerCluster(window.L.markerClusterGroup());
          } else {
            // Fallback to regular layer group if clustering is not available
            setMarkerCluster(window.L.layerGroup());
          }
          
          setMapLoading(false);
          
          // Add some sample data to show the map is working
          setTimeout(() => {
            showConstructions([fixedConstructions[0]]); // Show first ward as example
          }, 500);
        }
      }, 100);
    }
  };

  // Reset map and charts
  const resetMap = () => {
    if (markers.length > 0 && markerCluster) {
      // Remove markers from cluster/layer group
      markers.forEach(m => {
        if (markerCluster.removeLayer) {
          markerCluster.removeLayer(m);
        }
      });
      setMarkers([]);
    }
    
    if (heatLayer && mapInstance) {
      try {
        mapInstance.removeLayer(heatLayer);
      } catch (error) {
        console.warn('Error removing heat layer:', error);
      }
      setHeatLayer(null);
    }
    
    setWardSummary({});
    
    // Clear detected list table
    const detectedList = document.getElementById('detectedList');
    if (detectedList) {
      detectedList.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-4 text-center text-gray-500">
            Select a ward or show full Indore to view constructions
          </td>
        </tr>
      `;
    }
  };

  // Show constructions on map
  const showConstructions = (data) => {
    if (!mapInstance || !markerCluster) return;

    resetMap();
    
    const newMarkers = [];
    const heatPoints = [];
    const bounds = [];

    data.forEach(ward => {
      ward.constructions.forEach(cons => {
        const color = cons.status === 'Illegal' ? 'red' : 'green';
        const icon = window.L.divIcon({
          html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:2px solid #fff;"></div>`,
          className: 'custom-icon',
          iconSize: [16, 16]
        });
        
        const marker = window.L.marker([cons.lat, cons.lng], { icon });
        marker.bindTooltip(`<b>Ward #${ward.wardNumber}: ${ward.wardName}</b><br>Status: ${cons.status}<br>${cons.status === 'Illegal' ? `Severity: ${cons.severity}<br>` : ''}Confidence: ${cons.confidence}%<br>Address: ${cons.address}<br>Lat: ${cons.lat.toFixed(5)}, Lng: ${cons.lng.toFixed(5)}`);
        
        // Add marker to cluster/layer group
        if (markerCluster.addLayer) {
          markerCluster.addLayer(marker);
        } else {
          markerCluster.addLayer(marker);
        }
        
        newMarkers.push(marker);
        bounds.push([cons.lat, cons.lng]);

        // Add to detected list
        const detectedList = document.getElementById('detectedList');
        if (detectedList) {
          const row = document.createElement('tr');
          row.className = 'hover:bg-gray-50 cursor-pointer';
          row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">${ward.wardName}</div>
              <div class="text-sm text-gray-500">Ward #${ward.wardNumber}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                cons.status === 'Illegal' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }">
                ${cons.status}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${cons.status === 'Illegal' ? (cons.severity || 'N/A') : 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${cons.confidence}%
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${cons.address}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${cons.lat.toFixed(5)}, ${cons.lng.toFixed(5)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                onclick="this.closest('tr').scrollIntoView({behavior: 'smooth'})"
              >
                Focus
              </button>
            </td>
          `;
          
          // Add click event to focus on map
          row.onclick = () => {
            mapInstance.setView([cons.lat, cons.lng], 16);
            marker.openTooltip();
          };
          
          detectedList.appendChild(row);
        }

        heatPoints.push([cons.lat, cons.lng, cons.status === 'Illegal' ? 0.9 : 0.5]);
        
        setWardSummary(prev => ({
          ...prev,
          [ward.wardName]: (prev[ward.wardName] || 0) + 1
        }));
      });
    });

    setMarkers(newMarkers);
    
    // Add marker cluster/layer group to map
    if (mapInstance.addLayer) {
      mapInstance.addLayer(markerCluster);
    }
    
    if (bounds.length > 0) {
      mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }

    // Create heat layer if plugin is available
    if (window.L.heatLayer) {
      try {
        const newHeatLayer = window.L.heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 17 });
        newHeatLayer.addTo(mapInstance);
        setHeatLayer(newHeatLayer);
      } catch (error) {
        console.warn('Heat layer plugin not available:', error);
      }
    }

    toast.success(`Detection complete for ${data.length} ward(s)!`);
  };

  // Detect specific ward
  const detectWard = () => {
    if (!mapInstance) {
      toast.error("Map is still loading. Please wait a moment.");
      return;
    }
    
    try {
      const wardNumberInput = document.querySelector('input[type="number"]');
      const wardNameInput = document.querySelector('input[placeholder="Ward Name"]');
      
      const wardNumber = parseInt(wardNumberInput?.value);
      const wardName = wardNameInput?.value?.trim();
      
      if (!wardNumber && !wardName) {
        toast.error("Please enter Ward Number or Name!");
        return;
      }
      
      const wardIndex = wardNumber ? wardNumber - 1 : wards.findIndex(n => n.name.toLowerCase() === wardName.toLowerCase());
      if (wardIndex < 0 || wardIndex >= wards.length) {
        toast.error("Ward not found!");
        return;
      }
      
      showConstructions([fixedConstructions[wardIndex]]);
    } catch (error) {
      console.error('Error detecting ward:', error);
      toast.error("An error occurred while detecting the ward. Please try again.");
    }
  };

  // Show full Indore
  const showFullIndore = () => {
    if (!mapInstance) {
      toast.error("Map is still loading. Please wait a moment.");
      return;
    }
    
    try {
      resetMap();
      showConstructions(fixedConstructions);
    } catch (error) {
      console.error('Error showing full Indore:', error);
      toast.error("An error occurred while loading the full map. Please try again.");
    }
  };

  // Auto-fill ward name when ward number changes
  const handleWardNumberChange = (e) => {
    try {
      const num = parseInt(e.target.value);
      const wardNameInput = document.querySelector('input[placeholder="Ward Name"]');
      if (wardNameInput) {
        if (num >= 1 && num <= 85) {
          const ward = wards[num - 1];
          if (ward) {
            wardNameInput.value = ward.name;
          } else {
            wardNameInput.value = '';
          }
        } else {
          wardNameInput.value = '';
        }
      }
    } catch (error) {
      console.warn('Error handling ward number change:', error);
    }
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

  const openFullScreenMap = () => {
    if (!mapInstance) {
      toast.error("Map is still loading. Please wait a moment.");
      return;
    }

    try {
      // Create a new window with just the map
      const mapWindow = window.open('', '_blank', 'width=1920,height=1080,scrollbars=yes,resizable=yes');
      
      if (!mapWindow) {
        toast.error("Please allow popups to open the full screen map.");
        return;
      }

      // Create the HTML content for the new window
      const mapHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>UrbanGuard - Full Screen Map</title>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>
          <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css"/>
          <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css"/>
          <script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif; 
              background: #f3f4f6; 
            }
            .header {
              background: linear-gradient(to right, #dc2626, #ea580c);
              color: white;
              padding: 1rem;
              text-align: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header h1 {
              margin: 0;
              font-size: 1.5rem;
              font-weight: bold;
            }
            .header p {
              margin: 0.5rem 0 0 0;
              opacity: 0.9;
              font-size: 0.875rem;
            }
            .controls {
              background: white;
              padding: 1rem;
              border-bottom: 1px solid #e5e7eb;
              display: flex;
              gap: 1rem;
              align-items: center;
              flex-wrap: wrap;
            }
            .btn {
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 0.5rem;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }
            .btn-primary {
              background: #2563eb;
              color: white;
            }
            .btn-primary:hover {
              background: #1d4ed8;
            }
            .btn-secondary {
              background: #6b7280;
              color: white;
            }
            .btn-secondary:hover {
              background: #4b5563;
            }
            .btn-danger {
              background: #dc2626;
              color: white;
            }
            .btn-danger:hover {
              background: #b91c1c;
            }
            .map-container {
              height: calc(100vh - 120px);
              width: 100%;
            }
            .info-panel {
              position: absolute;
              top: 140px;
              right: 20px;
              background: white;
              padding: 1rem;
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              max-width: 300px;
              z-index: 1000;
            }
            .info-item {
              margin-bottom: 0.5rem;
              padding: 0.5rem;
              background: #f9fafb;
              border-radius: 0.25rem;
            }
            .info-label {
              font-weight: 600;
              color: #374151;
              font-size: 0.875rem;
            }
            .info-value {
              color: #6b7280;
              font-size: 0.875rem;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>UrbanGuard - Indore Detection</h1>
            <p>Full Screen Illegal Construction Detection Map</p>
          </div>
          
          <div class="controls">
            <button class="btn btn-primary" onclick="detectWard()">Detect Ward</button>
            <button class="btn btn-secondary" onclick="showFullIndore()">Show Full Indore</button>
            <button class="btn btn-danger" onclick="window.close()">Close Window</button>
          </div>
          
          <div id="map" class="map-container"></div>
          
          <div class="info-panel">
            <h3 style="margin: 0 0 1rem 0; color: #374151;">Map Controls</h3>
            <div class="info-item">
              <div class="info-label">Zoom:</div>
              <div class="info-value">Mouse wheel or +/- buttons</div>
            </div>
            <div class="info-item">
              <div class="info-label">Pan:</div>
              <div class="info-value">Click and drag</div>
            </div>
            <div class="info-item">
              <div class="info-label">Markers:</div>
              <div class="info-value">Click for details</div>
            </div>
            <div class="info-item">
              <div class="info-label">Heat Map:</div>
              <div class="info-value">Red = Illegal, Green = Legal</div>
            </div>
          </div>
          
          <script>
            // Initialize map
            const map = L.map('map').setView([22.7196, 75.8577], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap'
            }).addTo(map);
            
            let markers = [];
            let heatLayer = null;
            let markerCluster = L.markerClusterGroup();
            
            // Wards data
            const wards = ${JSON.stringify(wards)};
            
            // Fixed constructions data
            const fixedConstructions = ${JSON.stringify(fixedConstructions)};
            
            // Reset map
            function resetMap() {
              if (markers.length > 0 && markerCluster) {
                markers.forEach(m => markerCluster.removeLayer(m));
                markers = [];
              }
              if (heatLayer) {
                map.removeLayer(heatLayer);
                heatLayer = null;
              }
            }
            
            // Show constructions
            function showConstructions(data) {
              resetMap();
              
              const newMarkers = [];
              const heatPoints = [];
              const bounds = [];
              
              data.forEach(ward => {
                ward.constructions.forEach(cons => {
                  const color = cons.status === 'Illegal' ? 'red' : 'green';
                  const icon = L.divIcon({
                    html: \`<div style="background:\${color}; width:16px; height:16px; border-radius:50%; border:2px solid #fff;"></div>\`,
                    className: 'custom-icon',
                    iconSize: [16, 16]
                  });
                  
                  const marker = L.marker([cons.lat, cons.lng], { icon });
                  marker.bindTooltip(\`
                    <b>Ward #\${ward.wardNumber}: \${ward.wardName}</b><br>
                    Status: \${cons.status}<br>
                    \${cons.status === 'Illegal' ? \`Severity: \${cons.severity}<br>\` : ''}
                    Confidence: \${cons.confidence}%<br>
                    Address: \${cons.address}<br>
                    Lat: \${cons.lat.toFixed(5)}, Lng: \${cons.lng.toFixed(5)}
                  \`);
                  
                  markerCluster.addLayer(marker);
                  newMarkers.push(marker);
                  bounds.push([cons.lat, cons.lng]);
                  heatPoints.push([cons.lat, cons.lng, cons.status === 'Illegal' ? 0.9 : 0.5]);
                });
              });
              
              markers = newMarkers;
              map.addLayer(markerCluster);
              
              if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
              }
              
              // Create heat layer
              if (L.heatLayer) {
                heatLayer = L.heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 17 });
                heatLayer.addTo(map);
              }
            }
            
            // Detect specific ward
            function detectWard() {
              const wardNumber = prompt('Enter Ward Number (1-85):');
              if (!wardNumber) return;
              
              const wardIndex = parseInt(wardNumber) - 1;
              if (wardIndex < 0 || wardIndex >= wards.length) {
                alert('Ward not found!');
                return;
              }
              
              showConstructions([fixedConstructions[wardIndex]]);
            }
            
            // Show full Indore
            function showFullIndore() {
              resetMap();
              showConstructions(fixedConstructions);
            }
            
            // Load initial data
            setTimeout(() => {
              showConstructions([fixedConstructions[0]]);
            }, 500);
          </script>
        </body>
        </html>
      `;

      // Write the HTML to the new window
      mapWindow.document.write(mapHTML);
      mapWindow.document.close();
      
      // Focus the new window
      mapWindow.focus();
      
      toast.success('Full screen map opened in new window!');
    } catch (error) {
      console.error('Error opening full screen map:', error);
      toast.error('Failed to open full screen map. Please try again.');
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setShowSurveyForm(true)}>
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Field Survey</h3>
            <p className="text-gray-600 text-sm">Conduct drone-based or manual field inspections</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setShowDroneManagement(true)}>
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drone Management</h3>
            <p className="text-gray-600 text-sm">Connect and manage drone equipment</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setShowDataManagement(true)}>
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Database className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
            <p className="text-gray-600 text-sm">View and manage survey data</p>
          </div>

          <div className="card p-6 text-center hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setShowMapView(true)}>
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Map className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Load Map View</h3>
            <p className="text-gray-600 text-sm">View illegal construction detection map</p>
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
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
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
              {/* Essential Survey Fields */}
              <div className="space-y-6">
                    <div>
                  <label className="form-label">Ward Number *</label>
                  <input
                    type="text"
                    name="wardNo"
                    value={surveyData.wardNo}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Ward 5"
                  />
                  </div>
                  
                    <div>
                  <label className="form-label">Locality Name *</label>
                  <input
                    type="text"
                    name="localityDetails"
                    value={surveyData.localityDetails}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Vijay Nagar, Rajendra Nagar"
                  />
                </div>

                <div>
                  <label className="form-label">Area Name *</label>
                  <input
                    type="text"
                    name="nearestLandmark"
                    value={surveyData.nearestLandmark}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Indore, Madhya Pradesh"
                  />
                </div>

                <div>
                  <label className="form-label">Coordinates *</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="geoCoordinates"
                      value={surveyData.geoCoordinates}
                      onChange={handleInputChange}
                      className="input-field flex-1"
                      placeholder="28.7041°N, 77.1025°E"
                    />
                    <button 
                      onClick={autoFetchCoordinates} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>Auto</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">Survey Purpose *</label>
                  <textarea
                    name="surveyDetails"
                    value={surveyData.surveyDetails}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="3"
                    placeholder="Brief description of survey purpose and objectives"
                  />
              </div>

                  <div>
                    <label className="form-label">Construction Type</label>
                    <select
                      name="measuringParameters.constructionType"
                      value={surveyData.measuringParameters.constructionType}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select Type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="mixed">Mixed Use</option>
                      <option value="government">Government</option>
                    </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowSurveyForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={startSurvey}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center space-x-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>Start Survey</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Popup Modal */}
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Survey Start</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to start the field survey? This action will begin data collection and cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowVerificationPopup(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStartSurvey}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Start Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drone Management Modal */}
      {showDroneManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-7xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-green-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Drone Management System</h3>
              <button
                onClick={() => setShowDroneManagement(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Fleet Management Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Fleet Management</h4>
                  <p className="text-gray-600">Manage multiple drones, sensors, and configurations</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleFleetMode}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      droneManagementData.fleetMode 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {droneManagementData.fleetMode ? 'Fleet Mode: ON' : 'Fleet Mode: OFF'}
                  </button>
                  <button
                    onClick={addNewDrone}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    + Add New Drone
                  </button>
                </div>
              </div>

              {/* Drone Selection Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {droneManagementData.drones.map((drone, index) => (
                    <button
                      key={drone.id}
                      onClick={() => setDroneManagementData(prev => ({ ...prev, selectedDrone: index }))}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        droneManagementData.selectedDrone === index
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {drone.id} - {drone.make} {drone.model}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        drone.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {drone.status}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Selected Drone Configuration */}
              {droneManagementData.drones[droneManagementData.selectedDrone] && (
                <div className="space-y-6">
                  {/* Basic Drone Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="form-label">Drone ID</label>
                      <input
                        type="text"
                        value={droneManagementData.drones[droneManagementData.selectedDrone].id}
                        onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone)}
                        name="id"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="form-label">UIN (Unique Identification Number)</label>
                      <input
                        type="text"
                        value={droneManagementData.drones[droneManagementData.selectedDrone].uin}
                        onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone)}
                        name="uin"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="form-label">Make</label>
                      <select
                        value={droneManagementData.drones[droneManagementData.selectedDrone].make}
                        onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone)}
                        name="make"
                        className="input-field"
                      >
                        <option value="DJI">DJI</option>
                        <option value="Parrot">Parrot</option>
                        <option value="Autel">Autel</option>
                        <option value="Yuneec">Yuneec</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Model</label>
                      <input
                        type="text"
                        value={droneManagementData.drones[droneManagementData.selectedDrone].model}
                        onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone)}
                        name="model"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="form-label">Flight Mode</label>
                      <select
                        value={droneManagementData.drones[droneManagementData.selectedDrone].flightMode}
                        onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone)}
                        name="flightMode"
                        className="input-field"
                      >
                        <option value="Manual">Manual</option>
                        <option value="Auto">Auto</option>
                        <option value="Return-to-Home">Return-to-Home</option>
                        <option value="Waypoint">Waypoint</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Status</label>
                      <select
                        value={droneManagementData.drones[droneManagementData.selectedDrone].status}
                        onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone)}
                        name="status"
                        className="input-field"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Charging">Charging</option>
                      </select>
                    </div>
                  </div>

                  {/* Flight Parameters */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Flight Parameters (DGCA Compliant)</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="form-label">Altitude Limit (m AGL)</label>
                        <input
                          type="number"
                          value={droneManagementData.drones[droneManagementData.selectedDrone].altitudeLimit}
                          onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone)}
                          name="altitudeLimit"
                          className="input-field"
                          min="0"
                          max="120"
                          step="1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max: 120m (DGCA Limit)</p>
                      </div>
                      <div>
                        <label className="form-label">Speed Limit (m/s)</label>
                        <input
                          type="number"
                          value={droneManagementData.drones[droneManagementData.selectedDrone].speedLimit}
                          onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone)}
                          name="speedLimit"
                          className="input-field"
                          min="0"
                          max="25"
                          step="1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max: 25 m/s</p>
                      </div>
                      <div>
                        <label className="form-label">Payload Type</label>
                        <select
                          value={droneManagementData.drones[droneManagementData.selectedDrone].payloadType}
                          onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone)}
                          name="payloadType"
                          className="input-field"
                        >
                          <option value="Camera">Camera</option>
                          <option value="Camera + Lidar">Camera + Lidar</option>
                          <option value="Sprayer">Sprayer</option>
                          <option value="Sensor Package">Sensor Package</option>
                          <option value="Delivery">Delivery</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Communication Link</label>
                        <select
                          value={droneManagementData.drones[droneManagementData.selectedDrone].communicationLink}
                          onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone)}
                          name="communicationLink"
                          className="input-field"
                        >
                          <option value="2.4GHz">2.4GHz</option>
                          <option value="5GHz">5GHz</option>
                          <option value="4G">4G</option>
                          <option value="5G">5G</option>
                          <option value="2.4GHz + 4G">2.4GHz + 4G</option>
                          <option value="SATCOM">SATCOM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Sensor Configuration */}
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Sensor Configuration</h5>
                    
                    {/* GPS/GNSS Sensor */}
                    <div className="mb-6 p-4 bg-white rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="font-semibold text-gray-900">GPS/GNSS Sensor</h6>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={droneManagementData.drones[droneManagementData.selectedDrone].sensors.gps.enabled}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'gps', 'enabled')}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Enabled</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="form-label">Accuracy</label>
                          <select
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.gps.accuracy}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'gps', 'accuracy')}
                            className="input-field"
                          >
                            <option value="±1m">±1m</option>
                            <option value="±2m">±2m</option>
                            <option value="±3m">±3m</option>
                            <option value="±5m">±5m</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Update Rate</label>
                          <select
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.gps.updateRate}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'gps', 'updateRate')}
                            className="input-field"
                          >
                            <option value="1 Hz">1 Hz</option>
                            <option value="5 Hz">5 Hz</option>
                            <option value="10 Hz">10 Hz</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Data Format</label>
                          <select
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.gps.dataFormat}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'gps', 'dataFormat')}
                            className="input-field"
                          >
                            <option value="NMEA">NMEA</option>
                            <option value="JSON">JSON</option>
                            <option value="CSV">CSV</option>
                            <option value="NMEA + JSON">NMEA + JSON</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* IMU Sensor */}
                    <div className="mb-6 p-4 bg-white rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="font-semibold text-gray-900">IMU (Inertial Measurement Unit)</h6>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={droneManagementData.drones[droneManagementData.selectedDrone].sensors.imu.enabled}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'imu', 'enabled')}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Enabled</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="form-label">Sensitivity</label>
                          <select
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.imu.sensitivity}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'imu', 'sensitivity')}
                            className="input-field"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Drift</label>
                          <select
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.imu.drift}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'imu', 'drift')}
                            className="input-field"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Update Rate</label>
                          <select
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.imu.updateRate}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'imu', 'updateRate')}
                            className="input-field"
                          >
                            <option value="50 Hz">50 Hz</option>
                            <option value="100 Hz">100 Hz</option>
                            <option value="200 Hz">200 Hz</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Camera Sensor */}
                    <div className="mb-6 p-4 bg-white rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="font-semibold text-gray-900">Camera/EO-IR Sensor</h6>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={droneManagementData.drones[droneManagementData.selectedDrone].sensors.camera.enabled}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'camera', 'enabled')}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Enabled</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="form-label">Resolution</label>
                          <select
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.camera.resolution}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'camera', 'resolution')}
                            className="input-field"
                          >
                            <option value="720p">720p</option>
                            <option value="1080p">1080p</option>
                            <option value="4K">4K</option>
                            <option value="8K">8K</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">FPS</label>
                          <select
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.camera.fps}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'camera', 'fps')}
                            className="input-field"
                          >
                            <option value="24">24</option>
                            <option value="30">30</option>
                            <option value="60">60</option>
                            <option value="120">120</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Zoom</label>
                          <select
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.camera.zoom}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'camera', 'zoom')}
                            className="input-field"
                          >
                            <option value="None">None</option>
                            <option value="2x Digital">2x Digital</option>
                            <option value="5x Optical">5x Optical</option>
                            <option value="10x Optical">10x Optical</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* ADS-B Transponder */}
                    <div className="mb-6 p-4 bg-white rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="font-semibold text-gray-900">ADS-B Transponder (Govt. Requirement)</h6>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={droneManagementData.drones[droneManagementData.selectedDrone].sensors.adsb.enabled}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'adsb', 'enabled')}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Enabled</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">ICAO Code</label>
                          <input
                            type="text"
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.adsb.icaoCode}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'adsb', 'icaoCode')}
                            className="input-field"
                            placeholder="ABCD1234"
                          />
                        </div>
                        <div>
                          <label className="form-label">Transmission Interval</label>
                          <select
                            value={droneManagementData.drones[droneManagementData.selectedDrone].sensors.adsb.transmissionInterval}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'adsb', 'transmissionInterval')}
                            className="input-field"
                          >
                            <option value="1s">1 second</option>
                            <option value="2s">2 seconds</option>
                            <option value="5s">5 seconds</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Payload Sensors */}
                    <div className="p-4 bg-white rounded-lg border">
                      <h6 className="font-semibold text-gray-900 mb-3">Payload Sensors</h6>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={droneManagementData.drones[droneManagementData.selectedDrone].sensors.payload.multispectral}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'payload', 'multispectral')}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Multispectral Camera (NDVI)</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={droneManagementData.drones[droneManagementData.selectedDrone].sensors.payload.gasSensor}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'payload', 'gasSensor')}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Gas Sensor (Air Pollution)</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={droneManagementData.drones[droneManagementData.selectedDrone].sensors.payload.thermal}
                            onChange={(e) => handleDroneInputChange(e, droneManagementData.selectedDrone, 'payload', 'thermal')}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Thermal Sensor</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Fleet Settings */}
                  {droneManagementData.fleetMode && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Fleet Settings</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="form-label">Collision Avoidance</label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={droneManagementData.swarmSettings.collisionAvoidance}
                              onChange={(e) => setDroneManagementData(prev => ({
                                ...prev,
                                swarmSettings: { ...prev.swarmSettings, collisionAvoidance: e.target.checked }
                              }))}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">Enable collision avoidance between drones</span>
                          </label>
                        </div>
                        <div>
                          <label className="form-label">Data Synchronization</label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={droneManagementData.swarmSettings.dataSync}
                              onChange={(e) => setDroneManagementData(prev => ({
                                ...prev,
                                swarmSettings: { ...prev.swarmSettings, dataSync: e.target.checked }
                              }))}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">Centralized data sync</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button
                      onClick={() => removeDrone(droneManagementData.selectedDrone)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium"
                      disabled={droneManagementData.drones.length === 1}
                    >
                      Remove Drone
                    </button>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowDroneManagement(false)}
                        className="btn-secondary"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => toast.success('Drone configuration saved!')}
                        className="btn-success"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Management Modal */}
      {showDataManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-7xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Data Management System</h3>
              <button
                onClick={() => setShowDataManagement(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Indore Data Collection 2025</h4>
                  <p className="text-gray-600">View and manage Excel data in tabular format</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={exportToCSV}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Sheet Selection */}
              {excelData.sheets.length > 0 && (
                <div className="mb-6">
                  <label className="form-label">Select Sheet</label>
                  <div className="flex space-x-2">
                    {excelData.sheets.map((sheet, index) => (
                      <button
                        key={sheet}
                        onClick={() => handleSheetChange(index)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          excelData.selectedSheet === index
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {sheet}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search in data..."
                    value={excelData.searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Data Table */}
              {excelData.headers.length > 0 && (
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expand
                          </th>
                          {excelData.headers.slice(0, 5).map((header, index) => (
                            <th key={index} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                          {excelData.headers.length > 5 && (
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              More...
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {excelData.filteredData.slice(0, 10).map((row, rowIndex) => (
                          <React.Fragment key={row.id}>
                            <tr className="hover:bg-gray-50">
                              <td className="px-3 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => toggleRowExpansion(row.id)}
                                  className="text-purple-600 hover:text-purple-800"
                                >
                                  {excelData.expandedRows.has(row.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                              </td>
                              {excelData.headers.slice(0, 5).map((header, colIndex) => (
                                <td key={colIndex} className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {String(row[header] || '').length > 50 
                                    ? String(row[header] || '').substring(0, 50) + '...'
                                    : row[header] || ''
                                  }
                                </td>
                              ))}
                              {excelData.headers.length > 5 && (
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                  +{excelData.headers.length - 5} columns
                                </td>
                              )}
                            </tr>
                            
                            {/* Expanded Row */}
                            {excelData.expandedRows.has(row.id) && (
                              <tr>
                                <td colSpan={excelData.headers.length + 1} className="px-3 py-4 bg-gray-50">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {excelData.headers.map((header, colIndex) => (
                                      <div key={colIndex} className="bg-white p-3 rounded border">
                                        <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                                          {header}
                                        </div>
                                        <div className="text-sm text-gray-900 break-words">
                                          {row[header] || 'N/A'}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination Info */}
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing 1 to {Math.min(10, excelData.filteredData.length)} of {excelData.filteredData.length} results
                      </div>
                      <div className="text-sm text-gray-500">
                        {excelData.data.length} total records
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {excelData.isLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading Excel data...</p>
                </div>
              )}

              {/* No Data State */}
              {!excelData.isLoading && excelData.headers.length === 0 && (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No data available. Please check if the Excel file is accessible.</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDataManagement(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={exportToCSV}
                  className="btn-success"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map View Modal */}
      {showMapView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full h-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">UrbanGuard - Indore Detection</h3>
                <p className="text-sm opacity-90">Illegal Construction Detection & Mapping System</p>
              </div>
              <button
                onClick={() => setShowMapView(false)}
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Map Container */}
            <div className="p-4 h-full flex flex-col">
              {/* Control Panel */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4 flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number</label>
                  <input
                    type="number"
                    placeholder="Ward Number (1-85)"
                    min="1"
                    max="85"
                    className="input-field w-32"
                    onChange={handleWardNumberChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward Name</label>
                  <input
                    type="text"
                    placeholder="Ward Name"
                    className="input-field w-48"
                    readOnly
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={detectWard}
                    className="btn-primary"
                  >
                    Detect Ward
                  </button>
                  <button
                    onClick={showFullIndore}
                    className="btn-secondary"
                  >
                    Show Full Indore
                  </button>
                  <button
                    onClick={openFullScreenMap}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    View Full Screen Map
                  </button>
                </div>
              </div>

              {/* Map */}
              <div id="map" className="flex-1 rounded-lg border border-gray-300 mb-4 relative">
                {mapLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading map...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Panel */}
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <div className="w-full">
                  {/* Detected Constructions Table */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Detected Constructions</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ward
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Severity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Confidence
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Coordinates
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody id="detectedList" className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                              Select a ward or show full Indore to view constructions
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Surveys Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📊 Recent Surveys</h2>
            <p className="text-gray-600">View and manage field surveys and illegal construction reports</p>
          </div>
          <button
            onClick={startSurvey}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Camera className="h-4 w-4" />
            <span>Start New Survey</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading surveys...</p>
          </div>
        ) : surveys.length > 0 ? (
          <div className="space-y-4">
            {surveys.slice(0, 5).map((survey) => (
              <div key={survey.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-lg font-semibold text-gray-900">Survey {survey.id}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Ward {survey.ward_no}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {survey.drone_id}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Date:</span> {survey.survey_date}
                      </div>
                      <div>
                        <span className="font-medium">Violations:</span> {survey.total_violations}
                      </div>
                      <div>
                        <span className="font-medium">Coordinates:</span> {survey.coordinates?.latitude?.toFixed(4)}, {survey.coordinates?.longitude?.toFixed(4)}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                          survey.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {survey.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/survey-results`, { state: { surveyId: survey.id, survey: survey } })}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                    >
                      View Results
                    </button>
                    <button
                      onClick={() => navigate('/survey-form')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
                    >
                      New Survey
                    </button>
                  </div>
                </div>
                
                {/* Violations Summary */}
                {survey.violations && survey.violations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">🚨 Violations Detected:</h4>
                    <div className="flex flex-wrap gap-2">
                      {survey.violations.slice(0, 3).map((violation, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            violation.severity === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : violation.severity === 'medium'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {violation.type.replace('_', ' ').toUpperCase()}
                        </span>
                      ))}
                      {survey.violations.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{survey.violations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {surveys.length > 5 && (
              <div className="text-center pt-4">
                <button
                  onClick={() => navigate('/surveys')}
                  className="px-4 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View All Surveys ({surveys.length})
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Surveys Yet</h3>
            <p className="text-gray-600 mb-4">Start your first field survey to detect illegal constructions</p>
            <button
              onClick={startSurvey}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start First Survey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InchargeDashboard;
