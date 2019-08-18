import { createStyles, Grid, makeStyles, Paper, Theme } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BarLoader } from 'react-spinners';
import colors from '../assets/Colors';
import { IState, IUiState, IUserState } from '../redux';
import MixedLineGraph from './data/MixedLineGraph';
import LineGraph from './data/LineGraph';

interface IHomeProps {
  user: IUserState;
  ui: IUiState;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  div_row: {
    opacity: 0.85,
    padding: '40px 100px 20px 100px',
    marginBottom: '20px'
    // borderBottom: `2px solid ${colors.darkGreen}`
  },
  div_row_mobile: {
    width: '95%',
    opacity: 0.85,
    paddingTop: '5px',
    paddingBottom: '20px',
    marginBottom: '20px'
  },
  grid_container: {
    margin: 0,
    width: '100%',
    overflowX: 'hidden',
    // backgroundColor: 'blue',
    color: colors.offWhite
  }
}));

function Home(props: IHomeProps) {
  const classes = useStyles();
  const [incomes, setIncomes] = useState();
  const [budgets, setBudgets] = useState();
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState();
  const [expMonths, setExpMonths] = useState(0);
  const [types, setTypes] = useState([]);

  const [expenseOverages, setExpenseOverages] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [totals, setTotals] = useState({
    monthlyExpense: 0,
    income: 0,
    budget: 0
  })

  const [monthlyExpenses, setMonthlyExpenses] = useState();
  const [months, setMonths] = useState();

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
    let url = `http://localhost:8080/expense/user/${props.user.id}`;
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
    url = `http://localhost:8080/expense/user/${props.user.id}/yearly`;
    await Axios.get(url)
      .then((payload: any) => {
        let arrMonth: string[] = [];
        let arrTot: number[] = [];
        if (payload.data.length != 0) {
            for(let i =0; i < payload.data.length; i++)
            {
              console.log(payload.data[i].month)
              arrMonth.push(payload.data[i].month);
              arrTot.push(payload.data[i].total);
            }
            //arrTot.reverse();
            //arrMonth.reverse();
            setMonthlyExpenses(arrTot);
            setMonths(arrMonth);
            setExpMonths(payload.data.length);
            
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

      const overBudgets = new Array();
      for (let i = 0; i < dataArr[0].length; i++) {
        if (Number(dataArr[1][i]) < Number(dataArr[0][i])) {
          overBudgets.push({
            category: labels[i],
            difference: dataArr[0][i] - dataArr[1][i]
          });
        }
      }
      setExpenseOverages(overBudgets);
    }
  }


  function createBudgetGraphData() {
    if (!budgets) return;
    return budgets.map((i: any) => {
      return { key: i.budgetType.type, data: i.amount }
    });
  }

  function createExpenseGraphData() {
    if (!currentMonthExpenses) return;
    return currentMonthExpenses.map((i: any) => {
      return { key: i.expenseType.type, data: i.amount }
    });
  }

  function createGraphLabels() {
    if (!types) return;
    return types.map((i: any) => {
      return i.type;
    });
  }

  function createLineStaticIncome(){
    let arrIncomes: number[] = [];
    for(let i =0; i < expMonths; i++){
      arrIncomes.push(totals.income);
  }
  return arrIncomes;
}
  function createLineStaticBudget(){
    let arrBudget: number[] = [];
    for(let i =0; i < expMonths; i++){
      arrBudget.push(totals.budget);
  }
  return arrBudget;
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
            <div className={props.ui.isMobileView ? classes.div_row_mobile : classes.div_row} >
              <Grid className={classes.grid_container} container>
                <Grid item xs={props.ui.isMobileView ? 12 : 6}>
                  <p>Your spending</p>
                  <Paper style={{ opacity: 0.85, display: 'inline-block' }}>
                    <MixedLineGraph budgetData={createBudgetGraphData()}
                      expenseData={createExpenseGraphData()} labels={createGraphLabels()} />
                  </Paper>
                </Grid>
                <Grid item xs={props.ui.isMobileView ? 12 : 6}>
                  <h2 style={{ textAlign: 'center' }}>Here's how you're stacking up.</h2>
                  {expenseOverages ? (
                    <div style={{ textAlign: 'left' }}>
                      <h3>Some of your spending needs attention.</h3>
                      {expenseOverages.map((overage: any, i: number) => (
                        <p key={i}><b>{overage.category}</b>: You're
                        <b> ${overage.difference} </b>
                          over your budget.
                        </p>
                      ))}
                    </div>
                  ) : (
                      <>
                        <div style={{ paddingTop: '10px' }}>
                          <h3>Look at you go!<br /></h3>
                          <p>You're staying within your budget for every category you set. Nice job!</p>
                        </div>
                      </>
                    )}
                </Grid>
              </Grid>
            </div >
            <div className={props.ui.isMobileView ? classes.div_row_mobile : classes.div_row}>
              <Grid className={classes.grid_container} container>
                <Grid item xs={props.ui.isMobileView ? 12 : 6}>
                  <h1>Here's how you're stacking up</h1>
                  And below we'll show you a bunch of details. You don't even know but we'll show you.
                </Grid>
                <Grid item xs={props.ui.isMobileView ? 12 : 6}>
                  <Paper style={{ opacity: 0.85, display: 'inline-block' }}>
                    <MixedLineGraph budgetData={createBudgetGraphData()}
                      expenseData={createExpenseGraphData()} labels={createGraphLabels()} />
                  </Paper>
                </Grid>
              </Grid>
            </div>
            <div className={props.ui.isMobileView ? classes.div_row_mobile : classes.div_row}>
              <Grid className={classes.grid_container} container>
                <Grid item xs={props.ui.isMobileView ? 12 : 6}>
                  <Paper style={{ opacity: 0.85, display: 'inline-block' }}>
                    <LineGraph data={0} months={months} expenseTotals={monthlyExpenses} income={createLineStaticIncome()} budget={createLineStaticBudget()}/>
                  </Paper>
                </Grid>
                <Grid item xs={props.ui.isMobileView ? 12 : 6}>
                  <h1>Here's how you're stacking up</h1>
                  And below we'll show you a bunch of details. You don't even know but we'll show you.
              </Grid>
              </Grid>
            </div>
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

export default connect(mapStateToProps)(Home);
