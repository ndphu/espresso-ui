import React,{Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Avatar from 'material-ui/Avatar'


import HardwareDeveloperBoard from 'material-ui/svg-icons/hardware/developer-board'

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
				<ListItem key={"key-list-item-device-" + device._id}
					leftAvatar={<Avatar icon={<HardwareDeveloperBoard/>} />}
			        primaryText={device.name}
			        secondaryText={device.serial}
			        onTouchTap={(e)=>{this.onDeviceClick(device)}}
			      />
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