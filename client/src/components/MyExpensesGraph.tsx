import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import { Container } from "reactstrap";
import { IExpenseProps } from "./Expenses.component";
import Axios from "axios";
import ReactApexCharts from 'react-apexcharts';
import { Stats } from "fs";

export default function ExpensesGraph(props:IExpenseProps) {
    // Initialize state
    const state = {
        options: {
            dataLabels: {
                enabled: true
            },
            plotOptions: {
                pie: {
                    size:undefined,
                    offsetX: 0,
                    offsetY: 0,
                    customScale:1,
                    donut: {
                      background:'transparent',  
                      size: '65%',
                      labels :{
                          show:true,
                          name:{show: true,
                            fontSize: '22px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            color: undefined,
                            offsetY: -10},
                          value:{ show: true,
                            fontSize: '16px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            color: undefined,
                            offsetY: 16},
                            total: {
                                show: true,
                                label: 'Total',
                                color: 'black'
                            }
                      }
                    }
                  }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 250,
                    },
                    legend: {
                        show: false
                    }
                }
            }],
            legend: {
                position: 'right',
                offsetY: 1,
                height: 130,
            },
            labels: ['Apple', 'Mango', 'Orange', 'Watermelon','Pizza']
        },
        // series: [0, 0, 0, 0,0],
        // Test data
        series: [44, 55, 41, 17, 15],
        promiseResolved:false
      }
    const [expenses, setExpenses] = useState([{
        amount:0
    }]);
    
    useEffect(() => {
    getAllExpenses(props.user.id);
    }, [])
    
    // This function sends the request to get all user reimbursements
    async function getAllExpenses(userId: number) {
    const url = `http://localhost:8080/expense/user/${userId}`;
    await Axios.get(url)
        .then((payload: any) => {
        console.log(payload.data);
        setExpenses(payload.data);
        // Set the doughnut graph data info
        for (let expense of payload.data) {
            // Check expense type and assign to the corresponding one
            // Assign each data field to the corresponding amount value
            switch(expense.expenseType.id) {
                case 1: 
                    state.options.labels[0] = expense.expenseType.type;
                    state.series[0] += Math.round(expense.amount); 
                    // state.options.plotOptions.pie.donut.labels.name=
                    break;    
                case 2: 
                    state.options.labels[1] = expense.expenseType.type;
                    state.series[1] += Math.round(expense.amount); 
                    break;      
                case 3: 
                    state.options.labels[2] = expense.expenseType.type;
                    state.series[2] += Math.round(expense.amount); 
                    break;
                case 4: 
                    state.options.labels[3] = expense.expenseType.type;
                    state.series[3] += Math.round(expense.amount); 
                    break;
                case 5: 
                    state.options.labels[4] = expense.expenseType.type;
                    state.series[4] += Math.round(expense.amount); 
                    break;          
            }
        }
        // Allow display
        console.log(state.series);
        state.promiseResolved = true;
        }).catch((err: any) => {
        // Handle error by displaying something else
        });
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