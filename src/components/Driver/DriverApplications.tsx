import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Filter,
  Search
} from 'lucide-react';

export function DriverApplications() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const applications = [
    {
      id: 1,
      company: 'TransLogistics Inc.',
      position: 'OTR Driver',
      location: 'Dallas, TX',
      salary: '$65,000 - $75,000',
      appliedDate: '2024-01-15',
      status: 'pending',
      description: 'Long-haul routes across the continental US. Home time every 2-3 weeks.',
      requirements: ['CDL-A', '2+ years experience', 'Clean driving record'],
      benefits: ['Health Insurance', '401k', 'Paid Time Off']
    },
    {
      id: 2,
      company: 'FastHaul Express',
      position: 'Local Driver',
      location: 'Houston, TX',
      salary: '$55,000 - $60,000',
      appliedDate: '2024-01-14',
      status: 'interview',
      description: 'Local delivery routes within Houston metro area. Home daily.',
      requirements: ['CDL-A', '1+ years experience'],
      benefits: ['Health Insurance', 'Dental', 'Vision']
    },
    {
      id: 3,
      company: 'CrossCountry Freight',
      position: 'Regional Driver',
      location: 'Austin, TX',
      salary: '$60,000 - $70,000',
      appliedDate: '2024-01-13',
      status: 'reviewed',
      description: 'Regional routes covering Texas, Oklahoma, and Louisiana.',
      requirements: ['CDL-A', '3+ years experience', 'HAZMAT'],
      benefits: ['Health Insurance', '401k', 'Performance Bonus']
    },
    {
      id: 4,
      company: 'Reliable Transport',
      position: 'Flatbed Driver',
      location: 'San Antonio, TX',
      salary: '$70,000 - $80,000',
      appliedDate: '2024-01-10',
      status: 'rejected',
      description: 'Specialized flatbed hauling for construction materials.',
      requirements: ['CDL-A', '5+ years experience', 'Flatbed experience'],
      benefits: ['Health Insurance', '401k', 'Tool Allowance']
    },
    {
      id: 5,
      company: 'Elite Logistics',
      position: 'Team Driver',
      location: 'Fort Worth, TX',
      salary: '$80,000 - $90,000',
      appliedDate: '2024-01-08',
      status: 'hired',
      description: 'Team driving for expedited freight across North America.',
      requirements: ['CDL-A', '2+ years experience', 'Team driving experience'],
      benefits: ['Health Insurance', '401k', 'Per Mile Bonus']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'interview': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'reviewed': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'hired': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'interview': return <Calendar className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'hired': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    interview: applications.filter(app => app.status === 'interview').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    hired: applications.filter(app => app.status === 'hired').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600">Track your job applications and their status</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          Browse Jobs
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            onClick={() => setFilter(status)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              filter === status 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="interview">Interview</option>
          <option value="reviewed">Reviewed</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{application.position}</h3>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1 capitalize">{application.status}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {application.company}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {application.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {application.salary}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Applied {application.appliedDate}
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{application.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Requirements</h4>
                    <ul className="text-gray-600 space-y-1">
                      {application.requirements.map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Benefits</h4>
                    <ul className="text-gray-600 space-y-1">
                      {application.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                    {application.status === 'interview' && (
                      <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
                        Schedule Interview
                      </button>
                    )}
                    {application.status === 'pending' && (
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors">
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? "You haven't applied to any jobs yet." 
              : `No applications with status "${filter}".`}
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Browse Available Jobs
          </button>
        </div>
      )}
    </div>
  );
}