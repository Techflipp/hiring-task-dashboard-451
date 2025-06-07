'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { useRef, useMemo } from 'react';
import { fetchCameraDetails } from '../cameraDetailServices';
import CameraSkeleton from '../cameraDetailSkeleton';
import CameraStream from '../cameraStream';
import { Formik, Form, Field } from 'formik';
import { CameraSchema, InputFields } from '../schemas/inputsField';
import { CameraData } from '@/types/camera';
import CameraErrorFallback from './cameraError';
import CameraTags from './cameraTags';
import { useUpdateCamera } from '../useUpdateCamera';
import DemographicsChart from './components/demographicsChart';

const CameraDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const cameraId = params?.id?.toString() || '';

  const {
    data: camera,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CameraData>({
    queryKey: ['camera', cameraId],
    queryFn: () => fetchCameraDetails(cameraId),
    enabled: !!cameraId,
    retry: 2,
  });

  const mutation = useUpdateCamera(cameraId, toast, () => refetch());

  if (isLoading) return <CameraSkeleton />;

  if (isError || !camera) {
    return (
      <CameraErrorFallback
        toastRef={toast}
        error={error}
        onRefresh={() => refetch()}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <div className="surface-0 min-h-screen">
      <Toast ref={toast} />
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex align-items-center justify-content-between mb-4">
          <Button
            icon="pi pi-arrow-left"
            label="Back"
            text
            onClick={() => router.back()}
          />
          <Button
            icon="pi pi-refresh"
            label="Refresh"
            text
            onClick={() => refetch()}
            className="text-primary"
          />
        </div>

        <Card className="shadow-2 border-round-lg overflow-hidden">
          <div className="">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-primary">
                {camera?.name}
              </h1>
            </div>
            <Divider />

            <Formik
              initialValues={{
                name: camera.name,
                rtsp_url: camera.rtsp_url,
              }}
              validationSchema={CameraSchema}
              onSubmit={values => mutation.mutate(values)}
              enableReinitialize
            >
              {({ errors, touched, values, initialValues }) => {
                const hasChanged = useMemo(
                  () =>
                    values.name !== initialValues.name ||
                    values.rtsp_url !== initialValues.rtsp_url,
                  [values, initialValues],
                );

                const inputFields = InputFields(errors, touched);

                return (
                  <Form>
                    <div className="grid">
                      <div className="col-12 lg:col-7">
                        <div className="flex flex-column gap-4">
                          <div>
                            <label className="block mb-1 text-white">
                              Camera ID
                            </label>
                            <div className="p-inputtext w-full surface-100 border-1 border-round p-3 text-white font-mono text-sm">
                              {camera?.id}
                            </div>
                          </div>
                          {inputFields.map(field => (
                            <div key={field.name}>
                              <label className="block mb-1 text-white">
                                {field.label}
                              </label>
                              <Field
                                name={field.name}
                                className={field.className}
                              />
                            </div>
                          ))}

                          <div>
                            <label className="block mb-1 text-white">
                              Status
                            </label>
                            <div className="flex justify-content-start">
                              <Badge
                                value={
                                  camera?.is_active ? 'Active' : 'Inactive'
                                }
                                severity={
                                  camera?.is_active ? 'success' : 'danger'
                                }
                                className="py-1 px-2 text-center flex align-items-center"
                              />
                            </div>
                          </div>

                          {camera?.tags?.length > 0 && (
                            <CameraTags tags={camera.tags} />
                          )}

                          {hasChanged && (
                            <div className="flex justify-content-end gap-2 mt-3">
                              <Button
                                type="submit"
                                label="Save Changes"
                                icon="pi pi-check"
                                loading={mutation.isPending}
                                className="bg-primary text-white border-round-lg w-full px-4 py-2"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          <div className="mt-8">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Demographics
            </h1>
            <DemographicsChart />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CameraDetailsPage;
