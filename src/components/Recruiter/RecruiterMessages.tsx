import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

export function RecruiterMessages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Michael Rodriguez',
      lastMessage: 'Thanks for reaching out! I\'m very interested in the position.',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      fitScore: 9.2,
      avatar: 'MR'
    },
    {
      id: 2,
      name: 'James Wilson',
      lastMessage: 'When would be a good time for a phone interview?',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      fitScore: 8.8,
      avatar: 'JW'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      lastMessage: 'I have experience with auto transport and would love to learn more.',
      timestamp: '3 hours ago',
      unread: 1,
      online: true,
      fitScore: 8.5,
      avatar: 'SJ'
    },
    {
      id: 4,
      name: 'David Chen',
      lastMessage: 'My HAZMAT certification is current until 2025.',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
      fitScore: 9.0,
      avatar: 'DC'
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: 'recruiter',
      text: 'Hi Michael! I came across your profile and I\'m impressed with your 8 years of experience. We have an OTR position that might be perfect for you.',
      timestamp: '10:30 AM',
      status: 'read'
    },
    {
      id: 2,
      senderId: 'candidate',
      text: 'Hello! Thank you for reaching out. I\'m definitely interested in learning more about the opportunity.',
      timestamp: '10:45 AM',
      status: 'delivered'
    },
    {
      id: 3,
      senderId: 'recruiter',
      text: 'Great! The position offers $70-80k annually, excellent benefits, and home time every 2-3 weeks. You\'d be running routes primarily in the Southwest region.',
      timestamp: '10:47 AM',
      status: 'read'
    },
    {
      id: 4,
      senderId: 'candidate',
      text: 'That sounds very appealing! I have extensive experience in that region and the compensation is competitive. What\'s the next step?',
      timestamp: '11:15 AM',
      status: 'delivered'
    },
    {
      id: 5,
      senderId: 'recruiter',
      text: 'Perfect! I\'d love to schedule a brief phone call to discuss the details. Are you available tomorrow afternoon?',
      timestamp: '11:20 AM',
      status: 'read'
    },
    {
      id: 6,
      senderId: 'candidate',
      text: 'Thanks for reaching out! I\'m very interested in the position.',
      timestamp: '2 min ago',
      status: 'delivered'
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {conversation.avatar}
                    </span>
                  </div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.name}
                      </h3>
                      <div className="flex items-center bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded text-xs">
                        <Star className="h-3 w-3 mr-0.5" />
                        {conversation.fitScore}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      {conversation.unread > 0 && (
                        <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {selectedConv.avatar}
                    </span>
                  </div>
                  {selectedConv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{selectedConv.name}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedConv.online ? 'Online' : 'Last seen 2 hours ago'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'recruiter'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className={`flex items-center justify-between mt-1 ${
                      message.senderId === 'recruiter' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{message.timestamp}</span>
                      {message.senderId === 'recruiter' && (
                        <div className="ml-2">
                          {message.status === 'read' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Smile className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}