import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import { IUserState, IState } from '../redux';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme: Theme) => createStyles({
  navbar: {
    color: 'primary'
  },
  title: {
    marginRight: '40px',
    marginLeft: '5px',
    color: '#FFFFFF'
  },
  nav_item: {
    marginLeft: '10px',
    textTransform: 'initial',
    fontSize: '17px',
    color: '#FFFFFF'
  },
  nav_right: {
    marginRight: '5px',
    marginLeft: 'auto'
  }
}));

interface INavProps {
  user: IUserState,
}

function NavBar(props: INavProps) {
  const classes = useStyles();
  return (
    <AppBar className={classes.navbar} position='sticky'>
      <Toolbar>
        <Typography className={classes.title} variant='h4'>Wataname</Typography>
        <Button className={classes.nav_item} color='secondary'>Budget</Button>
        <Button className={classes.nav_item} color='secondary'>Expenses</Button>
        <Button className={classes.nav_item} color='secondary'>Income</Button>
        <div className={classes.nav_right}>
          <Button className={classes.nav_item} color='secondary'>Login</Button>
          <Button className={classes.nav_item} color='secondary'>Sign Up</Button>
        </div>
      </Toolbar>
    </AppBar >
  );
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(NavBar);
