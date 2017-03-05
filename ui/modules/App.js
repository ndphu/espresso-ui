import React,{Component} from 'react'
import { RouteHandler, browserHistory, Link } from 'react-router'

// icons
import FileFolder from 'material-ui/svg-icons/file/folder'
import CreateNewFolder from 'material-ui/svg-icons/file/create-new-folder'
import FileFileDownload from 'material-ui/svg-icons/file/file-download'
import EditorInsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import ActionBackup from 'material-ui/svg-icons/action/backup'
import ActionInfo from 'material-ui/svg-icons/action/info'
import ActionHome from 'material-ui/svg-icons/action/home'
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ActionEvent from 'material-ui/svg-icons/action/event';

// colors
import {blue700, yellow800, grey400,darkBlack } from 'material-ui/styles/colors'

// components
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import FlatButton from 'material-ui/FlatButton'
import {Tab, Tabs} from 'material-ui/Tabs'
import FontIcon from 'material-ui/FontIcon';
import DeviceDevices from 'material-ui/svg-icons/device/devices';
import HardwareDeveloperBoard from 'material-ui/svg-icons/hardware/developer-board';

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
			case "/esp/automation":
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
				      	label="DEVICES"
				      	onActive={this.handleActive}
				      	data-route="/esp/devices"
				    />
				    <Tab
				    	ref="automationTab"
					    icon={<HardwareDeveloperBoard/>}
					    label="AUTOMATION"
					    onActive={this.handleActive}
					    data-route="/esp/automation"
				    />
				    <Tab
				    	ref="eventTab"
					    icon={<ActionEvent />}
					    label="EVENTS"
					    onActive={this.handleActive}
					    data-route="/esp/events"
				    />
			  	</Tabs>
			  	{this.props.children}
				
			</div>
		)
	}
}