'use client';

import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';

const CameraDetailsSkeleton = () => {
    return (
        <div className="surface-0 min-h-screen">
            <div className="p-4 max-w-6xl mx-auto">
                <div className="flex align-items-center justify-content-between mb-4">
                    <Skeleton width="150px" height="2.5rem" />
                    <Skeleton width="100px" height="2.5rem" />
                </div>

                <Card className="shadow-2 border-round-lg">
                    <div className="grid">
                        <div className="col-12 lg:col-8">
                            <div className="p-4">
                                <Skeleton width="100%" height="3rem" className="mb-4" />
                                <div className="grid">
                                    {[...Array(4)].map((_, idx) => (
                                        <div key={idx} className="col-12 mb-4">
                                            <Skeleton width="80px" height="1.5rem" className="mb-2" />
                                            <Skeleton width="100%" height="2.5rem" />
                                        </div>
                                    ))}
                                </div>
                                <Skeleton width="50px" height="1.5rem" className="mb-3" />
                                <div className="flex gap-2 flex-wrap">
                                    <Skeleton width="80px" height="2rem" />
                                    <Skeleton width="70px" height="2rem" />
                                    <Skeleton width="90px" height="2rem" />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 lg:col-4">
                            <Skeleton width="100%" height="300px" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CameraDetailsSkeleton;
