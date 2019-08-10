import React from 'react';
import { Paper } from '@material-ui/core';
import { IUserState, IState } from '../redux';
import { connect } from 'react-redux';

interface IExpenseProps {
  user: IUserState;
}

function Expenses(props:IExpenseProps ) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Paper style={{ display: 'inline-block', padding: '50px' }}>
        <h1>See your expenses, {props.user.first}</h1>
      </Paper>
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