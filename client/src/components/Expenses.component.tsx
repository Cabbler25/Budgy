import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { Input, Label, Container, Row, Popover, Col } from 'reactstrap';
import NewExpense from './NewExpenseDialog';
import { ExpensesTable } from './ExpensesTablesComponent';
import ExpensesGraph from './MyExpensesGraph';
import { IUserState, IState } from '../redux';
import Axios from 'axios';
import { Grid, Paper } from '@material-ui/core';

export interface IExpenseProps {
  user: IUserState;
  type: number;
  date: string;
  description: string;
  amount: number;
}


function Expenses(props: IExpenseProps) {
  const [expenses, setExpenses] = useState([{}]);
  useEffect(() => {
    getAllExpenses();
  }, [])

  // This function sends the request to get all user reimbursements
  async function getAllExpenses() {
    const url = `http://localhost:8080/expense/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        console.log(payload.data);
        setExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  return (
    <div>
      <Container style={{ textAlign: 'center' }}>
        <h2>Manage your expenses, {props.user.first}</h2>
        {/* Here is the create new expense form.
            The axios request is sent thru there. */}
        {/* Send the user Id to let the database know
            who made the expense. */}
        {NewExpense(props.user.id)}
        <br />
      
      {/* Show expenses in the table */}
      <Grid container>
      <Grid item xs={12} lg={3}>
        <Paper>
          <h3>Total Expenses</h3>
          <p>$100,000 <br/> Monthly $100 <br/><br/><br/><br/></p>
        </Paper>

      </Grid>
      <Grid item xs={12} lg={9}>
      <ExpensesGraph data={expenses} />
      {/* {ExpensesTable(props)} */}
      </Grid>
      </Grid>
      </Container>
    </div>
  );
}

// Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Expenses);
