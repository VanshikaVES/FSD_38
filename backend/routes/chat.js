const express = require('express');
const Chat = require('../models/Chat');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/chat/messages/:userId
// @desc    Get chat messages between current user and specified user
// @access  Private
router.get('/messages/:userId', async (req, res) => {
  try {
    const messages = await Chat.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/conversations
// @desc    Get all conversations for current user (admins get all users, users get admins)
// @access  Private
router.get('/conversations', async (req, res) => {
  try {
    let conversations = [];

    if (req.user.role === 'admin') {
      // Admins see all users who have chatted
      const usersWithMessages = await Chat.distinct('sender', {
        receiver: req.user._id
      });

      const users = await User.find({
        _id: { $in: usersWithMessages },
        role: 'user'
      }).select('name email');

      conversations = await Promise.all(users.map(async (user) => {
        const lastMessage = await Chat.findOne({
          $or: [
            { sender: user._id, receiver: req.user._id },
            { sender: req.user._id, receiver: user._id }
          ]
        })
        .sort({ timestamp: -1 })
        .populate('sender', 'name')
        .populate('receiver', 'name');

        const unreadCount = await Chat.countDocuments({
          sender: user._id,
          receiver: req.user._id,
          isRead: false
        });

        return {
          user: user,
          lastMessage: lastMessage,
          unreadCount: unreadCount
        };
      }));
    } else {
      // Users see admins
      const admins = await User.find({ role: 'admin' }).select('name email');

      conversations = await Promise.all(admins.map(async (admin) => {
        const lastMessage = await Chat.findOne({
          $or: [
            { sender: req.user._id, receiver: admin._id },
            { sender: admin._id, receiver: req.user._id }
          ]
        })
        .sort({ timestamp: -1 })
        .populate('sender', 'name')
        .populate('receiver', 'name');

        const unreadCount = await Chat.countDocuments({
          sender: admin._id,
          receiver: req.user._id,
          isRead: false
        });

        return {
          user: admin,
          lastMessage: lastMessage,
          unreadCount: unreadCount
        };
      }));
    }

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat/send
// @desc    Send a chat message
// @access  Private
router.post('/send', async (req, res) => {
  const { receiverId, message } = req.body;

  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const chatMessage = new Chat({
      sender: req.user._id,
      receiver: receiverId,
      message: message.trim(),
      messageType: 'text'
    });

    await chatMessage.save();
    await chatMessage.populate('sender', 'name');
    await chatMessage.populate('receiver', 'name');

    // Emit real-time event
    const io = req.app.get('io');
    io.to(`user_${receiverId}`).emit('newMessage', {
      message: chatMessage,
      from: req.user._id
    });

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/chat/mark-read/:userId
// @desc    Mark messages from a user as read
// @access  Private
router.put('/mark-read/:userId', async (req, res) => {
  try {
    await Chat.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
