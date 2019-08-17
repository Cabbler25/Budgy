import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import colors from '../../assets/Colors';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'Expenses',
    type: 'line',
    data: [51, 65, 40, 49, 60, 37, 40],
    fill: false,
    borderColor: colors.lightGreen,
    backgroundColor: colors.lightGreen,
    pointBorderColor: colors.lightGreen,
    pointBackgroundColor: colors.lightGreen,
    pointHoverBackgroundColor: colors.lightGreen,
    pointHoverBorderColor: colors.lightGreen,
  }, {
    type: 'bar',
    label: 'Budgets',
    data: [200, 185, 590, 621, 250, 400, 95],
    fill: false,
    backgroundColor: colors.lightGreen,
    borderColor: colors.lightGreen,
    hoverBackgroundColor: colors.lightGreen,
    hoverBorderColor: colors.lightGreen,
  }]
};

export default function MixedLineGraph(props: any) {
  const [data, setData] = useState();
  useEffect(() => {
    // Create the graph data.
    const dataArr = new Array(2);
    let arr = Array.from(props.labels, () => 0);
    if (props.expenseData) {
      props.expenseData.forEach((e: any) => {
        arr[props.labels.indexOf(e.key)] += e.data;
      });
    }
    dataArr[0] = arr;

    arr = Array.from(props.labels, () => 0);
    if (props.budgetData) {
      props.budgetData.forEach((e: any) => {
        arr[props.labels.indexOf(e.key)] += e.data;
      });
    }
    dataArr[1] = arr;

    let removeIndex = new Array();
    for (let i = 0; i < dataArr[0].length; i++) {
      if (dataArr[0][i] === 0 && dataArr[1][i] === 0) {
        removeIndex.push(i);
      }
    }

    let labels = props.labels;
    dataArr[0] = dataArr[0].filter((data: any, i: number) => !removeIndex.includes(i))
    dataArr[1] = dataArr[1].filter((data: any, i: number) => !removeIndex.includes(i))
    labels = labels.filter((data: any, i: number) => !removeIndex.includes(i))

    setData({
      labels: labels,
      datasets: [{
        label: 'Budgets',
        type: 'line',
        data: dataArr[1],
        fill: false,
        borderColor: colors.lightGreen,
        backgroundColor: colors.lightGreen,
        pointBorderColor: colors.lightGreen,
        pointBackgroundColor: colors.lightGreen,
        pointHoverBackgroundColor: colors.lightGreen,
        pointHoverBorderColor: colors.lightGreen,
      }, {
        type: 'bar',
        label: 'Expenses',
        data: dataArr[0],
        fill: false,
        backgroundColor: colors.orange,
        borderColor: colors.orange,
        hoverBackgroundColor: colors.orange,
        hoverBorderColor: colors.orange,
      }],
    })
  }, [props.expenseData, props.budgetData, props.labels])


  return (
    (
      data ? (
        <Bar
          data={data}
          width={500}
          height={300}
        />
      ) : (
          <></>
        ))
  );
};
