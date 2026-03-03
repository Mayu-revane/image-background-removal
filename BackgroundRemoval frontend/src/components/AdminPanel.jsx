import { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = ({ onClose }) => {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async () => {
    try {
      console.log('🔍 Logging in with:', { email, password });
      const res = await axios.post(`${backendUrl}/admin/login`, { email, password });
      console.log('✅ Login response:', res.status, res.data);
      
      if (res.status === 200) {
        const adminToken = res.data;
        setToken(adminToken);
        localStorage.setItem('adminToken', adminToken);
        setLogin(false);
        fetchUsers(adminToken);
        fetchAllFeedbacks(adminToken);
        setError("");
      }
    } catch (err) {
      console.error('❌ Login ERROR:', err.response?.data);
      setError("Invalid admin credentials");
    }
  };

  const fetchUsers = async (adminToken) => {
    try {
      console.log('🔍 Fetching users...');
      const res = await axios.get(`${backendUrl}/admin/users`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('✅ USERS:', res.data);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('❌ Users ERROR:', err.response?.status, err.response?.data);
      setError("Failed to load users");
    }
  };

  const fetchAllFeedbacks = async (adminToken) => {
    setLoadingFeedbacks(true);
    try {
      console.log('🔍 Fetching all feedbacks...');
      const res = await axios.get(`${backendUrl}/feedback`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      console.log('✅ FEEDBACKS:', res.data);
      setFeedbacks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('❌ Feedbacks ERROR:', err.response?.status, err.response?.data);
      setError("Failed to load feedbacks");
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem('adminToken');
    setLogin(true);
    setUsers([]);
    setFeedbacks([]);
    setError("");
    onClose();
    window.location.href = '/';
  };

  const refreshFeedbacks = () => {
    if (token) {
      fetchAllFeedbacks(token);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-6xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold">×</button>

        {login ? (
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold">🔐 Admin Login</h2>
            {error && <p className="text-red-500 p-3 bg-red-100 rounded">{error}</p>}
            
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="password"
              placeholder="admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleLogin}
              className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-medium"
            >
              Login as Admin
            </button>
          </div>
        ) : (
          <div>
            {/* Header with tabs */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">👨‍💼 Admin Dashboard</h2>
              <button onClick={handleLogout} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Logout
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6">
              <button className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">Users ({users.length})</button>
              <button 
                onClick={refreshFeedbacks}
                className="px-4 py-2 font-medium text-gray-500 hover:text-gray-900"
              >
                Feedbacks ({feedbacks.length})
              </button>
            </div>

            {/* Users Table */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">👥 All Users ({users.length})</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{user.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{user.firstName} {user.lastName}</td>
                        <td className="px-6 py-4 text-sm">{user.email}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ✅ UPDATED: Feedbacks Table - SHOWS USERNAME */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">💬 All Feedbacks ({feedbacks.length})</h3>
                <button 
                  onClick={refreshFeedbacks}
                  disabled={loadingFeedbacks}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 text-sm"
                >
                  {loadingFeedbacks ? "Loading..." : "🔄 Refresh"}
                </button>
              </div>
              
              {loadingFeedbacks ? (
                <div className="text-center py-12 text-gray-500">Loading feedbacks...</div>
              ) : feedbacks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No feedbacks yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        {/* ✅ CHANGED: User ID → User Name */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {feedbacks.map((feedback) => (
                        <tr key={feedback.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{feedback.id}</td>
                          {/* ✅ SHOWS USERNAME from backend */}
                          <td className="px-6 py-4 text-sm font-semibold text-blue-600 truncate max-w-xs" 
                              title={feedback.username || feedback.clerkUserId}>
                            {feedback.username || feedback.clerkUserId || "Anonymous User"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex">
                              {[...Array(feedback.rating || 0)].map((_, i) => (
                                <span key={i} className="text-yellow-400 text-lg">★</span>
                              ))}
                              <span className="ml-1 text-gray-500">({feedback.rating || 0}/5)</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm max-w-md">
                            <div className="truncate" title={feedback.comment}>
                              {feedback.comment || "No comment"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : "Unknown"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
