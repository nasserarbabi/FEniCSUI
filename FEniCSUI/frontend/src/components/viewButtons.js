import React from 'react';
import {
    ButtonGroup,
    Button,
    ButtonToolbar,
    Dropdown,
    OverlayTrigger,
    Tooltip,
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
                <div key="item-view">
                    <ButtonGroup key="view" className="mr-1">
                        <Dropdown as={ButtonGroup} alignRight>
                            <OverlayTrigger
                                key="isoView"
                                placement="bottom"
                                overlay={
                                    <Tooltip id="isoViewTooltip">
                                        Iso view
                                    </Tooltip>
                                }
                            >
                                <Button disabled={this.props.disabled} name="iso" variant="light" onClick={this.handleClick.bind(this, "iso")}>
                                    <FontAwesomeIcon
                                        icon={icons["faCube"]}
                                    />
                                </Button>
                            </OverlayTrigger>
                            <Dropdown.Toggle split disabled={this.props.disabled} variant="light" id="dropdown-split-basic" />
                            <Dropdown.Menu style={{ minWidth: "25px" }}>
                                {["front", "left", "right", "back", "top", "bot"].map((name) => (
                                    <OverlayTrigger
                                        key={`${name}View`}
                                        placement="bottom"
                                        overlay={
                                            <Tooltip id={`${name}ViewTooltip`}>
                                                {name.charAt(0).toUpperCase() + name.slice(1)} view
                                            </Tooltip>
                                        }
                                    >
                                        <Dropdown.Item key={name} onClick={this.handleClick.bind(this, name)}>
                                            <Icons icon={name} />
                                        </Dropdown.Item>
                                    </OverlayTrigger>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </ButtonGroup>
                    <ButtonGroup key="fit" className="mr-1">
                        <OverlayTrigger
                            key="fit"
                            placement="bottom"
                            overlay={
                                <Tooltip id="fitTooltip">
                                    Fit to screen
                                    </Tooltip>
                            }
                        >
                            <Button name="fit" variant="light" disabled={this.props.disabled} onClick={this.handleClick.bind(this, "fit")}>
                                <FontAwesomeIcon icon={icons["faExpandArrowsAlt"]} />
                            </Button>
                        </OverlayTrigger>
                    </ButtonGroup>
                    <ButtonGroup key="meshView" className="mr-1 pr-1">
                        <OverlayTrigger
                            key="meshView"
                            placement="bottom"
                            overlay={
                                <Tooltip id="meshViewTooltip">
                                    {this.props.meshView ? "Hide mesh" : "View mesh"}
                                </Tooltip>
                            }
                        >
                            <Button
                                disabled={this.props.disabled}
                                variant="light"
                                name="meshView"
                                onClick={this.handleClick.bind(this, "meshView")}>
                                <FontAwesomeIcon icon={this.props.meshView ? icons["faStop"] : icons["faTh"]} />
                            </Button>
                        </OverlayTrigger>
                    </ButtonGroup>
                    <ButtonGroup key="faceSelect" className="mr-1 pr-1">
                        <OverlayTrigger
                            key="faceSelect"
                            placement="bottom"
                            overlay={
                                <Tooltip id="faceSelectTooltip">
                                    Select Faces
                                    </Tooltip>
                            }
                        >
                            <Button
                                disabled={this.props.disabled}
                                variant="light"
                                name="faceSelect"
                                active={this.props.faceSelect}
                                onClick={this.handleClick.bind(this, "faceSelect")}>
                                <FontAwesomeIcon icon={icons["faObjectUngroup"]} />
                            </Button>
                        </OverlayTrigger>
                    </ButtonGroup>
                    <ButtonGroup key="edgeSelect" className="mr-1 pr-1">
                        <OverlayTrigger
                            key="edgeSelect"
                            placement="bottom"
                            overlay={
                                <Tooltip id="edgeSelectTooltip">
                                    Select Edges
                                    </Tooltip>
                            }
                        >
                            <Button
                                disabled={this.props.disabled}
                                variant="light"
                                name="edgeSelect"
                                active={this.props.edgeSelect}
                                onClick={this.handleClick.bind(this, "edgeSelect")}>
                                <FontAwesomeIcon icon={icons["faObjectGroup"]} />
                            </Button>
                        </OverlayTrigger>
                    </ButtonGroup>
                    <ButtonGroup key="colors" className="mr-1">
                        <Dropdown as={ButtonGroup} alignRight>
                            <OverlayTrigger
                                key="defaultColor"
                                placement="bottom"
                                overlay={
                                    <Tooltip id="defaultColorTooltip">
                                        White background
                                    </Tooltip>
                                }
                            >
                                <Button disabled={this.props.disabled} name="bgColor" variant="light" onClick={this.handleClick.bind(this, "bgColor")}>
                                    <FontAwesomeIcon
                                        icon={icons["faFillDrip"]}
                                    />
                                </Button>
                            </OverlayTrigger>
                            <Dropdown.Toggle split disabled={this.props.disabled} variant="light" id="dropdown-split-basic" />
                            <Dropdown.Menu style={{ minWidth: "25px" }}>
                                {["darkgray", "wheat", "indigo", "navy"].map((name) => (
                                    <Dropdown.Item key={name} onClick={this.handleClick.bind(this, `bg${name}`)}>
                                        <FontAwesomeIcon icon={icons["faSquare"]} size="2x" color={name} />
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </ButtonGroup>
                </div>
            </ButtonToolbar >
        )
    }
}
export default ViewButtons;