import React from 'react';
import { updateUserLoggedIn } from '../redux/actions';
import { IUserState, IState } from '../redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

interface ILogoutProps {
  user: IUserState,
  updateUserLoggedIn: (val: boolean) => void
}

export function Logout(props: any) {
  props.updateUserLoggedIn(false);
  return (
    <Redirect to="/" />
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

export default connect(mapStateToProps, mapDispatchToProps)(Logout);