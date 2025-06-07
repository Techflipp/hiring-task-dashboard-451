"use client";
import dynamic from 'next/dynamic';

const CameraTableClient = dynamic(() => import('./cameraTable'), {
    ssr: false, loading: () =>
        <div className="text-center p-4 text-xl text-white ">Loading...</div>
});

export default CameraTableClient