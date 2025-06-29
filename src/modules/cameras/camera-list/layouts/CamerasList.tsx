'use client';

import { useState } from 'react';
import { useCameras } from '@/modules/cameras/camera-list/hooks/useCameras';
import { Search } from '@/modules/cameras/camera-list/components/Search';
import { Typography } from '@mui/material';
import {Table} from "../components/CameraTable";

interface Camera {
    id: string;
    name: string;
    rtsp_url: string;
    is_active: boolean;
}

export default function CameraListPage() {
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(10);

    const page = Math.floor(skip / size) + 1;

    const { data, isLoading } = useCameras(page, search, size) as {
        isLoading: boolean;
        data?: { cameras: Camera[]; total: number };
    };

    console.log(data)
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <Typography variant="h5" gutterBottom>
                📷 Cameras
            </Typography>

            <div className="mb-4">
                <Search
                    width={1100}
                    placeholder="camera name"
                    onSearch={(value: string) => {
                        setSearch(value);
                        setSkip(0);
                    }}
                />
            </div>

            <Table
                rows={data?.cameras as []}
                loading={isLoading}
                totalCount={data?.total || 0}
                onChangePage={(newSkip, newSize) => {
                    setSkip(newSkip);
                    setSize(newSize);
                }}
            />
        </div>
    );
}
