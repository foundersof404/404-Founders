import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, Send, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
  user?: {
    id: string;
    name: string;
  };
}

interface AgentChatProps {
  onClose: () => void;
  agentId: string;
  agentName: string;
}

const AgentChat: React.FC<AgentChatProps> = ({ onClose, agentId, agentName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Agent connected');
      setIsConnected(true);
      socket.send(
        JSON.stringify({
          type: 'agent_info',
          data: { agentId, name: agentName },
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received:', data);

      if (data.type === 'new_chat') {
        setCurrentUser({ id: data.data.userId, name: data.data.name });
      } else if (data.type === 'message') {
        const incomingMessage: Message = {
          id: Date.now().toString(),
          text: data.message,
          sender: 'user',
          timestamp: new Date().toISOString(),
          user: data.user,
        };
        setMessages((prev) => [...prev, incomingMessage]);
        setCurrentUser(data.user);
        setIsTyping(false);
      } else if (data.type === 'typing') {
        setIsTyping(true);
      } else if (data.type === 'stop_typing') {
        setIsTyping(false);
      }
    };

    socket.onclose = () => {
      console.log('Agent disconnected');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [agentId, agentName]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current || !isConnected || !currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'agent',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    socketRef.current.send(
      JSON.stringify({
        type: 'message',
        message: inputMessage,
        userId: currentUser.id,
      })
    );

    setInputMessage('');
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
            <MessageSquare className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold">Customer Support</h3>
            <p className="text-xs text-gray-500">
              {currentUser ? `Chatting with ${currentUser.name}` : 'Waiting for customer...'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'agent' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.sender === 'user' && (
                <p className="text-xs font-semibold mb-1">{msg.user?.name}</p>
              )}
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs mt-1 opacity-60 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.2s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleInputKeyPress}
            placeholder="Type your message..."
            disabled={!isConnected || !currentUser}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !isConnected || !currentUser}
            className="bg-gray-800 hover:bg-gray-900"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
