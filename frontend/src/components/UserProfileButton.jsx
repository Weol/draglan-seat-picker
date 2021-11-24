import Button from "@mui/material/Button";
import React from "react";
import Box from "@mui/material/Box";

export default function UserProfileButton(props) {
    return (
        <Box>
            <Button color="inherit">Logget inn som {props.User.Name}</Button>
            <Button variant="contained" color="error" onClick={props.Logout} sx={{marginLeft: "1em"}}>
                Logout
            </Button>
        </Box>
    )
}
