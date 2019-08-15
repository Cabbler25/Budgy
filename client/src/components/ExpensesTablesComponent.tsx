import React, { useState, useEffect, Fragment } from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Link, Button } from '@material-ui/core';
import { pencilTool, pencilPath, removeTool, removePath } from '../assets/Icons';

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
        backgroundColor: theme.palette.background.paper,
      },
    },
  }),
)(TableRow);


// Listen for changes in the edited expense
function handleEditedExpenseChange (event:any) {
  
}

export function ExpensesTable(props: any) {
  // Declare the expense to be edited (one at a time) and its event listener
  const [editedExpense,setEditedExpense] = useState({});
  // Declare the boolean that will change the display of the row from read only to write
  const [editableRow,setEditableRow] = useState(false);

  // Button used to enable edit fields in the table
  function handleEditButton(expense:any) {
    // Define the expense that's going to be edited
    setEditedExpense(expense);
    setEditableRow(true);
    console.log(editedExpense);
  }
  const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      overflowX: 'auto',
      margin: "auto"
    },
    table: {
      width: props.view ? "100%" : "90?",
      textAlign: "center"
    },
  }),
);
const classes = useStyles(props);

  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ marginRight: '2px', marginLeft: 'auto' }}>
                amount (usd)
                </StyledTableCell>
                {props.view ? 
                <Fragment></Fragment>
                :
                <Fragment>
                  <StyledTableCell style={{ marginRight: '2px', marginLeft: 'auto' }}>
                    type
                    </StyledTableCell>
                  <StyledTableCell style={{ marginRight: '2px', marginLeft: 'auto' }}>
                    date
                    </StyledTableCell>
                </Fragment>
                }
              <StyledTableCell style={{ marginRight: '2px', marginLeft: 'auto' }}>
                description
                </StyledTableCell>
                <StyledTableCell style={{ marginRight: '2px', marginLeft: 'auto' }}>
                  
                </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.expenses.map((row: any) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {
                    row.amount
                  }
                </StyledTableCell>
                {
                  props.view ?
                  <Fragment></Fragment>
                  :
                  <Fragment>
                    <StyledTableCell>{row.expenseType.type}</StyledTableCell>
                    <StyledTableCell>{row.date.slice(0, 10)}</StyledTableCell>
                  </Fragment>
                }
                <StyledTableCell >{row.description}</StyledTableCell>
                <StyledTableCell>
                  <Button onClick={() => handleEditButton(row)}>
                    <svg xmlns={pencilTool}  width="24" height="24" viewBox="0 0 24 24">
                    <path d={pencilPath}/>
                    </svg>
                  </Button>
                  <Button onClick={() => props.deleteExpense(row)}>
                    <svg xmlns={removeTool}  width="24" height="24" viewBox="0 0 24 24">
                    <path d={removePath}/>
                    </svg>
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))
            }
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
