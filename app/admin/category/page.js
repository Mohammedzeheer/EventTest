'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/category');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to fetch categories', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleAdd = async () => {
    if (!formData.categoryName.trim()) {
      showToast('Please enter a category name', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/category', formData);
       if (response.status === 200) {
        showToast('Category added successfully', 'success');
      }
      
      if (response.status === 202) {
        await fetchCategories();
        setFormData({ categoryName: '', isActive: true });
        setShowAddForm(false);
        showToast('Category added successfully', 'success');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      showToast('Failed to add category', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Edit category
  const handleEdit = async (id) => {
    if (!formData.categoryName.trim()) {
      showToast('Please enter a category name', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put('/api/category', {
        id,
        ...formData,
      });

      if (response.status === 200) {
        await fetchCategories();
        setEditingId(null);
        setFormData({ categoryName: '', isActive: true });
        showToast('Category updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      showToast('Failed to update category', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    try {
      const response = await axios.delete('/api/category', {
        data: { id }
      });

      if (response.status === 200) {
        await fetchCategories();
        showToast('Category deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Failed to delete category', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      categoryName: category.categoryName,
      isActive: category.isActive
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ categoryName: '', isActive: true });
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
            <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
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

        {/* Categories List */}
        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No categories found. Add your first category!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created At</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {editingId === category._id ? (
                          <input
                            type="text"
                            value={formData.categoryName}
                            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-gray-900">{category.categoryName}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingId === category._id ? (
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
                            category.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {editingId === category._id ? (
                            <>
                              <button
                                onClick={() => handleEdit(category._id)}
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
                                onClick={() => startEdit(category)}
                                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(category._id)}
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

export default CategoryManagement;