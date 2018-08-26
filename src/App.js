import React, { Component } from 'react';
import RootRouter from './routes/route';
import { createStore } from 'redux';
import {Provider} from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AllReducers from './reducers/';
import { composeWithDevTools } from 'redux-devtools-extension';

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#1565C0',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contast with palette.primary.main
        },
        secondary: {
            light: '#0066ff',
            main: '#0044ff',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffcc00',
        },
        // error: will use the default color
    },
});

const Store = createStore(AllReducers,composeWithDevTools());
class App extends Component {
  render() {
    return (
        <Provider store={Store}>
            <MuiThemeProvider theme={theme}>
               <RootRouter/>
            </MuiThemeProvider>
        </Provider>
    );
  }
}

export default App;
