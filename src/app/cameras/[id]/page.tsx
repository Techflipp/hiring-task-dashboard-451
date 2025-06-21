import CameraDetailPage from "@/components/CameraDetails";
import { getCameraDetails } from "@/services/cameras";

export default async function CameraDetails({ params }: Promise<{ params: { id: string } }>) {
 
  const { id } = await params;

  const data = await getCameraDetails(id);
  return ( <CameraDetailPage  serverData={data}/> )

}