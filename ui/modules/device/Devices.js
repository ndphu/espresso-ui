import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import NewDeviceDialog from './NewDeviceDialog'
import DeviceList from './DeviceList'
import DeviceControllerDialog from './DeviceControllerDialog'
import Helper from '../Helper'

class Device extends Component {
    constructor(props) {
        super(props)
        this.state = {
        	showAddDialog: false,
            showDeviceController: false,
            devices: [],
            selectedDevice: {},
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

    onUnknowDeviceClick(device) {        
        const newDeviceName = prompt("Enter new device name")
        device.name = newDeviceName
        device.managed = true

        this.refs.helper.putDevice(device)
        .then(res => res.json())
        .then(json => {
            if (json.error) {
                alert(json.error)
            } else {
                this.setState(this.state)
            }
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
                <Helper ref="helper"/>
            	<RaisedButton 
	            	label="New Device" 
	            	primary={true} 
	            	onTouchTap={()=>{this.setState({showAddDialog: true})}}/>
	            
                        <DeviceList 
                            deviceClickHandler={(device)=>{this.onDeviceClick(device)}} 
                            devices={managedDevices} 
                            deviceCategory="Managed Devices"
                        />

                        <DeviceList 
                            deviceClickHandler={(device)=>{this.onUnknowDeviceClick(device)}}
                            devices={unknowDevices} 
                            deviceCategory="Unknown Devices"                    
                        />
                

                <DeviceControllerDialog 
                    device={this.state.selectedDevice}
                    showDialog={this.state.showDeviceController} 
                    dialogCloseCallback={()=>{this.setState({showDeviceController:false})}}/>
                <NewDeviceDialog showDialog={this.state.showAddDialog} dialogCloseCallback={()=>{this.dialogCloseCallback()}}/>
            </div>
        )
    }
}

export default Device