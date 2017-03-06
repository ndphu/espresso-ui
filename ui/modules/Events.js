import React, {Component} from 'react'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
class Events extends Component {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
            showCheckboxes: false,
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