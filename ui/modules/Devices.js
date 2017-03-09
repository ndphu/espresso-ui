import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import NewDeviceDialog from './NewDeviceDialog'

class Device extends Component {
    constructor(props) {
        super(props)
        this.state = {
        	showAddDialog: false
        }
    }

    dialogCloseCallback() {
    	this.setState({
    		showAddDialog: false
    	})
    }

    render() {
        return (
            <div style={{margin: "16px"}}>
            	<RaisedButton 
	            	label="New Device" 
	            	primary={true} 
	            	onTouchTap={()=>{this.setState({showAddDialog: true})}}/>
	            <NewDeviceDialog showDialog={this.state.showAddDialog} dialogCloseCallback={()=>{this.dialogCloseCallback()}}/>
            </div>
        )
    }
}

export default Device