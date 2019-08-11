import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import { Container } from "reactstrap";
import { IExpenseProps } from "./Expenses.component";
import Axios from "axios";

export default function ExpensesGraph(props:IExpenseProps) {
    // Initialize state
    const state = {
        dataDoughnut: {
            labels: ["Bills", "Food", "Emergency", "For fun", "Other"],
            datasets: [
                {
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                    hoverBackgroundColor: [
                    "#FF5A5E",
                    "#5AD3D1",
                    "#FFC870",
                    "#A8B3C5",
                    "#616774"
                    ],
                    // Define onClick functions for each of the doughnut sections
                }
            ],
            promiseResolved:false
        }
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
                    console.log(expense.expenseType.id);
                    state.dataDoughnut.datasets[0].data[0] += Math.round(expense.amount);     
                    break;    
                case 2: 
                    state.dataDoughnut.datasets[0].data[1] += Math.round(expense.amount);   
                    break;      
                case 3: 
                    state.dataDoughnut.datasets[0].data[2] += Math.round(expense.amount); 
                    break;
                case 4: 
                    state.dataDoughnut.datasets[0].data[3] += Math.round(expense.amount); 
                    break;
                case 5: 
                    state.dataDoughnut.datasets[0].data[4] += Math.round(expense.amount);  
                    
                    break;          
            }
        }
        // Allow display
        console.log(state.dataDoughnut.datasets[0].data);
        state.dataDoughnut.promiseResolved = true;
        }).catch((err: any) => {
        // Handle error by displaying something else
        });
    }
      
    return (
        <div>
            <Container>
            <Doughnut data={state.dataDoughnut} options={{ responsive: true }}  />
            </Container>
        </div>
    );
  }