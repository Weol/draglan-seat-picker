import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import background from "./background.svg"
import {getSeats, reserve, unreserve} from "./api/seats"
import Seat from "./components/Seat";
import createSeats from "./StaticSeats"
import ConfirmDialog from "./components/ConfirmDialog";
import green from "./green.svg";
import red from "./red.svg";
import blue from "./blue.svg";

const staticSeats = () => createSeats(29.9, 36.9, 8.72, 2.5)

function SeatPicker(props) {
    const [seats, setSeats] = useState([])
    const [dialog, setDialog] = useState(false)

    useEffect(() => {
        fetchAllSeats()
    }, [])

    const fetchAllSeats = () => {
        getSeats(staticSeats, (data) => setSeats(data), (response) => props.SetMessage("error", "Noe gitt galt, prøv på nytt"))
    }

    const reserveSeat = (seat) => {
        if (!props.User) {
            props.SetMessage("warning", "Du må vær logga inn for å reserver et sete")
            return
        }

        if (seat.SelectedUser && seat.SelectedUser !== props.User.Id) {
            props.SetMessage("warning", "Sete nummer " + seat.Title + " er opptatt")
            return
        } else if (seat.SelectedUser && seat.SelectedUser === props.User.Id) {
            setDialog({
                Title: "Vil du gi fra deg sete nummer " + seat.Title + "?",
                Metadata: seat.Id,
                OnClose: () => setDialog(false),
                OnConfirm: (seat_id) => unreserve(seat_id, () => fetchAllSeats(), (response) => props.SetMessage("error", "Noe gikk galt, prøv på nytt"))
            })
        } else {
            setDialog({
                Title: "Vil du velge sete nummer " + seat.Title + "?",
                Metadata: seat.Id,
                OnClose: () => setDialog(false),
                OnConfirm: (seat_id) => reserve(seat_id, () => fetchAllSeats(), (response) => props.SetMessage("error", "Noe gikk galt, prøv på nytt"))
            })
        }
    }

    const getColor = (seat) => {
        if (props.User && seat.SelectedUser === props.User.Id) {
            return blue
        } else if (!seat.SelectedUser) {
            return green
        }
        return red
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <Box sx={{
                display: "flex",
                position: "absolute",
                width: "100%",
                height: "calc(100% - 64px)",
                overflowX: "hidden",
            }}>
                <Box sx={{
                    marginTop: "1em",
                    marginBottom: "auto",
                    marginLeft: "auto",
                    marginRight: "auto",
                    position: "relative"
                }}>
                    <img src={background} alt="" style={{
                        width: "100%"
                    }}/>

                    {seats && seats.map(seat => <Seat key={seat.Id} Seat={seat} Color={getColor(seat)} OnClick={reserveSeat}/>)}
                </Box>
            </Box>
            {dialog && <ConfirmDialog
                Title={dialog.Title}
                Metadata={dialog.Metadata}
                OnClose={dialog.OnClose}
                OnConfirm={dialog.OnConfirm}
            />}
        </Box>
    )
}

export default SeatPicker;
