import React from 'react';
import { Paper } from '@material-ui/core';
import { IUserState, IState } from '../redux';
import { connect } from 'react-redux';
import NewIncome from './NewIncomesDialog';
import { Input, Label, Container, Row, Popover } from 'reactstrap';

interface IIncomeProps{
  user: IUserState;
  type: number;
  description: string;
  amount: number;
}

function Incomes(props:IIncomeProps){
  return (
    <Container style={{ textAlign: 'center'}}>
      <h2>Manage your Income, {props.user.first}</h2>

      {NewIncome(props.user.id)}
    </Container>
  )
}

//Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Incomes);