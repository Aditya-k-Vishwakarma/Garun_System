import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Shield, 
  FileText, 
  Users, 
  Building, 
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const heroRef = useRef(null);

  // Handle scroll for parallax and navbar effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Smooth scroll function
  const smoothScrollTo = (elementId) => {
    document.getElementById(elementId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    setIsMenuOpen(false);
  };

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Geo-Spatial Analysis",
      description: "Advanced mapping and spatial analysis for urban planning and development"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Unauthorized Node Detection",
      description: "AI-powered recognition and monitoring of illegal constructions"
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-600" />,
      title: "Smart Documentation",
      description: "Digital complaint management and building approval systems"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Citizen Engagement",
      description: "Direct communication channels between citizens and authorities"
    },
    {
      icon: <Building className="w-8 h-8 text-red-600" />,
      title: "Property Verification",
      description: "Comprehensive property validation and verification services"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-teal-600" />,
      title: "Compliance Monitoring",
      description: "Real-time monitoring of construction and development compliance"
    }
  ];

  const stats = [
    { number: "", label: "Properties Analyzed" },
    { number: "", label: "Complaints Resolved" },
    { number: "", label: "Accuracy Rate" },
    { number: "", label: "Monitoring" }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-on-scroll {
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-in {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-in.from-left {
          animation: fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-in.from-right {
          animation: fadeInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-in.scale {
          animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .stagger-delay-1 { animation-delay: 0.1s; }
        .stagger-delay-2 { animation-delay: 0.2s; }
        .stagger-delay-3 { animation-delay: 0.3s; }
        .stagger-delay-4 { animation-delay: 0.4s; }
        .stagger-delay-5 { animation-delay: 0.5s; }
        .stagger-delay-6 { animation-delay: 0.6s; }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .ripple-effect {
          position: relative;
          overflow: hidden;
        }

        .ripple-effect::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transition: width 0.6s, height 0.6s, top 0.6s, left 0.6s;
          transform: translate(-50%, -50%);
        }

        .ripple-effect:hover::before {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
        }

        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-2xl font-bold text-white">Garun Systems</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                <button 
                  onClick={() => smoothScrollTo('features')} 
                  className="text-white/90 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 glass-effect"
                >
                  Features
                </button>
                <button 
                  onClick={() => smoothScrollTo('about')} 
                  className="text-white/90 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 glass-effect"
                >
                  About
                </button>
                <Link to="/login" className="text-white/90 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 glass-effect">
                  Login
                </Link>
                <Link to="/signup" className="ripple-effect glass-effect hover:bg-white/30 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-white/30 transform hover:scale-105">
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-white/80 p-2 rounded-lg glass-effect transition-all duration-300 transform hover:scale-110"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen 
            ? 'max-h-64 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-black/90 backdrop-blur-md border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => smoothScrollTo('features')} className="text-white/90 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all duration-300">
                Features
              </button>
              <button onClick={() => smoothScrollTo('about')} className="text-white/90 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all duration-300">
                About
              </button>
              <Link to="/login" className="text-white/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all duration-300">
                Login
              </Link>
              <Link to="/signup" className="glass-effect hover:bg-white/30 text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-300">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img 
            src="/images/Home.webp" 
            alt="Garun Systems Hero Background" 
            className="w-full h-[120%] object-cover"
          />
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-purple-900/50 to-blue-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-8 animate-on-scroll">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 glass-effect rounded-full border border-white/30 transform hover:scale-105 transition-all duration-300 floating-animation">
              <span className="text-sm font-medium text-white/95">
                Indore Municipal Corporation
              </span>
            </div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-purple-400 animate-pulse">
                  Smart City Development
                </span>
                <span className="block text-white mt-2 animate-on-scroll stagger-delay-2">
                  Association Presents
                </span>
              </h1>
              
              <h2 className="text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-300 to-blue-300 animate-on-scroll stagger-delay-3">
                Garun Systems
              </h2>
            </div>
            
            {/* Description */}
            <div className="animate-on-scroll stagger-delay-4">
              <p className="text-xl lg:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed">
                <span className="font-semibold text-white">Geo-Spatial Analysis Recognition of Unauthorized Nodes</span>
                <br />
                <span className="text-lg text-white/85">Advanced technology for urban development and construction monitoring</span>
              </p>
            </div>
            
            {/* CTA Buttons */}
           
          </div>
        </div>
        
        {/* Enhanced Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/30 rounded-full blur-xl animate-pulse floating-animation z-10"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-xl animate-pulse floating-animation delay-1000 z-10" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-blue-400/40 rounded-full blur-lg floating-animation z-10" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-32 w-12 h-12 bg-purple-300/40 rounded-full blur-lg floating-animation z-10" style={{ animationDelay: '3s' }}></div>
        
        {/* Scroll Indicator */}
        
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl floating-animation"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-2xl floating-animation" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-2xl floating-animation" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Municipal Corporations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform has been successfully deployed across multiple cities with impressive results
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`animate-on-scroll stagger-delay-${index + 1} group relative text-center p-8 rounded-2xl glass-effect bg-white/70 hover:bg-white/90 transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:-translate-y-2`}>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-700 font-medium">{stat.label}</div>
                
                {/* Enhanced Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Smart City Management
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how Garun Systems revolutionizes urban development with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`animate-on-scroll stagger-delay-${index + 1} group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 hover:border-blue-200`}>
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl floating-animation"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll from-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transforming Urban Development
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Garun Systems represents the future of smart city management, combining advanced geo-spatial analysis 
                with artificial intelligence to create sustainable, compliant, and well-planned urban environments.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform enables municipal corporations to efficiently monitor construction activities, 
                detect unauthorized developments, and provide seamless citizen services through a unified digital platform.
              </p>
              
              <div className="space-y-4">
                {[
                  "Real-time monitoring and alerts",
                  "AI-powered unauthorized construction detection",
                  "Comprehensive citizen complaint management"
                ].map((item, index) => (
                  <div key={index} className={`animate-on-scroll stagger-delay-${index + 1} flex items-center group`}>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-on-scroll from-right">
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-blue-600 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-20 h-20 bg-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-white rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Why Choose Garun Systems?</h3>
                  <ul className="space-y-4">
                    {[
                      "Advanced geo-spatial analysis capabilities",
                      "Real-time unauthorized construction detection",
                      "Integrated citizen engagement platform",
                      "Comprehensive property verification system"
                    ].map((item, index) => (
                      <li key={index} className={`animate-on-scroll stagger-delay-${index + 1} flex items-start group`}>
                        <CheckCircle className="h-5 w-5 text-green-300 mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 group-hover:text-green-200 transition-all duration-300" />
                        <span className="group-hover:text-white/95 transition-colors duration-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Floating decoration */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl floating-animation"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl floating-animation"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-2xl floating-animation" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-xl floating-animation" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your City?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the smart city revolution with Garun Systems. Experience the future of urban development today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-on-scroll stagger-delay-2">
            <Link to="/signup" className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-blue-600 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ripple-effect">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-xl text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 glass-effect ripple-effect">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="animate-on-scroll from-left">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Garun Systems</h3>
              <p className="text-gray-400 leading-relaxed">
                Transforming urban development through advanced geo-spatial analysis and smart city solutions.
              </p>
            </div>
            
            {[
              {
                title: "Services",
                items: ["Geo-Spatial Analysis", "Construction Monitoring", "Property Verification", "Citizen Services"]
              },
              {
                title: "Quick Links",
                items: [
                  { text: "Features", action: () => smoothScrollTo('features') },
                  { text: "About", action: () => smoothScrollTo('about') },
                  { text: "Login", link: "/login" },
                  { text: "Sign Up", link: "/signup" }
                ]
              },
              {
                title: "Contact",
                content: (
                  <div className="text-gray-400 space-y-2">
                    <p>Indore Municipal Corporation</p>
                    <p>Smart City Development Association</p>
                    <p>Madhya Pradesh, India</p>
                  </div>
                )
              }
            ].map((section, index) => (
              <div key={index} className={`animate-on-scroll stagger-delay-${index + 1}`}>
                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                {section.items ? (
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {typeof item === 'string' ? (
                          <span className="text-gray-400 hover:text-white transition-colors duration-300 cursor-default">
                            {item}
                          </span>
                        ) : item.link ? (
                          <Link to={item.link} className="text-gray-400 hover:text-white transition-colors duration-300">
                            {item.text}
                          </Link>
                        ) : (
                          <button onClick={item.action} className="text-gray-400 hover:text-white transition-colors duration-300">
                            {item.text}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  section.content
                )}
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center animate-on-scroll">
            <p className="text-gray-400">&copy; 2025 Garun Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;