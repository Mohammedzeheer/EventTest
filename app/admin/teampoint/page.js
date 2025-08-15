'use client';
import React, { useState, useEffect } from 'react';
import { Save, X, CheckCircle, AlertCircle, XCircle, Trophy, Target, Users } from 'lucide-react';
import axios from 'axios';

const TeamPointsManagement = () => {
  const [teams, setTeams] = useState([]);
  const [teamPoints, setTeamPoints] = useState([]);
  const [afterCount, setAfterCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/team');
      const activeTeams = response.data.teams?.filter(team => team.isActive && !team.isDeleted) || [];
      setTeams(activeTeams);
      
      // Initialize team points array
      const initialPoints = activeTeams.map(team => ({
        team,
        point: 0
      }));
      setTeamPoints(initialPoints);
    } catch (error) {
      console.error('Error fetching teams:', error);
      showToast('Failed to fetch teams', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing team points
  const fetchTeamPoints = async () => {
    try {
      const response = await axios.get('/api/teampoint');
      
      if (response.data.success && response.data.data) {
        const { sortedResults, afterCount: existingAfterCount } = response.data.data;
        setAfterCount(existingAfterCount || '');
        
        // Update team points with existing data
        if (sortedResults && sortedResults.length > 0) {
          const updatedPoints = teams.map(team => {
            const existingPoint = sortedResults.find(result => 
              result.team._id === team._id
            );
            return {
              team,
              point: existingPoint ? existingPoint.point : 0
            };
          });
          setTeamPoints(updatedPoints);
        }
      }
    } catch (error) {
      console.error('Error fetching team points:', error);
      // Don't show error toast for initial fetch if no data exists
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (teams.length > 0) {
      fetchTeamPoints();
    }
  }, [teams]);

  // Update point for a specific team
  const updateTeamPoint = (teamIndex, newPoint) => {
    const updatedPoints = [...teamPoints];
    updatedPoints[teamIndex].point = Number(newPoint) || 0;
    setTeamPoints(updatedPoints);
  };

  // Save team points
  const handleSave = async () => {
    if (!afterCount.trim()) {
      showToast('Please enter after count', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post('/api/teampoint', {
        formData: teamPoints,
        afterCount: Number(afterCount)
      });

      if (response.data.success) {
        showToast('Team points saved successfully', 'success');
        await fetchTeamPoints(); // Refresh data
      } else {
        showToast(response.data.message || 'Failed to save team points', 'error');
      }
    } catch (error) {
      console.error('Error saving team points:', error);
      showToast('Failed to save team points', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Reset all points
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all points to 0?')) {
      const resetPoints = teamPoints.map(tp => ({ ...tp, point: 0 }));
      setTeamPoints(resetPoints);
      setAfterCount('');
      showToast('Points reset successfully', 'info');
    }
  };

  // Calculate total points
  const totalPoints = teamPoints.reduce((sum, tp) => sum + tp.point, 0);

  // Get sorted teams for ranking display
  const sortedTeams = [...teamPoints].sort((a, b) => b.point - a.point);

  return (
    <div className="max-w-6xl mx-auto p-6">
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="text-blue-600" size={28} />
                Team Points Management
              </h1>
              <p className="text-gray-600 mt-1">Assign and manage points for each team</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={saving}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <X size={20} />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Points'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Total Teams</p>
                  <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <Trophy className="text-green-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <Target className="text-purple-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">After Count</p>
                  <input
                    type="number"
                    value={afterCount}
                    onChange={(e) => setAfterCount(e.target.value)}
                    placeholder="Enter count"
                    className="text-lg font-bold border-none outline-none bg-transparent w-full"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading teams...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No active teams found.</p>
              <p>Please add some teams first to manage points.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Points Entry Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Points</h2>
                <div className="space-y-4">
                  {teamPoints.map((teamPoint, index) => (
                    <div key={teamPoint.team._id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{teamPoint.team.teamName}</h3>
                          <p className="text-sm text-gray-600">Team ID: {teamPoint.team._id.slice(-6)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium text-gray-700">Points:</label>
                          <input
                            type="number"
                            value={teamPoint.point}
                            onChange={(e) => updateTeamPoint(index, e.target.value)}
                            className="w-20 border border-gray-300 rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Rankings Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="text-yellow-500" size={20} />
                  Live Rankings
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="space-y-3">
                    {sortedTeams.map((teamPoint, index) => (
                      <div key={teamPoint.team._id} className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 0 ? 'bg-yellow-100 border border-yellow-300' :
                        index === 1 ? 'bg-gray-100 border border-gray-300' :
                        index === 2 ? 'bg-orange-100 border border-orange-300' :
                        'bg-white border border-gray-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-500 text-white' :
                            index === 2 ? 'bg-orange-500 text-white' :
                            'bg-gray-300 text-gray-700'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{teamPoint.team.teamName}</p>
                            <p className="text-sm text-gray-600">Team</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{teamPoint.point}</p>
                          <p className="text-sm text-gray-600">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPointsManagement;