import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";

export default function AdminChat() {
  const { messages, addMessage, getUserMessages, getActiveUsers } = useChat();
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  const activeUsers = getActiveUsers();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedUser, messages]);

  // Auto-select first user if none selected
  useEffect(() => {
    if (activeUsers.length > 0 && !selectedUser) {
      setSelectedUser(activeUsers[0]);
    }
  }, [activeUsers, selectedUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      console.log('ADMIN sending message:', {
        text: newMessage.trim(),
        sender: 'admin',
        userId: selectedUser,
        selectedUser
      });
      addMessage({
        text: newMessage.trim(),
        sender: 'admin',
        userId: selectedUser,
        userName: 'Admin',
      });
      setNewMessage("");
    }
  };

  const selectedUserMessages = selectedUser ? getUserMessages(selectedUser) : [];
  
  console.log('AdminChat Debug:', {
    activeUsers,
    selectedUser,
    allMessages: messages,
    selectedUserMessages
  });

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors relative"
        >
          💬 Admin Chat
          {activeUsers.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {activeUsers.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-96 h-[500px] bg-white border border-gray-300 rounded-lg shadow-lg z-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-semibold">💬 Admin Chat</h3>
          <p className="text-xs opacity-90">
            {activeUsers.length} active user{activeUsers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-white hover:text-gray-200 text-xl"
        >
          ×
        </button>
      </div>

      <div className="flex flex-1">
        {/* Users List */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50">
          <div className="p-2 border-b border-gray-200">
            <h4 className="font-semibold text-sm text-gray-700">Active Users</h4>
          </div>
          <div className="overflow-y-auto">
            {activeUsers.length === 0 ? (
              <p className="p-3 text-sm text-gray-500">No active users</p>
            ) : (
              activeUsers.map((userId) => {
                const userMessages = getUserMessages(userId);
                const lastMessage = userMessages[userMessages.length - 1];
                const unreadFromUser = userMessages.filter(msg => msg.sender === 'user').length;
                
                return (
                  <div
                    key={userId}
                    onClick={() => setSelectedUser(userId)}
                    className={`p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-100 ${
                      selectedUser === userId ? 'bg-blue-100' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{userId}</p>
                        {lastMessage && (
                          <p className="text-xs text-gray-500 truncate">
                            {lastMessage.text}
                          </p>
                        )}
                      </div>
                      {unreadFromUser > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadFromUser}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Selected User Header */}
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h4 className="font-semibold text-sm">Chatting with: {selectedUser}</h4>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {selectedUserMessages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm">
                    <p>No messages yet with {selectedUser}</p>
                  </div>
                ) : (
                  selectedUserMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-2 rounded-lg text-sm ${
                          message.sender === 'admin'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'admin' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}