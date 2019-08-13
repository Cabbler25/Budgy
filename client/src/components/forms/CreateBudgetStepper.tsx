import React, { useState } from 'react'
import { Stepper, Step, StepLabel, Typography, Button, TextField, InputAdornment } from '@material-ui/core';

function getSteps() {
  return ['Describe your budget', 'Select a type', 'Set an amount'];
}

export function CreateBudgetStepper(props: any) {
  const [hasError, setHasError] = useState(false);
  // Desktop stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const [inputState, setInputState] = useState({
    type: 1,
    description: '',
    amount: 0
  })

  function handleInputChange(e: any) {
    setHasError(false);
    if (e.target.id == 'amount') {
      if (e.target.value == '') {
        setInputState({
          ...inputState,
          [e.target.id]: 0
        })
        return;
      }
    }
    setInputState({
      ...inputState,
      [e.target.id]: e.target.value
    })
  }

  function handleNext() {
    switch (activeStep) {
      case 0:
        if (inputState.description == '') setHasError(true);
        else setActiveStep(prevActiveStep => prevActiveStep + 1);
        break;
      case 2:
        if (inputState.amount === 0) setHasError(true);
        else setActiveStep(prevActiveStep => prevActiveStep + 1);
        break;
      default:
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        break;
    }
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function handleReset() {
    setActiveStep(0);
  }

  function handleSubmit() {
    handleReset();
    props.handleSubmit(props.types.find((type: any) => type.id == inputState.type),
      inputState.description,
      inputState.amount);
  }

  function handleCancel() {
    handleReset();
    props.handleCancel();
  }

  function getStepContent() {
    switch (activeStep) {
      case 0:
        return (
          <TextField
            error={hasError}
            style={{ width: '400px' }}
            id='description'
            value={inputState.description}
            label='Description'
            variant='outlined'
            onChange={handleInputChange}
          />
        );
      case 1:
        return (
          <TextField
            select
            id="type"
            label="Select type"
            value={inputState.type}
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            placeholder='Select type'
            onChange={handleInputChange}
          >
            {props.types.map((type: any) => (
              <option key={type.id} value={type.id}>{type.type}</option>
            ))}
          </TextField>
        );
      case 2:
        return (
          <TextField
            error={hasError}
            id='amount'
            value={inputState.amount}
            label='Amount'
            variant='outlined'
            type='number'
            InputProps={{
              startAdornment: <InputAdornment position="start" > $</InputAdornment>
            }}
            onChange={handleInputChange}
            helperText={hasError ? 'Amount must be greater than 0' : undefined}
          />
        );
      default:
        return (
          <div />
        );
    }
  }

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography>All set!</Typography>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        ) : (
            <div>
              {getStepContent()}
              <div style={{ marginTop: '10px' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  color='inherit'>
                  Back
                </Button>
                <Button style={{ marginLeft: '10px' }} variant="contained" color="secondary" onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
                <br />
                <Button onClick={handleCancel} variant='text' color="secondary" style={{ marginTop: '10px' }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
