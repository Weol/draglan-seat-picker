import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useHistory } from "react-router-dom";
import background from "./background.svg"
import green from "./green.svg"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, AlertTitle } from '@mui/material';

const row1 = []
row1.push({
	title: 1,
	top: 27.1,
	left: 36.9,
	width: 8.72,
	height: 2.3
})

for (let i = 1; i < 7; i++) {
	row1.push({
		title: row1[0].title + i,
		top: row1[0].top,
		left: row1[0].left + row1[0].width * i,
		width: row1[0].width,
		height: row1[0].height
	})
}

const row2 = []
row2.push({
	title: 1,
	top: row1[0].top + row1[0].height * 4,
	left: 36.9,
	width: 8.72,
	height: 2.3
})

for (let i = 1; i < 7; i++) {
	row2.push({
		title: row2[0].title + i,
		top: row2[0].top,
		left: row2[0].left + row2[0].width * i,
		width: row2[0].width,
		height: row2[0].height
	})
}

const staticSeats = new Map([
	["3114a607-b634-4995-998b-a481c2fe69ea", row1[0]],
	["eb08e098-bdd8-43e2-bb86-e94bd749431c", row1[1]],
	["1b08e098-bdd8-43e2-bb86-e94bd749431c", row1[2]],
	["2b08e098-bdd8-43e2-bb86-e94bd749431c", row1[3]],
	["3b08e098-bdd8-43e2-bb86-e94bd749431c", row1[4]],
	["4b08e098-bdd8-43e2-bb86-e94bd749431c", row1[5]],
	["5b08e098-bdd8-43e2-bb86-e94bd749431c", row1[6]],
	["3214a607-b634-4995-998b-a481c2fe69ea", row2[0]],
	["e308e098-bdd8-43e2-bb86-e94bd749431c", row2[1]],
	["1408e098-bdd8-43e2-bb86-e94bd749431c", row2[2]],
	["2508e098-bdd8-43e2-bb86-e94bd749431c", row2[3]],
	["3608e098-bdd8-43e2-bb86-e94bd749431c", row2[4]],
	["4708e098-bdd8-43e2-bb86-e94bd749431c", row2[5]],
	["5808e098-bdd8-43e2-bb86-e94bd749431c", row2[6]]
])

staticSeats.forEach((value, key) => {
	value.id = key
	value.top = value.top + "%"
	value.left = value.left + "%"
	value.width = value.width + "%"
	value.height = value.height + "%"
})

function SeatPicker(props) {
	const history = useHistory()

	const [pickSeatDialogOpen, setPickSeatDialogOpen] = React.useState(false);
	const [selectedSeat, setSelectedSeat] = React.useState({ id: "null", title: "null" });
	const [seats, setSeats] = useState(null);

	useEffect(() => {
		fetch('http://localhost:3000/api/seats')
			.then(response => response.json())
			.then(data => data.reduce(function (map, obj) {
				if (staticSeats[obj.id]) {
					map[obj.id] = staticSeats[obj.id]
					map[obj.id].id = obj.id
					map[obj.id].selectedUser = obj.user
					map[obj.id].selectedName = obj.name
				}
				return map;
			}, staticSeats))
			.then(data => setSeats(Array.from(data.values())))
	}, []);

	const handleClickOpenPickSeatDialog = (element) => {
		setPickSeatDialogOpen(true);
		setSelectedSeat({ id: element.target.id, title: element.target.title })
	};

	const handleClosePickSeatDialog = () => {
		setPickSeatDialogOpen(false);
	};

	const handleSeatPicked = () => {
		setPickSeatDialogOpen(false);

		console.log(props.User)
		fetch("http://localhost:3000/api/seats", {
			method: "POST",
			body: selectedSeat.id,
			headers: {
				'Auth': props.User.token,
				'Content-Type': "text/plain"
			},
		}).then(response => {
			if (response.status == 202) {
				props.SetMessage(
					<Alert severity="success">
						<AlertTitle>Du har valgt et plass nummer {selectedSeat.title}</AlertTitle>
					</Alert>
				)
			} else {
				props.SetMessage(
					<Alert severity="error">
						<AlertTitle>Http error {response.status}</AlertTitle>
					</Alert>
				)
			}
		})
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						DragLan
					</Typography>
					{props.User != null ? <Button color="inherit">{props.User.name}</Button> : <Button color="inherit" onClick={() => history.push("/signin")}>Login</Button>}
				</Toolbar>
			</AppBar>

			<Box sx={{
				display: "flex",
				position: "absolute",
				width: "100%",
				height: "calc(100% - 64px)",
				overflowY: "hidden",
			}}>
				<Box sx={{
					margin: "auto",
					height: "calc(100% - 2em)",
					position: "relative"
				}}>
					<img src={background} alt="" style={{
						width: "100%"
					}} />

					{seats && seats.forEach(seat => console.log(seat))}
					{seats && seats.map(seat => (
						<Box id={seat.id} key={seat.title} title={seat.title} onClick={handleClickOpenPickSeatDialog} sx={{
							position: "absolute",
							top: seat.top,
							left: seat.left,
							width: seat.width,
							height: seat.height,
							background: "url(" + green + ")",
							backgrondRepeat: "no-repeat",
							backgroundSize: "cover",
							cursor: "pointer"
						}}></Box>
					))}
				</Box>
			</Box>
			<Dialog open={pickSeatDialogOpen} onClose={handleClosePickSeatDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title" >
					{"Vil du velge sete nummer " + selectedSeat.title + "?"}
				</DialogTitle>
				<DialogActions >
					<Button onClick={handleClosePickSeatDialog}>Avbryt</Button>
					<Button onClick={handleSeatPicked}>Velg sete</Button>
				</DialogActions>
			</Dialog>
		</Box >
	)
}

export default SeatPicker;
