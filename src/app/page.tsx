import React from 'react';
import { Metadata } from 'next';
import { cameraService } from '@/app//(pages)/camera-list/components/cameraServices';
import { CameraPageProps } from '@/types/camera';
import { ReactQueryProvider } from '@/store/useQueryClient';
import dynamic from 'next/dynamic';
import CameraTableClient from './(pages)/camera-list/components/cameraTableClient';


export const metadata: Metadata = {
  title: 'Cameras Management',
  description: 'Manage and monitor cameras',
};

interface PageProps {
  searchParams: Promise<{
    camera_name?: string;
    page?: string;
    size?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {

  const waitSearchParams = await searchParams;

  const search = waitSearchParams.camera_name || '';
  const page = parseInt(waitSearchParams.page || '1', 10);
  const size = parseInt(waitSearchParams.size || '10', 10);

  let initialData;
  try {
    initialData = await cameraService.getCameras({
      camera_name: search,
      page,
      size,
    });
  } catch (error) {
    console.error('Error fetching initial data:', error);
    initialData = {
      data: [],
      total: 0,
      page: 1,
      size: 10,
      total_pages: 0,
    };
  }

  const pageProps: CameraPageProps = {
    initialData,
    initialSearch: search,
    initialPage: page,
    initialSize: size,
  };

  return (
    <ReactQueryProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Cameras Management</h1>
          <p className="text-white mt-2">
            Monitor and manage your camera network
          </p>
        </div>
        <CameraTableClient />
      </div>
    </ReactQueryProvider>
  );
}