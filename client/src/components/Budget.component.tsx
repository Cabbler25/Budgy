import { AppBar, Box, Button, createStyles, Divider, makeStyles, Paper, Tab, Tabs, Theme, Typography } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState, createRef } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { IState, IUiState, IUserState } from '../redux';
import DonutGraph from './data/DonutGraph';
import { CreateBudgetStepper } from './forms/CreateBudgetStepper';
import HorizontalBarGraph from './data/HorizontalBarGraph';
import colors from '../assets/Colors';
import VerticalBarGraph from './data/VerticalBarGraph';

interface HorizontalTabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface TabPanelProps {
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

function VerticalTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yHorizontalProps(index: any) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function a11yVerticalProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
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
  const [showDetails, setShowDetails] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState();

  useEffect(() => {
    if (showDetails) setShowDetails(false);
    // Load budget types from db
    getAllTypes();

    if (!props.user.isLoggedIn) return;
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
        }
        setIsLoading(false);
      }).catch((err: any) => {
        setIsLoading(false);
        // Handle error by displaying something else
      });
  }

  // Create budget in db
  async function createBudget(data: any) {
    setIsCreatingBudget(false);
    const url = `http://localhost:8080/budget`;
    await Axios.post(url, data)
      .then((payload: any) => {
        setBudgets(!budgets ? [data] : budgets.concat(data));
      }).catch((err: any) => {
        // Handle error by displaying something else
        alert('Something went wrong. Please try again.')
      });
  }

  function handleCreateBudget(e: any) {
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

      setBudgetCategory(matchedBudgets.sort((a: any, b: any) => b.amount - a.amount));
      setTabIndex(0);
      setShowDetails(true);
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {!props.user.isLoggedIn && <Redirect to="/login" />}
      <Paper style={{
        minWidth: !props.ui.isMobileView ? '800px' : undefined,
        margin: '10px', display: 'inline-block', padding: '20px', paddingBottom: '30px'
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
              {!showDetails ? (
                <Fragment>
                  <h2>Here's your monthly budget</h2>
                  <AppBar position="static">
                    <Tabs
                      centered={!props.ui.isMobileView}
                      value={tabIndex}
                      onChange={handlePanelChange}
                      variant={props.ui.isMobileView ? "fullWidth" : undefined}
                    >
                      <Tab style={{ color: colors.offWhite }} label="Donut Chart" {...a11yHorizontalProps(0)} />
                      <Tab style={{ color: colors.offWhite }} label="Bar Chart" {...a11yHorizontalProps(1)} />
                    </Tabs>
                  </AppBar>
                  <HorizontalTabPanel value={tabIndex} index={0}>
                    <i style={{ color: 'grey', fontSize: '14px' }}>Click a category to amend your budget.</i><br />
                    <DonutGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                      isMobileView={props.ui.isMobileView}
                      handleElementClick={handleElementClick} />
                  </HorizontalTabPanel>
                  <HorizontalTabPanel value={tabIndex} index={1}>
                    <i style={{ color: 'grey', fontSize: '14px' }}>Click a category to amend your budget.</i><br />
                    {props.ui.isMobileView ? (
                      <VerticalBarGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                        isMobileView={props.ui.isMobileView}
                        handleElementClick={handleElementClick} />
                    ) : (
                        <HorizontalBarGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                          isMobileView={props.ui.isMobileView}
                          handleElementClick={handleElementClick} />
                      )}
                  </HorizontalTabPanel>
                </Fragment>
              ) : (
                  <Fragment>
                    <Tabs
                      orientation="vertical"
                      variant="scrollable"
                      value={tabIndex}
                      onChange={handlePanelChange}
                      aria-label="Vertical tabs example"
                    >
                      {budgetCategory.map((budget: any, i: number) => (
                        <Tab key={i} label={`${budget.budgetType.type}: $${budget.amount}`} {...a11yVerticalProps(i)} />
                      ))}
                    </Tabs>
                    {budgetCategory.map((budget: any, i: number) => (
                      <VerticalTabPanel key={i} value={tabIndex} index={i}>
                        {budget.description}
                      </VerticalTabPanel>
                    ))}
                  </Fragment>
                )}
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
