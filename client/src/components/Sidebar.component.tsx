import React from 'react'
import { Drawer, Button, Divider, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { IState } from '../redux';

export function Sidebar(props: any) {
  return (
    <div role="presentation" onClick={props.handleClose} onKeyDown={props.handleClose} >
      <Drawer open={props.open} onClose={() => props.handleClose()}>
        <div style={{ minWidth: '250px', maxWidth: '250px' }}>
          <h2 style={{ textAlign: 'center', paddingTop: '25px' }}>
            Wataname
        </h2>
          <div style={{ textAlign: 'center' }}>
            {props.isLoggedIn ?
              <Button style={{ marginBottom: '20px' }} color='inherit' component={Link} to="/user">
                My Profile
              </Button>
              :
              <Button style={{ marginBottom: '20px' }} onClick={props.handleLogin}>
                Login
            </Button>}
          </div>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Button style={{ marginTop: '20px' }} component={Link} to="/">
              Home
            </Button><br />
            <Button style={{ marginTop: '20px' }} component={Link} to="/budget">
              Budget
            </Button><br />
            <Button style={{ marginTop: '15px' }} component={Link} to="/expenses">
              Expenses
            </Button><br />
            <Button style={{ marginTop: '15px' }} component={Link} to="/incomes">
              incomes
            </Button><br />
          </div>
          <div style={{ margin: 'auto 0px 0px 0px' }}>
            {props.isLoggedIn &&
              <React.Fragment>
                <Divider />
                <Button fullWidth={true} style={{ marginTop: '20px', marginBottom: '20px' }} component={Link} to="/logout">
                  Logout
              </Button>
              </React.Fragment>}
          </div>
        </div>
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