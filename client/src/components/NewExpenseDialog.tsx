import { Container, Paper, TextField, InputAdornment } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Axios from 'axios';
import React from 'react';
import { Row } from 'reactstrap';

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

export default function NewExpense(props:any) {
  const classes = useStyles(props);
  const [state, setState] = React.useState({
    open: false,
    type: 0,
    description: '',
    amount: 0,
    formFilled:true
  });

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setState({ ...state, 
      [name]: event.target.value
    });
  };

  function handleClickOpen() {
    setState({ ...state, open: true,formFilled:true });
  }
  
  function handleSubmit() {
    // Check if form is filled properly
    if (state.type && state.description && state.amount) {
      props.createExpense(props.types.find((type:any) => type.id == state.type),state.description,state.amount);
      // Close popover
      handleClose();
    } else {
      setState({...state,formFilled:false});
    }
  }

  function handleClose() {
    setState({ ...state, open: false });
  }

  return (
    <div>
      <Button onClick={handleClickOpen}>+</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={state.open} onClose={handleClose}>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
            {/* In each field, is checked if it's properly filled before sending the request */}
              <Paper>
                  <Container style={{textAlign: "center"}}>
                    <Row>
                      <h4>
                        {props.view ? "Add expense" : "Add New Expense" } 
                      </h4>
                    </Row>
                    <Row className="new-expense-form">
                        <TextField
                        name="amount"
                        className="new-expense-form"
                        placeholder="0.00"
                        label={
                          state.formFilled ?
                          props.view ? "Amount" : "Expense Amount"
                          :
                          state.amount ?
                          "Amount"
                          :
                          "Required"
                        }
                        error={state.formFilled?
                          false
                          :
                          state.amount?
                          false :
                          true}
                        type="number"
                        onChange={handleChange("amount")}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        />
                    </Row>
                    <Row className="new-expense-form">
                        <TextField
                        name="description"
                        className="new-expense-form"
                        placeholder="A brief description of the expense..."
                        error={state.formFilled?
                          false
                          :
                          state.description ?
                          false :
                          true}
                        label={
                          state.formFilled ?
                          "Description"
                          :
                          state.description ?
                          "Description"
                          :
                          "Required"
                        }
                        type="text"
                        multiline={true}
                        rows={props.view ? 4 : 5}
                        onChange={handleChange("description")}/>
                    </Row>
                    <Row className="new-expense-form">
                      <Select
                      value={state.type}
                      onChange={handleChange('type')}
                      input={<Input id="expense-type" />}
                      error={state.formFilled?
                        false
                        :
                        state.type ?
                        false :
                        true}
                      >
                        <MenuItem value={0}>
                        <em style={
                          {color:state.formFilled?"black":state.description?"black":"red"}
                          }>
                          { state.formFilled ?
                            props.view ? 
                            "Type" : 
                            "Select expense type":
                            "Required"}
                        </em>
                        </MenuItem>
                        {props.types.map((t:any) => (
                        <MenuItem key={t.id} value={t.id}>{t.type}</MenuItem>  
                        ))}
                      </Select>
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
                Ok
            </Button>
          <Button
          onClick={handleClose}
          color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
