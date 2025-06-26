import { CameraDetails } from "@/types/camera";

function StreamingConfig({ data }: { data: CameraDetails }) {
  const {
    stream_frame_width,
    stream_frame_height,
    stream_max_length,
    stream_quality,
    stream_fps,
    stream_skip_frames,
  } = data;
  const configData = [
    {
      label: "Frame Width",
      value: `${stream_frame_width}px`,
    },
    {
      label: "Frame Height",
      value: `${stream_frame_height}px`,
    },
    {
      label: "Max Length",
      value: stream_max_length,
    },
    {
      label: "Quality",
      value: `${stream_quality}%`,
    },
    {
      label: "FPS",
      value: stream_fps,
    },
    {
      label: "Skip Frames",
      value: stream_skip_frames,
    },
  ];
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Stream Configuration
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {configData.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StreamingConfig;
