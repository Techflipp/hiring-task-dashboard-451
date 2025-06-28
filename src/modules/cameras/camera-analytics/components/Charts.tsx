'use client';
import React from 'react';
import { Typography } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const COLORS = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
];
const BORDER_COLORS = COLORS.map(c => c.replace('0.5', '1'));

interface Props {
    ageDistributionData: { label: string; count: number|unknown }[];
}

export default function AgeCharts({ ageDistributionData }: Props) {
    const chartData = {
        labels: ageDistributionData.map(d => d.label),
        datasets: [{
            label: 'Age Count',
            data: ageDistributionData.map(d => d.count),
            backgroundColor: COLORS,
            borderColor: BORDER_COLORS,
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Age Distribution' },
        },
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-5 justify-around items-center h-auto">
            <div className="w-full md:w-1/2 h-[350px]">
                <Typography variant="subtitle1" align="center">Bar Chart</Typography>
                <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="w-full md:w-1/2 h-[350px] ">
                <Typography variant="subtitle1" align="center">Pie Chart</Typography>
                <Pie data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}
