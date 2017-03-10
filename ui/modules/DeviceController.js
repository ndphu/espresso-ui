import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class DeviceController extends Component {
	constructor(props) {
		super(props)
	}

	sendCommand() {
		fetch('/esp/v1/text_commands', {
			method: "POST",
		    body: JSON.stringify({
		    	text: this.refs.textFieldCommand.input.value
		    }),
		    hearders: {
		    	'Content-Type': 'application/json'
		    }
		}).then(response => response.json()).then(json => {
			if (json.error) {
				alert(json.error)
			} else {
				console.log(json)
			}
		})
	}

	render() {
		return (
			<div>
				<TextField
					ref="textFieldCommand"
			      	hintText="The command to send"
			      	floatingLabelText={"Send direct command to " + this.props.device.name}
			      	fullWidth={true}
			    />
			    <RaisedButton label="Send" primary onTouchTap={(e)=>{this.sendCommand()}}/>
			</div>
		)
	}
}

export default DeviceController;