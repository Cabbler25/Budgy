import React from 'react';
import { Paper, Button } from '@material-ui/core';

interface ILandingProps {

}

function Landing(props: any) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Paper style={{ display: 'inline-block', padding: '50px' }}>
        <h1>Project 2</h1>
        <Button variant='contained' color='secondary'>Get Started</Button>
      </Paper>
    </div>
  )
}

export default Landing;