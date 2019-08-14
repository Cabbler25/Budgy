import React, { useState, useEffect, Fragment } from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Link, Button } from '@material-ui/core';
import { pencilTool } from '../assets/Icons';

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

export function ExpensesTable(props: any) {
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
                  edit
                </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.expenses.map((row: any) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.amount}
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
                  <svg xmlns={pencilTool}  width="24" height="24" viewBox="0 0 24 24">
                  <path d={`M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.
                        39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83
                        3.75 3.75 1.83-1.83z`}/>
                  </svg>
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
