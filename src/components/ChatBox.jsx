import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

export default function ChatBox() {
  const { messages, addMessage, isChatOpen, openChat, closeChat, unreadCount } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get messages for current user (both user and admin messages in this conversation)
  const userMessages = messages.filter(msg => msg.userId === user?.username);
  
  console.log('ChatBox Debug:', {
    currentUser: user?.username,
    userRole: user?.role,
    allMessages: messages,
    userMessages
  });
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      console.log('USER sending message:', {
        text: newMessage.trim(),
        sender: 'user',
        userId: user.username,
        userRole: user.role
      });
      addMessage({
        text: newMessage.trim(),
        sender: 'user',
        userId: user.username,
        userName: user.username,
      });
      setNewMessage("");
    }
  };

  if (!isChatOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={openChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors relative"
        >
          💬
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg z-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-semibold">💬 Live Support</h3>
          <p className="text-xs opacity-90">We're here to help!</p>
        </div>
        <button
          onClick={closeChat}
          className="text-white hover:text-gray-200 text-xl"
        >
          ×
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {userMessages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            <p>👋 Hi! How can we help you today?</p>
            <p className="mt-2">Send us a message and we'll respond quickly.</p>
          </div>
        ) : (
          userMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-2 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
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
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
