'use client';

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AllResult() {
    const [results, setResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

    useEffect(() => {
        fetchResults();
    }, [statusFilter]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            
            let url = '/api/all-result';
            if (statusFilter === 'active') {
                url += '?isActive=true';
            } else if (statusFilter === 'inactive') {
                url += '?isActive=false';
            }
            
            const response = await toast.promise(
                fetch(url).then(res => res.json()),
                {
                    loading: 'Loading results...',
                    success: "Results fetched successfully",
                    error: (err) => err?.message || 'Something went wrong'
                }
            );
            console.log('API Response:', response);
            
            if (response.data) {
                let filteredData = response.data;
            
                if (statusFilter === 'active') {
                    filteredData = response.data.filter(item => item.isActive !== false);
                } else if (statusFilter === 'inactive') {
                    filteredData = response.data.filter(item => item.isActive === false);
                }
                
                setResults(filteredData);
                
                // Calculate stats from the actual data
                const totalResults = response.data || [];
                const activeCount = totalResults.filter(item => item.isActive !== false).length;
                const inactiveCount = totalResults.filter(item => item.isActive === false).length;
                
                setStats({
                    total: totalResults.length,
                    active: activeCount,
                    inactive: inactiveCount
                });
            }
        } catch (error) {
            console.log('Fetch error:', error);
            toast.error('Failed to fetch results');
        } finally {
            setLoading(false);
        }
    };

    // Toggle result status
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const response = await toast.promise(
                fetch(`/api/all-result?id=${id}&action=toggle`, {
                    method: 'PATCH',
                }).then(res => res.json()),
                {
                    loading: 'Updating status...',
                    success: `Result ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
                    error: (err) => err?.message || 'Failed to update status'
                }
            );

            if (response.status === 200) {
                await fetchResults();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    // Filter results based on search query
    const filteredResults = results.filter(
        (element) =>
            element.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            element.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            element.firstPrize?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            element.secondPrize?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            element.thirdPrize?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            element.firstTeam?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            element.secondTeam?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            element.thirdTeam?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Download PDF handler
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        const tableColumn = ["No.", "Category", "Item", "First Prize", "First Team", "Second Prize", "Second Team", "Third Prize", "Third Team" , "Status"];
        const tableRows = [];

        filteredResults.forEach((element, index) => {
            const rowData = [
                index + 1,
                element?.category || "N/A",
                element?.item || "N/A",
                element?.firstPrize || "No Data",
                element?.firstTeam || "No Data",
                element?.secondPrize || "No Data",
                element?.secondTeam || "No Data",
                element?.thirdPrize || "No Data",
                element?.thirdTeam || "No Data",
                element?.isActive !== false ? "Active" : "Inactive",
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [100, 50, 200] }
        });

        const filename = statusFilter === "all"
            ? "All_Results.pdf"
            : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}_Results.pdf`;

        doc.save(filename);
        toast.success("PDF downloaded successfully!");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-purple-600 font-semibold">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                🏆 Published Results
                            </h1>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-100 rounded-xl p-1 flex">
                                {[
                                    { key: 'all', label: 'All Results', icon: '📊', stat: stats.total },
                                    { key: 'active', label: 'Active', icon: '✅', stat: stats.active },
                                    { key: 'inactive', label: 'Inactive', icon: '❌', stat: stats.inactive }
                                ].map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => setStatusFilter(filter.key)}
                                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${statusFilter === filter.key
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                                : 'text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span>{filter.icon}</span>
                                        {filter.label}
                                        <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-sm">
                                            {filter.stat}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                       
                        {/* Search and Download Section */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="🔍 Search by Category, Item, Prize, or Team..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                                />
                            </div>
                            <button
                                onClick={handleDownloadPDF}
                                disabled={filteredResults.length === 0}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                            </button>
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
                                    <tr>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            🏷️ Category
                                        </th>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            🎯 Item
                                        </th>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            🥇 First Prize
                                        </th>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            🏅 First Team
                                        </th>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            🥈 Second Prize
                                        </th>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            🏅 Second Team
                                        </th>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            🥉 Third Prize
                                        </th>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            🏅 Third Team
                                        </th>
                                        <th className="py-4 px-3 text-left text-white font-bold text-xs uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredResults.length > 0 ? (
                                        filteredResults.map((element, index) => {
                                            const isActive = element.isActive !== false; // Default to true if undefined
                                            return (
                                                <tr 
                                                    key={element._id || index} 
                                                    className={`${
                                                        index % 2 === 1 
                                                            ? "bg-gradient-to-r from-purple-25 via-blue-25 to-indigo-25" 
                                                            : "bg-white"
                                                    } hover:bg-gradient-to-r hover:from-purple-50 hover:via-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                                                        !isActive ? 'opacity-75' : ''
                                                    }`}
                                                >
                                                    <td className="py-4 px-2">
                                                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                            {index + 1}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2">
                                                        <div className={`px-1 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                                                            isActive 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            <div className={`w-2 h-2 rounded-full ${
                                                                isActive ? 'bg-green-500' : 'bg-red-500'
                                                            }`}></div>
                                                            {isActive ? 'Active' : 'Inactive'}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-3 text-gray-800 font-medium text-sm">
                                                        {element?.category || "N/A"}
                                                    </td>
                                                    <td className="py-4 px-3 text-gray-800 font-medium text-sm">
                                                        {element?.item || "N/A"}
                                                    </td>
                                                    <td className="py-4 px-3">
                                                        {element.firstPrize ? (
                                                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                                                                {element.firstPrize}
                                                            </div>
                                                        ) : (
                                                            <p className="text-red-500 font-medium">No Data</p>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-3 text-gray-800 font-medium text-sm">
                                                        {element?.firstTeam || "No Data"}
                                                    </td>
                                                    <td className="py-4 px-3">
                                                        {element.secondPrize ? (
                                                            <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                                                                {element.secondPrize}
                                                            </div>
                                                        ) : (
                                                            <p className="text-red-500 font-medium">No Data</p>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-3 text-gray-800 font-medium text-sm">
                                                        {element?.secondTeam || "No Data"}
                                                    </td>
                                                    <td className="py-4 px-3">
                                                        {element.thirdPrize ? (
                                                            <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                                                                {element.thirdPrize}
                                                            </div>
                                                        ) : (
                                                            <p className="text-red-500 font-medium">No Data</p>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-3 text-gray-800 font-medium text-sm">
                                                        {element?.thirdTeam || "No Data"}
                                                    </td>
                                                    <td className="py-4 px-3">
                                                        <button
                                                            onClick={() => handleToggleStatus(element._id, isActive)}
                                                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105 ${
                                                                isActive
                                                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                                                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                                                            }`}
                                                            title={isActive ? 'Deactivate Result' : 'Activate Result'}
                                                        >
                                                            {isActive ? (
                                                                <>✖️Deactivate</>
                                                            ) : (
                                                                <>✅ Activate</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="text-center py-12">
                                                <div className="flex flex-col items-center">
                                                    <div className="text-6xl mb-4">🔍</div>
                                                    <p className="text-gray-500 text-xl font-medium">No results found</p>
                                                    <p className="text-gray-400 text-sm mt-2">
                                                        {searchQuery 
                                                            ? 'Try adjusting your search terms' 
                                                            : statusFilter !== 'all' 
                                                                ? `No ${statusFilter} results available`
                                                                : 'No results have been published yet'
                                                        }
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster 
                toastOptions={{
                    style: {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        padding: '16px',
                    },
                }}
            />
        </>
    );
}

export default AllResult;


// 'use client';

// import React, { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// function AllResult() {
//     const [results, setResults] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await toast.promise(
//                     fetch('/api/all-result').then(res => res.json()),
//                     {
//                         loading: 'Loading results...',
//                         success: "All results fetched successfully",
//                         error: (err) => err?.message || 'Something went wrong'
//                     }
//                 );
                
//                 if (response.success && response.data) {
//                     setResults(response.data);
//                 }
//             } catch (error) {
//                 console.log(error);
//                 toast.error('Failed to fetch results');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     // Filter results based on search query
//     const filteredResults = results.filter(
//         (element) =>
//             element.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             element.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             element.firstPrize?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             element.secondPrize?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             element.thirdPrize?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     // Download PDF handler
//     const handleDownloadPDF = () => {
//         const doc = new jsPDF();

//         const tableColumn = ["No.", "Category", "Item", "First Prize", "First Team", "Second Prize", "Second Team", "Third Prize", "Third Team"];
//         const tableRows = [];

//         filteredResults.forEach((element, index) => {
//             const rowData = [
//                 index + 1,
//                 element?.category || "N/A",
//                 element?.item || "N/A",
//                 element?.firstPrize || "No Data",
//                 element?.firstTeam || "No Data",
//                 element?.secondPrize || "No Data",
//                 element?.secondTeam || "No Data",
//                 element?.thirdPrize || "No Data",
//                 element?.thirdTeam || "No Data"
//             ];
//             tableRows.push(rowData);
//         });

//         autoTable(doc, {
//             head: [tableColumn],
//             body: tableRows,
//             startY: 20,
//             styles: { fontSize: 8 },
//             headStyles: { fillColor: [100, 50, 200] }
//         });

//         doc.save("All_Results.pdf");
//         toast.success("PDF downloaded successfully!");
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
//                     <p className="mt-4 text-purple-600 font-semibold">Loading results...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
//                 <div className="max-w-7xl mx-auto">
//                     {/* Header Section */}
//                     <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
//                         <div className="text-center mb-6">
//                             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
//                                 🏆 Published Results
//                             </h1>
//                             <p className="text-gray-600 text-lg">View and download competition results</p>
//                             <p className="text-sm text-gray-500 mt-2">Total Results: {results.length}</p>
//                         </div>

//                         {/* Search and Download Section */}
//                         <div className="flex flex-col md:flex-row gap-4 items-center">
//                             <div className="relative flex-1">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                     </svg>
//                                 </div>
//                                 <input
//                                     type="text"
//                                     placeholder="🔍 Search by Category, Item, Prize, or Team..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
//                                 />
//                             </div>
//                             <button
//                                 onClick={handleDownloadPDF}
//                                 disabled={filteredResults.length === 0}
//                                 className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-200 flex items-center gap-2"
//                             >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                 </svg>
//                                 Download PDF
//                             </button>
//                         </div>
//                     </div>

//                     {/* Results Table */}
//                     <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full">
//                                 <thead className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
//                                     <tr>
//                                         <th className="py-4 px-6 text-left text-white font-bold text-sm uppercase tracking-wider">
//                                             #
//                                         </th>
//                                         <th className="py-4 px-6 text-left text-white font-bold text-sm uppercase tracking-wider">
//                                             🏷️ Category
//                                         </th>
//                                         <th className="py-4 px-6 text-left text-white font-bold text-sm uppercase tracking-wider">
//                                             🎯 Item
//                                         </th>
//                                         <th className="py-4 px-6 text-left text-white font-bold text-sm uppercase tracking-wider">
//                                             🥇 First Prize
//                                         </th>
//                                         <th className="py-4 px-6 text-left text-white font-bold text-sm uppercase tracking-wider">
//                                             🏅 First Team
//                                         </th>
//                                         <th className="py-4 px-6 text-left text-white font-bold text-sm uppercase tracking-wider">
//                                             🥈 Second Prize
//                                         </th>
//                                         <th className="py-4 px-6 text-left text-white font-bold text-sm uppercase tracking-wider">
//                                             🏅 Second Team
//                                         </th>
//                                         <th className="py-4 px-6 text-left text-white font-bold text-sm uppercase tracking-wider">
//                                             🥉 Third Prize
//                                         </th>
//                                         <th className="py-4 px-6 text-left text-white font-bold text-sm uppercase tracking-wider">
//                                             🏅 Third Team
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-100">
//                                     {filteredResults.length > 0 ? (
//                                         filteredResults.map((element, index) => (
//                                             <tr 
//                                                 key={element._id || index} 
//                                                 className={`${
//                                                     index % 2 === 1 
//                                                         ? "bg-gradient-to-r from-purple-25 via-blue-25 to-indigo-25" 
//                                                         : "bg-white"
//                                                 } hover:bg-gradient-to-r hover:from-purple-50 hover:via-blue-50 hover:to-indigo-50 transition-all duration-200`}
//                                             >
//                                                 <td className="py-4 px-6">
//                                                     <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                                                         {index + 1}
//                                                     </div>
//                                                 </td>
//                                                 <td className="py-4 px-6 text-gray-800 font-medium">
//                                                     {element?.category || "N/A"}
//                                                 </td>
//                                                 <td className="py-4 px-6 text-gray-800 font-medium">
//                                                     {element?.item || "N/A"}
//                                                 </td>
//                                                 <td className="py-4 px-6">
//                                                     {element.firstPrize ? (
//                                                         <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
//                                                             {element.firstPrize}
//                                                         </div>
//                                                     ) : (
//                                                         <p className="text-red-500 font-medium">No Data</p>
//                                                     )}
//                                                 </td>
//                                                 <td className="py-4 px-6 text-gray-800 font-medium">
//                                                     {element?.firstTeam || "No Data"}
//                                                 </td>
//                                                 <td className="py-4 px-6">
//                                                     {element.secondPrize ? (
//                                                         <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
//                                                             {element.secondPrize}
//                                                         </div>
//                                                     ) : (
//                                                         <p className="text-red-500 font-medium">No Data</p>
//                                                     )}
//                                                 </td>
//                                                 <td className="py-4 px-6 text-gray-800 font-medium">
//                                                     {element?.secondTeam || "No Data"}
//                                                 </td>
//                                                 <td className="py-4 px-6">
//                                                     {element.thirdPrize ? (
//                                                         <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
//                                                             {element.thirdPrize}
//                                                         </div>
//                                                     ) : (
//                                                         <p className="text-red-500 font-medium">No Data</p>
//                                                     )}
//                                                 </td>
//                                                 <td className="py-4 px-6 text-gray-800 font-medium">
//                                                     {element?.thirdTeam || "No Data"}
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="9" className="text-center py-12">
//                                                 <div className="flex flex-col items-center">
//                                                     <div className="text-6xl mb-4">🔍</div>
//                                                     <p className="text-gray-500 text-xl font-medium">No results found</p>
//                                                     <p className="text-gray-400 text-sm mt-2">
//                                                         {searchQuery ? 'Try adjusting your search terms' : 'No results have been published yet'}
//                                                     </p>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Toaster 
//                 toastOptions={{
//                     style: {
//                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                         color: 'white',
//                         fontWeight: 'bold',
//                         borderRadius: '12px',
//                         padding: '16px',
//                     },
//                 }}
//             />
//         </>
//     );
// }

// export default AllResult;


