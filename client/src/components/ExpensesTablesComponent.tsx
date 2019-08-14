import React, { useState, useEffect } from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Link, Button } from '@material-ui/core';

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
      marginTop: theme.spacing(2),
      overflowX: 'auto',
      margin:"auto"
    },
    table: {
      minWidth: 700,
      textAlign:"center"
    },
  }),
);

export function ExpensesTable(props:any) {
  const classes = useStyles(props);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    createTable();
  }, [])

  // This function sends the request to get all user reimbursements
  function createTable() {
    setExpenses(props.expenses);
    // console.log(expenses);
  }
  // Go back to the expenses component
  function handleBackButton() {
    // props.location.state.props.history.push("/expenses");
    props.changeType(0);
  }
  return (
    <div>
        <Button
          color="secondary"
          onClick={handleBackButton}>
            Back
            {/* <Link to="/expense">Back</Link>  */}
          </Button>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell style={{marginRight:'2px',marginLeft:'auto'}}>
                  amount (usd)
                </StyledTableCell>
                <StyledTableCell style={{marginRight:'2px',marginLeft:'auto'}}>
                  type
                </StyledTableCell>
                <StyledTableCell style={{marginRight:'2px',marginLeft:'auto'}}>
                  date
                </StyledTableCell>
                <StyledTableCell style={{marginRight:'2px',marginLeft:'auto'}}>
                  description
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((row: any) => (
                  <StyledTableRow key={row.amount}>
                    <StyledTableCell component="th" scope="row">
                      {row.amount}
                    </StyledTableCell>
                    <StyledTableCell>{row.expenseType.type}</StyledTableCell>
                    <StyledTableCell>{row.date.slice(0, 10)}</StyledTableCell>
                    <StyledTableCell >{row.description}</StyledTableCell>
                  </StyledTableRow>
                ))
              }
            </TableBody>
          </Table>
        </Paper>
    </div>
  );
}