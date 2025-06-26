"use client";
import { FormItem } from "@/components/ui/form-item";
import { Modal } from "@/components/ui/modal";
import { updateCameraAPI } from "@/lib/api";
import { FieldValidationError, Tag, UpdateCameraData } from "@/types/camera";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { TagInput } from "./tag-input";
import { EditIcon } from "@/components/icons/icons";

export function UpdateCameraModal({
  data,
  id,
}: {
  data: UpdateCameraData;
  id: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldValidationError>({});
  const router = useRouter();

  const initialFormData = useMemo(() => ({
    name: "",
    rtsp_url: "",
    stream_frame_width: 0,
    stream_frame_height: 0,
    stream_max_length: 0,
    stream_quality: 0,
    stream_fps: 0,
    stream_skip_frames: 0,
    tags: [],
  }), []);

  const [formData, setFormData] = useState<UpdateCameraData>(initialFormData);

  useEffect(() => {
    setFormData(data ?? initialFormData);
    setSelectedTags(data.tags ?? []);
  }, [data, initialFormData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes("stream_") ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dataWithTags = { ...formData, tags: selectedTags };
    try {
      const response = await updateCameraAPI(id, dataWithTags);
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
    setSelectedTags([]);
    setErrors({});
  };

  const handleTagSelect = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag.id]);
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagId));
  };
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 md:p-4 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Edit"
      >
        <EditIcon />
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Stream Configuration"
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <FormItem
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors?.name}
            required
          />

          <FormItem
            label="RTSP URL"
            name="rtsp_url"
            value={formData.rtsp_url}
            onChange={handleInputChange}
            error={errors?.rtsp_url}
            required
            placeholder="rtsp://example.com/stream"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormItem
              label="Frame Width"
              name="stream_frame_width"
              type="number"
              value={formData.stream_frame_width}
              onChange={handleInputChange}
              error={errors?.stream_frame_width}
              required
              min={0}
              className="mb-0"
            />

            <FormItem
              label="Frame Height"
              name="stream_frame_height"
              type="number"
              value={formData.stream_frame_height}
              onChange={handleInputChange}
              error={errors?.stream_frame_height}
              required
              min={0}
              className="mb-0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormItem
              label="Max Length (seconds)"
              name="stream_max_length"
              type="number"
              value={formData.stream_max_length}
              onChange={handleInputChange}
              error={errors?.stream_max_length}
              required
              min={0}
              className="mb-0"
            />

            <FormItem
              label="Quality (1-100)"
              name="stream_quality"
              type="number"
              value={formData.stream_quality}
              onChange={handleInputChange}
              error={errors?.stream_quality}
              required
              min={1}
              max={100}
              className="mb-0"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormItem
              label="Frames Per Second"
              name="stream_fps"
              type="number"
              value={formData.stream_fps}
              onChange={handleInputChange}
              error={errors?.stream_fps}
              required
              min={0}
              className="mb-0"
            />

            <FormItem
              label="Skip Frames"
              name="stream_skip_frames"
              type="number"
              value={formData.stream_skip_frames}
              onChange={handleInputChange}
              error={errors?.stream_skip_frames}
              required
              min={0}
              className="mb-0"
            />
          </div>
          <TagInput
            selectedTagIds={selectedTags}
            onTagSelect={handleTagSelect}
            onTagRemove={handleTagRemove}
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

