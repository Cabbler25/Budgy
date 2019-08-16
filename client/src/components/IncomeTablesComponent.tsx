import React, { useState, useEffect, Fragment } from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Input, Dialog, DialogContent,Container, DialogActions } from '@material-ui/core';
import { pencilTool, pencilPath, removeTool, removePath, undoTool, undoPath, okTool, okPath } from '../assets/Icons';

import { Button } from '@material-ui/core';
import { TextField } from 'material-ui';

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



export function IncomesTable(props: any) {
  const [editRow, setEditRow] =useState(false);
  const [editRowKey, setEditRowKey] = useState(0);
  const [state, setState] = useState();
  const [confirmDialog, setConfirmDialog] = useState(false);
  
  function handleEditButton(income: any) {
    setState(income);
    setEditRow(true);
  }

  const handleEditedIncomeChange = (e: any) =>
  {
    setState({ ...state, [e.target.name]: e.target.value
    });
  }

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
      background:"rgba(10,180,140,0.3)"
    },
  }),
);
const classes = useStyles(props);
const columnStyle = { marginRight: '2px'}
/*
  useEffect(() => {
    createTable();
  }, [])

  // This function sends the request to get all user reimbursements
  function createTable() {
    setIncomes(props.incomes);
     //console.log(incomes);
  }
*/

  /*
  // Go back to the incomes component
  function handleBackButton() {
    // props.location.state.props.history.push("/incomes");
    props.changeType(0);
  }
*/

  //need to fix
  /*
  async function handleClickDelete(id: number) {
    const url = `http://localhost:8080/income/${id}`;
    await Axios.delete(url)
        .catch((err: any) => {
            //erros
        });
  }
  */
 
  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {/* 
              <StyledTableCell style={{ marginRight: '2px', marginLeft: 'auto' }}>
                amount (usd)
                </StyledTableCell>
              <StyledTableCell style={{ marginRight: '2px', marginLeft: 'auto' }}>
                type
                </StyledTableCell>
              <StyledTableCell style={{ marginRight: '2px', marginLeft: 'auto' }}>
                description
                </StyledTableCell>
              <StyledTableCell style={{ marginRight: '2px', marginLeft: 'auto' }}>
                edit
                </StyledTableCell>
                <StyledTableCell style={{ marginRight: '2px', marginLeft: 'auto' }}>
                delete
                </StyledTableCell> */}
                <StyledTableCell style={columnStyle} size='small'> Amount</StyledTableCell>
                {props.view ? <Fragment></Fragment> : <Fragment><StyledTableCell style={columnStyle}>Description</StyledTableCell> </Fragment>}
                <StyledTableCell style={columnStyle}></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/*
            {incomes.map((row: any) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row"> {row.amount}</StyledTableCell>
                <StyledTableCell>{row.incomeType.type}</StyledTableCell>
                <StyledTableCell>{row.description}</StyledTableCell>
                <StyledTableCell> <Button onClick={() =>props.updateIncome(row)}>update</Button></StyledTableCell>
                <StyledTableCell> <Button onClick={() =>props.deleteIncome(row)}>X</Button></StyledTableCell>

              </StyledTableRow>
            ))
            }
          */}
          {props.incomes.map((row: any) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row" size='small'>
                <Input fullWidth={false}
                    disabled={(editRow && (editRowKey === row.id)) ?false:true}
                    style={{fontSize:'13.3px',
                    color:(editRow && (editRowKey === row.id)) ?"black":"grey"}}
                    type="number"
                    defaultValue={
                      (editRow && (editRowKey === row.id)) ?state.amount:row.amount}
                    name="amount"
                    onChange={(e:any)=>handleEditedIncomeChange(e)}/>
              </TableCell>
              
              <TableCell component="th" scope="row">
                  <Input
                  fullWidth={false}
                  disabled={(editRow && (editRowKey === row.id)) ?false:true}
                  style={{fontSize:'13.3px',
                  color:(editRow && (editRowKey === row.id)) ?"black":"grey"}}
                  multiline={true}
                  defaultValue={
                    (editRow && (editRowKey === row.id)) ?state.description:row.description}
                  name="description"
                  onChange={(e:any)=>handleEditedIncomeChange(e)}/>
                </TableCell>
              {
                    // Switch between edit button and OK button
                    // Switch from delete button to undo button
                    (editRow && editRowKey===row.id)  ?
                    // If row is in edit mode
                    <Fragment>
                      <TableCell>
                        <Button onClick={() => {props.updateIncome(state);
                                                setEditRow(false);
                                                setEditRowKey(0);}}>
                          <svg xmlns={okTool}  width="24" height="24" viewBox="0 0 24 24">
                          <path d={okPath}/>
                          </svg>
                        </Button>
                        {/* Assign the onClick function to notify the parent which expense
                        will be deleted */}
                        <Button onClick={() => {
                          setEditRow(false);
                          setEditRowKey(0);
                          setState(row);
                          }}>
                          <svg xmlns={undoTool}  
                          width="24" height="24" viewBox="0 0 24 24">
                          <path d={undoPath}/>
                          </svg>
                        </Button>
                      </TableCell>
                    </Fragment>
                    :
                    <Fragment>
                      <TableCell>
                        <Button onClick={() => {handleEditButton(row);setEditRowKey(row.id);}}>
                          <svg xmlns={pencilTool}  
                          width="24" height="24" viewBox="0 0 24 24">
                          <path d={pencilPath}/>
                          </svg>
                        </Button>
                        {/* Assign the onClick function to notify the parent which
                        expense will be deleted */}
                        <Button 
                        onClick={() => {setConfirmDialog(true);
                                        setState(row);
                                        }}>
                          <svg xmlns={removeTool}  
                          width="24" height="24" viewBox="0 0 24 24">
                          <path d={removePath}/>
                          </svg>
                        </Button>
                        {
                          <Paper style={{textAlign: "center"}}>
                            <Container>
                              <Dialog open={confirmDialog}>
                              <DialogContent>
                              Are you sure?      
                              <br/>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={
                                    // Function call to send the request for creating new expense
                                    ()=>props.deleteIncome(row)
                                  }
                                  color="primary">
                                  Ok
                                </Button>
                                <Button
                                  onClick={()=>setConfirmDialog(false)}
                                  color="secondary">
                                  Cancel
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Container>
                        </Paper>
                        }
                      </TableCell>
                    </Fragment>
                  }
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
