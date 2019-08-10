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

export default function NewExpense() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
    type: 0,
  });

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setState({ ...state, [name]: Number(event.target.value) });
  };

  function handleClickOpen() {
    setState({ ...state, open: true });
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
                        className="new-expense-form"
                        placeholder="amount"
                        type="number" />
                    </Row>
                    <Row className="new-expense-form">
                        <TextField
                        className="new-expense-form"
                        placeholder="description"
                        type="text" />
                    </Row>
                  </Container>
              </Paper>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}