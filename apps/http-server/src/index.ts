import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { prisma } from '@repo/db'; // Using the correct export name

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the HTTP server!');
});

app.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    // Input validation
    if (!username || !password || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          username: !username ? 'Username is required' : null,
          password: !password ? 'Password is required' : null,
          email: !email ? 'Email is required' : null
        }
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        details: existingUser.username === username ? 'Username taken' : 'Email already registered'
      });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password, // Note: In production, you should hash the password
        email
      }
    });

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});