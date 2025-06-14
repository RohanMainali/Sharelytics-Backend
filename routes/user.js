const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Middleware to authenticate JWT and set req.userId
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = user.id;
    next();
  });
}

// Get watchlist
router.get('/watchlist', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update watchlist
router.put('/watchlist', authenticateToken, async (req, res) => {
  const { watchlist } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { watchlist },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get portfolio
router.get('/portfolio', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ portfolio: user.portfolio });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update portfolio
router.put('/portfolio', authenticateToken, async (req, res) => {
  const { portfolio } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { portfolio },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ portfolio: user.portfolio });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password required' });
  }
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ notifications: user.notifications || [] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add notification (for system/admin use or demo)
router.post('/notifications', authenticateToken, async (req, res) => {
  const { message, type } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const notification = {
      message,
      type: type || 'info',
      date: new Date(),
      read: false
    };
    user.notifications.unshift(notification);
    // Keep only latest 50 notifications
    user.notifications = user.notifications.slice(0, 50);
    await user.save();
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark notification as read
router.put('/notifications/:index/read', authenticateToken, async (req, res) => {
  const { index } = req.params;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.notifications[index]) return res.status(404).json({ error: 'Notification not found' });
    user.notifications[index].read = true;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
