import { WebSocketServer } from 'ws';
import { prisma } from '@repo/db';

const server = new WebSocketServer({ port: 3001 });

console.log('WebSocket server starting on port 3001...');

server.on('connection', async (ws) => {
    console.log('New client connected');
    
    try {
        const res = await prisma.user.create({
            data: {
                username: 'test',
                password: 'test',
                email: 'test@test.com'
            }
        });
        console.log('User created:', res);
        ws.send("hey there is someone");
    } catch (error) {
        console.error('Error creating user:', error);
        ws.send("Error occurred while processing connection");
    }
});

server.on('error', (error) => {
    console.error('WebSocket server error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});
