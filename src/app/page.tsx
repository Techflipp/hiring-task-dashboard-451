import CamerasPage from "@/components/CameraPage";
import { getCameras } from "@/services/cameras";

export default async function ListCameras() {
  const data = await getCameras();
  return ( <CamerasPage  serverData={data}/> )

}