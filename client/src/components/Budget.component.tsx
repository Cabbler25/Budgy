import { Button, Divider, Paper } from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IState, IUiState, IUserState } from '../redux';
import { CreateBudgetStepper } from './forms/CreateBudgetStepper';
import CircleGraph from './data/CircleGraph';
import { elementType } from 'prop-types';

interface IBudgetProps {
  user: IUserState;
  ui: IUiState;
}

export function Budget(props: IBudgetProps) {
  // State for creation
  const [isCreatingBudget, setIsCreatingBudget] = useState(false);
  // Hold all budgets
  const [budgets, setBudgets] = useState([{
    type: {
      id: 0,
      type: ''
    },
    description: '',
    amount: 0
  }]);

  const [budgetTypes, setBudgetTypes] = useState([
    {
      id: 1,
      type: 'Bills',
    },
    {
      id: 2,
      type: 'Food'
    },
    {
      id: 3,
      type: 'Emergency'
    },
    {
      id: 4,
      type: 'Entertainment'
    },
    {
      id: 5,
      type: 'Other'
    }
  ]);

  useEffect(() => {
    // Load budget types from db
    // Load budgets from db
    setBudgets([{
      type: {
        id: 1,
        type: 'Bills'
      },
      description: 'Test budget',
      amount: 25
    }, {
      type: {
        id: 3,
        type: 'Emergency'
      },
      description: 'Second test budget',
      amount: 100
    }]);
  }, [])

  function getBudgetTypes() {
    // setBudgetTypes();
  }

  // Create budget in db
  function createBudget(type: any, descr: string, amount: number) {
    const data = {
      type: type,
      description: descr,
      amount: Number(amount)
    }
    setBudgets(budgets[0].type.id === 0 ? [data] : budgets.concat(data));
    setIsCreatingBudget(false);
  }

  function handleCancelCreate() {
    setIsCreatingBudget(false);
  }

  // function createGraphData() {
  //   return budgets.map((budget: any) => {
  //     return ({
  //       key: budget.type,
  //       data: budget.amount
  //     });
  //   });
  // }

  function createGraphData() {
    let data = budgetTypes.map((type: any) => {
      return {
        y: 0,
        label: type.type
      }
    })

    budgets.forEach((budget: any) => {
      for (let i = 0; i < data.length; i++) {
        if (budget.type.type == data[i].label) {
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
        {budgets[0].type.id == 0 ? (
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
