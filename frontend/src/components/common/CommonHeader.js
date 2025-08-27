import React from 'react';
import { Shield, Bell, MessageCircle, RefreshCw, User, LogOut } from 'lucide-react';

const CommonHeader = ({ 
  user, 
  userRole, 
  onLogout, 
  onRefresh, 
  onChatToggle, 
  showChat, 
  loading = false,
  notifications = 0,
  messages = 0
}) => {
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin':
        return 'System Administrator';
      case 'incharge':
        return 'Department Incharge';
      case 'citizen':
        return 'Citizen User';
      default:
        return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-purple-600 to-indigo-600';
      case 'incharge':
        return 'from-blue-600 to-cyan-600';
      case 'citizen':
        return 'from-green-600 to-emerald-600';
      default:
        return 'from-gray-600 to-slate-600';
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-lg border-b-2 border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className={`h-14 w-14 bg-gradient-to-br ${getRoleColor(userRole)} rounded-xl flex items-center justify-center shadow-lg border-2 border-white`}>
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
                             <h1 className="text-2xl font-bold text-white mb-1">
                 🏛️ Indore Smart City
               </h1>
               <p className="text-sm text-blue-200 font-medium">Indore Smart City Development Association</p>
               <p className="text-xs text-gray-300">Ministry of Urban Development & Housing</p>
            </div>
          </div>
          
          {/* Right side - Actions and User Info */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2.5 text-white hover:text-blue-300 relative transition-all duration-200 hover:scale-105 bg-slate-700/50 rounded-lg hover:bg-slate-600/70">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* Chat */}
            <button 
              onClick={onChatToggle}
              className="p-2.5 text-white hover:text-blue-300 relative transition-all duration-200 hover:scale-105 bg-slate-700/50 rounded-lg hover:bg-slate-600/70"
            >
              <MessageCircle className="h-5 w-5" />
              {messages > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {messages > 9 ? '9+' : messages}
                </span>
              )}
            </button>

            {/* Refresh */}
            {onRefresh && (
              <button 
                onClick={onRefresh}
                className={`p-2.5 text-white hover:text-blue-300 transition-all duration-200 hover:scale-105 bg-slate-700/50 rounded-lg hover:bg-slate-600/70 ${loading ? 'animate-spin' : ''}`}
                title="Refresh Data"
                disabled={loading}
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            )}

            {/* User Profile */}
            <div className="flex items-center space-x-3 bg-slate-700/50 rounded-lg p-2.5">
              <div className={`h-10 w-10 bg-gradient-to-br ${getRoleColor(userRole)} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-white">{user?.name || 'User'}</span>
                <p className="text-xs text-gray-300">{getRoleDisplay(userRole)}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2.5 text-white hover:text-red-300 transition-all duration-200 hover:scale-105 bg-red-600/50 rounded-lg hover:bg-red-500/70"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CommonHeader;
