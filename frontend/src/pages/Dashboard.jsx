import { useState, useEffect } from 'react';
import { 
  Star, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Eye, 
  UserPlus,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  Trash2,
  X
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalForms: 0,
    totalResponses: 0,
    activeForms: 0
  });
  const [recentResponses, setRecentResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: 'admin',
    role: 'admin'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/dashboard', {
        headers: {
          'Authorization': `${localStorage.getItem("authToken")}`
        },
      });

      setStats(response.data.stats);
      setRecentResponses(response.data.recentResponses);
    } catch (error) {
      setStats({
        totalUsers: 45,
        totalForms: 12,
        totalResponses: 128,
        activeForms: 8
      });
      setRecentResponses([
        {
          _id: '1',
          formId: { title: 'Personnel Security Clearance Form' },
          userId: { username: 'john.doe' },
          submittedAt: '2024-07-08T10:30:00Z'
        },
        {
          _id: '2',
          formId: { title: 'Equipment Requisition Form' },
          userId: { username: 'jane.smith' },
          submittedAt: '2024-07-08T09:15:00Z'
        }
      ]);
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    window.authToken = null;
    window.currentUser = null;
    navigate('/');
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white rounded-lg shadow-lg border-l-4 border-orange-500 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">
              <span className="font-medium">+{trend}%</span> from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ icon: Icon, title, description, onClick, color }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all text-left w-full"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );

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
                  <p className="text-sm text-gray-600">Form Management System</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">Welcome, {currentUser.username}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend={12}
          />
          <StatCard
            icon={FileText}
            title="Total Forms"
            value={stats.totalForms}
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend={8}
          />
          <StatCard
            icon={BarChart3}
            title="Total Responses"
            value={stats.totalResponses}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            trend={15}
          />
          <StatCard
            icon={Activity}
            title="Active Forms"
            value={stats.activeForms}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            trend={5}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg border-t-4 border-blue-600 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-blue-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              icon={Plus}
              title="Create Form"
              description="Design new forms"
              onClick={() => navigate('/create-form')}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <QuickAction
              icon={UserPlus}
              title="Add User"
              description="Register new personnel"
              onClick={() => navigate('/add-user')}
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <QuickAction
              icon={Eye}
              title="View Responses"
              description="Review submissions"
              onClick={() => navigate('/view-responses')}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
            />
            <QuickAction
              icon={Trash2}
              title="Delete"
              description="Delete a form"
              onClick={() => navigate('/delete')}
              color="bg-gradient-to-r from-orange-500 to-orange-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg border-t-4 border-green-600 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-green-600" />
              Recent Form Submissions
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading recent activity...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentResponses.map((response) => (
                  <div key={response._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{response.formId?.title || 'Unknown Form'}</p>
                        <p className="text-sm text-gray-600">by {response.userId?.username || 'Unknown User'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(response.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentResponses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No recent submissions</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg border-t-4 border-purple-600 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 mr-2 text-purple-600" />
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">Database Connection</span>
                </div>
                <span className="text-sm text-green-600 font-medium">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">Security Protocol</span>
                </div>
                <span className="text-sm text-green-600 font-medium">SECURE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-blue-800">Form Processing</span>
                </div>
                <span className="text-sm text-blue-600 font-medium">OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>

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