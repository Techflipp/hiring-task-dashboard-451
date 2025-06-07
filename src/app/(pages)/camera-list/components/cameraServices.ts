import axios from 'axios';
import { CameraResponse } from '@/types/camera';

const API_BASE_URL = 'https://task-451-api.ryd.wafaicloud.com';

export const cameraService = {
    async getCameras(params: {
        camera_name?: string;
        page?: number;
        size?: number;
    }): Promise<CameraResponse | unknown | any> {
        try {
            const response = await axios.get(`${API_BASE_URL}/cameras/`, {
                params: {
                    camera_name: params.camera_name || '',
                    page: params.page || 1,
                    size: params.size || 10,
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching cameras:', error);
            throw new Error('Failed to fetch cameras');
        }
    },
};

// For client-side usage with React Query
export const fetchCameras = async (params: {
    camera_name?: string;
    page?: number;
    size?: number;
}) => {
    return cameraService.getCameras(params);
};