import React, { useState, useEffect } from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Axios from 'axios';
import { IUserState } from '../redux';
import { IExpenseProps } from './Expenses.component';
import { Button } from 'reactstrap';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }),
)(TableRow);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
      textAlign:"center"
    },
  }),
);

export function ExpensesTable(props:any) {
  const classes = useStyles(props);
  const [expenses, setExpenses] = useState([{
    amount:0
  }]);

  useEffect(() => {
    console.log('data from graph history: ',props.location.state);
    getExpensesByUserIdAndTypeId(props.location.state.userId,
                                 props.location.state.type.id);
  }, [])

  // This function sends the request to get all user reimbursements
  async function getExpensesByUserIdAndTypeId(userId:number,typeId:number) {
    // const url = `http://localhost:8080/expense/user/${userId}/type/${typeId}`;
    const url = `http://localhost:8080/expense/user/${userId}`;
    await Axios.get(url)
      .then((payload: any) => {
        // console.log(payload.data);
        setExpenses(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }
  function handleBackButton() {
    // Go back to the donut graph component
  }
  return (
    <div>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell>amount (usd)</StyledTableCell>
                <StyledTableCell>type</StyledTableCell>
                <StyledTableCell>date</StyledTableCell>
                <StyledTableCell align="right">description</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((row: any) => (
                  row.amount !== 0 &&
                  <StyledTableRow key={row.amount}>
                    <StyledTableCell component="th" scope="row">
                      {row.amount}
                    </StyledTableCell>
                    <StyledTableCell>{row.expenseType.type}</StyledTableCell>
                    <StyledTableCell>{row.date.slice(0, 10)}</StyledTableCell>
                    <StyledTableCell align="right">{row.description}</StyledTableCell>
                  </StyledTableRow>
                ))
              }
            </TableBody>
          </Table>
          <Button 
          onClick={handleBackButton}>
            Back
          </Button>
        </Paper>
    </div>
  );
}