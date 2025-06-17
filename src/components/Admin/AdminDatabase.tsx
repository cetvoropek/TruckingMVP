import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Activity,
  BarChart3
} from 'lucide-react';

export function AdminDatabase() {
  const [activeTab, setActiveTab] = useState('overview');

  const dbStats = {
    totalRecords: 15847,
    drivers: 12456,
    recruiters: 234,
    applications: 3157,
    storageUsed: '2.4 GB',
    storageLimit: '10 GB',
    lastBackup: '2024-01-20 03:00 AM',
    uptime: '99.9%'
  };

  const recentBackups = [
    { id: 1, date: '2024-01-20', time: '03:00 AM', size: '2.4 GB', status: 'completed', type: 'automatic' },
    { id: 2, date: '2024-01-19', time: '03:00 AM', size: '2.3 GB', status: 'completed', type: 'automatic' },
    { id: 3, date: '2024-01-18', time: '03:00 AM', size: '2.3 GB', status: 'completed', type: 'automatic' },
    { id: 4, date: '2024-01-17', time: '02:45 PM', size: '2.2 GB', status: 'completed', type: 'manual' },
  ];

  const tableStats = [
    { name: 'users', records: 12690, size: '1.2 GB', lastUpdated: '2 min ago' },
    { name: 'applications', records: 3157, size: '456 MB', lastUpdated: '5 min ago' },
    { name: 'documents', records: 8934, size: '678 MB', lastUpdated: '1 hour ago' },
    { name: 'messages', records: 15623, size: '234 MB', lastUpdated: '3 min ago' },
    { name: 'subscriptions', records: 234, size: '12 MB', lastUpdated: '1 day ago' },
  ];

  const performanceMetrics = [
    { name: 'Query Response Time', value: '45ms', status: 'good', trend: 'down' },
    { name: 'Connection Pool', value: '23/100', status: 'good', trend: 'stable' },
    { name: 'Cache Hit Rate', value: '94.2%', status: 'good', trend: 'up' },
    { name: 'Disk I/O', value: '12.3 MB/s', status: 'warning', trend: 'up' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Database Management</h1>
          <p className="text-gray-600">Monitor and manage database operations</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Backup Now
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'backups', 'performance', 'maintenance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Database Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Records</dt>
                      <dd className="text-lg font-medium text-gray-900">{dbStats.totalRecords.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HardDrive className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Storage Used</dt>
                      <dd className="text-lg font-medium text-gray-900">{dbStats.storageUsed}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Uptime</dt>
                      <dd className="text-lg font-medium text-gray-900">{dbStats.uptime}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Last Backup</dt>
                      <dd className="text-lg font-medium text-gray-900">{dbStats.lastBackup}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {dbStats.storageUsed}</span>
                <span>Limit: {dbStats.storageLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
              <p className="text-xs text-gray-500">24% of storage limit used</p>
            </div>
          </div>

          {/* Table Statistics */}
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Table Statistics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableStats.map((table, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {table.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {table.records.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {table.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {table.lastUpdated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'backups' && (
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Backup Configuration</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Configure
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Automatic Backups</div>
                <div className="text-xs text-gray-500">Daily at 3:00 AM</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <HardDrive className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Retention Period</div>
                <div className="text-xs text-gray-500">30 days</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Compression</div>
                <div className="text-xs text-gray-500">Enabled</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Backups</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBackups.map((backup) => (
                    <tr key={backup.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {backup.date} {backup.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {backup.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          backup.type === 'automatic' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {backup.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(backup.status)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">{backup.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Download</button>
                        <button className="text-green-600 hover:text-green-900">Restore</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 truncate">{metric.name}</dt>
                      <dd className="text-lg font-medium text-gray-900">{metric.value}</dd>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Chart</h3>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Monitoring</h3>
              <p className="text-gray-600">Real-time performance charts coming soon</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Operations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="h-6 w-6 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Optimize Tables</p>
                  <p className="text-xs text-gray-500">Defragment and optimize database tables</p>
                </div>
              </button>
              
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Database className="h-6 w-6 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Rebuild Indexes</p>
                  <p className="text-xs text-gray-500">Rebuild database indexes for better performance</p>
                </div>
              </button>
              
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Activity className="h-6 w-6 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Update Statistics</p>
                  <p className="text-xs text-gray-500">Update query optimizer statistics</p>
                </div>
              </button>
              
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Check Integrity</p>
                  <p className="text-xs text-gray-500">Verify database integrity and consistency</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Maintenance Schedule</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Automatic maintenance is scheduled for this Sunday at 2:00 AM EST. Expected duration: 30 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}