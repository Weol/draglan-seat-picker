import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Cookies from 'universal-cookie';
import './App.css';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import SeatPicker from './SeatPicker.js';

const cookies = new Cookies();

function App() {
	const [user, setUser] = useState(cookies.get('user'));

	function OnUserLoggedIn(user) {
		setUser(user)

		cookies.set('user', user, { path: '/' });
	}

	return (<Router>
		<Switch>
			<Route path="/signin">
				<SignIn />
			</Route>
			<Route path="/signup">
				<SignUp />
			</Route>
			<Route path="/">
				{user == null ? <SignIn /> : <SeatPicker />}
			</Route>
		</Switch>
	</Router>)
}

export default App;
