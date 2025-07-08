const { Form, Response } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware');
const express = require('express');
const { submitFormSchema } = require('../types');

const userRouter = express.Router();

userRouter.get('/my-form', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findOne({ 
      assignedTo: req.user.id, 
      isActive: true 
    }).populate('createdBy', 'username');
    
    if (!form) {
      return res.json({ hasForm: false, message: 'No form assigned' });
    }

    const existingResponse = await Response.findOne({
      formId: form._id,
      userId: req.user.id
    });

    res.json({ 
      hasForm: true, 
      form, 
      hasSubmitted: !!existingResponse,
      response: existingResponse 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

userRouter.post('/submit-form', authenticateToken, async (req, res) => {
  const { success } = submitFormSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
        message: "Invalid Input formats"
    });
  }
  try {
    const { formId, responses } = req.body;

    if (!formId || !responses) {
      return res.status(400).json({ error: 'Form ID and responses are required' });
    }

    const form = await Form.findOne({ 
      _id: formId, 
      assignedTo: req.user.id, 
      isActive: true 
    });
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found or not assigned to you' });
    }

    const existingResponse = await Response.findOne({
      formId: formId,
      userId: req.user.id
    });

    if (existingResponse) {
      return res.status(400).json({ error: 'You have already submitted this form' });
    }

    const validatedResponses = [];
    for (const field of form.fields) {
      const userResponse = responses.find(r => r.fieldName === field.fieldName);
      
      if (field.required && (!userResponse || !userResponse.value)) {
        return res.status(400).json({ error: `${field.label} is required` });
      }

      if (userResponse && userResponse.value) {
        validatedResponses.push({
          fieldName: field.fieldName,
          value: userResponse.value
        });
      }
    }

    const response = new Response({
      formId,
      userId: req.user.id,
      responses: validatedResponses
    });

    await response.save();
    res.status(201).json({ message: 'Form submitted successfully', response });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

userRouter.get('/my-responses', authenticateToken, async (req, res) => {
  try {
    const responses = await Response.find({ userId: req.user.id })
      .populate('formId', 'title description')
      .sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = userRouter;