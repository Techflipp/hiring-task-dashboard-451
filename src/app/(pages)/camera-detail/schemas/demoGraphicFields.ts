import * as Yup from 'yup';

export const demoInputFields = (errors: any, touched: any) => [
  {
    label: 'Track History Max Length',
    name: 'track_history_max_length',
    className: `p-inputtext w-full surface-100 border-1 border-round p-3 text-white ${
      errors.track_history_max_length && touched.track_history_max_length
        ? 'p-invalid'
        : ''
    }`,
  },
  {
    label: 'Exit Threshold',
    name: 'exit_threshold',
    className: `p-inputtext w-full surface-100 border-1 border-300 border-round p-3 text-white break-all font-mono ${
      errors.exit_threshold && touched.exit_threshold ? 'p-invalid' : ''
    }`,
  },
  {
    label: 'Min Track Duration',
    name: 'min_track_duration',
    className: `p-inputtext w-full surface-100 border-1 border-300 border-round p-3 text-white break-all font-mono ${
      errors.min_track_duration && touched.min_track_duration ? 'p-invalid' : ''
    }`,
  },
  {
    label: 'Min Track Updates',
    name: 'min_track_updates',
    className: `p-inputtext w-full surface-100 border-1 border-300 border-round p-3 text-white break-all font-mono ${
      errors.min_track_updates && touched.min_track_updates ? 'p-invalid' : ''
    }`,
  },
  {
    label: 'Save Interval',
    name: 'save_interval',
    className: `p-inputtext w-full surface-100 border-1 border-300 border-round p-3 text-white break-all font-mono ${
      errors.save_interval && touched.save_interval ? 'p-invalid' : ''
    }`,
  },
];

export const demoCameraSchema = Yup.object().shape({
  track_history_max_length: Yup.string().required('Track history is required'),
  exit_threshold: Yup.string().required('Exit Threshold is required'),
  min_track_duration: Yup.string().required('Min Track Duration is required'),
  min_track_updates: Yup.string().required('Min Track Updates are required'),
  save_interval: Yup.string().required('Save Interval is required'),
});
