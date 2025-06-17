"use client";

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateCamera, getTags } from '@/lib/api';
import { Camera, Tag } from '@/types';

// Define the update payload type that matches the API's expected format
interface CameraUpdatePayload extends Omit<Partial<Camera>, 'tags'> {
  tags: string[]; // API expects tag IDs as strings
}
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  rtsp_url: z.string().url({ message: "Please enter a valid URL." }),
  tags: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one tag.",
  }),
});

interface CameraUpdateFormProps {
  camera: Camera;
}

export default function CameraUpdateForm({ camera }: CameraUpdateFormProps) {
  const queryClient = useQueryClient();

  const { data: tagsData } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: getTags,
  });
  
  // Alias for the tags data to match the JSX
  const allTags = tagsData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      tags: camera.tags.map(t => t.id),
    },
  });

  useEffect(() => {
    form.reset({
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      tags: camera.tags.map(t => t.id),
    });
  }, [camera, form]);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const updateData: CameraUpdatePayload = {
        name: values.name,
        rtsp_url: values.rtsp_url,
        tags: values.tags,
        stream_frame_width: camera.stream_frame_width,
        stream_frame_height: camera.stream_frame_height,
        stream_max_length: camera.stream_max_length,
        stream_quality: camera.stream_quality,
        stream_fps: camera.stream_fps,
        stream_skip_frames: camera.stream_skip_frames,
        demographics_config: camera.demographics_config
      };
      
      return await updateCamera(camera.id, updateData);
    },
    onSuccess: () => {
      setSuccessMessage('Camera details updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['camera', camera.id] });
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error: unknown) => {
      setSuccessMessage(null);
      if (error instanceof Error) {
        // Error handling remains but without console logs
      }
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutation.mutateAsync(values);
      return true;
    } catch (error) {
      console.error('Update failed:', error);
      throw error;
    }
  }

  return (
    <Form {...form}>
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Front Door Camera" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rtsp_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RTSP URL</FormLabel>
              <FormControl>
                <Input placeholder="rtsp://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Tags</FormLabel>
                <FormDescription>
                  Select the tags that apply to this camera.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allTags?.map((tag: Tag) => (
                  <FormField
                    key={tag.id}
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={tag.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(tag.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), tag.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== tag.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {tag.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
