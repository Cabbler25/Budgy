import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import { Container } from "reactstrap";
import { IExpenseProps } from "./Expenses.component";
import Axios from "axios";
import ReactApexCharts from 'react-apexcharts';
import { Stats } from "fs";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

export default function ExpensesGraph(props: any) {
  // Initialize state
  const [state, setState] = useState({
    options: {
      labels: ['Apple', 'Mango', 'Orange', 'Watermelon', 'Pizza']
    },
    // series: [0, 0, 0, 0,0],
    // Test data
    series: [44, 55, 41, 17, 15],
  })

  useEffect(() => {
    createGraphData();
  }, [props.data])

  function createGraphData() {
    if (props.data.length == 1) return;
    const data = state;
    for (let expense of props.data) {
      // Check expense type and assign to the corresponding one
      // Assign each data field to the corresponding amount value
      switch (expense.expenseType.id) {
        case 1:
          data.options.labels[0] = expense.expenseType.type;
          data.series[0] += Math.round(expense.amount);
          // state.options.plotOptions.pie.donut.labels.name=
          break;
        case 2:
          data.options.labels[1] = expense.expenseType.type;
          data.series[1] += Math.round(expense.amount);
          break;
        case 3:
          data.options.labels[2] = expense.expenseType.type;
          data.series[2] += Math.round(expense.amount);
          break;
        case 4:
          data.options.labels[3] = expense.expenseType.type;
          data.series[3] += Math.round(expense.amount);
          break;
        case 5:
          data.options.labels[4] = expense.expenseType.type;
          data.series[4] += Math.round(expense.amount);
          break;
      }
    }
<<<<<<< HEAD
      const getIntroOfPage = (label) => {
    if (label === 'Page A') {
      return "Page A is about men's clothing";
    } if (label === 'Page B') {
      return "Page B is about women's dress";
    } if (label === 'Page C') {
      return "Page C is about women's bag";
    } if (label === 'Page D') {
      return 'Page D is about household goods';
    } if (label === 'Page E') {
      return 'Page E is about food';
    } if (label === 'Page F') {
      return 'Page F is about baby food';
    }
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
          <p className="intro">{getIntroOfPage(label)}</p>
          <p className="desc">Anything you want can be displayed here.</p>
        </div>
      );
    }
  
    return null;
  };
    return (
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
            top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="pv" barSize={20} fill="#8884d8" />
        </BarChart>
    );
  }
  

  
//   export default class Example extends PureComponent {
//     static jsfiddleUrl = 'https://jsfiddle.net/alidingling/vxq4ep63/';
  
//   }  
=======

    setState({
      ...state,
      ...data
    })
  }

  return (
    <Container>
      <ReactApexCharts
        options={state.options}
        series={state.series}
        type="donut"
      />
    </Container>
  );
}


>>>>>>> fe91949524129611baeebf31e84e8d0fd902c729
