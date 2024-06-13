import React, { useState, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataBlock = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-items: center;
`;

const ChartTitle = styled.h3`
  color: #333;
`;

const StyledBarChart = styled(Bar)`
  max-height: 250px;
`;

const ChartBlock = ({ title, data, dataKey }) => {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const createChartData = () => ({
    labels: data.map(item => item.device_id.toString()),
    datasets: [
      {
        label: title,
        data: data.map(item => item[dataKey]),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  });

  const maxChartWidth = isMobile ? '100%' : '100%';
  const maxBlockWidth = isMobile ? '100%' : '100%';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Device ID'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: dataKey.replace(/_/g, ' ').toUpperCase()
        }
      }
    }
  };

  return (
    <DataBlock style={{ maxWidth: maxBlockWidth }}>
      <ChartTitle>{title}</ChartTitle>
      <StyledBarChart data={createChartData()} options={options} style={{ maxWidth: maxChartWidth }} />
    </DataBlock>
  );
};

export default ChartBlock;
