// app/cameras/[id]/edit/page.tsx
import  {getCameraData}  from "@/lib/getCameraData";
import CameraForm from '@/components/CameraForm';
import { notFound } from 'next/navigation';
import { use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};


export default async function EditCameraPage({ params }: Props) {
  const {id} = use<{id:string}>(params)
  const camera = await getCameraData(id);

  if (!camera) return notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Camera</h1>
      <CameraForm cameraId={params.id} initialData={camera} />
    </div>
  );
}
