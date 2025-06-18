"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchCameraDetails } from "@/lib/api";
import { Camera, DemographicsConfig } from "@/lib/types";

const CameraDetailPageHooks = () => {

    const params = useParams();
    const id = params.id as string;
    const [camera, setCamera] = useState<Camera | null>(null);
    const [config, setConfig] = useState<DemographicsConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("details");
  
    useEffect(() => {
      if (!id) return;
  
      const loadData = async () => {
        setLoading(true);
        try {
          const cameraData = await fetchCameraDetails(id);
          setCamera(cameraData);        
          if (cameraData?.demographics_config) {
            setConfig(cameraData?.demographics_config);
          } else {
            setConfig(null);
          }
          
          setError(null);
        } catch (err) {
          setError("Failed to load camera data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, [id]);
  
    const handleCreateConfig = async () => {
      try {
        setLoading(true);
        const newConfig = {
          camera_id: id,
          track_history_max_length: 30,
          exit_threshold: 60,
          min_track_duration: 5,
          detection_confidence_threshold: 0.7,
          demographics_confidence_threshold: 0.8,
          min_track_updates: 10,
          box_area_threshold: 0.2,
          save_interval: 600,
          frame_skip_interval: 1.0
        };
        setConfig(newConfig);
        setActiveTab("config");
        setError(null);
      } catch (err) {
        setError("Failed to create configuration");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  return {
    camera,
    config,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleCreateConfig,
    id
  }
}

export default CameraDetailPageHooks