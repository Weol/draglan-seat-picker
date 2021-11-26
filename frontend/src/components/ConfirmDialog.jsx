import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";
import {DialogContent} from "@mui/material";
import {DialogContentText} from "@material-ui/core";

export default function (props) {
    const onConfirm = () => {
        props.OnClose()
        props.OnConfirm(props.Metadata)
    }

    return (
        <Dialog open={true} onClose={props.OnClose} aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                {props.Title}
            </DialogTitle>
            {props.Description && (
                <DialogContent>
                    {props.Description}
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={props.OnClose}>Avbryt</Button>
                <Button onClick={onConfirm}>Bekreft</Button>
            </DialogActions>
        </Dialog>
    )
}