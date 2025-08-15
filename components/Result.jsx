'use client';
import React, { useState, useEffect, useRef } from "react";
import { Clock, AlertCircle, Trophy, Medal, Award, Download } from 'lucide-react';
import CertificateTemplate from './CertificateTemplate';
import ImageDownlad from './ImageDownload.jsx';

// Toast utility
const toast = {
  loading: (message) => console.log('Loading:', message),
  dismiss: () => console.log('Toast dismissed'),
  success: (message) => console.log('Success:', message),
  error: (message) => console.log('Error:', message),
  default: (message) => console.log('Info:', message)
};

// API functions using Next.js API routes
const getCategory = async () => {
  try {
    const response = await fetch('/api/category');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const getItem = async (categoryId) => {
  try {
    const response = await fetch(`/api/items?categoryId=${categoryId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Updated function to fetch by category name and item name
const getDataServer = async (categoryName, itemName) => {
  try {
    const response = await fetch(`/api/result?category=${encodeURIComponent(categoryName)}&item=${encodeURIComponent(itemName)}`);
    console.log('Results response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Results response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};

const getResultPosters = async () => {
  try {
    const response = await fetch('/api/result-poster');
    console.log('Posters response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Posters response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching poster images:', error);
    throw error;
  }
};

function ResultPage() {
  const [category, setCategory] = useState("");
  const [toastData, setToastData] = useState({});
  const [selectedItem, setSelectedItem] = useState("");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState(null);
  const [images, setImages] = useState([null, null, null]);
  const [color, setColor] = useState(['text-white', 'text-white', 'text-white']);
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const certRefs = [useRef(), useRef(), useRef()];

  // Debug log for categories state
  useEffect(() => {
    console.log('Categories state updated:', categories);
  }, [categories]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await getCategory();    
        if (response && response.categories) {
          const categoriesData = response.categories || [];
          setCategories(categoriesData);
        } else {
          toast.error('Failed to fetch categories');
          setCategories([]);
        }
      } catch (error) {
        toast.error('Failed to fetch categories');
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch poster images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getResultPosters();
        if (response.success) {
          const imgData = response.data;
          setImages([
            imgData.poster1?.poster || null,
            imgData.poster2?.poster || null,
            imgData.poster3?.poster || null,
          ]);
          setColor([
            `text-${imgData.poster1?.color || 'white'}`,
            `text-${imgData.poster2?.color || 'white'}`,
            `text-${imgData.poster3?.color || 'white'}`,
          ]);
        }
      } catch (error) {
        setImages([null, null, null]);
        setColor(['text-white', 'text-white', 'text-white']);
      }
    };
    fetchImages();
  }, []);

  const handleCategoryChange = async (e) => {
    const selectedId = e.target.value;
    setCategory(selectedId);
    setSelectedItem("");
    setResults(null);
    
    if (!selectedId) {
      setItems([]);
      return;
    }

    setItemsLoading(true);
    try {
      const response = await getItem(selectedId);
      console.log('Items fetch response:', response);
      if (response && response.items) {
        const allItems = response.items || [];
        const filteredItems = allItems.filter(item => 
          item.categoryId && item.categoryId._id === selectedId
        );
        setItems(filteredItems);
      } else {
        toast.error('Failed to fetch items');
        setItems([]);
      }
    } catch (error) {
      toast.error('Failed to fetch items');
      setItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleItemData = async (e) => {
    const itemValue = e.target.value;
    console.log('Item selected:', itemValue);
    setSelectedItem(itemValue);
    
    if (!itemValue || !category) {
      return;
    }
    const selectedCategory = categories.find(cat => cat._id === category);
    const selectedItemObj = items.find(item => item._id === itemValue);
    
    if (!selectedCategory || !selectedItemObj) {
      toast.error('Category or item not found');
      return;
    }

    const categoryName = selectedCategory.categoryName;
    const itemName = selectedItemObj.itemName;

    setLoading(true);
    try {
      toast.loading("Fetching results...");
      // Use category name and item name instead of IDs
      const response = await getDataServer(categoryName, itemName);
      
      setToastData({
        category: categoryName,
        item: itemName,
      });

      setResults(response.data || response);
      toast.dismiss();

      if (response.success && response.data?.result && Array.isArray(response.data.result) && response.data.result.length > 0) {
        toast.success(`Results found for ${categoryName} ${itemName}`);
      } else if (response.results && Array.isArray(response.results) && response.results.length > 0) {
        // Handle case where results are directly in response.results
        setResults({ result: response.results });
        toast.success(`Results found for ${categoryName} ${itemName}`);
      } else {
        toast(`No results published yet for ${categoryName} ${itemName}`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (index, winnerName, prize, category, item, team) => {
    try {
      const element = certRefs[index].current;
      if (!element) {
        toast.error("Certificate template not found");
        return;
      }
      const html2canvas = (await import('html2canvas')).default;    
      toast.loading("Generating certificate...");
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `${winnerName}_${prize}_Certificate.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.dismiss();
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.dismiss();
      toast.error("Failed to download certificate. Please try again.");
    }
  };

  const getPrizeIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 1: return <Medal className="h-8 w-8 text-gray-400" />;
      case 2: return <Award className="h-8 w-8 text-amber-600" />;
      default: return <Trophy className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getPrizeGradient = (index) => {
    switch (index) {
      case 0: return "from-yellow-400 to-yellow-600";
      case 1: return "from-gray-300 to-gray-500";
      case 2: return "from-amber-600 to-amber-800";
      default: return "from-yellow-400 to-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .bg-primary { background-color: #1e3a5f; }
        .text-primary { color: #1e3a5f; }
        .bg-secondary { background-color: #f8fafc; }
        .poppins-bold { font-weight: 700; }
      `}</style>
  
      
      {/* Header Section */}
      <div className="w-full text-center pt-10 bg-secondary shadow-sm">
        <h2 className="py-10 text-primary text-4xl lg:text-5xl font-bold">Results</h2>
      </div>

      {/* Selection Section */}
      <div className="bg-secondary py-4 md:py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-lg font-semibold text-primary block">Category</label>
              <select
                value={category}
                onChange={handleCategoryChange}
                disabled={categoriesLoading}
                className="w-full p-4 text-white bg-primary rounded-lg text-lg font-medium border-0 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50"
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "Select Category"}
                </option>
                {categories && categories.length > 0 && categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              {categories.length === 0 && !categoriesLoading && (
                <p className="text-red-600 text-sm">No categories available</p>
              )}
            </div>
            <div className="space-y-3">
              <label className="text-lg font-semibold text-primary block">Item</label>
              <select
                value={selectedItem}
                onChange={handleItemData}
                disabled={!category || itemsLoading}
                className="w-full p-4 text-white bg-primary rounded-lg text-lg font-medium border-0 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50"
              >
                <option value="">
                  {itemsLoading ? "Loading items..." : "Select Item"}
                </option>
                {items && items.length > 0 && items.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.itemName}
                  </option>
                ))}
              </select>
              {items.length === 0 && category && !itemsLoading && (
                <p className="text-red-600 text-sm">No items available for this category</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 bg-secondary">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <span className="text-primary font-semibold">Loading results...</span>
            </div>
          </div>
        </div>
      )}

      {/* Results Section - Updated to handle the new data structure */}
      {results?.result && Array.isArray(results.result) && results.result.length > 0 && !loading && (
        <div className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            {/* Event Info */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full text-lg font-semibold mb-4">
                <Trophy className="h-5 w-5 mr-2" />
                {toastData.category} - {toastData.item}
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-secondary rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
              <div className="grid md:grid-cols-3 gap-6">
                {[0, 1, 2].map((index) => {
                  const winner = results.result[0]; // Get the first (and likely only) result object
                  if (!winner) return null;

                  // Use the new field names - firstPrize, firstTeam, secondPrize, secondTeam, thirdPrize, thirdTeam
                  const prizeNames = [winner.firstPrize, winner.secondPrize, winner.thirdPrize];
                  const teams = [winner.firstTeam, winner.secondTeam, winner.thirdTeam];
                  const positions = ["First Place", "Second Place", "Third Place"];

                  if (!prizeNames[index]) return null;

                  return (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0 mr-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPrizeGradient(index)} flex items-center justify-center text-white font-bold text-lg`}>
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-primary">{positions[index]}</div>
                        <div className="text-lg font-bold text-gray-900">{prizeNames[index]}</div>
                        <div className="text-sm text-gray-600">{teams[index]}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Poster Section */}
            <div className="mt-12">
              <div className={`grid grid-cols-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-20 lg:py-12 lg:grid-cols-2 xl:grid-cols-3 bg-slate-100`}>
                {[0, 1, 2].map((index) => (
                  <ImageDownlad
                    key={index}
                    results={results}
                    category={toastData.category}
                    item={toastData.item}
                    image={images[index]}
                    color={color[index]}
                  />
                ))}
              </div>
            </div>

            {/* Winners Display with Poster Images and Certificate */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {[0, 1, 2].map((index) => {
                const winner = results.result[0];
                if (!winner) return null;

                const prizes = ["First", "Second", "Third"];
                // Use the new field names
                const prizeNames = [winner.firstPrize, winner.secondPrize, winner.thirdPrize];
                const teams = [winner.firstTeam, winner.secondTeam, winner.thirdTeam];
                const positions = ["1st", "2nd", "3rd"];

                if (!prizeNames[index]) return null;

                return (
                  <div key={index} className={`relative ${index === 0 ? 'lg:order-2 lg:-mt-8' : index === 1 ? 'lg:order-1' : 'lg:order-3'}`}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                      {/* Poster Image Background */}
                      <div 
                        className={`bg-gradient-to-r ${getPrizeGradient(index)} p-4 text-center relative overflow-hidden`}
                        style={{
                          backgroundImage: images[index] ? `url(${images[index]})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundBlendMode: 'overlay'
                        }}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-center mb-2">
                            {getPrizeIcon(index)}
                          </div>
                          <div className={`${color[index]} poppins-bold text-xl drop-shadow-lg`}>
                            {positions[index]} Place
                          </div>
                        </div>
                        {images[index] && (
                          <div className="absolute inset-0 bg-black/20"></div>
                        )}
                      </div>

                      <div className="p-6 text-center">
                        <h3 className="text-2xl poppins-bold text-primary mb-2">
                          {prizeNames[index]}
                        </h3>
                        <p className="text-gray-600 text-lg mb-4">{teams[index]}</p>

                        <button
                          onClick={() => handleDownloadCertificate(
                            index,
                            prizeNames[index],
                            prizes[index],
                            toastData.category,
                            toastData.item,
                            teams[index]
                          )}
                          className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download Certificate
                        </button>
                      </div>
                    </div>

                    {/* Hidden Certificate Template */}
                    <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                      <CertificateTemplate
                        ref={certRefs[index]}
                        winnerName={prizeNames[index]}
                        prize={prizes[index]}
                        category={toastData.category}
                        item={toastData.item}
                        team={teams[index]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Handle case where results are directly in response.results with new field names */}
      {results?.results && Array.isArray(results.results) && results.results.length > 0 && !results.result && !loading && (
        <div className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full text-lg font-semibold mb-4">
                <Trophy className="h-5 w-5 mr-2" />
                {toastData.category} - {toastData.item}
              </div>
            </div>

            <div className="grid gap-4">
              {results.results.map((result, idx) => (
                <div key={result._id || idx} className="bg-white rounded-lg shadow p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">1st Place</div>
                      <div className="text-xl font-semibold">{result.firstPrize}</div>
                      <div className="text-gray-600">{result.firstTeam}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-500">2nd Place</div>
                      <div className="text-xl font-semibold">{result.secondPrize}</div>
                      <div className="text-gray-600">{result.secondTeam}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-amber-600">3rd Place</div>
                      <div className="text-xl font-semibold">{result.thirdPrize}</div>
                      <div className="text-gray-600">{result.thirdTeam}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results State */}
      {results && (!results.result || !Array.isArray(results.result) || results.result.length === 0) && (!results.results || !Array.isArray(results.results) || results.results.length === 0) && !loading && (
        <div className="py-12 bg-secondary">
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-white border border-orange-200 rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Results Not Available</h3>
              <p className="text-gray-700 mb-6 text-lg">
                We&apos;re still processing the results for <strong>{toastData.category} {toastData.item}</strong>.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-orange-100 rounded-full text-orange-800 font-semibold">
                <Clock className="h-5 w-5 mr-2" />
                Please check back later
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultPage;
