import React from 'react';
import { Paper } from '@material-ui/core';

export default function User(props: any) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Paper style={{ display: 'inline-block', padding: '50px' }}>
        <h1>User page</h1>
      </Paper>
    </div>
  );
}