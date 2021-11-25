import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import validator from 'validator'
import {Navigate, useNavigate} from "react-router-dom";
import config from "./api/config"

const theme = createTheme();

export default function SignUp(props) {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console

        var firstName = data.get('firstName')
        var lastName = data.get('lastName')
        var email = data.get('email').toLowerCase()
        var password = data.get('password')

        if (email.length === 0 || password.length === 0 || lastName.length === 0 || firstName.length === 0) {
            props.SetMessage("warning", "Vennligst fyll inn alle feltene")
            return
        }

        if (!validator.isEmail(email)) {
            props.SetMessage("warning", "Vennligst skriv inn en ekte e-post adresse &#128580;")
            return
        }

        if (password.length < 6) {
            props.SetMessage("warning", "Passordet ditt må være minst 6 tegn &#128548;")
            return
        }

        const name = firstName + " " + lastName
        const hash = sha256(email + password)

        const body = JSON.stringify({
            id: hash.toString(CryptoJS.enc.Hex),
            name: name
        })
        console.log(body)

        fetch(config.base_url + "signup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }).then(response => {
            if (response.status === 202) {
                props.SetMessage("success", "Din bruker er blitt opprettet")
                navigate("/")
            } else if (response.status === 409) {
                props.SetMessage("warning", "Denne e-post adressen er allerede registrert")
            } else {
                props.SetMessage("error", "Noe gikk galt, prøv på nytt")
            }
        })
    }

    if (props.User != null) return <Navigate to={"/"} />

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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Opprett ny bruker
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="Fornavn"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Etternavn"
                                    name="lastName"
                                    autoComplete="lname"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="E-post adresse"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Passord"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Opprett bruker
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
