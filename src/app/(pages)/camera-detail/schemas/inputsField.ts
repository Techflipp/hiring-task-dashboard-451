import * as Yup from 'yup';

export const InputFields = (errors: any, touched: any) => [
    {
        label: 'Camera Name',
        name: 'name',
        className: `p-inputtext w-full surface-100 border-1 border-round p-3 text-white ${errors.name && touched.name ? 'p-invalid' : ''
            }`,
    },
    {
        label: 'RTSP URL',
        name: 'rtsp_url',
        className: `p-inputtext w-full surface-100 border-1 border-300 border-round p-3 text-white break-all font-mono ${errors.rtsp_url && touched.rtsp_url ? 'p-invalid' : ''
            }`,
    },
];

export const CameraSchema = Yup.object().shape({
    name: Yup.string().required('Camera name is required'),
    rtsp_url: Yup.string().required('RTSP URL is required'),
});