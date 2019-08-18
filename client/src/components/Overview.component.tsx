import { createStyles, Grid, makeStyles, Paper, Theme, Table, TableHead, TableCell, TableBody, TableRow, withStyles, Button } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BarLoader } from 'react-spinners';
import colors from '../assets/Colors';
import { IState, IUiState, IUserState } from '../redux';
import MixedLineGraph from './data/MixedLineGraph';
import { Link } from 'react-router-dom';
import MixedBarGraph from './data/MixedBarGraph';

interface IHomeProps {
  user: IUserState;
  ui: IUiState;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  div_container: {
    opacity: 0.85,
    padding: '40px 100px 20px 100px',
    // borderBottom: `2px solid ${colors.darkGreen}`
  },
  div_container_mobile: {
    width: '95%',
    opacity: 0.85,
    paddingTop: '5px',
    paddingBottom: '20px',
  },
  grid_container: {
    margin: 0,
    width: '100%',
    color: colors.offWhite
  },
  table: {
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: colors.offWhite
  }
}));

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: colors.teal,
      color: colors.offWhite,
      opacity: 0.85
    },
    body: {
      color: colors.offWhite,
      fontSize: 14,
    },
  }),
)(TableCell);

function Overview(props: IHomeProps) {
  const classes = useStyles();
  const [incomes, setIncomes] = useState();
  const [budgets, setBudgets] = useState();
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState();
  const [types, setTypes] = useState([]);

  const [underBudgets, setUnderBudgets] = useState();
  const [overBudgets, setOverBudgets] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [totals, setTotals] = useState({
    monthlyExpense: 0,
    income: 0,
    budget: 0
  })

  useEffect(() => {
    if (props.user.isLoggedIn) {
      setIsLoading(true);
      getAllTypes();
      fetchAllData();
    }
    // Load budgets, incomes, expenses

  }, [props.user.isLoggedIn])

  useEffect(() => {

    let budgetTotal = 0;
    if (budgets) {
      budgetTotal = budgets.map((i: any) => i.amount).reduce((a: any, b: any) => a + b);
    }

    let expensesTotal = 0;
    if (currentMonthExpenses) {
      expensesTotal = currentMonthExpenses.map((i: any) => i.amount).reduce((a: any, b: any) => a + b);
    }

    let incomeTotal = 0;
    if (incomes) {
      incomeTotal = incomes.map((i: any) => i.amount).reduce((a: any, b: any) => a + b);
    }

    calcOverages();
    setTotals({
      ...totals,
      monthlyExpense: expensesTotal,
      income: incomeTotal,
      budget: budgetTotal
    })
  }, [currentMonthExpenses, budgets, incomes])

  async function getAllTypes() {
    const url = `http://localhost:8080/budget/types`;
    Axios.get(url)
      .then((payload: any) => {
        payload.data.length > 0 && setTypes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  async function fetchAllData() {
    let url = `http://localhost:8080/expense/user/${props.user.id}/monthly`;
    await Axios.get(url)
      .then((payload: any) => {
        payload.data.length > 0 && setCurrentMonthExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    url = `http://localhost:8080/income/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        // console.log(payload.data);
        payload.data.length > 0 && setIncomes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    url = `http://localhost:8080/budget/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        if (payload.data.length != 0) {
          setBudgets(payload.data);
        }
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    setIsLoading(false);
    calcOverages();
  }

  function calcOverages() {
    // Budget v expense overages
    const dataArr = new Array(2);
    const labels = createGraphLabels();
    const ex = createExpenseGraphData();
    const bg = createBudgetGraphData();
    if (labels && ex) {
      let arr = Array.from(labels, () => 0);
      if (ex) {
        ex.forEach((e: any) => {
          arr[labels.indexOf(e.key)] += e.data;
        });
      }
      dataArr[0] = arr;

      arr = Array.from(labels, () => 0);
      if (bg) {
        bg.forEach((e: any) => {
          arr[labels.indexOf(e.key)] += e.data;
        });
      }
      dataArr[1] = arr;

      const overs = new Array();
      const unders = new Array();
      for (let i = 0; i < dataArr[0].length; i++) {
        if (Number(dataArr[1][i]) < Number(dataArr[0][i])) {
          overs.push({
            category: labels[i],
            difference: dataArr[0][i] - dataArr[1][i]
          });
        } else {
          if (Number(dataArr[1][i]) === 0 && Number(dataArr[0][i]) === 0) continue;
          unders.push({
            category: labels[i],
            difference: dataArr[1][i] - dataArr[0][i]
          })
        }
      }
      setOverBudgets(overs.length > 0 ? overs : undefined);
      setUnderBudgets(unders.length > 0 ? unders : undefined);
    }
  }

  function createBudgetGraphData() {
    if (!budgets) return undefined;
    return budgets.map((i: any) => {
      return { key: i.budgetType.type, data: i.amount }
    });
  }

  function createExpenseGraphData() {
    if (!currentMonthExpenses) return undefined;
    return currentMonthExpenses.map((i: any) => {
      return { key: i.expenseType.type, data: i.amount }
    });
  }

  function createGraphLabels() {
    if (!types) return undefined;
    return types.map((i: any) => {
      return i.type;
    });
  }

  return (
    // Rows of data
    // Conditional description: if all under, good job, if over, look into it
    // Budget vs expenses: show remaining/over budget amount
    // Bar graph budget totals vs income totals
    (props.user.isLoggedIn ? (
      (isLoading ? (
        <div style={{ margin: 'auto', height: '100vh', textAlign: 'center' }}>
          <div style={{ marginTop: '40vh', display: 'inline-block' }}>
            <BarLoader width={250} color={colors.offWhite} loading={isLoading} />
          </div>
        </div>
      ) : (
          <div style={{ textAlign: 'center' }}>
            <div className={props.ui.isMobileView ? classes.div_container_mobile : classes.div_container} >
              <Grid className={classes.grid_container} container>
                <Grid
                  style={{
                    minWidth: props.ui.isMobileView ? '100vw' : undefined,
                    width: props.ui.isMobileView ? '100vw' : undefined
                  }}
                  item xs={props.ui.isMobileView ? 12 : 6}>
                  <b>Your Monthly Spending</b>
                  <Paper
                    style={{
                      marginTop: '10px',
                      maxWidth: '95%',
                      width: '95%',
                      opacity: 0.85,
                      display: 'inline-block'
                    }}>
                    <div style={{ display: 'inline-block', textAlign: 'center' }}>
                      <i style={{ color: 'grey', fontSize: '14px' }}>Red bars indicate an over-budget category.</i> <br />
                    </div>
                    <MixedLineGraph isMobileView={props.ui.isMobileView} budgetData={createBudgetGraphData()}
                      expenseData={createExpenseGraphData()} labels={createGraphLabels()} />
                  </Paper>
                </Grid>
                <Grid
                  style={{
                    minWidth: props.ui.isMobileView ? '100vw' : undefined,
                    width: props.ui.isMobileView ? '100vw' : undefined,
                    textAlign: 'center'
                  }}
                  item xs={props.ui.isMobileView ? 12 : 6}>
                  <h2 style={{ marginTop: props.ui.isMobileView ? undefined : '0px' }}>Here's how you're stacking up.</h2>
                  {underBudgets && (
                    <>
                      <h3>You met your goals in these categories.<br /> Nice job!</h3>
                      <div style={{ width: '100%' }}>
                        <Table className={classes.table}
                          size={props.ui.isMobileView ? 'small' : 'medium'}>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Category</StyledTableCell>
                              <StyledTableCell align="right">Remaining Budget ($)</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {underBudgets.map((item: any, i: number) => (
                              <TableRow key={i}>
                                <StyledTableCell>
                                  {item.category}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {item.difference}
                                </StyledTableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                  {overBudgets && (
                    <>
                      <h3>Some of your spending needs <span style={{ color: colors.orange }}>attention</span>.</h3>
                      {`Go to your  `}
                      <Button size={props.ui.isMobileView ? 'small' : undefined}
                        style={{ marginBottom: '5px', width: '10px', maxWidth: '10px', fontSize: '10px', color: colors.offWhite, borderColor: colors.offWhite }}
                        variant='outlined'
                        component={Link} to='/expenses'>
                        Expenses
                      </Button>
                      {`  for a detailed view.`}
                      <div style={{ width: '100%' }}>
                        <Table className={classes.table}
                          size={props.ui.isMobileView ? 'small' : 'medium'}>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Category</StyledTableCell>
                              <StyledTableCell align="right">Over Budget ($)</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {overBudgets.map((item: any, i: number) => (
                              <TableRow key={i}>
                                <StyledTableCell>
                                  {item.category}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {item.difference}
                                </StyledTableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </Grid>
              </Grid>
              <Grid container className={classes.grid_container}
                style={{ marginTop: props.ui.isMobileView ? '30px' : '50px' }}
                direction={props.ui.isMobileView ? 'column-reverse' : 'row'}>
                <Grid
                  style={{
                    minWidth: props.ui.isMobileView ? '100vw' : undefined,
                    width: props.ui.isMobileView ? '100vw' : undefined,
                    marginTop: props.ui.isMobileView ? '10px' : undefined
                  }}
                  item xs={props.ui.isMobileView ? 12 : 6}>
                  {totals.income >= totals.budget && totals.monthlyExpense <= totals.budget ? (
                    <>
                      <h2>The math adds up.</h2>
                      <h3>You did a good job of choosing a practical budget that fits your income and keeps expenses low.</h3>
                    </>
                  ) : (
                      <></>
                    )}
                  <div style={{ width: '100%' }}>
                    <Table className={classes.table}
                      size={props.ui.isMobileView ? 'small' : 'medium'}>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Type</StyledTableCell>
                          <StyledTableCell align="right">Total ($)</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow key={0}>
                          <StyledTableCell>
                            Income
                                </StyledTableCell>
                          <StyledTableCell align="right">
                            {totals.income}
                          </StyledTableCell>
                        </TableRow>
                        <TableRow key={1}>
                          <StyledTableCell>
                            Expense
                                </StyledTableCell>
                          <StyledTableCell align="right">
                            {totals.monthlyExpense}
                          </StyledTableCell>
                        </TableRow>
                        <TableRow key={2}>
                          <StyledTableCell>
                            Budget
                                </StyledTableCell>
                          <StyledTableCell align="right">
                            {totals.budget}
                          </StyledTableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Grid>
                <Grid
                  style={{
                    minWidth: props.ui.isMobileView ? '100vw' : undefined,
                    width: props.ui.isMobileView ? '100vw' : undefined,
                    marginTop: props.ui.isMobileView ? '10px' : undefined
                  }}
                  item xs={props.ui.isMobileView ? 12 : 6}>
                  <b>Your Monthly Totals</b>
                  <Paper
                    style={{
                      marginTop: '10px',
                      maxWidth: '95%',
                      width: '95%',
                      opacity: 0.85,
                      display: 'inline-block'
                    }}>
                    <MixedBarGraph isMobileView={props.ui.isMobileView} budgets={budgets}
                      expenses={currentMonthExpenses} incomes={incomes} labels={createGraphLabels()} />
                  </Paper>
                </Grid>
              </Grid>
            </div >
          </div >
        ))
    ) : (
        <>Log in bud</>
      )
    )
  )
}

// Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

export default connect(mapStateToProps)(Overview);
