import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, LogIn } from 'lucide-react';
import AgentChat from '@/components/AgentChat';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentId && agentName) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAgentId('');
    setAgentName('');
    setShowChat(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {!isLoggedIn ? (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Agent Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="agentId">Agent ID</Label>
                  <Input
                    id="agentId"
                    type="text"
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    placeholder="Enter your agent ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Welcome, {agentName}</h1>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Customer Support Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Click the button below to start handling customer support chats.
                  </p>
                  <Button
                    onClick={() => setShowChat(true)}
                    className="w-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open Chat Interface
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showChat && (
          <AgentChat
            onClose={() => setShowChat(false)}
            agentId={agentId}
            agentName={agentName}
          />
        )}
      </div>
    </div>
  );
};

export default AgentDashboard; 