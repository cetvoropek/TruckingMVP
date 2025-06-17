import React from 'react';
import { LogOut, Settings, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">TruckRecruit AI</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}