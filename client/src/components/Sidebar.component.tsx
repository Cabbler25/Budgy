import { Button, Divider, Drawer } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { IState } from '../redux';
import colors from '../assets/Colors';

export function Sidebar(props: any) {
  return (
    <div role="presentation" onClick={props.handleClose} onKeyDown={props.handleClose} >
      <Drawer open={props.open} onClose={() => props.handleClose()}>
        <div style={{ backgroundColor: colors.lighterGreen }}>
          <div style={{ minWidth: '250px', maxWidth: '250px' }} />
          <div style={{ textAlign: 'center' }}>
            <img style={{ display: 'inline-block', marginTop: '40px' }} width='50px' height='50px' src={Logo} />
          </div>
          <h2 style={{ marginTop: '-10px', textAlign: 'center' }}>
            Budgy
        </h2>
          <div style={{ textAlign: 'center' }}>
            {props.isLoggedIn ?
              <Button color="primary" style={{ color: colors.offWhite }} component={Link} to="/user">
                My Account
            </Button>
              :
              <Button variant="outlined" onClick={() => props.history.push('/login')}>
                Login
            </Button>}
          </div>
          <Divider style={{ marginTop: '20px' }} />
        </div>
        <div style={{ backgroundColor: colors.lightGreen, textAlign: 'center' }}>
          <Button style={{ color: colors.offWhite, marginTop: '50px' }} variant='text' component={Link} to="/">
            Home
            </Button><br />
          <Button style={{ color: colors.offWhite, marginTop: '15px' }} variant='text' component={Link} to="/budget">
            Budget
            </Button><br />
          <Button style={{ color: colors.offWhite, marginTop: '15px' }} variant='text' component={Link} to="/expenses">
            Expenses
            </Button><br />
          <Button style={{ color: colors.offWhite, marginTop: '15px', marginBottom: '50px' }} variant='text' component={Link} to="/incomes">
            incomes
            </Button><br />
        </div>
        <Divider />
        {props.isLoggedIn &&
          <div style={{ marginBottom: '0px', marginTop: 'auto', textAlign: 'center' }}>
            <Button style={{ marginBottom: '20px' }} variant="outlined" component={Link} to="/logout">
              Logout
            </Button>
          </div>}
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
