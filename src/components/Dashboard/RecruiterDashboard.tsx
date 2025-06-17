import React from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Star,
  Phone,
  Mail,
  CreditCard,
  Filter
} from 'lucide-react';

export function RecruiterDashboard() {
  const stats = [
    { name: 'Total Candidates', value: '1,247', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12%' },
    { name: 'Active Conversations', value: '23', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50', change: '+8%' },
    { name: 'Interviews This Week', value: '15', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50', change: '+25%' },
    { name: 'Avg Fit Score', value: '8.4', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50', change: '+0.3' },
  ];

  const topCandidates = [
    { 
      id: 1, 
      name: 'Michael Rodriguez', 
      location: 'Dallas, TX', 
      experience: '8 years', 
      fitScore: 9.2, 
      licenses: ['CDL-A', 'HAZMAT'], 
      status: 'Available',
      lastContact: '2 days ago'
    },
    { 
      id: 2, 
      name: 'James Wilson', 
      location: 'Phoenix, AZ', 
      experience: '5 years', 
      fitScore: 8.8, 
      licenses: ['CDL-A', 'TWIC'], 
      status: 'Available',
      lastContact: '1 week ago'
    },
    { 
      id: 3, 
      name: 'David Chen', 
      location: 'Denver, CO', 
      experience: '12 years', 
      fitScore: 9.0, 
      licenses: ['CDL-A', 'HAZMAT', 'TWIC'], 
      status: 'Seeking',
      lastContact: 'Never'
    },
  ];

  const recentActivity = [
    { type: 'message', text: 'New message from Michael Rodriguez', time: '5 min ago' },
    { type: 'interview', text: 'Interview scheduled with Sarah Johnson', time: '1 hour ago' },
    { type: 'application', text: '3 new candidates matched your criteria', time: '2 hours ago' },
    { type: 'contact', text: 'Contact unlocked: James Wilson', time: '4 hours ago' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'interview': return <Calendar className="h-4 w-4 text-green-600" />;
      case 'application': return <Users className="h-4 w-4 text-purple-600" />;
      case 'contact': return <Phone className="h-4 w-4 text-orange-600" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-600">Find and connect with top drivers.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Search Candidates
          </button>
        </div>
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
                      <div className="ml-2 text-sm font-medium text-green-600">{item.change}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Candidates */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Top AI-Matched Candidates</h3>
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">View all</button>
            </div>
            <div className="space-y-4">
              {topCandidates.map((candidate) => (
                <div key={candidate.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{candidate.name}</h4>
                          <p className="text-xs text-gray-500">{candidate.location} • {candidate.experience}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">{candidate.fitScore}</span>
                        </div>
                        <div className="flex space-x-1">
                          {candidate.licenses.map((license) => (
                            <span key={license} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              {license}
                            </span>
                          ))}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          candidate.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {candidate.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                        Unlock Contact
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-50 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Pro Subscription Active</h3>
              <p className="text-sm text-gray-600">Unlimited contacts • Renews on March 15, 2024</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white text-gray-700 px-4 py-2 rounded-md text-sm border border-gray-300 hover:bg-gray-50 transition-colors">
              Usage Analytics
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
              Manage Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}