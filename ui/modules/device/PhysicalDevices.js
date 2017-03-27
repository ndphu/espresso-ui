import React, {Component} from 'react'
import Websocket from 'react-websocket';
import RaisedButton from 'material-ui/RaisedButton'
import NewDeviceDialog from './NewDeviceDialog'
import DeviceList from './DeviceList'
//import DeviceControllerDialog from './DeviceControllerDialog'
import DeviceController from './DeviceController'
import Helper from '../Helper'
import {Grid, Row, Col} from 'react-bootstrap'
import Paper from 'material-ui/Paper';

const styles = {
    gridContainer: {
        padding: "0px",        
        margin: "0px",
        width: "100%",
    },
    leftPanel: {
        padding: "0px", 
        
    },
    rightPanel: {
        padding: "0px",      
        
    },
    paperStyle: {        
        margin: "8px",
    }
}

class PhysicalDevices extends Component {
    constructor(props) {
        super(props)
        this.state = {
        	showAddDialog: false,
            showDeviceController: false,
            devices: [],
            selectedDevice: {},
            liveUpdate: true,
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    getWebsocketUrl() { 
        return (location.protocol.indexOf("https") == 0 ? "wss://" : "ws://") + location.host + "/esp/v1/ws/devices"
    }

    onServerMessage(data) {
        let msg = JSON.parse(data);
        switch (msg.type) {
        case "DEVICE_OFFLINE":
            this.__updateDevice(msg.payload)
            break;
        case "DEVICE_ONLINE":
            this.__updateDevice(msg.payload)
            break;
        case "DEVICE_UPDATED":
            this.__updateDevice(msg.payload)
            break;
        case "DEVICE_ADDED":
            this.__addDevice(msg.payload)
            break;
        case "DEVICE_REMOVED":
            this.__removeDevice(msg.payload)
            break;
        }

    }

    __updateDevice(device) {
        for (var i = 0; i < this.state.devices.length; ++i) {
            if (this.state.devices[i]._id == device._id) {
                this.state.devices[i] = device;
                if (this.state.selectedDevice != undefined 
                    && this.state.selectedDevice._id == device._id) {
                    this.state.selectedDevice = device
                }
                this.setState(this.state)
                break;
            }
        }
    }

    __addDevice(device) {
        this.state.devices.push(device)
        this.setState(this.state)
    }

    __removeDevice(device) {
        for (var i = 0; i < this.state.devices.length; ++i) {
            if (this.state.devices[i]._id == device._id) {
                this.state.devices.splice(i, 1)
                if (device._id == this.state.selectedDevice._id) {
                    this.state.selectedDevice = {}
                }
                this.setState(this.state)
                break;
            }
        }
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
        this.setState({
            selectedDevice: device,
            showDeviceController: true            
        })
    }

    onUnknowDeviceClick(device) {        
        const newDeviceName = prompt("Enter new device name")
        if (newDeviceName != undefined && newDeviceName != "") {
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
            <Grid style={styles.gridContainer}>                
                <Helper ref="helper"/>
                <Col lg={3} md={4} xs={6} sm={4} style={styles.leftPanel}>
                    {this.state.liveUpdate && <Websocket url={this.getWebsocketUrl()} onMessage={this.onServerMessage.bind(this)}/>}                        
                	<DeviceList 
                        deviceClickHandler={(device)=>{this.onDeviceClick(device)}} 
                        devices={managedDevices} 
                        selectedDeviceId={this.state.selectedDevice._id}
                        deviceCategory="Managed Devices"
                    />

                    <DeviceList 
                        deviceClickHandler={(device)=>{this.onUnknowDeviceClick(device)}}
                        devices={unknowDevices} 
                        selectedDeviceId={this.state.selectedDevice._id}
                        deviceCategory="Unknown Devices"                    
                    />

                </Col>
                {this.state.selectedDevice._id &&  
                    (
                    <Col lg={9} md={8} xs={6} sm={8} style={styles.rightPanel}>
                        <DeviceController device={this.state.selectedDevice}/>                        
                    </Col>
                    )
                }
                
            </Grid>
        )
    }
}

export default PhysicalDevices;