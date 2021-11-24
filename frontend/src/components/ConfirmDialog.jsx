import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";

export default function (props) {
    const onConfirm = () => {
        props.OnClose()
        props.OnConfirm(props.Metadata)
    }

    return (
        <Dialog open={true} onClose={props.OnClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                {props.Title}
            </DialogTitle>
            <DialogActions>
                <Button onClick={props.OnClose}>Avbryt</Button>
                <Button onClick={onConfirm}>Velg sete</Button>
            </DialogActions>
        </Dialog>
    )
}