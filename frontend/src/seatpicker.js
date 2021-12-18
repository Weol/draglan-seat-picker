import React, {useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import background from "./media/background.svg"
import {getSeats, reserve, unreserve} from "./api/seats"
import Seat from "./components/Seat";
import createSeats from "./StaticSeats"
import ConfirmDialog from "./components/ConfirmDialog";
import green from "./media/green.svg";
import red from "./media/red.svg";
import blue from "./media/blue.svg";
import besj from "./media/besj.svg";
import config from "./api/config"

const staticSeats = () => createSeats(29.9, 36.9, 8.72 + (8.72 * 2 / 5), 2.51)

function SeatPicker(props) {
    const [seats, setSeats] = useState([])
    const [dialog, setDialog] = useState(false)
    const [alreadySelected, setAlreadySelected] = useState(false)

    const wsRef = useRef(null)

    useEffect(() => {
        fetchAllSeats()
    }, [])

    const fetchAllSeats = () => {
        getSeats(staticSeats, (data) => {
            setSeats(data)
            setAlreadySelected(props.User && data.find(x => x.SelectedUser === props.User.Id))
        }, () => props.SetMessage("error", "Noe gitt galt, prøv på nytt"))
    }

    const reserveSeat = (seat) => {
        if (!props.User) {
            props.SetMessage("warning", "Du må vær logga inn for å reserver et sete")
            return
        }

        if (seat.SelectedUser && seat.SelectedUser !== props.User.Id) {
            props.SetMessage("warning", "Plass " + seat.Title + " er opptatt")
        } else if (alreadySelected && seat.SelectedUser === props.User.Id) {
            setDialog({
                Title: "Fjern reservasjon",
                Description: "Sikker på at du vil gi fra deg denne plassen?",
                Metadata: seat.Id,
                OnClose: () => setDialog(false),
                OnConfirm: (seat_id) => unreserve(seat_id, () => {
                    props.SetMessage("success", "Reservasjon fjernet")
                    fetchAllSeats()
                }, () => props.SetMessage("error", "Noe gikk galt, prøv på nytt"))
            })
        } else if (alreadySelected) {
            setDialog({
                Title: "Endre sete",
                Description: "Sikker på at du vil endre sete fra " + alreadySelected.Title + " til " + seat.Title + "?",
                Metadata: seat.Id,
                OnClose: () => setDialog(false),
                OnConfirm: (seat_id) => reserve(seat_id, () => {
                    props.SetMessage("success", "Reservasjon endret")
                    fetchAllSeats()
                }, () => props.SetMessage("error", "Noe gikk galt, prøv på nytt"))
            })
        } else {
            reserve(seat.Id, () => {
                props.SetMessage("success", "Plass reservert")
                fetchAllSeats()
            }, (status) => {
                switch (status) {
                    case 409:
                        props.SetMessage("warning", "Denne plassen var opptatt");
                        break;
                    default:
                        props.SetMessage("warning", "Noe gikk galt, vennligst prøv igjen")
                }
            })
        }
    }

    const getColor = (seat) => {
        if (props.User && seat.SelectedUser === props.User.Id) {
            return blue
        } else if (!seat.SelectedUser) {
            if (seat.TTL) {
                return besj
            } else {
                return green
            }
        }
        return red
    }

    const onSeatUnreserved = (seatId) => {
        let existingSeat = seats.find(x => x.Id === seatId)
        if (existingSeat != null) {
            existingSeat.SelectedUser = null
            existingSeat.SelectedName = null

            setSeats([...seats])
        }
    }

    const onSeatReserved = (seat) => {
        let existingSeat = seats.find(x => x.Id === seat.Id)
        if (existingSeat != null) {
            existingSeat.SelectedUser = seat.UserId
            existingSeat.SelectedName = seat.Name

            setSeats([...seats])
        }
    }

    useEffect(async () => {
        if (!wsRef.current) {
            let response = await fetch(config.base_url + "pubsub?userid=2")
            let data = await response.json()

            wsRef.current = new WebSocket(data.url)
        }

        wsRef.current.onmessage = event => {
            let message = JSON.parse(event.data)
            if (message.Type === "unreserved") {
                onSeatUnreserved(message.Payload)
            } else if (message.Type === "reserved") {
                onSeatReserved(message.Payload)
            }
        };
    })

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

                    {seats && seats.map(seat => <Seat key={seat.Id} Seat={seat} Color={getColor(seat)}
                                                      OnClick={reserveSeat}/>)}
                </Box>
            </Box>
            {dialog && <ConfirmDialog
                Title={dialog.Title}
                Metadata={dialog.Metadata}
                Description={dialog.Description}
                OnClose={dialog.OnClose}
                OnConfirm={dialog.OnConfirm}
            />}
        </Box>
    )
}

export default SeatPicker;
