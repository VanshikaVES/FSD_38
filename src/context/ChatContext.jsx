import React, { createContext, useState, useContext } from "react";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Add a new message
  const addMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      ...message,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    console.log('Adding message to context:', newMessage);
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('All messages after adding:', updated);
      return updated;
    });
    
    // Increment unread count if chat is closed and message is from admin
    if (!isChatOpen && message.sender === 'admin') {
      setUnreadCount(prev => prev + 1);
    }
  };

  // Clear unread count when chat is opened
  const openChat = () => {
    setIsChatOpen(true);
    setUnreadCount(0);
  };

  // Close chat
  const closeChat = () => {
    setIsChatOpen(false);
  };

  // Get messages for a specific user (for admin view)
  const getUserMessages = (userId) => {
    return messages.filter(msg => msg.userId === userId);
  };

  // Get all unique users who have sent messages
  const getActiveUsers = () => {
    const users = new Set();
    messages.forEach(msg => {
      if (msg.sender === 'user') {
        users.add(msg.userId);
      }
    });
    return Array.from(users);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        isChatOpen,
        openChat,
        closeChat,
        unreadCount,
        getUserMessages,
        getActiveUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook
export function useChat() {
  return useContext(ChatContext);
}
