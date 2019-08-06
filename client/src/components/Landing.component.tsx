import React from 'react';
import { Paper } from '@material-ui/core';

interface ILandingProps {

}

function Landing(props: any) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Paper style={{ display: 'inline-block', padding: '50px' }}>
        <h1>Project 2</h1>
      </Paper>
    </div>
  )
}

export default Landing;