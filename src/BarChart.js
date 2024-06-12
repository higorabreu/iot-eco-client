import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [data, setData] = useState({ labels: [], datasets: [] });
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

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('https://smart-lighting-system-api.onrender.com/registers');
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Filtra os registros das últimas 24 horas
      const filteredData = result.data.filter(item => new Date(item.timestamp) >= last24Hours && item.state);

      // Conta as ocorrências por hora
      const occurrences = Array(24).fill(0);
      filteredData.forEach(item => {
        const hour = new Date(item.timestamp).getHours();
        occurrences[hour]++;
      });

      const labels = occurrences.map((_, index) => `${index}:00`);
      const values = occurrences;

      setData({
        labels,
        datasets: [
          {
            label: 'Ocorrências de Lâmpada Ligada nas Últimas 24 Horas',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
        ],
      });
    };

    fetchData();
  }, []);

  const maxChartWidth = isMobile ? '350px' : '100%';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2, // Proporção largura/altura
    scales: {
      x: {
        type: 'category',
        ticks: {
          stepSize: 1
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: maxChartWidth, margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
