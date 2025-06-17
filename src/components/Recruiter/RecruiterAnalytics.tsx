import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Clock,
  Target
} from 'lucide-react';

export function RecruiterAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = [
    { name: 'Candidates Contacted', value: '247', change: '+12%', icon: Users, color: 'text-blue-600' },
    { name: 'Response Rate', value: '68%', change: '+5%', icon: MessageSquare, color: 'text-green-600' },
    { name: 'Interviews Scheduled', value: '45', change: '+18%', icon: Calendar, color: 'text-purple-600' },
    { name: 'Avg. Fit Score', value: '8.4', change: '+0.3', icon: Star, color: 'text-yellow-600' },
  ];

  const regionData = [
    { region: 'Texas', candidates: 89, percentage: 36 },
    { region: 'California', candidates: 67, percentage: 27 },
    { region: 'Florida', candidates: 45, percentage: 18 },
    { region: 'Arizona', candidates: 32, percentage: 13 },
    { region: 'Others', candidates: 14, percentage: 6 },
  ];

  const licenseData = [
    { license: 'CDL-A', count: 198, percentage: 80 },
    { license: 'HAZMAT', count: 124, percentage: 50 },
    { license: 'TWIC', count: 89, percentage: 36 },
    { license: 'CDL-B', count: 34, percentage: 14 },
  ];

  const experienceData = [
    { range: '1-2 years', count: 45, percentage: 18 },
    { range: '3-5 years', count: 89, percentage: 36 },
    { range: '6-10 years', count: 78, percentage: 32 },
    { range: '10+ years', count: 35, percentage: 14 },
  ];

  const monthlyActivity = [
    { month: 'Oct', contacted: 45, responded: 28, interviewed: 12 },
    { month: 'Nov', contacted: 67, responded: 41, interviewed: 18 },
    { month: 'Dec', contacted: 89, responded: 58, interviewed: 23 },
    { month: 'Jan', contacted: 78, responded: 53, interviewed: 19 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your recruitment performance and insights</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
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
        {/* Monthly Activity Chart */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Activity</h3>
          <div className="space-y-4">
            {monthlyActivity.map((month, index) => (
              <div key={month.month} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{month.month}</span>
                  <span className="text-gray-500">{month.contacted} contacted</span>
                </div>
                <div className="flex space-x-1 h-2">
                  <div 
                    className="bg-blue-500 rounded"
                    style={{ width: `${(month.contacted / 100) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-green-500 rounded"
                    style={{ width: `${(month.responded / 100) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-purple-500 rounded"
                    style={{ width: `${(month.interviewed / 100) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{month.responded} responded</span>
                  <span>{month.interviewed} interviewed</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
              <span>Contacted</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
              <span>Responded</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded mr-1"></div>
              <span>Interviewed</span>
            </div>
          </div>
        </div>

        {/* Top Regions */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Candidates by Region</h3>
          <div className="space-y-4">
            {regionData.map((region) => (
              <div key={region.region} className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{region.region}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{region.candidates}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* License Distribution */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">License Distribution</h3>
          <div className="space-y-4">
            {licenseData.map((license) => (
              <div key={license.license} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-medium text-green-600">
                      {license.license.split('-')[0]}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{license.license}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${license.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{license.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Levels */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Experience Levels</h3>
          <div className="space-y-4">
            {experienceData.map((exp) => (
              <div key={exp.range} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{exp.range}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${exp.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{exp.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-start">
          <Target className="h-6 w-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Top Performing Regions</h4>
                <p className="text-gray-600">Texas and California show the highest response rates at 72% and 69% respectively.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Best Contact Times</h4>
                <p className="text-gray-600">Tuesday-Thursday between 10 AM - 2 PM show 23% higher response rates.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">High-Value Candidates</h4>
                <p className="text-gray-600">Drivers with 5+ years experience and HAZMAT certification have 85% interview acceptance rate.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Optimization Opportunity</h4>
                <p className="text-gray-600">Focus on candidates with fit scores above 8.5 for 40% better conversion rates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}