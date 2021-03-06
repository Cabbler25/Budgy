import { Backdrop, Button, Divider, Paper, Popover, TextField } from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IState, IUserState } from '../redux';
import { updateUserLoggedIn, updateUserInfo } from '../redux/actions';
import Axios from 'axios';

interface ILoginProps {
  user: IUserState;
  updateUserLoggedIn: (val: boolean) => void;
  updateUserInfo: (payload: any) => void;
  handleClose: () => void;
  open: boolean;
  anchorEl: any;
}

export function Login(props: ILoginProps) {
  const [usernameField, setUsernameField] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorTxt, setUsernameErrorTxt] = useState('');
  const [pwField, setPwField] = useState('');
  const [pwError, setPwError] = useState(false);
  const [pwErrorTxt, setPwErrorTxt] = useState('');

  useEffect(() => {
    setUsernameError(false);
    setPwError(false);
  }, [props.open])

  const handleUsernameInput = (e: any) => {
    setUsernameField(e.target.value);
    setUsernameError(false);
    setPwError(false);
  }

  const handlePwInput = (e: any) => {
    setPwField(e.target.value);
    setPwError(false);
    setUsernameError(false);
  }

  async function logIn() {
    const url = 'http://localhost:8080/login';
    await Axios.post(url, {
      username: usernameField,
      password: pwField,
    }).then(payload => {
      setPwError(false);
      setUsernameError(false);
      props.updateUserInfo(payload.data)
      props.updateUserLoggedIn(true);
      props.handleClose();
    }).catch(err => {
      setUsernameError(true);
      setUsernameErrorTxt('');
      setPwError(true);
      setPwErrorTxt('Incorrect Username or Password!');
    });
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
    <Fragment>
      <Backdrop open={props.open} />
      <Popover
        style={{
          marginTop: '16px',
        }}
        id={props.open ? 'simple-popover' : undefined}
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div>
          <Paper style={{ display: 'inline-block', padding: '50px' }}>
            <h2>Welcome</h2>
            <div onKeyPress={(e: any) => {
              if (e.key == 'Enter') {
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
        </div>
      </Popover >
    </Fragment>
  )
}

// Redux
// Needed state
const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  }
}

// Needed actions
const mapDispatchToProps = {
  updateUserLoggedIn: updateUserLoggedIn,
  updateUserInfo: updateUserInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);