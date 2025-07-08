import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Star,
  FileText,
  User,
  Clock,
  ArrowLeft,
  Eye,
  AlertCircle,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export const ViewResponses = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      navigate('/');
      return;
    }

    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }
      const response = await axios.get('http://localhost:3000/api/admin/responses', {
        headers: {
          'Authorization': token,
        },
      });
      setResponses(response.data);
    } catch (error) {
      console.error('Error fetching responses:', error);
      setError(error.response?.data?.error || 'Failed to fetch responses. Access denied or server error.');
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (responseId) => {
    setSelectedResponse(null);
    setIsDetailLoading(true);
    setDetailError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }
      const response = await axios.get(`http://localhost:3000/api/admin/responses/${responseId}`, {
        headers: {
          'Authorization': token,
        },
      });
      setSelectedResponse(response.data);
    } catch (error) {
      console.error('Error fetching response details:', error);
      setDetailError(error.response?.data?.error || 'Failed to fetch response details.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedResponse(null);
    setDetailError('');
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
                  <p className="text-sm text-gray-600">Form Response Management</p>
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">View All Responses</h2>
              <p className="text-gray-600">Review submitted forms from personnel</p>
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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading responses...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border-t-4 border-purple-600 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-purple-600" />
              Submitted Forms Overview
            </h3>
            <div className="space-y-4">
              {responses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No responses found</h3>
                  <p className="text-sm">There are no submitted forms to display yet.</p>
                </div>
              ) : (
                responses.map(response => (
                  <div key={response._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />
                        {response.formId?.title || 'Unknown Form'}
                      </p>
                      <p className="text-sm text-gray-700 mt-1 flex items-center">
                        <User className="w-3 h-3 mr-1 text-gray-500" />
                        Submitted by: {response.userId?.username || 'Unknown User'} ({response.userId?.email || 'N/A'})
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-gray-500" />
                        Date: {new Date(response.submittedAt).toLocaleDateString()} at {new Date(response.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewDetails(response._id)}
                      className="ml-0 md:ml-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
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

      {selectedResponse && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
              <h3 className="text-xl font-bold">Response Details</h3>
              <button onClick={handleCloseDetail} className="p-2 rounded-full hover:bg-blue-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {isDetailLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading response data...</p>
                </div>
              ) : detailError ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700 font-medium">{detailError}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 space-y-2 text-gray-700">
                    <p className="text-lg font-semibold">Form: {selectedResponse.formId?.title || 'N/A'}</p>
                    <p>Description: {selectedResponse.formId?.description || 'N/A'}</p>
                    <p>Submitted by: <span className="font-medium">{selectedResponse.userId?.username || 'N/A'} ({selectedResponse.userId?.email || 'N/A'})</span></p>
                    <p>Submitted on: <span className="font-medium">{new Date(selectedResponse.submittedAt).toLocaleString()}</span></p>
                  </div>

                  <h4 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Fields & Values</h4>
                  <div className="space-y-4">
                    {selectedResponse.responses.length > 0 ? (
                      selectedResponse.responses.map((res, index) => (
                        <div key={index} className="bg-gray-100 p-3 rounded-md border border-gray-200">
                          <p className="font-medium text-gray-900">{res.fieldName}</p>
                          <p className="text-sm text-gray-700 break-words">
                            {Array.isArray(res.value) ? res.value.join(', ') : String(res.value)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No specific field responses recorded.</p>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 text-right">
              <button
                onClick={handleCloseDetail}
                className="px-6 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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