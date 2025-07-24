import React, { useEffect } from 'react';
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
import { useRecruiterData } from '../../hooks/useRecruiterData';

export function RecruiterDashboard() {
  const { 
    loading, 
    stats, 
    topCandidates, 
    recentActivity, 
    subscription,
    unlockContact,
    isContactUnlocked 
  } = useRecruiterData();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'interview': return <Calendar className="h-4 w-4 text-green-600" />;
      case 'application': return <Users className="h-4 w-4 text-purple-600" />;
      case 'contact': return <Phone className="h-4 w-4 text-orange-600" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleUnlockContact = async (driverId: string) => {
    const result = await unlockContact(driverId);
    if (result.error) {
      alert(result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

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
        {[
          { name: 'Total Candidates', value: stats.totalCandidates.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Active Conversations', value: stats.activeConversations.toString(), icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
          { name: 'Interviews This Week', value: stats.interviewsThisWeek.toString(), icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
          { name: 'Avg Fit Score', value: stats.avgFitScore.toString(), icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((item) => (
          <div key={item.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
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
                      <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{item.value}</div>
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
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Top AI-Matched Candidates</h3>
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">View all</button>
            </div>
            <div className="space-y-4">
              {topCandidates.map((candidate) => (
                <div key={candidate.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {candidate.profile?.name.split(' ').map(n => n[0]).join('') || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{candidate.profile?.name}</h4>
                          <p className="text-xs text-gray-500">{candidate.profile?.location} • {candidate.experience_years} years exp.</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{candidate.fit_score}</span>
                        </div>
                        <div className="flex space-x-1">
                          {candidate.license_types.map((license) => (
                            <span key={license} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              {license}
                            </span>
                          ))}
                        </div>
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                          {candidate.availability}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleUnlockContact(candidate.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
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
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">{activity.text}</p>
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
              <h3 className="text-lg font-medium text-gray-900">
                {subscription?.type.charAt(0).toUpperCase() + subscription?.type.slice(1)} Subscription {subscription?.status}
              </h3>
              <p className="text-sm text-gray-600">
                {subscription?.contacts_used || 0}/{subscription?.contacts_limit || 'Unlimited'} contacts used
                {subscription?.current_period_end && ` • Renews ${new Date(subscription.current_period_end).toLocaleDateString()}`}
              </p>
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