"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Trophy, Camera, Menu, X, Star, Users, Calendar, MapPin } from 'lucide-react';

const Home = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = [
    {
      title: "साहित्योत्सव 2025",
      subtitle: "Where Literature Comes Alive",
      description: "Join us for the grandest celebration of literature, poetry, and creative expression",
      bg: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
    },
    {
      title: "Celebrating Literary Excellence",
      subtitle: "Stories That Inspire Generations",
      description: "Experience the magic of words through competitions, workshops, and cultural programs",
      bg: "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900"
    },
    {
      title: "Unite Through Literature",
      subtitle: "Express • Compete • Celebrate",
      description: "Showcase your literary talents and connect with fellow writers and literature enthusiasts",
      bg: "bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900"
    }
  ];

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Literary Competitions",
      description: "Poetry, essay writing, storytelling, and debate competitions for all age groups"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Cultural Programs",
      description: "Experience rich cultural performances, book readings, and author interactions"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Recognition & Awards",
      description: "Outstanding participants receive recognition and prizes for their literary contributions"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Workshops",
      description: "Learn from renowned authors and poets through interactive workshops and sessions"
    }
  ];

  const stats = [
    { number: "500+", label: "Participants" },
    { number: "15+", label: "Events" },
    { number: "20+", label: "Prizes" },
    { number: "3", label: "Days" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation - Updated with navigation handlers */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Sahityotsav</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleNavigation('/')}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('/events')}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Events
              </button>
              <button
                onClick={() => handleNavigation('/results')}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Results
              </button>
              <button
                onClick={() => handleNavigation('/photos')}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Photos
              </button>
              <button
                onClick={() => handleNavigation('/about')}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                About
              </button>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors font-medium">
                Register Now
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavigation('/')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('/events')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                Events
              </button>
              <button
                onClick={() => handleNavigation('/results')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                Results
              </button>
              <button
                onClick={() => handleNavigation('/photos')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                Photos
              </button>
              <button
                onClick={() => handleNavigation('/about')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                About
              </button>
              <button className="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors">
                Register Now
              </button>
            </div>
          </div>
        )}
      </nav>



      {/* Hero Banner - Updated buttons */}
      <section className="relative h-screen overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              } ${slide.bg}`}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-pulse">
                  साहित्योत्सव 2025
                </h1>
                <p className="text-xl md:text-2xl mb-4 font-light">
                  Where Literature Comes Alive
                </p>
                <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join us for the grandest celebration of literature, poetry, and creative expression
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleNavigation('/results')}
                    className="bg-white text-purple-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                  >
                    View Results
                  </button>
                  <button
                    onClick={() => handleNavigation('/photos')}
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-900 transition-all transform hover:scale-105"
                  >
                    Browse Photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions - Updated buttons */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl text-white">
              <Trophy className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Check Results</h3>
              <p className="text-purple-100 mb-6">
                View the latest competition results and winner announcements
              </p>
              <button
                onClick={() => handleNavigation('/results')}
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                View Results
              </button>
            </div>

            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 rounded-2xl text-white">
              <Camera className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Photo Gallery</h3>
              <p className="text-emerald-100 mb-6">
                Explore memorable moments captured during the festival
              </p>
              <button
                onClick={() => handleNavigation('/photos')}
                className="bg-white text-emerald-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                Browse Photos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-8 h-8 text-purple-400" />
                <span className="text-xl font-bold">Sahityotsav</span>
              </div>
              <p className="text-gray-400">
                Celebrating the beauty of literature and nurturing creative expression.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#results" className="hover:text-white transition-colors">Results</a></li>
                <li><a href="#photos" className="hover:text-white transition-colors">Photos</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Festival Venue</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Coming Soon</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <button className="bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </button>
                <button className="bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Sahityotsav. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
