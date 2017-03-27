import React,{Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import DeviceListItem from './DeviceListItem'


class DeviceList extends Component {
	constructor(props) {
		super(props)
		//console.log(this.props)
		this.state = {
			selectedDeviceId: ""
		}
	}

	onDeviceClick(device) {
		this.setState({
			selectedDeviceId: device._id
		})
		if (this.props.deviceClickHandler) {
			this.props.deviceClickHandler(device)
		}
	}

	render() {
		var items = this.props.devices.map(device => {			
			var style = {}
			if (this.state.selectedDeviceId == device._id) {
				//console.log("OK")
				style = {
					backgroundColor: "rgba(0, 0, 0, 0.1)"
				}
			}
			// style = this.state.selectedDeviceId == device._id ? ({
			// 	backgroundColor: "rgba(0,0,0,0.2)"
			// }) : ({

			// })
			return(
				<DeviceListItem key={"key-list-item-device-" + device._id} 
					device={device}
					style={style}
					onDeviceClick={(d)=>{this.onDeviceClick(d)}}/>
				)
		})

		return(
			<List>
	      		<Subheader inset={true}>{this.props.deviceCategory}</Subheader>
	      		{items}
	      	</List>
      	)
	}
}

export default DeviceList