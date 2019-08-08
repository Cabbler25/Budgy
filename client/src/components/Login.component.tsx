/**
 * 
 * Currently unused, see Login.form in /forms/
 * 
 */

import React from 'react';
import { Paper, Button } from '@material-ui/core';
import { IUserState, IState } from '../redux';
import { updateUserLoggedIn } from '../redux/actions';
import { connect } from 'react-redux';

interface ILoginProps {
  user: IUserState,
  updateUserLoggedIn: (val: boolean) => void,
  history: any
}

export function Login(props: ILoginProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Paper style={{ display: 'inline-block', padding: '50px' }}>
        <h1>Login page</h1>
        <Button onClick={handleLogin} variant='contained' color='secondary'>Login</Button>
      </Paper>
    </div>
  );

  // Placeholder
  function handleLogin(e: any) {
    props.updateUserLoggedIn(true);
    props.history.push('/home');
  }
}

// Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  updateUserLoggedIn: updateUserLoggedIn
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);