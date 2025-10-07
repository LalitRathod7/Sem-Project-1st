require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Make io available in routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/blood-banks', require('./routes/bloodBankRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api', require('./routes/generalRoutes'));

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Emergency Blood Donation System Backend is running.' });
});

// Socket.IO connection for real-time alerts
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join room based on role
  socket.on('join', (data) => {
    const { role, userId } = data;
    socket.join(`${role}-${userId}`);
    socket.join(role); // General role room
    console.log(`User ${userId} joined ${role} room`);
  });

  // Handle blood request creation
  socket.on('new-blood-request', (requestData) => {
    // Broadcast to all blood banks and donors
    io.to('blood_bank').emit('blood-request-alert', {
      type: 'new_request',
      message: `New ${requestData.urgency} blood request: ${requestData.blood_type}`,
      data: requestData
    });

    // Notify compatible donors
    io.to('donor').emit('donor-alert', {
      type: 'request_match',
      message: `Urgent need for ${requestData.blood_type} blood`,
      data: requestData
    });
  });

  // Handle inventory updates
  socket.on('inventory-update', (inventoryData) => {
    if (inventoryData.status === 'critical' || inventoryData.status === 'low') {
      io.to('blood_bank').emit('inventory-alert', {
        type: 'low_stock',
        message: `Low stock alert: ${inventoryData.blood_type} - ${inventoryData.units_available} units`,
        data: inventoryData
      });
    }
  });

  // Handle emergency alerts
  socket.on('emergency-alert', (alertData) => {
    io.emit('emergency-notification', {
      type: 'emergency',
      message: alertData.message,
      data: alertData
    });
  });

  // Handle chat join
  socket.on('join-chat', (data) => {
    const { userId } = data;
    socket.join(`chat-${userId}`);
    console.log(`User ${userId} joined chat room`);
  });

  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      const { senderId, receiverId, message } = data;
      const messageId = await Message.create({ sender_id: senderId, receiver_id: receiverId, message });
      const messageData = {
        id: messageId,
        sender_id: senderId,
        receiver_id: receiverId,
        message,
        timestamp: new Date(),
        read: false
      };
      io.to(`chat-${receiverId}`).emit('new-message', messageData);
    } catch (error) {
      console.error('Send message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
