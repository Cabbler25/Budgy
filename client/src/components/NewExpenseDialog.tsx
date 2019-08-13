import { Container, Paper, TextField } from '@material-ui/core';
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
    amount: 0
  });

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setState({ ...state, [name]: event.target.value });
  };

  function handleClickOpen() {
    setState({ ...state, open: true });
  }
  
  function handleSubmit() {
    // Check state of elements using conditionals 
    // const type = props.types.find((type:any) => type.id == state.type);
    props.createExpense(props.types.find((type:any) => type.id == state.type),state.description,state.amount);
    // Close popover
    handleClose();
  }

  function handleClose() {
    setState({ ...state, open: false });
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
                {props.types.map((t:any) => (
                  <MenuItem value={t.id}>{t.type}</MenuItem>  
                ))}
              </Select>
              <Paper>
                  <Container>
                    <Row className="new-expense-form">
                        <TextField
                        name="amount"
                        className="new-expense-form"
                        placeholder="$usd"
                        type="number"
                        onChange={handleChange("amount")}
                        />
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
