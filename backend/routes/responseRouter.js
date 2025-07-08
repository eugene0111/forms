const express = require('express');
const { Response } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware');

const responseRouter = express.Router();

responseRouter.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const responses = await Response.find()
      .populate('formId', 'title description')
      .populate('userId', 'username email')
      .sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

responseRouter.get('/form/:formId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId })
      .populate('userId', 'username email')
      .sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

responseRouter.get('/user/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const responses = await Response.find({ userId: req.params.userId })
      .populate('formId', 'title description')
      .sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

responseRouter.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const response = await Response.findById(req.params.id)
      .populate('formId', 'title description fields')
      .populate('userId', 'username email');
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = responseRouter;