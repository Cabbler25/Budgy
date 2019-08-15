import React, { useState, useEffect } from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Axios from 'axios'

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
      margin: "auto"
    },
    table: {
      minWidth: 700,
      textAlign: "center"
    },
  }),
);

export function IncomesTable(props: any) {
  const classes = useStyles(props);
  const [incomes, setIncomes] = useState([]);


  useEffect(() => {
    createTable();
  }, [])

  // This function sends the request to get all user reimbursements
  function createTable() {
    setIncomes(props.incomes);
     //console.log(incomes);
  }
  // Go back to the incomes component
  function handleBackButton() {
    // props.location.state.props.history.push("/incomes");
    props.changeType(0);
  }

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
                </StyledTableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {incomes.map((row: any) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row"> {row.amount}</StyledTableCell>
                <StyledTableCell>{row.incomeType.type}</StyledTableCell>
                <StyledTableCell >{row.description}</StyledTableCell>
                <StyledTableCell> <Button>{row.id}</Button></StyledTableCell>
                <StyledTableCell> <Button onClick={() =>props.deleteIncome(row)}>X</Button></StyledTableCell>
              </StyledTableRow>
            ))
            }
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
