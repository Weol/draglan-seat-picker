import React from "react";
import Cookies from "universal-cookie";
import config from "./config"
import sha256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";

const cookies = new Cookies();

export function signin(email, password, handler, failure) {
    const hash = sha256(email.toLowerCase() + password)

    fetch(config.base_url + "login", {
        method: "POST",
        body: hash.toString(CryptoJS.enc.Hex)
    }).then(response => {
        if (response.status !== 200) {
            throw "Http response " + response.status
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
    const hash = sha256(email.toLowerCase() + password)

    const body = JSON.stringify({
        id: hash.toString(CryptoJS.enc.Hex),
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
            throw "Http response " + response.status
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
