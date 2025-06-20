"use client";
import React, { useState } from "react";
import {
  DemographicsConfig,
  DemographicsConfigApi,
  Genders,
  Ages,
  Emotions,
  EthnicGroups,
} from "../types/demographics";
import { useCameraDetails } from "../hooks/useCameraDetails";
import { useCreateOrUpdateDemographicsConfig } from "../hooks/useCreateOrUpdateDemographicsConfig";
import { useUpdateCamera } from "../hooks/useUpdateCamera";
import { useTags } from "../hooks/useTags";
import { Skeleton } from "./Skeleton";

// Remove legacy Camera type and update CameraSidebarProps
type CameraSidebarProps = {
  camera: { id: string } | null;
  open: boolean;
  onClose: () => void;
  onUpdate?: (updated: any) => void;
  demographics?: DemographicsConfig;
  onUpdateDemographics?: (cameraId: string, config: DemographicsConfig) => void;
};

const CameraDetails: React.FC<CameraSidebarProps> = ({
  camera,
  open,
  onClose,
  onUpdate,
  demographics,
  onUpdateDemographics,
}) => {
  // Animation for switching between cameras
  const [animKey, setAnimKey] = React.useState(0);
  React.useEffect(() => {
    if (open && camera) {
      setAnimKey((k) => k + 1);
    }
  }, [camera?.id, open]);

  // Toast auto-hide
  const [toast, setToast] = useState<string | null>(null);
  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Fetch camera details from API with auto-refresh every 30s
  const {
    data: cameraData,
    isLoading: isCameraLoading,
    isError: isCameraError,
    error: cameraError,
    refetch: refetchCamera,
  } = useCameraDetails(camera?.id ?? "", { refetchInterval: 30000 });
  // Demographics config API
  const demographicsConfig = cameraData?.demographics_config;
  const demographicsConfigId = demographicsConfig?.id;
  const createOrUpdateDemoMutation = useCreateOrUpdateDemographicsConfig(
    !!demographicsConfigId,
    demographicsConfigId
  );

  // Demographics config state
  const [demoEditMode, setDemoEditMode] = useState(false);
  const [demoForm, setDemoForm] = useState<DemographicsConfigApi | null>(null);
  const [demoErrors, setDemoErrors] = useState<any>({});

  React.useEffect(() => {
    if (cameraData) {
      setDemoForm(cameraData.demographics_config);
      setDemoEditMode(false);
      setDemoErrors({});
    } else {
      setDemoForm(null);
      setDemoEditMode(false);
      setDemoErrors({});
    }
  }, [cameraData, demographics, camera]);

  // Demographics config fields for create/update
  const demoFields = [
    {
      key: "track_history_max_length",
      label: "Track History Max Length",
      type: "number",
      min: 1,
      max: 100,
    },
    {
      key: "exit_threshold",
      label: "Exit Threshold",
      type: "number",
      min: 1,
      max: 300,
    },
    {
      key: "min_track_duration",
      label: "Min Track Duration",
      type: "number",
      min: 1,
      max: 60,
    },
    {
      key: "detection_confidence_threshold",
      label: "Detection Confidence Threshold",
      type: "number",
      step: 0.01,
      min: 0.1,
      max: 1.0,
    },
    {
      key: "demographics_confidence_threshold",
      label: "Demographics Confidence Threshold",
      type: "number",
      step: 0.01,
      min: 0.1,
      max: 1.0,
    },
    {
      key: "min_track_updates",
      label: "Min Track Updates",
      type: "number",
      min: 1,
      max: 100,
    },
    {
      key: "box_area_threshold",
      label: "Box Area Threshold",
      type: "number",
      step: 0.01,
      min: 0.05,
      max: 1.0,
    },
    {
      key: "save_interval",
      label: "Save Interval",
      type: "number",
      min: 300,
      max: 1800,
    },
    {
      key: "frame_skip_interval",
      label: "Frame Skip Interval",
      type: "number",
      step: 0.01,
      min: 0.1,
      max: 5.0,
    },
  ];

  function validateDemo(form: any) {
    const err: any = {};
    demoFields.forEach((f) => {
      if (
        form[f.key] !== undefined &&
        form[f.key] !== null &&
        form[f.key] !== ""
      ) {
        const val = Number(form[f.key]);
        if (isNaN(val)) err[f.key] = "Must be a number";
        if (f.min !== undefined && val < f.min) err[f.key] = `Min ${f.min}`;
        if (f.max !== undefined && val > f.max) err[f.key] = `Max ${f.max}`;
      }
    });
    return err;
  }

  function handleDemoChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setDemoForm({ ...demoForm!, [e.target.name]: e.target.value });
  }

  function handleDemoSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateDemo(demoForm!);
    setDemoErrors(v);
    if (Object.keys(v).length > 0) {
      setToast("Please fix the errors in demographics form.");
      return;
    }
    setDemoEditMode(false);
    createOrUpdateDemoMutation.mutate(
      { ...demoForm, camera_id: cameraData.id },
      {
        onSuccess: () => {
          setDemoEditMode(false);
          setToast("Demographics configuration saved!");
        },
        onError: (err: any) => {
          setToast(
            err?.response?.data?.detail || "Failed to save demographics config."
          );
        },
      }
    );
  }

  const updateFields = [
    { key: "name", label: "Name", type: "text" },
    { key: "rtsp_url", label: "RTSP URL", type: "text" },
    {
      key: "stream_frame_width",
      label: "Frame Width",
      type: "number",
      min: 1,
      max: 2560,
    },
    {
      key: "stream_frame_height",
      label: "Frame Height",
      type: "number",
      min: 1,
      max: 2560,
    },
    {
      key: "stream_max_length",
      label: "Max Length",
      type: "number",
      min: 0,
      max: 10000,
    },
    {
      key: "stream_quality",
      label: "Quality",
      type: "number",
      min: 80,
      max: 100,
    },
    { key: "stream_fps", label: "FPS", type: "number", min: 1, max: 120 },
    {
      key: "stream_skip_frames",
      label: "Skip Frames",
      type: "number",
      min: 0,
      max: 100,
    },
  ];

  const { data: tagsData, isLoading: isTagsLoading } = useTags();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const updateCameraMutation = useUpdateCamera();

  React.useEffect(() => {
    if (cameraData) {
      setForm({
        name: cameraData.name,
        rtsp_url: cameraData.rtsp_url,
        stream_frame_width: cameraData.stream_frame_width,
        stream_frame_height: cameraData.stream_frame_height,
        stream_max_length: cameraData.stream_max_length,
        stream_quality: cameraData.stream_quality,
        stream_fps: cameraData.stream_fps,
        stream_skip_frames: cameraData.stream_skip_frames,
        tags: cameraData.tags?.map((t: any) => t.id) || [],
      });
      setEditMode(false);
      setErrors({});
    }
  }, [cameraData]);

  function validate(form: any) {
    const newErrors: any = {};
    updateFields.forEach((f) => {
      if (f.type === "number") {
        if (
          form[f.key] !== undefined &&
          form[f.key] !== null &&
          form[f.key] !== ""
        ) {
          const val = Number(form[f.key]);
          if (isNaN(val)) newErrors[f.key] = "Must be a number";
          if (f.min !== undefined && val < f.min)
            newErrors[f.key] = `Min ${f.min}`;
          if (f.max !== undefined && val > f.max)
            newErrors[f.key] = `Max ${f.max}`;
        }
      } else {
        if (!form[f.key] || form[f.key].toString().trim() === "")
          newErrors[f.key] = "Required";
      }
    });
    return newErrors;
  }
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      setToast("Please fix the errors in the form.");
      return;
    }
    setLoading(true);
    updateCameraMutation.mutate(
      { cameraId: cameraData.id, payload: form },
      {
        onSuccess: () => {
          setLoading(false);
          setEditMode(false);
          setToast("Camera updated successfully!");
        },
        onError: (err: any) => {
          setLoading(false);
          setToast(err?.response?.data?.detail || "Failed to update camera.");
        },
      }
    );
  }

  if (isCameraLoading) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <Skeleton className="w-40 h-8 mb-2" />
        </div>
        <div className="mb-4">
          <Skeleton className="w-full h-6 mb-2" />
        </div>
        <div className="mb-4">
          <Skeleton className="w-full h-6 mb-2" />
        </div>
        <div className="mb-4">
          <Skeleton className="w-1/2 h-6 mb-2" />
        </div>
        <div className="mb-4">
          <Skeleton className="w-1/3 h-6 mb-2" />
        </div>
        <div className="mb-4">
          <Skeleton className="w-1/4 h-6 mb-2" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[600px] max-w-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-l border-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ boxShadow: open ? "-8px 0 32px 0 rgba(0,0,0,0.5)" : undefined }}
    >
      <div className="flex justify-between items-center px-8 py-6 border-b border-white">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Camera Details
        </h2>
        <button
          onClick={onClose}
          className="text-white text-3xl font-bold hover:text-pink-400 transition-colors"
        >
          &times;
        </button>
      </div>
      {toast && (
        <div className="fixed top-8 right-8 z-[100] bg-pink-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fadein">
          {toast}
        </div>
      )}
      {isCameraLoading ? (
        <div className="p-8 text-zinc-400">Loading camera details...</div>
      ) : isCameraError ? (
        <div className="p-8 text-pink-400">
          {cameraError?.message || "Failed to load camera details."}
        </div>
      ) : cameraData ? (
        <div
          key={animKey}
          className="p-8 text-white space-y-8 overflow-y-auto h-[calc(100vh-80px)] animate-fadein"
        >
          {/* Camera Info */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-pink-400">
              Camera Info
            </h3>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="space-y-3 flex-1">
                <div>
                  <span className="font-semibold">ID:</span> {cameraData.id}
                </div>
                {editMode ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {updateFields.map((f) => (
                      <div key={f.key} className="flex flex-col">
                        <label className="font-semibold mb-1">{f.label}:</label>
                        <input
                          name={f.key}
                          type={f.type}
                          value={form[f.key] ?? ""}
                          onChange={handleChange}
                          min={f.min}
                          max={f.max}
                          className="px-2 py-1 rounded bg-zinc-800 border border-pink-400 text-white"
                          disabled={loading}
                        />
                        {errors[f.key] && (
                          <span className="text-pink-300 text-xs">
                            {errors[f.key]}
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="flex flex-col">
                      <label className="font-semibold mb-1">Tags:</label>
                      {isTagsLoading ? (
                        <span className="text-zinc-400">Loading tags...</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {tagsData?.map((tag: any) => (
                            <label
                              key={tag.id}
                              className="flex items-center gap-2 mb-1 cursor-pointer"
                              style={{
                                background: tag.color + "22",
                                borderRadius: 6,
                                padding: "2px 8px",
                              }}
                            >
                              <input
                                type="checkbox"
                                value={tag.id}
                                checked={form.tags?.includes(tag.id)}
                                onChange={(e) => {
                                  let newTags = form.tags || [];
                                  if (e.target.checked) {
                                    newTags = [...newTags, tag.id];
                                  } else {
                                    newTags = newTags.filter(
                                      (id: string) => id !== tag.id
                                    );
                                  }
                                  setForm({ ...form, tags: newTags });
                                }}
                                className="accent-pink-500"
                              />
                              <span
                                style={{
                                  color: "#fff",
                                  fontWeight: 700,
                                  textShadow: "0 1px 2px #000",
                                }}
                              >
                                {tag.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                      {errors.tags && (
                        <span className="text-pink-300 text-xs">
                          {errors.tags}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold shadow disabled:opacity-60"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        className="px-6 py-2 rounded bg-zinc-700 text-white font-bold shadow border border-pink-400 hover:bg-zinc-800"
                        onClick={() => {
                          setEditMode(false);
                          setErrors({});
                          setForm({ ...cameraData });
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold">Name:</span>{" "}
                      {cameraData.name}
                    </div>
                    <div>
                      <span className="font-semibold">RTSP URL:</span>{" "}
                      {cameraData.rtsp_url}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span>{" "}
                      {cameraData.is_active ? (
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white">
                          Active
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-zinc-700 text-white">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">Status Message:</span>{" "}
                      {cameraData.status_message}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cameraData.tags?.map((tag: any) => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: tag.color, color: "#222" }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <div>
                      <span className="font-semibold">Created At:</span>{" "}
                      {new Date(cameraData.created_at).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-semibold">Updated At:</span>{" "}
                      {new Date(cameraData.updated_at).toLocaleString()}
                    </div>
                    <button
                      className="mt-4 px-4 py-1 rounded bg-pink-600 hover:bg-pink-500 text-white font-bold shadow"
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              {cameraData.snapshot && (
                <img
                  src={cameraData.snapshot}
                  alt="Snapshot"
                  className="w-40 h-32 rounded-xl object-cover border-2 border-pink-400 bg-zinc-800 shadow-lg"
                />
              )}
            </div>
          </div>
          <hr className="border-t-2 border-pink-400/30 my-4" />
          {/* Stream Specs Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-pink-400 mb-4">
              Stream Specs
            </h3>
            <div className="grid grid-cols-2 gap-6 text-base">
              <div>
                <span className="font-semibold">Frame Width:</span>{" "}
                {cameraData.stream_frame_width}
              </div>
              <div>
                <span className="font-semibold">Frame Height:</span>{" "}
                {cameraData.stream_frame_height}
              </div>
              <div>
                <span className="font-semibold">Max Length:</span>{" "}
                {cameraData.stream_max_length}
              </div>
              <div>
                <span className="font-semibold">Quality:</span>{" "}
                {cameraData.stream_quality}
              </div>
              <div>
                <span className="font-semibold">FPS:</span>{" "}
                {cameraData.stream_fps}
              </div>
              <div>
                <span className="font-semibold">Skip Frames:</span>{" "}
                {cameraData.stream_skip_frames}
              </div>
            </div>
          </div>
          <hr className="border-t-2 border-pink-400/30 my-4" />
          {/* Demographics Config Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-pink-400">
                Demographics Config
              </h3>
              {!demoEditMode && (
                <button
                  className="px-4 py-1 rounded bg-pink-600 hover:bg-pink-500 text-white font-bold shadow"
                  onClick={() => {
                    setDemoEditMode(true);
                    setDemoForm(cameraData.demographics_config || {});
                  }}
                >
                  {cameraData.demographics_config ? "Edit" : "Add"}
                </button>
              )}
            </div>
            {demoEditMode ? (
              <form
                onSubmit={handleDemoSubmit}
                className="grid grid-cols-2 gap-6 text-base"
              >
                {demoFields.map((f) => (
                  <div key={f.key} className="flex flex-col">
                    <label className="font-semibold mb-1">{f.label}:</label>
                    <input
                      name={f.key}
                      type={f.type}
                      // @ts-expect-error: dynamic key access for demo fields
                      value={demoForm?.[f.key] ?? ""}
                      onChange={handleDemoChange}
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      className="px-2 py-1 rounded bg-zinc-800 border border-pink-400 text-white"
                    />
                    {demoErrors[f.key] && (
                      <span className="text-pink-300 text-xs">
                        {demoErrors[f.key]}
                      </span>
                    )}
                  </div>
                ))}
                <div className="col-span-2 flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold shadow"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 rounded bg-zinc-700 text-white font-bold shadow border border-pink-400 hover:bg-zinc-800"
                    onClick={() => setDemoEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : cameraData.demographics_config ? (
              <div className="grid grid-cols-2 gap-6 text-base">
                {demoFields.map((f) => (
                  <div key={f.key}>
                    <span className="font-semibold">{f.label}:</span>{" "}
                    {cameraData.demographics_config?.[f.key] ?? "-"}
                  </div>
                ))}
                <div>
                  <span className="font-semibold">Config ID:</span>{" "}
                  {cameraData.demographics_config.id}
                </div>
                <div>
                  <span className="font-semibold">Created At:</span>{" "}
                  {cameraData.demographics_config.created_at
                    ? new Date(
                        cameraData.demographics_config.created_at
                      ).toLocaleString()
                    : "-"}
                </div>
                <div>
                  <span className="font-semibold">Updated At:</span>{" "}
                  {cameraData.demographics_config.updated_at
                    ? new Date(
                        cameraData.demographics_config.updated_at
                      ).toLocaleString()
                    : "-"}
                </div>
              </div>
            ) : (
              <div className="text-zinc-400">
                No demographics configuration set.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-zinc-400">No camera selected.</div>
      )}
    </div>
  );
};

export default CameraDetails;
