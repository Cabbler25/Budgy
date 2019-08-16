import { Button, Paper } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { IState, IUiState, IUserState } from '../redux';
import DonutGraph from './data/DonutGraph';
import { ExpensesTable } from './ExpensesTablesComponent';
import NewExpense from './NewExpenseDialog';
import { donutPath, donutTool } from '../assets/Icons';

export interface IExpenseProps {
  user: IUserState;
  ui: IUiState;
  type: number;
  date: string;
  description: string;
  amount: number;
  history: any;
}

function Expenses(props: IExpenseProps) {
  const [expenses, setExpenses] = useState();
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [expenseType,setExpenseType] = useState();
  const [expensesByUserAndType, setExpensesByUserIdAndTypeId] = useState([]);

  useEffect(() => {
    getAllExpenses();
    getAllExpenseTypes();
  }, [])

  // This function sends the request to get all user reimbursements
  async function getAllExpenses() {
    const url = `http://localhost:8080/expense/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        setExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  async function getAllExpenseTypes() {
    const url = `http://localhost:8080/expense/types`;
    await Axios.get(url)
      .then((payload: any) => {
        setExpenseTypes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  function createGraphData() {
    return expenses.map((i: any) => {
      return { key: i.expenseType.type, data: i.amount }
    });
  }

  function createGraphLabels() {
    return expenseTypes.map((i: any) => {
      return i.type;
    });
  }
  // Function used to display the expenses in the table.
  async function handleElementClick(label: string) {
    const type = expenseTypes.find((type: any) => type.type == label);
    if (type) {
      const matchedExpenses = expenses.filter((expense: any) =>
        JSON.stringify(expense.expenseType) == JSON.stringify(type))
      setExpensesByUserIdAndTypeId(matchedExpenses);
      setExpenseType(label);
      // Show the table if a piece of the donut is clicked
      setShowTable(true);
    }
  }

  //   Request function for new expense here
  async function createNewExpense(newType: any, newDescripion: string, newAmount: number) {
    // Prepare request setup
    const url = 'http://localhost:8080/expense';
    const data = {
      userId: props.user.id,
      expenseType: newType,
      date: new Date().toISOString().slice(0, 10),
      description: newDescripion,
      amount: newAmount
    };
    Axios.post(url, data)
      .then(() => {
        const newExpense = {
          id: Math.max.apply(Math, expenses.map(function (exp: any) { return exp.id; })) + 1,
          ...data
        };
        getAllExpenses();
        if (showTable) {
          setExpenses(expenses.push(newExpense));
          handleElementClick(newExpense.expenseType.type);
        }
      });
  }
  // Request function to delete an existing expense
  async function deleteExpense(expense:any) {
    // Find the id of the removed expense
    function checkId(exp:any) {
      return exp.id === expense.id;
    }
    const url = `http://localhost:8080/expense/${expense.id}`;
    Axios.delete(url,expense)
      .then(() => {
        getAllExpenses();
        if (showTable) {
          // Find the index of the to-be-removed expense
          const deletedExpenseIndex = expenses.findIndex(checkId);
          // Remove it from the expenses array so it can be removed visually from the table
          setExpenses(expenses.splice(deletedExpenseIndex,1));
          handleElementClick(expense.expenseType.type);
        }
      }
    )
  }
  // Request function to update an expense
  async function updateExpense(expense:any) {
    // Find the id of the updated expense
    function checkId(exp:any) {
      return exp.id === expense.id;
    }
    // Send the request
    const url = `http://localhost:8080/expense`;
    Axios.put(url,expense)
    .then(() => {
      getAllExpenses();
      if (showTable) {
        console.log(expense);
        // Modify the expenses that are going to be shown in the table
        const updatedExpenseIndex = expenses.findIndex(checkId);
        expenses[updatedExpenseIndex] = expense;
        setExpenses(expenses);
      }
    })
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Show expenses in the table */}
      {/*<Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Paper>
          <h3>Total Expenses</h3>
          <p>$100,000 <br/> Monthly $100 <br/><br/><br/><br/></p>
        </Paper>
          </Grid>*/}
        <Paper 
        style={{ margin: '5px auto',padding: '10px',
                 backgroundColor:"rgba(220,245,230,0.9)",
                 width:props.ui.isMobileView ? "90%" : showTable ? '80%':'50%',
                 height:props.ui.isMobileView ? "90%" : '60%' }}
                 >
            <div>
              {showTable ? 
              <h2>Your {expenseType} expenses, {props.user.first}</h2> :
              <h2>Check your expenses, {props.user.first}</h2>
              }
          {/* Logic: 
                if an expense type is selected in the donut graph, then the table
                is displayed */}
              {showTable ? (
                <Fragment> 
                  <Container>
                    <Row>
                      <Col>
                        <Button
                          color="secondary"
                          onClick={() => setShowTable(false)}
                          style={{display:"inline-block",margin:'5px'}}>
                          <svg xmlns={donutTool}  width="24" height="24" viewBox="0 0 24 24">
                          <path d={donutPath}/>
                          </svg>
                        </Button> 
                        <NewExpense
                        types={expenseTypes}
                        createExpense={createNewExpense}
                        view ={props.ui.isMobileView} />
                      </Col>
                    </Row>
                  </Container>
                  <ExpensesTable expenses={expensesByUserAndType}
                                 view = {props.ui.isMobileView}
                                 deleteExpense = {deleteExpense} 
                                 updateExpense = {updateExpense}/>
                </Fragment>
              ) : (
                  <Fragment>
                    {expenses && 
                    <div>
                      <DonutGraph 
                      data={createGraphData()} 
                      labels={createGraphLabels()}
                      important='Emergency'
                      isMobileView={props.ui.isMobileView}
                      handleElementClick={handleElementClick} />
                    <NewExpense
                      types={expenseTypes}
                      createExpense={createNewExpense}
                      view={props.ui.isMobileView} />
                  </div>}
              </Fragment>
            )}
          <br />
        </div>
      </Paper>
    </div >
  );
}

// Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

export default connect(mapStateToProps)(Expenses);