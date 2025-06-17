import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { RecruiterMessages } from '../Recruiter/RecruiterMessages';

export function Messages() {
  const { user } = useAuth();

  if (user?.role === 'recruiter') {
    return <RecruiterMessages />;
  }

  // For drivers and admins, show a basic message interface
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Your conversations and communications</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-600">
            {user?.role === 'driver' 
              ? "When recruiters contact you, your conversations will appear here."
              : "Your system messages and notifications will appear here."}
          </p>
        </div>
      </div>
    </div>
  );
}