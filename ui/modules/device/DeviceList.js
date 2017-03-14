import React,{Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import DeviceListItem from './DeviceListItem'


class DeviceList extends Component {
	constructor(props) {
		super(props)
	}

	onDeviceClick(device) {
		if (this.props.deviceClickHandler) {			
			this.props.deviceClickHandler(device)
		}
	}

	render() {
		var items = this.props.devices.map(device => {
			return(
				<DeviceListItem key={"key-list-item-device-" + device._id} 
					device={device}
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