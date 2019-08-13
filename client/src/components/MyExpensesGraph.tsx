import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import { element } from "prop-types";
import { ExpensesTable } from "./ExpensesTablesComponent";

export default function ExpensesGraph(props: any) {
  // Initialize state
  // Define graph configuration
  const [state, setState] = useState({
    dataDoughnut: {
      labels: ["Bills", "Food", "Emergency", "Entertainment", "Other"],
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
          
        }
      ]
    }
  });

  // This function is being called when a property is updated
  // Recall the function when a new expense is created
  useEffect(() => {
    createGraphData();
  }, [props.data])

  function createGraphData() {
    if (props.data.length == 0) return;
    // Create a copy of the dataset
    const dataSetsCopy = state.dataDoughnut.datasets;
    // Create a copy of the data property of dataset
    const dataCopy = dataSetsCopy[0].data.slice(0);
    // console.log(props.data);
    for (let expense of props.data) {
      // Check expense type and assign to the corresponding one
      // Assign each data field to the corresponding amount value
      switch (expense.expenseType.id) {
        case 1:
          dataCopy[0] += Math.round(expense.amount);
          break;
        case 2:
          dataCopy[1] += Math.round(expense.amount);
          break;
        case 3:
          dataCopy[2] += Math.round(expense.amount);
          break;
        case 4:
          dataCopy[3] += Math.round(expense.amount);
          break;
        case 5:
          dataCopy[4] += Math.round(expense.amount);
          break;
      }
    }
    dataSetsCopy[0].data = dataCopy;
    // Update state by deep copying
    setState({
      dataDoughnut: Object.assign({}, state.dataDoughnut, {
          datasets: dataSetsCopy
      })
    });
  }

  return (
    <MDBContainer>
      <Doughnut data={state.dataDoughnut} 
      // Define functions called according to the section of the graph that's being
      // clicked
      onElementsClick=
      {
        // Define a callback function per element
        (elems)=>{
          // Avoid exception if user clicks outside of the donut elements
          try{
            switch(elems[0]._index) {
              case 0:
                // Call a dialog function component to display info
                console.log("Mama mia 0");
                const type = props.types.find((type:any) => type.id == 1);
                props.props.history.push({
                  pathname: '/expenses/type',
                  state: { type:type,
                           userId:props.props.user.id,}
                });
                break;
              case 1:
                console.log("Mama mia 1");
                break;
              case 2:
                console.log("Mama mia 2");
                break; 
              case 3:
                console.log("Mama mia 3");
                break;
              case 4:
                console.log("Mama mia 4");
                break;       
            }
          } catch {
            // Don't know what to do
          }
        }
      } 
      options={{ responsive: true }} />
    </MDBContainer>
  );
}