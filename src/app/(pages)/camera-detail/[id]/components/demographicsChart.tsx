import React, { useState, useEffect, useMemo } from 'react';
import { Chart } from 'primereact/chart';
import {
  demoCameraSchema,
  demoInputFields,
} from '../../schemas/demoGraphicFields';
import { Formik, Form, Field } from 'formik';

export default function DemographicsChart() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary',
    );
    const data = {
      labels: [
        'Eating',
        'Drinking',
        'Sleeping',
        'Designing',
        'Coding',
        'Cycling',
        'Running',
      ],
      datasets: [
        {
          label: 'My First dataset',
          borderColor: documentStyle.getPropertyValue('--bluegray-400'),
          pointBackgroundColor:
            documentStyle.getPropertyValue('--bluegray-400'),
          pointBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor:
            documentStyle.getPropertyValue('--bluegray-400'),
          data: [65, 59, 90, 81, 56, 55, 40],
        },
        {
          label: 'My Second dataset',
          borderColor: documentStyle.getPropertyValue('--pink-400'),
          pointBackgroundColor: documentStyle.getPropertyValue('--pink-400'),
          pointBorderColor: documentStyle.getPropertyValue('--pink-400'),
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor: documentStyle.getPropertyValue('--pink-400'),
          data: [28, 48, 40, 19, 96, 27, 100],
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: textColorSecondary,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="card flex justify-content-center">
      <div className="col-6">
        <Formik
          initialValues={{
            track_history_max_length: '',
            exit_threshold: '',
            min_track_duration: '',
            min_track_updates: '',
            save_interval: '',
          }}
          validationSchema={demoCameraSchema}
          onSubmit={values => mutation.mutate(values)}
          enableReinitialize
        >
          {({ errors, touched, values, initialValues }) => {
            const hasChanged = useMemo(
              () =>
                values.track_history_max_length !==
                  initialValues.track_history_max_length ||
                values.exit_threshold !== initialValues.exit_threshold,
              values.min_track_duration !== initialValues.min_track_duration,
              values.min_track_updates !== initialValues.min_track_updates,
              values.save_interval !== initialValues.save_interval,
              [values, initialValues],
            );

            const inputFields = demoInputFields(errors, touched);

            return (
              <Form>
                <div className="grid">
                  <div className="col-12 lg:col-6">
                    <div className="flex flex-column gap-4">
                      {inputFields.map(field => (
                        <div className="col-12 pl-0" key={field.name}>
                          <label className="block mb-1 text-white">
                            {field.label}
                          </label>
                          <Field
                            name={field.name}
                            className={field.className}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <div className="col-6">
        <Chart
          type="radar"
          data={chartData}
          options={chartOptions}
          className="w-full md:w-30rem"
        />
      </div>
    </div>
  );
}
