// components/CameraErrorFallback.tsx
'use client';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

interface CameraErrorFallbackProps {
    toastRef: any;
    error: unknown;
    onRefresh: () => void;
    onBack: () => void;
}

const CameraErrorFallback = ({
    toastRef,
    error,
    onRefresh,
    onBack,
}: CameraErrorFallbackProps) => {
    const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred.';

    return (
        <div className="surface-0 min-h-screen">
            <Toast ref={toastRef} />
            <div className="p-4 max-w-6xl mx-auto">
                <div className="flex align-items-center justify-content-between mb-4">
                    <Button icon="pi pi-arrow-left" label="Back" text onClick={onBack} />
                </div>
                <Card className="shadow-2 border-round-lg text-center p-6">
                    <i className="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                    <h3 className="text-2xl font-semibold text-700 mb-3">
                        Failed to Load Camera Details
                    </h3>
                    <p className="text-600 mb-4">{errorMessage}</p>
                    <div className="flex gap-3 justify-content-center">
                        <Button label="Try Again" icon="pi pi-refresh" onClick={onRefresh} />
                        <Button
                            label="Go Back"
                            icon="pi pi-arrow-left"
                            onClick={onBack}
                            className="p-button-outlined"
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CameraErrorFallback;
