import React from "react";
import Cookies from "universal-cookie";
import config from "./config"
import sha256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";

const cookies = new Cookies();

export function signin(email, password, handler, failure) {
    const emailHash = sha256(email.toLowerCase())
    const passwordHash = sha256(password)

    const body = JSON.stringify({
        id: emailHash.toString(CryptoJS.enc.Hex),
        password: passwordHash.toString(CryptoJS.enc.Hex)
    })

    fetch(config.base_url + "login", {
        method: "POST",
        body: body
    }).then(response => {
        if (response.status !== 200) {
            throw response
        }
        return response.json()
    }).then(raw => {
        let user = {
            Id: raw.id,
            Name: raw.name,
            IsAdmin: raw.is_admin,
            Token: raw.token
        }

        cookies.set("user", user, {path: "/"})

        handler && handler(user);
    }).catch((error) => {
        console.error(error);
        failure && failure(error)
    })
}

export function signup(email, password, name, handler, failure) {
    const emailHash = sha256(email.toLowerCase())
    const passwordHash = sha256(password)

    const body = JSON.stringify({
        id: emailHash.toString(CryptoJS.enc.Hex),
        password: passwordHash.toString(CryptoJS.enc.Hex),
        name: name
    })

    fetch(config.base_url + "signup", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }).then(response => {
        if (response.status !== 202) {
            throw response
        }
        handler && handler()
    }).catch((error) => {
        console.error(error);
        failure && failure(error)
    })
}

export function logout() {
    cookies.remove("user", {path: "/"})
}
