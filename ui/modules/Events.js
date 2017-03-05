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

    render() {
        var eventRows = this.state.events.map(e => 
            <TableRow key={"key-event-row-id-" + e.id} >
                <TableRowColumn>{e.remoteName}</TableRowColumn>
                <TableRowColumn><b>{e.button}</b></TableRowColumn>
                <TableRowColumn>{e.repeat}</TableRowColumn>
                <TableRowColumn>{e.source}</TableRowColumn>
                <TableRowColumn>{e.timestamp}</TableRowColumn>
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