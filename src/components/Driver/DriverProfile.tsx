import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Truck, 
  Shield, 
  FileText,
  Edit3,
  Save,
  X
} from 'lucide-react';

export function DriverProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Driver',
    email: 'driver@demo.com',
    phone: '+1 (555) 123-4567',
    location: 'Dallas, TX',
    experience: '8',
    licenseType: ['CDL-A'],
    twic: true,
    hazmat: true,
    availability: 'available',
    preferredRoutes: ['OTR', 'Regional'],
    equipment: ['Dry Van', 'Flatbed'],
    bio: 'Experienced professional driver with 8 years of safe driving. Specializing in long-haul and regional routes with excellent safety record.'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="text-xl font-bold text-gray-900 text-center border-b border-gray-300 focus:border-blue-500 outline-none"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            )}
            <p className="text-gray-600 mt-1">Professional Driver</p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="border-b border-gray-300 focus:border-blue-500 outline-none text-center"
                  />
                ) : (
                  profile.location
                )}
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {profile.experience} years experience
              </div>
            </div>

            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.availability === 'available' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {profile.availability === 'available' ? 'Available' : 'Seeking'}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              {isEditing ? (
                <select
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} year{i > 0 ? 's' : ''}</option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900">{profile.experience} years</p>
              )}
            </div>
          </div>
        </div>

        {/* Licenses & Certifications */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Licenses & Certifications</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Type</label>
              <div className="flex flex-wrap gap-2">
                {['CDL-A', 'CDL-B', 'CDL-C'].map((license) => (
                  <label key={license} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.licenseType.includes(license)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProfile({ ...profile, licenseType: [...profile.licenseType, license] });
                        } else {
                          setProfile({ ...profile, licenseType: profile.licenseType.filter(l => l !== license) });
                        }
                      }}
                      disabled={!isEditing}
                      className="mr-2"
                    />
                    <span className="text-sm">{license}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">TWIC Card</span>
              </div>
              {isEditing ? (
                <input
                  type="checkbox"
                  checked={profile.twic}
                  onChange={(e) => setProfile({ ...profile, twic: e.target.checked })}
                />
              ) : (
                <span className={`px-2 py-1 rounded text-xs ${
                  profile.twic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {profile.twic ? 'Yes' : 'No'}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium">HAZMAT</span>
              </div>
              {isEditing ? (
                <input
                  type="checkbox"
                  checked={profile.hazmat}
                  onChange={(e) => setProfile({ ...profile, hazmat: e.target.checked })}
                />
              ) : (
                <span className={`px-2 py-1 rounded text-xs ${
                  profile.hazmat ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {profile.hazmat ? 'Yes' : 'No'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Summary</h3>
        {isEditing ? (
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell recruiters about your experience, specialties, and what makes you a great driver..."
          />
        ) : (
          <p className="text-gray-700">{profile.bio}</p>
        )}
      </div>

      {/* Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Route Preferences</h3>
          <div className="space-y-2">
            {['OTR', 'Regional', 'Local', 'Dedicated'].map((route) => (
              <label key={route} className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.preferredRoutes.includes(route)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setProfile({ ...profile, preferredRoutes: [...profile.preferredRoutes, route] });
                    } else {
                      setProfile({ ...profile, preferredRoutes: profile.preferredRoutes.filter(r => r !== route) });
                    }
                  }}
                  disabled={!isEditing}
                  className="mr-3"
                />
                <span className="text-sm">{route}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Experience</h3>
          <div className="space-y-2">
            {['Dry Van', 'Flatbed', 'Reefer', 'Tanker', 'Auto Transport'].map((equipment) => (
              <label key={equipment} className="flex items-center">
                <input
                  type="checkbox"
                  checked={profile.equipment.includes(equipment)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setProfile({ ...profile, equipment: [...profile.equipment, equipment] });
                    } else {
                      setProfile({ ...profile, equipment: profile.equipment.filter(eq => eq !== equipment) });
                    }
                  }}
                  disabled={!isEditing}
                  className="mr-3"
                />
                <span className="text-sm">{equipment}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}