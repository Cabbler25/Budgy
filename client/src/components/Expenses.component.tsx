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
  history:any;
}


function Expenses(props: IExpenseProps) {
  const [expenses, setExpenses] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]);

  useEffect(() => {
    getAllExpenses();
    getAllExpenseTypes();
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

  async function getAllExpenseTypes() {
    const url = `http://localhost:8080/expense/types`;
    await Axios.get(url)
      .then((payload: any) => {
        // console.log(payload.data);
        setExpenseTypes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  //   Request function for new expense here
  async function createNewExpense(newType:any,newDescripion:string,newAmount:number){
    // Prepare request setup
    const url = 'http://localhost:8080/expense';
    const data = {
      userId: props.user.id,
      expenseType: newType,
      date: new Date().toISOString().slice(0, 10),
      description: newDescripion,
      amount: newAmount
    };
    const response = await Axios.post(url, data);
    try {
      // console.log(response.status);
      getAllExpenses();
    } catch {
      console.log("ERRORS: ", response.data);
    }
  }

  return (
    <div>
      <Container style={{ textAlign: 'center' }}>
        <h2>Check your expenses, {props.user.first}</h2>
        {/* Show expenses in the table */}
        {/* Pass the expenses as property and the main expenses properties too */}
        <ExpensesGraph types={expenseTypes} data={expenses} props={props} />
        {/* Here is the create new expense form.
            The axios request is sent thru there. */}
        {/* Send the user Id to let the database know
            who made the expense. */}
            <br/>
            {/* <Divider /> */}
        <NewExpense types={expenseTypes}  createExpense={createNewExpense} />
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