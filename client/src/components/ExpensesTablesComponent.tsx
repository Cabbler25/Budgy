import React from 'react';
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
    },
  }),
);

export default function ExpensesTable(props:IExpenseProps) {
  const classes = useStyles();
    // This function sends the request to get all user reimbursements
    async function getAllExpenses(userId:number) {
        const url = `http://localhost:8080/expense/user/${userId}`;
        await Axios.get(url)
        .then((payload) => {
          console.log(payload.data);
          const expenses = payload.data;
          
          return (
            <div>
                <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>amount (usd)</StyledTableCell>
                        <StyledTableCell>type</StyledTableCell>
                        <StyledTableCell align="right">date</StyledTableCell>
                        <StyledTableCell align="right">description</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {expenses.map((row:any) => (
                        <StyledTableRow key={row.amount}>
                        <StyledTableCell component="th" scope="row">
                            {row.amount}
                        </StyledTableCell>
                        <StyledTableCell>{row.expenseType.type}</StyledTableCell>
                        <StyledTableCell align="right">{row.date.slice(0,10)}</StyledTableCell>
                        <StyledTableCell align="right">{row.description}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
                </Paper>
            </div>
          );
        }).catch(err => {
            // Handle error by displaying something else
        });
      }
    // Call the function
    getAllExpenses(props.user.id);
}    


// Create function that returs display for reimbursements not found