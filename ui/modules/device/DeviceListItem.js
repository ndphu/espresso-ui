import React, {Component} from 'react'
import {ListItem} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import HardwareDeveloperBoard from 'material-ui/svg-icons/hardware/developer-board'
import {grey400, red600, green600} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Helper from '../Helper'

const styles = {
  onlineStyle: {
  	color: green600
  },
  offlineStyle: {
  	color: red600
  }
};


const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const helper = new Helper()

export default class DeviceListItem extends Component {
	constructor(props) {
		super(props)
	}

	onRenameClick() {
		const newName = prompt("Enter new name")
		if (newName != undefined && newName.length > 0) {
			const d = this.props.device
			d.name = newName
			helper.putDevice(d).then(res=>res.json()).then(json => {
				if (json.error != undefined) {
					alert(json.error)
				}
			})
		}
	}

	onDeleteClick() {
		if (confirm("Delete \"" + this.props.device.name + "\"?")) {
			helper.deleteDevice(this.props.device).then(res=>res.json()).then(json => {
				if (json.error != undefined) {
					alert(json.error)
				}
			})
		}
	}


	render() {
		return (
			<ListItem
				leftAvatar={<Avatar icon={<HardwareDeveloperBoard/>} />}
				rightIconButton={
					<IconMenu iconButtonElement={iconButtonElement}>    
					    <MenuItem onTouchTap={()=>{this.onRenameClick()}}>Rename</MenuItem>
					    <MenuItem onTouchTap={()=>{this.onDeleteClick()}}>Delete</MenuItem>
					</IconMenu>
				}
		        primaryText={this.props.device.name}
		        secondaryText={
		        	<p>
          				<span>{this.props.device.serial}</span><br />
          				<span style={this.props.device.online ? styles.onlineStyle : styles.offlineStyle }>{this.props.device.online ? "ONLINE" : "OFFLINE"}</span>
        			</p>
        		}
		        secondaryTextLines={2}
		        onTouchTap={(e)=>{this.props.onDeviceClick(this.props.device)}}
		      />
			)
	}
}

