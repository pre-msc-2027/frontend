import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    labels: ['Casing', 'Duplication', 'Arthur', 'Player'],
    datasets: [
        {
            label: 'Errors',
            data: [4, 3, 1, 1],
            backgroundColor: ['#547fff', '#df4cd9', '#ffb272', '#2dd4bf'],
            borderColor: '#fff',
            borderWidth: 0,
            hoverOffset: 12,
            offset: 0,
        },
    ],
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
        legend: {
            display: false,
            labels: {
                color: '#FFFFFF',
                font: {
                    size: 14,
                },
            },
        },
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    const value = context.parsed;
                    return `${value} errors`;
                },
            },
        },
    },
    animation: {
        animateRotate: true,
        duration: 1200,
    },
    layout: {
        padding: 30,
    },
};

const PieChart: React.FC = () => {
    return (
        <Doughnut data={data} options={options}/>
    );
};

export default PieChart;
