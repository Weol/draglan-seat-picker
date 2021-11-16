import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Divider } from '@mui/material';
import { useHistory } from "react-router-dom";
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import Cookies from 'universal-cookie';
import { Redirect } from "react-router-dom";
import { Alert } from '@mui/material';
import validator from 'validator'

const theme = createTheme();
const cookies = new Cookies();

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    let user = JSON.parse(jsonPayload);
    user.token = token
    return user
};


export default function SignIn(props) {
    const history = useHistory()

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)

        var email = data.get('email')
        var password = data.get('password')

        if (email.length == 0 || password.length == 0) {
            props.SetMessage(
                <Alert severity="warning">
                    Fyll inn alle feltene
                </Alert>
            )
            return
        }

        if (!validator.isEmail(email)) {
            props.SetMessage(
                <Alert severity="warning">
                    Venligst skriv inn en ekte e-post adresse &#128580;
                </Alert>
            )
            return
        }

        const hash = sha256(email + password)

        fetch("http://localhost:3000/api/login", {
            method: "POST",
            body: hash.toString(CryptoJS.enc.Hex)
        }).then(response => {
            if (response.status == 401) {
                props.SetMessage(
                    <Alert severity="warning">
                        Feil e-post eller passord
                    </Alert>
                )
            } else if (response.status != 200) {
                props.SetMessage(
                    <Alert severity="error">
                        Noe gikk galt
                    </Alert>
                )
            } else {
                response.text().then(token => {
                    props.OnUserLoggedIn(parseJwt(token))
                    history.push("/")
                })
            }
        })
    };

    if (props.User != null) return <Redirect to="/" />

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {props.children}
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Logg inn
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="E-post adresse"
                            name="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Passord"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Logg inn
                        </Button>
                        <Divider />
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => {
                                history.push("/signup")
                            }}
                        >
                            Ny bruker
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider >
    );
}