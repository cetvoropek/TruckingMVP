import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  CreditCard,
  Search,
  UserCheck,
  Shield,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const driverNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Profile', href: '/profile', icon: UserCheck },
  { name: 'Applications', href: '/applications', icon: FileText },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Documents', href: '/documents', icon: FileText },
];

const recruiterNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Candidates', href: '/candidates', icon: Search },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Interviews', href: '/interviews', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Subscription', href: '/subscription', icon: CreditCard },
];

const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Database', href: '/database', icon: Database },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Moderation', href: '/moderation', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { profile } = useAuth();
  
  const getNavigation = () => {
    switch (profile?.role) {
      case 'driver':
        return driverNavigation;
      case 'recruiter':
        return recruiterNavigation;
      case 'admin':
        return adminNavigation;
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen transition-colors duration-200">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}