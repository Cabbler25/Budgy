import React from 'react'
import { Drawer, Button, Divider, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { IState } from '../redux';

export function Sidebar(props: any) {
  return (
    <div role="presentation" onClick={props.handleClose} onKeyDown={props.handleClose} >
      <Drawer open={props.open} onClose={() => props.handleClose()}>
        <Paper>
          <h2 style={{ textAlign: 'center', paddingTop: '25px' }}>
            Wataname
        </h2>
          {props.isLoggedIn ?
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <Button fullWidth={true} color='inherit' component={Link} to="/user">My Profile</Button>
            </div>
            :
            <Button fullWidth={true} style={{ marginBottom: '20px' }} onClick={props.handleLogin}>
              Login
            </Button>}
          }
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Button style={{ marginTop: '20px' }} fullWidth={true} component={Link} to="/">
              Home
            </Button>
            <Button style={{ marginTop: '20px' }} fullWidth={true} component={Link} to="/budget">
              Budget
            </Button>
            <Button style={{ marginTop: '15px' }} fullWidth={true} component={Link} to="/expenses">
              Expenses
            </Button>
            <Button style={{ marginTop: '15px' }} fullWidth={true} component={Link} to="/incomes">
              incomes
            </Button>
          </div>
          <div style={{ margin: 'auto 0px 0px 0px' }}>
            <Divider />
            {props.isLoggedIn &&
              <Button fullWidth={true} style={{ marginTop: '20px', marginBottom: '20px' }} component={Link} to="/logout">
                Logout
              </Button>}
          </div>
        </Paper>
      </Drawer >
    </ div >
  );
}

// Redux
const mapStateToProps = (state: IState) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Sidebar);