import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import DeviceController from './DeviceController'


class DeviceControllerDialog extends Component {
	constructor(props) {
		super(props)
	}

	componentWillReceiveProps(nextProps) {
	}

	render() {
		return (
			<Dialog title={this.props.device ? (this.props.device.name + " - " + this.props.device.serial ) : ""}
				modal={true}
				actions={
					<FlatButton
						label="Cancel"
						primary={true}
						onTouchTap={()=>{this.props.dialogCloseCallback && this.props.dialogCloseCallback()}}
					/>
				}
				open={this.props.showDialog}
				autoScrollBodyContent={true}
				>
				<DeviceController device={this.props.device}/>
			</Dialog>
		)
	}
}

export default DeviceControllerDialog;