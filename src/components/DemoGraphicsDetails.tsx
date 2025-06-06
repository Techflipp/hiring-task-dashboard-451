import {
  getCameraByIdResponse,
  updateDemoGraphicsRequest,
  updateDemoGraphicsResponse,
} from "@/constants/apitypes";

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getCameraById, updateDemoGraphics } from "@/services";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CloudAlert } from "lucide-react";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "./ui/slider";

const formSchema = z.object({
  track_history_max_length: z.coerce
    .number()
    .min(1, { message: "wrong range" })
    .max(100, { message: "wrong range" }),
  exit_threshold: z.coerce
    .number()
    .min(1, { message: "wrong range" })
    .max(300, { message: "wrong range" }),
  min_track_duration: z.coerce
    .number()
    .min(1, { message: "wrong range" })
    .max(60, { message: "wrong range" }),
  detection_confidence_threshold: z.coerce
    .number()
    .min(0.1, { message: "wrong range" })
    .max(1, { message: "wrong range" }),
  demographics_confidence_threshold: z.coerce
    .number()
    .min(0.1, { message: "wrong range" })
    .max(1, { message: "wrong range" }),
  min_track_updates: z.coerce
    .number()
    .min(1, { message: "wrong range" })
    .max(100, { message: "wrong range" }),
  box_area_threshold: z.coerce
    .number()
    .min(0.05, { message: "wrong range" })
    .max(1, { message: "wrong range" }),
  save_interval: z.coerce
    .number()
    .min(300, { message: "wrong range" })
    .max(1800, { message: "wrong range" }),
  frame_skip_interval: z.coerce
    .number()
    .min(0.1, { message: "wrong range" })
    .max(5, { message: "wrong range" }),
});

export default function DemoGraphicsDetails({ camId }: { camId: string }) {
  const [graphError, setGraphError] = useState<boolean>(false);
  const [configId, setConfigId] = useState<string>("");

  const queryClient = useQueryClient();

  const { data, isSuccess } = useQuery<getCameraByIdResponse, Error>({
    queryKey: ["camera", { id: camId }],
    queryFn: () => getCameraById(camId),
    enabled: !!camId,
  });

  const mutation = useMutation<
    updateDemoGraphicsResponse,
    Error,
    updateDemoGraphicsRequest
  >({
    mutationKey: ["camera", { id: camId }],
    mutationFn: (vals) => updateDemoGraphics(configId, vals),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["camera", { id: camId }],
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      track_history_max_length: formSchema.shape.track_history_max_length
        .minValue as number,
      exit_threshold: formSchema.shape.exit_threshold.minValue as number,
      min_track_duration: formSchema.shape.min_track_duration
        .minValue as number,
      detection_confidence_threshold: formSchema.shape
        .detection_confidence_threshold.minValue as number,
      demographics_confidence_threshold: formSchema.shape
        .demographics_confidence_threshold.minValue as number,
      min_track_updates: formSchema.shape.min_track_updates.minValue as number,
      box_area_threshold: formSchema.shape.box_area_threshold
        .minValue as number,
      save_interval: formSchema.shape.save_interval.minValue as number,
      frame_skip_interval: formSchema.shape.frame_skip_interval
        .minValue as number,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
    console.log(data?.demographics_config?.id);
  }

  useEffect(() => {
    if (isSuccess && data.demographics_config !== undefined) {
      form.reset({
        track_history_max_length: data?.demographics_config
          ?.track_history_max_length as number,
        exit_threshold: data?.demographics_config?.exit_threshold as number,
        min_track_duration: data?.demographics_config
          ?.min_track_duration as number,
        detection_confidence_threshold: data?.demographics_config
          ?.track_history_max_length as number,
        demographics_confidence_threshold: data?.demographics_config
          ?.demographics_confidence_threshold as number,
        min_track_updates: data?.demographics_config
          ?.min_track_updates as number,
        box_area_threshold: data?.demographics_config
          ?.box_area_threshold as number,
        save_interval: data?.demographics_config?.save_interval as number,
        frame_skip_interval: data?.demographics_config
          ?.frame_skip_interval as number,
      });
      setConfigId(data?.demographics_config?.id as string);
    }
  }, [isSuccess, data, form]);
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
        className="flex flex-center h-full flex-col-reverse lg:flex-row w-full gap-10"
      >
        <div className="w-full flex-3 flex-col max-w-4xl flex gap-4">
          <span className="text-xs">
            {"config_id: " + data?.demographics_config?.id || "no id"}
          </span>
          <h3 className="text-2xl font-semibold my-2">
            DemoGraphics Configuration
          </h3>
          <div className="w-full flex flex-center flex-col gap-6">
            <div className="grid grid-col-1 md:grid-cols-2 w-full gap-10">
              <FormField
                control={form.control}
                name="track_history_max_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Track History Max Length :" + field.value}
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {formSchema.shape.track_history_max_length.minValue?.toString()}
                        <Slider
                          max={
                            formSchema.shape.track_history_max_length
                              .maxValue as number
                          }
                          min={
                            formSchema.shape.track_history_max_length
                              .minValue as number
                          }
                          step={1}
                          className="max-w-4xl"
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                        {formSchema.shape.track_history_max_length.maxValue?.toString()}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exit_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Exit Threshold :" + field.value}</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {formSchema.shape.exit_threshold.minValue?.toString()}
                        <Slider
                          max={
                            formSchema.shape.exit_threshold.maxValue as number
                          }
                          min={
                            formSchema.shape.exit_threshold.minValue as number
                          }
                          step={1}
                          className="max-w-4xl"
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                        {formSchema.shape.exit_threshold.maxValue?.toString()}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_track_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Min Track Duration :" + field.value}
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {formSchema.shape.min_track_duration.minValue?.toString()}
                        <Slider
                          max={
                            formSchema.shape.min_track_duration
                              .maxValue as number
                          }
                          min={
                            formSchema.shape.min_track_duration
                              .minValue as number
                          }
                          step={1}
                          className="max-w-4xl"
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                        {formSchema.shape.min_track_duration.minValue?.toString()}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="detection_confidence_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Detection confidence Threshold :" + field.value}
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {formSchema.shape.detection_confidence_threshold.minValue?.toString()}
                        <Slider
                          max={
                            formSchema.shape.detection_confidence_threshold
                              .maxValue as number
                          }
                          min={
                            formSchema.shape.detection_confidence_threshold
                              .minValue as number
                          }
                          step={0.1}
                          className="max-w-4xl"
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                        {formSchema.shape.detection_confidence_threshold.maxValue?.toString()}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="demographics_confidence_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Demographics Confidence Threshold :" + field.value}
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {formSchema.shape.demographics_confidence_threshold.minValue?.toString()}
                        <Slider
                          max={
                            formSchema.shape.demographics_confidence_threshold
                              .maxValue as number
                          }
                          min={
                            formSchema.shape.demographics_confidence_threshold
                              .minValue as number
                          }
                          step={0.1}
                          className="max-w-4xl"
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                        {formSchema.shape.demographics_confidence_threshold.maxValue?.toString()}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_track_updates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Min Track Updates :" + field.value}</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {formSchema.shape.min_track_updates.minValue?.toString()}
                        <Slider
                          max={
                            formSchema.shape.min_track_updates
                              .maxValue as number
                          }
                          min={
                            formSchema.shape.min_track_updates
                              .minValue as number
                          }
                          step={1}
                          className="max-w-4xl"
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                        {formSchema.shape.min_track_updates.maxValue?.toString()}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="box_area_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Box Area Threshold :" + field.value}
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {
                          formSchema.shape.box_area_threshold.minValue?.toString() as string
                        }
                        <Slider
                          max={
                            formSchema.shape.box_area_threshold
                              .maxValue as number
                          }
                          min={
                            formSchema.shape.box_area_threshold
                              .minValue as number
                          }
                          step={0.01}
                          className="max-w-4xl"
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                        {
                          formSchema.shape.box_area_threshold.maxValue?.toString() as string
                        }
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="save_interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Save Interval :" + field.value}</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {
                          formSchema.shape.save_interval.minValue?.toString() as string
                        }
                        <Slider
                          max={
                            formSchema.shape.save_interval.maxValue as number
                          }
                          min={
                            formSchema.shape.save_interval.minValue as number
                          }
                          step={1}
                          className="max-w-4xl"
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                        {
                          formSchema.shape.save_interval.maxValue?.toString() as string
                        }
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="frame_skip_interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Frame Skip Interval :" + field.value}
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {
                          formSchema.shape.frame_skip_interval.minValue?.toString() as string
                        }
                        <Slider
                          max={
                            formSchema.shape.frame_skip_interval
                              .maxValue as number
                          }
                          min={
                            formSchema.shape.frame_skip_interval
                              .minValue as number
                          }
                          step={0.1}
                          className="max-w-4xl"
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                        {
                          formSchema.shape.frame_skip_interval.maxValue?.toString() as string
                        }
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="max-w-40 w-full">
              update
            </Button>
          </div>
        </div>
        <div className="w-full flex-2  flex flex-col gap-2 ">
          <div className="h-[400px] w-full relative">
            {!graphError ? (
              <Image
                fill={true}
                src={data?.snapshot || ""}
                alt={data?.name || "no Image"}
                className="w-full object-cover rounded-xl"
                onError={() => setGraphError(true)}
                priority
              />
            ) : (
              <div className="w-full flex-col gap-2 z-20 rounded-xl bg-slate-500 h-full flex-center">
                <CloudAlert size={40} />
                NO IMAGE
              </div>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
