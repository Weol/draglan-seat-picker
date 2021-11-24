import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import {Tooltip} from "@material-ui/core";

export default function Seat(props) {
    return (
        <Tooltip title={props.Seat.SelectedName || ""}>
            <Box Id={props.Seat.Id} Title={props.Seat.Title} onClick={() => props.OnClick(props.Seat)} sx={{
                position: "absolute",
                top: props.Seat.Top,
                left: props.Seat.Left,
                width: props.Seat.Width,
                height: props.Seat.Height,
                background: "url(" + props.Color + ")",
                backgrondRepeat: "no-repeat",
                backgroundSize: "cover",
                cursor: "pointer",
                textAlign: "center",
                display: "flex"
            }}>
                <Typography variant="subtitle1" gutterBottom component="p"
                            sx={{lineHeight: 1, fontSize: "0.9rem", margin: "auto"}}>
                    {props.Seat.Title}
                </Typography>
            </Box>
        </Tooltip>)

}