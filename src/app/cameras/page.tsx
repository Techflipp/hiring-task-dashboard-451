"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import CameraCard from "@/components/CameraCard";
import Link from "next/link";
import CamerasPageHook from "@/hooks/CamerasPageHook";
import { IoMdRefresh } from "react-icons/io";

const CamerasPage = () => {
 
  const {
    cameras,
    page,
    pageSize,
    totalPages,
    searchTerm,
    isLoading,
    error,
    handlePageSizeChange,
    handleSearch,
    setPage,
    loadCameras,
    setSearchTerm
  } = CamerasPageHook();

  return (
    <div className="container mx-auto px-4 py-12  ">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-4 mb-8">
        <div className="flex items-center">
          <Link href={"/"} className="mr-2 p-2 rounded-full hover:bg-gray-100">
            <FiChevronLeft size={24} />
          </Link>

          <h1 className="sm:text-3xl text-xl font-bold text-gray-800">
            Camera Management
          </h1>
        </div>

        <div className="flex gap-4">
          <form onSubmit={handleSearch} className="relative  w-full sm:w-auto">
            <div className="p-5 overflow-hidden w-full sm:w-[60px] h-[60px] bg-[#4070f4] shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center transition-all duration-300 focus-within:sm:w-[270px] hover:sm:w-[270px]">
              <div className="flex items-center justify-center fill-white">
                <FiSearch className="text-2xl text-white" />
              </div>
              <input
                type="text"
                className="outline-none text-[20px] bg-transparent w-full text-white font-normal px-4"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cameras..."
                value={searchTerm}
              />
            </div>
          </form>

          <button
            onClick={() => {
              setPage(1);
              loadCameras();
            }}
            className="flex items-center justify-center px-5 py-3 bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 text-white rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <IoMdRefresh />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse h-64"
            />
          ))}
        </div>
      ) : (
        <>
          {cameras.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700">
                No cameras found
              </h3>
              <p className="text-gray-500 mt-2">
                {searchTerm
                  ? `No cameras match your search for "${searchTerm}"`
                  : "No cameras available. Try adding a new camera."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cameras.map((camera) => (
                  <motion.div
                    key={camera.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CameraCard camera={camera} />
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Items per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(Number(e.target.value))
                    }
                    className="border rounded px-2 py-1 text-sm "
                  >
                    {[10, 25, 50].map((size) => (
                      <option key={size} value={size} >
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CamerasPage;