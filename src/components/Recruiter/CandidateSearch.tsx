import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRecruiterData } from '../../hooks/useRecruiterData';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Eye, 
  MessageSquare,
  Calendar,
  Shield,
  Truck,
  Clock,
  DollarSign
} from 'lucide-react';

export function CandidateSearch() {
  const { profile } = useAuth();
  const { topCandidates, loading, unlockContact } = useRecruiterData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    licenseType: '',
    availability: '',
    equipment: '',
    twic: false,
    hazmat: false
  });
  const [showFilters, setShowFilters] = useState(false);

  const candidates = topCandidates.map(driver => ({
    id: driver.id,
    name: driver.profile?.name || 'Unknown',
    location: driver.profile?.location || 'Unknown',
    experience: driver.experience_years,
    fitScore: driver.fit_score,
    licenses: driver.license_types,
    availability: driver.availability,
    equipment: driver.equipment_experience,
    lastActive: '2 days ago', // This would come from analytics
    profileViews: 45, // This would come from analytics
    twic: driver.twic_card,
    hazmat: driver.hazmat_endorsement,
    phone: driver.profile?.phone || '',
    email: driver.profile?.email || '',
    contactUnlocked: false, // This would be checked against contact_unlocks
    summary: driver.bio || 'Professional driver with experience in the transportation industry.'
  }));

  const handleUnlockContact = (candidateId: number) => {
    unlockContact(candidateId.toString());
  };

  const handleSendMessage = (candidateId: number) => {
    // Navigate to messaging
    console.log(`Sending message to candidate ${candidateId}`);
  };

  const handleScheduleInterview = (candidateId: number) => {
    // Navigate to interview scheduling
    console.log(`Scheduling interview with candidate ${candidateId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Search</h1>
          <p className="text-gray-600">Find and connect with qualified drivers</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Save Search
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, location, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="City, State"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Experience</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
              <select
                value={filters.licenseType}
                onChange={(e) => setFilters({ ...filters, licenseType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any License</option>
                <option value="CDL-A">CDL-A</option>
                <option value="CDL-B">CDL-B</option>
                <option value="CDL-C">CDL-C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Status</option>
                <option value="Available">Available</option>
                <option value="Seeking">Seeking</option>
                <option value="Employed">Employed</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.twic}
                onChange={(e) => setFilters({ ...filters, twic: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">TWIC Card Required</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hazmat}
                onChange={(e) => setFilters({ ...filters, hazmat: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">HAZMAT Endorsement</span>
            </label>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setFilters({
                location: '',
                experience: '',
                licenseType: '',
                availability: '',
                equipment: '',
                twic: false,
                hazmat: false
              })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing {candidates.length} candidates • Sorted by AI Fit Score
        </div>
        <select className="text-sm border border-gray-300 rounded px-3 py-1">
          <option>Best Match</option>
          <option>Newest First</option>
          <option>Experience</option>
          <option>Location</option>
        </select>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-blue-600">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                      <Star className="h-4 w-4 mr-1" />
                      {candidate.fitScore}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      candidate.availability === 'Available' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {candidate.availability}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {candidate.experience} years exp.
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {candidate.profileViews} views
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{candidate.summary}</p>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex space-x-1">
                      {candidate.licenses.map((license) => (
                        <span key={license} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {license}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-1">
                      {candidate.equipment.map((eq) => (
                        <span key={eq} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {eq}
                        </span>
                      ))}
                    </div>
                    {candidate.twic && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        TWIC
                      </span>
                    )}
                    {candidate.hazmat && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        HAZMAT
                      </span>
                    )}
                  </div>

                  {candidate.contactUnlocked && (
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {candidate.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {candidate.email}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                {!candidate.contactUnlocked ? (
                  <button
                    onClick={() => handleUnlockContact(candidate.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Unlock Contact
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleSendMessage(candidate.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </button>
                    <button
                      onClick={() => handleScheduleInterview(candidate.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Interview
                    </button>
                  </>
                )}
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors">
          Load More Candidates
        </button>
      </div>
    </div>
  );
}