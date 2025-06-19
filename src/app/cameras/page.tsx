// "use client"
// import React, { useState } from 'react';
// import { Search, Camera, Wifi, WifiOff, Grid3X3, List, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Settings, Play, Pause, Filter, RefreshCw } from 'lucide-react';
// import {useCameras} from "@/hooks/useCameras"
// // Pagination Component
// const Pagination = ({ currentPage, totalPages, onPageChange, isLoading = false }) => {
//   const generatePageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5;
    
//     if (totalPages <= maxVisible) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         pages.push(1, 2, 3, 4, '...', totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//       } else {
//         pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
//       }
//     }
    
//     return pages;
//   };

//   const hasPrevious = currentPage > 1;
//   const hasNext = currentPage < totalPages;

//   return (
//     <div className="flex items-center justify-center gap-2">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={!hasPrevious || isLoading}
//         className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-300"
//       >
//         <ChevronLeft className="w-5 h-5 text-gray-600" />
//       </button>
      
//       <div className="flex items-center gap-1">
//         {generatePageNumbers().map((page, index) => (
//           <React.Fragment key={index}>
//             {page === '...' ? (
//               <span className="px-4 py-3 text-gray-400">...</span>
//             ) : (
//               <button
//                 onClick={() => onPageChange(page)}
//                 disabled={isLoading}
//                 className={`px-4 py-3 rounded-xl transition-all duration-200 font-medium disabled:cursor-not-allowed ${
//                   page === currentPage
//                     ? 'bg-blue-500 text-white shadow-lg hover:bg-blue-600'
//                     : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
//                 }`}
//               >
//                 {page}
//               </button>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
      
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={!hasNext || isLoading}
//         className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-300"
//       >
//         <ChevronRight className="w-5 h-5 text-gray-600" />
//       </button>
//     </div>
//   );
// };

// // Camera Card Component
// const CameraCard = ({ camera, viewMode }) => {
//   const [imageError, setImageError] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   const getStatusColor = (isActive, statusMessage) => {
//     if (!isActive) return 'text-red-500 bg-red-50 border-red-200';
//     if (statusMessage.toLowerCase().includes('recording')) return 'text-amber-600 bg-amber-50 border-amber-200';
//     return 'text-green-600 bg-green-50 border-green-200';
//   };

//   const getStatusIcon = (isActive, statusMessage) => {
//     if (!isActive) return <WifiOff className="w-3 h-3" />;
//     if (statusMessage.toLowerCase().includes('recording')) return <Play className="w-3 h-3" />;
//     return <Wifi className="w-3 h-3" />;
//   };

//   if (viewMode === 'list') {
//     return (
//       <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//               {!imageError ? (
//                 <img
//                   src={camera.snapshot}
//                   alt={camera.name}
//                   className="w-full h-full object-cover"
//                   onError={() => setImageError(true)}
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <Camera className="w-6 h-6 text-gray-400" />
//                 </div>
//               )}
//             </div>
//             <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${camera.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
//           </div>
          
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-gray-900 truncate">{camera.name}</h3>
//             <div className="flex items-center gap-2 mt-1">
//               <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(camera.is_active, camera.status_message)}`}>
//                 {getStatusIcon(camera.is_active, camera.status_message)}
//                 {camera.status_message}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-1">
//            {camera.tags.map((tag, index) => (
//                 <span key={`${tag?.id}-${index}`} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 transition-colors">
//                     {tag}
//                 </span>
//                 ))}
//           </div>

//           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//             <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//               <Eye className="w-4 h-4 text-gray-500" />
//             </button>
//             <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//               <Settings className="w-4 h-4 text-gray-500" />
//             </button>
//             <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//               <MoreHorizontal className="w-4 h-4 text-gray-500" />
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div 
//       className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-gray-300 hover:-translate-y-1"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="relative aspect-video bg-gray-100 overflow-hidden">
//         {!imageError ? (
//           <img
//             src={camera.snapshot}
//             alt={camera.name}
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//             onError={() => setImageError(true)}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center">
//             <Camera className="w-12 h-12 text-gray-400" />
//           </div>
//         )}
        
//         <div className={`absolute top-3 left-3 w-3 h-3 rounded-full border-2 border-white ${camera.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
        
//         <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
//           <div className="flex gap-2">
//             <button className="p-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200 hover:scale-110">
//               <Eye className="w-5 h-5 text-gray-700" />
//             </button>
//             <button className="p-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200 hover:scale-110">
//               <Settings className="w-5 h-5 text-gray-700" />
//             </button>
//           </div>
//         </div>
//       </div>
      
//       <div className="p-4">
//         <div className="flex items-start justify-between mb-3">
//           <h3 className="font-semibold text-gray-900 text-lg leading-tight">{camera.name}</h3>
//           <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
//             <MoreHorizontal className="w-4 h-4 text-gray-500" />
//           </button>
//         </div>
        
//         <div className="flex items-center gap-2 mb-3">
//           <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(camera.is_active, camera.status_message)}`}>
//             {getStatusIcon(camera.is_active, camera.status_message)}
//             {camera.status_message}
//           </span>
//         </div>
        
//         {camera.tags && camera.tags.length > 0 && (
//           <div className="flex flex-wrap gap-1.5">
//             {camera.tags.map(tag => (
//               <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 transition-colors">
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Search Bar Component
// const SearchBar = ({ search, setSearch, onSearch, isLoading }) => {
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       onSearch();
//     }
//   };

//   return (
//     <div className="relative">
//       <div className="relative">
//         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Search cameras by name or tags..."
//           className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
//         />
//         {isLoading && (
//           <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
//             <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Stats Card Component
// const StatsCard = ({ icon: Icon, label, value, color = "blue" }) => {
//   const colorClasses = {
//     blue: "text-blue-600 bg-blue-50 border-blue-200",
//     green: "text-green-600 bg-green-50 border-green-200",
//     red: "text-red-600 bg-red-50 border-red-200",
//     amber: "text-amber-600 bg-amber-50 border-amber-200"
//   };

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
//       <div className="flex items-center gap-3">
//         <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
//           <Icon className="w-5 h-5" />
//         </div>
//         <div>
//           <p className="text-2xl font-bold text-gray-900">{value}</p>
//           <p className="text-sm text-gray-600">{label}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Cameras Page Component
// export default function CamerasPage() {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState('');
//   const [viewMode, setViewMode] = useState('grid');
  
//   // Replace this with your actual useCameras hook
//   const { data, isLoading } = useCameras({ page, camera_name: search });
  

//   const handleSearch = () => {
//     setPage(1);
//      // Your search logic here - this will trigger the useCameras hook to refetch
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//      // Your pagination logic here - this will trigger the useCameras hook to refetch
//   };

//   // Calculate stats from current data
//   const activeCameras = data?.items?.filter(cam => cam.is_active).length || 0;
//   const inactiveCameras = data?.items?.filter(cam => !cam.is_active).length || 0;
//   const recordingCameras = data?.items?.filter(cam => cam.status_message.toLowerCase().includes('recording')).length || 0;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">📷 Camera Management</h1>
//               <p className="text-gray-600">Monitor and manage all surveillance cameras in the system</p>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-lg transition-all duration-200 ${
//                     viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'
//                   }`}
//                 >
//                   <Grid3X3 className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-lg transition-all duration-200 ${
//                     viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'
//                   }`}
//                 >
//                   <List className="w-4 h-4" />
//                 </button>
//               </div>
              
//               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
//                 <Filter className="w-4 h-4 text-gray-500" />
//                 <span className="text-gray-700">Filter</span>
//               </button>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             <StatsCard icon={Camera} label="Total Cameras" value={data?.total || 0} color="blue" />
//             <StatsCard icon={Wifi} label="Active Cameras" value={activeCameras} color="green" />
//             <StatsCard icon={WifiOff} label="Inactive Cameras" value={inactiveCameras} color="red" />
//             <StatsCard icon={Play} label="Recording" value={recordingCameras} color="amber" />
//           </div>

//           {/* Search Bar */}
//           <SearchBar 
//             search={search}
//             setSearch={setSearch}
//             onSearch={handleSearch}
//             isLoading={isLoading}
//           />
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="flex items-center justify-center py-12">
//             <div className="flex items-center gap-3 text-gray-600">
//               <RefreshCw className="w-6 h-6 animate-spin" />
//               <span>Loading cameras...</span>
//             </div>
//           </div>
//         )}

//         {/* Content */}
//         {!isLoading && (
//           <>
//             {/* Results Info */}
//             <div className="flex items-center justify-between mb-6">
//               <p className="text-gray-600">
//                 Showing {data?.items?.length || 0} of {data?.total || 0} cameras
//               </p>
//               <p className="text-sm text-gray-500">
//                 Page {data?.page || 1} of {data?.pages || 1}
//               </p>
//             </div>

//             {/* Cameras Grid/List */}
//             {data?.items && data.items.length > 0 ? (
//               <div className={`mb-8 ${
//                 viewMode === 'grid' 
//                   ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
//                   : 'space-y-4'
//               }`}>
//                 {data.items.map((camera) => (
//                   <CameraCard key={camera.id} camera={camera} viewMode={viewMode} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No cameras found</h3>
//                 <p className="text-gray-600">No cameras match your search criteria</p>
//               </div>
//             )}

//             {/* Pagination */}
//             {data?.total > 0 && data?.pages > 1 && (
//               <div className="flex justify-center">
//                 <Pagination
//                   currentPage={data.page}
//                   totalPages={data.pages}
//                   onPageChange={handlePageChange}
//                   isLoading={isLoading}
//                 />
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }








"use client";

import React, { useState } from 'react';
import { Search, Camera, Wifi, WifiOff, Grid3X3, List, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Settings, Play, Pause, Filter, RefreshCw } from 'lucide-react';
import { useCameras } from '@/hooks/useCameras'; 
import  CameraCard  from '@/components/CameraCard';
import Pagination from '@/components/Pagination';  


   const getStatusColor = (isActive, statusMessage) => {
        if (!isActive) return 'text-red-500 bg-red-50 border-red-200';
        if (statusMessage.toLowerCase().includes('recording')) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-green-600 bg-green-50 border-green-200';
    };

    const getStatusIcon = (isActive, statusMessage) => {
        if (!isActive) return <WifiOff className="w-3 h-3" />;
        if (statusMessage.toLowerCase().includes('recording')) return <Play className="w-3 h-3" />;
        return <Wifi className="w-3 h-3" />;
    };
  
// Search Bar Component
const SearchBar = ({ search, setSearch, onSearch, isLoading }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search cameras by name or tags..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color = "blue" }) => {
    const colorClasses = {
        blue: "text-blue-600 bg-blue-50 border-blue-200",
        green: "text-green-600 bg-green-50 border-green-200",
        red: "text-red-600 bg-red-50 border-red-200",
        amber: "text-amber-600 bg-amber-50 border-amber-200"
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-600">{label}</p>
                </div>
            </div>
        </div>
    );
};

// Main Cameras Page Component
export default function CamerasPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const { data, isLoading } = useCameras({ page, camera_name: search });

    const handleSearch = () => {
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Calculate stats from current data
    const activeCameras = data?.items?.filter(cam => cam.is_active).length || 0;
    const inactiveCameras = data?.items?.filter(cam => !cam.is_active).length || 0;
    const recordingCameras = data?.items?.filter(cam => cam.status_message.toLowerCase().includes('recording')).length || 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2"> Camera Management</h1>
                            <p className="text-gray-600">Monitor and manage all surveillance cameras in the system</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatsCard icon={Camera} label="Total Cameras" value={data?.total || 0} color="blue" />
                        <StatsCard icon={Wifi} label="Active Cameras" value={activeCameras} color="green" />
                        <StatsCard icon={WifiOff} label="Inactive Cameras" value={inactiveCameras} color="red" />
                        <StatsCard icon={Play} label="Recording" value={recordingCameras} color="amber" />
                    </div>

                    {/* Search Bar */}
                    <SearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearch={handleSearch}
                        isLoading={isLoading}
                    />
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3 text-gray-600">
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            <span>Loading cameras...</span>
                        </div>
                    </div>
                )}

                {/* Content */}
                {!isLoading && (
                    <>
                        {/* Results Info */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Showing {(data?.items?.length * data?.page) || 0} of {data?.total || 0} cameras
                            </p>
                            <p className="text-sm text-gray-500">
                                Page {data?.page || 1} of {data?.pages || 1}
                            </p>
                        </div>

                        {/* Cameras Grid/List */}
                        {data?.items && data.items.length > 0 ? (
                            <div className={`mb-8 ${viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'space-y-4'
                                }`}>
                                {data.items.map((camera) => (
                                               <CameraCard key={camera.id} camera={camera} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No cameras found</h3>
                                <p className="text-gray-600">No cameras match your search criteria</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {data?.total > 0 && data?.pages > 1 && (
                            <div className="flex justify-center">
                                <Pagination
                                    currentPage={data.page}
                                    totalPages={data.pages}
                                    onPageChange={handlePageChange}
                                    isLoading={isLoading}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}