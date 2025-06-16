import express from 'express';
import cors from 'cors';
import { prisma } from '@repo/db';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'http-server' });
});

// Example endpoint to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Example endpoint to create a user
app.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password // Note: In production, hash the password
      }
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});