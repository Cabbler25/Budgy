import './App.css';
import React, { Props } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme, Box } from '@material-ui/core';
import { Provider } from 'react-redux';
import { store } from './redux/Store';
import NavBar from './components/Navbar.component';
import Landing from './components/Landing.component';

// We will define our theme here
// All components will inherit from this
// https://material-ui.com/customization/themes/

const colors = {
  green: '#4CAF50',
  lightGreen: '#63b175',
  offWhite: '#FFFFFF',
  teal: '#009688'
}
const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.lightGreen
    },
    secondary: {
      main: colors.teal
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <div style={{ minHeight: '10px', height: '10px', backgroundColor: '#388E3C' }} />
        <NavBar />
        <br />
        <Router>
          <Route path="/" exact component={Landing} />
          {/* <Route path="/login" exact component={Home} />
           <Route path="/user" exact component={Home} />
            <Route path="/register" exact component={Home} /> */}
        </Router>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
