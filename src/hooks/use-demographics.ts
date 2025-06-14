'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createDemographicsConfig, updateDemographicsConfig, getDemographicsResults } from '@/lib/api'
import type { DemographicsConfig, DemographicsFilters } from '@/lib/types'

import { errorToastStyle, successToastStyle } from '@/components/toast-styles'

export const useDemographicsResults = (filters: DemographicsFilters) => {
  return useQuery({
    queryKey: ['demographics-results', filters],
    queryFn: () => getDemographicsResults(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!filters.camera_id,
  })
}

export const useCreateDemographicsConfig = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<DemographicsConfig> & { camera_id: string }) => createDemographicsConfig(data),
    onSuccess: (config) => {
      queryClient.invalidateQueries({ queryKey: ['camera', config?.camera_id] })
      toast.success('Demographics configuration has been created successfully', { 
        description: 'The new demographic settings are now active.',
        style: successToastStyle 
      })
    },
    onError: (error) => {
      toast.error('Failed to create configuration', { 
        description: 'Please verify your settings and try again.',
        style: errorToastStyle 
      })
      console.log(error)
    },
  })
}

export const useUpdateDemographicsConfig = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DemographicsConfig> }) => updateDemographicsConfig(id, data),
    onSuccess: (config) => {
      queryClient.invalidateQueries({ queryKey: ['demographics-results'] })
      queryClient.invalidateQueries({ queryKey: ['camera', config?.camera_id] })
      toast.success('Demographics configuration has been updated successfully', { 
        description: 'Your changes have been saved and applied.',
        style: successToastStyle 
      })
    },
    onError: (error) => {
      toast.error('Failed to update configuration', { 
        description: 'Please check your connection and try again.',
        style: errorToastStyle 
      })
      console.log(error)
    },
  })
}
