import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FeaturesChartProps {
  features: number[];
}

const FeaturesChart: React.FC<FeaturesChartProps> = ({ features }) => {
  const labels = Array.from({ length: features.length }, (_, i) => `V${i + 1}`);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Feature Value',
        data: features,
        backgroundColor: features.map(value => 
          value >= 0 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(239, 68, 68, 0.6)'
        ),
        borderColor: features.map(value => 
          value >= 0 ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Value: ${context.raw.toFixed(4)}`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  return <Bar data={chartData} options={options} />;
};

export default FeaturesChart;