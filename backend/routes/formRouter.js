const express = require('express');
const { Form, User, Response } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware');
const { createFormSchema } = require('../types');

const formRouter = express.Router();

formRouter.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { success } = createFormSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid Input formats"
    });
  }
  try {
    const { title, description, assignedTo, fields } = req.body;

    if (!title || !assignedTo || !fields || fields.length === 0) {
      return res.status(400).json({ error: 'Title, assignedTo, and fields are required' });
    }

    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ error: 'Assigned user not found' });
    }

    // Check if the user already has an active form assigned
    const existingForm = await Form.findOne({ assignedTo, isActive: true });
    if (existingForm) {
      return res.status(400).json({ error: 'User already has an active form assigned' });
    }

    const form = new Form({
      title,
      description,
      assignedTo,
      fields,
      createdBy: req.user.id
    });

    await form.save();
    await form.populate('assignedTo', 'username email');
    res.status(201).json({ message: 'Form created successfully', form });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

formRouter.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const forms = await Form.find()
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

formRouter.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username');
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

formRouter.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, assignedTo, fields, isActive } = req.body;
    
    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user) {
        return res.status(404).json({ error: 'Assigned user not found' });
      }
    }

    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, fields, isActive },
      { new: true }
    ).populate('assignedTo', 'username email');

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json({ message: 'Form updated successfully', form });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

formRouter.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    const data = await Response.findOne({
      formId: req.params.id
    });
    const response = await Response.findByIdAndDelete(data._id);
    if (!response) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = formRouter;