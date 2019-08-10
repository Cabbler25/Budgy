import React, { useState } from 'react';
import { Paper, Button, Divider, TextField } from '@material-ui/core';
import { IUserState, IState } from '../redux';
import { updateUserLoggedIn } from '../redux/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

interface ILoginProps {
  user: IUserState,
  updateUserLoggedIn: (val: boolean) => void
}

export function Login(props: ILoginProps) {
  const [usernameField, setUsernameField] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorTxt, setUsernameErrorTxt] = useState('');
  const [pwField, setPwField] = useState('');
  const [pwError, setPwError] = useState(false);
  const [pwErrorTxt, setPwErrorTxt] = useState('');

  // Placeholder
  function logIn() {
    alert('Logged in!');
    props.updateUserLoggedIn(true);
  }

  const handleUsernameInput = (e: any) => {
    setUsernameField(e.target.value);
    setUsernameError(false);
  }

  const handlePwInput = (e: any) => {
    setPwField(e.target.value);
    setPwError(false);
  }

  const handleLogin = () => {
    if (!usernameField) {
      setUsernameError(true);
      setUsernameErrorTxt('Missing field');
    }
    if (!pwField) {
      setPwError(true);
      setPwErrorTxt('Missing field');
    }
    if (usernameField && pwField) logIn();
  }

  return (
    props.user.isLoggedIn ? <Redirect push to='/user' /> :
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <Paper style={{ display: 'inline-block', padding: '50px' }}>
          <h2>Welcome</h2>
          <div onKeyPress={(e: any) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}>
            <Divider style={{ marginBottom: '25px' }} />
            <TextField
              error={usernameError}
              id="username"
              onChange={handleUsernameInput}
              variant="outlined"
              placeholder='username'
              helperText={usernameError ? usernameErrorTxt : ''}
            />
            <br />
            <div style={{ marginTop: '10px' }} />
            <TextField
              error={pwError}
              id="password"
              onChange={handlePwInput}
              type="password"
              variant="outlined"
              placeholder='password'
              helperText={pwError ? pwErrorTxt : ''}
            />
          </div>
          <br />
          <Button style={{ marginTop: '10px' }} onClick={handleLogin}>
            Login
          </Button>
        </Paper>
      </div >
  );
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