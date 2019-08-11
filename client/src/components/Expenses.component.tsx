import React from 'react';
import { Paper, Select } from '@material-ui/core';
import { IUserState, IState } from '../redux';
import { connect } from 'react-redux';
import { Input, Label, Container, Row, Popover, Col } from 'reactstrap';
import NewExpense from './NewExpenseDialog';
import { ExpensesTable } from './ExpensesTablesComponent';
import ExpensesGraph from './MyExpensesGraph';

export interface IExpenseProps {
  user: IUserState;
  type:number;
  date:string;
  description:string;
  amount:number;
}


function Expenses(props:IExpenseProps ) {
  return (
    <div>
      <Container style={{ textAlign: 'center' }}>
        <h2>Manage your expenses, {props.user.first}</h2>  
        {/* Here is the create new expense form. 
            The axios request is sent thru there. */}
        {/* Send the user Id to let the database know
            who made the expense. */}
        {NewExpense(props.user.id)}
        <br/> 
      </Container>
        {/* Show expenses in the table */}
        {ExpensesGraph(props)}
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