/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CategoryScale,
  LinearScale,
  Chart,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Doughnut } from 'react-chartjs-2';
Chart.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const barData = {
  labels: [''],
  datasets: [
    {
      label: '0',
      data: [10],
      backgroundColor: '#cccccc',
    },
    {
      label: '1',
      data: [900],
      backgroundColor: '#4A90E2',
    },
    {
      label: '2',
      data: [335],
      backgroundColor: '#FFCD56',
    },
    {
      label: '3',
      data: [1100],
      backgroundColor: '#FF9F40',
    },
  ],
};

const data = {
  labels: ['', 'Coordinape', 'Wingding', 'Flexi'],
  datasets: [
    {
      label: 'pGive Composition',
      data: [10, 900, 335, 1100],
      backgroundColor: ['#eef5d9', '#daf193', '#adc075', '#8c9c5d', '#c6db89'],
      borderColor: 'transparent',
      borderWidth: 0,
    },
  ],
};

export const CoSoulChart = () => {
  return (
    <>
      {/* <Bar
        data={barData}
        options={{
          indexAxis: 'y' as const,
          responsive: true,
          scales: {
            x: {
              stacked: true,
              display: false,
            },
            y: {
              stacked: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            tooltip: {
              enabled: true,
              position: 'average',
            },
            datalabels: {
              anchor: 'center',
              align: 'end',
              color: '#c6db89',
              font: {
                size: 40,
                weight: 'bold',
              },
              formatter: function (value, context) {
                return barData.datasets[context.datasetIndex];
                // return data.labels[context.dataIndex];
              },
            },
          },
        }}
      /> */}
      <Doughnut
        data={data}
        options={{
          responsive: true,
          spacing: 15,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
            },
            datalabels: {
              anchor: 'center',
              align: 'center',
              color: 'black',
              font: {
                size: 20,
                weight: 'bold',
              },
              formatter: function (value, context) {
                return data.labels[context.dataIndex];
              },
            },
          },
        }}
      />
    </>
  );
};
