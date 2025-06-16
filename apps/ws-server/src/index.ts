import { WebSocketServer, WebSocket } from 'ws';
import { prisma } from '@repo/db';

const wss = new WebSocketServer({ port: 3002 });

console.log('WebSocket server starting on port 3002...');

// Store connected clients
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to WebSocket server'
    }));

    // Handle incoming messages
    ws.on('message', async (message) => {
        try {
            let data;
            try {
                // Try to parse as JSON first
                data = JSON.parse(message.toString());
            } catch {
                // If not JSON, treat as plain text
                data = {
                    type: 'message',
                    message: message.toString()
                };
            }

            console.log('Received message:', data);

            // Broadcast message to all connected clients
            clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'broadcast',
                        message: data
                    }));
                }
            });

            // Send acknowledgment back to sender
            ws.send(JSON.stringify({
                type: 'ack',
                message: 'Message received and broadcasted'
            }));
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Failed to process message'
            }));
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Handle server errors
wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
});

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});


