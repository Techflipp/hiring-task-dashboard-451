import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';

export function CameraForm({ camera }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: camera.name,
      location: camera.location,
      status: camera.status,
    },
  });
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState(null);

  const mutation = useMutation({
    mutationFn: (data) => axios.put(`https://task-451-api.ryd.wafaicloud.com/cameras/${camera.id}`, data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries(['camera', camera.id]);
      const previousCamera = queryClient.getQueryData(['camera', camera.id]);
      queryClient.setQueryData(['camera', camera.id], { ...previousCamera, ...newData });
      return { previousCamera };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['camera', camera.id], context.previousCamera);
      setSubmitError('Failed to update camera. Please try again.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['camera', camera.id]);
      queryClient.invalidateQueries(['cameras']);
      setSubmitError(null);
      alert('Camera updated successfully!');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block">Name</label>
        <input
          {...register('name', { required: 'Name is required' })}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block">Location</label>
        <input
          {...register('location', { required: 'Location is required' })}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
      </div>
      <div>
        <label className="block">Status</label>
        <select
          {...register('status', { required: 'Status is required' })}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status.message}</p>}
      </div>
      {submitError && <p className="text-red-500">{submitError}</p>}
      <button
        type="submit"
        disabled={mutation.isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {mutation.isLoading ? 'Updating...' : 'Update Camera'}
      </button>
    </form>
  );
}