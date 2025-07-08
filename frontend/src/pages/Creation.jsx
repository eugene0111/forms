import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Star,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  FileText,
  Settings,
  Calendar,
  Hash,
  Type,
  Mail,
  MessageSquare,
  CheckSquare,
  Circle,
  List,
  AlertCircle,
  Eye,
  Edit3,
  Menu,
  X
} from 'lucide-react';

export const Creation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    fields: []
  });

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: Type },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'textarea', label: 'Text Area', icon: MessageSquare },
    { value: 'select', label: 'Dropdown', icon: List },
    { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { value: 'radio', label: 'Radio Button', icon: Circle },
    { value: 'date', label: 'Date', icon: Calendar }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/users', {
        headers: {
          'Authorization': `${localStorage.getItem('authToken')}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      setUsers([
        { _id: '1', username: 'john.doe', email: 'john.doe@drdo.gov.in' },
        { _id: '2', username: 'jane.smith', email: 'jane.smith@drdo.gov.in' },
        { _id: '3', username: 'raj.kumar', email: 'raj.kumar@drdo.gov.in' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addField = () => {
    const newField = {
      id: Date.now(),
      fieldName: '',
      label: '',
      fieldType: 'text',
      placeholder: '',
      required: false,
      options: [],
      validation: {}
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const removeField = (id) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  };

  const updateField = (id, updates) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    }));
  };

  const addOption = (fieldId) => {
    const field = formData.fields.find(f => f.id === fieldId);
    if (field) {
      updateField(fieldId, {
        options: [...(field.options || []), '']
      });
    }
  };

  const updateOption = (fieldId, optionIndex, value) => {
    const field = formData.fields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = [...(field.options || [])];
      newOptions[optionIndex] = value;
      updateField(fieldId, { options: newOptions });
    }
  };

  const removeOption = (fieldId, optionIndex) => {
    const field = formData.fields.find(f => f.id === fieldId);
    if (field) {
      const newOptions = field.options.filter((_, index) => index !== optionIndex);
      updateField(fieldId, { options: newOptions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const cleanedFields = formData.fields.map(field => {
        const cleanField = {
          fieldName: field.fieldName,
          label: field.label,
          fieldType: field.fieldType,
          placeholder: field.placeholder,
          required: field.required
        };

        if (['select', 'checkbox', 'radio'].includes(field.fieldType) && field.options) {
          cleanField.options = field.options.filter(opt => opt.trim() !== '');
        }

        if (field.validation && Object.keys(field.validation).length > 0) {
          cleanField.validation = field.validation;
        }

        return cleanField;
      });

      const payload = {
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        fields: cleanedFields
      };

      const response = await axios.post(
        'http://localhost:3000/api/admin/forms',
        payload,
        {
          headers: {
            'Authorization': `${localStorage.getItem('authToken')}`,
          }
        }
      );

      setSuccess('Form created successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  const renderFieldPreview = (field) => {
    const FieldIcon = fieldTypes.find(type => type.value === field.fieldType)?.icon || Type;
    
    return (
      <div key={field.id} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center space-x-2 mb-2">
          <FieldIcon className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-900">{field.label}</span>
          {field.required && <span className="text-red-500">*</span>}
        </div>
        
        {field.fieldType === 'text' && (
          <input
            type="text"
            placeholder={field.placeholder}
            className="w-full p-2 border rounded-md"
            disabled
          />
        )}
        
        {field.fieldType === 'email' && (
          <input
            type="email"
            placeholder={field.placeholder}
            className="w-full p-2 border rounded-md"
            disabled
          />
        )}
        
        {field.fieldType === 'number' && (
          <input
            type="number"
            placeholder={field.placeholder}
            className="w-full p-2 border rounded-md"
            disabled
          />
        )}
        
        {field.fieldType === 'textarea' && (
          <textarea
            placeholder={field.placeholder}
            className="w-full p-2 border rounded-md h-24"
            disabled
          />
        )}
        
        {field.fieldType === 'select' && (
          <select className="w-full p-2 border rounded-md" disabled>
            <option>Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )}
        
        {field.fieldType === 'checkbox' && (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
        
        {field.fieldType === 'radio' && (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.fieldName} disabled />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
        
        {field.fieldType === 'date' && (
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            disabled
          />
        )}
      </div>
    );
  };

  const renderFieldEditor = (field, index) => {
    const FieldIcon = fieldTypes.find(type => type.value === field.fieldType)?.icon || Type;
    
    return (
      <div key={field.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FieldIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Field {index + 1}</h3>
          </div>
          <button
            onClick={() => removeField(field.id)}
            className="text-red-600 hover:text-red-800 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name *
            </label>
            <input
              type="text"
              value={field.fieldName}
              onChange={(e) => updateField(field.id, { fieldName: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., firstName"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label *
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., First Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Type *
            </label>
            <select
              value={field.fieldType}
              onChange={(e) => updateField(field.id, { fieldType: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={field.placeholder}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter placeholder text"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(field.id, { required: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Required field</span>
          </label>
        </div>

        {['select', 'checkbox', 'radio'].includes(field.fieldType) && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {field.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  <button
                    onClick={() => removeOption(field.id, optionIndex)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(field.id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="bg-white border-b-4 border-orange-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <img src="/logo.png" alt="DRDO Logo" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-900">DRDO Admin Panel</h1>
                  <p className="text-sm text-gray-600">Form Creation System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">Administrator</p>
                <p className="text-xs text-gray-500 uppercase">Form Builder</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg border-t-4 border-blue-600 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Form</h2>
                <p className="text-gray-600">Design and configure forms for personnel</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  previewMode
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <CheckSquare className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {!previewMode ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg border-t-4 border-green-600 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-green-600" />
                Form Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter form title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to User *
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">Select a user</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows="1"
                  placeholder="Enter form description"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg border-t-4 border-purple-600 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Edit3 className="w-6 h-6 mr-2 text-purple-600" />
                  Form Fields
                </h3>
                <button
                  type="button"
                  onClick={addField}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-md flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </button>
              </div>

              <div className="space-y-6">
                {formData.fields.map((field, index) => renderFieldEditor(field, index))}
                
                {formData.fields.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No fields added yet</h3>
                    <p className="text-sm">Click "Add Field" to start building your form</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg border-t-4 border-orange-600 p-6">
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.fields.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Form...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Create Form
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border-t-4 border-blue-600 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-blue-600" />
              Form Preview
            </h3>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900">{formData.title || 'Form Title'}</h4>
              {formData.description && (
                <p className="text-gray-600 mt-2">{formData.description}</p>
              )}
            </div>

            <div className="space-y-4">
              {formData.fields.map(field => renderFieldPreview(field))}
              
              {formData.fields.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No fields to preview</h3>
                  <p className="text-sm">Switch to edit mode to add fields</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            DRDO - Defence Research and Development Organisation | Government of India
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Classified System - Authorized Personnel Only
          </p>
        </div>
      </footer>
    </div>
  );
};