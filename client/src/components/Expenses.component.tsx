import React from 'react';
import { Paper, Select } from '@material-ui/core';
import { IUserState, IState } from '../redux';
import { connect } from 'react-redux';
import { Input, Label, Container, Row, Popover } from 'reactstrap';
import NewExpense from './NewExpenseDialog';

interface IExpenseProps {
  user: IUserState;
  type:number;
  date:string;
  description:string;
  amount:number;
}

function Expenses(props:IExpenseProps ) {
  return (
    <Container style={{ textAlign: 'center' }}>
      <h2>Manage your expenses, {props.user.first}</h2>  
      {NewExpense()}
      <br/> 
    </Container>
  );
}

// Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Expenses);