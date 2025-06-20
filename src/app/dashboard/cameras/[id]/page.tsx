import { notFound } from "next/navigation";
import { CameraDetails } from "@/app/_components/camera-details";
import { getCameraById } from "@/app/_lib/api";

export default async function CameraDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const camera = await getCameraById(params.id);

  if (!camera) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Camera Details</h1>
      <CameraDetails camera={camera} />
    </div>
  );
}
