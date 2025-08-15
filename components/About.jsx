import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-4 md:py-8 m-2 ">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <div className="w-full h-64 md:h-96 bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Milad Fest</h1>
              <p className="text-lg md:text-xl opacity-90">Celebrating the Birth of Prophet Muhammad (PBUH)</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Milad Fest
            </h1>
            <div className="w-24 h-1 bg-green-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 shadow-lg">
              <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-6">
                Milad Fest is a sacred celebration commemorating the birth of Prophet Muhammad (Peace Be Upon Him), known as Milad-un-Nabi or Mawlid. This blessed occasion brings together communities worldwide to honor the life, teachings, and exemplary character of the Holy Prophet.
              </p>
              
              <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-6">
                The festival serves as a beautiful opportunity for Muslims and people of all backgrounds to reflect upon the Prophet's message of peace, compassion, justice, and unity. Through various cultural programs, recitations, lectures, and community gatherings, Milad Fest promotes understanding and celebrates the universal values of love and brotherhood.
              </p>
              
              <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-6">
                During Milad Fest, communities organize processions, decorative illuminations, charitable activities, and educational programs. The celebration includes beautiful Naat recitations (poetry in praise of the Prophet), Qirat (Quranic recitations), and discussions about the Prophet&apos;s life and teachings.
              </p>
              
              <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                This festival strengthens the bonds of faith and community while spreading the Prophet&apos;s message of mercy, tolerance, and service to humanity. It&apos;s a time for spiritual reflection, community service, and celebrating the divine guidance that continues to inspire millions around the world.
              </p>
            </div>
          </div>

          {/* Key Aspects */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Festival Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Qirat & Naat</h3>
                <p className="text-gray-600 text-sm">Beautiful recitations and poetry in praise of the Prophet</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤲</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Service</h3>
                <p className="text-gray-600 text-sm">Charitable activities and helping those in need</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🕌</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Spiritual Gatherings</h3>
                <p className="text-gray-600 text-sm">Lectures and discussions on Islamic teachings</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Decorations</h3>
                <p className="text-gray-600 text-sm">Beautiful illuminations and festive decorations</p>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">Peace</div>
              <div className="text-gray-600 font-medium">Message of Harmony</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">Unity</div>
              <div className="text-gray-600 font-medium">Bringing Communities Together</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">Love</div>
              <div className="text-gray-600 font-medium">Compassion for All Humanity</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

// import React from 'react';

// const About = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section className="bg-white py-4 md:py-8">
//         <div className="relative overflow-hidden rounded-2xl shadow-2xl">
//           <img
//             src="/assets/lansclandingcr.png"
//             alt="Sahityotsav 2025 - SSF Manjeshwaram Division Event Banner"
//             className="w-full h-auto object-cover"
//           />
//         </div>
//       </section>

//       {/* About Content Section */}
//       <section className="bg-white py-12 md:py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//              Sahityotsav
//             </h1>
//             <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
//           </div>
          
//           <div className="prose prose-lg max-w-none">
//             <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 shadow-lg">
//               <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-6">
//                 Incepted 31 years ago in 1993, Sahityotsav has its commencement from the grassroot level - that is a family Sahityotsav. Crossing the levels of units, sectors, divisions, districts and 26 states in the country, it finds its actualization in the national level each year.
//               </p>
              
//               <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-6">
//                 As a prime aim, Sahityotsav is focusing on the embellishment of the creativity of thousands and more students across the country, and now it became one of the towering figures in the realm of cultural festivals of India.
//               </p>
              
//               <p className="text-lg md:text-xl leading-relaxed text-gray-700">
//                 Sahityotsav has its assets of thousands of young vibrant studentdom who have came forward to meet the need of the time in its various aspects. They are ready to question all the anti social hullabaloos using their talents like writing, drawing, criticizing... etc.
//               </p>
//             </div>
//           </div>

//           {/* Additional Statistics or Highlights */}
//           <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
//               <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">31</div>
//               <div className="text-gray-600 font-medium">Years of Excellence</div>
//             </div>
            
//             <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
//               <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">26</div>
//               <div className="text-gray-600 font-medium">States Covered</div>
//             </div>
            
//             <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
//               <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">1000+</div>
//               <div className="text-gray-600 font-medium">Students Participating</div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default About;