import React from 'react';
import { Paper, Button, Divider } from '@material-ui/core';

interface IHomeProps { }

function Home(props: any) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Paper style={{ display: 'inline-block', padding: '50px' }}>
        <h1>Project 2</h1>
        <Divider variant='fullWidth'
          style={{ marginBottom: '20px' }} />
        <Button>Get Started</Button>
      </Paper>
      <div style={{ marginTop: '750px' }} />
      <Paper style={{ display: 'inline-block', padding: '50px', marginBottom: '50px' }}>
        <h2>..? another page down here?</h2>
      </Paper>
    </div>
  )
}

export default Home;