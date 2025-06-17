import React, { useState } from 'react';
import { 
  Shield, 
  Flag, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MessageSquare,
  User,
  FileText,
  Clock
} from 'lucide-react';

export function AdminModeration() {
  const [activeTab, setActiveTab] = useState('pending');

  const moderationItems = [
    {
      id: 1,
      type: 'profile',
      reportedBy: 'System',
      reportedUser: 'John Driver',
      reason: 'Inappropriate profile content',
      description: 'Profile contains potentially misleading experience claims',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-20 10:30 AM',
      content: 'Driver profile with 20+ years experience claim but license issued in 2022'
    },
    {
      id: 2,
      type: 'message',
      reportedBy: 'Sarah Johnson',
      reportedUser: 'Mike Recruiter',
      reason: 'Spam/Harassment',
      description: 'Sending repeated unwanted messages',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-20 09:15 AM',
      content: 'Multiple messages sent after driver declined position'
    },
    {
      id: 3,
      type: 'document',
      reportedBy: 'System',
      reportedUser: 'Maria Garcia',
      reason: 'Document verification failed',
      description: 'Uploaded document appears to be altered',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-20 08:45 AM',
      content: 'CDL license document shows signs of digital alteration'
    },
    {
      id: 4,
      type: 'profile',
      reportedBy: 'ABC Logistics',
      reportedUser: 'David Chen',
      reason: 'False information',
      description: 'Claims HAZMAT certification but none found in system',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-19 02:30 PM',
      content: 'Profile updated to remove false HAZMAT claim',
      resolution: 'User contacted and profile corrected'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'profile': return <User className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'profile': return 'text-blue-600 bg-blue-50';
      case 'message': return 'text-green-600 bg-green-50';
      case 'document': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'dismissed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredItems = moderationItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  const stats = {
    pending: moderationItems.filter(item => item.status === 'pending').length,
    resolved: moderationItems.filter(item => item.status === 'resolved').length,
    high: moderationItems.filter(item => item.priority === 'high').length,
    total: moderationItems.length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600">Review and moderate reported content and users</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Moderation Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.resolved}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">High Priority</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.high}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Reports</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['pending', 'resolved', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab} ({tab === 'all' ? stats.total : tab === 'pending' ? stats.pending : stats.resolved})
            </button>
          ))}
        </nav>
      </div>

      {/* Moderation Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                    <span className="ml-1 capitalize">{item.type}</span>
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {item.priority} priority
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {item.status === 'resolved' && <CheckCircle className="h-3 w-3 mr-1" />}
                    <span className="capitalize">{item.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Report Details</h4>
                    <p className="text-sm text-gray-600 mb-1"><strong>Reported User:</strong> {item.reportedUser}</p>
                    <p className="text-sm text-gray-600 mb-1"><strong>Reported By:</strong> {item.reportedBy}</p>
                    <p className="text-sm text-gray-600 mb-1"><strong>Reason:</strong> {item.reason}</p>
                    <p className="text-sm text-gray-600"><strong>Time:</strong> {item.createdAt}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Description</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Content</h4>
                    <p className="text-sm text-gray-600">{item.content}</p>
                  </div>
                </div>

                {item.resolution && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <h4 className="text-sm font-medium text-green-900 mb-1">Resolution</h4>
                    <p className="text-sm text-green-700">{item.resolution}</p>
                  </div>
                )}
              </div>

              {item.status === 'pending' && (
                <div className="flex flex-col space-y-2 ml-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items to moderate</h3>
          <p className="text-gray-600">
            {activeTab === 'pending' 
              ? "All reports have been reviewed." 
              : `No ${activeTab} moderation items found.`}
          </p>
        </div>
      )}

      {/* Moderation Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Moderation Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Profile Content</h4>
            <ul className="space-y-1">
              <li>• Verify experience claims against license dates</li>
              <li>• Check for inappropriate or misleading content</li>
              <li>• Ensure contact information is accurate</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Document Verification</h4>
            <ul className="space-y-1">
              <li>• Check for signs of digital alteration</li>
              <li>• Verify expiration dates</li>
              <li>• Ensure documents match profile information</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Message Content</h4>
            <ul className="space-y-1">
              <li>• Review for spam or harassment</li>
              <li>• Check for inappropriate language</li>
              <li>• Verify compliance with platform policies</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Priority Levels</h4>
            <ul className="space-y-1">
              <li>• High: Safety concerns, fraud, harassment</li>
              <li>• Medium: Misleading information, spam</li>
              <li>• Low: Minor policy violations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}