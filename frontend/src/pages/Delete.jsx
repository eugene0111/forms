import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Star,
  FileText,
  Trash2,
  ArrowLeft,
  AlertCircle,
  CheckSquare,
  Menu,
  X,
  LogOut,
  Ban,
  Check
} from 'lucide-react';

export const DeleteForm = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFormForDeletion, setSelectedFormForDeletion] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      navigate('/');
      return;
    }

    fetchForms();
  }, []);

  const fetchForms = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }
      const response = await axios.get('http://localhost:3000/api/admin/forms', {
        headers: {
          'Authorization': token,
        },
      });
      setForms(response.data);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError(err.response?.data?.error || 'Failed to fetch forms. Access denied or server error.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (form) => {
    setSuccess('');
    setSelectedFormForDeletion(form);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFormForDeletion) return;

    setIsDeleting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }
      await axios.delete(`http://localhost:3000/api/admin/forms/${selectedFormForDeletion._id}`, {
        headers: {
          'Authorization': token,
        },
      });
      setSuccess(`Form "${selectedFormForDeletion.title}" deleted successfully!`);
      setSelectedFormForDeletion(null);
      fetchForms();
    } catch (err) {
      console.error('Error deleting form:', err);
      setError(err.response?.data?.error || 'Failed to delete form. Server error.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setSelectedFormForDeletion(null);
    setIsDeleting(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    navigate('/');
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
                  <img src="/logo.png" alt="DRDO Logo" className="w-15 h-15 object-contain" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-900">DRDO Admin Panel</h1>
                  <p className="text-sm text-gray-600">Form Deletion System</p>
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
                <p className="text-sm font-semibold text-gray-700">Welcome, {currentUser?.username || 'Admin'}</p>
                <p className="text-xs text-gray-500 uppercase">Administrator</p>
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
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Delete Forms</h2>
              <p className="text-gray-600">Permanently remove forms from the system</p>
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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading forms...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border-t-4 border-red-600 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-red-600" />
              Available Forms
            </h3>
            <div className="space-y-4">
              {forms.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No forms available</h3>
                  <p className="text-sm">There are no forms to delete.</p>
                </div>
              ) : (
                forms.map(form => (
                  <div key={form._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />
                        {form.title}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Assigned To: {form.assignedTo?.username || 'N/A'} ({form.assignedTo?.email || 'N/A'})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created On: {new Date(form.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(form)}
                      className="ml-0 md:ml-4 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-all flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center mx-auto"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Secure Logout
          </button>
        </div>
      </div>

      {selectedFormForDeletion && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-red-600 text-white rounded-t-lg">
              <h3 className="text-xl font-bold flex items-center"><Trash2 className="w-6 h-6 mr-2" /> Confirm Deletion</h3>
              <button onClick={handleCancelDelete} className="p-2 rounded-full hover:bg-red-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-700 text-lg mb-4">
                Are you sure you want to permanently delete the form:
              </p>
              <p className="font-bold text-red-700 text-xl mb-6">
                "{selectedFormForDeletion.title}"?
              </p>
              <p className="text-sm text-gray-600">
                This action cannot be undone. All associated data will be lost.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors flex items-center"
                disabled={isDeleting}
              >
                <Ban className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};