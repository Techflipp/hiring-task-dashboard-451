import axios from 'axios';

const API_BASE_URL = 'https://task-451-api.ryd.wafaicloud.com';

export const fetchCameraDetails = async (cameraId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cameras/${cameraId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching camera details:', error);
        throw new Error('Failed to fetch camera details');
    }
};

export const updateCameraDetails = async (Data: any) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/cameras/${Data.id}`, Data);
        return response.data;
    } catch (error) {
        console.error('Error fetching ', error);
        throw new Error('Failed to fetch camera stream URL');
    }
};

