import React from 'react';
import { 
  FileText, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  MapPin,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function DriverDashboard() {
  const stats = [
    { name: 'Applications Sent', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Messages', value: '8', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Interviews Scheduled', value: '3', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Profile Views', value: '45', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const recentApplications = [
    { id: 1, company: 'TransLogistics Inc.', position: 'OTR Driver', status: 'pending', date: '2024-01-15' },
    { id: 2, company: 'FastHaul Express', position: 'Local Driver', status: 'interview', date: '2024-01-14' },
    { id: 3, company: 'CrossCountry Freight', position: 'Regional Driver', status: 'reviewed', date: '2024-01-13' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'interview': return 'text-blue-600 bg-blue-50';
      case 'reviewed': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your latest activity.</p>
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
                    <dd className="text-lg font-medium text-gray-900">{item.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Applications</h3>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{application.company}</p>
                    <p className="text-sm text-gray-500">{application.position}</p>
                    <p className="text-xs text-gray-400">Applied on {application.date}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
              View all applications
            </button>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Profile Completion</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-700">Basic Information</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-700">License Information</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
                <span className="text-sm text-gray-700">Documents Upload</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-500">Work Experience</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">75% complete</p>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Complete Profile
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Star className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">AI Recommendations</h3>
            <p className="mt-1 text-sm text-gray-600">
              Based on your profile, we found 8 new job opportunities that match your skills and preferences.
            </p>
            <div className="mt-4 flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                View Jobs
              </button>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm border border-blue-600 hover:bg-blue-50 transition-colors">
                Update Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}