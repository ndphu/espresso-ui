import React, {Component} from 'react'
import Websocket from 'react-websocket';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
class Events extends Component {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
            showCheckboxes: false,
            useWs: false,
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        fetch("/esp/v1/event/ir").then(result=>result.json()).then(json=>{
            this.setState({
                events: json
            })
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
            return Math.round(elapsed/msPerMinute) + ' minutes ago';   
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

    onServerMessage(data) {
        let msg = JSON.parse(data);
        switch (msg.type) {
            case "IR_EVENT_ADDED": {
                this.state.events.splice(0, 0, msg.payload)
                this.setState(this.state)
            }
        }
    }

    getWebsocketUrl() {
        return (location.protocol.indexOf("https") == 0 ? "wss://" : "ws://") + location.host + "/esp/v1/ws/events"
    }


    render() {
        var now = new Date().getTime()
        var eventRows = this.state.events.map(e => 
            <TableRow key={"key-event-row-id-" + e.id} >
                <TableRowColumn>{e.remoteName}</TableRowColumn>
                <TableRowColumn><b>{e.button}</b></TableRowColumn>
                <TableRowColumn>{e.repeat}</TableRowColumn>
                <TableRowColumn>{e.source}</TableRowColumn>
                <TableRowColumn>{this.timeDifference(now, e.unixTimestamp * 1000)}</TableRowColumn>
            </TableRow>
        )


        return (
            <Paper style={{margin:20}} zDepth={2}>
                {this.state.useWs ? (
                    <Websocket url={this.getWebsocketUrl()}
                    onMessage={this.onServerMessage.bind(this)}/>) : (
                    <div></div>
                    )
                }
                <Table selectable={false}>
                    <TableHeader adjustForCheckbox={this.state.showCheckboxes} displaySelectAll={this.state.showCheckboxes}>
                      <TableRow>
                        <TableHeaderColumn>Remote</TableHeaderColumn>
                        <TableHeaderColumn>Button</TableHeaderColumn>
                        <TableHeaderColumn>Repeat</TableHeaderColumn>
                        <TableHeaderColumn>Source</TableHeaderColumn>
                        <TableHeaderColumn>Timestamp</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody 
                        stripedRows={true} 
                        showRowHover={true} 
                        displayRowCheckbox={this.state.showCheckboxes}>
                        {eventRows}                  
                    </TableBody>
                </Table>
          </Paper>
        )
    }
}

export default Events