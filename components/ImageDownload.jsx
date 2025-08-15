import React, { useRef } from "react";

function ImageDownload({ results, category, item, color, image }) {
  console.log("ImageDownload", results ,category, item, color, image );
  const downloadImageRef = useRef(null);
  
  const handleDownloadImage = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      console.log("Downloading");
      const element = downloadImageRef.current;
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 6, 
      });
      const data = canvas.toDataURL("image/jpg");
      const link = document.createElement("a");

      link.href = data;
      link.download = `${category}-${item}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <>
      {results?.result && (
         <div className="">
          <div
            className="relative mx-auto drop-shadow-xl text-center h-[350px] w-[350px] mb-24"
            ref={downloadImageRef}
            id="downloadImage"
          >
            <img
              className="max-w-full object-cover h-full w-full"
              src={image}
              alt="Background"
            />
            <div className="absolute top-[140px] left-[45px] right-0 bottom-0 flex flex-col ">
              <div className="text-start ">
                <div className={`text-[10px] font-light ${color}`}>
                  {category}
                </div>
                <div className={`text-[13px] font-medium -mt-[6px] ${color}`}>
                  {item}
                </div>
              </div>

              <div className="text-start mt-[12px] pl-[10px]">
                {results?.result.map((result, index) => (
                  <div key={index}>
                    {/* First Prize */}
                    {result?.firstPrize && (
                      <div className="mb-[7px]">
                        <div className={`text-[11px] font-semibold ${color}`}>
                          {result.firstPrize}
                        </div>
                        <div className={`text-[7px] -mt-[2px] font-light ${color}`}>
                          {result.firstTeam}
                        </div>
                      </div>
                    )}
                    
                    {/* Second Prize */}
                    {result?.secondPrize && (
                      <div className="mb-[7px]">
                        <div className={`text-[11px] font-semibold ${color}`}>
                          {result.secondPrize}
                        </div>
                        <div className={`text-[7px] -mt-[2px] font-light ${color}`}>
                          {result.secondTeam}
                        </div>
                      </div>
                    )}
                    
                    {/* Third Prize */}
                    {result?.thirdPrize && (
                      <div className="mb-[7px]">
                        <div className={`text-[11px] font-semibold ${color}`}>
                          {result.thirdPrize}
                        </div>
                        <div className={`text-[7px] -mt-[2px] font-light ${color}`}>
                          {result.thirdTeam}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleDownloadImage}
              className="mt-4 px-6 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-50"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ImageDownload;