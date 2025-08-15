'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    teamName: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch teams
  const fetchTeams = async () => {
    try {
      const response = await axios.get('/api/team');
      setTeams(response.data.teams || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      showToast('Failed to fetch teams', 'error');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Add team
  const handleAdd = async () => {
    if (!formData.teamName.trim()) {
      showToast('Please enter a team name', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/team', formData);
      if (response.status === 200) {
        showToast('Team added successfully', 'success');
      }
      if (response.status === 202) {
        await fetchTeams(); // Refresh the teams list
        setFormData({ teamName: '', isActive: true });
        setShowAddForm(false);
        showToast('Team added successfully', 'success');
      }
    } catch (error) {
      console.error('Error adding team:', error);
      showToast('Failed to add team', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Edit team
  const handleEdit = async (id) => {
    if (!formData.teamName.trim()) {
      showToast('Please enter a team name', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put('/api/team', {
        id,
        ...formData,
      });

      if (response.status === 200) {
        await fetchTeams(); // Refresh the teams list
        setEditingId(null);
        setFormData({ teamName: '', isActive: true });
        showToast('Team updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      showToast('Failed to update team', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete team
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    setLoading(true);
    try {
      const response = await axios.delete('/api/team', {
        data: { id }
      });

      if (response.status === 200) {
        await fetchTeams(); // Refresh the teams list
        showToast('Team deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      showToast('Failed to delete team', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEdit = (team) => {
    setEditingId(team._id);
    setFormData({
      teamName: team.teamName,
      isActive: team.isActive
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ teamName: '', isActive: true });
  };



  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 
          toast.type === 'error' ? 'bg-red-600 text-white' : 
          'bg-blue-600 text-white'
        }`}>
          {toast.type === 'success' && <CheckCircle size={20} />}
          {toast.type === 'error' && <XCircle size={20} />}
          {toast.type === 'info' && <AlertCircle size={20} />}
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-70"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Team
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Teams List */}
        <div className="p-6">
          {teams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No teams found. Add your first team!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Team Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created At</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {editingId === team._id ? (
                          <input
                            type="text"
                            value={formData.teamName}
                            onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-gray-900">{team.teamName}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingId === team._id ? (
                          <select
                            value={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            team.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {team.isActive ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(team.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {editingId === team._id ? (
                            <>
                              <button
                                onClick={() => handleEdit(team._id)}
                                disabled={loading}
                                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                <Save size={16} />
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
                              >
                                <X size={16} />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(team)}
                                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(team._id)}
                                disabled={loading}
                                className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Save, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
// import axios from 'axios';

// const TeamManagement = () => {
//   const [teams, setTeams] = useState([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({
//     teamName: '',
//     isActive: true
//   });
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   // Show toast notification
//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // Fetch teams
//   const fetchTeams = async () => {
//     try {
//       const response = await axios.get('/api/team');
//       setTeams(response.data.teams || []);
//     } catch (error) {
//       console.error('Error fetching teams:', error);
//       showToast('Failed to fetch teams', 'error');
//     }
//   };

//   useEffect(() => {
//     fetchTeams();
//   }, []);

//   // Add team
//   const handleAdd = async () => {
//     if (!formData.teamName.trim()) {
//       showToast('Please enter a team name', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post('/api/team', formData);
      
//       if (response.status === 202) {
//         await fetchTeams();
//         setFormData({ teamName: '', isActive: true });
//         setShowAddForm(false);
//         showToast('Team added successfully', 'success');
//       }
//     } catch (error) {
//       console.error('Error adding team:', error);
//       showToast('Failed to add team', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Edit team
//   const handleEdit = async (id) => {
//     if (!formData.teamName.trim()) {
//       showToast('Please enter a team name', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.put('/api/team', {
//         id,
//         ...formData,
//       });

//       if (response.status === 200) {
//         await fetchTeams();
//         setEditingId(null);
//         setFormData({ teamName: '', isActive: true });
//         showToast('Team updated successfully', 'success');
//       }
//     } catch (error) {
//       console.error('Error updating team:', error);
//       showToast('Failed to update team', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete team
//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this team?')) return;

//     setLoading(true);
//     try {
//       const response = await axios.delete('/api/team', {
//         data: { id }
//       });

//       if (response.status === 200) {
//         await fetchTeams();
//         showToast('Team deleted successfully', 'success');
//       }
//     } catch (error) {
//       console.error('Error deleting team:', error);
//       showToast('Failed to delete team', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Start editing
//   const startEdit = (team) => {
//     setEditingId(team._id);
//     setFormData({
//       teamName: team.teamName,
//       isActive: team.isActive
//     });
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditingId(null);
//     setFormData({ teamName: '', isActive: true });
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* Toast Notification */}
//       {toast && (
//         <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
//           toast.type === 'success' ? 'bg-green-600 text-white' : 
//           toast.type === 'error' ? 'bg-red-600 text-white' : 
//           'bg-blue-600 text-white'
//         }`}>
//           {toast.type === 'success' && <CheckCircle size={20} />}
//           {toast.type === 'error' && <XCircle size={20} />}
//           {toast.type === 'info' && <AlertCircle size={20} />}
//           <span>{toast.message}</span>
//           <button 
//             onClick={() => setToast(null)}
//             className="ml-2 hover:opacity-70"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow-lg">
//         {/* Header */}
//         <div className="border-b border-gray-200 p-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
//             <button
//               onClick={() => setShowAddForm(!showAddForm)}
//               className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Plus size={20} />
//               Add Team
//             </button>
//           </div>
//         </div>

//         {/* Add Form */}
//         {showAddForm && (
//           <div className="p-6 border-b border-gray-200 bg-gray-50">
//             <div className="flex gap-4 items-end">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Team Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.teamName}
//                   onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter team name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Status
//                 </label>
//                 <select
//                   value={formData.isActive}
//                   onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
//                   className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value={true}>Active</option>
//                   <option value={false}>Inactive</option>
//                 </select>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleAdd}
//                   disabled={loading}
//                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
//                 >
//                   {loading ? 'Adding...' : 'Add'}
//                 </button>
//                 <button
//                   onClick={() => setShowAddForm(false)}
//                   className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Teams List */}
//         <div className="p-6">
//           {teams.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No teams found. Add your first team!
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 font-semibold text-gray-700">Team Name</th>
//                     <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
//                     <th className="text-left py-3 px-4 font-semibold text-gray-700">Created At</th>
//                     <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {teams.map((team) => (
//                     <tr key={team._id} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="py-3 px-4">
//                         {editingId === team._id ? (
//                           <input
//                             type="text"
//                             value={formData.teamName}
//                             onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
//                             className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           />
//                         ) : (
//                           <span className="text-gray-900">{team.teamName}</span>
//                         )}
//                       </td>
//                       <td className="py-3 px-4">
//                         {editingId === team._id ? (
//                           <select
//                             value={formData.isActive}
//                             onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
//                             className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           >
//                             <option value={true}>Active</option>
//                             <option value={false}>Inactive</option>
//                           </select>
//                         ) : (
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                             team.isActive 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-red-100 text-red-800'
//                           }`}>
//                             {team.isActive ? 'Active' : 'Inactive'}
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-3 px-4 text-gray-600">
//                         {new Date(team.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex gap-2">
//                           {editingId === team._id ? (
//                             <>
//                               <button
//                                 onClick={() => handleEdit(team._id)}
//                                 disabled={loading}
//                                 className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
//                               >
//                                 <Save size={16} />
//                                 Save
//                               </button>
//                               <button
//                                 onClick={cancelEdit}
//                                 className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors"
//                               >
//                                 <X size={16} />
//                                 Cancel
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={() => startEdit(team)}
//                                 className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
//                               >
//                                 <Edit size={16} />
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(team._id)}
//                                 disabled={loading}
//                                 className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
//                               >
//                                 <Trash2 size={16} />
//                                 Delete
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamManagement;