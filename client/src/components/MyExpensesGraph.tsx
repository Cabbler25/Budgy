import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import { Container } from "reactstrap";
import { IExpenseProps } from "./Expenses.component";
import Axios from "axios";
import ReactApexCharts from 'react-apexcharts';
import { Stats } from "fs";

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


