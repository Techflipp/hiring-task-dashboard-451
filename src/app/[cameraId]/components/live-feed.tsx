import Image from "next/image";

type Props = {
  data: {
    snapshot: string;
    stream_fps: number;
    stream_frame_width: number;
    stream_frame_height: number;
    rtsp_url: string;
  };
};
function LiveFeed({ data }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Live Feed</h2>
      </div>
      <div className="relative aspect-video bg-gray-100 ">
        <Image
          fill
          sizes="100%"
          src={data.snapshot}
          alt="Camera snapshot"
          className="w-full h-full object-cover absolute"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm">
          {data.stream_fps} FPS | {data.stream_frame_width}x
          {data.stream_frame_height}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 break-all">{data.rtsp_url}</p>
      </div>
    </div>
  );
}

export default LiveFeed;
