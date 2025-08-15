'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, CheckCircle, AlertCircle, XCircle, Upload, Calendar, Clock, FileImage } from 'lucide-react';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch events
  const fetchEvents = async (page = 1) => {
    try {
      const response = await fetch(`/api/events?page=${page}&limit=10`);
      const data = await response.json();
      setEvents(data.events || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast('Failed to fetch events', 'error');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Add event
  const handleAdd = async () => {
    if (!formData.title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }
    if (!formData.eventDate) {
      showToast('Please select an event date', 'error');
      return;
    }
    if (!formData.eventTime) {
      showToast('Please select an event time', 'error');
      return;
    }
    if (!selectedImage) {
      showToast('Please select an image', 'error');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedImage);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('eventDate', formData.eventDate);
      formDataToSend.append('eventTime', formData.eventTime);
      formDataToSend.append('isActive', formData.isActive);

      const response = await fetch('/api/events', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchEvents(currentPage);
        setFormData({ title: '', description: '', eventDate: '', eventTime: '', isActive: true });
        setSelectedImage(null);
        setPreviewUrl('');
        setShowAddForm(false);
        showToast('Event added successfully', 'success');
      } else {
        throw new Error('Failed to add event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      showToast('Failed to add event', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Edit event
  const handleEdit = async (id) => {
    if (!formData.title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }
    if (!formData.eventDate) {
      showToast('Please select an event date', 'error');
      return;
    }
    if (!formData.eventTime) {
      showToast('Please select an event time', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...formData,
        }),
      });

      if (response.ok) {
        await fetchEvents(currentPage);
        setEditingId(null);
        setFormData({ title: '', description: '', eventDate: '', eventTime: '', isActive: true });
        showToast('Event updated successfully', 'success');
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      showToast('Failed to update event', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    setLoading(true);
    try {
      const response = await fetch('/api/events', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchEvents(currentPage);
        showToast('Event deleted successfully', 'success');
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Failed to delete event', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEdit = (event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description || '',
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
      eventTime: event.eventTime || '',
      isActive: event.isActive
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', eventDate: '', eventTime: '', isActive: true });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchEvents(page);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600 text-white' :
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
            <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Event
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Time *
                    </label>
                    <input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Image *
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setPreviewUrl('');
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FileImage size={48} className="mx-auto text-gray-400" />
                        <div>
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={uploading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Upload size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Add Event
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events found. Add your first event!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <div key={event._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${event.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {event.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    {editingId === event._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={formData.eventDate}
                            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="time"
                            value={formData.eventTime}
                            onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(event._id)}
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                          >
                            <Save size={14} className="inline mr-1" />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-sm"
                          >
                            <X size={14} className="inline mr-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>{formatDate(event.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>{formatTime(event.eventTime)}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(event)}
                            className="flex-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Edit size={14} className="inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            disabled={loading}
                            className="flex-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                          >
                            <Trash2 size={14} className="inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-md ${currentPage === page
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                {currentPage < pagination.pages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventManagement;