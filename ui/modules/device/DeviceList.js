import React,{Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Avatar from 'material-ui/Avatar'
import Badge from 'material-ui/Badge';
import Chip from 'material-ui/Chip';
import {grey400, red600, green600} from 'material-ui/styles/colors';

import HardwareDeveloperBoard from 'material-ui/svg-icons/hardware/developer-board'

const styles = {
  chip: {
    margin: 4,
  },
  onlineStyle: {
  	color: green600
  },
  offlineStyle: {
  	color: red600
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

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
			        secondaryText={
			        	<p>
              				<span>{device.serial}</span><br />
              				<span style={device.online ? styles.onlineStyle : styles.offlineStyle }>{device.online ? "Online" : "Offline"}</span>
            			</p>
            		}
			        secondaryTextLines={2}
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