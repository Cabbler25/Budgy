import React from 'react';
import { updateUserLoggedIn, updateUserInfo } from '../redux/actions';
import { IUserState, IState } from '../redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

interface ILogoutProps {
  user: IUserState;
  updateUserLoggedIn: (val: boolean) => void;
  updateUserInfo: (payload: any) => void;
}

export function Logout(props: ILogoutProps) {
  props.updateUserLoggedIn(false);
  props.updateUserInfo({
    id: 0,
    first: '',
    last: '',
    username: '',
    token: ''
  })
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
  updateUserLoggedIn: updateUserLoggedIn,
  updateUserInfo: updateUserInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);