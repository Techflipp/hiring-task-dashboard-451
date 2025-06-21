"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getCameraDetails, updateCamera } from "@/services/cameras";
import { useQuery } from "@tanstack/react-query";

export default function EditCameraPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    rtsp_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["camera", id],
    queryFn: () => getCameraDetails(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      const { name, rtsp_url } = data;
      setForm({ name, rtsp_url });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.rtsp_url) newErrors.rtsp_url = "RTSP URL is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await updateCamera(id, form);
      toast.success("Camera updated successfully");
      router.push("/cameras");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update camera");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Camera</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading camera data...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1">RTSP URL</label>
            <input name="rtsp_url" value={form.rtsp_url} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            {errors.rtsp_url && <p className="text-red-500 text-sm mt-1">{errors.rtsp_url}</p>}
          </div>

          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}
