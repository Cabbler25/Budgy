import { Button, Divider, Paper } from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IState, IUiState, IUserState } from '../redux';
import { CreateBudgetStepper } from './forms/CreateBudgetStepper';
import CircleGraph from './data/CircleGraph';
import { elementType } from 'prop-types';
import Axios from 'axios';

interface IBudgetProps {
  user: IUserState;
  ui: IUiState;
}

export function Budget(props: IBudgetProps) {
  // State for creation
  const [isCreatingBudget, setIsCreatingBudget] = useState(false);
  // Hold all budgets
  const [budgets, setBudgets] = useState([{
    budgetType: {
      id: 0,
      type: ''
    },
    description: '',
    amount: 0
  }]);

  const [budgetTypes, setBudgetTypes] = useState([]);

  useEffect(() => {

    // Load budget types from db
    let url = `http://localhost:8080/budget/user/${props.user.id}`;
    Axios.get(url)
      .then((payload: any) => {
        if (payload.data.length != 0) {
          setBudgets(payload.data);
        }
      }).catch((err: any) => {
        // Handle error by displaying something else
      });

    // Load budgets from db
    url = `http://localhost:8080/budget/types`;
    Axios.get(url)
      .then((payload: any) => {
        setBudgetTypes(payload.data);
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
  }, [])

  // Create budget in db
  function createBudget(type: any, descr: string, amount: number) {
    const data = {
      userId: props.user.id,
      budgetType: type,
      description: descr,
      amount: Number(amount)
    }

    const url = `http://localhost:8080/budget`;
    Axios.post(url, data)
      .then((payload: any) => {
      }).catch((err: any) => {
        // Handle error by displaying something else
      });
    setBudgets(budgets[0].budgetType.id === 0 ? [data] : budgets.concat(data));
    setIsCreatingBudget(false);
  }

  function handleCancelCreate() {
    setIsCreatingBudget(false);
  }

  function createGraphData() {
    let data = budgetTypes.map((budgetType: any) => {
      return {
        y: 0,
        label: budgetType.type
      }
    })

    budgets.forEach((budget: any) => {
      for (let i = 0; i < data.length; i++) {
        if (budget.budgetType.type == data[i].label) {
          data[i].y += budget.amount;
          break;
        }
      }
    })

    return data.filter((element: any) => element.y > 0);
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Paper style={{ display: 'inline-block', padding: '20px' }}>
        <b>Budgets allow you to set goals, easily visualize your limits, and even earn </b>
        <Link to="/rewards">
          rewards!
        </Link>
        <br />
        <br />
        <Divider />
        <br />
        <br />
        {budgets[0].budgetType.id == 0 ? (
          <Fragment>
            <h2>Creating a budget is quick and easy.<br />To get started,</h2>
            {isCreatingBudget ? (
              <CreateBudgetStepper types={budgetTypes} handleSubmit={createBudget} handleCancel={handleCancelCreate} />
            ) : (
                <Button onClick={() => setIsCreatingBudget(true)} size="large" color="secondary">
                  Create a Budget
                </Button>
              )}
          </Fragment>
        ) : (
            <Fragment>
              <h2>Here's your budget, {props.user.first}</h2>
              <CircleGraph data={createGraphData()} />
              {isCreatingBudget ? (
                <CreateBudgetStepper types={budgetTypes} handleSubmit={createBudget} handleCancel={handleCancelCreate} />
              ) : (
                  <Fragment>
                    <br /> <b>Missing something?</b> <br />
                    <Button onClick={() => setIsCreatingBudget(true)} size="small" color="secondary">
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

// Redux
// Needed state
const mapStateToProps = (state: IState) => {
  return {
    user: state.user,
    ui: state.ui
  }
}

export default connect(mapStateToProps)(Budget);
