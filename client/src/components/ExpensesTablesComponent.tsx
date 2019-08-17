import { Card, CardContent, Dialog, DialogActions, DialogContent, Input, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { Fragment, useState } from 'react';
import { okPath, okTool, pencilPath, pencilTool, removePath, removeTool, undoPath, undoTool } from '../assets/Icons';
import colors from '../assets/Colors';

/*
TODO: 
- If user clicks on update button, show a dialog that says
confirm changes OK - Cancel
- Solve undo button issue
- Add editable feature to the date like the other fields
- Try adding monthly checkbox, that will display only expenses for current month
- Instead of delete expense, should be pay expense (so the payment should be 
  deducted from budget of the specific type)
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

// const StyledTableRow = withStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       '&:nth-of-type(odd)': {
//         backgroundColor: theme.palette.background.paper,
//       },
//     },
//   }),
// )(TableRow);


export function ExpensesTable(props: any) {
  // Declare the boolean that will change the display of the row from read only to write
  const [editableRow, setEditableRow] = useState(false);
  // Define the row to be edited by its key in the table, in order to enable edition only
  // in the clicked row
  const [editableRowKey, setEditableRowKey] = useState(0);
  // Define state and its update method to track changes of the editable expense row
  const [state, setState] = useState();
  // This constant is used to logically display the about to delete dialog
  const [aboutToDelete, setAboutToDelete] = useState(false);
  // Define the appereance of the confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState(false);
  // Button used to enable edit fields in the table
  function handleEditButton(expense: any) {
    // Define the expense that's going to be edited
    setState(expense);
    // This will change the view of the row from read to write mode
    setEditableRow(true);
  }
  // Function used to close the confirm deletion dialog in case user decides not
  // to delete the expense
  function deleteStatus(status: boolean) {
    if (status) {
      setAboutToDelete(false);
      setConfirmDialog(false);
      props.deleteExpense(state);
    } else {
      setAboutToDelete(status);
      setConfirmDialog(status);
    }
  }
  // Function that listens for changes on any of the expenses
  const handleEditedExpenseChange = (event: any) => {
    setState({
      ...state,
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
        width: props.view ? "100%" : "80?",
        textAlign: "center",
        background: "rgba(10,180,140,0.3)"
      },
    }),
  );
  // Define card style that's going to appear when an expense is about to be deleted
  const cardStyles = makeStyles({
    card: {
      minWidth: '80%',
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

  const classes = useStyles(props);
  const cardClasses = cardStyles();
  // Define style of each column

  const columnStyle = { marginRight: '2px', };
  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell
                style={columnStyle}
                size='small'
              >amount (usd)</StyledTableCell>
              {props.view ?
                <Fragment></Fragment>
                :
                <Fragment>
                  <StyledTableCell style={columnStyle}>pay on</StyledTableCell>
                </Fragment>
              }
              <StyledTableCell style={columnStyle}>description</StyledTableCell>
              <StyledTableCell style={columnStyle}></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.expenses.map((row: any) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row"
                  size='small'>
                  <Input
                    fullWidth={false}
                    disabled={(editableRow && (editableRowKey === row.id)) ? false : true}
                    style={{
                      fontSize: '13.3px',
                      color: (editableRow && (editableRowKey === row.id)) ? "black" : "grey"
                    }}
                    type="number"
                    defaultValue={row.amount}
                    name="amount"
                    onChange={(e: any) => handleEditedExpenseChange(e)} />
                </TableCell>
                {
                  props.view ? <Fragment></Fragment> :
                    <Fragment>
                      <TableCell>{row.date.slice(0, 10)}</TableCell>
                    </Fragment>
                }
                <TableCell component="th" scope="row">
                  <Input
                    fullWidth={false}
                    disabled={(editableRow && (editableRowKey === row.id)) ? false : true}
                    style={{
                      fontSize: '13.3px',
                      color: (editableRow && (editableRowKey === row.id)) ? "black" : "grey"
                    }}
                    multiline={true}
                    defaultValue={row.description}
                    name="description"
                    onChange={(e: any) => handleEditedExpenseChange(e)} />
                </TableCell>
                {
                  // Switch between edit button and OK button
                  // Switch from delete button to undo button
                  (editableRow && editableRowKey === row.id) ?
                    // If row is in edit mode
                    <Fragment>
                      <TableCell>
                        <Button onClick={() => {
                          props.updateExpense(state);
                          setEditableRow(false);
                          setEditableRowKey(0);
                        }}>
                          <svg xmlns={okTool} width="24" height="24" viewBox="0 0 24 24">
                            <path d={okPath} />
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
                            <path d={undoPath} />
                          </svg>
                        </Button>
                      </TableCell>
                    </Fragment>
                    :
                    <Fragment>
                      <TableCell>
                        <Button onClick={() => { handleEditButton(row); setEditableRowKey(row.id); }}>
                          <svg xmlns={pencilTool}
                            width="24" height="24" viewBox="0 0 24 24">
                            <path d={pencilPath} />
                          </svg>
                        </Button>
                        {/* Assign the onClick function to notify the parent which
                        expense will be deleted */}
                        <Button
                          style={{ backgroundColor: colors.red }}
                          onClick={() => {
                            setConfirmDialog(true);
                            setState(row);
                            setAboutToDelete(true);
                          }}>
                          <svg fill={colors.offWhite} xmlns={removeTool}
                            width="24" height="24" viewBox="0 0 24 24">
                            <path d={removePath} />
                          </svg>
                        </Button>
                      </TableCell>
                    </Fragment>
                }
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
        {/* Display the delete confir delete dialog when the user clicks on the 
            delete icon. It shows the information of the expense before deleting
            it. User can select between cancel or delete. */}
        {
          aboutToDelete &&
          <Paper style={{ textAlign: "center" }}>
            <Dialog open={confirmDialog}>
              <DialogContent>
                You are about to delete the following expense:
                  <br /> <br />
                <Card className={cardClasses.card}>
                  <CardContent>
                    <Typography className={cardClasses.title}
                      color="textSecondary" gutterBottom>
                      amount:
                        </Typography>
                    <Typography variant="h6" component="h4">
                      ${state.amount}
                    </Typography>
                    <Typography className={cardClasses.title}
                      color="textSecondary" gutterBottom>
                      date:
                        </Typography>
                    <Typography variant="h6" component="h4">
                      {state.date.slice(0, 10)}
                    </Typography>
                    <Typography className={cardClasses.title}
                      color="textSecondary" gutterBottom>
                      description:
                        </Typography>
                    <Typography variant="h6" component="h4">
                      {state.description}
                    </Typography>
                  </CardContent>
                </Card>
                <br />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => deleteStatus(true)}
                  color="primary">
                  Delete
                    </Button>
                <Button
                  onClick={() => deleteStatus(false)}
                  color="secondary">
                  Cancel
                    </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        }
      </Paper>
    </div>
  );
}
