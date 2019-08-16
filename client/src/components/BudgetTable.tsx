import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import clsx from 'clsx';
import React, { Fragment } from 'react';
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog, Button } from '@material-ui/core';
import UpdateBudgetForm from './forms/UpdateBudgetForm';

interface HeadRow {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headRows: HeadRow[] = [
  { id: 'type', numeric: false, disablePadding: true, label: 'Type' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'amount', numeric: true, disablePadding: false, label: 'Amount ($)' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
          >
            {row.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  type: string;
  deleteSelection: () => void;
  updateSelection: () => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
              {props.type}
            </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      {numSelected > 0 &&
        <Fragment>
          {numSelected === 1 && (
            <Tooltip title="Update">
              <IconButton onClick={props.updateSelection} aria-label="update">
                <UpdateIcon />
              </IconButton>
            </Tooltip>)}
          <Tooltip title="Delete">
            <IconButton onClick={props.deleteSelection} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Fragment>}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      textAlign: 'initial'
    },
    table: {
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

export default function BudgetTable(props: any) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [updateData, setUpdateData] = React.useState();

  // Dialog
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
  const [openUpdateForm, setOpenUpdateForm] = React.useState(false);

  function handleCloseDelete() {
    setOpenDeleteConfirm(false);
  }

  function handleCloseUpdate() {
    setOpenUpdateForm(false);
  }

  if (!props.data) return <Fragment />;
  function handleSelectAllClick(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      const newSelecteds = props.data.map((n: any) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event: React.MouseEvent<unknown>, id: number) {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  }

  function handleChangePage(event: unknown, newPage: number) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  function handleDelete() {
    setOpenDeleteConfirm(true);
  }

  function handleUpdateClicked() {
    setUpdateData(props.data.find((budget: any) => budget.id === selected[0]));
    setOpenUpdateForm(true);
  }

  function handleSubmitUpdate(data: any) {
    props.handleUpdateBudget(data);
  }

  function deleteSelection() {
    handleCloseDelete();
    props.handleDeleteBudget(selected);
    setSelected([]);
  }


  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.data.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <UpdateBudgetForm
        open={openUpdateForm} data={updateData} types={props.types}
        handleClose={handleCloseUpdate} handleUpdate={handleSubmitUpdate} />
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDelete}
        aria-labelledby="confirm-delete"
        aria-describedby="confirm-delete-dialog"
      >
        <DialogTitle id="confirm-delete-title">{"Are you sure you want to delete selection?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-dialog">
            This action is irreversible and will delete all selected budgets. Continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="secondary">
            Cancel
          </Button>
          <Button onClick={deleteSelection} variant="text" autoFocus>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
      <EnhancedTableToolbar
        updateSelection={handleUpdateClicked}
        deleteSelection={handleDelete} type={props.data.budgetType ? props.data[0].budgetType.type : 'Budgets'}
        numSelected={selected.length} />
      <div className={classes.tableWrapper}>
        <Table
          size={props.isMobileView ? 'small' : 'medium'}
          className={classes.table}
          aria-labelledby="tableTitle"
        >
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={props.data.length}
          />
          <TableBody>
            {props.data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any, index: any) => {
                if (!props.data) return;
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.budgetType.type}
                    </TableCell>
                    <TableCell align={row.numeric ? 'right' : 'left'} >{row.description}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        style={{ padding: '0px' }}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={props.data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'previous page',
        }}
        nextIconButtonProps={{
          'aria-label': 'next page',
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      >
      </TablePagination>
    </div >
  );
}