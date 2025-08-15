'use client';
import React, { useState, useEffect } from "react";
import { Clock, AlertCircle, Trophy, Search, Award, Users, Calendar, TrendingUp } from 'lucide-react';
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

function ResultHome() {
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

  const getPrizeGradient = (index) => {
    switch (index) {
      case 0: return "from-yellow-400 to-yellow-600";
      case 1: return "from-gray-300 to-gray-500";
      case 2: return "from-amber-600 to-amber-800";
      default: return "from-yellow-400 to-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <style jsx>{`
        .bg-primary { background-color: #1e3a5f; }
        .text-primary { color: #1e3a5f; }
        .bg-secondary { background-color: #f8fafc; }
        .poppins-bold { font-weight: 700; }
      `}</style>
  
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-purple-900 to-primary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative w-full text-center pt-12 pb-16">
          <div className="animate-pulse">
            <Trophy className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
          </div>
          <h2 className="py-4 text-white text-4xl lg:text-5xl font-bold">Results</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto px-4">
            Discover winners and celebrate achievements
          </p>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/20 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-blue-300/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-purple-300/20 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Enhanced Selection Section */}
      <div className="relative -mt-8 z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center text-lg font-semibold text-primary">
                  <Search className="h-5 w-5 mr-2" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  disabled={categoriesLoading}
                  className="w-full p-4 text-white bg-primary rounded-xl text-lg font-medium border-0 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
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
              
              <div className="space-y-4">
                <label className="flex items-center text-lg font-semibold text-primary">
                  <Award className="h-5 w-5 mr-2" />
                  Item
                </label>
                <select
                  value={selectedItem}
                  onChange={handleItemData}
                  disabled={!category || itemsLoading}
                  className="w-full p-4 text-white bg-primary rounded-xl text-lg font-medium border-0 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
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

      {/* Enhanced Empty State - No selections made */}
      {!category && !selectedItem && !loading && (
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">100+</h3>
                <p className="text-gray-600">Participants</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">25+</h3>
                <p className="text-gray-600">Events</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">100+</h3>
                <p className="text-gray-600">Winners</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 text-center text-white shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                <h2 className="text-3xl font-bold mb-4">Ready to View Results?</h2>
                <p className="text-xl mb-6 opacity-90">
                  Select a category and event above to discover the latest competition results and celebrate our winners!
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Live Updates</span>
                  </div>
                  <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Real-time Results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Selected but No Item */}
      {category && !selectedItem && !loading && (
        <div className="py-16">
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-blue-100">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Great Choice!</h3>
              <p className="text-gray-600 text-lg mb-6">
                You've selected a category. Now choose a specific event to view the results.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-blue-100 rounded-full text-blue-800 font-semibold">
                <Award className="h-5 w-5 mr-2" />
                Select an event above
              </div>
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
                We're still processing the results for <strong>{toastData.category} {toastData.item}</strong>.
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

export default ResultHome;


// 'use client';
// import  { useState, useEffect } from "react";
// import { Clock, AlertCircle, Trophy } from 'lucide-react';
// import ImageDownlad from './ImageDownload.jsx';

// // Toast utility
// const toast = {
//   loading: (message) => console.log('Loading:', message),
//   dismiss: () => console.log('Toast dismissed'),
//   success: (message) => console.log('Success:', message),
//   error: (message) => console.log('Error:', message),
//   default: (message) => console.log('Info:', message)
// };

// // API functions using Next.js API routes
// const getCategory = async () => {
//   try {
//     const response = await fetch('/api/category');
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// const getItem = async (categoryId) => {
//   try {
//     const response = await fetch(`/api/items?categoryId=${categoryId}`);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Updated function to fetch by category name and item name
// const getDataServer = async (categoryName, itemName) => {
//   try {
//     const response = await fetch(`/api/result?category=${encodeURIComponent(categoryName)}&item=${encodeURIComponent(itemName)}`);
//     console.log('Results response status:', response.status);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     console.log('Results response data:', data);
//     return data;
//   } catch (error) {
//     console.error('Error fetching results:', error);
//     throw error;
//   }
// };

// const getResultPosters = async () => {
//   try {
//     const response = await fetch('/api/result-poster');
//     console.log('Posters response status:', response.status);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     console.log('Posters response data:', data);
//     return data;
//   } catch (error) {
//     console.error('Error fetching poster images:', error);
//     throw error;
//   }
// };

// function ResultHome() {
//   const [category, setCategory] = useState("");
//   const [toastData, setToastData] = useState({});
//   const [selectedItem, setSelectedItem] = useState("");
//   const [items, setItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [results, setResults] = useState(null);
//   const [images, setImages] = useState([null, null, null]);
//   const [color, setColor] = useState(['text-white', 'text-white', 'text-white']);
//   const [loading, setLoading] = useState(false);
//   const [itemsLoading, setItemsLoading] = useState(false);
//   const [categoriesLoading, setCategoriesLoading] = useState(false);

//   // Debug log for categories state
//   useEffect(() => {
//     console.log('Categories state updated:', categories);
//   }, [categories]);

//   // Fetch categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setCategoriesLoading(true);
//       try {
//         const response = await getCategory();    
//         if (response && response.categories) {
//           const categoriesData = response.categories || [];
//           setCategories(categoriesData);
//         } else {
//           toast.error('Failed to fetch categories');
//           setCategories([]);
//         }
//       } catch (error) {
//         toast.error('Failed to fetch categories');
//         setCategories([]);
//       } finally {
//         setCategoriesLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch poster images on component mount
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await getResultPosters();
//         if (response.success) {
//           const imgData = response.data;
//           setImages([
//             imgData.poster1?.poster || null,
//             imgData.poster2?.poster || null,
//             imgData.poster3?.poster || null,
//           ]);
//           setColor([
//             `text-${imgData.poster1?.color || 'white'}`,
//             `text-${imgData.poster2?.color || 'white'}`,
//             `text-${imgData.poster3?.color || 'white'}`,
//           ]);
//         }
//       } catch (error) {
//         setImages([null, null, null]);
//         setColor(['text-white', 'text-white', 'text-white']);
//       }
//     };
//     fetchImages();
//   }, []);

//   const handleCategoryChange = async (e) => {
//     const selectedId = e.target.value;
//     setCategory(selectedId);
//     setSelectedItem("");
//     setResults(null);
    
//     if (!selectedId) {
//       setItems([]);
//       return;
//     }

//     setItemsLoading(true);
//     try {
//       const response = await getItem(selectedId);
//       console.log('Items fetch response:', response);
//       if (response && response.items) {
//         const allItems = response.items || [];
//         const filteredItems = allItems.filter(item => 
//           item.categoryId && item.categoryId._id === selectedId
//         );
//         setItems(filteredItems);
//       } else {
//         toast.error('Failed to fetch items');
//         setItems([]);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch items');
//       setItems([]);
//     } finally {
//       setItemsLoading(false);
//     }
//   };

//   const handleItemData = async (e) => {
//     const itemValue = e.target.value;
//     console.log('Item selected:', itemValue);
//     setSelectedItem(itemValue);
    
//     if (!itemValue || !category) {
//       return;
//     }
//     const selectedCategory = categories.find(cat => cat._id === category);
//     const selectedItemObj = items.find(item => item._id === itemValue);
    
//     if (!selectedCategory || !selectedItemObj) {
//       toast.error('Category or item not found');
//       return;
//     }

//     const categoryName = selectedCategory.categoryName;
//     const itemName = selectedItemObj.itemName;

//     setLoading(true);
//     try {
//       toast.loading("Fetching results...");
//       // Use category name and item name instead of IDs
//       const response = await getDataServer(categoryName, itemName);
      
//       setToastData({
//         category: categoryName,
//         item: itemName,
//       });

//       setResults(response.data || response);
//       toast.dismiss();

//       if (response.success && response.data?.result && Array.isArray(response.data.result) && response.data.result.length > 0) {
//         toast.success(`Results found for ${categoryName} ${itemName}`);
//       } else if (response.results && Array.isArray(response.results) && response.results.length > 0) {
//         // Handle case where results are directly in response.results
//         setResults({ result: response.results });
//         toast.success(`Results found for ${categoryName} ${itemName}`);
//       } else {
//         toast(`No results published yet for ${categoryName} ${itemName}`);
//       }
//     } catch (error) {
//       toast.dismiss();
//       toast.error("Failed to fetch results. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPrizeGradient = (index) => {
//     switch (index) {
//       case 0: return "from-yellow-400 to-yellow-600";
//       case 1: return "from-gray-300 to-gray-500";
//       case 2: return "from-amber-600 to-amber-800";
//       default: return "from-yellow-400 to-yellow-600";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <style jsx>{`
//         .bg-primary { background-color: #1e3a5f; }
//         .text-primary { color: #1e3a5f; }
//         .bg-secondary { background-color: #f8fafc; }
//         .poppins-bold { font-weight: 700; }
//       `}</style>
  
      
//       {/* Header Section */}
//       <div className="w-full text-center pt-10 bg-secondary shadow-sm">
//         <h2 className="py-10 text-primary text-4xl lg:text-5xl font-bold">Results</h2>
//       </div>

//       {/* Selection Section */}
//       <div className="bg-secondary py-4 md:py-6 shadow-sm">
//         <div className="max-w-4xl mx-auto px-6">
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="space-y-3">
//               <label className="text-lg font-semibold text-primary block">Category</label>
//               <select
//                 value={category}
//                 onChange={handleCategoryChange}
//                 disabled={categoriesLoading}
//                 className="w-full p-4 text-white bg-primary rounded-lg text-lg font-medium border-0 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50"
//               >
//                 <option value="">
//                   {categoriesLoading ? "Loading categories..." : "Select Category"}
//                 </option>
//                 {categories && categories.length > 0 && categories.map((cat) => (
//                   <option key={cat._id} value={cat._id}>
//                     {cat.categoryName}
//                   </option>
//                 ))}
//               </select>
//               {categories.length === 0 && !categoriesLoading && (
//                 <p className="text-red-600 text-sm">No categories available</p>
//               )}
//             </div>
//             <div className="space-y-3">
//               <label className="text-lg font-semibold text-primary block">Item</label>
//               <select
//                 value={selectedItem}
//                 onChange={handleItemData}
//                 disabled={!category || itemsLoading}
//                 className="w-full p-4 text-white bg-primary rounded-lg text-lg font-medium border-0 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50"
//               >
//                 <option value="">
//                   {itemsLoading ? "Loading items..." : "Select Item"}
//                 </option>
//                 {items && items.length > 0 && items.map((item) => (
//                   <option key={item._id} value={item._id}>
//                     {item.itemName}
//                   </option>
//                 ))}
//               </select>
//               {items.length === 0 && category && !itemsLoading && (
//                 <p className="text-red-600 text-sm">No items available for this category</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="py-12 bg-secondary">
//           <div className="text-center">
//             <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
//               <span className="text-primary font-semibold">Loading results...</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Results Section - Updated to handle the new data structure */}
//       {results?.result && Array.isArray(results.result) && results.result.length > 0 && !loading && (
//         <div className="py-8 bg-gray-50">
//           <div className="max-w-6xl mx-auto px-6">
//             {/* Event Info */}
//             <div className="text-center mb-6">
//               <div className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full text-lg font-semibold mb-4">
//                 <Trophy className="h-5 w-5 mr-2" />
//                 {toastData.category} - {toastData.item}
//               </div>
//             </div>

//             {/* Summary Card */}
//             <div className="bg-secondary rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
//               <div className="grid md:grid-cols-3 gap-6">
//                 {[0, 1, 2].map((index) => {
//                   const winner = results.result[0]; // Get the first (and likely only) result object
//                   if (!winner) return null;

//                   // Use the new field names - firstPrize, firstTeam, secondPrize, secondTeam, thirdPrize, thirdTeam
//                   const prizeNames = [winner.firstPrize, winner.secondPrize, winner.thirdPrize];
//                   const teams = [winner.firstTeam, winner.secondTeam, winner.thirdTeam];
//                   const positions = ["First Place", "Second Place", "Third Place"];

//                   if (!prizeNames[index]) return null;

//                   return (
//                     <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
//                       <div className="flex-shrink-0 mr-4">
//                         <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPrizeGradient(index)} flex items-center justify-center text-white font-bold text-lg`}>
//                           {index + 1}
//                         </div>
//                       </div>
//                       <div>
//                         <div className="font-semibold text-primary">{positions[index]}</div>
//                         <div className="text-lg font-bold text-gray-900">{prizeNames[index]}</div>
//                         <div className="text-sm text-gray-600">{teams[index]}</div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Poster Section */}
//             <div className="mt-12">
//               <div className={`grid grid-cols-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-20 lg:py-12 lg:grid-cols-2 xl:grid-cols-3 bg-slate-100`}>
//                 {[0, 1, 2].map((index) => (
//                   <ImageDownlad
//                     key={index}
//                     results={results}
//                     category={toastData.category}
//                     item={toastData.item}
//                     image={images[index]}
//                     color={color[index]}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Handle case where results are directly in response.results with new field names */}
//       {results?.results && Array.isArray(results.results) && results.results.length > 0 && !results.result && !loading && (
//         <div className="py-8 bg-gray-50">
//           <div className="max-w-6xl mx-auto px-6">
//             <div className="text-center mb-6">
//               <div className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full text-lg font-semibold mb-4">
//                 <Trophy className="h-5 w-5 mr-2" />
//                 {toastData.category} - {toastData.item}
//               </div>
//             </div>

//             <div className="grid gap-4">
//               {results.results.map((result, idx) => (
//                 <div key={result._id || idx} className="bg-white rounded-lg shadow p-6">
//                   <div className="grid md:grid-cols-3 gap-4">
//                     <div className="text-center">
//                       <div className="text-lg font-bold text-yellow-600">1st Place</div>
//                       <div className="text-xl font-semibold">{result.firstPrize}</div>
//                       <div className="text-gray-600">{result.firstTeam}</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-lg font-bold text-gray-500">2nd Place</div>
//                       <div className="text-xl font-semibold">{result.secondPrize}</div>
//                       <div className="text-gray-600">{result.secondTeam}</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-lg font-bold text-amber-600">3rd Place</div>
//                       <div className="text-xl font-semibold">{result.thirdPrize}</div>
//                       <div className="text-gray-600">{result.thirdTeam}</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* No Results State */}
//       {results && (!results.result || !Array.isArray(results.result) || results.result.length === 0) && (!results.results || !Array.isArray(results.results) || results.results.length === 0) && !loading && (
//         <div className="py-12 bg-secondary">
//           <div className="max-w-2xl mx-auto px-6">
//             <div className="bg-white border border-orange-200 rounded-2xl p-8 shadow-lg text-center">
//               <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <AlertCircle className="h-8 w-8 text-orange-600" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-4">Results Not Available</h3>
//               <p className="text-gray-700 mb-6 text-lg">
//                 We're still processing the results for <strong>{toastData.category} {toastData.item}</strong>.
//               </p>
//               <div className="inline-flex items-center px-6 py-3 bg-orange-100 rounded-full text-orange-800 font-semibold">
//                 <Clock className="h-5 w-5 mr-2" />
//                 Please check back later
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ResultHome;
