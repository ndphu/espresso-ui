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
    
    timeDifference(current, previous) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            const secCount = Math.round(elapsed/1000)
            if (secCount == 0) {
                return "Just now"
            } else if (secCount == 1) {
                return '1 second ago';
            } else {
                return secCount + ' seconds ago';
            }
        }

        else if (elapsed < msPerHour) {
            const minCount = Math.round(elapsed/msPerMinute)
            return minCount > 1 ? (minCount + ' minutes ago') : "1 minute ago";   
        }

        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + ' hours ago';   
        }

        else if (elapsed < msPerMonth) {
            return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
        }

        else if (elapsed < msPerYear) {
            return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
        }

        else {
            return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
        }
    }

    render() {
        return (<div></div>)
    }


}

export default Helper