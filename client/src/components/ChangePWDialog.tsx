import {Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import {  Dialog, Paper, TextField, Button, DialogContent, FormControl, Container, InputAdornment, Select, Input, DialogActions, Snackbar } from "@material-ui/core";
import React from "react";
import { Row } from "reactstrap";
import { Lock, ClosedCaptionTwoTone } from "@material-ui/icons";
import { IUserState, IState } from "../redux";
import { connect } from "react-redux";
import Axios from "axios";
import MySnackbarContentWrapper from "./SnackBarComponent";



interface IUpdatePWProps {
    user: IUserState
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

export function ChangePw(props: IUpdatePWProps) {
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    open: false,
    prev: '',
    newOne: '',
    confirm: ''
  });
  const[openPw, setOpenPw] = React.useState(false);

  const [errors, setErrors] = React.useState({
      previous: false,
      newOne: false,
      repeat: false
  });
  const [errorText, setErrorText] = React.useState({
      previous: '',
      newOne: '',
      repeat: ''
  })

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setState({ ...state, [name]: event.target.value });
    setErrors({
        previous: false,
        newOne: false,
        repeat: false
    })
  };

  function handleClickOpen() {
    setState({ ...state, open: true });
  }
  
  function handleSubmit() {
    if(!state.prev){
        setErrors({
            ...errors,
            previous: true
        })
        setErrorText({
            ...errorText,
            previous: 'Missing Field'
        })
    }
    if(!state.newOne){
        setErrors({
            ...errors,
            newOne: true
        })
        setErrorText({
            ...errorText,
            newOne: 'Missing Field'
        })
    }    
    if(!state.confirm){
        setErrors({
            ...errors,
            repeat: true
        })
        setErrorText({
            ...errorText,
            repeat: 'Missing Field'
        })
    }
    if(state.newOne && state.confirm && state.prev)
    {
        if(state.newOne !== state.confirm)
        {
            setErrors({
                ...errors,
                newOne: true,
                repeat: true
            })
            setErrorText({
                ...errorText,
                newOne: 'Passwords Do Not Match',
                repeat: 'Passwords Do Not Match'
            }) 
        }
        else{
            updatePw();
        }
    }


    
  }
  async function updatePw(){
      const url= 'http://localhost:8080/user/verifyPassword';
      await Axios.post(url,{
          username: props.user.username,
          password: state.prev
      }).then(payload => {
          const url= 'http://localhost:8080/update'
          if(payload.status === 200){
              Axios.patch(url,{
                  id: props.user.id,
                  password: state.newOne
              });
              handleClose();
              handleOpenPw();
          }
  
      }).catch(err => {
        if(err.response.status === 401){
            setErrors({
                ...errors,
                previous: true,
                
            });
            setErrorText({
                ...errorText,
                previous: 'Incorrect Password',
                
            });
      }});
  }

  function handleClose() {
    setState({ ...state, open: false });
  }
  function closePw(){
      setOpenPw(false);
  }
  function handleOpenPw(){
      setOpenPw(true);
  }

  return (
    <div>
    <Button size="small" style={{margin:"5px"}} onClick={handleClickOpen}><Lock /> Change Password</Button>
      <Dialog open={state.open}>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>

              <Paper>
                  <Container style={{textAlign: "center"}}>
                    <Row><h4>Change Password</h4></Row>

                    <Row className="new-expense-form">
                        <TextField
                        name="oldPassword"
                        error={errors.previous}
                        helperText={errors.previous ? errorText.previous : ''}
                        className="new-expense-form"
                        label="Enter Old Password"
                        type="password"
                        onChange={handleChange("prev")}
                        />
                    </Row>
                    <Row className="new-expense-form">
                        <TextField
                        name="newPassword"
                        error={errors.newOne}
                        helperText={errors.newOne ? errorText.newOne : ''}
                        className="new-expense-form"
                        label="Enter New Password"
                        type="password"
                        onChange={handleChange("newOne")}/>
                    </Row>
                    <Row className="new-expense-form">
                        <TextField
                        name="newPasswordAgain"
                        error={errors.repeat}
                        helperText={errors.repeat ? errorText.repeat : ''}
                        className="new-expense-form"
                        label="Re-enter New Password"
                        type="password"
                        onChange={handleChange("confirm")}/>
                    </Row>
                  </Container>
              </Paper>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
            <Button
            onClick={
            // Function call to send the request for creating new expense
            handleSubmit
            }
            color="primary">
                Apply
            </Button>
          <Button
          onClick={handleClose}
          color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openPw}
        autoHideDuration={6000}
        onClose={closePw}
      >
        <MySnackbarContentWrapper
          variant="success"
          message="Password Updated Successfully"
        />
      </Snackbar>
    </div>
  );
}

const mapStateToProps = (state: IState) => {
    return {
      user: state.user
    }
  }

  export default connect(mapStateToProps)(ChangePw);