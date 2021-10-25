import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Cookies from 'universal-cookie';
import './App.css';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import { Snackbar } from '@mui/material';
import SeatPicker from './SeatPicker.js';

const cookies = new Cookies();

function App() {
	const [user, setUser] = useState(cookies.get('user'));
	const [message, setMessage] = useState(null);

	const onUserLoggedIn = (user) => {
		cookies.set("user", user)
		setUser(user)
	}

	return (
		<Router>
			<Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={6000} open={message != null} onClose={() => setMessage(null)}>
				{message && message}
			</Snackbar>
			<Switch>
				<Route path="/signin" render={() => <SignIn SetMessage={setMessage} User={user} OnUserLoggedIn={onUserLoggedIn} />} />
				<Route path="/signup" render={() => <SignUp SetMessage={setMessage} User={user} />} />
				<Route path="/">
					{user == null ? <Redirect to="/signin" /> : <SeatPicker />}
				</Route>
			</Switch>
		</Router >)
}

export default App;
