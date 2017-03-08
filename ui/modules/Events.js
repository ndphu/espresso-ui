import React, {Component} from 'react'
import Websocket from 'react-websocket';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
class Events extends Component {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
            showCheckboxes: false,
            liveUpdate: true,
            debug: true
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

    onServerMessage(data) {        
        let msg = JSON.parse(data);
        switch (msg.type) {
            case "IR_EVENT_ADDED": {
                this.state.events.splice(0, 0, msg.payload)
                this.state.events.splice(this.state.events.length - 1, 1)
                this.setState(this.state)
            }
        }
    }

    getWebsocketUrl() {
        return (location.protocol.indexOf("https") == 0 ? "wss://" : "ws://") + location.host + "/esp/v1/ws/events"
    }

    toISOTime(timestamp) {
        //return (new Date(timestamp).toISOString() + "").substring(11,19)
        return (new Date(timestamp) + "").substring(16,25)
    }


    render() {
        var now = new Date().getTime()
        var eventRows = this.state.events.map(e => 
            <TableRow key={"key-event-row-id-" + e.id} >
                {this.state.debug && (<TableRowColumn>{e.id}</TableRowColumn>)}
                <TableRowColumn>{e.remoteName}</TableRowColumn>
                <TableRowColumn><b>{e.button}</b></TableRowColumn>
                <TableRowColumn>{e.repeat}</TableRowColumn>
                {this.state.debug && <TableRowColumn>{e.source}</TableRowColumn>}
                <TableRowColumn>{this.timeDifference(now, e.unixTimestamp * 1000)}</TableRowColumn>
                {this.state.debug && (<TableRowColumn>{this.toISOTime(e.timestamp)}</TableRowColumn>)}
            </TableRow>
        )


        return (
            <div>
                <Toggle
                  label="Live Update"
                  defaultToggled={true}
                  onToggle={(e,liveUpdate)=>{
                        this.setState({
                            liveUpdate: liveUpdate
                        })}
                    }
                  labelPosition="right"
                  style={{margin: 20}}
                />
                <Toggle
                  label="Debug"
                  defaultToggled={true}
                  onToggle={(e,debug)=>{
                        this.setState({
                            debug: debug
                        })}
                    }
                  labelPosition="right"
                  style={{margin: 20}}
                />
                <Paper style={{margin:20}} zDepth={2}>                
                        {this.state.liveUpdate ? (
                            <Websocket url={this.getWebsocketUrl()}
                            onMessage={this.onServerMessage.bind(this)}/>) : (
                            <div></div>
                            )
                        }
                    <Table selectable={false}>
                        <TableHeader adjustForCheckbox={this.state.showCheckboxes} displaySelectAll={this.state.showCheckboxes}>
                          <TableRow>
                            {this.state.debug && (<TableHeaderColumn>ObjectId</TableHeaderColumn>)}
                            <TableHeaderColumn>Remote</TableHeaderColumn>
                            <TableHeaderColumn>Button</TableHeaderColumn>
                            <TableHeaderColumn>Repeat</TableHeaderColumn>
                            {this.state.debug && <TableHeaderColumn>Source</TableHeaderColumn>}
                            <TableHeaderColumn>When</TableHeaderColumn>
                            {this.state.debug && (<TableHeaderColumn>Timestamp</TableHeaderColumn>)}
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
            </div>
            
        )
    }
}

export default Events