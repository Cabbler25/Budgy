import React from 'react';
import { Bar } from 'react-chartjs-2';
import colors from '../../assets/Colors';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'Expenses',
    type: 'line',
    data: [51, 65, 40, 49, 60, 37, 40],
    fill: false,
    borderColor: colors.red,
    backgroundColor: colors.red,
    pointBorderColor: colors.red,
    pointBackgroundColor: colors.red,
    pointHoverBackgroundColor: colors.red,
    pointHoverBorderColor: colors.red,
  }, {
    type: 'bar',
    label: 'Budgets',
    data: [200, 185, 590, 621, 250, 400, 95],
    fill: false,
    backgroundColor: '#71B37C',
    borderColor: '#71B37C',
    hoverBackgroundColor: '#71B37C',
    hoverBorderColor: '#71B37C',
  }]
};

export default function MixedLineGraph() {



  return (
    <Bar
      data={data}
      width={500}
      height={300}
    />
  );
};
