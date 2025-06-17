import React, { useState, useEffect } from "react";
import { fetchCameras } from "@/lib/api";
import { Camera } from "@/lib/types";

const CamerasPageHook = () => {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const loadCameras = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCameras(page, pageSize, searchTerm);
        setCameras(data.items);
        setTotalPages(data.pages);
        setError(null);
  
        if (page > data.pages && data.pages > 0) {
          setPage(data.pages);
        }
      } catch (err) {
        setError("Failed to load cameras. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      loadCameras();
    }, [page, pageSize, searchTerm]);
  
    const handlePageSizeChange = (newSize: number) => {
      setPageSize(newSize);
      setPage(1);
    };
  
    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setPage(1);
      loadCameras();
    };
  return {
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
  }
}

export default CamerasPageHook