import React, {Component} from 'react'


class Helper extends Component {
    constructor(props) {
        super(props)
    }

    putDevice(device) {
        return fetch("/esp/v1/device/" + device._id, {
            method: "PUT",
            body: JSON.stringify(device),
            hearders: {
                'Content-Type': 'application/json'
            }
        })
    }

    putGpioCommand(device, pin, state) {
        return fetch('/esp/v1/gpio_commands', {
            method: "POST",
            body: JSON.stringify({
                pin: pin,
                state: state == 1 ? true : false,
                targetDeviceId: device._id
            }),
            hearders: {
                'Content-Type': 'application/json'
            }
        })
    }

    deleteDevice(device) {
        return fetch("/esp/v1/device/" + device._id, {
            method: "DELETE"
        })
    }

    sendTextCommand(device, textCommand) {
        return fetch('/esp/v1/text_commands', {
            method: "POST",
            body: JSON.stringify({
                text: textCommand,
                targetDeviceId: device._id
            }),
            hearders: {
                'Content-Type': 'application/json'
            }
        })
    }


    render() {
        return (<div></div>)
    }
}

export default Helper