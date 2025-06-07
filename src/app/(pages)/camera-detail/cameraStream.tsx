'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface CameraStreamProps {
    hlsUrl: string;
}

const CameraStream = ({ hlsUrl }: CameraStreamProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let hls: any | null = null;

        if (videoRef.current) {
            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(hlsUrl);
                hls.attachMedia(videoRef.current);
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = hlsUrl;
            }
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [hlsUrl]);

    console.log('CameraStream component rendered with URL:', hlsUrl);

    return (
        <video
            ref={videoRef}
            controls
            autoPlay
            muted
            height={"100%"}
            width={"100%"}
            className="w-full border-round shadow-2 h-full"
        />
    );
};

export default CameraStream;
