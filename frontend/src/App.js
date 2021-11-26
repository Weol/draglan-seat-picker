import React, {useState} from 'react'
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import Cookies from 'universal-cookie';
import SignIn from './signin';
import SignUp from './signup.js';
import SeatPicker from './seatpicker.js';
import {Alert, AlertTitle, AppBar, Button, Snackbar, Toolbar, Typography} from '@mui/material';
import UserProfileButton from "./components/UserProfileButton";
import {logout} from "./api/users"

const cookies = new Cookies();

function App() {
    const [user, setUser] = useState(cookies.get('user'));
    const [message, setMessage] = useState(null);

    const doSetMessage = (type, message) => {
        setMessage({Type: type, Message: message})
    }

    const onLogout = () => {
        logout()
        setUser(null)
    }

    return (
        <BrowserRouter>
            <Snackbar anchorOrigin={{vertical: "top", horizontal: "center"}} autoHideDuration={5000}
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
                    {user != null ? <UserProfileButton Logout={onLogout} User={user}/> :
                        <Button component={Link} to="/signin" color="inherit">Login</Button>}
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="/signin"
                       element={<SignIn SetMessage={doSetMessage} User={user} OnUserLoggedIn={setUser}/>}/>
                <Route path="/signup" element={<SignUp SetMessage={doSetMessage} User={user}/>}/>
                <Route path="/" element={<SeatPicker User={user} SetMessage={doSetMessage}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
