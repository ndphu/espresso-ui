import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import {Table,TableRow,TableRowColumn, TableBody} from 'material-ui/Table'

const deviceFields = [
	{
		"name": "Device Name",
		"hint": "Any awesome name",
		"ref": "deviceName"
	},
	{
		"name": "Device Serial",
		"hint": "Your device serial number",
		"ref": "deviceSerial",
	}
]

class NewDeviceDialog extends Component {
	constructor(props) {
		super(props)
	}

	handleClose() {		
		this.props.dialogCloseCallback()
	}

	handleCreate() {
		const payload = {
			name: this.refs.deviceName.input.value,
			serial: this.refs.deviceSerial.input.value,
		}
		fetch("/esp/v1/devices", {
		    method: "POST",
		    body: JSON.stringify(payload),
		    hearders: {
		    	'Content-Type': 'application/json'
		    }
		})
		.then(response => response.json())
		.then((data) => { 
			if (data.error) {
				alert(data[error])
			} else {
				this.handleClose()
			}
		})

	}

	render() {
		const inputFields = deviceFields.map(field => {
			return (
				<TableRow key={"key-device-field-" + field.name} displayBorder={false}>
					<TableRowColumn><b style={{fontSize:"16px"}}>{field.name}</b></TableRowColumn>
					<TableRowColumn><TextField ref={field.ref} hintText={field.hint}/></TableRowColumn>
				</TableRow>
				)
		})


		return (
			<Dialog
			  title="New Device"
			  actions={
			  	<div>
					<FlatButton
						label="Cancel"
						primary={true}
						onTouchTap={()=>{this.handleClose()}}
					/>
					<RaisedButton
						label="Create"
						primary={true}
						onTouchTap={()=>{this.handleCreate()}}
					/>
				</div>
				}
			  modal={true}
			  open={this.props.showDialog}
			  onRequestClose={()=>{this.handleClose()}}
			>
			  <Table selectable={false}>
			  	<TableBody 
			  		displayRowCheckbox={false}
			  		showRowHover={false}>
			  		{inputFields}
			  	</TableBody>
			  </Table>
			</Dialog>
		)
	}
}


export default NewDeviceDialog;