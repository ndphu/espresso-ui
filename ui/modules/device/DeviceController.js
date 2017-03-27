import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import Helper from '../Helper'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List'


const gpios = [0, 1, 2, 3, 4, 5, 9, 10,12, 13, 14, 15, 16]

const helper = new Helper()

const styles = {
	formStyle: {
		padding: "8px",
		margin: "8px"
	},
	cardStyle: {
		marginTop: "8px",
		marginBottom: "8px"
	}
}

class DeviceController extends Component {
	constructor(props) {
		super(props)
		this.state = {
			gpios: gpios,
			gpio: 2,
			gpioState: 0,
		}
	}

	sendCommand() {
		this.__sendTextCommand(this.refs.textFieldCommand.input.value)
	}


	testBlink() {
		this.__sendTextCommand("BLINK;20;50;")
	}

	sendGpioCommand() {		
		helper.putGpioCommand(this.props.device, this.state.gpio, this.state.gpioState)
		.then(response => response.json())
		.then(json => {
            if (json.error) {
                alert(json.error)
            }
        })
	}


	__sendTextCommand(cmd) {
		helper.sendTextCommand(this.props.device, cmd).then(res => res.json()).then(json => {
			if (json.error) {
				alert(json.error)
			} 
		})
	}

	ping() {
		this.__sendTextCommand("PING;")
	}

	handleChange(event, index, value) {
		this.setState({gpio: value});
	}

	handleGpioStateChange(event, index, value) {
		this.setState({gpioState: value});
	}

	
	render() {
		var gpioPinMenuItems= this.state.gpios.map(gpio => <MenuItem key={"key-gpio-dropdown-menu-item-" + gpio} value={gpio} primaryText={"GPIO_" + gpio} />)
		return (
			<div style={styles.formStyle}>
				<Card style={styles.cardStyle}>
				    <CardText>
				    	<List>
				    		<ListItem
				    			primaryText={<b>Name</b>}
				    			secondaryText={this.props.device.name}
				    			/>
				    		<ListItem
				    			primaryText={<b>Serial</b>}
				    			secondaryText={this.props.device.status.serial}
				    			/>
				    		<ListItem
				    			primaryText={<b>Status</b>}
				    			secondaryText={this.props.device.status.online? "ONLINE" : "OFFLINE"}
				    			/>				    					    		
				    		<ListItem 
				    			primaryText={<b>Uptime</b>}
				    			secondaryText={this.props.device.status.uptime}/>
				    		<ListItem 
				    			primaryText={<b>Free Heap</b>}
				    			secondaryText={this.props.device.status.free}/>
				    		<ListItem 
				    			primaryText={<b>Last seen</b>}
				    			secondaryText={
				    				helper.timeDifference(
				    					new Date().getTime(), 
				    					new Date(this.props.device.status.timestamp).getTime()
			    					)
		    					}/>
				    	</List>
				    </CardText>
				</Card>
				<Card style={styles.cardStyle}>
					<CardHeader
				      title="Communication"
				      subtitle="Communicate with this device"
				      showExpandableButton={true}
					  actAsExpander={true}
				    />
				    <CardText expandable={true}>
				    	{this.props.device.status.online && (
							<div>
								<h5>Test</h5>
								<RaisedButton label="Test Blink" primary onTouchTap={(e)=>{this.testBlink()}}/>
								<h5>GPIO</h5>
								<span>
									<DropDownMenu value={this.state.gpio} onChange={(event, index, value)=>{this.handleChange(event, index, value)}}>
										{gpioPinMenuItems}
									</DropDownMenu>
									<DropDownMenu value={this.state.gpioState} onChange={(event, index, value)=>{this.handleGpioStateChange(event, index, value)}}>
										<MenuItem value={0} primaryText="Low" />
										<MenuItem value={1} primaryText="High" />
									</DropDownMenu>					
								</span><br/>
								<RaisedButton label="Set" primary onTouchTap={(e)=>{this.sendGpioCommand()}}/>
								<h5>Debug</h5>
								<TextField
									ref="textFieldCommand"
							      	hintText="The command to send"
							      	floatingLabelText={"Send raw command to " + this.props.device.name}
							      	fullWidth={true}
							    />
							    <RaisedButton label="Send" primary onTouchTap={(e)=>{this.sendCommand()}}/>
						    </div>
						)}

						{!this.props.device.status.online && (
							<div>
								<h5>Device is offline </h5>
								<RaisedButton label="Ping" primary onTouchTap={(e)=>{this.ping()}}/>
							</div>
						)}
				    </CardText>					
				</Card>
			</div>
		)
	}
}

export default DeviceController;