import { Button, Checkbox, FormControlLabel, Paper, Snackbar } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { Col, Container, Row } from 'reactstrap';
import colors from '../assets/Colors';
import { IState, IUiState, IUserState } from '../redux';
import DonutGraph from './data/DonutGraph';
import { ExpensesTable } from './ExpensesTablesComponent';
import NewExpense from './NewExpenseDialog';
import MySnackbarContentWrapper from './SnackBarComponent';

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
  const [hasExpenses, setHasExpenses] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
  const [expenseType, setExpenseType] = useState();
  const [expensesByUserAndType, setExpensesByUserIdAndTypeId] = useState([]);
  const [snackBar, setSnackBar] = useState({
    openDelete: false,
    openUpdate: false,
    openCreate: false
  });

  useEffect(() => {
    setSnackBar({
      ...snackBar,
      openDelete: false,
      openUpdate: false,
      openCreate: false,
    })
    if (props.user.isLoggedIn) {
      getAllExpenses();
      getAllMonthlyExpenses();
      getAllExpenseTypes();
    }
  }, [props.user.isLoggedIn])

  useEffect(() => {
    // Avoid app crash in case user has no expenses in the database
    try {
      setTotalExpenses(expenses.map((num: any) => num.amount).reduce((a: any, b: any) => a + b));
    } catch { setExpenses(undefined); setHasExpenses(false); }
    try {

      setTotalMonthlyExpenses(monthlyExpenses.map((num: any) => num.amount).reduce((a: any, b: any) => a + b));
    } catch { setMonthlyExpenses(undefined); setHasExpenses(false) }
  }, [expenses, monthlyExpenses])

  // This function sends the request to get all user reimbursements
  async function getAllExpenses() {
    // Show loading bar at the moment this function is called
    setIsLoading(true);
    const url = `http://localhost:8080/expense/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        payload.data.length > 0 && setExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    if (expenses) setTotalExpenses(expenses.map((num: any) => num.amount).reduce((a: any, b: any) => a + b));
  }

  // This function sends the request to get all user reimbursements
  async function getAllMonthlyExpenses() {
    const url = `http://localhost:8080/expense/user/${props.user.id}/monthly`;
    await Axios.get(url)
      .then((payload: any) => {
        payload.data.length > 0 && setMonthlyExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });

    setIsLoading(false);
    if (monthlyExpenses) setTotalMonthlyExpenses(monthlyExpenses.map((num: any) => num.amount).reduce((a: any, b: any) => a + b))
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

  function handleCloseSnackBar() {
    setSnackBar({
      ...snackBar,
      openDelete: false,
      openUpdate: false,
      openCreate: false
    })
  }

  // Return all expenses
  function createGraphData() {
    return expenses.map((i: any) => {
      return { key: i.expenseType.type, data: i.amount }
    });
  }
  // Return monthly expenses
  function createMonthlyGraphData() {
    return monthlyExpenses.map((i: any) => {
      return { key: i.expenseType.type, data: i.amount }
    });
  }

  function createGraphLabels() {
    return expenseTypes.map((i: any) => {
      return i.type;
    });
  }
  // Function used to display the expenses in the table.
  function handleElementClick(label: string) {
    const type = expenseTypes.find((type: any) => type.type == label);
    if (type) {
      // Update expenses view in table perspective
      if (showMonthly) {
        const matchedExpenses = monthlyExpenses.filter((expense: any) =>
          JSON.stringify(expense.expenseType) == JSON.stringify(type));
        setExpensesByUserIdAndTypeId(matchedExpenses);
        setExpenseType(label);
        // Show the table if a piece of the donut is clicked
        setShowTable(true);
      } else { // Update expenses view in graph perspective
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
  function viewMonthlyExpenses(state: boolean) {
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
    setIsLoading(true);
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
      .then((payload) => {
        setSnackBar({
          ...snackBar,
          openDelete: false,
          openUpdate: false,
          openCreate: true,
        })
        if (!expenses) {
          getAllExpenses();
          getAllMonthlyExpenses();
        }
        // Check if the new expense fits in the monthly category or in the general category
        const currentMonth = new Date().getMonth();
        const newExpenseMonth = new Date(payload.data.date).getMonth();
        // Handle date conversion
        const newDateFormatted = new Date(payload.data.date).toISOString().slice(0, 10);
        payload.data.date = newDateFormatted;
        // Update arrays for properly visualize the new expense added
        // Only add to monthly expenses array if the assigned month is the current one
        if (newExpenseMonth == currentMonth) {
          setMonthlyExpenses((monthlyExpenses) ? monthlyExpenses.concat(payload.data) : [payload.data]);
        }
        setExpenses((expenses) ? expenses.concat(payload.data) : [payload.data]);
        // Update the table view too
        const withNewExpense = (expenses) ? expenses.concat(payload.data) : payload.data;
        if (showTable) {
          // If the new expense asigned month is not the current one, it wont be added to the table
          // in monthly perspective
          if (showMonthly && (newExpenseMonth == currentMonth)) {
            const withNewMonthlyExpense = (monthlyExpenses) ? monthlyExpenses.concat(payload.data) : payload.data;
            const matchedExpenses = withNewMonthlyExpense.filter((expense: any) =>
              expense.expenseType.type == payload.data.expenseType.type);
            setExpensesByUserIdAndTypeId(matchedExpenses);
          }
          const matchedExpenses = withNewExpense.filter((expense: any) =>
            expense.expenseType.type == payload.data.expenseType.type);
          setExpensesByUserIdAndTypeId(matchedExpenses);
        }
      });
    setIsLoading(false);
  }

  // Request function to delete an existing expense
  async function deleteExpense(expense: any) {
    setIsLoading(true);
    // Find the id of the removed expense
    function checkId(exp: any) {
      return exp.id === expense.id;
    }
    const url = `http://localhost:8080/expense/${expense.id}`;
    await Axios.delete(url, expense)
      .then(() => {
        setSnackBar({
          ...snackBar,
          openDelete: true,
          openUpdate: false,
          openCreate: false,
        })
        if (showTable) {
          // Also update if user is in monthly perspective
          if (showMonthly) {
            const temp = expenses.filter((e: any) => e.id !== expense.id)
            setMonthlyExpenses(temp.length > 0 ? temp : undefined);
            handleElementClick(expense.expenseType.type);
          }
          // Find the index of the to-be-removed expense
          // Remove it from the expenses array so it can be removed visually from the table
          const temp = expenses.filter((e: any) => e.id !== expense.id)
          setExpenses(temp.length > 0 ? temp : undefined);
          handleElementClick(expense.expenseType.type);
        }
        setIsLoading(false);
      }
      );
  }
  // Request function to update an expense
  async function updateExpense(expense: any) {
    setIsLoading(true);
    // Find the id of the updated expense
    function checkId(exp: any) {
      return exp.id === expense.id;
    }
    // Update the expenses and monthly expenses state in general (parent component)

    // Send the request
    const url = `http://localhost:8080/expense`;
    await Axios.put(url, expense)
      .then(async () => {
        setSnackBar({
          ...snackBar,
          openDelete: false,
          openUpdate: true,
          openCreate: false,
        })
        await getAllExpenses();
        await getAllMonthlyExpenses();
        // Also update the expenses in the table perspective
        if (showTable) {
          // Update monthly expenses too
          if (showMonthly) {
            // Check if the new expense fits in the monthly category or in the general category
            const currentMonth = new Date().getMonth();
            const updatedExpenseMonth = new Date(expense.date).getMonth();
            if (updatedExpenseMonth == currentMonth) {
              const updatedExpenseIndex = monthlyExpenses.findIndex(checkId);
              const monthlyExpensesCopy = monthlyExpenses;
              monthlyExpensesCopy[updatedExpenseIndex] = expense;
              const matchedExpenses = monthlyExpensesCopy.filter((expense: any) =>
                expense.expenseType.type == expenseType);
              setExpensesByUserIdAndTypeId(matchedExpenses);
            } else { // remove the expense from monthly expenses in case the assigned new month is not this one
              const updatedExpenseIndex = monthlyExpenses.findIndex(checkId);
              setMonthlyExpenses(monthlyExpenses.splice(updatedExpenseIndex, 1));
              const matchedExpenses = monthlyExpenses.filter((expense: any) =>
                expense.expenseType.type == expenseType);
              setExpensesByUserIdAndTypeId(matchedExpenses);
            }
          } else {
            const updatedExpenseIndex = expenses.findIndex(checkId);
            const expensesCopy = expenses;
            expensesCopy[updatedExpenseIndex] = expense;
            const matchedExpenses = expensesCopy.filter((expense: any) =>
              expense.expenseType.type == expenseType);
            setExpensesByUserIdAndTypeId(matchedExpenses);
          }
        }
        setIsLoading(false);
      });
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {!props.user.isLoggedIn ?
        (<>
          <div
            style={{
              marginTop: '50px', marginRight: 'auto', marginLeft: 'auto', textAlign: 'center',
              color: colors.offWhite, width: "60%"
            }}>
            <h2 style={{ marginBottom: '40px' }}>
              With <strong>Budgy</strong> you can schedule your expenses by
                  category, specifying amount and description. <br />
              That way you won´t forget them.
                  <br /><br />To get started,
                </h2>
            <Button style={{ border: `1px solid ${colors.offWhite}`, color: colors.offWhite }}
              variant='text' component={Link} to='/login'>
              Login
                  </Button>
            <b style={{ marginLeft: '10px', marginRight: '10px' }}>or</b>
            <Button component={Link} to='/register' style={{ backgroundColor: colors.orange }}>
              Register
                </Button>
          </div>
        </>)
        :
        (
          (!isLoading && !expenses && !hasExpenses) ?
            <>
              <div
                style={{
                  marginTop: '50px', marginRight: 'auto', marginLeft: 'auto', textAlign: 'center',
                  color: colors.teal, width: "60%", backgroundColor: colors.unusedGrey
                }}>
                <h2 style={{ marginBottom: '40px' }}>
                  Start setting up your expenses, {props.user.first}. <br /> <br /> <br />
                  What about a new one? <br />
                  <NewExpense
                    types={expenseTypes}
                    createExpense={createNewExpense}
                    view={props.ui.isMobileView} />
                </h2>
              </div>
            </>
            :
            <>
              {
                showTable ?
                  <h2 style={{ color: colors.offWhite }}>
                    {showMonthly ? "This month" : "Total"} {expenseType} expenses</h2> :
                  <h2 style={{ color: colors.offWhite }}>Your expenses</h2>
              }
              <Paper
                style={{
                  margin: '5px auto', padding: '10px',
                  backgroundColor: "rgba(220,245,230,0.9)",
                  width: props.ui.isMobileView ? "90%" : showTable ? '80%' : '50%',
                  height: props.ui.isMobileView ? "90%" : '60%'
                }}>
                {/* Show loader if expenses and monthly expenses aren't filled yet */}
                {(isLoading)
                  ?
                  (
                    <div
                      style={{
                        margin: props.ui.isMobileView ? '75px' : '150px',
                        display: 'inline-block'
                      }}>
                      <BarLoader width={150} color={'#009688'} loading={isLoading} />
                    </div>
                  )
                  :
                  <div>
                    {showTable
                      ?
                      (
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
                          {
                            isLoading
                              ?
                              <div
                                style={{
                                  margin: props.ui.isMobileView ? '75px' : '150px',
                                  display: 'inline-block'
                                }}>
                                <BarLoader width={150} color={'#009688'} loading={isLoading} />
                              </div>
                              :
                              <ExpensesTable expenses={expensesByUserAndType}
                                view={props.ui.isMobileView}
                                deleteExpense={deleteExpense}
                                updateExpense={updateExpense} />
                          }
                        </Fragment>
                      )
                      :
                      (
                        <Fragment>
                          {expenses &&
                            <div>
                              <h3>{showMonthly ? "This month" : "Overall"} expenses:
                        {isLoading ? "..." : showMonthly ? " $" + totalMonthlyExpenses : " $" + totalExpenses}</h3>
                              <i style={{ color: 'grey', fontSize: '14px' }}>
                                Click on any section of the graphic to view details.</i>
                              <DonutGraph
                                data={showMonthly ? createMonthlyGraphData() : createGraphData()}
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
                                    onChange={showMonthly ? () => viewMonthlyExpenses(false) :
                                      () => viewMonthlyExpenses(true)}
                                    value="checkedB"
                                    color="primary"
                                  />
                                }
                                style={{ marginLeft: '5px' }}
                                label="This month"
                              />
                            </div>}
                        </Fragment>
                      )
                    }
                  </div>
                }
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={snackBar.openDelete}
                  autoHideDuration={5000}
                  onClose={handleCloseSnackBar}
                >
                  <MySnackbarContentWrapper
                    variant="success"
                    message="Expense Deleted Successfully"
                  />
                </Snackbar>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={snackBar.openUpdate}
                  autoHideDuration={5000}
                  onClose={handleCloseSnackBar}
                >
                  <MySnackbarContentWrapper
                    variant="success"
                    message="Expense Updated Successfully"
                  />
                </Snackbar>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={snackBar.openCreate}
                  autoHideDuration={5000}
                  onClose={handleCloseSnackBar}
                >
                  <MySnackbarContentWrapper
                    variant="success"
                    message="Expense Created Successfully"
                  />
                </Snackbar>
              </Paper>
            </>
        )}
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
