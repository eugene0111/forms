const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware');
const { User, Form, Response } = require('../db');

const dashboardRouter = express.Router();

dashboardRouter.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalForms = await Form.countDocuments();
    const totalResponses = await Response.countDocuments();
    const activeForms = await Form.countDocuments({ isActive: true });
    
    const recentResponses = await Response.find()
      .populate('formId', 'title')
      .populate('userId', 'username')
      .sort({ submittedAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalForms,
        totalResponses,
        activeForms
      },
      recentResponses
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = dashboardRouter;