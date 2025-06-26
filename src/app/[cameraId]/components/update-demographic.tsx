"use client";
import { EditIcon } from "@/components/icons/icons";
import { FormItem } from "@/components/ui/form-item";
import { Modal } from "@/components/ui/modal";
import { addDemographicConfigAPI, updateDemographicConfigAPI } from "@/lib/api";
import { FieldValidationError, UpdateDemographicsData } from "@/types/camera";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

type Props = {
  data: UpdateDemographicsData;
  id: string;
  type: "update" | "create";
  cameraId: string;
};
export function UpdateDemographicModal({ data, id, type, cameraId }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldValidationError>({});
  const router = useRouter();

  const initialFormData = useMemo(
    () => ({
      track_history_max_length: 0,
      exit_threshold: 0,
      min_track_duration: 0,
      detection_confidence_threshold: 0.1,
      demographics_confidence_threshold: 0.1,
      min_track_updates: 0,
      box_area_threshold: 0.05,
      save_interval: 0,
      frame_skip_interval: 0.1,
    }),
    []
  );

  const [formData, setFormData] =
    useState<UpdateDemographicsData>(initialFormData);

  useEffect(() => {
    setFormData(data ?? initialFormData);
  }, [data, initialFormData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let response;
      if (type === "create") {
        const payload = { ...formData, camera_id: cameraId };
        response = await addDemographicConfigAPI(payload);
      } else {
        response = await updateDemographicConfigAPI(id, formData);
      }
      if (response.success) {
        resetForm();
        setIsOpen(false);
        router.refresh();
      } else {
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2  rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Edit"
      >
        <EditIcon />
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Demographics Configuration"
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormItem
              label="Track History Max Length"
              name="track_history_max_length"
              type="number"
              value={formData.track_history_max_length}
              onChange={handleInputChange}
              error={errors?.track_history_max_length}
              required
              min={0}
              step={1}
              className="mb-0"
            />

            <FormItem
              label="Exit Threshold"
              name="exit_threshold"
              type="number"
              value={formData.exit_threshold}
              onChange={handleInputChange}
              error={errors?.exit_threshold}
              required
              min={0}
              step={1}
              className="mb-0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormItem
              label="Min Track Duration"
              name="min_track_duration"
              type="number"
              value={formData.min_track_duration}
              onChange={handleInputChange}
              error={errors?.min_track_duration}
              required
              min={0}
              step={1}
              className="mb-0"
            />

            <FormItem
              label="Min Track Updates"
              name="min_track_updates"
              type="number"
              value={formData.min_track_updates}
              onChange={handleInputChange}
              error={errors?.min_track_updates}
              required
              min={0}
              step={1}
              className="mb-0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormItem
              label="Detection Confidence Threshold"
              name="detection_confidence_threshold"
              type="number"
              value={formData.detection_confidence_threshold}
              onChange={handleInputChange}
              error={errors?.detection_confidence_threshold}
              required
              min={0}
              max={1}
              step={0.01}
              className="mb-0"
            />

            <FormItem
              label="Demographics Confidence Threshold"
              name="demographics_confidence_threshold"
              type="number"
              value={formData.demographics_confidence_threshold}
              onChange={handleInputChange}
              error={errors?.demographics_confidence_threshold}
              required
              min={0}
              max={1}
              step={0.01}
              className="mb-0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormItem
              label="Box Area Threshold"
              name="box_area_threshold"
              type="number"
              value={formData.box_area_threshold}
              onChange={handleInputChange}
              error={errors?.box_area_threshold}
              required
              min={0}
              max={1}
              step={0.01}
              className="mb-0"
            />

            <FormItem
              label="Save Interval"
              name="save_interval"
              type="number"
              value={formData.save_interval}
              onChange={handleInputChange}
              error={errors?.save_interval}
              required
              min={0}
              step={1}
              className="mb-0"
            />
          </div>

          <FormItem
            label="Frame Skip Interval"
            name="frame_skip_interval"
            type="number"
            value={formData.frame_skip_interval}
            onChange={handleInputChange}
            error={errors?.frame_skip_interval}
            required
            // min={0}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Processing..." : "Submit"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
