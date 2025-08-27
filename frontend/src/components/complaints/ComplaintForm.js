import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Camera, 
  Video, 
  FileText, 
  Upload, 
  Shield, 
  CheckCircle,
  XCircle,
  Info,
  Clock,
  Building,
  Car,
  TreeDeciduous,
  Lightbulb,
  Droplets,
  Trash2,
  Wifi,
  Zap,
  Home,
  Construction,
  MessageSquare,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import AuthContext from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ComplaintForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [wards, setWards] = useState([]);
  const [wardsLoading, setWardsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    incident_date: '',
    incident_time: '',
    address: '',
    ward: '',
    zone: '',
    latitude: '',
    longitude: '',
    landmark: '',
    full_name: user?.fullName || '',
    father_name: '',
    mother_name: '',
    date_of_birth: '',
    gender: '',
    contact_number: user?.contactNumber || '',
    residential_address: '',
    permanent_address: '',
    id_proof_type: '',
    id_proof_number: ''
  });

  const [files, setFiles] = useState({
    photos: [],
    videos: [],
    documents: [],
    id_proof_document: null,
    selfie: null
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredComplaint, setRegisteredComplaint] = useState(null);

  const categories = [
    { id: 'illegal_construction', name: 'Illegal Construction', icon: Building, color: 'bg-red-100 text-red-800' },
    { id: 'encroachment', name: 'Encroachment', icon: Construction, color: 'bg-orange-100 text-orange-800' },
    { id: 'sanitation', name: 'Sanitation & Garbage', icon: Trash2, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'water_supply', name: 'Water Supply', icon: Droplets, color: 'bg-blue-100 text-blue-800' },
    { id: 'street_lighting', name: 'Street Lighting', icon: Lightbulb, color: 'bg-purple-100 text-purple-800' },
    { id: 'road_issues', name: 'Road Issues', icon: Construction, color: 'bg-indigo-100 text-indigo-800' },
    { id: 'traffic', name: 'Traffic & Parking', icon: Car, color: 'bg-green-100 text-green-800' },
    { id: 'environment', name: 'Environment', icon: TreeDeciduous, color: 'bg-emerald-100 text-emerald-800' },
    { id: 'utilities', name: 'Utilities', icon: Zap, color: 'bg-amber-100 text-amber-800' },
    { id: 'internet', name: 'Internet & Connectivity', icon: Wifi, color: 'bg-cyan-100 text-cyan-800' },
    { id: 'other', name: 'Other', icon: Info, color: 'bg-gray-100 text-gray-800' }
  ];

  const zones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone', 'North-East Zone', 'North-West Zone', 'South-East Zone', 'South-West Zone'];

  const idProofTypes = [
    'Aadhaar Card', 'PAN Card', 'Voter ID', 'Driving License', 'Passport', 'Ration Card', 'Bank Passbook'
  ];

  // Fetch wards from API on component mount
  useEffect(() => {
    const fetchWards = async () => {
      try {
        console.log('Fetching wards from API...');
        setWardsLoading(true);
        
        const response = await fetch('http://localhost:8000/api/wards');
        console.log('API Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response data:', data);
          
          if (data.success && data.wards && data.wards.length > 0) {
            // Extract ward names from the API response
            const wardNames = data.wards.map(ward => ward.ward_name);
            console.log('Setting wards:', wardNames);
            setWards(wardNames);
          } else {
            console.log('No wards data in response, using fallback');
            setWards([
              'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10',
              'Ward 11', 'Ward 12', 'Ward 13', 'Ward 14', 'Ward 15', 'Ward 16', 'Ward 17', 'Ward 18', 'Ward 19', 'Ward 20'
            ]);
          }
        } else {
          console.error('API response not ok:', response.status, response.statusText);
          // Fallback to hardcoded wards if API fails
          setWards([
            'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10',
            'Ward 11', 'Ward 12', 'Ward 13', 'Ward 14', 'Ward 15', 'Ward 16', 'Ward 17', 'Ward 18', 'Ward 19', 'Ward 20'
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch wards:', error);
        // Fallback to hardcoded wards if API fails
        setWards([
          'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10',
          'Ward 11', 'Ward 12', 'Ward 13', 'Ward 14', 'Ward 15', 'Ward 16', 'Ward 17', 'Ward 18', 'Ward 19', 'Ward 20'
        ]);
      } finally {
        setWardsLoading(false);
      }
    };

    fetchWards();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fetch coordinates when ward is selected
    if (name === 'ward' && value) {
      fetchWardCoordinates(value);
    }
  };

  const fetchWardCoordinates = async (wardName) => {
    try {
      const response = await fetch(`http://localhost:8000/api/wards/coordinates/${encodeURIComponent(wardName)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.coordinates) {
          setFormData(prev => ({
            ...prev,
            latitude: data.coordinates.latitude.toString(),
            longitude: data.coordinates.longitude.toString()
          }));
          toast.success(`Coordinates fetched for ${wardName}`);
        }
      }
    } catch (error) {
      console.error('Failed to fetch coordinates for ward:', error);
      toast.error('Failed to fetch coordinates for selected ward');
    }
  };

  const handleFileChange = (e, fileType) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (fileType === 'id_proof_document' || fileType === 'selfie') {
      setFiles(prev => ({
        ...prev,
        [fileType]: selectedFiles[0]
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        [fileType]: [...prev[fileType], ...selectedFiles]
      }));
    }
  };

  const removeFile = (fileType, index) => {
    if (fileType === 'id_proof_document' || fileType === 'selfie') {
      setFiles(prev => ({
        ...prev,
        [fileType]: null
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        [fileType]: prev[fileType].filter((_, i) => i !== index)
      }));
    }
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.category && formData.incident_date;
      case 2:
        return formData.address && formData.ward && formData.zone;
      case 3:
        return formData.full_name && formData.contact_number && formData.id_proof_type && formData.id_proof_number;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add files
      if (files.photos.length > 0) {
        files.photos.forEach(photo => {
          formDataToSend.append('photos', photo);
        });
      }
      
      if (files.videos.length > 0) {
        files.videos.forEach(video => {
          formDataToSend.append('videos', video);
        });
      }
      
      if (files.documents.length > 0) {
        files.documents.forEach(doc => {
          formDataToSend.append('documents', doc);
        });
      }
      
      if (files.id_proof_document) {
        formDataToSend.append('id_proof_document', files.id_proof_document);
      }
      
      if (files.selfie) {
        formDataToSend.append('selfie', files.selfie);
      }

      const response = await fetch('http://localhost:8000/api/complaints/register', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        
        // Show success message with complaint ID
        toast.success(`Complaint registered successfully! Your complaint ID is: ${result.complaint_id}`);
        
        // Set the registered complaint and show success modal
        setRegisteredComplaint(result);
        setShowSuccessModal(true);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to register complaint');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to register complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? React.createElement(category.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" }) : null;
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 w-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Register Complaint</h1>
                  <p className="text-xs sm:text-sm text-gray-500">Report an issue to the municipal corporation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  stepNumber < step 
                    ? 'bg-green-500 text-white' 
                    : stepNumber === step 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber < step ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                    stepNumber < step ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-500">
            <span className="hidden sm:inline">Issue Details</span>
            <span className="sm:hidden">Details</span>
            <span className="hidden sm:inline">Location</span>
            <span className="sm:hidden">Location</span>
            <span className="hidden sm:inline">Personal Info</span>
            <span className="sm:hidden">Info</span>
            <span className="hidden sm:inline">Review & Submit</span>
            <span className="sm:hidden">Submit</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-soft p-4 sm:p-6 md:p-8">
          {/* Step 1: Issue Details */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">What's the issue?</h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Title */}
                <div>
                  <label className="form-label">Complaint Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief description of the issue"
                    className="form-input"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="form-label">Detailed Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide detailed information about the issue, when it started, and how it affects you..."
                    rows={4}
                    className="form-input"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="form-label">Category *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                        className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          formData.category === category.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                            {React.createElement(category.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                          </div>
                          <span className="font-medium text-gray-900 text-sm sm:text-base">{category.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="form-label">Incident Date *</label>
                    <input
                      type="date"
                      name="incident_date"
                      value={formData.incident_date}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Incident Time (Optional)</label>
                    <input
                      type="time"
                      name="incident_time"
                      value={formData.incident_time}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Where did this happen?</h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Address */}
                <div>
                  <label className="form-label">Full Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter the complete address where the issue occurred"
                    rows={3}
                    className="form-input"
                    required
                  />
                </div>

                {/* Ward and Zone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="form-label">Ward *</label>
                    {/* Debug info */}
                    <div className="text-xs text-gray-500 mb-2">
                      Debug: {wardsLoading ? 'Loading...' : `${wards.length} wards loaded`}
                    </div>
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Ward</option>
                      {wardsLoading ? (
                        <option value="">Loading wards...</option>
                      ) : wards.length === 0 ? (
                        <option value="">No wards found. Please try again later.</option>
                      ) : (
                        wards.map((ward) => (
                          <option key={ward} value={ward}>{ward}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Zone *</label>
                    <select
                      name="zone"
                      value={formData.zone}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Zone</option>
                      {zones.map((zone) => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label className="form-label">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby landmark or reference point"
                    className="form-input"
                  />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="form-label">Latitude (Optional)</label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="e.g., 22.7196"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Longitude (Optional)</label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="e.g., 75.8577"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Personal Information */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Information</h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Personal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Contact Number *</label>
                    <input
                      type="tel"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      placeholder="Your contact number"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Father's Name (Optional)</label>
                    <input
                      type="text"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleInputChange}
                      placeholder="Your father's name"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Mother's Name (Optional)</label>
                    <input
                      type="text"
                      name="mother_name"
                      value={formData.mother_name}
                      onChange={handleInputChange}
                      placeholder="Your mother's name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Date of Birth (Optional)</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Gender (Optional)</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <label className="form-label">Residential Address (Optional)</label>
                  <textarea
                    name="residential_address"
                    value={formData.residential_address}
                    onChange={handleInputChange}
                    placeholder="Your current residential address"
                    rows={2}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Permanent Address (Optional)</label>
                  <textarea
                    name="permanent_address"
                    value={formData.permanent_address}
                    onChange={handleInputChange}
                    placeholder="Your permanent address"
                    rows={2}
                    className="form-input"
                  />
                </div>

                {/* ID Proof */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">ID Proof Type *</label>
                    <select
                      name="id_proof_type"
                      value={formData.id_proof_type}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select ID Proof</option>
                      {idProofTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">ID Proof Number *</label>
                    <input
                      type="text"
                      name="id_proof_number"
                      value={formData.id_proof_number}
                      onChange={handleInputChange}
                      placeholder="Your ID proof number"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review and Submit */}
          {step === 4 && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review and Submit</h2>
              
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaint Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Title</p>
                      <p className="font-medium text-gray-900">{formData.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(formData.category)}`}>
                          {getCategoryIcon(formData.category)}
                          <span className="ml-1">
                            {categories.find(c => c.id === formData.category)?.name}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{formData.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ward & Zone</p>
                      <p className="font-medium text-gray-900">{formData.ward}, {formData.zone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Complainant</p>
                      <p className="font-medium text-gray-900">{formData.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium text-gray-900">{formData.contact_number}</p>
                    </div>
                  </div>
                </div>

                {/* File Uploads */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h3>
                  
                  <div className="space-y-4">
                    {/* Photos */}
                    <div>
                      <label className="form-label">Photos (Optional)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'photos')}
                          className="hidden"
                          id="photos-upload"
                        />
                        <label htmlFor="photos-upload" className="cursor-pointer">
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload photos</p>
                          <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                        </label>
                      </div>
                      {files.photos.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {files.photos.map((file, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile('photos', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Videos */}
                    <div>
                      <label className="form-label">Videos (Optional)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept="video/*"
                          onChange={(e) => handleFileChange(e, 'videos')}
                          className="hidden"
                          id="videos-upload"
                        />
                        <label htmlFor="videos-upload" className="cursor-pointer">
                          <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload videos</p>
                          <p className="text-sm text-gray-500">MP4, AVI up to 50MB each</p>
                        </label>
                      </div>
                      {files.videos.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {files.videos.map((file, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile('videos', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Documents */}
                    <div>
                      <label className="form-label">Documents (Optional)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, 'documents')}
                          className="hidden"
                          id="documents-upload"
                        />
                        <label htmlFor="documents-upload" className="cursor-pointer">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload documents</p>
                          <p className="text-sm text-gray-500">PDF, DOC up to 20MB each</p>
                        </label>
                      </div>
                      {files.documents.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {files.documents.map((file, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile('documents', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ID Proof Document */}
                    <div>
                      <label className="form-label">ID Proof Document (Optional)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'id_proof_document')}
                          className="hidden"
                          id="id-proof-upload"
                        />
                        <label htmlFor="id-proof-upload" className="cursor-pointer">
                          <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload ID proof</p>
                          <p className="text-sm text-gray-500">PDF, JPG, PNG up to 10MB</p>
                        </label>
                      </div>
                      {files.id_proof_document && (
                        <div className="mt-2 flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full w-fit">
                          <span className="text-sm text-gray-700">{files.id_proof_document.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile('id_proof_document')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Selfie */}
                    <div>
                      <label className="form-label">Selfie (Optional)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'selfie')}
                          className="hidden"
                          id="selfie-upload"
                        />
                        <label htmlFor="selfie-upload" className="cursor-pointer">
                          <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload selfie</p>
                          <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
                        </label>
                      </div>
                      {files.selfie && (
                        <div className="mt-2 flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full w-fit">
                          <span className="text-sm text-gray-700">{files.selfie.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile('selfie')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-4">
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-success"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Complaint
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && registeredComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Complaint Registered Successfully!</h3>
              <p className="text-gray-600 mb-6">Your complaint has been submitted and is under review.</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Complaint ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-blue-800 font-bold">{registeredComplaint.complaint_id}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(registeredComplaint.complaint_id);
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
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Title:</span>
                    <span className="text-gray-800">{registeredComplaint.complaint.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="text-gray-800">{registeredComplaint.complaint.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="text-gray-800">{new Date(registeredComplaint.complaint.submitted_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Please save this complaint ID for tracking purposes.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setRegisteredComplaint(null);
                    navigate('/dashboard');
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setRegisteredComplaint(null);
                    // Reset form for new complaint
                    setStep(1);
                    setFormData({
                      title: '',
                      description: '',
                      category: '',
                      incident_date: '',
                      incident_time: '',
                      address: '',
                      ward: '',
                      zone: '',
                      latitude: '',
                      longitude: '',
                      landmark: '',
                      full_name: user?.fullName || '',
                      father_name: '',
                      mother_name: '',
                      date_of_birth: '',
                      gender: '',
                      contact_number: user?.contactNumber || '',
                      residential_address: '',
                      permanent_address: '',
                      id_proof_type: '',
                      id_proof_number: ''
                    });
                    setFiles({
                      photos: [],
                      videos: [],
                      documents: [],
                      id_proof_document: null,
                      selfie: null
                    });
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Register Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintForm;
