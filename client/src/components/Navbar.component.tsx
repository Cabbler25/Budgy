import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Typography, makeStyles, Theme, createStyles, List, ListItem, Icon } from '@material-ui/core';
import { IUserState, IState, IUiState } from '../redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import colors from '../assets/Colors';
import Login from '../forms/Login.form';
import { setMobileView } from '../redux/actions';
import { Sidebar } from './Sidebar.component';

const useStyles = makeStyles((theme: Theme) => createStyles({
  navbar: {
    maxHeight: '50%',
    height: '50%',
    marginLeft: '5px',
    color: 'primary'
  },
  title: {
    marginRight: '30px',
    textTransform: 'initial',
    color: colors.offWhite
  },
  nav_item: {
    marginLeft: '10px',
    textTransform: 'initial',
    fontSize: '16px',
    color: colors.offWhite
  },
  nav_right: {
    marginRight: '10px',
    marginLeft: 'auto'
  }
}));

interface INavProps {
  user: IUserState,
  ui: IUiState,
  setMobileView: (val: boolean) => void
}

function NavBar(props: INavProps) {
  const classes = useStyles(props);

  // Mobile view query
  const mediaQuery = window.matchMedia('(min-width: 700px)');

  // Login form
  const [loginOpen, setLoginOpen] = React.useState(false);

  // Hide/show navbar on scroll
  const [isTopView, setTopView] = React.useState(true);

  // Hide/show sidebar
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  window.onscroll = () => {
    if (window.pageYOffset >= 10) {
      isTopView && setTopView(false);
    } else {
      !isTopView && setTopView(true);
    }
  };

  // Hook into React lifecycle methods.
  // Called only twice when component mounts/unmounts.
  useEffect(() => {
    const listener = () => {
      props.setMobileView(!mediaQuery.matches);
    }
    // Add listener to update view type
    mediaQuery.addListener(listener);

    // Remove listener when component unmounts
    return () => mediaQuery.removeListener(listener);
  }, [])

  const handleLoginOpen = () => {
    setLoginOpen(true);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <React.Fragment>
      <Sidebar open={sidebarOpen} handleClose={handleSidebarClose} isLoggedIn={props.user.isLoggedIn} handleLogin={handleLoginOpen} />
      <AppBar style={{ boxShadow: 'none', backgroundColor: isTopView ? 'transparent' : undefined }} position='sticky'>
        <Toolbar className={classes.navbar}>
          {props.ui.isMobileView &&
            <Button style={{ marginRight: '5px', maxWidth: '40px', minWidth: '40px' }} variant='text' onClick={handleSidebarOpen}>
              <Icon style={{ fontSize: 30, color: colors.offWhite }}>view_headline</Icon>
            </Button>}
          <Button className={classes.title} variant='text' component={Link} to="/">
            <Typography variant={props.ui.isMobileView ? 'body1' : 'h5'}>Wataname</Typography>
          </Button>
          {!props.ui.isMobileView &&
            <React.Fragment>
              <Button className={classes.nav_item} variant='text' component={Link} to="/budget">
                Budget
              </Button>
              <Button className={classes.nav_item} variant='text' component={Link} to="/expenses">
                Expenses
              </Button>
              <Button className={classes.nav_item} variant='text' component={Link} to="/incomes">
                Incomes
              </Button>
            </React.Fragment>}
          <div className={classes.nav_right}>
            {props.user.isLoggedIn ?
              <Button className={classes.nav_item} variant='text' color='secondary' component={Link} to="/logout">
                Logout
              </Button>
              :
              <List>
                <ListItem>
                  {props.ui.isMobileView ?
                    <Button id='loginButton' size='small' variant='outlined' className={classes.nav_item} color='secondary'
                      style={{ borderColor: colors.offWhite, fontSize: '12px' }}
                      component={Link} to='/login'>
                      Login
                    </Button>
                    :
                    <Button id='loginButton' size='small' variant='outlined' className={classes.nav_item} color='secondary'
                      style={{ borderColor: colors.offWhite }} onClick={handleLoginOpen}>
                      Login
                    </Button>}
                  <Login open={loginOpen} handleClose={handleLoginClose} anchorEl={document.getElementById('loginButton')} />
                  <Button size='small' variant='contained' className={classes.nav_item} color='secondary'
                    style={{ backgroundColor: colors.orange, fontSize: props.ui.isMobileView ? '12px' : '16px' }}
                    component={Link} to="/register">
                    Register
                  </Button>
                </ListItem>
              </List>
            }
          </div>
        </Toolbar>
      </AppBar >
    </React.Fragment >
  );
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

const mapDispatchToProps = {
  setMobileView: setMobileView
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
