import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import NewDeviceDialog from './NewDeviceDialog'
import DeviceList from './DeviceList'
import DeviceControllerDialog from './DeviceControllerDialog'


class Device extends Component {
    constructor(props) {
        super(props)
        this.state = {
        	showAddDialog: false,
            showDeviceController: false,
            devices: [],
            selectedDevice: {"nane":"haha"},
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        fetch("/esp/v1/devices").then(response=>response.json()).then(json=> {
            this.setState({
                devices: json
            })
        })
    }

    dialogCloseCallback() {
    	this.setState({
    		showAddDialog: false
    	})
    }

    onDeviceClick(device) {
        console.log(device)
        this.setState({
            selectedDevice: device,
            showDeviceController: true            
        })
    }

    render() {
        var managedDevices = []
        var unknowDevices = []

        this.state.devices.forEach(function(e,i){            
            if (e.managed == true) {
                managedDevices.push(e)
            } else {
                unknowDevices.push(e)
            }
        })

        return (
            <div style={{margin: "16px"}}>
            	<RaisedButton 
	            	label="New Device" 
	            	primary={true} 
	            	onTouchTap={()=>{this.setState({showAddDialog: true})}}/>
	            <NewDeviceDialog showDialog={this.state.showAddDialog} dialogCloseCallback={()=>{this.dialogCloseCallback()}}/>
                <DeviceList 
                    deviceClickHandler={(device)=>{this.onDeviceClick(device)}} 
                    devices={managedDevices} 
                    deviceCategory="Managed Devices"/>
                <DeviceList devices={unknowDevices} deviceCategory="Unknown Devices"></DeviceList>

                <DeviceControllerDialog 
                    device={this.state.selectedDevice}
                    showDialog={this.state.showDeviceController} 
                    dialogCloseCallback={()=>{this.setState({showDeviceController:false})}}/>
            </div>
        )
    }
}

export default Device