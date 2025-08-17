import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

// Store connected clients
const clients = new Map();
let availableAgents = new Set();
let waitingUsers = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'user_info') {
        // Handle user connection
        const userInfo = {
          type: 'user',
          userId: data.data.userId,
          name: data.data.name,
          email: data.data.email
        };
        clients.set(ws, userInfo);
        waitingUsers.set(ws, userInfo);

        // If there's an available agent, assign them
        if (availableAgents.size > 0) {
          const agent = Array.from(availableAgents)[0];
          agent.send(JSON.stringify({
            type: 'new_chat',
            data: {
              userId: data.data.userId,
              name: data.data.name
            }
          }));
          waitingUsers.delete(ws);
        }
      } else if (data.type === 'agent_info') {
        // Handle agent connection
        const agentInfo = {
          type: 'agent',
          agentId: data.data.agentId,
          name: data.data.name
        };
        clients.set(ws, agentInfo);
        availableAgents.add(ws);

        // Check for waiting users and notify agent
        if (waitingUsers.size > 0) {
          const [userWs, userInfo] = Array.from(waitingUsers.entries())[0];
          ws.send(JSON.stringify({
            type: 'new_chat',
            data: {
              userId: userInfo.userId,
              name: userInfo.name
            }
          }));
          waitingUsers.delete(userWs);
        }
      } else if (data.type === 'message') {
        // Handle chat messages
        const sender = clients.get(ws);
        const messageData = {
          type: 'message',
          message: data.message,
          sender: sender.type,
          name: sender.name,
          timestamp: new Date().toISOString(),
          user: sender.type === 'user' ? {
            id: sender.userId,
            name: sender.name
          } : undefined
        };

        if (sender.type === 'user') {
          // Send to an available agent
          for (const [client, info] of clients) {
            if (info.type === 'agent') {
              client.send(JSON.stringify(messageData));
              break;
            }
          }
        } else if (sender.type === 'agent') {
          // Send to the specified user
          for (const [client, info] of clients) {
            if (info.type === 'user' && info.userId === data.userId) {
              client.send(JSON.stringify(messageData));
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    const clientInfo = clients.get(ws);
    if (clientInfo) {
      if (clientInfo.type === 'agent') {
        availableAgents.delete(ws);
      } else if (clientInfo.type === 'user') {
        waitingUsers.delete(ws);
      }
      clients.delete(ws);
    }
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:3001');
