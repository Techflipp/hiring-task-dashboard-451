"use client";

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDemographicsConfig, updateDemographicsConfig } from '@/lib/api';
import { Camera, DemographicsConfig } from '@/types';

interface DemographicsConfigFormProps {
  camera: Camera;
}

const initialConfig: Omit<DemographicsConfig, 'id' | 'camera_id'> = {
    track_history_max_length: 10,
    exit_threshold: 30,
    min_track_duration: 5,
    detection_confidence_threshold: 0.5,
    demographics_confidence_threshold: 0.5,
    min_track_updates: 3,
    box_area_threshold: 0.1,
    save_interval: 600,
    frame_skip_interval: 1,
};

export default function DemographicsConfigForm({ camera }: DemographicsConfigFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<DemographicsConfig>>(camera.demographics_config || {});

  useEffect(() => {
    setFormData(camera.demographics_config || {});
  }, [camera]);

  const mutation = useMutation({
    mutationFn: (configData: Partial<DemographicsConfig>) => {
      if (camera.demographics_config) {
        return updateDemographicsConfig(camera.demographics_config.id, configData);
      } else {
        return createDemographicsConfig({ ...configData, camera_id: camera.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camera', camera.id] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation if needed
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, camera_id, ...updateData } = formData;
    mutation.mutate(updateData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(initialConfig).map((key) => (
            <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</label>
                <input 
                    type="number" 
                    id={key} 
                    name={key} 
                    value={formData[key as keyof DemographicsConfig] || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded"
                    step={key.includes('confidence') || key.includes('area') || key.includes('interval') ? '0.1' : '1'}
                />
            </div>
        ))}
      
      <button type="submit" disabled={mutation.isPending} className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
        {mutation.isPending ? 'Saving...' : (camera.demographics_config ? 'Update Config' : 'Create Config')}
      </button>
      {mutation.isSuccess && <p className="text-green-500">Configuration saved successfully!</p>}
      {mutation.isError && <p className="text-red-500">Error saving configuration: {mutation.error.message}</p>}
    </form>
  );
}
