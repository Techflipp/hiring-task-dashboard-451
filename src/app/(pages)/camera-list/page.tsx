// // app/cameras/page.tsx
// import React from 'react';
// import { Metadata } from 'next';
// import CameraTable from '@/app/(pages)/camera-list/components/cameraTable';
// import { cameraService } from '@/app//(pages)/camera-list/components/cameraServices';
// import { CameraPageProps } from '@/types/camera';
// import { ReactQueryProvider } from '@/store/useQueryClient';

// export const metadata: Metadata = {
//   title: 'Cameras Management',
//   description: 'Manage and monitor cameras',
// };

// interface PageProps {
//   searchParams: {
//     camera_name?: string;
//     page?: string;
//     size?: string;
//   };
// }

// export default async function CamerasPage({ searchParams }: PageProps) {
//   const search = searchParams.camera_name || '';
//   const page = parseInt(searchParams.page || '1', 10);
//   const size = parseInt(searchParams.size || '10', 10);

//   let initialData;
//   try {
//     initialData = await cameraService.getCameras({
//       camera_name: search,
//       page,
//       size,
//     });
//   } catch (error) {
//     console.error('Error fetching initial data:', error);
//     initialData = {
//       data: [],
//       total: 0,
//       page: 1,
//       size: 10,
//       total_pages: 0,
//     };
//   }

//   const pageProps: CameraPageProps = {
//     initialData,
//     initialSearch: search,
//     initialPage: page,
//     initialSize: size,
//   };

//   return (
//     <ReactQueryProvider>
//       <div className="container mx-auto px-4 py-6">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-white">Cameras Management</h1>
//           <p className="text-white mt-2">
//             Monitor and manage your camera network
//           </p>
//         </div>

//         <CameraTable />
//       </div>
//     </ReactQueryProvider>
//   );
// }
