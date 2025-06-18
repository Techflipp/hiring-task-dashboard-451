"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, cameraSchema } from "@/app/_lib/schemas";
import { updateCamera } from "@/app/_lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CameraForm({ camera }: { camera: Camera }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Camera>({
    resolver: zodResolver(cameraSchema),
    defaultValues: camera,
  });

  const mutation = useMutation({
    mutationFn: updateCamera,
    onSuccess: () => {
      queryClient.invalidateQueries(["cameras"]);
      queryClient.invalidateQueries(["camera", camera.id]);
    },
  });

  const onSubmit = (data: Camera) => {
    mutation.mutate({ id: camera.id, data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields with proper validation */}
      <div>
        <label htmlFor="name">Camera Name</label>
        <input
          id="name"
          {...register("name")}
          className="w-full p-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Other fields... */}

      <button
        type="submit"
        disabled={mutation.isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {mutation.isLoading ? "Saving..." : "Save Changes"}
      </button>

      {mutation.isError && (
        <p className="text-red-500">Error updating camera</p>
      )}

      {mutation.isSuccess && (
        <p className="text-green-500">Camera updated successfully!</p>
      )}
    </form>
  );
}
