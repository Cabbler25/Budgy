import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import { IState, IUserState } from '../redux';
import NewExpense from './NewExpenseDialog';

interface IExpenseProps {
  user: IUserState;
  type: number;
  date: string;
  description: string;
  amount: number;
}

function Expenses(props: IExpenseProps) {
  return (
    <Container style={{ textAlign: 'center' }}>
      <h2>Manage your expenses, {props.user.first}</h2>
      {/* Here is the create new expense form. 
          The axios request is sent thru there. */}
      {/* Send the user Id to let the database know
          who made the expense. */}
      {NewExpense(props.user.id)}
      <br />
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
