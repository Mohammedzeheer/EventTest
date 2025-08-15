import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative text-center w-full h-screen p-0 flex flex-col items-center justify-center pt-10">
      {/* Background for Mobile */}
      <div className="absolute inset-0 w-full h-full md:hidden">
        <Image
          src="/backgroundmobile.png"
          alt="Mobile background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Background for Desktop */}
      <div className="absolute inset-0 w-full h-full hidden md:block">
        <Image
          src="/backgroundLaptop.png"
          alt="Desktop background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      <div className="-mt-[100px] lg:mt-20 z-10">
        <button 
          onClick={() => scrollToElement('events')}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
          aria-label="Scroll to results section"
        >
          <div className="rounded-md p-2 animate-bounce transition-all duration-500 bg-white w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center shadow-lg hover:shadow-xl">
            <ChevronDown className="w-6 h-6 lg:w-8 lg:h-8 text-gray-700" />
          </div>
        </button>
      </div>
    </div>
  );
}

export default Home;

