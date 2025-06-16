"use client";
import {
  getCameraByIdResponse,
  TagsResponse,
  updateCameraRequest,
  updateCameraResponse,
} from "@/constants/apitypes";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCameraById, getTags } from "@/services";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateCameraAction } from "@/actions/updateCameras";
import { Tags } from "lucide-react";

//defining formSchema
const formSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "name must be at least 4 characters.",
    })
    .nonempty({ message: "Camera Name Required" }),
  rtsp_url: z
    .string()
    .min(4, {
      message: "name must be at least 4 characters.",
    })
    .startsWith("rtsp://", { message: "invalid  url" })
    .nonempty({ message: "RTSP Url Required" }),
  stream_frame_width: z.coerce.number(),
  stream_frame_height: z.coerce.number(),
  stream_max_length: z.coerce.number(),
  stream_quality: z.coerce
    .number()
    .min(10, { message: "must be at least 10%" })
    .max(100, { message: "can't exceed 100%" }),
  stream_fps: z.coerce
    .number()
    .min(5, { message: "must be at least 5fps" })
    .max(60, { message: "can't exceed 60fps" }),
  stream_skip_frames: z.coerce.number(),
});

export default function CameraForm({ id }: { id: string }) {
  const camId = id;

  const queryClient = useQueryClient();

  const { data, isSuccess } = useQuery<getCameraByIdResponse, Error>({
    queryKey: ["camera", { id: camId }],
    queryFn: () => getCameraById(camId),
    enabled: !!camId,
  });

  const mutation = useMutation<
    updateCameraResponse,
    Error,
    updateCameraRequest
  >({
    mutationKey: ["camera", { id: camId }],
    mutationFn: (vals) => updateCameraAction(camId, vals), // using server actions to revalidate home page after mutation
    onError: () => {
      toast.error("something went wrong");
    },
    onSuccess: () => {
      toast.success("Camera updated!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["camera", { id: camId }] });
    },
  });

  const { data: tagsData } = useQuery<TagsResponse, Error>({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });
  const [selectedTags, setSelectedTages] = useState<string[]>([]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedTags.length >= 2) {
      const reqbody = { ...values, tags: selectedTags };
      mutation.mutate(reqbody);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rtsp_url: "",
      stream_frame_width: 0,
      stream_frame_height: 0,
      stream_max_length: 0,
      stream_quality: 0,
      stream_fps: 0,
      stream_skip_frames: 0,
    },
  });

  //filling the form with the current data for a better ux
  useEffect(() => {
    if (isSuccess && data) {
      form.reset({
        name: data?.name,
        rtsp_url: data?.rtsp_url,
        stream_frame_width: data?.stream_frame_width,
        stream_frame_height: data?.stream_frame_height,
        stream_max_length: data?.stream_max_length,
        stream_quality: data?.stream_quality,
        stream_fps: data?.stream_fps,
        stream_skip_frames: data?.stream_skip_frames,
      });

      setSelectedTages(data?.tags.map((tag) => tag.id));
      queryClient.invalidateQueries({ queryKey: ["camera", { id: camId }] });
    }
  }, [isSuccess, data, form, queryClient, camId]);

  if (!data) {
    return (
      <div className="flex-center flex size-full">
        <h2 className="text-3xl font-bold">please wait</h2>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-center flex w-full max-w-3xl flex-col gap-5"
      >
        <div className="flex w-full flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Camera Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col gap-1">
            <FormField
              control={form.control}
              name="rtsp_url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="rtsp_url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2 w-full">
              <h3 className="text-2xl font-semibold">Tags</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {tagsData?.map(
                  (tag: { id: string; name: string; color: string }) => (
                    <Badge
                      key={tag.id}
                      style={{
                        backgroundColor: tag.color,
                        opacity: selectedTags.find((id) => id === tag.id)
                          ? "1"
                          : "0.5",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setSelectedTages((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((t) => t != tag.id)
                            : [...prev, tag.id],
                        )
                      }
                    >
                      <Tags />
                      {tag.name}
                    </Badge>
                  ),
                )}
                {selectedTags.length < 2 && (
                  <FormMessage>select 2 tags at least</FormMessage>
                )}
              </div>
            </div>
            <div className="mt-2 w-full">
              <h3 className="text-2xl font-semibold">Camera details</h3>
              <div className="mt-2 flex flex-col gap-4">
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="stream_frame_width"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Width" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span>{" * "}</span>
                  <FormField
                    control={form.control}
                    name="stream_frame_height"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Height"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="stream_fps"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="FPS" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stream_skip_frames"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Skipped Frames"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stream_quality"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Quality" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stream_max_length"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Length" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="mt-4">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
