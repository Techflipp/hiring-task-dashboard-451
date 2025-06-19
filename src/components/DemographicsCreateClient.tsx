// import React, { useState } from 'react';
// import { Camera, Save, ArrowLeft, AlertCircle, CheckCircle, Settings, Info } from 'lucide-react';
// import { z } from 'zod';
// import { v4 as uuidv4 } from 'uuid';
// import api from '@/lib/axios';

// // Default values to help users
// const defaultValues = {
//   track_history_max_length: 20,
//   exit_threshold: 30,
//   min_track_duration: 5,
//   detection_confidence_threshold: 0.6,
//   demographics_confidence_threshold: 0.7,
//   min_track_updates: 10,
//   box_area_threshold: 0.2,
//   save_interval: 600,
//   frame_skip_interval: 1.0,
// };

// // Zod schema for validation
// const demographicConfigSchema = z.object({
//   track_history_max_length: z.number().min(0).max(1000),
//   exit_threshold: z.number().min(0).max(100),
//   min_track_duration: z.number().min(0).max(60),
//   detection_confidence_threshold: z.number().min(0).max(1).step(0.01),
//   demographics_confidence_threshold: z.number().min(0).max(1).step(0.01),
//   min_track_updates: z.number().min(0).max(100),
//   box_area_threshold: z.number().min(0).max(1).step(0.01),
//   save_interval: z.number().min(0).max(3600),
//   frame_skip_interval: z.number().min(0).max(10).step(0.1),
//   camera_id: z.string().min(1, "Camera ID is required")
// });

// const CreateDemographicConfig = () => {
//   const [formData, setFormData] = useState({
//     ...defaultValues,
//     camera_id: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const fieldDescriptions = {
//     track_history_max_length: "Maximum number of tracking history entries to maintain",
//     exit_threshold: "Threshold for detecting when a person exits the frame",
//     min_track_duration: "Minimum duration (seconds) to track a person",
//     detection_confidence_threshold: "Minimum confidence level for person detection (0-1)",
//     demographics_confidence_threshold: "Minimum confidence level for demographic analysis (0-1)",
//     min_track_updates: "Minimum number of updates required for valid tracking",
//     box_area_threshold: "Minimum bounding box area threshold (0-1)",
//     save_interval: "Interval (seconds) for saving tracking data",
//     frame_skip_interval: "Interval for skipping frames during processing",
//     camera_id: "Unique identifier for the camera"
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: field === 'camera_id' ? value : Number(value)
//     }));

//     // Clear error for this field
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: undefined
//       }));
//     }
//   };

//   const validateForm = () => {
//     try {
//       demographicConfigSchema.parse(formData);
//       setErrors({});
//       return true;
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const newErrors = {};
//         error.errors.forEach(err => {
//           newErrors[err.path[0]] = err.message;
//         });
//         setErrors(newErrors);
//       }
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       // Generate unique ID for this configuration
//       const configId = uuidv4();
      
//       const payload = {
//         ...formData,
//         id: configId,
//         created_at: new Date().toISOString()
//       };

//       // Call the API to create demographic configuration
//       const response = await api.post('/demographics/config', {
//         ...formData,
//         camera_id: formData.camera_id,
//       });
      
//       console.log('Configuration created successfully:', response.data);
      
//       setSubmitSuccess(true);
      
//       // Reset form after success
//       setTimeout(() => {
//         setSubmitSuccess(false);
//         // Navigate back or reset form
//       }, 2000);
      
//     } catch (error) {
//       console.error('Error creating configuration:', error);
//       setErrors({ submit: 'Failed to create configuration. Please try again.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBack = () => {
//     // Navigate back to previous page
//     console.log('Navigate back');
//   };

//   const InputField = ({ 
//     label, 
//     field, 
//     type = "number", 
//     step, 
//     min, 
//     max, 
//     required = false 
//   }) => (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <label className="block text-sm font-medium text-gray-700">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//         <div className="group relative">
//           <Info className="w-4 h-4 text-gray-400 cursor-help" />
//           <div className="absolute right-0 bottom-6 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
//             {fieldDescriptions[field]}
//           </div>
//         </div>
//       </div>
//       <input
//         type={type}
//         step={step}
//         min={min}
//         max={max}
//         value={formData[field]}
//         onChange={(e) => handleInputChange(field, e.target.value)}
//         className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
//           errors[field] ? 'border-red-500 focus:ring-red-500' : ''
//         }`}
//         placeholder={type === 'text' ? 'Enter camera ID' : defaultValues[field]?.toString() || '0'}
//       />
//       {errors[field] && (
//         <div className="flex items-center space-x-1 text-red-600 text-sm">
//           <AlertCircle className="w-4 h-4" />
//           <span>{errors[field]}</span>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={handleBack}
//                 className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//               <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
//                 <Settings className="w-5 h-5 text-white" />
//               </div>
//               <h1 className="text-xl font-semibold text-gray-900">Create Demographic Configuration</h1>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Success Message */}
//         {submitSuccess && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <CheckCircle className="w-5 h-5 text-green-600" />
//               <span className="text-green-800 font-medium">Configuration created successfully!</span>
//             </div>
//           </div>
//         )}

//         {/* Submit Error */}
//         {errors.submit && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <AlertCircle className="w-5 h-5 text-red-600" />
//               <span className="text-red-800 font-medium">{errors.submit}</span>
//             </div>
//           </div>
//         )}

//         <div className="space-y-8">
//           {/* Basic Configuration */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//             <div className="flex items-center space-x-2 mb-6">
//               <Camera className="w-5 h-5 text-gray-600" />
//               <h2 className="text-lg font-semibold text-gray-900">Basic Configuration</h2>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <InputField
//                 label="Camera ID"
//                 field="camera_id"
//                 type="text"
//                 required
//               />
//               <InputField
//                 label="Save Interval (seconds)"
//                 field="save_interval"
//                 min="0"
//                 max="3600"
//               />
//             </div>
//           </div>

//           {/* Detection Settings */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">Detection Settings</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <InputField
//                 label="Detection Confidence Threshold"
//                 field="detection_confidence_threshold"
//                 step="0.01"
//                 min="0"
//                 max="1"
//               />
//               <InputField
//                 label="Demographics Confidence Threshold"
//                 field="demographics_confidence_threshold"
//                 step="0.01"
//                 min="0"
//                 max="1"
//               />
//               <InputField
//                 label="Box Area Threshold"
//                 field="box_area_threshold"
//                 step="0.01"
//                 min="0"
//                 max="1"
//               />
//               <InputField
//                 label="Frame Skip Interval"
//                 field="frame_skip_interval"
//                 step="0.1"
//                 min="0"
//                 max="10"
//               />
//             </div>
//           </div>

//           {/* Tracking Settings */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">Tracking Settings</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <InputField
//                 label="Track History Max Length"
//                 field="track_history_max_length"
//                 min="0"
//                 max="1000"
//               />
//               <InputField
//                 label="Exit Threshold"
//                 field="exit_threshold"
//                 min="0"
//                 max="100"
//               />
//               <InputField
//                 label="Min Track Duration (seconds)"
//                 field="min_track_duration"
//                 min="0"
//                 max="60"
//               />
//               <InputField
//                 label="Min Track Updates"
//                 field="min_track_updates"
//                 min="0"
//                 max="100"
//               />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex items-center justify-end space-x-4 pt-6">
//             <button
//               type="button"
//               onClick={handleBack}
//               className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex items-center space-x-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   <span>Creating...</span>
//                 </>
//               ) : (
//                 <>
//                   <Save className="w-4 h-4" />
//                   <span>Create Configuration</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateDemographicConfig;

"use client"

import React, { useState } from 'react';
import { Camera, Save, ArrowLeft, AlertCircle, CheckCircle, Settings, Info } from 'lucide-react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import api from '@/lib/axios';
import { useParams } from 'next/navigation';
import { useCameraDetail } from '@/hooks/useCameraDetail';
 


const demographicConfigSchema = z.object({
  track_history_max_length: z
    .number()
    .min(1, "Must be at least 1")
    .max(100, "Must be at most 100"),

  exit_threshold: z
    .number()
    .min(1, "Must be at least 1")
    .max(300, "Must be at most 300"),

  min_track_duration: z
    .number()
    .min(1, "Must be at least 1")
    .max(60, "Must be at most 60"),

  detection_confidence_threshold: z
    .number()
    .min(0.1, "Must be at least 0.1")
    .max(1.0, "Must be at most 1.0"),

  demographics_confidence_threshold: z
    .number()
    .min(0.1, "Must be at least 0.1")
    .max(1.0, "Must be at most 1.0"),

  min_track_updates: z
    .number()
    .min(1, "Must be at least 1")
    .max(100, "Must be at most 100"),

  box_area_threshold: z
    .number()
    .min(0.05, "Must be at least 0.05")
    .max(1.0, "Must be at most 1.0"),

  save_interval: z
    .number()
    .min(300, "Must be at least 300")
    .max(1800, "Must be at most 1800"),

  frame_skip_interval: z
    .number()
    .min(0.1, "Must be at least 0.1")
    .max(5.0, "Must be at most 5.0"),

  camera_id: z.string().uuid("Camera ID must be a valid UUID")
});


const CreateDemographicConfig = ({moode}:{moode:string}) => {
  const params = useParams();
  const cameraId = params.id as string;
const { data: camera } = useCameraDetail(cameraId);

  const defaultValues = {
  track_history_max_length: camera?.demographics_config.track_history_max_length,
  exit_threshold: camera?.demographics_config.exit_threshold,
  min_track_duration: camera?.demographics_config.min_track_duration,
  detection_confidence_threshold:camera?.demographics_config.detection_confidence_threshold,
  demographics_confidence_threshold: camera?.demographics_config.demographics_confidence_threshold,
  min_track_updates: camera?.demographics_config.min_track_updates,
  box_area_threshold: camera?.demographics_config.box_area_threshold,
  save_interval: camera?.demographics_config.save_interval,
  frame_skip_interval: camera?.demographics_config.frame_skip_interval,
};

  const [formData, setFormData] = useState({
    ...defaultValues,
    camera_id: uuidv4(),
  });
// console.log(formData)
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fieldDescriptions = {
    track_history_max_length:
      "Maximum number of tracking history entries to maintain",
    exit_threshold: "Threshold for detecting when a person exits the frame",
    min_track_duration: "Minimum duration (seconds) to track a person",
    detection_confidence_threshold:
      "Minimum confidence level for person detection (0-1)",
    demographics_confidence_threshold:
      "Minimum confidence level for demographic analysis (0-1)",
    min_track_updates: "Minimum number of updates required for valid tracking",
    box_area_threshold: "Minimum bounding box area threshold (0-1)",
    save_interval: "Interval (seconds) for saving tracking data",
    frame_skip_interval: "Interval for skipping frames during processing",
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "camera_id" ? value : Number(value),
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

//   console.log(formData, " ============ form data");

  const validateForm = () => {
    try {
      demographicConfigSchema.safeParse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the API to create demographic configuration
      const response = await api.post("/demographics/config", {
        ...formData,
        // camera_id: formData.camera_id,
      });

      console.log("Configuration created successfully:", response.data);

      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        // Navigate back or reset form
      }, 2000);
    } catch (error) {
      console.error("Error creating configuration:", error);
      setErrors({
        submit: "Failed to create configuration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // to handle form when user use edit mode
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the API to create demographic configuration
      const response = await api.put(`/demographics/config/${camera?.demographics_config.id}`, {
        ...formData,
        camera_id:camera?.demographics_config.id ? formData.camera_id : uuidv4(),
      });

      console.log("Configuration created successfully:", response.data);

      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        // Navigate back or reset form
      }, 2000);
    } catch (error) {
      console.error("Error creating configuration:", error);
      setErrors({
        submit: "Failed to create configuration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Navigate back to previous page
    console.log("Navigate back");
  };

  const InputField = ({
    label,
    field,
    type = "number",
    step,
    min,
    max,
    required = false,
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute right-0 bottom-6 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {fieldDescriptions[field]}
          </div>
        </div>
      </div>
      <input
        type={type}
        step={step}
        min={min}
        max={max}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors ${
          errors[field] ? "border-red-500 focus:ring-red-500" : ""
        }`}
        placeholder={
          type === "text"
            ? "Enter camera ID"
            : defaultValues[field]?.toString() || "0"
        }
      />
      {errors[field] && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{errors[field]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBack}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Create Demographic Configuration
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Configuration created successfully!
              </span>
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">{errors.submit}</span>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Configuration */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Camera className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Basic Configuration
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Save Interval (seconds)"
                field="save_interval"
                min="0"
                max="3600"
              />
            </div>
          </div>

          {/* Detection Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Detection Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Detection Confidence Threshold"
                field="detection_confidence_threshold"
                step="0.01"
                min="0"
                max="1"
              />
              <InputField
                label="Demographics Confidence Threshold"
                field="demographics_confidence_threshold"
                step="0.01"
                min="0"
                max="1"
              />
              <InputField
                label="Box Area Threshold"
                field="box_area_threshold"
                step="0.01"
                min="0"
                max="1"
              />
              <InputField
                label="Frame Skip Interval"
                field="frame_skip_interval"
                step="0.1"
                min="0"
                max="10"
              />
            </div>
          </div>

          {/* Tracking Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Tracking Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Track History Max Length"
                field="track_history_max_length"
                min="0"
                max="1000"
              />
              <InputField
                label="Exit Threshold"
                field="exit_threshold"
                min="0"
                max="100"
              />
              <InputField
                label="Min Track Duration (seconds)"
                field="min_track_duration"
                min="0"
                max="60"
              />
              <InputField
                label="Min Track Updates"
                field="min_track_updates"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={moode == "edit" || camera?.demographics_config.id ? handleEditSubmit : handleSubmit}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>
                    { !moode == "edit" || !camera?.demographics_config.id
                      ? "Create Configuration"
                      : "Update Configuration"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDemographicConfig;