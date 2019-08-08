import React, { useEffect } from 'react';
import { Popover, Button, Paper, Divider, TextField, Backdrop } from '@material-ui/core';
import { updateUserLoggedIn } from '../redux/actions';
import { IUserState, IState } from '../redux';
import { connect } from 'react-redux';

interface ILoginProps {
  user: IUserState,
  updateUserLoggedIn: (val: boolean) => void,
  open: any,
  anchorEl: any,
  handleClose: any
}

export function Login(props: ILoginProps) {
  const [usernameField, setUsernameField] = React.useState('');
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorTxt, setUsernameErrorTxt] = React.useState('');
  const [pwField, setPwField] = React.useState('');
  const [pwError, setPwError] = React.useState(false);
  const [pwErrorTxt, setPwErrorTxt] = React.useState('');

  useEffect(() => {
    setUsernameError(false);
    setPwError(false);
  }, [props.open])

  const handleUsernameInput = (e: any) => {
    setUsernameField(e.target.value);
    setUsernameError(false);
  }

  const handlePwInput = (e: any) => {
    setPwField(e.target.value);
    setPwError(false);
  }

  // Placeholder
  function logIn() {
    alert('Logged in!');
    props.updateUserLoggedIn(true);
    props.handleClose();
    console.log(`${usernameField}, ${pwField}`);
  }

  const handleLogin = () => {
    if (usernameField == '') {
      setUsernameError(true);
      setUsernameErrorTxt('Missing field');
    }
    if (pwField == '') {
      setPwError(true);
      setPwErrorTxt('Missing field');
    }
    if (usernameField != '' && pwField != '') logIn();
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
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