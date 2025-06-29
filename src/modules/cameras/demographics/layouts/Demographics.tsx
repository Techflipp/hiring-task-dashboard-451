'use client';

import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCameraDetails } from '@/modules/cameras/camera-details/hooks/useCameraDetails';
import { useCreateDemographicsConfig } from '@/modules/cameras/demographics/hooks/useCreateDemographicsConfig';
import { useUpdateDemographicsConfig } from '@/modules/cameras/demographics/hooks/useUpdateDemographicsConfig';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import { FormItem } from '@/modules/cameras/demographics/components/Input';
import Tags from "@/modules/cameras/demographics/components/Tags";
import {Button} from "@mui/material";
import {Flex} from "@/modules/cameras/camera-list/components/flex";

export type Tag = {
    id: string;
    name: string;
    color?: string;
};
export type DemographicsFormData = {
    name: string;
    rtsp_url: string;
    stream_frame_width: number;
    stream_frame_height: number;
    stream_max_length: number;
    stream_quality: number;
    stream_fps: number;
    stream_skip_frames: number;
    tags: Tag[] ;
};

export default function CameraDemographicsForm() {
    const { id: cameraId } = useParams();
    const { data: camera, isLoading } = useCameraDetails(cameraId as string);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<DemographicsFormData>({
        defaultValues: {
            name: '',
            rtsp_url: '',
            stream_frame_width: 0,
            stream_frame_height: 0,
            stream_max_length: 0,
            stream_quality: 0,
            stream_fps: 0,
            stream_skip_frames: 0,
        },
    });

    useEffect(() => {
        if (camera) {
            reset({
                name: camera.name,
                rtsp_url: camera.rtsp_url,
                stream_frame_width: camera.stream_frame_width,
                stream_frame_height: camera.stream_frame_height,
                stream_max_length: camera.stream_max_length,
                stream_quality: camera.stream_quality,
                stream_fps: camera.stream_fps,
                stream_skip_frames: camera.stream_skip_frames,
            });
            setSelectedTags(camera.tags || []);
        }
    }, [camera, reset]);
    const { mutate: createConfig, isPending: isCreating, isSuccess: isCreated } = useCreateDemographicsConfig();
    const { mutate: updateConfig, isPending: isUpdating, isSuccess: isUpdated } = useUpdateDemographicsConfig(camera?.demographics_config?.id);

    const onSubmit = (data: DemographicsFormData) => {
        const payload = {
            ...data,
            camera_id: cameraId,
            tags: selectedTags,
        };

        if (camera?.demographics_config?.id) {
            updateConfig(payload);
        } else {
            createConfig(payload);
        }
    };

    const handleTagSelect = (tag: Tag) => {
        if (!selectedTags.find(t => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleTagRemove = (tagId: string) => {
        setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
    };

    if (isLoading) return <p className="p-6">Loading camera data...</p>;

    return (
        <div className="p-6 max-w-xl mt-5 mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-center">🎛️ Demographics Configuration</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormItem name="name" label="Camera Name" control={control} required />
                <FormItem name="rtsp_url" label="RTSP URL" control={control} required placeholder="rtsp://example.com/stream" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem name="stream_frame_width" label="Frame Width" control={control} type="number" required min={0} />
                    <FormItem name="stream_frame_height" label="Frame Height" control={control} type="number" required min={0} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem name="stream_max_length" label="Max Length (seconds)" control={control} type="number" required min={0} />
                    <FormItem name="stream_quality" label="Quality (1–100)" control={control} type="number" required min={1} max={100} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem name="stream_fps" label="Frames Per Second" control={control} type="number" required min={0} />
                    <FormItem name="stream_skip_frames" label="Skip Frames" control={control} type="number" required min={0} />
                </div>
                <Tags
                    tags={selectedTags}
                    selectedTagIds={selectedTags}
                    onTagSelect={handleTagSelect}
                    onTagRemove={handleTagRemove}
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                    disabled={isCreating || isUpdating}
                >
                           {isCreating || isUpdating ? 'Saving...' : '💾 Save Configuration'}
                </button>

                {(isCreated || isUpdated) && (
                    <Flex flexDirection={"column"}>
                        <p className="text-green-600 text-center mt-2">✅ Configuration saved successfully!</p>
                        <Button
                            variant="outlined"
                            color="primary"
                            component={Link}
                            href={`/cameras/${cameraId}/demographics/results`}
                            sx={{ mt: 2 }}
                        >
                            🔍 View Analytics
                        </Button>
                    </Flex>
                )}
            </form>
        </div>
    );
}
