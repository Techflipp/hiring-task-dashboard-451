import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CameraForm } from '../../components/CameraForm';
import Link from 'next/link';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: string;
  tags?: string[];
}

interface CameraDetailPageProps {
  params: { id: string };
}

const fetchCamera = async (id: string): Promise<Camera> => {
  const response = await axios.get<Camera>(`https://task-451-api.ryd.wafaicloud.com/cameras/${id}`);
  return response.data;
};

export default function CameraDetailPage({ params }: CameraDetailPageProps) {
  const { id } = params;
  const { data: camera, isLoading, error } = useQuery<Camera, Error>({
    queryKey: ['camera', id],
    queryFn: () => fetchCamera(id),
  });

  if (isLoading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <Link href="/cameras" className="text-blue-500 hover:underline mb-4 inline-block">
        Back to Cameras
      </Link>
      <h1 className="text-2xl font-bold mb-4">{camera?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Details</h2>
          <p><strong>ID:</strong> {camera?.id}</p>
          <p><strong>Location:</strong> {camera?.location}</p>
          <p><strong>Status:</strong> {camera?.status}</p>
          <p><strong>Tags:</strong> {camera?.tags?.join(', ') || 'None'}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Update Camera</h2>
          {camera && <CameraForm camera={camera} />}
        </div>
      </div>
    </div>
  );
}