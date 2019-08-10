import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Paper, TextField, Container } from '@material-ui/core';
import { Row } from 'reactstrap';
import Axios from 'axios';

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

export default function NewExpense(authorId:number) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
    type: 0,
    description:'',
    amount:0
  });

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setState({ ...state, [name]: event.target.value });
  };

  function handleClickOpen() {
    setState({ ...state, open: true });
  }
//   Request function for new expense here
  async function createNewExpense(){
    const url = 'http://localhost:8080/expense/create';
    const response = await Axios.post(url, {
      userId:authorId,
      type:state.type,
      date:new Date().toISOString().slice(0,10),
      description:state.description,
      amount:state.amount
    });
    try {
        console.log(response.status);
    } catch {
        console.log("ERRORS: ",response.data);
    }
  }
  function handleClose() {
    setState({ ...state, open: false });
    // Function call to send the request for creating new expense
    createNewExpense();

  }

  return (
    <div>
      <Button onClick={handleClickOpen}>Add expense</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={state.open} onClose={handleClose}>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="expense-type">Type</InputLabel>
              <Select
                value={state.type}
                onChange={handleChange('type')}
                input={<Input id="expense-type" />}
              >
                <MenuItem value={0}>
                  <em>Select</em>
                </MenuItem>
                <MenuItem value={1}>Bills</MenuItem>
                <MenuItem value={2}>Food</MenuItem>
                <MenuItem value={3}>Emergency</MenuItem>
                <MenuItem value={4}>For fun</MenuItem>
                <MenuItem value={5}>Other</MenuItem>
              </Select>
              <Paper>
                  <Container>
                    <Row className="new-expense-form">
                        <TextField
                        name="amount"
                        className="new-expense-form"
                        placeholder="amount"
                        type="number" 
                        onChange={handleChange("amount")}/>
                    </Row>
                    <Row className="new-expense-form">
                        <TextField
                        name="description"
                        className="new-expense-form"
                        placeholder="description"
                        type="text" 
                        onChange={handleChange("description")}/>
                    </Row>
                  </Container>
              </Paper>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
            <Button 
            onClick={handleClose} 
            color="primary">
                Ok
            </Button>
          <Button 
          onClick={handleClose} 
          color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}