import { Button, createStyles, makeStyles, Paper, Theme } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { Col, Container, Row } from 'reactstrap';
import colors from '../assets/Colors';
import { donutPath, donutTool } from '../assets/Icons';
import { IState, IUiState, IUserState } from '../redux';
import DonutGraph from './data/DonutGraph';
import { ExpensesTable } from './ExpensesTablesComponent';
import NewExpense from './NewExpenseDialog';

/*
TODO:
- If user is not logged in, show a card with a message that explains about the component, and
  a button that show him the login dialog and after that he will be able to proceed to the
  expenses component (using props.user.isLoggedIn).
- Add feedback in case user has no expenses yet
- Try getting the budgets per type, and check if the expenses per type exceed the budget
  per type, so a proper warning can be set
- Get monthly expenses -> instead of dateSubmitted, just pick the date the expense should occur
- Add request for monthly expense
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
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [expenseType, setExpenseType] = useState();
  const [expensesByUserAndType, setExpensesByUserIdAndTypeId] = useState([]);

  useEffect(() => {
    if (props.user.isLoggedIn) {
      getAllExpenses();
      getAllExpenseTypes();
    }
  }, [props.user.isLoggedIn])

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
  // This function sends the request to get all user reimbursements
  async function getAllMonthlyExpenses() {
    const url = `http://localhost:8080/expense/user/${props.user.id}/monthly`;
    await Axios.get(url)
      .then((payload: any) => {
        setExpenses(payload.data);
        // If function is called, update the table view for only monthly expenses
        if (showTable) {
          handleElementClick(expenseType);
        }
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
  async function deleteExpense(expense: any) {
    // Find the id of the removed expense
    function checkId(exp: any) {
      return exp.id === expense.id;
    }
    const url = `http://localhost:8080/expense/${expense.id}`;
    Axios.delete(url, expense)
      .then(() => {
        getAllExpenses();
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
        console.log(expenses);
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
      {!props.user.isLoggedIn && <Redirect to="/login" />}

      {/* Show expenses in the table */}
      {/*<Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Paper>
          <h3>Total Expenses</h3>
          <p>$100,000 <br/> Monthly $100 <br/><br/><br/><br/></p>
        </Paper>
          </Grid>*/}
      {
        showTable ?
          <h2>Your {expenseType} expenses, {props.user.first}</h2> :
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
        {!expenses ? (
          <div
            style={{
              margin: props.ui.isMobileView ? '75px' : '150px',
              display: 'inline-block'
            }}>
            <BarLoader width={150} color={'#009688'} loading={expenses} />
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
