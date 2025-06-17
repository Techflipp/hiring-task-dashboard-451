"use client";

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateCamera, getTags } from '@/lib/api';
import { Camera, Tag } from '@/types';
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

  const { data: allTags } = useQuery<Tag[]>({ 
    queryKey: ['tags'],
    queryFn: getTags,
  });

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

  const mutation = useMutation({
    mutationFn: (updatedCamera: Partial<Omit<Camera, 'tags'>> & { tags: string[] }) => 
      updateCamera(camera.id, updatedCamera),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camera', camera.id] });
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
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
                {allTags?.map((tag) => (
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
