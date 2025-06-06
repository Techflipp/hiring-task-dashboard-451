import {
  getCameraByIdResponse,
  TagsResponse,
  updateCameraRequest,
  updateCameraResponse,
} from "@/constants/apitypes";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getCameraById, getTags, updateCamera } from "@/services";
import Image from "next/image";
import { useState } from "react";
import { CloudAlert, Edit, X } from "lucide-react";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
    .min(10, { message: "wrong range" })
    .max(100, { message: "wrong range" }),
  stream_fps: z.coerce
    .number()
    .min(5, { message: "wrong range" })
    .max(60, { message: "wrong range" }),
  stream_skip_frames: z.coerce.number(),
});

export default function CameraDetails({ camId }: { camId: string }) {
  const [imgError, setImgError] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedTags, setSelectedTages] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { data } = useQuery<getCameraByIdResponse, Error>({
    queryKey: ["camera", { id: camId }],
    queryFn: (): Promise<getCameraByIdResponse> => getCameraById(camId),
  });

  console.log(data);

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  const mutation = useMutation<getCameraByIdResponse, Error>({
    mutationKey: ["camera", { id: camId }],
    mutationFn: (vals) => updateCamera(camId, vals),

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["camera", { id: camId }] }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name,
      rtsp_url: data?.rtsp_url,
      stream_frame_width: data?.stream_frame_width,
      stream_frame_height: data?.stream_frame_height,
      stream_max_length: data?.stream_max_length,
      stream_quality: data?.stream_quality,
      stream_fps: data?.stream_fps,
      stream_skip_frames: data?.stream_skip_frames,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const reqbody = { ...values, tags: Array.from(selectedTags) };
    console.log(reqbody);
    mutation.mutate(reqbody);
    setEditMode(false);
  }

  if (!data) {
    return (
      <div className="size-full flex flex-center">
        <h2 className="font-bold text-3xl">please wait</h2>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-center h-full flex-col lg:flex-row w-full gap-10"
      >
        <div className="w-full flex-col flex gap-4">
          <span>{data?.id}</span>
          {!editMode ? (
            <h2 className="text-4xl font-bold">{data?.name}</h2>
          ) : (
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
          )}

          <div className="flex-col flex gap-1">
            <div
              className={cn(
                "flex items-center  gap-2  font-semibold text-xl",
                data?.is_active ? "text-green-500 " : "text-red-500"
              )}
            >
              <div
                className={cn(
                  "rounded-full size-2",
                  data?.is_active
                    ? "bg-green-500 shadow-[0px_0px_10px_3px_rgba(11,241,176,0.9)]"
                    : "bg-red-500 shadow-[0px_0px_10px_3px_rgba(184,80,20,0.9)]"
                )}
              />
              {data?.is_active ? "Active" : "Inactive"}
            </div>
            <span className="text-gray-300">
              {data?.status_message || "No description available"}
            </span>

            {!editMode ? (
              <span className="text-gray-300">{data?.rtsp_url}</span>
            ) : (
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
            )}
          </div>
          <div className="w-full">
            <h3 className="text-2xl font-semibold">Tages</h3>
            <div className="flex mt-2 flex-wrap gap-2">
              {editMode
                ? tagsData?.map(
                    (tag: { id: string; name: string; color: string }) => (
                      <Badge
                        key={tag.name}
                        className={
                          selectedTags.find((name) => name === tag.name)
                            ? "opacity-100 cursor-pointer"
                            : "opacity-50 cursor-pointer"
                        }
                        style={{ backgroundColor: tag.color }}
                        onClick={() =>
                          setSelectedTages((prev) =>
                            prev.includes(
                              tagsData.find(({ name }) => name === tag.name)
                            )
                              ? prev.filter((t) => t !== tag)
                              : [...prev, tag.name]
                          )
                        }
                      >
                        {tag.name}
                      </Badge>
                    )
                  )
                : data?.tags?.map(
                    (tag: { id: string; name: string; color: string }) => (
                      <Badge
                        key={tag.id}
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    )
                  )}
            </div>
          </div>
          <div className="w-full">
            <h3 className="text-2xl font-semibold">Camera details</h3>
            <div className="flex flex-col mt-2 gap-4">
              {editMode ? (
                <>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="stream_frame_width"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Width"
                              type="number"
                              {...field}
                            />
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
                          <Input
                            placeholder="Quality"
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
                    name="stream_max_length"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Length"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                  <span>{`Resolution:${data?.stream_frame_width}*${data?.stream_frame_height}`}</span>
                  <span>{`FPS:${data?.stream_fps}`}</span>
                  <span>{`Skipped Frames:${data?.stream_skip_frames}`}</span>
                  <span>{`Quality:${data?.stream_quality}%`}</span>
                  <span>{`Length:${data?.stream_max_length}m`}</span>
                  <span>{`Created At:${new Date(
                    data?.created_at as string
                  ).toLocaleString()}`}</span>
                  <span>{`Updated At:${new Date(
                    data?.updated_at as string
                  ).toLocaleString()}`}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full  flex flex-col gap-2 ">
          <div className="h-[400px] w-full relative">
            {!imgError ? (
              <Image
                fill={true}
                src={data?.snapshot || ""}
                alt={data?.name || "no Image"}
                className="w-full object-cover rounded-xl"
                onError={() => setImgError(true)}
                priority
              />
            ) : (
              <div className="w-full flex-col gap-2 z-20 rounded-xl bg-slate-500 h-full flex-center">
                <CloudAlert size={40} />
                NO IMAGE
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="mt-4 " disabled={!editMode}>
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => setEditMode((prev) => !prev)}
              className={cn(
                "mt-4",
                !editMode ? "" : "bg-red-600 hover:bg-red-500"
              )}
            >
              {!editMode ? (
                <>
                  <Edit />
                  Edit
                </>
              ) : (
                <>
                  <X />
                  Cancel
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
