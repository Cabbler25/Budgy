import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';

import { Input, Label, Container, Row, Popover, Col } from 'reactstrap';
import NewExpense from './NewExpenseDialog';
import { ExpensesTable } from './ExpensesTablesComponent';
import ExpensesGraph from './MyExpensesGraph';
import { IUserState, IState, IUiState } from '../redux';
import Axios from 'axios';
import { Grid, Paper, Button } from '@material-ui/core';
import DonutGraph from './data/DonutGraph';


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

  async function handleElementClick(label: string) {
    const type = expenseTypes.find((type: any) => type.type == label);
    if (type) {
      const matchedExpenses = expenses.filter((expense: any) =>
        JSON.stringify(expense.expenseType) == JSON.stringify(type))
      setExpensesByUserIdAndTypeId(matchedExpenses);
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
        id:Math.max.apply(Math, expenses.map(function(exp:any) { return exp.id; })) + 1,
        ...data
      };
      getAllExpenses();
      if (showTable) {
        setExpenses(expenses.push(newExpense));
        handleElementClick(newExpense.expenseType.type);
      }
    });
  }

  return (
    <div style={{ textAlign: 'center' }}>
        <h2>Check your expenses, {props.user.first}</h2>
        {/* Show expenses in the table */}
        {/*<Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Paper>
          <h3>Total Expenses</h3>
          <p>$100,000 <br/> Monthly $100 <br/><br/><br/><br/></p>
        </Paper>
          </Grid>*/}
        <Container>
            <Grid item xs={12} md={9}>
              <div>
                {/* Logic: 
                  if an expense type is selected in the donut graph, then the table
                  is displayed */}
                {showTable ? (
                  <Fragment>
                    <Button
                      color="secondary"
                      onClick={() => setShowTable(false)}>
                      Back
                    </Button>
                    <ExpensesTable expenses={expensesByUserAndType} />
                  </Fragment>
                ) : (
                    <Fragment>
                      {expenses && 
                      (<DonutGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                        isMobileView={props.ui.isMobileView}
                        handleElementClick={handleElementClick} />)}
                    </Fragment>
                  )}
                <br />
                <NewExpense
                  types={expenseTypes}
                  createExpense={createNewExpense} />
                <br />
              </div>
            </Grid>
        </Container>
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