import { Button, Divider, Paper } from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IState, IUiState, IUserState } from '../redux';
import { CreateBudgetStepper } from './forms/CreateBudgetStepper';
import CircleGraph from './data/CircleGraph';

interface IBudgetProps {
  user: IUserState;
  ui: IUiState;
}

export function Budget(props: IBudgetProps) {
  // State for creation
  const [isCreatingBudget, setIsCreatingBudget] = useState(false);
  // Hold all budgets
  const [budgets, setBudgets] = useState([{
    type: 0,
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

    // setBudgets([{
    //   type: 1,
    //   description: 'Test budget',
    //   amount: 25
    // }, {
    //   type: 3,
    //   description: 'Second test budget',
    //   amount: 100
    // }]);
  }, [])

  // Create budget in db
  function createBudget(type: number, descr: string, amount: number) {
    setIsCreatingBudget(false);
    if (budgets[0].type == 0) {
      setBudgets([{
        type: type,
        description: descr,
        amount: amount
      }])
    } else {
      setBudgets(budgets.concat({
        type: type,
        description: descr,
        amount: amount
      }));
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {console.log(budgets)};
      <Paper style={{ display: 'inline-block', padding: '20px 150px 150px 150px' }}>
        <b>Budgets allow you to set goals, easily visualize your spending and even earn </b>
        <Link to="/rewards">
          rewards!
        </Link>
        <br />
        <br />
        <Divider />
        <br />
        <br />
        {budgets[0].type == 0 ? (
          <Fragment>
            <h2>Creating a budget is quick and easy.<br />To get started, </h2>
            {isCreatingBudget ? (
              <CreateBudgetStepper types={budgetTypes} handleSubmit={createBudget} handleCancel={() => setIsCreatingBudget(false)} />
            ) : (
                <Button onClick={() => setIsCreatingBudget(true)} size="large" color="secondary">
                  Create a Budget
                </Button>
              )}
          </Fragment>
        ) : (
            <Fragment>
              <h2>Here's your budget, {props.user.first}</h2>
              <CircleGraph />
              {isCreatingBudget ? (
                <CreateBudgetStepper types={budgetTypes} handleSubmit={createBudget} handleCancel={() => setIsCreatingBudget(false)} />
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
