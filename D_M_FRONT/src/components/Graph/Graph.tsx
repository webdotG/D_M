import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './Graph.module.scss';
import { loadDreams} from '../../API/dreams';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph: React.FC = () => {
  const [dreamDates, setDreamDates] = useState<string[]>([]);
  const [memoryDates, setMemoryDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dreams = await loadDreams('сны');
        const memories = await loadDreams('воспоминания');

        const dreamDates = dreams.map((dream: { date: string }) => dream.date);
        const memoryDates = memories.map((memory: { date: string }) => memory.date);

        setDreamDates(dreamDates);
        setMemoryDates(memoryDates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const startDate = new Date('1989-06-25');
  const endDate = new Date('2024-06-25');
  const years = endDate.getFullYear() - startDate.getFullYear();
  const labels = Array.from({ length: years + 1 }, (_, i) => startDate.getFullYear() + i);

  const dreamDataPoints = labels.map(label => dreamDates.filter(date => new Date(date).getFullYear() === label).length);
  const memoryDataPoints = labels.map(label => memoryDates.filter(date => new Date(date).getFullYear() === label).length);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Сны',
        data: dreamDataPoints,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Воспоминания',
        data: memoryDataPoints,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 1,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
    //   legend: {
    //     display: true,
    //   },
    //   tooltip: {
    //     enabled: true,
    //   },
    },
    scales: {
      x: {
        title: {
        //   display: true,
          text: 'Год',
        },
      },
      y: {
        title: {
        //   display: true,
          text: 'Количество записей',
        },
       
      },
    },
  };

  return (
    <div className={styles.graphContainer}>
        <h2></h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default Graph;
