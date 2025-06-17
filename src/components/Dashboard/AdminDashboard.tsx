import React from 'react';
import { 
  Users, 
  Database, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { name: 'Total Users', value: '2,847', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12%' },
    { name: 'Active Subscriptions', value: '156', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', change: '+8%' },
    { name: 'System Uptime', value: '99.9%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', change: '+0.1%' },
    { name: 'Pending Moderation', value: '23', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', change: '-5%' },
  ];

  const systemHealth = [
    { name: 'API Response Time', value: '120ms', status: 'good' },
    { name: 'Database Queries', value: '1.2M/day', status: 'good' },
    { name: 'Error Rate', value: '0.02%', status: 'good' },
    { name: 'Storage Usage', value: '78%', status: 'warning' },
  ];

  const recentUsers = [
    { name: 'John Smith', role: 'Driver', joined: '2 hours ago', status: 'active' },
    { name: 'ABC Logistics', role: 'Recruiter', joined: '4 hours ago', status: 'pending' },
    { name: 'Maria Garcia', role: 'Driver', joined: '6 hours ago', status: 'active' },
    { name: 'FastTrack Inc.', role: 'Recruiter', joined: '8 hours ago', status: 'active' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'suspended': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management tools.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-full ${item.bg}`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-medium text-gray-900">{item.value}</div>
                      <div className={`ml-2 text-sm font-medium ${
                        item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">System Health</h3>
            <div className="space-y-4">
              {systemHealth.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      metric.status === 'good' ? 'bg-green-400' : 
                      metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-sm text-gray-700">{metric.name}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
              View detailed metrics
            </button>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Registrations</h3>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-blue-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role} • {user.joined}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${getUserStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
              View all users
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Manage Users</p>
                <p className="text-xs text-gray-500">View and edit user accounts</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Shield className="h-6 w-6 text-orange-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Content Moderation</p>
                <p className="text-xs text-gray-500">Review flagged content</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Database className="h-6 w-6 text-green-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Database Admin</p>
                <p className="text-xs text-gray-500">Manage data and backups</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="h-6 w-6 text-purple-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Analytics</p>
                <p className="text-xs text-gray-500">View system analytics</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">System Maintenance Scheduled</h3>
            <p className="text-xs text-yellow-700 mt-1">
              Routine maintenance is scheduled for this Sunday at 2:00 AM EST. Expected downtime: 2 hours.
            </p>
            <div className="mt-3 flex space-x-3">
              <button className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 transition-colors">
                Reschedule
              </button>
              <button className="bg-white text-yellow-700 px-3 py-1 rounded text-xs border border-yellow-600 hover:bg-yellow-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}