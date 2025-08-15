import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Download } from 'lucide-react'; // 👈 Import icons

const ImageCards = () => {
  const [cardData, setImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = 1, limit = 100) => {
    try {
      const response = await axios.get('/api/gallery', {
        params: { page, limit }
      });
      const data = response.data;
      setImages(data.galleries || []);
    } catch (err) {
      console.error('Error fetching galleries:', err);
    }
  };

  const handlePreview = (url) => {
    window.open(url, '_blank');
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      <div className='flex justify-center mb-10'>
        {/* <h2 className="text-4xl lg:text-5xl poppins-bold text-primary">Gallery</h2> */}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {cardData.map((card) => (
          <div
            key={`grid-${card.id}`}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group relative"
          >
            <div className="aspect-[5/4] relative">
              <img
                src={card.imageUrl}
                alt={card.alt || 'Gallery Image'}
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay with Icons */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-6 transition-opacity duration-300 gap-3">
                <button
                  onClick={() => handlePreview(card.imageUrl)}
                  className="text-white hover:text-gray-300 p-2 rounded-full bg-black bg-opacity-40"
                  title="Preview"
                >
                  <Eye size={24} />
                </button>
                <button
                  onClick={() => handleDownload(card.imageUrl)}
                  className="text-white hover:text-gray-300 p-2 rounded-full bg-black bg-opacity-40"
                  title="Download"
                >
                  <Download size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCards;




// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const ImageCards = () => {
//   const [cardData, setImages] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async (page = 1, limit = 100) => {
//     try {
//       const response = await axios.get('/api/gallery', {
//         params: { page, limit }
//       });
//       const data = response.data;
//       setImages(data.galleries || []);

//     } catch (err) {
//       console.error('Error fetching galleries:', err);
//     }
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto p-6 bg-white">
//       <div className='flex justify-center mb-10'>
//         {/* <h2 className="text-4xl lg:text-5xl poppins-bold text-primary">
//           Gallery
//         </h2> */}
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
//         {cardData.map((card) => (
//           <div
//             key={`grid-${card.id}`}
//             className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
//           >
//             <div className="aspect-[5/4] relative">
//               <img
//                 src={card.imageUrl}
//                 alt={card.alt}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageCards;