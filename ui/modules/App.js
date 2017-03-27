import React,{Component} from 'react'
import { RouteHandler, browserHistory, Link } from 'react-router'

// icons
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ActionEvent from 'material-ui/svg-icons/action/event';
import ActionExtension from 'material-ui/svg-icons/action/extension';
import HardwareDeveloperBoard from 'material-ui/svg-icons/hardware/developer-board';
import FontIcon from 'material-ui/FontIcon';

// colors
import {blue700, yellow800, grey400,darkBlack } from 'material-ui/styles/colors'

// components
import {Tab, Tabs} from 'material-ui/Tabs'

import DeviceDevices from 'material-ui/svg-icons/device/devices';


export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedTab: 2
		}
	}

	handleActive(tab) {
		browserHistory.push(tab.props["data-route"])
	}

	getSelectedTabIndex() {
		switch (this.props.location.pathname) {
			case "/esp/devices":
				return 0;
			case "/esp/physical-devices":
				return 1;
			case "/esp/events":
				return 2;
			default:
				return -1;
		}
	}

	
	render() {		
		return (
			<div>
				<Tabs initialSelectedIndex={this.getSelectedTabIndex()}>
				    <Tab
				    	ref="devicesTab"
				      	icon={<DeviceDevices/>}
				      	label="Devices"
				      	onActive={this.handleActive}
				      	data-route="/esp/devices"
				    />
				    <Tab
				    	ref="physicalDevicesTab"
					    icon={<HardwareDeveloperBoard/>}
					    label="Physical Devices"
					    onActive={this.handleActive}
					    data-route="/esp/physical-devices"
				    />
				    <Tab
				    	ref="automationTab"
					    icon={<ActionExtension/>}
					    label="Home Automation"
					    onActive={this.handleActive}
					    data-route="/esp/automation"
				    />
				    <Tab
				    	ref="eventTab"
					    icon={<ActionEvent />}
					    label="Events"
					    onActive={this.handleActive}
					    data-route="/esp/events"
				    />
			  	</Tabs>
			  	{this.props.children}				
			</div>
		)
	}
}