import React from 'react';
import {
    ButtonGroup,
    Button,
    ButtonToolbar,
    Dropdown,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import Icons from '../icons/viewIcon'
class ViewButtons extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(buttonName) {
        // pass the name of the clicked button on the view toolbar to App.js
        this.props.handleViewerClick(buttonName)
    }
    render() {
        var items = this.props.items;
        return (
            < ButtonToolbar key="viewToolbar" >
                {
                    items.map(({ name, icon, disabled, type, menuItems, ...rest }) => (
                        <div key={`item-${name}`}>
                            {(type === "dropDown") && // && acts as conditioning: if(type === ..){}
                                <ButtonGroup key={name} className="mr-1">
                                    <Dropdown as={ButtonGroup} alignRight>
                                        <Button disabled={disabled} name={name} variant="light" onClick={this.handleClick.bind(this, name)}>
                                            <FontAwesomeIcon 
                                            icon={icons[icon]} 
                                            color = {(rest.color)? rest.color:null}
                                            />
                                        </Button>

                                        <Dropdown.Toggle split disabled={disabled} variant="light" id="dropdown-split-basic" />

                                        <Dropdown.Menu style={{ minWidth: "25px" }}>
                                            {menuItems.map((item) => (
                                                <Dropdown.Item key={item.name} onClick={this.handleClick.bind(this, item.name)}>
                                                    {(item.color)? <FontAwesomeIcon icon={icons[item.icon]} color={item.color} size="2x"/> :<Icons icon={item.icon} />}
                                                    
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </ButtonGroup>}


                            {(type === "button") &&
                                <ButtonGroup key={name} className="mr-1">
                                    <Button name={name} variant="light" disabled={disabled} onClick={this.handleClick.bind(this, name)}>
                                        <FontAwesomeIcon icon={icons[icon]} />
                                    </Button>
                                </ButtonGroup>}

                            {(type === "checkBox") &&
                                <ButtonGroup key={name} className="mr-1 pr-1">
                                    <Button
                                        disabled={disabled}
                                        variant="light"
                                        name={name}
                                        active={rest.checked}
                                        onClick={this.handleClick.bind(this, name)}>
                                        <FontAwesomeIcon icon={icons[icon]} />
                                    </Button>
                                </ButtonGroup>}
                        </div>

                    ))
                }
            </ButtonToolbar >
        )
    }
}
export default ViewButtons;