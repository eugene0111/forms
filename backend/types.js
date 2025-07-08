const { z } = require('zod');

const signinSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).optional(),
});

const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['user', 'admin']).optional(),
});

const createFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assignedTo: z.string().min(1),
  fields: z.array(
    z.object({
      fieldName: z.string().min(1),
      label: z.string().min(1),
      fieldType: z.enum(['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'date']),
      placeholder: z.string().optional(),
      required: z.boolean().optional(),
      options: z.array(z.string()).optional(),
      validation: z.object({
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().optional(),
      }).optional(),
    })
  ).min(1),
});

const submitFormSchema = z.object({
  formId: z.string().min(1),
  responses: z.array(
    z.object({
      fieldName: z.string().min(1),
      value: z.any(),
    })
  ).min(1),
});

module.exports = {
  signinSchema,
  createUserSchema,
  updateUserSchema,
  createFormSchema,
  submitFormSchema,
};