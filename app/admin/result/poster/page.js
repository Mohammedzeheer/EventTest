'use client';
import React, { useState, useEffect } from 'react';
import { Upload, Sun, Moon, Save, Loader2, FileImage, Trash2, Award, Star } from 'lucide-react';

const ResultPosterManager = () => {
  const [posterData, setPosterData] = useState({
    poster1: { poster: 'defaultPoster.jpg', color: 'white', public_id: 'default1' },
    poster2: { poster: 'defaultPoster.jpg', color: 'white', public_id: 'default2' },
    poster3: { poster: 'defaultPoster.jpg', color: 'white', public_id: 'default3' }
  });
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch existing data on component mount
  useEffect(() => {
    fetchPosterData();
  }, []);

  const fetchPosterData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/result-poster');
      const result = await response.json();
      if (result.success) {
        setPosterData(result.data);
      }
    } catch (error) {
      showMessage('Failed to fetch poster backgrounds', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleFileSelect = (posterSlot, file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFiles(prev => ({
        ...prev,
        [posterSlot]: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPosterData(prev => ({
          ...prev,
          [posterSlot]: {
            ...prev[posterSlot],
            poster: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    } else {
      showMessage('Please select a valid image file for the poster background', 'error');
    }
  };

  const handleColorChange = (posterSlot, color) => {
    setPosterData(prev => ({
      ...prev,
      [posterSlot]: {
        ...prev[posterSlot],
        color
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Add files and colors to formData
      Object.keys(selectedFiles).forEach(slot => {
        if (selectedFiles[slot]) {
          formData.append(slot, selectedFiles[slot]);
        }
      });
      
      ['poster1', 'poster2', 'poster3'].forEach(slot => {
        formData.append(`color${slot.slice(-1)}`, posterData[slot].color);
      });

      const response = await fetch('/api/result-poster', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setPosterData(result.data);
        setSelectedFiles({});
        showMessage('Result poster backgrounds saved successfully!', 'success');
      } else {
        showMessage(result.message || 'Failed to save poster backgrounds', 'error');
      }
    } catch (error) {
      showMessage('Failed to save poster backgrounds', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (posterSlot) => {
    if (!confirm('Are you sure you want to delete this poster background?')) return;

    try {
      const response = await fetch(`/api/result-poster?slot=${posterSlot}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        setPosterData(result.data);
        setSelectedFiles(prev => {
          const updated = { ...prev };
          delete updated[posterSlot];
          return updated;
        });
        showMessage('Poster background deleted successfully!', 'success');
      } else {
        showMessage(result.message || 'Failed to delete poster background', 'error');
      }
    } catch (error) {
      showMessage('Failed to delete poster background', 'error');
    }
  };

  const PosterCard = ({ posterSlot, posterInfo, index }) => {
    const isDefault = posterInfo.poster === 'defaultPoster.jpg' || posterInfo.poster.includes('defaultPoster');
    const hasNewFile = selectedFiles[posterSlot];
    const posterTypes = ['1st Place', '2nd Place', '3rd Place'];

    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
        {/* Header */}
        <div className={`p-6 text-white relative overflow-hidden bg-gradient-to-br from-gray-400 to-gray-600`}>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              {index === 0 ? <Award size={24} /> : <Star size={24} />}
              <div>
                {/* <h3 className="font-bold text-xl">{posterTypes[index]}</h3> */}
                <p className="text-sm opacity-90">Result Poster Background</p>
              </div>
            </div>
            {!isDefault && (
              <button
                onClick={() => handleDelete(posterSlot)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                title="Delete poster background"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
          {/* Decorative elements */}
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10"></div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5"></div>
        </div>

        {/* Poster Preview */}
        <div className="p-6">
          <div className={`relative w-full h-80 rounded-2xl overflow-hidden mb-6 border-3 transition-all duration-300 ${
            posterInfo.color === 'dark' 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600' 
              : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
          }`} 
          // style={{ aspectRatio: '4/5' }} //INSTA SIZE 
          style={{ aspectRatio: '1/1' }} // SQUARE SIZE
          > 
            {isDefault && !hasNewFile ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileImage size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 font-semibold text-lg">No Background Set</p>
                  <p className="text-gray-400 text-sm mt-1">Upload a poster background</p>
                </div>
              </div>
            ) : (
              <div className="relative h-full">
                <img
                  src={posterInfo.poster}
                  alt={`${posterTypes[index]} Background Preview`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-poster.jpg';
                  }}
                />
                {/* Overlay to show it's a background */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 rounded-lg px-4 py-2">
                    <p className="text-gray-800 font-semibold text-sm">Preview Background</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* File Upload */}
          <label className="block mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(posterSlot, e.target.files[0])}
              className="hidden"
            />
            <div className={`flex items-center justify-center p-5 border-3 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group ${
              index === 0 ? 'border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50' :
              index === 1 ? 'border-gray-300 hover:border-gray-500 hover:bg-gray-50' :
              'border-amber-300 hover:border-amber-500 hover:bg-amber-50'
            }`}>
              <Upload className={`mr-3 group-hover:scale-110 transition-transform duration-200 ${
                index === 0 ? 'text-yellow-500' :
                index === 1 ? 'text-gray-500' :
                'text-amber-500'
              }`} size={28} />
              <div>
                <span className="font-bold text-lg block">
                  {hasNewFile ? 'Change Background' : 'Upload Background'}
                </span>
                <span className="text-sm text-gray-500">
                  Recommended: 1080x1080px (1:1 square ratio)
                </span>
              </div>
            </div>
          </label>

          {/* Theme Color Toggle */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={() => handleColorChange(posterSlot, 'white')}
                className={`flex items-center px-6 py-4 rounded-2xl border-3 transition-all duration-200 flex-1 justify-center font-semibold ${
                  posterInfo.color === 'white'
                    ? 'border-yellow-400 bg-yellow-50 text-yellow-700 shadow-lg'
                    : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 text-gray-600'
                }`}
              >
                <Sun size={20} className="mr-2" />
                <span>White Text</span>
              </button>
              <button
                onClick={() => handleColorChange(posterSlot, 'dark')}
                className={`flex items-center px-6 py-4 rounded-2xl border-3 transition-all duration-200 flex-1 justify-center font-semibold ${
                  posterInfo.color === 'dark'
                    ? 'border-gray-600 bg-gray-800 text-white shadow-lg'
                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Moon size={20} className="mr-2" />
                <span>Dark Text</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-yellow-500" size={64} />
          <p className="text-gray-700 font-semibold text-xl">Loading poster backgrounds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-4 mb-6">
            <Award className="text-yellow-500" size={48} />
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Result Poster Backgrounds
            </h1>
            <Award className="text-yellow-500" size={48} />
          </div>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Design stunning result announcements with custom background images.
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-8 p-6 rounded-2xl border-l-6 shadow-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : 'bg-red-50 border-red-400 text-red-800'
          }`}>
            <p className="font-semibold text-lg">{message.text}</p>
          </div>
        )}

        {/* Poster Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {['poster1', 'poster2', 'poster3'].map((posterSlot, index) => (
            <PosterCard
              key={posterSlot}
              posterSlot={posterSlot}
              posterInfo={posterData[posterSlot]}
              index={index}
            />
          ))}
        </div>

        {/* Save Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleSave}
            disabled={saving || Object.keys(selectedFiles).length === 0}
            className={`inline-flex items-center px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl ${
              saving || Object.keys(selectedFiles).length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700 hover:scale-110 hover:shadow-2xl'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin mr-4" size={28} />
                Updating Backgrounds...
              </>
            ) : (
              <>
                <Save className="mr-4" size={28} />
                Save All Poster Backgrounds
              </>
            )}
          </button>
        </div>

        {/* Info Section */}
        {/* <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Background Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h4 className="font-semibold text-lg mb-2">📏 Dimensions</h4>
              <p>Recommended: 1080x1350px (4:5 poster ratio)<br/>
              Minimum: 800x1000px for quality results</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">📁 File Format</h4>
              <p>Supported: JPG, PNG, WebP<br/>
              Maximum size: 10MB per background</p>
            </div>
          </div>
        </div> */}
        
      </div>
    </div>
  );
};

export default ResultPosterManager;
