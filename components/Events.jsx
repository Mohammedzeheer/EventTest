"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Events() {
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/events?isActive=true');
        const data = await response.json();

        if (data && data.events && data.events.length > 0) {
          setImages(data.events);
        } else if (data && Array.isArray(data) && data.length > 0) {
          setImages(data);
        } else {
          setImages([]);
        }
      } catch (err) {
        setImages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStartIndex((prev) => {
        if (isMobile) {
          return (prev + 1) % images.length;
        } else {
          return (prev + 1) % images.length;
        }
      });
    }, isMobile ? 2000 : 3000);

    return () => clearInterval(interval);
  }, [images.length, isMobile]);

  const getVisibleImages = () => {
    if (images.length === 0) return [];

    if (isMobile) {
      return [images[currentStartIndex]].filter(Boolean);
    } else {
      const visible = [];
      const imagesToShow = Math.min(5, images.length);

      for (let i = 0; i < imagesToShow; i++) {
        const index = (currentStartIndex + i) % images.length;
        visible.push(images[index]);
      }
      return visible;
    }
  };

  const handleDotClick = (index) => {
    setCurrentStartIndex(index);
  };
  const visibleImages = getVisibleImages();


  if (loading) {
    const isShimmerMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    return (
      <div className="w-full py-8 px-4">
        <div className="relative max-w-7xl mx-auto">
          {/* Shimmer Images container */}
          <div className={`gap-4 mb-6 ${isShimmerMobile
              ? "flex justify-center"
              : "flex justify-center"
            }`}>
            {Array.from({ length: isShimmerMobile ? 1 : 5 }).map((_, index) => (
              <div
                key={index}
                className={`${isShimmerMobile ? "w-80 max-w-[90vw]" : "w-48 flex-shrink-0"
                  }`}
              >
                {/* Instagram Portrait Aspect Ratio Container (4:5) */}
                <div
                  className="relative bg-gray-200 rounded-xl overflow-hidden shadow-lg animate-pulse"
                  style={{ aspectRatio: '4/5' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Shimmer Navigation dots */}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    );
  }

  // Show no events state
  if (!loading && images.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="flex justify-center items-center h-64 bg-gray-100 rounded-xl">
          <p className="text-gray-500">No active events found</p>
        </div>
      </div>
    );
  }

  return (
    <div id="events" className="w-full py-8 px-4">
      {/* Main carousel container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Images container */}
        <div className={`gap-4 mb-6 ${isMobile
            ? "flex justify-center"
            : "flex justify-center"
          }`}>
          {visibleImages.map((img, displayIndex) => (
            <div
              key={`${img._id || img.id}-${displayIndex}`}
              className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isMobile ? "w-80 max-w-[90vw]" : "w-48 flex-shrink-0"
                }`}
            >
              {/* Instagram Portrait Aspect Ratio Container (1080:1350 = 4:5) */}
              <div className="relative bg-white rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '4/5' }}>
                <Image
                  src={img.imageUrl || '/placeholder-image.jpg'}
                  alt={img.title || `Event ${displayIndex + 1}`}
                  fill
                  sizes={isMobile ? "90vw" : "192px"}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    console.log('Image failed to load:', img.imageUrl);
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold text-sm mb-1">
                      {img.title || 'Event'}
                    </h3>
                    {(img.date || img.eventDate) && (
                      <p className="text-xs opacity-90">
                        {img.date || new Date(img.eventDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${index === currentStartIndex
                  ? "bg-blue-600 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentStartIndex(prev =>
                prev === 0 ? images.length - 1 : prev - 1
              )}
              className="absolute left-1 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentStartIndex(prev =>
                (prev + 1) % images.length
              )}
              className="absolute right-1 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
              aria-label="Next image"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}


// "use client";
// import { useEffect, useState } from "react";
// import Image from "next/image";

// export default function Events() {
//   const [currentStartIndex, setCurrentStartIndex] = useState(0);
//   const [images, setImages] = useState([]);
//   const [isMobile, setIsMobile] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 640); // sm breakpoint
//     };
    
//     checkIfMobile();
//     window.addEventListener('resize', checkIfMobile);
//     return () => window.removeEventListener('resize', checkIfMobile);
//   }, []);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/events?isActive=true');
//         const data = await response.json();
//         console.log('API Response:', data);
        
//         if (data && data.events && data.events.length > 0) {
//           console.log('Setting images:', data.events);
//           setImages(data.events);
//         } else if (data && Array.isArray(data) && data.length > 0) {
//           // Fallback if API returns events array directly
//           console.log('Setting images from direct array:', data);
//           setImages(data);
//         } else {
//           console.log('No events found');
//           setImages([]);
//         }
//       } catch (err) {
//         console.error("Failed to fetch events:", err.message);
//         setImages([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (images.length === 0) return;

//     const interval = setInterval(() => {
//       setCurrentStartIndex((prev) => {
//         if (isMobile) {
//           // Mobile: scroll one image at a time
//           return (prev + 1) % images.length;
//         } else {
//           // Desktop: scroll one position at a time through all images
//           return (prev + 1) % images.length;
//         }
//       });
//     }, isMobile ? 2000 : 3000); // 2 seconds for mobile, 3 seconds for desktop

//     return () => clearInterval(interval);
//   }, [images.length, isMobile]);

//   // Get the current images to display based on device type
//   const getVisibleImages = () => {
//     if (images.length === 0) return [];
    
//     if (isMobile) {
//       // Mobile: show only one image at a time
//       return [images[currentStartIndex]].filter(Boolean);
//     } else {
//       // Desktop: show 5 images in a single row, scrolling through all images
//       const visible = [];
//       const imagesToShow = Math.min(5, images.length); // Show up to 5 images or all if less than 5
      
//       for (let i = 0; i < imagesToShow; i++) {
//         const index = (currentStartIndex + i) % images.length;
//         visible.push(images[index]);
//       }
//       return visible;
//     }
//   };

//   const handleDotClick = (index) => {
//     setCurrentStartIndex(index);
//   };

//   const visibleImages = getVisibleImages();

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="w-full py-8">
//         <div className="flex justify-center items-center h-64 bg-gray-100 rounded-xl">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//             <p className="text-gray-500">Loading events...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

  

//   // Show no events state
//   if (!loading && images.length === 0) {
//     return (
//       <div className="w-full py-8">
//         <div className="flex justify-center items-center h-64 bg-gray-100 rounded-xl">
//           <p className="text-gray-500">No active events found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full py-8 px-4">
//       {/* Main carousel container */}
//       <div className="relative max-w-7xl mx-auto">
//         {/* Images container */}
//         <div className={`gap-4 mb-6 ${
//           isMobile 
//             ? "flex justify-center" 
//             : "flex justify-center"
//         }`}>
//           {visibleImages.map((img, displayIndex) => (
//             <div
//               key={`${img._id || img.id}-${displayIndex}`}
//               className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
//                 isMobile ? "w-80 max-w-[90vw]" : "w-48 flex-shrink-0"
//               }`}
//             >
//               {/* Instagram Portrait Aspect Ratio Container (1080:1350 = 4:5) */}
//               <div className="relative bg-white rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '4/5' }}>
//                 <Image
//                   src={img.imageUrl || '/placeholder-image.jpg'}
//                   alt={img.title || `Event ${displayIndex + 1}`}
//                   fill
//                   sizes={isMobile ? "90vw" : "192px"}
//                   className="object-cover transition-transform duration-300 group-hover:scale-110"
//                   onError={(e) => {
//                     console.log('Image failed to load:', img.imageUrl);
//                     e.target.src = '/placeholder-image.jpg';
//                   }}
//                 />
//                 {/* Overlay on hover */}
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//                   <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <h3 className="font-semibold text-sm mb-1">
//                       {img.title || 'Event'}
//                     </h3>
//                     {(img.date || img.eventDate) && (
//                       <p className="text-xs opacity-90">
//                         {img.date || new Date(img.eventDate).toLocaleDateString()}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Navigation dots */}
//         <div className="flex justify-center space-x-2">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => handleDotClick(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
//                 index === currentStartIndex
//                   ? "bg-blue-600 scale-125"
//                   : "bg-gray-300 hover:bg-gray-400"
//               }`}
//               aria-label={`Go to image ${index + 1}`}
//             />
//           ))}
//         </div>

//         {/* Navigation arrows */}
//         {images.length > 1 && (
//           <>
//             <button
//               onClick={() => setCurrentStartIndex(prev => 
//                 prev === 0 ? images.length - 1 : prev - 1
//               )}
//               className="absolute left-1 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
//               aria-label="Previous image"
//             >
//               <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <button
//               onClick={() => setCurrentStartIndex(prev => 
//                 (prev + 1) % images.length
//               )}
//               className="absolute right-1 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
//               aria-label="Next image"
//             >
//               <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

