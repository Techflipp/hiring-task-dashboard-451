import { getCameraDetails } from "@/lib/api";
import CameraHeader from "./camera-header";
import LiveFeed from "./live-feed";
import StreamingConfig from "./streaming-config";
import TagsCard from "./tags-card";
import DemographicsConfig from "./demographics-config";

type Props = {
  cameraId: string;
};

export default async function CameraDetailsFetcher({ cameraId }: Props) {
  const data = await getCameraDetails(cameraId);

  return (
    <>
      <CameraHeader data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Camera Feed and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <LiveFeed data={data} />
          <StreamingConfig data={data} />
        </div>

        {/* Right Column - Tags and Demographics Config */}
        <div className="space-y-6">
          <TagsCard tags={data.tags} />
          <DemographicsConfig data={data.demographics_config} />
        </div>
      </div>
    </>
  );
}
