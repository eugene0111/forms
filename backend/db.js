const client = require('mongoose');

client.connect("mongodb+srv://eugenesam1105:zOOlvSTLGwGNiCeC@cluster0.o1br6rm.mongodb.net/");

const userSchema = new client.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const formSchema = new client.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: client.Schema.Types.ObjectId, ref: 'User', required: true },
  fields: [{
    fieldName: { type: String, required: true },
    fieldType: { type: String, enum: ['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'date'], required: true },
    label: { type: String, required: true },
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    options: [String], // For select, checkbox, radio fields
    validation: {
      minLength: Number,
      maxLength: Number,
      min: Number,
      max: Number,
      pattern: String
    }
  }],
  createdBy: { type: client.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const responseSchema = new client.Schema({
  formId: { type: client.Schema.Types.ObjectId, ref: 'Form', required: true },
  userId: { type: client.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: [{
    fieldName: { type: String, required: true },
    value: client.Schema.Types.Mixed
  }],
  submittedAt: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: true }
});

// Models
const User = client.model('User', userSchema);
const Form = client.model('Form', formSchema);
const Response = client.model('Response', responseSchema);

module.exports = {
    User,
    Form,
    Response
}