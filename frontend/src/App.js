import React, {useState} from 'react'
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Cookies from 'universal-cookie';
import './App.css';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import {Alert, AlertTitle, Snackbar} from '@mui/material';
import SeatPicker from './SeatPicker.js';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import {Button, Typography} from '@mui/material'
import UserProfileButton from "./components/UserProfileButton";
import Box from "@mui/material/Box";

const cookies = new Cookies();

function App() {
    const [user, setUser] = useState(cookies.get('user'));
    const [message, setMessage] = useState(null);

    const doSetMessage = (type, message) => {
        setMessage({Type: type, Message: message})
    }

    const logout = () => {
        cookies.remove("user")
        setUser(null)
    }

    const onUserLoggedIn = (user) => {
        cookies.set("user", user, {path: "/"})
        setUser(user)
    }

    return (
        <BrowserRouter>
            <Snackbar anchorOrigin={{vertical: "top", horizontal: "center"}} autoHideDuration={6000}
                      open={message != null} onClose={() => setMessage(null)}>
                {message && <Alert severity={message.Type}>
                    <AlertTitle>{message.Message}</AlertTitle>
                </Alert>}
            </Snackbar>
            <AppBar position="static">
                <Toolbar>
                        <Link to="/" style={{textDecoration: 'none', flexGrow: 1, color: "inherit"}}>
                            <Typography variant="h6" component="div">
                                DragLan
                            </Typography>
                        </Link>
                    {user != null ? <UserProfileButton Logout={logout} User={user}/> :
                        <Button component={Link} to="/signin" color="inherit">Login</Button>}
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/signin"
                       element={<SignIn SetMessage={doSetMessage} User={user} OnUserLoggedIn={onUserLoggedIn}/>}/>
                <Route path="/signup" element={<SignUp SetMessage={doSetMessage} User={user}/>}/>
                <Route path="/" element={<SeatPicker User={user} SetMessage={doSetMessage}/>}/>
            </Routes>
        </BrowserRouter>)
}

export default App;
