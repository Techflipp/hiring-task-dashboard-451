'use client';

import { useMutation } from '@tanstack/react-query';
import { updateCameraDetails } from './cameraDetailServices';
import { showErrorToast, showSuccessToast } from './[id]/toastMessages';
import { CameraData } from '@/types/camera';

export const useUpdateCamera = (cameraId: string, toastRef: React.RefObject<any>, onSuccessCallback?: () => void) => {
    return useMutation({
        mutationFn: (updatedData: Partial<CameraData>) =>
            updateCameraDetails({ ...updatedData, id: cameraId }),
        onSuccess: () => {
            showSuccessToast(toastRef, 'Updated', 'Camera details updated successfully', 3000);
            onSuccessCallback?.();
        },
        onError: () => {
            showErrorToast(toastRef, 'Update Failed', 'Unable to update camera details');
        },
    });
};
