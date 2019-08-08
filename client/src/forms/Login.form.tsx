import React from 'react';
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

export class Login extends React.Component<ILoginProps, any> {

  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      usernameError: false,
      pwError: false,
      username: '',
      password: '',
      errorUsernameFieldTxt: '',
      errorPwFieldTxt: ''
    }
  }

  render() {
    return (
      <React.Fragment>
        <Backdrop open={this.props.open} />
        <Popover
          style={{
            marginTop: '16px',
          }}
          id={this.props.open ? 'simple-popover' : undefined}
          open={this.props.open}
          anchorEl={this.props.anchorEl}
          onClose={this.props.handleClose}
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
            <Paper style={{ display: 'inline-block', padding: '40px' }}>
              <h2>Welcome</h2>
              <Divider style={{ marginBottom: '25px' }} />
              <div onKeyPress={(e: any) => {
                if (e.key == 'Enter') {
                  this.handleClose();
                }
              }}>
                {this.getUsernameField()}
                <div style={{ marginTop: '-11.5px' }}><br /></div>
                {this.getPwField()}
              </div>
              <br />
              <Button style={{ marginTop: '-5px' }} onClick={() => this.handleClose()}>
                Login
            </Button>
            </Paper>
          </div>
        </Popover >
      </React.Fragment>
    )
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.open != this.props.open) {
      this.setState({
        usernameError: false,
        pwError: false
      })
    }
  }

  handleInputChange(event: any) {
    this.setState({
      [event.target.id]: event.target.value,
      usernameError: false,
      pwError: false
    });
  }

  handleClose() {
    const data = this.state;
    if (data.username == '') {
      this.setState({
        usernameError: true,
        errorUsernameFieldTxt: 'Missing field'
      });
    }
    if (data.password == '') {
      this.setState({
        pwError: true,
        errorPwFieldTxt: 'Missing field'
      });
    }
    if ((data.username !== '') && (data.password !== '')) {
      this.logIn();
    }
  }

  // Placeholder
  logIn() {
    alert('Logged in!');
    this.props.updateUserLoggedIn(true);
    this.props.handleClose();
    console.log(`${this.state.username}, ${this.state.password}`);
  }

  getUsernameField() {
    return (
      !this.state.usernameError ?
        <TextField
          id="username"
          onChange={(e: any) => this.handleInputChange(e)}
          variant="outlined"
          placeholder='username'
        /> :
        <TextField
          error
          id="username"
          onChange={(e: any) => this.handleInputChange(e)}
          variant="outlined"
          placeholder='username'
          helperText={this.state.errorUsernameFieldTxt}
        />
    );
  }

  getPwField() {
    return (
      !this.state.pwError ?
        <TextField
          id="password"
          onChange={(e: any) => this.handleInputChange(e)}
          type="password"
          variant="outlined"
          placeholder='password' />
        :
        <TextField
          error
          id="password"
          onChange={(e: any) => this.handleInputChange(e)}
          type="password"
          variant="outlined"
          placeholder='password'
          helperText={this.state.errorPwFieldTxt}
        />
    );
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