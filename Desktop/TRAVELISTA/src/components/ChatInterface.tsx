import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Send, MessageSquare, Monitor } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast'; // Assuming you have a toast hook
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast(); // To show toast notifications

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({
        type: 'user_info',
        data: {
          userId: user?.id || 'guest-' + Date.now(),
          name: user?.name || 'Guest',
          email: user?.email
        }
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: data.message,
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setIsTyping(false);
      } else if (data.type === 'typing') {
        setIsTyping(true);
      } else if (data.type === 'stop_typing') {
        setIsTyping(false);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [user]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '' || !socket || !isConnected) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
        sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    socket.send(JSON.stringify({
      type: 'message',
      message: inputMessage
    }));

    setInputMessage('');
  };

  const handleScreenShare = async () => {
    if (isSharingScreen) {
      toast({
        title: 'Already sharing screen',
        description: 'You are already sharing your screen!',
        variant: 'destructive',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      
      setIsSharingScreen(true);

      // Optional: Send notification to server if needed
      // socket?.send(JSON.stringify({ type: 'screen_share_started' }));

      toast({
        title: 'Screen Sharing Started',
        description: 'You are now sharing your screen.',
      });

      // Stop sharing when user manually stops
      stream.getTracks()[0].addEventListener('ended', () => {
        setIsSharingScreen(false);
        toast({
          title: 'Screen Sharing Stopped',
          description: 'You have stopped screen sharing.',
        });

        // Optional: Notify server if needed
        // socket?.send(JSON.stringify({ type: 'screen_share_stopped' }));
      });

    } catch (error) {
      console.error('Screen sharing failed:', error);
      toast({
        title: 'Screen Sharing Failed',
        description: 'Permission denied or no screen selected.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg z-50">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-gray-700" />
        </div>
          <div>
            <h3 className="font-semibold text-gray-800">Live Chat Support</h3>
            <p className="text-xs text-gray-500">
              {isConnected ? 'Connected to agent' : 'Connecting...'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
          </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
              className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                  ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
              <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
          </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex space-x-2">
              <input
                type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={!isConnected}
          />
          <Button
            onClick={handleSendMessage}
            disabled={inputMessage.trim() === '' || !isConnected}
            className="bg-gray-800 hover:bg-gray-900"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Screen Share Button */}
              <Button
                variant="outline"
          className="w-full flex items-center justify-center gap-2 text-xs py-1 rounded-full hover:bg-gray-50"
                onClick={handleScreenShare}
          disabled={!isConnected}
        >
          <Monitor className="w-4 h-4" />
          {isSharingScreen ? 'Sharing Screen...' : 'Share Screen'}
              </Button>
            </div>
    </div>
  );
};

export default ChatInterface; 
