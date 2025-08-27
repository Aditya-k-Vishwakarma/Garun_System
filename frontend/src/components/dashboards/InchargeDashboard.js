import React, { useState, useContext, useEffect, useCallback } from 'react';
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
  X,
  Eye,
  Calendar,
  Phone,
  Mail,
  Home,
  Building,
  FileCheck,
  MessageCircle,
  Share2,
  Upload,
  Plus,
  Activity,
  Target,
  Shield,
  Zap,
  RefreshCw
} from 'lucide-react';
import AuthContext from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import CommonHeader from '../common/CommonHeader';

const InchargeDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showDroneManagement, setShowDroneManagement] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [droneConnected, setDroneConnected] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    completedSurveys: 0,
    pendingSurveys: 0,
    totalViolations: 0,
    highSeverityViolations: 0,
    mediumSeverityViolations: 0,
    lowSeverityViolations: 0,
    complianceRate: 0
  });
  
  const [dynamicData, setDynamicData] = useState({
    complaints: [],
    teamPerformance: [],
    slaAlerts: []
  });
  
  // Map state variables
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [heatLayer, setHeatLayer] = useState(null);
  const [markerCluster, setMarkerCluster] = useState(null);
  const [wardSummary, setWardSummary] = useState({});
  const [mapLoading, setMapLoading] = useState(false);
  const [detectedConstructions, setDetectedConstructions] = useState([]);
  const [wardName, setWardName] = useState('');
  const [wardNumber, setWardNumber] = useState('');
  
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
    { name: 'Sant Kabir', lat: 22.9400, lng: 75.8600 },
    { name: 'Sant Ravidas', lat: 22.9450, lng: 75.8530 },
    { name: 'Maharaja Chhatrasal', lat: 22.9500, lng: 75.8560 },
    { name: 'Atal Bihari Vajpayee', lat: 22.9550, lng: 75.8590 },
    { name: 'Sukhliya', lat: 22.9600, lng: 75.8540 },
    { name: 'Shaheed Bhagat Singh', lat: 22.9650, lng: 75.8570 },
    { name: 'Lasudiya Mori', lat: 22.9700, lng: 75.8600 },
    { name: 'Nipaniya', lat: 22.9750, lng: 75.8530 },
    { name: 'Sai Kirpa', lat: 22.9800, lng: 75.8560 },
    { name: 'Haji Colony', lat: 22.9850, lng: 75.8590 },
    { name: 'Naharshawali', lat: 22.9900, lng: 75.8540 },
    { name: 'Khajrana Ganesh', lat: 22.9950, lng: 75.8570 },
    { name: 'Kelash Puri', lat: 23.0000, lng: 75.8600 },
    { name: 'Swami Vivekananda', lat: 23.0050, lng: 75.8530 },
    { name: 'Shree Nagar', lat: 23.0100, lng: 75.8560 },
    { name: 'H.I.G', lat: 23.0150, lng: 75.8590 },
    { name: 'Dr. Bhimrao Ambedkar', lat: 23.0200, lng: 75.8540 },
    { name: 'Sant Kabir', lat: 23.0250, lng: 75.8570 },
    { name: 'Sant Ravidas', lat: 23.0300, lng: 75.8600 },
    { name: 'Maharaja Chhatrasal', lat: 23.0350, lng: 75.8530 },
    { name: 'Atal Bihari Vajpayee', lat: 23.0400, lng: 75.8560 },
    { name: 'Sukhliya', lat: 23.0450, lng: 75.8590 },
    { name: 'Shaheed Bhagat Singh', lat: 23.0500, lng: 75.8540 },
    { name: 'Lasudiya Mori', lat: 23.0550, lng: 75.8570 },
    { name: 'Nipaniya', lat: 23.0600, lng: 75.8600 },
    { name: 'Sai Kirpa', lat: 23.0650, lng: 75.8530 },
    { name: 'Haji Colony', lat: 23.0700, lng: 75.8560 },
    { name: 'Naharshawali', lat: 23.0750, lng: 75.8590 },
    { name: 'Khajrana Ganesh', lat: 23.0800, lng: 75.8540 },
    { name: 'Kelash Puri', lat: 23.0850, lng: 75.8570 },
    { name: 'Swami Vivekananda', lat: 23.0900, lng: 75.8600 },
    { name: 'Shree Nagar', lat: 23.0950, lng: 75.8530 },
    { name: 'H.I.G', lat: 23.1000, lng: 75.8560 },
    { name: 'Dr. Bhimrao Ambedkar', lat: 23.1050, lng: 75.8590 },
    { name: 'Sant Kabir', lat: 23.1100, lng: 75.8540 },
    { name: 'Sant Ravidas', lat: 23.1150, lng: 75.8570 },
    { name: 'Maharaja Chhatrasal', lat: 23.1200, lng: 75.8600 },
    { name: 'Atal Bihari Vajpayee', lat: 23.1250, lng: 75.8530 },
    { name: 'Sukhliya', lat: 23.1300, lng: 75.8560 },
    { name: 'Shaheed Bhagat Singh', lat: 23.1350, lng: 75.8590 },
    { name: 'Lasudiya Mori', lat: 23.1400, lng: 75.8540 },
    { name: 'Nipaniya', lat: 23.1450, lng: 75.8570 },
    { name: 'Sai Kirpa', lat: 23.1500, lng: 75.8600 },
    { name: 'Haji Colony', lat: 23.1550, lng: 75.8530 },
    { name: 'Naharshawali', lat: 23.1600, lng: 75.8560 },
    { name: 'Khajrana Ganesh', lat: 23.1650, lng: 75.8590 },
    { name: 'Kelash Puri', lat: 23.1700, lng: 75.8540 },
    { name: 'Swami Vivekananda', lat: 23.1750, lng: 75.8570 },
    { name: 'Shree Nagar', lat: 23.1800, lng: 75.8600 },
    { name: 'H.I.G', lat: 23.1850, lng: 75.8530 },
    { name: 'Dr. Bhimrao Ambedkar', lat: 23.1900, lng: 75.8560 },
    { name: 'Sant Kabir', lat: 23.1950, lng: 75.8590 },
    { name: 'Sant Ravidas', lat: 23.2000, lng: 75.8540 },
    { name: 'Maharaja Chhatrasal', lat: 23.2050, lng: 75.8570 },
    { name: 'Atal Bihari Vajpayee', lat: 23.2100, lng: 75.8600 },
    { name: 'Sukhliya', lat: 23.2150, lng: 75.8530 },
    { name: 'Shaheed Bhagat Singh', lat: 23.2200, lng: 75.8560 },
    { name: 'Lasudiya Mori', lat: 23.2250, lng: 75.8590 },
    { name: 'Nipaniya', lat: 23.2300, lng: 75.8540 },
    { name: 'Sai Kirpa', lat: 23.2350, lng: 75.8570 },
    { name: 'Haji Colony', lat: 23.2400, lng: 75.8600 },
    { name: 'Naharshawali', lat: 23.2450, lng: 75.8530 },
    { name: 'Khajrana Ganesh', lat: 23.2500, lng: 75.8560 },
    { name: 'Kelash Puri', lat: 23.2550, lng: 75.8590 },
    { name: 'Swami Vivekananda', lat: 23.2600, lng: 75.8540 },
    { name: 'Shree Nagar', lat: 23.2650, lng: 75.8570 },
    { name: 'H.I.G', lat: 23.2700, lng: 75.8600 },
    { name: 'Dr. Bhimrao Ambedkar', lat: 23.2750, lng: 75.8530 },
    { name: 'Sant Kabir', lat: 23.2800, lng: 75.8560 },
    { name: 'Sant Ravidas', lat: 23.2850, lng: 75.8590 },
    { name: 'Maharaja Chhatrasal', lat: 23.2900, lng: 75.8540 },
    { name: 'Atal Bihari Vajpayee', lat: 23.2950, lng: 75.8570 },
    { name: 'Sukhliya', lat: 23.3000, lng: 75.8600 },
    { name: 'Shaheed Bhagat Singh', lat: 23.3050, lng: 75.8530 },
    { name: 'Lasudiya Mori', lat: 23.3100, lng: 75.8560 },
    { name: 'Nipaniya', lat: 23.3150, lng: 75.8590 },
    { name: 'Sai Kirpa', lat: 23.3200, lng: 75.8540 },
    { name: 'Haji Colony', lat: 23.3250, lng: 75.8570 },
    { name: 'Khajrana Ganesh', lat: 23.3300, lng: 75.8600 },
    { name: 'Kelash Puri', lat: 23.3350, lng: 75.8530 },
    { name: 'Swami Vivekananda', lat: 23.3400, lng: 75.8560 },
    { name: 'Shree Nagar', lat: 23.3450, lng: 75.8590 },
    { name: 'H.I.G', lat: 23.3500, lng: 75.8540 },
    { name: 'Dr. Bhimrao Ambedkar', lat: 23.3550, lng: 75.8570 },
    { name: 'Sant Kabir', lat: 23.3600, lng: 75.8600 },
    { name: 'Sant Ravidas', lat: 23.3650, lng: 75.8530 },
    { name: 'Maharaja Chhatrasal', lat: 23.3700, lng: 75.8560 },
    { name: 'Atal Bihari Vajpayee', lat: 23.3750, lng: 75.8590 },
    { name: 'Sukhliya', lat: 23.3800, lng: 75.8540 },
    { name: 'Shaheed Bhagat Singh', lat: 23.3850, lng: 75.8570 },
    { name: 'Lasudiya Mori', lat: 23.3900, lng: 75.8600 },
    { name: 'Nipaniya', lat: 23.3950, lng: 75.8530 },
    { name: 'Sai Kirpa', lat: 23.4000, lng: 75.8560 },
    { name: 'Haji Colony', lat: 23.4050, lng: 75.8590 },
    { name: 'Naharshawali', lat: 23.4100, lng: 75.8540 },
    { name: 'Khajrana Ganesh', lat: 23.4150, lng: 75.8570 },
    { name: 'Kelash Puri', lat: 23.4200, lng: 75.8600 },
    { name: 'Swami Vivekananda', lat: 23.4250, lng: 75.8530 },
    { name: 'Shree Nagar', lat: 23.4300, lng: 75.8560 },
    { name: 'H.I.G', lat: 23.4350, lng: 75.8590 },
    { name: 'Dr. Bhimrao Ambedkar', lat: 23.4400, lng: 75.8540 },
    { name: 'Sant Kabir', lat: 23.4450, lng: 75.8570 },
    { name: 'Sant Ravidas', lat: 23.4500, lng: 75.8600 },
    { name: 'Maharaja Chhatrasal', lat: 23.4550, lng: 75.8530 },
    { name: 'Atal Bihari Vajpayee', lat: 23.4600, lng: 75.8560 },
    { name: 'Sukhliya', lat: 23.4650, lng: 75.8590 },
    { name: 'Shaheed Bhagat Singh', lat: 23.4700, lng: 75.8540 },
    { name: 'Lasudiya Mori', lat: 23.4750, lng: 75.8570 },
    { name: 'Nipaniya', lat: 23.4800, lng: 75.8600 },
    { name: 'Sai Kirpa', lat: 23.4850, lng: 75.8530 },
    { name: 'Haji Colony', lat: 23.4900, lng: 75.8560 },
    { name: 'Khajrana Ganesh', lat: 23.4950, lng: 75.8590 },
    { name: 'Kelash Puri', lat: 23.5000, lng: 75.8600 }
  ];

  const [surveyData, setSurveyData] = useState({
    surveyDetails: '',
    wardNo: '',
    localityDetails: '',
    nearestLandmark: '',
    geoCoordinates: '',
    measuringParameters: {
      constructionType: '',
      buildingHeight: '',
      floorArea: '',
      setbacks: {
        front: '',
        rear: '',
        left: '',
        right: ''
      },
      parkingSpaces: '',
      greenArea: ''
    }
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  // Fetch surveys data and calculate stats
  const fetchSurveysData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from backend APIs
      const [surveysResponse, complaintsResponse, teamResponse, teamPerformanceResponse] = await Promise.all([
        fetch('http://localhost:8000/api/surveys/all'),
        fetch('http://localhost:8000/api/complaints/all'),
        fetch('http://localhost:8000/api/dashboard/incharge-stats'),
        fetch('http://localhost:8000/api/dashboard/team-performance')
      ]);

      let surveysData = [];
      let complaintsData = [];
      let teamStats = {};
      let teamPerformanceData = [];

      if (surveysResponse.ok) {
        const surveysResult = await surveysResponse.json();
        surveysData = surveysResult.surveys || [];
      }

      if (complaintsResponse.ok) {
        const complaintsResult = await complaintsResponse.json();
        complaintsData = complaintsResult.complaints || [];
      }

      if (teamResponse.ok) {
        const teamResult = await teamResponse.json();
        teamStats = teamResult.stats || {};
      }

      if (teamPerformanceResponse.ok) {
        const teamPerformanceResult = await teamPerformanceResponse.json();
        teamPerformanceData = teamPerformanceResult.team_performance || [];
      }

      // Use real data if available, otherwise fall back to dummy data
      const finalSurveys = surveysData.length > 0 ? surveysData : [
        {
          id: 'SUR001',
          ward_no: 'Sirpur', // Use ward name instead of number for better mapping
          ward_number: 1, // Keep ward number for reference
          survey_date: '2024-01-15',
          drone_id: 'DRONE001',
          status: 'completed',
          total_violations: 3,
          total_buildings: 25,
          compliance_score: 88,
          survey_type: 'Drone Survey',
          coordinates: { latitude: 22.7006, longitude: 75.8133 },
          violations: [
            {
              type: 'Setback Violation',
              current: '2m',
              allowed: '3m',
              severity: 'medium'
            },
            {
              type: 'Height Violation',
              current: '15m',
              allowed: '12m',
              severity: 'high'
            },
            {
              type: 'Parking Violation',
              current: '8 spaces',
              allowed: '12 spaces',
              severity: 'low'
            }
          ],
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 'SUR002',
          ward_no: 'Chandan Nagar',
          ward_number: 2,
          survey_date: '2024-01-14',
          drone_id: 'DRONE002',
          status: 'completed',
          total_violations: 1,
          total_buildings: 18,
          compliance_score: 94,
          survey_type: 'Manual Survey',
          coordinates: { latitude: 22.7128, longitude: 75.8208 },
          violations: [
            {
              type: 'Green Area Violation',
              current: '8%',
              allowed: '10%',
              severity: 'low'
            }
          ],
          created_at: '2024-01-14T14:30:00Z'
        },
        {
          id: 'SUR003',
          ward_no: 'Kalani Nagar',
          ward_number: 3,
          survey_date: '2024-01-13',
          drone_id: 'DRONE003',
          status: 'completed',
          total_violations: 5,
          total_buildings: 32,
          compliance_score: 84,
          survey_type: 'Drone Survey',
          coordinates: { latitude: 22.7217, longitude: 75.8235 },
          violations: [
            {
              type: 'Floor Area Violation',
              current: '120%',
              allowed: '100%',
              severity: 'high'
            },
            {
              type: 'Setback Violation',
              current: '1.5m',
              allowed: '3m',
              severity: 'high'
            },
            {
              type: 'Height Violation',
              current: '18m',
              allowed: '15m',
              severity: 'medium'
            },
            {
              type: 'Parking Violation',
              current: '6 spaces',
              allowed: '15 spaces',
              severity: 'medium'
            },
            {
              type: 'Green Area Violation',
              current: '5%',
              allowed: '10%',
              severity: 'low'
            }
          ],
          created_at: '2024-01-13T09:15:00Z'
        },
        {
          id: 'SUR004',
          ward_no: 'Sukhdev Nagar',
          ward_number: 4,
          survey_date: '2024-01-12',
          drone_id: 'DRONE001',
          status: 'completed',
          total_violations: 0,
          total_buildings: 20,
          compliance_score: 100,
          survey_type: 'Drone Survey',
          coordinates: { latitude: 22.7269, longitude: 75.8236 },
          violations: [],
          created_at: '2024-01-12T16:45:00Z'
        },
        {
          id: 'SUR005',
          ward_no: 'Juna Risala',
          ward_number: 8,
          survey_date: '2024-01-11',
          drone_id: 'DRONE002',
          status: 'completed',
          total_violations: 2,
          total_buildings: 28,
          compliance_score: 93,
          survey_type: 'Manual Survey',
          coordinates: { latitude: 22.7238, longitude: 75.8501 },
          violations: [
            {
              type: 'Setback Violation',
              current: '2.5m',
              allowed: '3m',
              severity: 'low'
            },
            {
              type: 'Parking Violation',
              current: '10 spaces',
              allowed: '14 spaces',
              severity: 'low'
            }
          ],
          created_at: '2024-01-11T11:20:00Z'
        }
      ];

      setSurveys(finalSurveys);
      
      // Update dynamic data
      setDynamicData({
        complaints: complaintsData,
        teamPerformance: teamPerformanceData,
        slaAlerts: teamStats.sla_alerts || []
      });
      
      // Use real stats if available, otherwise calculate from surveys
      if (Object.keys(teamStats).length > 0) {
        setStats({
          totalSurveys: teamStats.surveys?.total || finalSurveys.length,
          completedSurveys: teamStats.surveys?.completed || finalSurveys.filter(s => s.status === 'completed').length,
          pendingSurveys: teamStats.surveys?.pending || finalSurveys.filter(s => s.status === 'pending' || s.status === 'in_progress').length,
          totalViolations: teamStats.violations?.total || 0,
          highSeverityViolations: teamStats.violations?.high_severity || 0,
          mediumSeverityViolations: teamStats.violations?.medium_severity || 0,
          lowSeverityViolations: teamStats.violations?.low_severity || 0,
          complianceRate: teamStats.performance?.compliance_rate || 100
        });
      } else {
        // Calculate from survey data as fallback
        const totalSurveys = finalSurveys.length;
        const completedSurveys = finalSurveys.filter(s => s.status === 'completed').length;
        const pendingSurveys = finalSurveys.filter(s => s.status === 'pending' || s.status === 'in_progress').length;
        
        const totalViolations = finalSurveys.reduce((total, survey) => {
          return total + (survey.violations?.length || 0);
        }, 0);
        
        const highSeverityViolations = finalSurveys.reduce((total, survey) => {
          return total + (survey.violations?.filter(v => v.severity === 'high').length || 0);
        }, 0);
        
        const mediumSeverityViolations = finalSurveys.reduce((total, survey) => {
          return total + (survey.violations?.filter(v => v.severity === 'medium').length || 0);
        }, 0);
        
        const lowSeverityViolations = finalSurveys.reduce((total, survey) => {
          return total + (survey.violations?.filter(v => v.severity === 'low').length || 0);
        }, 0);
        
        const complianceRate = totalSurveys > 0 ? 
          Math.round(((totalSurveys - totalViolations) / totalSurveys) * 100) : 100;
        
        setStats({
          totalSurveys,
          completedSurveys,
          pendingSurveys,
          totalViolations,
          highSeverityViolations,
          mediumSeverityViolations,
          lowSeverityViolations,
          complianceRate
        });
      }
    } catch (error) {
      console.error('Error fetching surveys data:', error);
      toast.error('Error fetching surveys data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveysData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSurveysData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Load Excel data and initialize dynamic wards on component mount
  useEffect(() => {
    loadExcelData();
  }, []);

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

  // New state for drone data analysis and ward management
  const [droneSurveyData, setDroneSurveyData] = useState([]);
  const [dynamicWards, setDynamicWards] = useState([]);
  const [standardParameters, setStandardParameters] = useState({
    buildingHeight: {
      residential: { max: 15, unit: 'meters' },
      commercial: { max: 30, unit: 'meters' },
      industrial: { max: 45, unit: 'meters' },
      mixed: { max: 25, unit: 'meters' }
    },
    floorArea: {
      residential: { max: 200, unit: 'sq_meters' },
      commercial: { max: 500, unit: 'sq_meters' },
      industrial: { max: 1000, unit: 'sq_meters' },
      mixed: { max: 350, unit: 'sq_meters' }
    },
    roadWidth: {
      primary: { min: 12, unit: 'meters' },
      secondary: { min: 8, unit: 'meters' },
      residential: { min: 6, unit: 'meters' }
    },
    setbacks: {
      front: { min: 3, unit: 'meters' },
      rear: { min: 3, unit: 'meters' },
      left: { min: 2, unit: 'meters' },
      right: { min: 2, unit: 'meters' }
    },
    greenArea: { min: 10, unit: 'percentage' },
    parkingSpaces: { min: 1, unit: 'per_100_sq_meters' }
  });
  const [analysisResults, setAnalysisResults] = useState({
    violations: [],
    riskScore: 0,
    complianceRate: 0,
    recommendations: []
  });
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showSatelliteMap, setShowSatelliteMap] = useState(false);
  const [satelliteMapInstance, setSatelliteMapInstance] = useState(null);
  const [satelliteMarkers, setSatelliteMarkers] = useState([]);
  const [wardAnalysisData, setWardAnalysisData] = useState({});

  const departmentStats = {
    totalComplaints: 89,
    pending: 12,
    inProgress: 23,
    resolved: 54,
    teamMembers: 6,
    avgResolutionTime: '2.1 days',
    slaCompliance: '94.2%',
    totalSurveys: 5,
    totalViolations: 11,
    complianceRate: 91.8
  };

  const teamMembers = [
    { id: 1, name: 'Rajesh Kumar', role: 'Senior Inspector', status: 'Active', complaints: 12, avgTime: '1.8 days' },
    { id: 2, name: 'Priya Sharma', role: 'Inspector', status: 'Active', complaints: 8, avgTime: '2.3 days' },
    { id: 3, name: 'Amit Patel', role: 'Field Officer', status: 'On Leave', complaints: 5, avgTime: '2.1 days' },
    { id: 4, name: 'Sneha Reddy', role: 'Inspector', status: 'Active', complaints: 15, avgTime: '1.9 days' },
    { id: 5, name: 'Vikram Singh', role: 'Field Officer', status: 'Active', complaints: 9, avgTime: '2.5 days' },
    { id: 6, name: 'Arun Kumar', role: 'Inspector', status: 'Active', complaints: 11, avgTime: '2.0 days' }
  ];

  const assignedComplaints = [
    { id: 'GRV1247', title: 'Major road damage on Highway 101', priority: 'High', assignee: 'Rajesh Kumar', status: 'In Progress', date: '2024-01-15', sla: '2 days left' },
    { id: 'GRV1246', title: 'Water supply disruption in Ward 5', priority: 'High', assignee: 'Priya Sharma', status: 'Assigned', date: '2024-01-15', sla: '3 days left' },
    { id: 'GRV1245', title: 'Illegal construction in residential area', priority: 'Medium', assignee: 'Sneha Reddy', status: 'In Progress', date: '2024-01-14', sla: '1 day left' },
    { id: 'GRV1244', title: 'Street light malfunction', priority: 'Low', assignee: 'Amit Patel', status: 'New', date: '2024-01-14', sla: '5 days left' },
    { id: 'GRV1243', title: 'Garbage collection issue in Ward 3', priority: 'Medium', assignee: 'Vikram Singh', status: 'In Progress', date: '2024-01-13', sla: '2 days left' },
    { id: 'GRV1242', title: 'Traffic signal not working', priority: 'High', assignee: 'Arun Kumar', status: 'Assigned', date: '2024-01-13', sla: '1 day left' },
    { id: 'GRV1241', title: 'Potholes on main road', priority: 'Medium', assignee: 'Rajesh Kumar', status: 'Under Review', date: '2024-01-12', sla: '4 days left' },
    { id: 'GRV1240', title: 'Street dog menace', priority: 'Low', assignee: 'Priya Sharma', status: 'New', date: '2024-01-12', sla: '6 days left' }
  ];

  const slaAlerts = [
    { id: 1, complaintId: 'GRV1244', title: 'Street light malfunction', assignee: 'Amit Patel', timeLeft: '1 day', severity: 'critical' },
    { id: 2, complaintId: 'GRV1245', title: 'Illegal construction', assignee: 'Sneha Reddy', timeLeft: '2 days', severity: 'warning' },
    { id: 3, complaintId: 'GRV1246', title: 'Water supply issue', assignee: 'Priya Sharma', timeLeft: '3 days', severity: 'warning' },
    { id: 4, complaintId: 'GRV1242', title: 'Traffic signal not working', assignee: 'Arun Kumar', timeLeft: '1 day', severity: 'critical' },
    { id: 5, complaintId: 'GRV1243', title: 'Garbage collection issue', assignee: 'Vikram Singh', timeLeft: '2 days', severity: 'warning' }
  ];

  const performanceMetrics = [
    { metric: 'Response Time', current: '2.1 days', target: '2.0 days', status: 'good' },
    { metric: 'Resolution Rate', current: '94.2%', target: '90%', status: 'excellent' },
    { metric: 'Customer Satisfaction', current: '4.2/5', target: '4.0/5', status: 'good' },
    { metric: 'SLA Compliance', current: '94.2%', target: '95%', status: 'warning' },
    { metric: 'First Response Time', current: '4.5 hours', target: '6 hours', status: 'excellent' },
    { metric: 'Team Productivity', current: '87%', target: '85%', status: 'good' }
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
        
        // Extract ward data from Excel for dynamic ward loading
        extractWardDataFromExcel(data, headers);
        
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

  // Extract ward data from Excel for dynamic ward loading
  const extractWardDataFromExcel = (data, headers) => {
    try {
      const wardColumn = headers.find(h => 
        h.toLowerCase().includes('ward') || 
        h.toLowerCase().includes('area') || 
        h.toLowerCase().includes('locality')
      );
      
      if (wardColumn) {
        const uniqueWards = [...new Set(data.map(row => row[wardColumn]).filter(Boolean))];
        const dynamicWardData = uniqueWards.map((wardName, index) => ({
          id: index + 1,
          name: wardName,
          lat: 22.7196 + (Math.random() - 0.5) * 0.1, // Generate coordinates around Indore
          lng: 75.8577 + (Math.random() - 0.5) * 0.1,
          data: data.filter(row => row[wardColumn] === wardName)
        }));
        
        setDynamicWards(dynamicWardData);
        toast.success(`Loaded ${dynamicWardData.length} dynamic wards from Excel data`);
      }
    } catch (error) {
      console.error('Error extracting ward data:', error);
    }
  };

    // Load sample drone survey data
  const loadDroneSurveyData = () => {
    const sampleData = [
      {
        "ward_no": 12,
        "survey_date": "2025-08-17",
        "drone_id": "DRN_001",
        "coordinates": {
          "latitude": 22.7196,
          "longitude": 75.8577
        },
        "roads": [
          {
            "road_id": "R001",
            "length_meters": 520.5,
            "width_meters": 8.2,
            "surface_type": "asphalt"
          }
        ],
        "buildings": [
          {
            "building_id": "B001",
            "height_meters": 25.0,
            "floors": 7,
            "area_sq_meters": 320.0,
            "type": "residential",
            "status": "legal"
          },
          {
            "building_id": "B002",
            "height_meters": 12.5,
            "floors": 3,
            "area_sq_meters": 150.0,
            "type": "commercial",
            "status": "legal"
          },
          {
            "building_id": "B003",
            "height_meters": 40.0,
            "floors": 12,
            "area_sq_meters": 500.0,
            "type": "residential",
            "status": "illegal"
          }
        ],
        "land_usage": {
          "residential_area_sq_meters": 12000,
          "commercial_area_sq_meters": 5000,
          "green_area_sq_meters": 2500,
          "industrial_area_sq_meters": 800
        },
        "violations": {
          "illegal_buildings_detected": 1,
          "encroachment_on_roads": false
        }
      },
      {
        "ward_no": 15,
        "survey_date": "2025-08-17",
        "drone_id": "DRN_002",
        "coordinates": {
          "latitude": 22.725,
          "longitude": 75.86
        },
        "roads": [
          {
            "road_id": "R002",
            "length_meters": 400.0,
            "width_meters": 7.0,
            "surface_type": "concrete"
          }
        ],
        "buildings": [
          {
            "building_id": "B004",
            "height_meters": 10.0,
            "floors": 2,
            "area_sq_meters": 90.0,
            "type": "residential",
            "status": "legal"
          },
          {
            "building_id": "B005",
            "height_meters": 15.0,
            "floors": 4,
            "area_sq_meters": 180.0,
            "type": "commercial",
            "status": "illegal"
          }
        ],
        "land_usage": {
          "residential_area_sq_meters": 8000,
          "commercial_area_sq_meters": 3500,
          "green_area_sq_meters": 1200,
          "industrial_area_sq_meters": 600
        },
        "violations": {
          "illegal_buildings_detected": 1,
          "encroachment_on_roads": true
        }
      }
    ];
    
    setDroneSurveyData(sampleData);
    toast.success('Sample drone survey data loaded successfully!');
  };

  // Load external JSON file
  const loadExternalDroneData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      toast.error('Please select a valid JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        
        // Validate JSON structure
        if (!Array.isArray(jsonData)) {
          toast.error('JSON file should contain an array of drone survey data');
          return;
        }

        // Validate each survey object
        const validData = jsonData.filter(survey => {
          const isValid = survey.ward_no && 
                         survey.drone_id && 
                         survey.coordinates && 
                         survey.buildings && 
                         Array.isArray(survey.buildings);
          
          if (!isValid) {
            console.warn('Invalid survey data found:', survey);
          }
          return isValid;
        });

        if (validData.length === 0) {
          toast.error('No valid drone survey data found in the JSON file');
          return;
        }

        if (validData.length < jsonData.length) {
          toast.warning(`${jsonData.length - validData.length} invalid records were filtered out`);
        }

        setDroneSurveyData(validData);
        toast.success(`Successfully loaded ${validData.length} drone survey records from ${file.name}`);
        
        // Reset file input
        event.target.value = '';
        
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        toast.error('Invalid JSON file. Please check the file format.');
      }
    };

    reader.onerror = () => {
      toast.error('Error reading the file. Please try again.');
    };

    reader.readAsText(file);
  };

  // Export current drone data to JSON
  const exportDroneData = () => {
    if (droneSurveyData.length === 0) {
      toast.error('No drone data to export');
      return;
    }

    try {
      const dataStr = JSON.stringify(droneSurveyData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `drone_survey_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast.success('Drone data exported successfully!');
    } catch (error) {
      console.error('Error exporting drone data:', error);
      toast.error('Failed to export drone data');
    }
  };

  // Clear drone data
  const clearDroneData = () => {
    setDroneSurveyData([]);
    toast.success('Drone data cleared successfully!');
  };

  // Analyze drone data for illegal construction prediction
  const analyzeDroneData = (droneData) => {
    try {
      const violations = [];
      let totalViolations = 0;
      let totalBuildings = 0;
      
      droneData.buildings.forEach(building => {
        totalBuildings++;
        const buildingViolations = [];
        
        // Check building height violations
        const maxHeight = standardParameters.buildingHeight[building.type]?.max || 15;
        if (building.height_meters > maxHeight) {
          buildingViolations.push({
            type: 'Height Violation',
            severity: 'High',
            current: building.height_meters,
            allowed: maxHeight,
            description: `Building height ${building.height_meters}m exceeds maximum allowed ${maxHeight}m for ${building.type} construction`
          });
        }
        
        // Check floor area violations
        const maxArea = standardParameters.floorArea[building.type]?.max || 200;
        if (building.area_sq_meters > maxArea) {
          buildingViolations.push({
            type: 'Floor Area Violation',
            severity: 'Medium',
            current: building.area_sq_meters,
            allowed: maxArea,
            description: `Floor area ${building.area_sq_meters} sq.m exceeds maximum allowed ${maxArea} sq.m for ${building.type} construction`
          });
        }
        
        // Check floor count violations (assuming 3m per floor)
        const expectedHeight = building.floors * 3;
        if (Math.abs(building.height_meters - expectedHeight) > 2) {
          buildingViolations.push({
            type: 'Floor Count Mismatch',
            severity: 'Low',
            current: `${building.floors} floors, ${building.height_meters}m height`,
            allowed: `${Math.round(building.height_meters / 3)} floors expected`,
            description: `Floor count doesn't match building height`
          });
        }
        
        if (buildingViolations.length > 0) {
          violations.push({
            building: building,
            violations: buildingViolations,
            riskScore: buildingViolations.reduce((score, v) => 
              score + (v.severity === 'High' ? 3 : v.severity === 'Medium' ? 2 : 1), 0
            )
          });
          totalViolations += buildingViolations.length;
        }
      });
      
      // Check road violations
      droneData.roads.forEach(road => {
        const minWidth = standardParameters.roadWidth.residential.min;
        if (road.width_meters < minWidth) {
          violations.push({
            road: road,
            violations: [{
              type: 'Road Width Violation',
              severity: 'High',
              current: road.width_meters,
              allowed: minWidth,
              description: `Road width ${road.width_meters}m is below minimum required ${minWidth}m`
            }],
            riskScore: 3
          });
          totalViolations++;
        }
      });
      
      // Calculate compliance rate and risk score
      const complianceRate = totalBuildings > 0 ? ((totalBuildings - violations.length) / totalBuildings) * 100 : 100;
      const riskScore = violations.reduce((total, v) => total + v.riskScore, 0);
      
      // Generate recommendations
      const recommendations = [];
      if (riskScore > 10) {
        recommendations.push('Immediate action required: High-risk violations detected');
      } else if (riskScore > 5) {
        recommendations.push('Moderate risk: Schedule inspection within 48 hours');
      } else {
        recommendations.push('Low risk: Regular monitoring recommended');
      }
      
      if (violations.some(v => v.violations.some(viol => viol.severity === 'High'))) {
        recommendations.push('High severity violations require immediate demolition orders');
      }
      
      setAnalysisResults({
        violations,
        riskScore,
        complianceRate: Math.round(complianceRate),
        recommendations
      });
      
      return { violations, riskScore, complianceRate, recommendations };
    } catch (error) {
      console.error('Error analyzing drone data:', error);
      toast.error('Error analyzing drone data');
      return null;
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
        try {
          // Load Leaflet CSS
          if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
          }

          // Load Leaflet JS
          if (!window.L) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
          }

          // After Leaflet loads, load the marker cluster plugin
          await loadMarkerCluster();
        } catch (error) {
          console.error('Error loading Leaflet:', error);
          toast.error('Failed to load map library');
        }
      };

      const loadMarkerCluster = async () => {
        try {
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
            await new Promise((resolve, reject) => {
              const clusterScript = document.createElement('script');
              clusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
              clusterScript.onload = resolve;
              clusterScript.onerror = reject;
              document.head.appendChild(clusterScript);
            });
          }

          await loadHeatLayer();
        } catch (error) {
          console.error('Error loading marker cluster:', error);
          toast.error('Failed to load map plugins');
        }
      };

      const loadHeatLayer = async () => {
        try {
          // Load heat layer plugin if not available
          if (!window.L.heatLayer) {
            await new Promise((resolve, reject) => {
              const heatScript = document.createElement('script');
              heatScript.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
              heatScript.onload = resolve;
              heatScript.onerror = reject;
              document.head.appendChild(heatScript);
            });
          }

          // Initialize map after all plugins are loaded
          setTimeout(() => {
            initializeMap();
          }, 100);
        } catch (error) {
          console.error('Error loading heat layer:', error);
          // Continue without heat layer
          setTimeout(() => {
            initializeMap();
          }, 100);
        }
      };

      loadLeaflet();
    }

    // Cleanup when map view is closed
    return () => {
      if (!showMapView) {
        cleanupMap();
      }
    };
  }, [showMapView]);

  // Cleanup map resources safely
  const cleanupMap = useCallback(() => {
    try {
      // Clear markers safely
      if (markers.length > 0) {
        markers.forEach(marker => {
          try {
            if (marker && marker.remove && typeof marker.remove === 'function') {
              marker.remove();
            }
          } catch (error) {
            console.warn('Error removing marker:', error);
          }
        });
        setMarkers([]);
      }
      
      // Clear heat layer safely
      if (heatLayer && mapInstance) {
        try {
          if (mapInstance.removeLayer && typeof mapInstance.removeLayer === 'function') {
            mapInstance.removeLayer(heatLayer);
          }
        } catch (error) {
          console.warn('Error removing heat layer:', error);
        }
        setHeatLayer(null);
      }
      
      // Clear marker cluster safely
      if (markerCluster && mapInstance) {
        try {
          if (mapInstance.removeLayer && typeof mapInstance.removeLayer === 'function') {
            mapInstance.removeLayer(markerCluster);
          }
        } catch (error) {
          console.warn('Error removing marker cluster:', error);
        }
        setMarkerCluster(null);
      }
      
      // Remove map instance safely
      if (mapInstance && mapInstance._container) {
        try {
          if (mapInstance.remove && typeof mapInstance.remove === 'function') {
            mapInstance.remove();
          }
        } catch (error) {
          console.warn('Error removing map instance:', error);
        }
        setMapInstance(null);
      }
      
      // Reset state
      setWardSummary({});
      setMapLoading(false);
    } catch (error) {
      console.error('Error during map cleanup:', error);
    }
  }, [markers, heatLayer, markerCluster, mapInstance]);

  // Initialize map
  const initializeMap = async () => {
    if (mapInstance) return;
    
    try {
      setMapLoading(true);
      
      // Wait for Leaflet to be available
      let attempts = 0;
      while (!window.L && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!window.L) {
        toast.error('Failed to load map library. Please refresh the page.');
        setMapLoading(false);
        return;
      }
      
      // Create map instance
      const map = window.L.map('map').setView([22.7196, 75.8577], 12);
      
      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      setMapInstance(map);
      
      // Show initial data from surveys
      if (surveys.length > 0) {
        showConstructions(surveys.filter(s => s.coordinates));
      }
      
      setMapLoading(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Failed to initialize map. Please try again.');
      setMapLoading(false);
    }
  };

  // Reset map and charts
  const resetMap = useCallback(() => {
    try {
      // Clear markers safely
      if (markers.length > 0) {
        markers.forEach(marker => {
          try {
            if (marker && marker.remove && typeof marker.remove === 'function') {
              marker.remove();
            }
          } catch (error) {
            console.warn('Error removing marker:', error);
          }
        });
        setMarkers([]);
      }
      
      // Clear heat layer safely
      if (heatLayer && mapInstance) {
        try {
          if (mapInstance.removeLayer && typeof mapInstance.removeLayer === 'function') {
            mapInstance.removeLayer(heatLayer);
          }
        } catch (error) {
          console.warn('Error removing heat layer:', error);
        }
        setHeatLayer(null);
      }
      
      // Clear marker cluster safely
      if (markerCluster && mapInstance) {
        try {
          if (mapInstance.removeLayer && typeof mapInstance.removeLayer === 'function') {
            mapInstance.removeLayer(markerCluster);
          }
        } catch (error) {
          console.warn('Error removing marker cluster:', error);
        }
        setMarkerCluster(null);
      }
      
      setWardSummary({});
      setDetectedConstructions([]);
    } catch (error) {
      console.error('Error resetting map:', error);
    }
  }, [markers, heatLayer, markerCluster, mapInstance]);

  // Add ward boundary markers to map
  const addWardBoundaries = useCallback(() => {
    if (!mapInstance || !window.L) return;
    
    try {
      // Add ward boundary markers (simplified as circles for demonstration)
      const wardMarkers = [];
      wards.forEach((ward, index) => {
        try {
          const marker = window.L.circleMarker([ward.lat, ward.lng], {
            radius: 8,
            fillColor: '#3B82F6',
            color: '#1E40AF',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7
          }).addTo(mapInstance);
          
          marker.bindPopup(`
            <div class="p-2">
              <h3 class="font-bold">${ward.name}</h3>
              <p><strong>Ward Number:</strong> ${index + 1}</p>
              <p><strong>Coordinates:</strong> ${ward.lat.toFixed(4)}, ${ward.lng.toFixed(4)}</p>
              <p class="text-sm text-gray-600 mt-2">Click on map to view ward details</p>
            </div>
          `);
          
          // Add click event to center map on ward
          marker.on('click', () => {
            mapInstance.setView([ward.lat, ward.lng], 14);
            // Auto-fill the ward inputs using state
            setWardNumber(String(index + 1));
            setWardName(ward.name);
          });
          
          wardMarkers.push(marker);
        } catch (error) {
          console.warn('Error creating ward boundary marker:', error);
        }
      });
      
      return wardMarkers;
    } catch (error) {
      console.error('Error adding ward boundaries:', error);
      toast.error('Error adding ward boundaries to map');
      return [];
    }
  }, [mapInstance]);

  // Detect ward from map click
  const detectWardFromMap = useCallback((wardName) => {
    const ward = wards.find(w => w.name === wardName);
    if (ward) {
      // Set the ward number input
      const wardNumberInput = document.querySelector('input[type="number"]');
      if (wardNumberInput) {
        wardNumberInput.value = wards.indexOf(ward) + 1;
      }
      
      // Set the ward name input
      const wardNameInput = document.querySelector('input[placeholder="Ward Name"]');
      if (wardNameInput) {
        wardNameInput.value = ward.name;
      }
      
      // Trigger ward detection
      detectWard();
    }
  }, [wards]);

  // Cleanup function when component unmounts
  useEffect(() => {
    return () => {
      cleanupMap();
    };
  }, [cleanupMap]);

  // Show constructions on map
  const showConstructions = useCallback((constructions) => {
    if (!mapInstance || !window.L) return;
    
    try {
      // Clear existing markers safely
      if (markers.length > 0) {
        markers.forEach(marker => {
          try {
            if (marker && marker.remove && typeof marker.remove === 'function') {
              marker.remove();
            }
          } catch (error) {
            console.warn('Error removing existing marker:', error);
          }
        });
        setMarkers([]);
      }
      
      // Create new markers from survey data
      const newMarkers = [];
      const wardData = {};
      
      constructions.forEach(survey => {
        if (survey.coordinates && survey.violations && survey.violations.length > 0) {
          try {
            // Create marker with different colors based on violation severity
            const highSeverity = survey.violations.filter(v => v.severity === 'high').length;
            const mediumSeverity = survey.violations.filter(v => v.severity === 'medium').length;
            
            let markerColor = '#10B981'; // Green for compliant
            if (highSeverity > 0) {
              markerColor = '#EF4444'; // Red for high severity
            } else if (mediumSeverity > 0) {
              markerColor = '#F59E0B'; // Yellow for medium severity
            }
            
            const marker = window.L.circleMarker([survey.coordinates.latitude, survey.coordinates.longitude], {
              radius: 12,
              fillColor: markerColor,
              color: '#1F2937',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8
            }).addTo(mapInstance);
            
            marker.bindPopup(`
              <div class="p-2">
                <h3 class="font-bold">Survey ${survey.id}</h3>
                <p><strong>Ward:</strong> ${survey.ward_no}</p>
                <p><strong>Violations:</strong> ${survey.violations.length}</p>
                <p><strong>Date:</strong> ${survey.survey_date}</p>
                <p><strong>Compliance:</strong> ${survey.compliance_score || 100}%</p>
                <p><strong>Coordinates:</strong> ${survey.coordinates.latitude.toFixed(4)}, ${survey.coordinates.longitude.toFixed(4)}</p>
              </div>
            `);
            
            newMarkers.push(marker);
            
            // Track ward data
            if (!wardData[survey.ward_no]) {
              wardData[survey.ward_no] = {
                count: 0,
                violations: 0,
                surveys: []
              };
            }
            wardData[survey.ward_no].count++;
            wardData[survey.ward_no].violations += survey.violations.length;
            wardData[survey.ward_no].surveys.push(survey);
          } catch (error) {
            console.warn('Error creating marker for survey:', survey.id, error);
          }
        }
      });
      
      setMarkers(newMarkers);
      setWardSummary(wardData);
      
      // Update detected list table
      updateDetectedList(constructions);
      
      // Fit map to show all markers
      if (newMarkers.length > 0) {
        try {
          const group = window.L.featureGroup(newMarkers);
          mapInstance.fitBounds(group.getBounds());
        } catch (error) {
          console.warn('Error fitting map bounds:', error);
        }
      }
    } catch (error) {
      console.error('Error showing constructions:', error);
      toast.error('Error displaying map data');
    }
  }, [mapInstance, markers]);

  // Update detected list table
  const updateDetectedList = useCallback((constructions) => {
    // Instead of directly manipulating DOM, we'll use React state
    // This will be handled by the component's render method
    setDetectedConstructions(constructions);
  }, []);

  // Detect specific ward
  const detectWard = () => {
    if (!mapInstance) {
      toast.error("Map is still loading. Please wait a moment.");
      return;
    }
    
    try {
      const wardNum = parseInt(wardNumber);
      const wardNameTrimmed = wardName.trim();
      
      if (!wardNum && !wardNameTrimmed) {
        toast.error("Please enter Ward Number or Name!");
        return;
      }
      
      let targetWard;
      if (wardNum) {
        // Find ward by number (1-85)
        if (wardNum < 1 || wardNum > 85) {
          toast.error("Ward number must be between 1 and 85!");
          return;
        }
        targetWard = wards[wardNum - 1];
      } else {
        // Find ward by name
        targetWard = wards.find(w => w.name.toLowerCase().includes(wardNameTrimmed.toLowerCase()));
      }
      
      if (!targetWard) {
        toast.error("Ward not found!");
        return;
      }
      
      // Filter surveys for this specific ward - check both ward name and ward number
      const wardSurveys = surveys.filter(s => {
        return s.ward_no === targetWard.name || s.ward_number === wards.indexOf(targetWard) + 1;
      });
      
      if (wardSurveys.length === 0) {
        toast.info(`No survey data found for ${targetWard.name}`);
        // Center map on ward location
        mapInstance.setView([targetWard.lat, targetWard.lng], 14);
        
        // Clear existing markers and show ward boundary
        resetMap();
        
        try {
          // Add ward boundary marker
          const wardMarker = window.L.marker([targetWard.lat, targetWard.lng])
            .addTo(mapInstance)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-bold">${targetWard.name}</h3>
                <p><strong>Ward Number:</strong> ${wards.indexOf(targetWard) + 1}</p>
                <p><strong>Coordinates:</strong> ${targetWard.lat.toFixed(4)}, ${targetWard.lng.toFixed(4)}</p>
                <p><strong>Status:</strong> No survey data available</p>
              </div>
            `);
          
          setMarkers([wardMarker]);
        } catch (error) {
          console.warn('Error creating ward marker:', error);
        }
        return;
      }
      
      // Show constructions for this ward
      showConstructions(wardSurveys);
      
      // Center map on ward
      mapInstance.setView([targetWard.lat, targetWard.lng], 14);
      
      toast.success(`Showing data for ${targetWard.name} (${wardSurveys.length} surveys found)`);
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
      
      // Show all surveys with coordinates
      const allSurveys = surveys.filter(s => s.coordinates);
      if (allSurveys.length === 0) {
        toast.info("No survey data available to display");
        return;
      }
      
      showConstructions(allSurveys);
      
      // Reset map view to show all of Indore
      mapInstance.setView([22.7196, 75.8577], 12);
      
      toast.success("Showing all survey data for Indore");
    } catch (error) {
      console.error('Error showing full Indore:', error);
      toast.error("An error occurred while loading the full map. Please try again.");
    }
  };

  // Auto-fill ward name when ward number changes
  const handleWardNumberChange = (e) => {
    try {
      const num = parseInt(e.target.value);
      if (num >= 1 && num <= 85) {
        const ward = wards[num - 1];
        if (ward) {
          setWardName(ward.name);
        } else {
          setWardName('');
        }
      } else {
        setWardName('');
      }
    } catch (error) {
      console.warn('Error handling ward number change:', error);
    }
  };

  const saveSurveyData = async () => {
    try {
      // Prepare survey data for backend
      const surveyPayload = {
        ward_no: surveyData.wardNo,
        survey_date: new Date().toISOString().split('T')[0],
        drone_id: `DRONE_${Math.floor(Math.random() * 1000)}`,
        coordinates: {
          latitude: parseFloat(surveyData.geoCoordinates.split(',')[0]?.trim() || '22.7196'),
          longitude: parseFloat(surveyData.geoCoordinates.split(',')[1]?.trim() || '75.8577')
        },
        locality_details: surveyData.localityDetails,
        nearest_landmark: surveyData.nearestLandmark,
        survey_details: surveyData.surveyDetails,
        measuring_parameters: surveyData.measuringParameters,
        incharge_id: user?.email || 'unknown',
        survey_type: 'Manual Field Survey'
      };

      // Send survey data to backend
      const response = await fetch('http://localhost:8000/api/surveys/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          survey_data: JSON.stringify(surveyPayload)
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Survey data saved and uploaded to admin! Survey ID: ${result.survey_id}`);
        
        // Reset form
        setSurveyData({
          surveyDetails: '',
          wardNo: '',
          localityDetails: '',
          nearestLandmark: '',
          geoCoordinates: '',
          measuringParameters: {
            constructionType: '',
            buildingHeight: '',
            floorArea: '',
            setbacks: {
              front: '',
              rear: '',
              left: '',
              right: ''
            },
            parkingSpaces: '',
            greenArea: ''
          }
        });
        
    setShowSurveyForm(false);
        
        // Refresh surveys list
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to save survey data');
      }
    } catch (error) {
      console.error('Error saving survey data:', error);
      toast.error(`Failed to save survey data: ${error.message}`);
    }
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
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Show survey data if available
            const surveyData = ${JSON.stringify(surveys.filter(s => s.coordinates))};
            if (surveyData.length > 0) {
              surveyData.forEach(survey => {
                if (survey.coordinates && survey.violations && survey.violations.length > 0) {
                  const marker = L.marker([survey.coordinates.latitude, survey.coordinates.longitude])
                    .addTo(map)
                    .bindPopup(\`
                      <div class="p-2">
                        <h3 class="font-bold">Survey \${survey.id}</h3>
                        <p><strong>Ward:</strong> \${survey.ward_no}</p>
                        <p><strong>Violations:</strong> \${survey.violations.length}</p>
                        <p><strong>Date:</strong> \${survey.survey_date}</p>
                        <p><strong>Compliance:</strong> \${survey.compliance_score || 100}%</p>
                      </div>
                    \`);
                }
              });
            }
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

  const handleWardSelect = (wardIndex) => {
    if (wardIndex === -1) {
      // Show all wards
      showConstructions(surveys.filter(s => s.coordinates));
    } else {
      // Show specific ward
      const wardSurveys = surveys.filter(s => s.ward_no == wardIndex + 1);
      showConstructions(wardSurveys);
    }
  };

  // Check if Leaflet is loaded
  const isLeafletLoaded = () => {
    // eslint-disable-next-line no-undef
    return typeof window !== 'undefined' && window.L;
  };

  // Load Leaflet if not already loaded
  const loadLeaflet = () => {
    if (isLeafletLoaded()) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      // Check if Leaflet CSS is loaded
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      
      // Check if Leaflet JS is loaded
      // eslint-disable-next-line no-undef
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Leaflet'));
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  };

  // Initialize satellite map with ESRI imagery
  const initializeSatelliteMap = async () => {
    try {
      await loadLeaflet();
      
      if (!window.L) {
        toast.error('Failed to load map library');
        return;
      }
      
      const map = window.L.map('satellite-map').setView([22.7196, 75.8577], 12);
      
      // ESRI World Imagery (high-res satellite)
      const esriImagery = window.L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        }
      ).addTo(map);
      
      // Create a dedicated pane for labels
      map.createPane('labels');
      map.getPane('labels').classList.add('leaflet-labels-pane');
      
      // ESRI Reference labels (places/boundaries)
      const esriLabelsPlaces = window.L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          pane: 'labels',
          attribution: 'Labels © Esri'
        }
      ).addTo(map);
      
      // ESRI Transportation labels
      const esriLabelsTransport = window.L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          pane: 'labels',
          opacity: 0.9,
          attribution: 'Roads © Esri'
        }
      ).addTo(map);
      
      setSatelliteMapInstance(map);
      
      // Add ward markers if available
      if (dynamicWards.length > 0) {
        addWardMarkersToSatelliteMap(map);
      }
      
      toast.success('Satellite map loaded with ESRI imagery!');
    } catch (error) {
      console.error('Error initializing satellite map:', error);
      toast.error('Failed to initialize satellite map');
    }
  };

  // Add ward markers to satellite map
  const addWardMarkersToSatelliteMap = (map) => {
    if (!map || !window.L) return;
    
    try {
      const markers = [];
      
      dynamicWards.forEach((ward, index) => {
        const marker = window.L.marker([ward.lat, ward.lng])
          .addTo(map)
          .bindPopup(`
            <div class="p-3">
              <h4 class="font-bold text-lg">${ward.name}</h4>
              <p class="text-sm text-gray-600">Ward ID: ${ward.id}</p>
              <p class="text-sm text-gray-600">Data Records: ${ward.data.length}</p>
              <button onclick="window.analyzeWardData(${ward.id})" class="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm">
                Analyze Data
              </button>
            </div>
          `);
        
        markers.push(marker);
      });
      
      setSatelliteMarkers(markers);
      
      // Fit map to show all markers
      if (markers.length > 0) {
        const group = window.L.featureGroup(markers);
        map.fitBounds(group.getBounds());
      }
    } catch (error) {
      console.error('Error adding ward markers:', error);
    }
  };

  // Make analyzeWardData available globally for map popup buttons
  useEffect(() => {
    window.analyzeWardData = analyzeWardData;
    return () => {
      delete window.analyzeWardData;
    };
  }, [dynamicWards]);

  // Analyze ward data and show results
  const analyzeWardData = (wardId) => {
    const ward = dynamicWards.find(w => w.id === wardId);
    if (!ward) return;
    
    // Analyze the ward's data
    const analysis = analyzeWardDataForCompliance(ward.data);
    setWardAnalysisData({ ...analysis, wardName: ward.name });
    setShowAnalysisModal(true);
  };

  // Analyze ward data for compliance
  const analyzeWardDataForCompliance = (wardData) => {
    try {
      let totalRecords = wardData.length;
      let complianceScore = 0;
      let violations = [];
      
      // Simple compliance analysis based on data quality and completeness
      wardData.forEach(record => {
        let recordScore = 0;
        const fields = Object.keys(record);
        
        // Check data completeness
        const filledFields = fields.filter(field => record[field] && record[field] !== '');
        const completeness = (filledFields.length / fields.length) * 100;
        
        if (completeness >= 90) recordScore += 30;
        else if (completeness >= 70) recordScore += 20;
        else if (completeness >= 50) recordScore += 10;
        
        // Check for potential violations in data
        if (record.height && record.height > 15) {
          violations.push({
            type: 'Height Violation',
            severity: 'Medium',
            description: `Building height ${record.height}m may exceed limits`
          });
          recordScore -= 10;
        }
        
        if (record.area && record.area > 200) {
          violations.push({
            type: 'Area Violation',
            severity: 'Low',
            description: `Building area ${record.area} sq.m may exceed limits`
          });
          recordScore -= 5;
        }
        
        complianceScore += Math.max(0, recordScore);
      });
      
      const averageCompliance = totalRecords > 0 ? complianceScore / totalRecords : 0;
      
      return {
        totalRecords,
        complianceScore: Math.round(averageCompliance),
        violations,
        riskLevel: averageCompliance >= 80 ? 'Low' : averageCompliance >= 60 ? 'Medium' : 'High'
      };
    } catch (error) {
      console.error('Error analyzing ward data:', error);
      return { totalRecords: 0, complianceScore: 0, violations: [], riskLevel: 'Unknown' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Custom CSS for components */}
      <style jsx>{`
        .card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }
        .card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transform: translateY(-2px);
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .btn-secondary {
          background: #6b7280;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn-secondary:hover {
          background: #4b5563;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .btn-success {
          background: #10b981;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn-success:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.9);
        }
        .input-field:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          background: white;
        }
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.75rem;
        }
        .shadow-medium {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        /* Satellite map label styles */
        .leaflet-pane.leaflet-labels-pane { 
          z-index: 650 !important; 
          pointer-events: none; 
        }
        
        #satellite-map {
          min-height: 400px;
        }

        /* Modern scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      
      <CommonHeader
        user={user}
        userRole="incharge"
        onLogout={handleLogout}
        onRefresh={fetchSurveysData}
        onChatToggle={() => setShowChat(!showChat)}
        showChat={showChat}
        loading={loading}
        notifications={3}
        messages={2}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 flex items-center space-x-4 shadow-2xl">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              <span className="text-gray-700 font-medium">Loading dashboard data...</span>
            </div>
          </div>
        )}
        
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {user?.name || 'Department Incharge'}!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage your department's complaints, monitor team performance, and conduct field surveys with our advanced analytics platform for Indore Smart City Development Association.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="group card p-8 text-center hover:shadow-medium transition-all duration-300 cursor-pointer transform hover:-translate-y-2" onClick={() => setShowSurveyForm(true)}>
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Camera className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">Start Field Survey</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Conduct drone-based or manual field inspections with advanced analytics</p>
            <div className="mt-4 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"></div>
          </div>

          <div className="group card p-8 text-center hover:shadow-medium transition-all duration-300 cursor-pointer transform hover:-translate-y-2" onClick={() => setShowDroneManagement(true)}>
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Plane className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">Drone Management</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Connect and manage drone equipment with fleet coordination</p>
            <div className="mt-4 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-green-500 to-teal-600 transition-all duration-300"></div>
          </div>

          <div className="group card p-8 text-center hover:shadow-medium transition-all duration-300 cursor-pointer transform hover:-translate-y-2" onClick={() => setShowDataManagement(true)}>
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Database className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">Data Management</h3>
            <p className="text-gray-600 text-sm leading-relaxed">View and manage survey data with comprehensive analytics</p>
            <div className="mt-4 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-purple-500 to-rose-600 transition-all duration-300"></div>
          </div>

          <div className="group card p-8 text-center hover:shadow-medium transition-all duration-300 cursor-pointer transform hover:-translate-y-2" onClick={() => setShowSatelliteMap(true)}>
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <MapPin className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">Satellite Analysis</h3>
            <p className="text-gray-600 text-sm leading-relaxed">ESRI satellite imagery with advanced ward analysis</p>
            <div className="mt-4 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-500 to-pink-600 transition-all duration-300"></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Surveys</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSurveys}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSurveys}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Violations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViolations}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.complianceRate}%</p>
              </div>
            </div>
          </div>
        </div>



        {/* Department Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{dynamicData.complaints.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{dynamicData.complaints.filter(c => c.status === 'Resolved').length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{dynamicData.complaints.filter(c => c.status === 'In Progress').length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{dynamicData.complaints.filter(c => c.status === 'New').length}</p>
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
            {dynamicData.slaAlerts.length > 0 ? (
              dynamicData.slaAlerts.map((alert) => (
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
                      <p className="text-sm text-gray-600">ID: {alert.complaint_id} • Assigned to: {alert.assignee}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.time_left} left
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">No SLA alerts</p>
                <p className="text-sm text-gray-400">All complaints are within SLA</p>
              </div>
            )}
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
                {dynamicData.teamPerformance.length > 0 ? (
                  dynamicData.teamPerformance.map((member) => (
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
                      <div className="text-sm text-gray-900">{member.total_complaints}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.avg_resolution_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p>No team performance data available</p>
                  </td>
                </tr>
              )}
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
            {dynamicData.complaints.length > 0 ? (
              dynamicData.complaints.filter(c => c.status !== "New").map((complaint) => (
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
                    <span className="text-sm text-gray-500">{complaint.submitted_at ? new Date(complaint.submitted_at).toLocaleDateString() : 'N/A'}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                      complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No assigned complaints</p>
              <p className="text-sm text-gray-400">All complaints are currently unassigned</p>
            </div>
          )}
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

      {/* Drone Survey Analysis Modal */}
      {showSurveyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Drone Survey Analysis & Illegal Construction Detection</h3>
              <button
                onClick={() => setShowSurveyForm(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Chloroset Satellite Data Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <h5 className="font-medium text-blue-900">🛰️ Chloroset Satellite Data Source</h5>
                </div>
                <p className="text-sm text-blue-800">
                  All survey data is fetched by <strong>Chloroset Satellite</strong> providing high-resolution imagery and construction monitoring capabilities for urban development analysis and illegal construction detection.
                </p>
              </div>

              {/* Ward Selection and Excel Loading */}
              <div className="mb-6">
                <label className="form-label">Ward Selection *</label>
                <div className="flex space-x-2">
                  <select
                    name="wardNo"
                    value={surveyData.wardNo}
                    onChange={handleInputChange}
                    className="input-field flex-1"
                  >
                    <option value="">Select Ward</option>
                    {dynamicWards.length > 0 ? (
                      dynamicWards.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name} (ID: {ward.id})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading wards from Excel...</option>
                    )}
                  </select>
                  <button
                    onClick={loadExcelData}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
                    title="Load Wards from Excel"
                  >
                    <Database className="h-4 w-4" />
                    <span>Load Excel</span>
                  </button>
                </div>
                {dynamicWards.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Click "Load Excel" to load ward data from Excel file
                  </p>
                )}
              </div>

              {/* Drone Data Analysis Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🚁 Drone Survey Data Analysis</h4>
                <div className="space-y-4">
                  
                  {/* Data Loading Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700">📥 Load Data</h5>
                      <div className="space-y-2">
                        <button
                          onClick={loadDroneSurveyData}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
                        >
                          <Plane className="h-4 w-4" />
                          <span>Load Sample Data</span>
                        </button>
                        
                        <div className="relative">
                          <input
                            type="file"
                            accept=".json"
                            onChange={loadExternalDroneData}
                            className="hidden"
                            id="droneDataFile"
                          />
                          <label
                            htmlFor="droneDataFile"
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload JSON File</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700">📤 Data Management</h5>
                      <div className="space-y-2">
                        <button
                          onClick={exportDroneData}
                          disabled={droneSurveyData.length === 0}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export Data</span>
                        </button>
                        
                        <button
                          onClick={clearDroneData}
                          disabled={droneSurveyData.length === 0}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Clear Data</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* File Upload Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h6 className="font-medium text-blue-900 mb-2">📋 JSON File Format Requirements:</h6>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• File must contain an array of survey objects</p>
                      <p>• Each survey must have: ward_no, drone_id, coordinates, buildings array</p>
                      <p>• Buildings array should contain objects with height_meters, floors, area_sq_meters, type, status</p>
                      <p>• Example: <code className="bg-blue-100 px-1 rounded">{"{ward_no: 12, drone_id: 'DRN_001', coordinates: {lat, lng}, buildings: [...]}"}</code></p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <button
                        onClick={() => {
                          const sampleData = [
                            {
                              "ward_no": 12,
                              "survey_date": "2025-08-17",
                              "drone_id": "DRN_001",
                              "coordinates": {
                                "latitude": 22.7196,
                                "longitude": 75.8577
                              },
                              "buildings": [
                                {
                                  "building_id": "B001",
                                  "height_meters": 25.0,
                                  "floors": 7,
                                  "area_sq_meters": 320.0,
                                  "type": "residential",
                                  "status": "legal"
                                }
                              ],
                              "violations": {
                                "illegal_buildings_detected": 0,
                                "encroachment_on_roads": false
                              }
                            }
                          ];
                          
                          const dataStr = JSON.stringify(sampleData, null, 2);
                          const dataBlob = new Blob([dataStr], { type: 'application/json' });
                          const url = URL.createObjectURL(dataBlob);
                          
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = 'sample_drone_survey_data.json';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          
                          URL.revokeObjectURL(url);
                          toast.success('Sample JSON file downloaded!');
                        }}
                        className="text-blue-700 hover:text-blue-800 underline text-sm flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download Sample JSON Template</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Satellite View Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowSatelliteMap(true)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
                    >
                      <Map className="h-4 w-4" />
                      <span>View on Satellite Map</span>
                    </button>
                  </div>
                  
                  {/* Drone Survey Results Display */}
                  {droneSurveyData.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium text-gray-900">📊 Drone Survey Results</h5>
                        <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                          {droneSurveyData.length} survey{droneSurveyData.length !== 1 ? 's' : ''} loaded
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {droneSurveyData.map((survey, index) => (
                          <div key={index} className="bg-white p-3 rounded border hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium">Ward {survey.ward_no}</span>
                              <span className="text-sm text-gray-500">{survey.drone_id}</span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1 mb-3">
                              <p>🏢 Buildings: {survey.buildings.length}</p>
                              <p>🚨 Illegal: {survey.violations.illegal_buildings_detected}</p>
                              <p>🛣️ Road Encroachment: {survey.violations.encroachment_on_roads ? 'Yes' : 'No'}</p>
                              <p>📅 Date: {survey.survey_date}</p>
                            </div>
                            <button
                              onClick={() => {
                                const analysis = analyzeDroneData(survey);
                                if (analysis) {
                                  setShowAnalysisModal(true);
                                }
                              }}
                              className="w-full px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                            >
                              🔍 Analyze Violations
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Excel Data Preview */}
              {excelData.data.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Excel Data Preview (Chloroset Satellite)</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-3">
                      <label className="text-sm font-medium text-gray-700">Active Sheet:</label>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {excelData.sheets[excelData.selectedSheet]}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        ({excelData.data.length} records loaded)
                      </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                          <tr>
                            {excelData.headers.slice(0, 4).map((header, index) => (
                              <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {excelData.filteredData.slice(0, 3).map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              {excelData.headers.slice(0, 4).map((header, hIndex) => (
                                <td key={hIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {String(row[header] || '').substring(0, 25)}
                                  {String(row[header] || '').length > 25 ? '...' : ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="text-blue-600">🛰️ Data Source: Chloroset Satellite</span>
                      <span className="mx-2">•</span>
                      <button 
                        onClick={() => setShowDataManagement(true)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Full Dataset
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Parameters Display */}
              <div className="border-t pt-6 mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Standard Compliance Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-3">🏗️ Building Standards</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Residential Height:</span>
                        <span className="font-medium">{standardParameters.buildingHeight.residential.max}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commercial Height:</span>
                        <span className="font-medium">{standardParameters.buildingHeight.commercial.max}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Industrial Height:</span>
                        <span className="font-medium">{standardParameters.buildingHeight.industrial.max}m</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-900 mb-3">🛣️ Road Standards</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Primary Road:</span>
                        <span className="font-medium">{standardParameters.roadWidth.primary.min}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Secondary Road:</span>
                        <span className="font-medium">{standardParameters.roadWidth.secondary.min}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Residential Road:</span>
                        <span className="font-medium">{standardParameters.roadWidth.residential.min}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                <button
                  onClick={() => setShowSurveyForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (droneSurveyData.length > 0) {
                      toast.success('Drone data analysis completed! Check the analysis results.');
                    } else {
                      toast.info('Please load drone data first to analyze violations.');
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center space-x-2"
                >
                  <Plane className="h-4 w-4" />
                  <span>Analyze Survey Data</span>
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
                    value={wardNumber}
                    onChange={(e) => {
                      setWardNumber(e.target.value);
                      handleWardNumberChange(e);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward Name</label>
                  <input
                    type="text"
                    placeholder="Ward Name"
                    className="input-field w-48"
                    value={wardName}
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
                    onClick={() => {
                      if (mapInstance && window.L) {
                        addWardBoundaries();
                        toast.success('Ward boundaries added to map');
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Show Ward Boundaries
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
                        <tbody className="bg-white divide-y divide-gray-200">
                          {detectedConstructions.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                Select a ward or show full Indore to view constructions
                              </td>
                            </tr>
                          ) : (
                            detectedConstructions.map((survey, index) => {
                              const violations = survey.violations || [];
                              const highSeverity = violations.filter(v => v.severity === 'high').length;
                              const mediumSeverity = violations.filter(v => v.severity === 'medium').length;
                              const lowSeverity = violations.filter(v => v.severity === 'low').length;
                              
                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    Ward {survey.ward_no}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      {violations.length > 0 ? 'Violations Detected' : 'Compliant'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {highSeverity > 0 && <span className="text-red-600 font-medium mr-2">{highSeverity} High</span>}
                                    {mediumSeverity > 0 && <span className="text-yellow-600 font-medium mr-2">{mediumSeverity} Medium</span>}
                                    {lowSeverity > 0 && <span className="text-green-600 font-medium mr-2">{lowSeverity} Low</span>}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {survey.compliance_score || 100}%
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    Survey {survey.id}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {survey.coordinates?.latitude?.toFixed(4)}, {survey.coordinates?.longitude?.toFixed(4)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
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
      <div className="card p-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Surveys</h2>
            <p className="text-gray-600 text-lg">View and manage field surveys and illegal construction reports</p>
          </div>
          <button
            onClick={startSurvey}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-3"
          >
            <Camera className="h-5 w-5" />
            <span className="font-semibold">Start New Survey</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <div className="w-8 h-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading surveys...</p>
          </div>
        ) : surveys.length > 0 ? (
          <div className="space-y-6">
            {surveys.slice(0, 5).map((survey) => (
              <div key={survey.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-700">#{survey.id}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {survey.ward_no} (Ward {survey.ward_number})
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          {survey.drone_id}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Date:</span> 
                        <span className="text-gray-600 ml-1">{survey.survey_date}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Violations:</span> 
                        <span className="text-gray-600 ml-1">{survey.total_violations}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Coordinates:</span> 
                        <span className="text-gray-600 ml-1">{survey.coordinates?.latitude?.toFixed(4)}, {survey.coordinates?.longitude?.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                          survey.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {survey.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate(`/survey-results`, { state: { surveyId: survey.id, survey: survey } })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">View Results</span>
                    </button>
                    <button
                      onClick={() => navigate('/survey-form')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="font-medium">New Survey</span>
                    </button>
                  </div>
                </div>
                
                {/* Violations Summary */}
                {survey.violations && survey.violations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <h4 className="text-sm font-medium text-gray-900">Violations Detected:</h4>
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        {survey.violations.length} total
                      </span>
                    </div>
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
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
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
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center space-x-2 mx-auto"
                >
                  <Database className="h-4 w-4" />
                  <span>View All Surveys ({surveys.length})</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Surveys Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start your first field survey to begin monitoring and analyzing construction activities in your jurisdiction.
            </p>
            <button
              onClick={startSurvey}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 mx-auto"
            >
              <Camera className="h-5 w-5" />
              <span>Start Your First Survey</span>
            </button>
          </div>
        )}
      </div>

      {/* Analysis Results Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-red-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Illegal Construction Analysis Results</h3>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-white hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800">Risk Score</h4>
                  <p className="text-2xl font-bold text-red-600">{analysisResults.riskScore}</p>
                  <p className="text-sm text-red-600">
                    {analysisResults.riskScore > 10 ? 'High Risk' : 
                     analysisResults.riskScore > 5 ? 'Medium Risk' : 'Low Risk'}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800">Compliance Rate</h4>
                  <p className="text-2xl font-bold text-blue-600">{analysisResults.complianceRate}%</p>
                  <p className="text-sm text-blue-600">
                    {analysisResults.complianceRate >= 80 ? 'Good' : 
                     analysisResults.complianceRate >= 60 ? 'Fair' : 'Poor'}
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800">Total Violations</h4>
                  <p className="text-2xl font-bold text-yellow-600">{analysisResults.violations.length}</p>
                  <p className="text-sm text-yellow-600">Buildings with violations</p>
                </div>
              </div>

              {/* Violations Details */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Violations</h4>
                <div className="space-y-4">
                  {analysisResults.violations.length > 0 ? (
                    analysisResults.violations.map((violation, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">
                            {violation.building ? `Building ${violation.building.building_id}` : 
                             violation.road ? `Road ${violation.road.road_id}` : 'Unknown'}
                          </h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            violation.riskScore >= 3 ? 'bg-red-100 text-red-800' :
                            violation.riskScore >= 2 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            Risk: {violation.riskScore}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {violation.violations.map((v, vIndex) => (
                            <div key={vIndex} className="bg-white p-3 rounded border-l-4 border-red-400">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">{v.type}</p>
                                  <p className="text-sm text-gray-600">{v.description}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  v.severity === 'High' ? 'bg-red-100 text-red-800' :
                                  v.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {v.severity}
                                </span>
                              </div>
                              <div className="mt-2 text-sm text-gray-500">
                                <span>Current: {v.current}</span>
                                <span className="mx-2">•</span>
                                <span>Allowed: {v.allowed}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-gray-500">No violations detected</p>
                      <p className="text-sm text-gray-400">All constructions are compliant</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {analysisResults.recommendations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h4>
                  <div className="space-y-2">
                    {analysisResults.recommendations.map((rec, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-blue-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowAnalysisModal(false);
                    setShowSatelliteMap(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Satellite Map Modal */}
      {showSatelliteMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-7xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Satellite Imagery Map - ESRI</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={initializeSatelliteMap}
                  className="px-3 py-1 bg-white text-purple-600 rounded text-sm hover:bg-gray-100"
                >
                  Initialize Map
                </button>
                <button
                  onClick={() => setShowSatelliteMap(false)}
                  className="text-white hover:text-gray-200"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Ward Analysis Overview</h4>
                <p className="text-gray-600">
                  View satellite imagery with ward boundaries and analyze construction compliance across Indore
                </p>
              </div>
              
              {/* Map Container */}
              <div id="satellite-map" className="w-full h-96 rounded-lg border-2 border-gray-300 mb-4"></div>
              
              {/* Chloroset Satellite Data Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <h5 className="font-medium text-blue-900">🛰️ Chloroset Satellite Data</h5>
                </div>
                <p className="text-sm text-blue-800">
                  This data is fetched by <strong>Chloroset Satellite</strong> providing high-resolution imagery and construction monitoring capabilities for urban development analysis.
                </p>
              </div>
              
              {/* Excel Data Display */}
              {excelData.data.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h5 className="font-medium text-gray-900 mb-3">📊 Excel Sheet Data Analysis</h5>
                  <div className="mb-3">
                    <label className="text-sm font-medium text-gray-700">Select Sheet:</label>
                    <select 
                      value={excelData.selectedSheet} 
                      onChange={(e) => handleSheetChange(parseInt(e.target.value))}
                      className="ml-2 px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      {excelData.sheets.map((sheet, index) => (
                        <option key={index} value={index}>{sheet}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-white">
                        <tr>
                          {excelData.headers.slice(0, 6).map((header, index) => (
                            <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {excelData.filteredData.slice(0, 5).map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {excelData.headers.slice(0, 6).map((header, hIndex) => (
                              <td key={hIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {String(row[header] || '').substring(0, 20)}
                                {String(row[header] || '').length > 20 ? '...' : ''}
                              </td>
                            ))}
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => {
                                  const wardData = dynamicWards.find(w => 
                                    w.data.some(d => d === row)
                                  );
                                  if (wardData) {
                                    analyzeWardData(wardData.id);
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Analyze
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    Showing {Math.min(5, excelData.filteredData.length)} of {excelData.filteredData.length} records
                    {excelData.data.length > 5 && (
                      <span className="ml-2">
                        • <button 
                          onClick={() => setShowDataManagement(true)}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View All Data
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Ward Analysis Summary */}
              {Object.keys(wardAnalysisData).length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3">Ward Analysis: {wardAnalysisData.wardName}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">Total Records</p>
                      <p className="text-lg font-bold text-gray-900">{wardAnalysisData.totalRecords}</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">Compliance Score</p>
                      <p className="text-lg font-bold text-gray-900">{wardAnalysisData.complianceScore}%</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">Violations</p>
                      <p className="text-lg font-bold text-gray-900">{wardAnalysisData.violations.length}</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">Risk Level</p>
                      <p className={`text-lg font-bold ${
                        wardAnalysisData.riskLevel === 'High' ? 'text-red-600' :
                        wardAnalysisData.riskLevel === 'Medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {wardAnalysisData.riskLevel}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Map Controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  <p>• ESRI World Imagery provides high-resolution satellite views</p>
                  <p>• Click on ward markers to analyze data</p>
                  <p>• Use zoom and pan controls for detailed inspection</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      if (satelliteMapInstance) {
                        satelliteMapInstance.setView([22.7196, 75.8577], 12);
                      }
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Reset View
                  </button>
                  <button
                    onClick={() => {
                      if (satelliteMapInstance && dynamicWards.length > 0) {
                        addWardMarkersToSatelliteMap(satelliteMapInstance);
                      }
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Refresh Markers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InchargeDashboard;
