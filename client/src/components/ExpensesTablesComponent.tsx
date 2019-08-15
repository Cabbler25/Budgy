import React, { useState, useEffect, Fragment } from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Link, Input } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { pencilTool, pencilPath, removeTool, removePath, undoTool, undoPath, okTool, okPath } from '../assets/Icons';
import { TextField } from 'material-ui';

/*
TODO: 
- If user clicks on update or delete buttons, show a dialog that says
are you sure?
- Prevent column for resizing when is in edit mode and the Input field pops up in the cells
*/

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


export function ExpensesTable(props: any) {
  // Declare the boolean that will change the display of the row from read only to write
  const [editableRow,setEditableRow] = useState(false);
  // Define the row to be edited by its key in the table, in order to enable edition only
  // in the clicked row
  const [editableRowKey,setEditableRowKey] = useState(0);
  // Define state and its update method to track changes of the editable expense row
  const [state, setState] = React.useState({});
  // Button used to enable edit fields in the table
  function handleEditButton(expense:any) {
    // Define the expense that's going to be edited
    setState(expense);
    // This will change the view of the row from read to write mode
    setEditableRow(true);
  }
  // Function that listens for changes on any of the expenses
  const handleEditedExpenseChange = (event:any) => 
  {
    setState({ ...state, 
      [event.target.name]: event.target.value
    });
  };
  // Define table styles
  const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
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
// Define style of each column

const columnStyle = { marginRight: '2px', marginLeft: 'auto' };
  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell style={columnStyle}>amount (usd)</StyledTableCell>
                {props.view ? 
                <Fragment></Fragment>
                :
                <Fragment>
                  <StyledTableCell style={columnStyle}>type</StyledTableCell>
                  <StyledTableCell style={columnStyle}>date</StyledTableCell>
                </Fragment>
                }
                <StyledTableCell style={columnStyle}>description</StyledTableCell>
                <StyledTableCell style={columnStyle}></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.expenses.map((row: any) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {
                    // Check if row is in editable mode
                    (editableRow && editableRowKey === row.id) ?
                    <Input 
                    type="number"
                    defaultValue={row.amount}
                    name="amount"
                    onChange={(e:any)=>handleEditedExpenseChange(e)}/> :
                    row.amount
                  }
                </StyledTableCell>
                {
                  props.view ? <Fragment></Fragment>:
                  <Fragment>
                    <StyledTableCell>{row.expenseType.type}</StyledTableCell>
                    <StyledTableCell>{row.date.slice(0, 10)}</StyledTableCell>
                  </Fragment>
                }
                <StyledTableCell component="th" scope="row">
                {
                    // Check if row is in editable mode
                    (editableRow && editableRowKey === row.id) ?
                    <Input 
                    defaultValue={row.description}
                    name="description"
                    onChange={(e:any)=>handleEditedExpenseChange(e)}/> :
                    row.description
                  }
                </StyledTableCell>
                  {
                    // Switch between edit button and OK button
                    // Switch from delete button to undo button
                    (editableRow && editableRowKey===row.id)  ?
                    // If row is in edit mode
                    <Fragment>
                      <StyledTableCell>
                        <Button onClick={() => {props.updateExpense(state)
                                                setEditableRow(false);
                                                setEditableRowKey(0);}}>
                          <svg xmlns={okTool}  width="24" height="24" viewBox="0 0 24 24">
                          <path d={okPath}/>
                          </svg>
                        </Button>
                        {/* Assign the onClick function to notify the parent which expense
                        will be deleted */}
                        <Button onClick={() => {
                          setEditableRow(false);
                          setEditableRowKey(0);
                          setState(row);
                          }}>
                          <svg xmlns={undoTool}  
                          width="24" height="24" viewBox="0 0 24 24">
                          <path d={undoPath}/>
                          </svg>
                        </Button>
                      </StyledTableCell>
                    </Fragment>
                    :
                    <Fragment>
                      <StyledTableCell>
                        <Button onClick={() => {handleEditButton(row);setEditableRowKey(row.id);}}>
                          <svg xmlns={pencilTool}  
                          width="24" height="24" viewBox="0 0 24 24">
                          <path d={pencilPath}/>
                          </svg>
                        </Button>
                        {/* Assign the onClick function to notify the parent which
                        expense will be deleted */}
                        <Button onClick={() => props.deleteExpense(row)}>
                          <svg xmlns={removeTool}  
                          width="24" height="24" viewBox="0 0 24 24">
                          <path d={removePath}/>
                          </svg>
                        </Button>
                      </StyledTableCell>
                    </Fragment>
                  }
              </StyledTableRow>
            ))
            }
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}