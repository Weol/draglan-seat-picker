import React from 'react'
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
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import validator from 'validator'
import {useNavigate, Navigate, Link} from "react-router-dom";
import config from "./api/config"

const theme = createTheme();

function parseJwt(jsonPayload) {
    let user = JSON.parse(jsonPayload);
    return {
        Id: user.id,
        Name: user.name,
        IsAdmin: user.is_admin,
        Token: user.token
    }
}

export default function SignIn(props) {
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)

        var email = data.get('email').toLowerCase()
        var password = data.get('password')

        if (email.length === 0 || password.length === 0) {
            props.SetMessage("warning", "Fyll inn alle feltene")
            return
        }

        if (!validator.isEmail(email)) {
            props.SetMessage("warning", "Vennligst skriv inn en ekte e-post adresse &#128580;")
            return
        }

        const hash = sha256(email + password)

        fetch(config.base_url + "login", {
            method: "POST",
            body: hash.toString(CryptoJS.enc.Hex)
        }).then(response => {
            if (response.status === 401) {
                props.SetMessage("warning", "Feil e-post eller passord")
            } else if (response.status !== 200) {
                props.SetMessage("error", "Noe gikk galt, prøv på nytt")
            } else {
                response.text().then(token => {
                    props.OnUserLoggedIn(parseJwt(token))
                    navigate("/")
                })
            }
        })
    };

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
                            component={Link}
                            to={"/signup"}
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Ny bruker
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider >
    );
}