'use client'
import { useEffect, useState } from "react";
import { Trophy, Medal, Award, Star } from "lucide-react";
import axios from "axios";

function TeamPoint() {
  const [points, setTeampoint] = useState([]);
  const [afterCount, setAfterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/api/teampoint');
        console.log("Team Points Data:", res.data.data);
        if (Array.isArray(res.data.data.sortedResults)) {
          setTeampoint(res.data.data.sortedResults);
          setAfterCount(res.data.data.afterCount);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching team points:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-500" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-primary py-16 sm:py-8">
        <div className="px-4 max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 mb-2">
              Loading Results...
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">Team Rankings</p>
          </div>
          <div className="space-y-2 sm:space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-3 sm:p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  {/* Position shimmer */}
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shimmer" />
                    <div className="flex-1 min-w-0">
                      <div className="h-4 sm:h-5 w-32 sm:w-48 rounded shimmer mb-2" />
                      <div className="h-3 w-20 rounded shimmer" />
                    </div>
                  </div>
                  {/* Points shimmer */}
                  <div className="text-right ml-4">
                    <div className="h-5 w-12 sm:w-16 rounded shimmer mb-2" />
                    <div className="h-3 w-10 rounded shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8">
    <div className="bg-primary py-16 sm:py-8 ">
      <div className="px-4 max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl poppins-bold text-gray-100 mb-2">
            {afterCount === 10001 ? "🏆 Final Results" : ` After ${afterCount}`}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">Team Rankings</p>
        </div>

        {/* Team Cards */}
        <div className="space-y-2 sm:space-y-2">
          {points.length > 0 ? (
            points.map((data, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${index < 3 ? 'border-l-4 p-3 sm:p-4' : 'border p-2 sm:p-3'
                  } ${index === 0 ? 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 via-yellow-25 to-white shadow-yellow-100' :
                    index === 1 ? 'border-l-gray-400 bg-gradient-to-r from-gray-50 via-gray-25 to-white shadow-gray-100' :
                      index === 2 ? 'border-l-orange-500 bg-gradient-to-r from-orange-50 via-orange-25 to-white shadow-orange-100' :
                        'border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white'
                  }`}
              >
                <div className="flex items-center justify-between">
                  {/* Position and Team */}
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    {/* Position with Icon */}
                    <div className={`flex items-center justify-center rounded-full ${index < 3 ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-8 h-8 sm:w-10 sm:h-10'
                      } ${index === 0 ? 'bg-yellow-100 shadow-yellow-200' :
                        index === 1 ? 'bg-gray-100 shadow-gray-200' :
                          index === 2 ? 'bg-orange-100 shadow-orange-200' : 'bg-gray-50 shadow-gray-100'
                      } shadow-sm`}>
                      <div className="flex items-center space-x-1">
                        {getPositionIcon(index + 1)}
                        <span className={`font-bold ${index < 3 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                          } ${index < 3 ? 'text-gray-800' : 'text-gray-600'
                          }`}>
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Team Name */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold truncate ${index < 3 ? 'text-base sm:text-lg text-gray-800' : 'text-sm sm:text-base text-gray-700'
                        }`}>
                        {data.team.teamName}
                      </h3>
                      {index < 3 && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {index === 0 ? '🏆 Champion' : index === 1 ? '🥈 Runner-up' : '🥉 Third Place'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right ml-4">
                    <div className={`font-bold ${index < 3 ? 'text-lg sm:text-xl text-gray-800' : 'text-base sm:text-lg text-gray-600'
                      }`}>
                      {data.point.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">points</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="mb-4">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto" />
              </div>
              <p className="text-gray-500 font-medium">No points available</p>
              <p className="text-gray-400 text-sm mt-1">Results will appear here once teams start competing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamPoint;