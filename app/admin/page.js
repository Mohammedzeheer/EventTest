'use client'
import { useState, useEffect } from 'react';
import {
  Users,
  FolderOpen,
  BarChart3,
  Package,
  Settings,
  FileText,
  TrendingUp,
  Shield,
  Calendar,
  Camera,
  CalendarDays,
  UserCheck,
  Lock,
  User,
  LogOut,
  Eye,
  EyeOff,
  Image,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Login Component
const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const userData = {
          username: credentials.username,
          role: 'admin',
          loginTime: new Date().toISOString(),
          token: 'demo-jwt-token-' + Date.now()
        };
        onLogin(userData);
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ user, onLogout }) => {
  const dashboardCards = [
    {
      id: 1,
      title: 'Category',
      icon: FolderOpen,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      route: '/admin/category',
      count: '12 Categories'
    },
    {
      id: 2,
      title: 'Items',
      icon: Package,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      route: '/admin/items',
      count: '156 Items'
    },
    {
      id: 3,
      title: 'Team',
      icon: Users,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      route: '/admin/team',
      count: '8 Teams'
    },
    {
      id: 4,
      title: 'Photos',
      icon: Camera,
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600',
      route: '/admin/gallery',
      count: '324 Photos'
    },
    {
      id: 5,
      title: 'Results',
      icon: BarChart3,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      route: '/admin/result',
      count: '234 Records'
    },
    {
      id: 6,
      title: 'Team Point',
      icon: TrendingUp,
      color: 'bg-cyan-500',
      hoverColor: 'hover:bg-cyan-600',
      route: '/admin/teampoint',
      count: 'All Points'
    },
    {
      id: 7,
      title: 'Events',
      icon: CalendarDays,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      route: '/admin/events',
      count: '15 Events'
    },
    {
      id: 8,
      title: 'All Result',
      icon: FileText,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      route: '/admin/all-result',
      count: '45 Reports'
    },
    {
      id: 9,
      title: 'Result Poster',
      icon: Image,
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600',
      route: '/admin/result/poster',
      count: '67 Posters'
    },
    {
      id: 10,
      title: 'CMs',
      icon: UserCheck,
      color: 'bg-amber-500',
      hoverColor: 'hover:bg-amber-600',
      route: '/admin/cms',
      count: '28 CMs'
    },    
    {
      id: 11,
      title: 'Settings',
      icon: Settings,
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      route: '/admin/settings',
      count: 'All Settings'
    }
  ];

   const router = useRouter();
    const handleCardClick = (route) => {
    try {
      router.push(route);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = route;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.username}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-6 mt-4">
            {dashboardCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.route)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-gray-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.color} text-white`}>
                        <IconComponent size={24} />
                      </div>
                      {/* <span className="text-sm text-gray-500 font-medium">{card.count}</span> */}
                    </div>
                    
                    <h3 className="text-xl poppins-semibold text-gray-900 mb-2">{card.title}</h3>               
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = () => {
      setTimeout(() => {
        const storedUser = {
          username: 'admin',
          role: 'admin',
          loginTime: new Date().toISOString(),
          token: 'demo-session-token'
        };
        
        if (window.adminSession) {
          setUser(window.adminSession);
          setIsAuthenticated(true);
        }
        
        setIsLoading(false);
      }, 1000);
    };

    checkAuthState();
  }, []);

  const handleLogin = (userData) => {
    window.adminSession = userData;
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    delete window.adminSession;
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </>
  );
};

export default AdminApp;

// 'use client'
// import { useState, useEffect } from 'react';
// import {
//   Users,
//   FolderOpen,
//   BarChart3,
//   Package,
//   Settings,
//   FileText,
//   TrendingUp,
//   Shield,
//   Calendar,
//   Camera,
//   CalendarDays,
//   UserCheck,
//   Lock,
//   User,
//   LogOut,
//   Eye,
//   EyeOff
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// // Login Component
// const LoginForm = ({ onLogin }) => {
//   const [credentials, setCredentials] = useState({
//     username: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       if (credentials.username === 'admin' && credentials.password === 'admin123') {
//         const userData = {
//           username: credentials.username,
//           role: 'admin',
//           loginTime: new Date().toISOString(),
//           token: 'demo-jwt-token-' + Date.now()
//         };
//         onLogin(userData);
//       } else {
//         setError('Invalid username or password');
//       }
//     } catch (error) {
//       setError('Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (error) setError('');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center mb-8">
//             <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
//               <Lock className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
//             <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
//           </div>

//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-600 text-sm">{error}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                 Username
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={credentials.username}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
//                   placeholder="Enter your username"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   id="password"
//                   name="password"
//                   value={credentials.password}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
//             >
//               {isLoading ? (
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
//           </form>

//           {/* <div className="mt-6 text-center">
//             <p className="text-sm text-gray-500">
//               Demo credentials: admin / admin123
//             </p>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Admin Dashboard Component
// const AdminDashboard = ({ user, onLogout }) => {
//   const dashboardCards = [
//     {
//       id: 1,
//       title: 'Category Management',
//       description: 'Manage categories',
//       icon: FolderOpen,
//       color: 'bg-blue-500',
//       hoverColor: 'hover:bg-blue-600',
//       route: '/admin/category',
//       count: '12 Categories'
//     },
//     {
//       id: 2,
//       title: 'Items Management',
//       description: 'Manage event items',
//       icon: Package,
//       color: 'bg-orange-500',
//       hoverColor: 'hover:bg-orange-600',
//       route: '/admin/items',
//       count: '156 Items'
//     },
//     {
//       id: 3,
//       title: 'Team Management',
//       description: 'Manage teams',
//       icon: Users,
//       color: 'bg-green-500',
//       hoverColor: 'hover:bg-green-600',
//       route: '/admin/team',
//       count: '8 Teams'
//     },
//     {
//       id: 4,
//       title: 'Photos Management',
//       description: 'Upload, organize and manage photo galleries',
//       icon: Camera,
//       color: 'bg-pink-500',
//       hoverColor: 'hover:bg-pink-600',
//       route: '/admin/gallery',
//       count: '324 Photos'
//     },
//     {
//       id: 5,
//       title: 'Results',
//       description: 'Add results',
//       icon: BarChart3,
//       color: 'bg-purple-500',
//       hoverColor: 'hover:bg-purple-600',
//       route: '/admin/result',
//       count: '234 Records'
//     },
//     {
//       id: 6,
//       title: 'Team Point',
//       description: 'Team point management and leaderboard',
//       icon: TrendingUp,
//       color: 'bg-cyan-500',
//       hoverColor: 'hover:bg-cyan-600',
//       route: '/admin/teampoint',
//       count: 'All Points'
//     },
//     {
//       id: 7,
//       title: 'Events Management',
//       description: 'Create, schedule and manage events',
//       icon: CalendarDays,
//       color: 'bg-indigo-500',
//       hoverColor: 'hover:bg-indigo-600',
//       route: '/admin/events',
//       count: '15 Events'
//     },
//     {
//       id: 8,
//       title: 'All Result',
//       description: 'Generate and view All Result',
//       icon: FileText,
//       color: 'bg-red-500',
//       hoverColor: 'hover:bg-red-600',
//       route: '/admin/all-result',
//       count: '45 Reports'
//     },
//     {
//       id: 9,
//       title: 'CMs Management',
//       description: 'Manage Chief Ministers and official profiles',
//       icon: UserCheck,
//       color: 'bg-amber-500',
//       hoverColor: 'hover:bg-amber-600',
//       route: '/admin/cms',
//       count: '28 CMs'
//     },    
//     {
//       id: 10,
//       title: 'System Settings',
//       description: 'Configure system preferences and settings',
//       icon: Settings,
//       color: 'bg-gray-500',
//       hoverColor: 'hover:bg-gray-600',
//       route: '/admin/settings',
//       count: 'All Settings'
//     }
//   ];

//  const router = useRouter();
//     const handleCardClick = (route) => {
//     try {
//       router.push(route);
//     } catch (error) {
//       console.error('Navigation error:', error);
//       window.location.href = route;
//     }
//   };

//   const handleQuickAction = (action) => {
//     const actionRoutes = {
//       addCategory: '/admin/category',
//       createTeam: '/admin/team',
//       uploadPhoto: '/admin/gallery',
//       createEvent: '/admin/events',
//       addCM: '/admin/cms',
//       addItem: '/admin/items',
//       generateReport: '/admin/reports'
//     };
    
//     if (actionRoutes[action]) {
//       handleCardClick(actionRoutes[action]);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Navigation */}
//       <nav className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
//                 <Shield className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
//                 <p className="text-sm text-gray-500">Welcome back, {user?.username}</p>
//               </div>
//             </div>
//             <button
//               onClick={onLogout}
//               className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <LogOut className="w-4 h-4" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="p-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
//             <p className="text-gray-600">Manage your application from this central control panel</p>
//           </div>

//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600">Total Users</p>
//                   <p className="text-2xl font-bold text-gray-900">1,234</p>
//                 </div>
//                 <TrendingUp className="text-blue-500" size={32} />
//               </div>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600">Active Sessions</p>
//                   <p className="text-2xl font-bold text-gray-900">89</p>
//                 </div>
//                 <Shield className="text-green-500" size={32} />
//               </div>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600">Total Photos</p>
//                   <p className="text-2xl font-bold text-gray-900">324</p>
//                 </div>
//                 <Camera className="text-pink-500" size={32} />
//               </div>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600">Upcoming Events</p>
//                   <p className="text-2xl font-bold text-gray-900">7</p>
//                 </div>
//                 <Calendar className="text-purple-500" size={32} />
//               </div>
//             </div>
//           </div>

//           {/* Management Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {dashboardCards.map((card) => {
//               const IconComponent = card.icon;
//               return (
//                 <div
//                   key={card.id}
//                   onClick={() => handleCardClick(card.route)}
//                   className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-gray-300"
//                 >
//                   <div className="p-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className={`p-3 rounded-lg ${card.color} text-white`}>
//                         <IconComponent size={24} />
//                       </div>
//                       <span className="text-sm text-gray-500 font-medium">{card.count}</span>
//                     </div>
                    
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
//                     <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                    
//                     <div className="flex items-center justify-between">
//                       <button 
//                         className={`px-4 py-2 ${card.color} ${card.hoverColor} text-white rounded-md text-sm font-medium transition-colors duration-200`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleCardClick(card.route);
//                         }}
//                       >
//                         Manage
//                       </button>
//                       <div className="flex items-center text-gray-400">
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Quick Actions */}
//           <div className="mt-8 bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <button 
//                 onClick={() => handleQuickAction('addCategory')}
//                 className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//               >
//                 <FolderOpen className="text-blue-500 mb-2" size={20} />
//                 <span className="text-sm font-medium text-gray-900">Add Category</span>
//               </button>
//               <button 
//                 onClick={() => handleQuickAction('createTeam')}
//                 className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//               >
//                 <Users className="text-green-500 mb-2" size={20} />
//                 <span className="text-sm font-medium text-gray-900">Create Team</span>
//               </button>
//               <button 
//                 onClick={() => handleQuickAction('uploadPhoto')}
//                 className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//               >
//                 <Camera className="text-pink-500 mb-2" size={20} />
//                 <span className="text-sm font-medium text-gray-900">Upload Photo</span>
//               </button>
//               <button 
//                 onClick={() => handleQuickAction('createEvent')}
//                 className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//               >
//                 <CalendarDays className="text-indigo-500 mb-2" size={20} />
//                 <span className="text-sm font-medium text-gray-900">Create Event</span>
//               </button>
//               <button 
//                 onClick={() => handleQuickAction('addCM')}
//                 className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//               >
//                 <UserCheck className="text-amber-500 mb-2" size={20} />
//                 <span className="text-sm font-medium text-gray-900">Add CM</span>
//               </button>
//               <button 
//                 onClick={() => handleQuickAction('addItem')}
//                 className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//               >
//                 <Package className="text-orange-500 mb-2" size={20} />
//                 <span className="text-sm font-medium text-gray-900">Add Item</span>
//               </button>
//               <button 
//                 onClick={() => handleQuickAction('generateReport')}
//                 className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//               >
//                 <FileText className="text-red-500 mb-2" size={20} />
//                 <span className="text-sm font-medium text-gray-900">Generate Report</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main App Component with Authentication
// const AdminApp = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = (userData) => {
//     setUser(userData);
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           <span className="text-gray-600">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {isAuthenticated ? (
//         <AdminDashboard user={user} onLogout={handleLogout} />
//       ) : (
//         <LoginForm onLogin={handleLogin} />
//       )}
//     </>
//   );
// };

// export default AdminApp;



// 'use client';
// import { 
//   Users, 
//   FolderOpen, 
//   BarChart3, 
//   Package, 
//   Settings, 
//   FileText,
//   TrendingUp,
//   Shield,
//   Calendar,
//   Camera,
//   CalendarDays,
//   UserCheck
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// const Page = () => {
//   const router = useRouter();

//   const dashboardCards = [
//     {
//       id: 1,
//       title: 'Category Management',
//       description: 'Manage product categories and classifications',
//       icon: FolderOpen,
//       color: 'bg-blue-500',
//       hoverColor: 'hover:bg-blue-600',
//       route: '/admin/category',
//       count: '12 Categories'
//     },
//     {
//       id: 2,
//       title: 'Team Management',
//       description: 'Manage teams and team members',
//       icon: Users,
//       color: 'bg-green-500',
//       hoverColor: 'hover:bg-green-600',
//       route: '/admin/team',
//       count: '8 Teams'
//     },
//     {
//       id: 3,
//       title: 'Photos Management',
//       description: 'Upload, organize and manage photo galleries',
//       icon: Camera,
//       color: 'bg-pink-500',
//       hoverColor: 'hover:bg-pink-600',
//       route: '/admin/gallery',
//       count: '324 Photos'
//     },
//     {
//       id: 4,
//       title: 'Events Management',
//       description: 'Create, schedule and manage events',
//       icon: CalendarDays,
//       color: 'bg-indigo-500',
//       hoverColor: 'hover:bg-indigo-600',
//       route: '/admin/events',
//       count: '15 Events'
//     },
//     {
//       id: 5,
//       title: 'CMs Management',
//       description: 'Manage Chief Ministers and official profiles',
//       icon: UserCheck,
//       color: 'bg-amber-500',
//       hoverColor: 'hover:bg-amber-600',
//       route: '/admin/cms',
//       count: '28 CMs'
//     },
//     {
//       id: 6,
//       title: 'Results & Analytics',
//       description: 'View performance metrics and results',
//       icon: BarChart3,
//       color: 'bg-purple-500',
//       hoverColor: 'hover:bg-purple-600',
//       route: '/admin/result',
//       count: '234 Records'
//     },
//     {
//       id: 7,
//       title: 'Items Management',
//       description: 'Manage inventory and product items',
//       icon: Package,
//       color: 'bg-orange-500',
//       hoverColor: 'hover:bg-orange-600',
//       route: '/admin/items',
//       count: '156 Items'
//     },
//     {
//       id: 8,
//       title: 'Reports',
//       description: 'Generate and view detailed reports',
//       icon: FileText,
//       color: 'bg-red-500',
//       hoverColor: 'hover:bg-red-600',
//       route: '/admin/reports',
//       count: '45 Reports'
//     },
//     {
//       id: 9,
//       title: 'System Settings',
//       description: 'Configure system preferences and settings',
//       icon: Settings,
//       color: 'bg-gray-500',
//       hoverColor: 'hover:bg-gray-600',
//       route: '/admin/settings',
//       count: 'All Settings'
//     },
//      {
//       id: 10,
//       title: 'Team point',
//       description: 'Team point management and leaderboard',
//       icon: Settings,
//       color: 'bg-gray-500',
//       hoverColor: 'hover:bg-gray-600',
//       route: '/admin/teampoint',
//       count: 'All Settings'
//     }
//   ];

//   const handleCardClick = (route) => {
//     try {
//       router.push(route);
//     } catch (error) {
//       console.error('Navigation error:', error);
//       // Fallback to window.location if router fails
//       window.location.href = route;
//     }
//   };

//   const handleQuickAction = (action) => {
//     switch(action) {
//       case 'addCategory':
//         router.push('/admin/category');
//         break;
//       case 'createTeam':
//         router.push('/admin/team');
//         break;
//       case 'uploadPhoto':
//         router.push('/admin/gallery');
//         break;
//       case 'createEvent':
//         router.push('/admin/events');
//         break;
//       case 'addCM':
//         router.push('/admin/cms');
//         break;
//       case 'addItem':
//         router.push('/admin/items');
//         break;
//       case 'generateReport':
//         router.push('/admin/reports');
//         break;
//       default:
//         console.log(`Action: ${action}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
//           <p className="text-gray-600">Manage your application from this central control panel</p>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Users</p>
//                 <p className="text-2xl font-bold text-gray-900">1,234</p>
//               </div>
//               <TrendingUp className="text-blue-500" size={32} />
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Active Sessions</p>
//                 <p className="text-2xl font-bold text-gray-900">89</p>
//               </div>
//               <Shield className="text-green-500" size={32} />
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Photos</p>
//                 <p className="text-2xl font-bold text-gray-900">324</p>
//               </div>
//               <Camera className="text-pink-500" size={32} />
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Upcoming Events</p>
//                 <p className="text-2xl font-bold text-gray-900">7</p>
//               </div>
//               <Calendar className="text-purple-500" size={32} />
//             </div>
//           </div>
//         </div>

//         {/* Management Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {dashboardCards.map((card) => {
//             const IconComponent = card.icon;
//             return (
//               <div
//                 key={card.id}
//                 onClick={() => handleCardClick(card.route)}
//                 className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-gray-300"
//               >
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className={`p-3 rounded-lg ${card.color} text-white`}>
//                       <IconComponent size={24} />
//                     </div>
//                     <span className="text-sm text-gray-500 font-medium">{card.count}</span>
//                   </div>
                  
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
//                   <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                  
//                   <div className="flex items-center justify-between">
//                     <button 
//                       className={`px-4 py-2 ${card.color} ${card.hoverColor} text-white rounded-md text-sm font-medium transition-colors duration-200`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleCardClick(card.route);
//                       }}
//                     >
//                       Manage
//                     </button>
//                     <div className="flex items-center text-gray-400">
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8 bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <button 
//               onClick={() => handleQuickAction('addCategory')}
//               className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//             >
//               <FolderOpen className="text-blue-500 mb-2" size={20} />
//               <span className="text-sm font-medium text-gray-900">Add Category</span>
//             </button>
//             <button 
//               onClick={() => handleQuickAction('createTeam')}
//               className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//             >
//               <Users className="text-green-500 mb-2" size={20} />
//               <span className="text-sm font-medium text-gray-900">Create Team</span>
//             </button>
//             <button 
//               onClick={() => handleQuickAction('uploadPhoto')}
//               className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//             >
//               <Camera className="text-pink-500 mb-2" size={20} />
//               <span className="text-sm font-medium text-gray-900">Upload Photo</span>
//             </button>
//             <button 
//               onClick={() => handleQuickAction('createEvent')}
//               className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//             >
//               <CalendarDays className="text-indigo-500 mb-2" size={20} />
//               <span className="text-sm font-medium text-gray-900">Create Event</span>
//             </button>
//             <button 
//               onClick={() => handleQuickAction('addCM')}
//               className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//             >
//               <UserCheck className="text-amber-500 mb-2" size={20} />
//               <span className="text-sm font-medium text-gray-900">Add CM</span>
//             </button>
//             <button 
//               onClick={() => handleQuickAction('addItem')}
//               className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//             >
//               <Package className="text-orange-500 mb-2" size={20} />
//               <span className="text-sm font-medium text-gray-900">Add Item</span>
//             </button>
//             <button 
//               onClick={() => handleQuickAction('generateReport')}
//               className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
//             >
//               <FileText className="text-red-500 mb-2" size={20} />
//               <span className="text-sm font-medium text-gray-900">Generate Report</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;






// 'use client';
// import React, { useState } from 'react';
// import { 
//   Users, 
//   FolderOpen, 
//   BarChart3, 
//   Package, 
//   Settings, 
//   FileText,
//   TrendingUp,
//   Shield,
//   Calendar,
//   Camera,
//   CalendarDays,
//   UserCheck,
//   Award,
//   Plus,
//   Bell,
//   Search,
//   Menu,
//   X,
//   Home,
//   Target,
//   Trophy,
//   Star
// } from 'lucide-react';

// const AdminDashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState('dashboard');

//   // Sample team points data
//   const teamPointsData = [
//     { id: 1, teamName: 'Alpha Team', points: 2450, members: 8, rank: 1, trend: '+12%' },
//     { id: 2, teamName: 'Beta Squad', points: 2380, members: 6, rank: 2, trend: '+8%' },
//     { id: 3, teamName: 'Gamma Force', points: 2210, members: 7, rank: 3, trend: '+15%' },
//     { id: 4, teamName: 'Delta Warriors', points: 1980, members: 5, rank: 4, trend: '+5%' },
//     { id: 5, teamName: 'Epsilon Elite', points: 1750, members: 9, rank: 5, trend: '-2%' }
//   ];

//   const dashboardCards = [
//     {
//       id: 1,
//       title: 'Category Management',
//       description: 'Manage product categories and classifications',
//       icon: FolderOpen,
//       color: 'bg-blue-500',
//       hoverColor: 'hover:bg-blue-600',
//       route: '/admin/category',
//       count: '12 Categories'
//     },
//     {
//       id: 2,
//       title: 'Team Management',
//       description: 'Manage teams and team members',
//       icon: Users,
//       color: 'bg-green-500',
//       hoverColor: 'hover:bg-green-600',
//       route: '/admin/team',
//       count: '8 Teams'
//     },
//     {
//       id: 3,
//       title: 'Team Points',
//       description: 'Manage team points and leaderboard',
//       icon: Award,
//       color: 'bg-yellow-500',
//       hoverColor: 'hover:bg-yellow-600',
//       route: '/admin/teampoint',
//       count: '5 Active Teams'
//     },
//     {
//       id: 4,
//       title: 'Photos Management',
//       description: 'Upload, organize and manage photo galleries',
//       icon: Camera,
//       color: 'bg-pink-500',
//       hoverColor: 'hover:bg-pink-600',
//       route: '/admin/gallery',
//       count: '324 Photos'
//     },
//     {
//       id: 5,
//       title: 'Events Management',
//       description: 'Create, schedule and manage events',
//       icon: CalendarDays,
//       color: 'bg-indigo-500',
//       hoverColor: 'hover:bg-indigo-600',
//       route: '/admin/events',
//       count: '15 Events'
//     },
//     {
//       id: 6,
//       title: 'CMs Management',
//       description: 'Manage Chief Ministers and official profiles',
//       icon: UserCheck,
//       color: 'bg-amber-500',
//       hoverColor: 'hover:bg-amber-600',
//       route: '/admin/cms',
//       count: '28 CMs'
//     },
//     {
//       id: 7,
//       title: 'Results & Analytics',
//       description: 'View performance metrics and results',
//       icon: BarChart3,
//       color: 'bg-purple-500',
//       hoverColor: 'hover:bg-purple-600',
//       route: '/admin/result',
//       count: '234 Records'
//     },
//     {
//       id: 8,
//       title: 'Items Management',
//       description: 'Manage inventory and product items',
//       icon: Package,
//       color: 'bg-orange-500',
//       hoverColor: 'hover:bg-orange-600',
//       route: '/admin/items',
//       count: '156 Items'
//     }
//   ];

//   const sidebarItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home },
//     { id: 'teams', label: 'Teams', icon: Users },
//     { id: 'team-points', label: 'Team Points', icon: Award },
//     { id: 'categories', label: 'Categories', icon: FolderOpen },
//     { id: 'events', label: 'Events', icon: CalendarDays },
//     { id: 'gallery', label: 'Gallery', icon: Camera },
//     { id: 'cms', label: 'CMs', icon: UserCheck },
//     { id: 'analytics', label: 'Analytics', icon: BarChart3 },
//     { id: 'items', label: 'Items', icon: Package },
//     { id: 'reports', label: 'Reports', icon: FileText },
//     { id: 'settings', label: 'Settings', icon: Settings }
//   ];

//   const handleSectionChange = (section) => {
//     setActiveSection(section);
//     setSidebarOpen(false);
//   };

//   const renderTeamPointsSection = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-900">Team Points Management</h2>
//         <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
//           <Plus size={20} />
//           Add Points
//         </button>
//       </div>

//       {/* Top Teams Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {teamPointsData.slice(0, 3).map((team, index) => (
//           <div key={team.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className={`p-2 rounded-full ${
//                   index === 0 ? 'bg-yellow-100 text-yellow-600' :
//                   index === 1 ? 'bg-gray-100 text-gray-600' :
//                   'bg-orange-100 text-orange-600'
//                 }`}>
//                   <Trophy size={20} />
//                 </div>
//                 <span className="text-2xl font-bold text-gray-700">#{team.rank}</span>
//               </div>
//               <span className={`px-2 py-1 text-xs rounded-full ${
//                 team.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//               }`}>
//                 {team.trend}
//               </span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">{team.teamName}</h3>
//             <div className="flex justify-between items-center text-sm text-gray-600">
//               <span>{team.points} points</span>
//               <span>{team.members} members</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Team Points Table */}
//       <div className="bg-white rounded-lg shadow-lg">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Team Leaderboard</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {teamPointsData.map((team) => (
//                 <tr key={team.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <span className="text-lg font-bold text-gray-900">#{team.rank}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{team.teamName}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <Star className="text-yellow-500 mr-1" size={16} />
//                       <span className="text-lg font-semibold text-gray-900">{team.points}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {team.members}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       team.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//                     }`}>
//                       {team.trend}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
//                     <button className="text-green-600 hover:text-green-900">Add Points</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   const renderDashboard = () => (
//     <div className="space-y-6">
//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Users</p>
//               <p className="text-2xl font-bold text-gray-900">1,234</p>
//             </div>
//             <TrendingUp className="text-blue-500" size={32} />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Active Teams</p>
//               <p className="text-2xl font-bold text-gray-900">8</p>
//             </div>
//             <Users className="text-green-500" size={32} />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Points</p>
//               <p className="text-2xl font-bold text-gray-900">11,770</p>
//             </div>
//             <Award className="text-yellow-500" size={32} />
//           </div>
//         </div>
//         <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Upcoming Events</p>
//               <p className="text-2xl font-bold text-gray-900">7</p>
//             </div>
//             <Calendar className="text-purple-500" size={32} />
//           </div>
//         </div>
//       </div>

//       {/* Management Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {dashboardCards.map((card) => {
//           const IconComponent = card.icon;
//           return (
//             <div
//               key={card.id}
//               onClick={() => card.title === 'Team Points' ? handleSectionChange('team-points') : null}
//               className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200"
//             >
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className={`p-3 rounded-lg ${card.color} text-white shadow-md`}>
//                     <IconComponent size={24} />
//                   </div>
//                   <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">{card.count}</span>
//                 </div>
                
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
//                 <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                
//                 <div className="flex items-center justify-between">
//                   <button 
//                     className={`px-4 py-2 ${card.color} ${card.hoverColor} text-white rounded-md text-sm font-medium transition-colors duration-200 shadow-sm`}
//                   >
//                     Manage
//                   </button>
//                   <div className="flex items-center text-gray-400">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg`}>
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
//           <button 
//             onClick={() => setSidebarOpen(false)}
//             className="lg:hidden text-gray-500 hover:text-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>
        
//         <nav className="mt-6">
//           {sidebarItems.map((item) => {
//             const IconComponent = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleSectionChange(item.id)}
//                 className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
//                   activeSection === item.id ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'text-gray-700'
//                 }`}
//               >
//                 <IconComponent size={20} className="mr-3" />
//                 {item.label}
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Overlay for mobile sidebar */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex-1 lg:ml-0">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b border-gray-200">
//           <div className="flex items-center justify-between p-6">
//             <div className="flex items-center">
//               <button 
//                 onClick={() => setSidebarOpen(true)}
//                 className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
//               >
//                 <Menu size={24} />
//               </button>
//               <h2 className="text-2xl font-semibold text-gray-900 capitalize">
//                 {activeSection.replace('-', ' ')}
//               </h2>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 text-gray-400" size={16} />
//                 <input 
//                   type="text" 
//                   placeholder="Search..." 
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <button className="relative p-2 text-gray-500 hover:text-gray-700">
//                 <Bell size={20} />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>
//               <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
//                 A
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content Area */}
//         <main className="p-6">
//           {activeSection === 'dashboard' && renderDashboard()}
//           {activeSection === 'team-points' && renderTeamPointsSection()}
//           {activeSection !== 'dashboard' && activeSection !== 'team-points' && (
//             <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//               <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
//                 {activeSection.replace('-', ' ')} Management
//               </h3>
//               <p className="text-gray-600">This section is under development.</p>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;