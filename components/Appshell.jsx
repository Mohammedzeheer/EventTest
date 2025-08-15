"use client";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from 'next/navigation';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? "" : "md:pt-20"}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}



// "use client";
// import { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// export default function AppShell({ children }) {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <main className="md:pt-20">
//         {/* {isLoading ? (
//           <div className="animate-pulse p-10 pt-14 min-h-screen">
//             <div className="h-12 bg-gray-300 rounded w-1/3 mb-4" />
//             <div className="h-12 bg-gray-300 rounded w-2/3 mb-4" />
//             <div className="h-12 bg-gray-300 rounded w-full mb-4" />
//             <div className="h-12 bg-gray-300 rounded w-5/6 mb-4" />
//           </div>
//         ) : (
//           children
//         )} */}
//          {children}
//       </main>
//       {!isLoading && <Footer />}
//     </>
//   );
// }
