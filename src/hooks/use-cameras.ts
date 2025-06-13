'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { Camera } from '@/lib/types'
import { getCameras, getCamera, updateCamera } from '@/lib/api'
import { errorToastStyle, successToastStyle } from '@/components/toast-styles'

export const useCameras = (page = 1, size = 20, cameraName?: string) => {
  return useQuery({
    queryKey: ['cameras', page, size, cameraName],
    queryFn: () => getCameras(page, size, cameraName),
  })
}

export const useCamera = (id: string) => {
  return useQuery({
    queryKey: ['camera', id],
    queryFn: () => getCamera(id),
    enabled: !!id,
  })
}

export const useUpdateCamera = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Camera, 'tags'>> & { tags?: string[] } }) =>
      updateCamera(id, data),
    onSuccess: (updatedCamera) => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] })
      queryClient.invalidateQueries({ queryKey: ['camera', updatedCamera?.id] })
      toast.success('The camera has been updated successfully', {
        style: successToastStyle,
      })
    },
    onError: (error) => {
      console.error('Error updating camera:', error)
      toast.error('Failed to update camera', {
        style: errorToastStyle,
      })
    },
  })
}
