import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import {createTheme} from "@mui/material/styles";
import {MuiThemeProvider} from "@material-ui/core";

const theme = createTheme({
    palette: {
        primary: {
            main: '#000d37'
        }
    }
});

ReactDOM.render(
    <React.StrictMode>
        <MuiThemeProvider theme={theme}>
            <App/>
        </MuiThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);