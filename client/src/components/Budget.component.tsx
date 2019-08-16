import { AppBar, Box, Button, Divider, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import colors from '../assets/Colors';
import { IState, IUiState, IUserState } from '../redux';
import BudgetTable from './BudgetTable';
import DonutGraph from './data/DonutGraph';
import HorizontalBarGraph from './data/HorizontalBarGraph';
import VerticalBarGraph from './data/VerticalBarGraph';
import { CreateBudgetStepper } from './forms/CreateBudgetStepper';

interface HorizontalTabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface IBudgetProps {
  user: IUserState;
  ui: IUiState;
}

function HorizontalTabPanel(props: HorizontalTabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export function Budget(props: IBudgetProps) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const styles = {
    loadingDiv: {
      margin: props.ui.isMobileView ? '75px' : '150px',
      display: 'inline-block'
    }
  }

  const [isCreatingBudget, setIsCreatingBudget] = useState(false);
  const [budgets, setBudgets] = useState();
  const [budgetTypes, setBudgetTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState();

  useEffect(() => {
    if (!props.user.isLoggedIn) return;

    // Load budget types from db
    getAllTypes();

    setIsLoading(true);

    // Load budgets from db
    getAllBudgets();

  }, [props.user.isLoggedIn])

  function handlePanelChange(e: any, newValue: number) {
    setTabIndex(newValue);
  }

  async function getAllTypes() {
    const url = `http://localhost:8080/budget/types`;
    Axios.get(url)
      .then((payload: any) => {
        setBudgetTypes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }

  async function getAllBudgets() {
    const url = `http://localhost:8080/budget/user/${props.user.id}`;
    await Axios.get(url)
      .then((payload: any) => {
        if (payload.data.length != 0) {
          setBudgets(payload.data);
          setTableData(payload.data.sort((a: any, b: any) => {
            return b.budgetType.type < a.budgetType.type ? 1 : -1;
          }));
        }
        setIsLoading(false);
      }).catch((err: any) => {
        setIsLoading(false);
        // Handle error by displaying something else
      });
  }

  async function updateBudget(data: any) {
    setIsCreatingBudget(false);
    const url = `http://localhost:8080/budget`;
    await Axios.put(url, data)
      .then((payload: any) => {
        setIsLoading(false);
      }).catch((err: any) => {
        // Handle error by displaying something else
        alert('Something went wrong. Please try again.')
      });
  }

  // Create budget in db
  async function createBudget(data: any) {
    setIsCreatingBudget(false);
    setIsLoading(true);
    const url = `http://localhost:8080/budget`;
    await Axios.post(url, data)
      .then((payload: any) => {
        setBudgets(!budgets ? [payload.data] : budgets.concat(payload.data));
        setTableData(!tableData ? [payload.data] : tableData.concat(payload.data));
        setIsLoading(false);
      }).catch((err: any) => {
        // Handle error by displaying something else
        alert('Something went wrong. Please try again.')
      });
  }

  async function deleteBudget(id: number) {
    const url = `http://localhost:8080/budget/delete/${id}`;
    Axios.delete(url)
      .then((payload: any) => {
      }).catch((err: any) => {
        // Handle error by displaying something else
        alert('Something went wrong. Please try again.')
      });
  }

  function handleDeleteBudget(ids: number[]) {
    setIsLoading(true);

    ids.forEach(async (id: number) => await deleteBudget(id));
    let filtered = budgets.filter((budget: any) => !ids.includes(budget.id));
    setBudgets(filtered.length === 0 ? undefined : filtered)

    filtered = tableData.filter((budget: any) => !ids.includes(budget.id));
    filtered.length === 0 && setTabIndex(0);
    setTableData(filtered.length === 0 ? undefined : filtered)

    setIsLoading(false);
  }

  function handleUpdateBudget(data: any) {
    setIsLoading(true);
    updateBudget(data);

    let temp = budgets.map((budget: any) => {
      return budget.id === data.id ? data : budget;
    });
    setBudgets(temp);

    temp = tableData.map((budget: any) => {
      return budget.id === data.id ? data : budget;
    })
    setTableData(temp);
  }

  function handleCreateBudget() {
    setIsCreatingBudget(true);
  }

  function handleCancelCreate() {
    setIsCreatingBudget(false);
  }

  function createGraphData() {
    return budgets.map((i: any) => {
      return { key: i.budgetType.type, data: i.amount }
    });
  }

  function createGraphLabels() {
    return budgetTypes.map((i: any) => {
      return i.type;
    });
  }

  function handleElementClick(label: number) {

    const type = budgetTypes.find((type: any) => type.type == label);

    if (type) {
      const matchedBudgets = budgets.filter((budget: any) =>
        JSON.stringify(budget.budgetType) == JSON.stringify(type));

      setTableData(matchedBudgets.sort((a: any, b: any) => b.budgetType.type - a.budgetType.type));
      setTabIndex(2);
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {!props.user.isLoggedIn && <Redirect to="/login" />}
      <Paper style={{
        opacity: 0.85,
        width: props.ui.isMobileView ? '90%' : '55%',
        height: props.ui.isMobileView ? '95%' : '60%',
        maxWidth: '90%',
        maxHeight: '95%',
        margin: '10px auto', padding: '20px 10px 20px 10px'
      }}>
        {!budgets ? (
          <Fragment>
            <b>Budgets allow you to set goals, easily visualize your limits, and even earn </b>
            <Link to="/rewards">
              rewards!
          </Link>
            <br />
            <br />
            <Divider />
            <br />
            {!isLoading ? (
              <Fragment>
                <h2>Creating a budget is quick and easy.<br />To get started,</h2>
                {isCreatingBudget ? (
                  <CreateBudgetStepper
                    isMobileView={props.ui.isMobileView} userId={props.user.id}
                    types={budgetTypes} handleSubmit={createBudget} handleCancel={handleCancelCreate} />
                ) : (
                    <Button style={{ marginBottom: '10px' }} onClick={() => setIsCreatingBudget(true)} size="large" color="secondary">
                      Create a Budget
                  </Button>
                  )}
              </Fragment>
            ) : (
                <div style={styles.loadingDiv}>
                  <BarLoader width={150} color={'#009688'} loading={isLoading} />
                </div>
              )}
          </Fragment>
        ) : (
            <Fragment>
              <Fragment>
                <h2>Here's your monthly budget</h2>
                <AppBar position="static">
                  <Tabs
                    centered={!props.ui.isMobileView}
                    value={tabIndex}
                    onChange={handlePanelChange}
                    variant={props.ui.isMobileView ? "fullWidth" : undefined}
                  >
                    <Tab style={{ color: colors.offWhite }} label="Donut Chart" {...a11yProps(0)} />
                    <Tab style={{ color: colors.offWhite }} label="Bar Chart" {...a11yProps(1)} />
                    <Tab onClick={() => setTableData(budgets)} style={{ color: colors.offWhite }} label="Table" {...a11yProps(2)} />
                  </Tabs>
                </AppBar>
                <HorizontalTabPanel value={tabIndex} index={0}>
                  <Fragment>
                    <i style={{ color: 'grey', fontSize: '14px' }}>Click a category to amend your budget.</i> <br />
                    <DonutGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                      isMobileView={props.ui.isMobileView}
                      handleElementClick={handleElementClick} />
                  </Fragment>
                </HorizontalTabPanel>
                <HorizontalTabPanel value={tabIndex} index={1}>
                  <Fragment>
                    <i style={{ color: 'grey', fontSize: '14px' }}>Click a category to amend your budget.</i> <br />
                    {props.ui.isMobileView ? (
                      <VerticalBarGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                        isMobileView={props.ui.isMobileView}
                        handleElementClick={handleElementClick} />
                    ) : (
                        <HorizontalBarGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                          isMobileView={props.ui.isMobileView}
                          handleElementClick={handleElementClick} />
                      )}
                  </Fragment>
                </HorizontalTabPanel>
                <HorizontalTabPanel value={tabIndex} index={2}>
                  <i style={{ color: 'grey', fontSize: '14px' }}>Select a budget to make changes.</i> <br />
                  <BudgetTable data={tableData} isMobileView={props.ui.isMobileView} types={budgetTypes}
                    handleDeleteBudget={handleDeleteBudget}
                    handleUpdateBudget={handleUpdateBudget} />
                </HorizontalTabPanel>
              </Fragment>
              {isCreatingBudget ? (
                <CreateBudgetStepper
                  isMobileView={props.ui.isMobileView} userId={props.user.id}
                  types={budgetTypes} handleSubmit={createBudget} handleCancel={handleCancelCreate} />
              ) : (
                  <Fragment>
                    <br /> <b style={{ marginTop: '10px' }}>Missing something?</b> <br />
                    <Button
                      style={{ marginTop: '10px' }} size="small" color="secondary"
                      onClick={handleCreateBudget}>
                      Add another budget
                    </Button>
                  </Fragment>
                )}
            </Fragment>
          )}
      </Paper>
    </div >
  );
}

const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

export default connect(mapStateToProps)(Budget);
