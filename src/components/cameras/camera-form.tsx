"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Tag } from "@/types";
import { CameraUpdateFormData, cameraUpdateSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "../ui/form-filed";

interface CameraFormProps {
  camera: Camera;
  tags: Tag[];
  onSubmit: (data: CameraUpdateFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function CameraForm({
  camera,
  tags,
  onSubmit,
  isSubmitting,
}: CameraFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    camera.tags?.map((t) => t.id) || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CameraUpdateFormData>({
    resolver: zodResolver(cameraUpdateSchema),
    defaultValues: {
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      stream_frame_width: camera.stream_frame_width,
      stream_frame_height: camera.stream_frame_height,
      stream_max_length: camera.stream_max_length,
      stream_quality: camera.stream_quality,
      stream_fps: camera.stream_fps,
      stream_skip_frames: camera.stream_skip_frames,
      tags: selectedTags,
    },
  });

  const handleFormSubmit = (data: CameraUpdateFormData) => {
    return onSubmit({ ...data, tags: selectedTags });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Camera Name" error={errors.name?.message} required>
            <Input {...register("name")} placeholder="Enter camera name" />
          </FormField>

          <FormField label="RTSP URL" error={errors.rtsp_url?.message} required>
            <Input
              {...register("rtsp_url")}
              placeholder="rtsp://example.com/stream"
              type="url"
            />
          </FormField>

          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                    selectedTags.includes(tag.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}>
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stream Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Frame Width"
              error={errors.stream_frame_width?.message}>
              <Input
                {...register("stream_frame_width", { valueAsNumber: true })}
                type="number"
                placeholder="1920"
                min={1}
                max={2560}
              />
            </FormField>

            <FormField
              label="Frame Height"
              error={errors.stream_frame_height?.message}>
              <Input
                {...register("stream_frame_height", { valueAsNumber: true })}
                type="number"
                placeholder="1080"
                min={1}
                max={2560}
              />
            </FormField>

            <FormField label="FPS" error={errors.stream_fps?.message}>
              <Input
                {...register("stream_fps", { valueAsNumber: true })}
                type="number"
                placeholder="30"
                min={1}
                max={120}
              />
            </FormField>

            <FormField
              label="Quality (%)"
              error={errors.stream_quality?.message}>
              <Input
                {...register("stream_quality", { valueAsNumber: true })}
                type="number"
                placeholder="95"
                min={80}
                max={100}
              />
            </FormField>

            <FormField
              label="Max Length (seconds)"
              error={errors.stream_max_length?.message}>
              <Input
                {...register("stream_max_length", { valueAsNumber: true })}
                type="number"
                placeholder="3600"
                min={0}
                max={10000}
              />
            </FormField>

            <FormField
              label="Skip Frames"
              error={errors.stream_skip_frames?.message}>
              <Input
                {...register("stream_skip_frames", { valueAsNumber: true })}
                type="number"
                placeholder="0"
                min={0}
                max={100}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1 md:flex-none">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
