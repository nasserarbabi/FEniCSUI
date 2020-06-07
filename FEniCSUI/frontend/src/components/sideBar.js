import React from 'react';
import {
    ButtonGroup,
    Button,
    Row,
    Col,
    Overlay,
    Popover,
    Form,
    Card,
    Accordion,
    useAccordionToggle,
    ButtonToolbar,

} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

class SideBar extends React.Component {
    /*
    Generates the side bar menu items from the template dictionary
    */
    constructor(props) {
        super(props);
        this.popover = this.popover.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(event) {
        /* sends form data to the parent */
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = {
            name: event.target.name,
            data: {}
        };


        for (let key of formData.keys()) {
            let validation = document.forms[event.target.name].elements[key].getAttribute("validation");
            data.data[key] =
            {
                value: formData.get(key),
                validation: JSON.parse(validation)
            };
        }
        this.props.handleSidebarSubmit(data);
        event.target.reset();
    }


    // define the content shown in popover
    popover(name, label, form, formButtons) {
        return (
            <Popover
                key={`popover-${name}`}
                style={{ boxShadow: "5px 5px 20px #9E9E9E", margin: "10px", zIndex: "1040" }}>
                <Popover.Title as="h3">{label}</Popover.Title>
                <Popover.Content>
                    <Form name={name} onSubmit={this.handleSubmit}>
                            {form.map((input) => (
                                <Form.Group id={`formGroup-${input.id}`} key={`formGroup-${name}-${input.id}`}>
                                    <Form.Label>{input.label}</Form.Label>
                                    <Form.Control
                                        name={input.id}
                                        key={`${name}-${input.id}`}
                                        as={input.as}
                                        type={input.type}
                                        defaultValue={input.default}
                                        placeholder={input.placeholder}
                                        isInvalid={input.isInvalid}
                                        validation={JSON.stringify(input.validation)}
                                        onChange={input.fieldChange!=null?this.props.handleChangingFields:undefined}
                                        fieldchange={JSON.stringify(input.fieldChange)}
                                    >
                                        {input.type == "select" ?
                                            input.formOptions.map((option) => (
                                                <option
                                                    selected = {option.value==input.default?true:false}
                                                    key={option.label}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>)) : null}

                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {input.invalidFeedback}
                                    </Form.Control.Feedback>
                                    <Form.Text className="text-muted">
                                        {input.helperText}
                                    </Form.Text>
                                </Form.Group>
                            ))
                            }
                        {Array.isArray(formButtons) ? (
                            <ButtonToolbar>
                                {formButtons.map((button) => (
                                    <ButtonGroup
                                        key={`buttonGroup-${button.id}`}
                                        className="mr-2"
                                        aria-label={`buttonGroup-${button.id}`}>
                                        <Button
                                            type="Submit"
                                            variant={button.type}
                                            key={button.id}
                                            name={button.id}>
                                            {button.label}
                                        </Button>
                                    </ButtonGroup>
                                )
                                )}
                            </ButtonToolbar>
                        ) : null}
                    </Form>
                </Popover.Content>
            </Popover>
        )
    };

    render() {
        // drop down menu behavior
        function CustomToggle({ children, eventKey, disabled }) {
            const decoratedOnClick = useAccordionToggle(eventKey);
            return (
                <Button
                    disabled={disabled}
                    variant="sideBar text-left"
                    key={name}
                    style={{ width: "95%" }}
                    onClick={decoratedOnClick}>
                    {children}
                    </Button>
            );
        }

        // side bar items
        var items = this.props.sideBarItems;
        return (
            <div id="sideBar">

                <Row className="mt-3">
                    <Col>
                        {Object.entries(items).map(([menu, item]) =>
                            <Accordion key={`accordin-${menu}`}>
                                <Card key={`card-${menu}`}>
                                    <ButtonGroup
                                        key={`buttonGroup-${menu}`}
                                        bsPrefix="d-flex" >
                                            
                                        {/* drop down menu for tree */}
                                        <CustomToggle
                                            disabled={menu!="uploadStep"?this.props.disabled:false}
                                            eventKey={`toggle-${menu}`}>
                                            <FontAwesomeIcon icon={icons[item.icon]} />&nbsp;&nbsp;{item.label}
                                        </CustomToggle>

                                        {/* popover > button */}
                                        <Button
                                            disabled={menu!="uploadStep"?this.props.disabled:false}
                                            variant="sideBar text-left"
                                            key={`popover-${menu}`}
                                            visualizerselect={item.visualizerSelect}
                                            id={`popover-${menu}`}
                                            style={{ width: "5%", paddingRight:"16px" }}
                                            onClick={(event) => { this.props.handleSidebarClick(event) }}
                                        >
                                            <FontAwesomeIcon icon={icons["faChevronRight"]} />
                                        </Button>
                                        <Overlay
                                            show={item.popoverState}
                                            target={document.getElementById(`popover-${menu}`)}
                                            key={menu}
                                            placement="right"
                                            transition>
                                            {this.popover(menu, item.label, item.form, item.formButtons)}
                                        </Overlay>

                                    </ButtonGroup>

                                    {/* card body containing existing elements  */}
                                    <Accordion.Collapse eventKey={`toggle-${menu}`}>
                                        <Card.Body className="p-1">
                                            <table >
                                                <tbody>
                                                    {item.cardContent.map((item, index) => (
                                                        <tr key={`tableRow-${menu}-${item}`} style={{ width: "100%" }}>
                                                            <td style={{ width: "95%" }}>
                                                                <Button 
                                                                    variant="link" 
                                                                    key={`edit_${item}`} 
                                                                    id={`edit_${menu}_${index}`}
                                                                    onClick={()=>this.props.handleSideBarEdit(menu,index)}
                                                                    >
                                                                     {item} 
                                                                </Button>
                                                            </td>
                                                            <td
                                                                key={`close-${menu}-${item}`}
                                                                id={`close-${menu}-${item}`} // this is used in handleSideBarRemoveFromCard
                                                                style={{ width: "5%" }}
                                                                onClick={(event) => { this.props.handleSideBarRemoveFromCard(event, index) }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={icons["faTimesCircle"]}

                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        )}
                        <br />
                        <div className="text-center">
                            <a className="btn btn-primary mb-1" href="../../dashboard">Go to dashboard</a>
                            <Button
                                key="submitAnalysis"
                                variant="warning"
                                className="mb-1"
                                disabled={this.props.disabled}
                                onClick={this.props.submitAnalysis}>Submit Analysis
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SideBar;