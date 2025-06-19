"use client"
 import React, { useState, useEffect } from 'react';
import { Camera, Settings, Wifi, WifiOff, Save, X, AlertCircle, CheckCircle, Tag, Eye, EyeOff } from 'lucide-react';
import { useUpdateCamera } from '@/hooks/useUpdateCamera';
import { useRouter } from 'next/navigation';
// Zod-like validation schema (simplified)
const createCameraSchema = () => {
  const z = {
    object: (schema) => ({
      parse: (data) => {
        const errors = {};
        Object.keys(schema).forEach(key => {
          try {
            schema[key].parse(data[key]);
          } catch (error) {
            errors[key] = error.message;
          }
        });
        if (Object.keys(errors).length > 0) {
          throw { errors };
        }
        return data;
      }
    }),
    string: () => ({
      min: (length) => ({
        parse: (value) => {
          if (typeof value !== 'string' || value.length < length) {
            throw new Error(`Must be at least ${length} characters`);
          }
          return value;
        }
      }),
      parse: (value) => {
        if (typeof value !== 'string') {
          throw new Error('Must be a valid string');
        }
        return value;
      }
    }),
    number: () => ({
      min: (min) => ({
        max: (max) => ({
          parse: (value) => {
            const num = Number(value);
            if (isNaN(num) || num < min || num > max) {
              throw new Error(`Must be between ${min} and ${max}`);
            }
            return num;
          }
        }),
        parse: (value) => {
          const num = Number(value);
          if (isNaN(num) || num < min) {
            throw new Error(`Must be ${min} or greater`);
          }
          return num;
        }
      }),
      parse: (value) => {
        const num = Number(value);
        if (isNaN(num)) {
          throw new Error('Must be a valid number');
        }
        return num;
      }
    }),
    boolean: () => ({
      parse: (value) => {
        if (typeof value !== 'boolean') {
          throw new Error('Must be true or false');
        }
        return value;
      }
    })
  };

  return z.object({
    name: z.string().min(2),
    rtsp_url: z.string().min(10),
    is_active: z.boolean(),
    stream_frame_width: z.number().min(320).max(4096),
    stream_frame_height: z.number().min(240).max(2160),
    stream_quality: z.number().min(1).max(100),
    stream_fps: z.number().min(1).max(120),
    stream_skip_frames: z.number().min(0).max(30),
    demographics_config: z.object({
      track_history_max_length: z.number().min(1).max(100),
      exit_threshold: z.number().min(1).max(100),
      min_track_duration: z.number().min(1).max(60),
      detection_confidence_threshold: z.number().min(0.1).max(1),
      demographics_confidence_threshold: z.number().min(0.1).max(1),
      min_track_updates: z.number().min(1).max(100),
      box_area_threshold: z.number().min(0.1).max(1),
      save_interval: z.number().min(60).max(3600),
      frame_skip_interval: z.number().min(0.1).max(10)
    })
  });
};

const CameraForm = ({cameraId ,initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
const { mutate, isPending, isSuccess, error } = useUpdateCamera(cameraId);
const router = useRouter();
  const schema = createCameraSchema();
// console.log(error , "=  ============================")
  useEffect(() => {
    setFormData(initialData);
    setErrors({});
    setSubmitStatus(null);
  }, [initialData]);

  const handleInputChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const pathArray = path.split('.');
      let current = newData;

      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }

      current[pathArray[pathArray.length - 1]] = value;
      return newData;
    });

    if (errors[path]) {
      setErrors(prev => ({ ...prev, [path]: null }));
    }
  };

  const validateForm = () => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      setErrors(error.errors || {});
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Please correct the required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await mutate(formData);
      setSubmitStatus({ type: 'success', message: 'Camera updated successfully' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An error occurred while updating the camera' });
    } finally {
      setIsSubmitting(false);
    }
  };
 
  const StatusMessage = () => {
    if (!submitStatus) return null;

    return (
      <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${submitStatus.type === 'success'
        ? 'bg-green-50 text-green-800 border border-green-200'
        : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
        {submitStatus.type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="font-medium">{submitStatus.message}</span>
      </div>
    );
  };

  const InputField = ({ label, name, type = 'text', min, max, step, disabled = false, required = true }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[name] || ''}
        onChange={(e) => handleInputChange(name, type === 'number' ? Number(e.target.value) : e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`w-full px-4 py-2.5 border rounded-lg transition-colors ${disabled
          ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
          : 'bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          } ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors[name] && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const NestedInputField = ({ label, path, type = 'text', min, max, step, disabled = false, required = true }) => {
    const pathArray = path.split('.');
    let value = formData;
    for (const key of pathArray) {
      value = value?.[key];
    }

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={value || ''}
          onChange={(e) => handleInputChange(path, type === 'number' ? Number(e.target.value) : e.target.value)}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-2.5 border rounded-lg transition-colors ${disabled
            ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
            : 'bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            } ${errors[path] ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors[path] && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors[path]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Camera Data
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {formData.is_active ? (
              <div className="flex items-center gap-2 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Inactive</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Status Message */}
        <StatusMessage />

        {/* Camera Preview */}
        <div className="mb-8 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Camera Preview
          </h3>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <img
              src={formData.snapshot}
              alt="Camera Preview"
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
              {formData.stream_frame_width} × {formData.stream_frame_height}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">Read-only tags</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Basic Information
            </h3>

            <InputField label="Camera Name" name="name" required />

            <InputField label="RTSP URL" name="rtsp_url" required />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Camera Status *
              </label>
              <div className="flex items-center space-x-4 space-x-reverse">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="is_active"
                    checked={formData.is_active === true}
                    onChange={() => handleInputChange("is_active", true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="is_active"
                    checked={formData.is_active === false}
                    onChange={() => handleInputChange("is_active", false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Inactive</span>
                </label>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700">
                Read-only Information
              </h4>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created Date:</span>
                  <span className="font-medium">
                    {new Date(formData.created_at).toLocaleString("en-US")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(formData.updated_at).toLocaleString("en-US")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status Message:</span>
                  <span className="font-medium">{formData.status_message}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stream Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Stream Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Frame Width"
                name="stream_frame_width"
                type="number"
                min={320}
                max={4096}
                required
              />

              <InputField
                label="Frame Height"
                name="stream_frame_height"
                type="number"
                min={240}
                max={2160}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Stream Quality (%)"
                name="stream_quality"
                type="number"
                min={1}
                max={100}
                required
              />

              <InputField
                label="Frames Per Second"
                name="stream_fps"
                type="number"
                min={1}
                max={120}
                required
              />
            </div>

            <InputField
              label="Skip Frames"
              name="stream_skip_frames"
              type="number"
              min={0}
              max={30}
              required
            />

            <InputField
              label="Max Stream Length"
              name="stream_max_length"
              type="number"
              disabled
              required={false}
            />
          </div>
        </div>

        {/* Advanced Demographics Configuration */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Settings className="w-5 h-5" />
            Advanced Demographics Settings
            {showAdvanced ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
              <NestedInputField
                label="Track History Max Length"
                path="demographics_config.track_history_max_length"
                type="number"
                min={1}
                max={100}
              />

              <NestedInputField
                label="Exit Threshold"
                path="demographics_config.exit_threshold"
                type="number"
                min={1}
                max={100}
              />

              <NestedInputField
                label="Min Track Duration (sec)"
                path="demographics_config.min_track_duration"
                type="number"
                min={1}
                max={60}
              />

              <NestedInputField
                label="Detection Confidence Threshold"
                path="demographics_config.detection_confidence_threshold"
                type="number"
                min={0.1}
                max={1}
                step={0.1}
              />

              <NestedInputField
                label="Demographics Confidence Threshold"
                path="demographics_config.demographics_confidence_threshold"
                type="number"
                min={0.1}
                max={1}
                step={0.1}
              />

              <NestedInputField
                label="Min Track Updates"
                path="demographics_config.min_track_updates"
                type="number"
                min={1}
                max={100}
              />

              <NestedInputField
                label="Box Area Threshold"
                path="demographics_config.box_area_threshold"
                type="number"
                min={0.1}
                max={1}
                step={0.1}
              />

              <NestedInputField
                label="Save Interval (sec)"
                path="demographics_config.save_interval"
                type="number"
                min={60}
                max={3600}
              />

              <NestedInputField
                label="Frame Skip Interval"
                path="demographics_config.frame_skip_interval"
                type="number"
                min={0.1}
                max={10}
                step={0.1}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <X className="w-4 h-4 inline-block mr-2" />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-6 py-2.5  cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 inline-block mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraForm
