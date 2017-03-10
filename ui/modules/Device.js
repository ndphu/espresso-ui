import React, {Component} from 'react'
import {Table, TableBody, TableRow, TableColumn} from 'material-ui/Table'

class Device extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Table selectable={false}>
			  	<TableBody 
			  		displayRowCheckbox={false}
			  		showRowHover={false}>
			  		
			  	</TableBody>
			  </Table>
			)
	}
}

export default Device