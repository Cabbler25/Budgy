import { Button, createStyles, makeStyles, Paper, Theme, FormControlLabel, Checkbox } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { Col, Container, Row } from 'reactstrap';
import colors from '../assets/Colors';
import { IState, IUiState, IUserState } from '../redux';
import DonutGraph from './data/DonutGraph';
import { ExpensesTable } from './ExpensesTablesComponent';
import NewExpense from './NewExpenseDialog';

/*
TODO:
- If user is not logged in, show a card with a message that explains about the component, and
  a button that show him the login dialog and after that he will be able to proceed to the
  expenses component (using props.user.isLoggedIn). If is logged in, show the same card, except
  that the button will be start and will show him the graph and so on...
- Add feedback in case user has no expenses in the database
- Get monthly expenses -> instead of dateSubmitted, just pick the date the expense should occur
- Add request for monthly expense
- Define the condition setup that will manage if the expenses shown in the graph or the table 
  are the monthly ones or all in general
- For the update and delete process also reflect the changes in monthly view
*/

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
  // Needed constants with their respective state modifier function
  const [expenses, setExpenses] = useState();
  const [monthlyExpenses, setMonthlyExpenses] = useState();
  const [isLoading,setIsLoading] = useState(true);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [expenseType, setExpenseType] = useState();
  const [expensesByUserAndType, setExpensesByUserIdAndTypeId] = useState([]);

  useEffect(() => {
    if (props.user.isLoggedIn) {
      getAllExpenses();
      getAllMonthlyExpenses();
      getAllExpenseTypes();
    }
  }, [props.user.isLoggedIn])

  // This function sends the request to get all user reimbursements
  async function getAllExpenses() {
    // Show loading bar at the moment this function is called
    setIsLoading(true);
    const url = `http://localhost:8080/expense/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        setExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  // This function sends the request to get all user reimbursements
  async function getAllMonthlyExpenses() {
    const url = `http://localhost:8080/expense/user/${props.user.id}/monthly`;
    await Axios.get(url)
      .then((payload: any) => {
        setMonthlyExpenses(payload.data);
        // If function is called, update the table view for only monthly expenses
        if (showTable) {
          handleElementClick(expenseType);
        }
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
      setIsLoading(false);
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
  // Return all expenses
  function createGraphData() {
    return expenses.map((i: any) => {
      return { key: i.expenseType.type, data: i.amount }
    });
  }
  // Return monthly expenses
  function createMonthlyGraphData() {
    return monthlyExpenses.map((i:any) =>{
      return {key: i.expenseType.type,data: i.amount}
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
      if (showMonthly) {
        const matchedExpenses = monthlyExpenses.filter((expense: any) =>
          JSON.stringify(expense.expenseType) == JSON.stringify(type));
        setExpensesByUserIdAndTypeId(matchedExpenses);
        setExpenseType(label);
        // Show the table if a piece of the donut is clicked
        setShowTable(true);
      } else {
        const matchedExpenses = expenses.filter((expense: any) =>
          JSON.stringify(expense.expenseType) == JSON.stringify(type));
        setExpensesByUserIdAndTypeId(matchedExpenses);
        setExpenseType(label);
        // Show the table if a piece of the donut is clicked
        setShowTable(true);
      }
    }
  }
  // Handle view for only show monthly expenses
  function viewMonthlyExpenses(state:boolean) {
    // Show only monthly expenses in the donut graph
    setShowMonthly(state);
    // Show only monthly expenses in the tables
    if (showTable) {
      handleElementClick(expenseType);
    }
  }

  //   Request function for new expense here
  async function createNewExpense(newType: any, newDescripion: string, newAmount: number,
                                  newDate: string) {
    // Prepare request setup
    const url = 'http://localhost:8080/expense';
    const data = {
      userId: props.user.id,
      expenseType: newType,
      date: newDate,
      description: newDescripion,
      amount: newAmount
    };
    // console.log("this is the new expense before posting it:", data);
    await Axios.post(url, data)
      .then(() => {
        const newExpense = {
          id: Math.max.apply(Math, expenses.map(function (exp: any) { return exp.id; })) + 1,
          ...data
        };
        getAllExpenses();
        getAllMonthlyExpenses();
        if (showTable) {
          setExpenses(expenses.push(newExpense));
          handleElementClick(newExpense.expenseType.type);
        }
      });
  }
  // Request function to delete an existing expense
  async function deleteExpense(expense: any) {
    // Find the id of the removed expense
    function checkId(exp: any) {
      return exp.id === expense.id;
    }
    const url = `http://localhost:8080/expense/${expense.id}`;
    Axios.delete(url, expense)
      .then(() => {
        getAllExpenses();
        getAllMonthlyExpenses();
        if (showTable) {
          // Find the index of the to-be-removed expense
          const deletedExpenseIndex = expenses.findIndex(checkId);
          // Remove it from the expenses array so it can be removed visually from the table
          setExpenses(expenses.splice(deletedExpenseIndex, 1));
          handleElementClick(expense.expenseType.type);
        }
      }
      )
  }
  // Request function to update an expense
  async function updateExpense(expense: any) {
    // Find the id of the updated expense
    function checkId(exp: any) {
      return exp.id === expense.id;
    }
    // Update the expenses state in general (parent component)
    const updatedExpenseIndex = expenses.findIndex(checkId);
    expenses[updatedExpenseIndex] = expense;
    setExpenses(expenses);
    // Send the request
    const url = `http://localhost:8080/expense`;
    Axios.put(url,expense)
    .then(() => {
      getAllExpenses();
      if (showTable) {
        // console.log(expenses);
        // Also update the expenses in the table perspective
        const matchedExpenses = expenses.filter((expense: any) =>
        expense.expenseType.type == expenseType);
        setExpensesByUserIdAndTypeId(matchedExpenses);
      }
    })
  }
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      progress: {
        margin: theme.spacing(2),
      },
    }),
  );
  const classes = useStyles();
  return (
    <div style={{ textAlign: 'center' }}>
      {!props.user.isLoggedIn && 
      // Instead of redirecting to login, show card as indicated in TODO at the top
      <Redirect to="/login" />}
      {
        showTable ?
          <h2 style={{ color: colors.offWhite }}>Your {expenseType} expenses, {props.user.first}</h2> :
          <h2 style={{ color: colors.offWhite }}>Check your expenses, {props.user.first}</h2>
      }
      <Paper
        style={{
          margin: '5px auto', padding: '10px',
          backgroundColor: "rgba(220,245,230,0.9)",
          width: props.ui.isMobileView ? "90%" : showTable ? '80%' : '50%',
          height: props.ui.isMobileView ? "90%" : '60%'
        }}
      >
        {/* Show loader if expenses and monthly expenses aren't filled yet */}
        {(!(expenses && monthlyExpenses)) ? (
          <div
            style={{
              margin: props.ui.isMobileView ? '75px' : '150px',
              display: 'inline-block'
            }}>
            <BarLoader width={150} color={'#009688'} loading={isLoading} />
          </div>
        ) :
          <div>
            {showTable ? (
              <Fragment>
                <Container>
                  <Row>
                    <Col>
                      <Button
                        color="secondary"
                        onClick={() => setShowTable(false)}
                        style={{ display: "inline-block", margin: '5px' }}>
                        Back
                      </Button>
                      {/* If on table perspective, don't show the type selector */}
                      <NewExpense
                        types={expenseTypes}
                        createExpense={createNewExpense}
                        view={props.ui.isMobileView}
                        tableView={showTable}
                        type={expenseType} />
                    </Col>
                    <Col>
                      <FormControlLabel
                          control={
                            <Checkbox
                              checked={showMonthly}
                              onChange={showMonthly?()=>viewMonthlyExpenses(false) :
                                                    ()=>viewMonthlyExpenses(true)}
                              value="checkedB"
                              color="primary"
                            />
                          }
                          style={{marginLeft:'5px'}}
                          label="This month"
                      /> 
                    </Col>
                  </Row>
                </Container>
                <ExpensesTable expenses={expensesByUserAndType}
                  view={props.ui.isMobileView}
                  deleteExpense={deleteExpense}
                  updateExpense={updateExpense} />
              </Fragment>
            ) : (
                <Fragment>
                  {expenses &&
                    <div>
                      <DonutGraph
                        data={showMonthly?createMonthlyGraphData():createGraphData()}
                        labels={createGraphLabels()}
                        important='Emergency'
                        isMobileView={props.ui.isMobileView}
                        handleElementClick={handleElementClick} />
                      <NewExpense
                        types={expenseTypes}
                        createExpense={createNewExpense}
                        view={props.ui.isMobileView} />
                        {/* Toggles between view monthly expenses and overall expenses */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={showMonthly}
                            onChange={showMonthly?()=>viewMonthlyExpenses(false) :
                                                  ()=>viewMonthlyExpenses(true)}
                            value="checkedB"
                            color="primary"
                          />
                        }
                        style={{marginLeft:'5px'}}
                        label="This month"
                      />  
                    </div>}
                </Fragment>
              )}
            <br />
          </div>
        }
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
