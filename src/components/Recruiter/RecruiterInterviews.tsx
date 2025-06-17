import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  User, 
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export function RecruiterInterviews() {
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const interviews = [
    {
      id: 1,
      candidateName: 'Michael Rodriguez',
      candidateId: 1,
      position: 'OTR Driver',
      date: '2024-01-20',
      time: '10:00 AM',
      duration: 30,
      type: 'video',
      status: 'scheduled',
      notes: 'Discuss experience with Southwest routes',
      fitScore: 9.2,
      location: 'Dallas, TX'
    },
    {
      id: 2,
      candidateName: 'James Wilson',
      candidateId: 2,
      position: 'Regional Driver',
      date: '2024-01-20',
      time: '2:00 PM',
      duration: 45,
      type: 'phone',
      status: 'scheduled',
      notes: 'Review reefer experience and availability',
      fitScore: 8.8,
      location: 'Phoenix, AZ'
    },
    {
      id: 3,
      candidateName: 'Sarah Johnson',
      candidateId: 3,
      position: 'Local Driver',
      date: '2024-01-19',
      time: '11:00 AM',
      duration: 30,
      type: 'in-person',
      status: 'completed',
      notes: 'Great interview, moving to next round',
      fitScore: 8.5,
      location: 'Atlanta, GA'
    },
    {
      id: 4,
      candidateName: 'David Chen',
      candidateId: 4,
      position: 'HAZMAT Driver',
      date: '2024-01-18',
      time: '3:00 PM',
      duration: 60,
      type: 'video',
      status: 'no-show',
      notes: 'Candidate did not attend scheduled interview',
      fitScore: 9.0,
      location: 'Denver, CO'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'no-show': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'no-show': return <AlertCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const upcomingInterviews = interviews.filter(i => i.status === 'scheduled');
  const todayInterviews = interviews.filter(i => i.date === '2024-01-20');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600">Manage your candidate interviews and scheduling</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Calendar
            </button>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{upcomingInterviews.length}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{todayInterviews.length}</div>
              <div className="text-sm text-gray-600">Today</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {interviews.filter(i => i.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {interviews.filter(i => i.status === 'no-show').length}
              </div>
              <div className="text-sm text-gray-600">No Shows</div>
            </div>
          </div>
        </div>
      </div>

      {view === 'list' ? (
        /* List View */
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div key={interview.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{interview.candidateName}</h3>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                        {getStatusIcon(interview.status)}
                        <span className="ml-1 capitalize">{interview.status.replace('-', ' ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {interview.date} at {interview.time}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {interview.duration} minutes
                      </div>
                      <div className="flex items-center">
                        {getTypeIcon(interview.type)}
                        <span className="ml-1 capitalize">{interview.type.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {interview.location}
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Position: </span>
                      <span className="text-sm text-gray-600">{interview.position}</span>
                    </div>

                    {interview.notes && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">Notes: </span>
                        <span className="text-sm text-gray-600">{interview.notes}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Fit Score:</span>
                      <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                        <span className="font-medium">{interview.fitScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {interview.status === 'scheduled' && (
                    <>
                      {interview.type === 'video' && (
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center">
                          <Video className="h-4 w-4 mr-1" />
                          Join Call
                        </button>
                      )}
                      {interview.type === 'phone' && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          Call Now
                        </button>
                      )}
                    </>
                  )}
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button className="border border-red-300 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors flex items-center">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
            <p className="text-gray-600">Calendar integration coming soon</p>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Interview</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option>Select a candidate...</option>
                  <option>Michael Rodriguez</option>
                  <option>James Wilson</option>
                  <option>Sarah Johnson</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Interview notes or agenda..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}