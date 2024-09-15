// src/ChartComponent.js
import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const ChartComponent = () => {
  // Example data
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [30, 45, 60, 35, 90],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  return (
    <div>
      <h2>Line Chart</h2>
      <Line data={data} />
      
      <h2>Bar Chart</h2>
      <Bar data={data} />

      <h2>Pie Chart</h2>
      <Pie
        data={{
          labels: ['Red', 'Blue', 'Yellow'],
          datasets: [
            {
              data: [300, 50, 100],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
          ],
        }}
      />
    </div>
  );
};

export default ChartComponent;