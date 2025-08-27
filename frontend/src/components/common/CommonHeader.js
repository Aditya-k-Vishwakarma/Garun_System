import React, { useState } from 'react';
import { Shield, Bell, MessageCircle, RefreshCw, User, LogOut, Menu, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-lg border-b-2 border-blue-500">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className={`h-10 w-10 sm:h-14 sm:w-14 bg-gradient-to-br ${getRoleColor(userRole)} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border-2 border-white flex-shrink-0`}>
              <Shield className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5 sm:mb-1 truncate">
                🏛️ Indore Smart City
              </h1>
              <p className="text-xs sm:text-sm text-blue-200 font-medium truncate">Indore Smart City Development Association</p>
              <p className="text-xs text-gray-300 truncate">Municipal Corporation of Indore</p>
            </div>
          </div>
          
          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Notifications */}
            <button className="p-2 sm:p-2.5 text-white hover:text-blue-300 relative transition-all duration-200 hover:scale-105 bg-slate-700/50 rounded-lg hover:bg-slate-600/70">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* Chat */}
            <button 
              onClick={onChatToggle}
              className="p-2 sm:p-2.5 text-white hover:text-blue-300 relative transition-all duration-200 hover:scale-105 bg-slate-700/50 rounded-lg hover:bg-slate-600/70"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
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
                className={`p-2 sm:p-2.5 text-white hover:text-blue-300 transition-all duration-200 hover:scale-105 bg-slate-700/50 rounded-lg hover:bg-slate-600/70 ${loading ? 'animate-spin' : ''}`}
                title="Refresh Data"
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}

            {/* User Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3 bg-slate-700/50 rounded-lg p-2 sm:p-2.5">
              <div className={`h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br ${getRoleColor(userRole)} rounded-full flex items-center justify-center shadow-lg border-2 border-white flex-shrink-0`}>
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="text-right hidden lg:block">
                <span className="text-sm font-semibold text-white">{user?.name || 'User'}</span>
                <p className="text-xs text-gray-300">{getRoleDisplay(userRole)}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2 sm:p-2.5 text-white hover:text-red-300 transition-all duration-200 hover:scale-105 bg-red-600/50 rounded-lg hover:bg-red-500/70"
              title="Logout"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notifications */}
            <button className="p-2 text-white hover:text-blue-300 relative transition-all duration-200 hover:scale-105 bg-slate-700/50 rounded-lg hover:bg-slate-600/70">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-white hover:text-blue-300 transition-all duration-200 hover:scale-105 bg-slate-700/50 rounded-lg hover:bg-slate-600/70"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-600 py-4 space-y-3">
            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 bg-slate-700/50 rounded-lg p-3">
              <div className={`h-12 w-12 bg-gradient-to-br ${getRoleColor(userRole)} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-white block">{user?.name || 'User'}</span>
                <p className="text-xs text-gray-300">{getRoleDisplay(userRole)}</p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onChatToggle}
                className="flex items-center justify-center space-x-2 p-3 text-white hover:text-blue-300 transition-all duration-200 hover:scale-105 bg-slate-700/50 rounded-lg hover:bg-slate-600/70"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">Chat</span>
                {messages > 0 && (
                  <span className="h-5 w-5 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                    {messages > 9 ? '9+' : messages}
                  </span>
                )}
              </button>

              {onRefresh && (
                <button 
                  onClick={onRefresh}
                  className={`flex items-center justify-center space-x-2 p-3 text-white hover:text-blue-300 transition-all duration-200 hover:scale-105 bg-slate-700/50 rounded-lg hover:bg-slate-600/70 ${loading ? 'animate-spin' : ''}`}
                  disabled={loading}
                >
                  <RefreshCw className="h-5 w-5" />
                  <span className="text-sm">Refresh</span>
                </button>
              )}
            </div>

            {/* Mobile Logout */}
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 p-3 text-white hover:text-red-300 transition-all duration-200 hover:scale-105 bg-red-600/50 rounded-lg hover:bg-red-500/70"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default CommonHeader;
