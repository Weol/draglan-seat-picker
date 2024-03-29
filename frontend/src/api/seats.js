﻿import React from "react";
import Cookies from "universal-cookie";
import config from "./config"

const cookies = new Cookies();

export function getSeats(seats, handler, failure) {
    fetch(config.base_url + 'seats')
        .then(response => {
            if (response.status !== 200) {
                throw response
            }
            return response.json()
        })
        .then(data => data.reduce((list, obj) => {
            let value = list.find(x => x.Id === obj.id)
            if (value && value.Id === obj.id) {
                value.SelectedUser = obj.user
                value.SelectedName = obj.name
            }
            return list
        }, [... seats()]))
        .then(data => handler && handler(data))
        .catch((error) => {
            console.error(error);
            failure && failure(error)
        })
}

export function reserve(seat_id, handler, failure) {
    let user = cookies.get("loggedInUser", {path: "/"})

    fetch(config.base_url + "seats", {
        method: "post",
        body: seat_id,
        headers: {
            'Auth': user.Token,
            'Content-Type': "text/plain"
        },
    }).then(response => {
        if (response.status !== 202) {
            throw response
        }
        return response
    }).then(response=> {
        handler && handler(response)
    }).catch((error) => {
        console.error(error);
        failure && failure(error)
    })
}

export function unreserve(seat_id, handler, failure) {
    let user = cookies.get("loggedInUser", {path: "/"})

    fetch(config.base_url + "seats/" + seat_id, {
        method: "delete",
        headers: {
            'Auth': user.Token,
        },
    }).then(response => {
        if (response.status !== 200) {
            throw response
        }
        return response
    }).then(response => {
        handler && handler(response)
    }).catch((error) => {
        console.error(error);
        failure && failure(error)
    })
}
