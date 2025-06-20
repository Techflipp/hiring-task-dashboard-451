 


"use client";

import React, { useState, useCallback } from 'react';
import { Search, Camera, Wifi, WifiOff, Grid3X3, List, Play, RefreshCw } from 'lucide-react';
import { useCameras } from '@/hooks/useCameras';
import CameraCard from '@/components/CameraCard';
import Pagination from '@/components/Pagination';

// Define types
interface Camera {
    id: string;
    is_active: boolean;
    status_message: string;
    // ... other camera properties
}

interface UseCamerasResult {
    data: {
        items: Camera[];
        total: number;
        page: number;
        pages: number;
    } | undefined;
    isLoading: boolean;
}

interface SearchBarProps {
    search: string;
    setSearch: (search: string) => void;
    onSearch: () => void;
    isLoading: boolean;
}

interface StatsCardProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: number;
    color?: "blue" | "green" | "red" | "amber";
}

// Utility function to determine status color and icon
const getCameraStatus = (isActive: boolean, statusMessage: string) => {
    if (!isActive) return { color: 'text-red-500 bg-red-50 border-red-200', icon: <WifiOff className="w-3 h-3" /> };
    if (statusMessage.toLowerCase().includes('recording')) return { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Play className="w-3 h-3" /> };
    return { color: 'text-green-600 bg-green-50 border-green-200', icon: <Wifi className="w-3 h-3" /> };
};

// Search Bar Component
const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch, onSearch, isLoading }) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, color = "blue" }) => {
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { data, isLoading }: UseCamerasResult = useCameras({ page, camera_name: search });

    const handleSearch = useCallback(() => {
        setPage(1);
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

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