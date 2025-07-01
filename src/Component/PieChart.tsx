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
    responsive: false,
    maintainAspectRatio: false,
    cutout: '70%',
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
        padding: 15,
    },
};

const PieChart: React.FC = () => {
    return (
        <div className="lg:w-full lg:h-full flex justify-center items-center rounded-lg p-4 overflow-hidden flex-col bg-bgsecondary text-text">
            <h2 className="text-2xl mt-4 p-2">Analysis summary</h2>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default PieChart;
