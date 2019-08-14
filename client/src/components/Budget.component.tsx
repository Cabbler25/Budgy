import { Button, Divider, Paper } from '@material-ui/core';
import Axios from 'axios';
import React, { Fragment, useEffect, useState, createRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IState, IUiState, IUserState } from '../redux';
import DonutGraph from './data/DonutGraph';
import HorizontalBarGraph from './data/HorizontalBarGraph';
import { CreateBudgetStepper } from './forms/CreateBudgetStepper';
import { BarLoader } from 'react-spinners';


interface IBudgetProps {
  user: IUserState;
  ui: IUiState;
}

export function Budget(props: IBudgetProps) {
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
  const scrollRef = createRef();
  const scrollToRef = (ref: any) => { ref && window.scrollTo(0, ref.offsetTop) }

  useEffect(() => {
    setIsLoading(true);

    // Load budgets from db
    getAllBudgets();

    // Load budget types from db
    getAllTypes();
  }, [])

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
          setIsLoading(false);
        }
      }).catch((err: any) => {
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
    scrollToRef(scrollRef);
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

  async function handleElementClick(id: number) {
    const type = budgetTypes.find((type: any) => type.id == id);

    if (type) {
      const matchedBudgets = budgets.filter((budget: any) =>
        JSON.stringify(budget.budgetType) == JSON.stringify(type))
      console.log(matchedBudgets);
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Paper style={{ margin: '10px', display: 'inline-block', padding: '20px', paddingBottom: '30px' }}>
        <b>Budgets allow you to set goals, easily visualize your limits, and even earn </b>
        <Link to="/rewards">
          rewards!
        </Link>
        <br />
        <br />
        <Divider />
        <br />
        {!budgets ? (
          !isLoading ? (
            <Fragment>
              <h2>Creating a budget is quick and easy.<br />To get started,</h2>
              {isCreatingBudget ? (
                <CreateBudgetStepper
                  isMobileView={props.ui.isMobileView} userId={props.user.id}
                  types={budgetTypes} handleSubmit={createBudget} handleCancel={handleCancelCreate} />
              ) : (
                  <Button onClick={() => setIsCreatingBudget(true)} size="large" color="secondary">
                    Create a Budget
                  </Button>
                )}
            </Fragment>
          ) : (
              <div style={styles.loadingDiv}>
                <BarLoader width={150} color={'#009688'} loading={isLoading} />
              </div>
            )
        ) : (
            <Fragment>
              <h2>Here's your budget, {props.user.first}</h2>
              <i style={{ color: 'grey', fontSize: '14px' }}>Click a section of the pie to amend your budget.</i><br />
              {/* <DonutGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                isMobileView={props.ui.isMobileView}
                handleElementClick={handleElementClick} /> */}
              <HorizontalBarGraph data={createGraphData()} labels={createGraphLabels()} important='Emergency'
                isMobileView={props.ui.isMobileView}
                handleElementClick={handleElementClick} />
              {isCreatingBudget ? (
                <CreateBudgetStepper ref={scrollRef}
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
