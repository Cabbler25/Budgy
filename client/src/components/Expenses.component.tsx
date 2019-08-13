import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { Input, Label, Container, Row, Popover, Col } from 'reactstrap';
import NewExpense from './NewExpenseDialog';
import { ExpensesTable } from './ExpensesTablesComponent';
import ExpensesGraph from './MyExpensesGraph';
import { IUserState, IState } from '../redux';
import Axios from 'axios';
import { Divider } from 'material-ui';

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
        // console.log(payload.data);
        setExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  return (
    <div>
      <Container style={{ textAlign: 'center' }}>
        <h2>Check your expenses, {props.user.first}</h2>
        {/* Show expenses in the table */}
        <ExpensesGraph data={expenses} />
        {/* Here is the create new expense form.
            The axios request is sent thru there. */}
        {/* Send the user Id to let the database know
            who made the expense. */}
            <br/>
            {/* <Divider /> */}
        {NewExpense(props.user.id)}
        <br />
      </Container>
      {/* {ExpensesTable(props)} */}
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
