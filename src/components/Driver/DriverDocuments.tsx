import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Shield,
  CreditCard
} from 'lucide-react';

export function DriverDocuments() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'CDL License',
      type: 'license',
      fileName: 'cdl_license.pdf',
      uploadedAt: '2024-01-10',
      verified: true,
      expiryDate: '2026-03-15',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Medical Certificate',
      type: 'medical',
      fileName: 'medical_cert.pdf',
      uploadedAt: '2024-01-08',
      verified: true,
      expiryDate: '2025-01-08',
      size: '1.2 MB'
    },
    {
      id: 3,
      name: 'TWIC Card',
      type: 'twic',
      fileName: 'twic_card.jpg',
      uploadedAt: '2024-01-05',
      verified: false,
      expiryDate: '2027-05-20',
      size: '856 KB'
    },
    {
      id: 4,
      name: 'HAZMAT Endorsement',
      type: 'hazmat',
      fileName: 'hazmat_cert.pdf',
      uploadedAt: '2024-01-03',
      verified: true,
      expiryDate: '2025-12-10',
      size: '1.8 MB'
    },
    {
      id: 5,
      name: 'Resume',
      type: 'cv',
      fileName: 'john_driver_resume.pdf',
      uploadedAt: '2024-01-01',
      verified: true,
      expiryDate: null,
      size: '345 KB'
    }
  ]);

  const documentTypes = [
    { value: 'license', label: 'CDL License', icon: CreditCard, required: true },
    { value: 'medical', label: 'Medical Certificate', icon: FileText, required: true },
    { value: 'cv', label: 'Resume/CV', icon: FileText, required: true },
    { value: 'twic', label: 'TWIC Card', icon: Shield, required: false },
    { value: 'hazmat', label: 'HAZMAT Endorsement', icon: Shield, required: false },
    { value: 'other', label: 'Other Documents', icon: FileText, required: false }
  ];

  const getDocumentIcon = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.icon : FileText;
  };

  const getVerificationStatus = (verified: boolean, expiryDate: string | null) => {
    if (!verified) {
      return { color: 'text-yellow-600 bg-yellow-50', icon: Clock, text: 'Pending Verification' };
    }
    
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
      
      if (daysUntilExpiry < 30) {
        return { color: 'text-orange-600 bg-orange-50', icon: AlertCircle, text: 'Expires Soon' };
      }
    }
    
    return { color: 'text-green-600 bg-green-50', icon: CheckCircle, text: 'Verified' };
  };

  const handleFileUpload = (type: string) => {
    // Simulate file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newDoc = {
          id: documents.length + 1,
          name: documentTypes.find(dt => dt.value === type)?.label || 'Document',
          type,
          fileName: file.name,
          uploadedAt: new Date().toISOString().split('T')[0],
          verified: false,
          expiryDate: null,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
        };
        setDocuments([...documents, newDoc]);
      }
    };
    input.click();
  };

  const handleDelete = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const requiredDocs = documentTypes.filter(dt => dt.required);
  const uploadedRequiredDocs = documents.filter(doc => 
    requiredDocs.some(rd => rd.value === doc.type)
  );
  const completionPercentage = Math.round((uploadedRequiredDocs.length / requiredDocs.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600">Upload and manage your professional documents</p>
        </div>
      </div>

      {/* Completion Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Document Completion</h3>
            <p className="text-sm text-gray-600">Complete your profile to increase visibility to recruiters</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Upload */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Upload</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {documentTypes.map((docType) => {
            const Icon = docType.icon;
            const hasDocument = documents.some(doc => doc.type === docType.value);
            
            return (
              <button
                key={docType.value}
                onClick={() => handleFileUpload(docType.value)}
                className={`p-4 border-2 border-dashed rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-all ${
                  hasDocument ? 'border-green-300 bg-green-50' : 'border-gray-300'
                }`}
              >
                <Icon className={`h-8 w-8 mx-auto mb-2 ${
                  hasDocument ? 'text-green-600' : 'text-gray-400'
                }`} />
                <div className="text-sm font-medium text-gray-900">{docType.label}</div>
                {docType.required && (
                  <div className="text-xs text-red-600 mt-1">Required</div>
                )}
                {hasDocument && (
                  <div className="text-xs text-green-600 mt-1">✓ Uploaded</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Uploaded Documents</h3>
        </div>
        
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
            <p className="text-gray-600 mb-4">Upload your documents to complete your profile</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {documents.map((document) => {
              const Icon = getDocumentIcon(document.type);
              const status = getVerificationStatus(document.verified, document.expiryDate);
              const StatusIcon = status.icon;
              
              return (
                <div key={document.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{document.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{document.fileName}</span>
                          <span>{document.size}</span>
                          <span>Uploaded {document.uploadedAt}</span>
                          {document.expiryDate && (
                            <span>Expires {document.expiryDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.text}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(document.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Document Guidelines</h3>
            <div className="text-sm text-yellow-700 mt-1">
              <ul className="list-disc list-inside space-y-1">
                <li>Upload clear, high-quality scans or photos</li>
                <li>Accepted formats: PDF, JPG, PNG (max 10MB per file)</li>
                <li>Ensure all text is readable and documents are not expired</li>
                <li>Required documents must be verified before profile activation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}