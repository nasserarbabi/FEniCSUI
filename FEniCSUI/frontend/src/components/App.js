import React from 'react';

// import components
import SideBar from './sideBar';
import ThreeJSViewer from './visualizer';
import ViewButtons from './viewButtons';

// import initial state
import sideBarItems from '../menus/sideBarItems';
import visualizerItems from '../menus/visualizerItems';
import viewButtons from '../menus/viewButtons';

import { Container, Row, Col, Modal, Button, ProgressBar, Alert } from 'react-bootstrap';
import produce from 'immer';
import $ from 'jquery';

// const visualizer = new ThreeJSViewer();

// configuring AJAX to include csrf token on Django calls
var csrftoken = $("[name=csrfmiddlewaretoken]").val();
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
  beforeSend: function (xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
  }
});


var tempBC = {
  faces: [],
  edges: [],
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sideBar: sideBarItems,
      sideBarEdit: false,
      sideBarEditId: null,
      visualizer: visualizerItems,
      viewButtons: viewButtons,
      progress: 0,
      solverSubmitted: false,
      modalShow: false,
      bgColor: 0xffffff,
      error: false,
      errorMessage: "",
    }
    this.updateConfigFromServer = this.updateConfigFromServer.bind(this)
    this.handleSidebarSubmit = this.handleSidebarSubmit.bind(this);
    this.sidebarFormValidator = this.sidebarFormValidator.bind(this);
    this.handleViewerClick = this.handleViewerClick.bind(this);
    this.handleSidebarClick = this.handleSidebarClick.bind(this);
    this.handleSidebarSubmitAnalysis = this.handleSidebarSubmitAnalysis.bind(this);
    this.handleChangingFields = this.handleChangingFields.bind(this);
    this.addBoundaryCondition = this.addBoundaryCondition.bind(this);
    this.removeBoundaryCondition = this.removeBoundaryCondition.bind(this);
    this.modalAlert = this.modalAlert.bind(this);
    this.getGeometryIfExists = this.getGeometryIfExists.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handleSideBarRemoveFromCard = this.handleSideBarRemoveFromCard.bind(this);
    this.handleSideBarEdit = this.handleSideBarEdit.bind(this);
    this.handleSolverSubmit = this.handleSolverSubmit.bind(this);
  }

  modalAlert() {
    /* shows a full screen modal containing the configuration data from server */
    const handleClose = () => this.setState({ modalShow: false });
    var returnData = false

    if (this.state.modalShow) {
      // get analysis configuration from database 
      $.ajax({
        async: false,
        url: `../../../getConfig/${project}`,
        datatype: 'json',
        type: 'GET',
        success: (data) => {
          returnData = JSON.parse(data);
        }

      })
    }
    return (
      <>
        <Modal show={this.state.modalShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Analysis Summary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {returnData && Object.keys(returnData).map((menu) => (
              <Container key={`summary-item-${menu}`}>
                <h3 key={`h3-${menu}`}>{menu}</h3>
                <Row key={`Row-${menu}`}>
                  {returnData[menu].map((item, number) => (
                    <Col md="auto" key={`summary-${item.Name}`}>
                      <Button
                        key={`link-to-${item.Name}`}
                        variant="link"
                        onClick={() => {
                          this.setState({ modalShow: false });
                          this.handleSideBarEdit(menu, number);
                        }}
                      >
                        {item.Name}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Container>
            ))}
          </Modal.Body>
          <ProgressBar animated variant={this.state.progress == 100 ? 'success' : 'primary'} now={this.state.progress} />
          <Modal.Footer>
            <Button
              variant="danger"
              onClick={this.handleSolverSubmit}>
              {this.state.solverSubmitted ? "Kill the analysis" : "Submit Analysis"}
            </Button>
            <Button
              variant="warning"
              href={`../../../downloadResults/${project}`}
            >
              Download Results
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  handleSolverSubmit() {
    this.setState({ error: false, errorMessage: "" })
    if (this.state.solverSubmitted) {
      $.ajax({
        url: `../../../solvers/${project}?solver=navierStokes`,
        type: 'DELETE',
      })
      this.setState({solverSubmitted:false, progress: 0});
    } else {
      $.ajax({
        url: `../../../solvers/${project}?solver=navierStokes`,
        type: 'GET',
        success: () => {
          this.setState({solverSubmitted:true});
          const progress = setInterval(() => {
            $.ajax({
              url: `../../../solverProgress/${project}`,
              type: 'GET',
              success: (data) => {
                var response = JSON.parse(data)
                if (response.status === "SUCCESS") {
                  this.setState({ progress: 100 })
                  clearInterval(progress)
                };
                if (!this.state.modalShow || !this.state.solverSubmitted) clearInterval(progress)
                this.setState({ progress: response.message.progress })
              }
            });
          }, 5000);
        },
        error: (data) => {
          this.setState({ solverSubmitted:false, error: true, errorMessage: data.responseText, modalShow: false })
        }
      });
    }


  }

  handleSidebarSubmitAnalysis() {
    this.setState({ modalShow: true })
  }

  handleSideBarRemoveFromCard(event, index) {
    let menu = event.currentTarget.id.split("-")[1];

    $.ajax({
      url: `../../../solverConfig/${project}?category=${menu}&id=${index}`,
      datatype: 'json',
      type: 'DELETE',

      success: (data) => {
        let items = [];
        data ? data.forEach(element => {
          items.push(element.Name) // this is the Name of the entry, should be equal to Name in forms
        }) : null;
        this.setState(
          produce(draft => {
            draft.sideBar[menu].cardContent = items
          })
        )
      }
    });
  }

  handleSideBarEdit(menu, index) {
    /**
     * opens a form to edit the entered data, and sets the Editing to true for from submitting
     * highlights the edges or faces in the visualizer if the form contains the data
     */

    $.ajax({
      url: `../../../solverConfig/${project}?category=${menu}`,
      datatype: 'json',
      type: 'GET',
      success: (data) => {
        this.setState(
          produce(draft => {
            draft.sideBarEdit = true;
            draft.sideBarEditId = index;
            this.state.sideBar[menu].form.map((input, num) => {
              draft.sideBar[menu].form[num].default = data[index][input.id];
            })
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = false;
          })
        )
      }
    });


    if (!this.state.sideBar[menu].popoverState) {
      this.setPopoverState(menu);
    }
  }

  setPopoverState(menu) {
    /** opens the popover related to the menu input, and set all others to close */
    Object.keys(this.state.sideBar).map((item) => {
      if (item !== menu) {
        this.setState(
          produce(draft => {
            draft.sideBar[item].popoverState = false;
          }));
      } else {
        this.setState(
          produce(draft => {
            draft.sideBar[item].popoverState = !this.state.sideBar[item].popoverState;
          }));
      }
    });
  };

  handleSidebarClick(event) {
    /* Sets the active popover and select the face select or edge select if required by the menu*/
    /* the edge or face selection requires DEBUGGING */

    // open the popover menu
    let menu = event.currentTarget.id.split("-")[1];
    this.setPopoverState(menu);

    // set editing to false
    this.setState(
      { sideBarEdit: false }
    );

    // get options if it depends on other entries
    let form = this.state.sideBar[menu].form
    form.forEach((element, index) => {
      if (Boolean(element.optionsFrom)) {
        $.ajax({
          url: `../../../solverConfig/${project}?category=${element.optionsFrom}`,
          datatype: 'json',
          type: 'GET',
          success: (data) => {
            let items = [];
            Boolean(data) ? data.forEach(item => {
              items.push(
                { label: item.Name, value: item.Name }
              )
            }) : null;
            this.setState(
              produce(draft => {
                draft.sideBar[menu].form[index].formOptions = items
              })
            )
          }
        });
      }
    })

    let activateVisualizerSelect = event.currentTarget.getAttribute("visualizerselect")

    // toggle edge selection
    if (activateVisualizerSelect === 'edges') {
      if (!this.state.viewButtons[3].checked) {
        this.handleViewerClick("edgeSelect");
      }
      // toggle face selection
    } else if (activateVisualizerSelect === 'faces') {
      if (!this.state.viewButtons[2].checked) {
        this.handleViewerClick("faceSelect");
      }
    } else {
      if (this.state.viewButtons[2].checked) {
        this.handleViewerClick("faceSelect");
      };
      if (this.state.viewButtons[3].checked) {
        this.handleViewerClick("edgeSelect");
      };
    }
  }

  sidebarFormValidator(formData) {
    /* Validation of the entered data
    set the validation fields in red in UI,
    Returns false if the entries are not validated. 
    */
    let validated = true
    for (const [name, data] of Object.entries(formData.data)) {

      var validation = data.validation;

      if (validation) {
        // find the index of form entry based on id
        let index = this.state.sideBar[formData.name].form.findIndex(({ id }) => id === name)
        if (
          (validation.characterLength && data.value.length !== validation.characterLength) ||
          (validation.minValue != null && (validation.minValue > parseFloat(data.value) || isNaN(data.value))) ||
          (validation.maxValue != null && (validation.maxValue < parseFloat(data.value) || isNaN(data.value))) ||
          (validation.required != null && !(data.value.length != 0 || data.value.name))
        ) {
          this.setState(
            produce(draft => {
              draft.sideBar[formData.name].form[index].isInvalid = true
            })
          );
          validated = false;
        } else {
          this.setState(
            produce(draft => {
              draft.sideBar[formData.name].form[index].isInvalid = false
            })
          );
        }
      }
    }
    return validated
  }

  // read submitted form data, and pass data to form handler
  handleSidebarSubmit(formData) {
    let validated = this.sidebarFormValidator(formData);
    if (validated) {
      if (formData.name === "uploadStep") {
        // upload Step file
        $.ajax({
          url: `../../../uploadStep/${project}/${formData.data.upload.value.name}`,
          processData: false,
          datatype: 'json',
          type: 'POST',
          data: formData.data.upload.value,
          success: (data) => {
            var response = JSON.parse(data);
            this.setState(
              produce(draft => {
                draft.visualizer.faces.data = response.faces;
                draft.visualizer.edges.data = response.edges;
                draft.visualizer.boundingBox.data = response.boundingBox;
                draft.visualizer.faces.visibility = false;
                draft.visualizer.geometryUpdated = true;
                draft.visualizer.points.data = [];
                draft.viewButtons[0].disabled = false;
                draft.viewButtons[1].disabled = false;
                draft.viewButtons[2].disabled = false;
                draft.viewButtons[3].disabled = false;
              })
            )
            this.handleViewerClick("iso");
          },
          error: (data) => {
            this.setState({ error: true, errorMessage: data.responseText })
          }
        });
      }
      // generate mesh
      else if (formData.name === "mesher") {
        $.ajax({
          url: `../../../mesher/${project}`,
          datatype: 'json',
          type: 'POST',
          data: {
            meshSize: formData.data.mesher.value
          },

          success: (data) => {
            var response = JSON.parse(data);
            this.setState(
              produce(draft => {
                draft.visualizer.geometryUpdated = true;
                draft.visualizer.cameraUpdated = false;
                draft.visualizer.faces.data = response.faces;
                draft.visualizer.faces.visibility = true;
                draft.visualizer.edges.data = response.edges;
                draft.visualizer.points.data = response.points;
              })
            )
          },
          error: (data) => {
            this.setState({ error: true, errorMessage: data.responseText })
          }
        });
      }
      // handle config menus
      else {
        var postData = {};
        for (const [key, value] of Object.entries(formData.data)) {
          postData[key] = value.value;
        }
        if (this.state.sideBar[formData.name].visualizerSelect === "edges") {
          if (tempBC.edges.length < 1) {
            this.setState({ error: true, errorMessage: "please select at least 1 edge" })
          } else {
            postData["edges"] = JSON.stringify(tempBC.edges);
          }
        } else if (this.state.sideBar[formData.name].visualizerSelect === "faces") {
          if (tempBC.faces.length < 1) {
            this.setState({ error: true, errorMessage: "please select at least 1 face" })
          } else {
            postData["faces"] = JSON.stringify(tempBC.faces);
          }
        }

        $.ajax({
          url: `../../../solverConfig/${project}?category=${formData.name}&id=${this.state.sideBarEditId}`,
          datatype: 'json',
          type: (this.state.sideBarEdit) ? 'PUT' : 'POST',
          data: postData,

          success: (data) => {
            let items = [];
            data ? data.forEach(element => {
              items.push(element.Name) // this is the Name of the entry, should be equal to Name in forms
            }) : null;
            this.setState(
              produce(draft => {
                draft.sideBar[formData.name].cardContent = items
              })
            )
          },
          error: (data) => {
            this.setState({ error: true, errorMessage: data.responseText })
          }
        });

        // set editing to false
        this.setState({ sideBarEdit: false });
      }
    }

  }


  addBoundaryCondition(name, type) {
    /* adds the boundary that has been selected to the viewer, 
    and tempBC that is used to submit the boundaries to the server */
    switch (type) {
      case "face":
        tempBC.faces.push(name)
        break;

      case "edge":
        tempBC.edges.push(name)
        break;

      default:
        console.log("check boundary condition submission name");
    }
  }

  removeBoundaryCondition(name, type) {
    /* removes the boundary that has been selected from the viewer, 
    and tempBC that is used to submit the boundaries to the server */
    switch (type) {
      case "face":
        var index = tempBC.faces.indexOf(name);
        if (index !== -1) tempBC.faces.splice(index, 1);
        break;

      case "edge":
        var index = tempBC.edges.indexOf(name);
        if (index !== -1) tempBC.edges.splice(index, 1);
        break;

      case "removeAll":
        tempBC.faces = [];
        tempBC.edges = [];
        break;

      default:
        console.log("check boundary condition submission name");
    }
  }



  handleChangingFields(event) {
    // change other fields based on selection
    let selected = event.currentTarget.value;
    let fieldChange = JSON.parse(event.currentTarget.getAttribute("fieldChange"));
    var changeInstruction = fieldChange.filter((condition) => condition.selectedField === selected)[0];
    var target = document.getElementById(`formGroup-${changeInstruction.targetId}`);
    target.children[1].value = "";
    var formName = target.parentElement.name;
    if (changeInstruction.changingfields === "hide") {
      target.style.display = "none";
    } else {
      target.style.display = "block";
      // var form = this.state.sideBar[formName].form.filter((targetElement)=> targetElement.id == changeInstruction.targetId)[0];
      this.setState(
        produce(draft => {
          var form = draft.sideBar[formName].form;
          form.forEach((item, num) => {
            if (item.id === changeInstruction.targetId) {
              changeInstruction.changingfields.forEach((field, index) => {
                draft.sideBar[formName].form[num][field] = changeInstruction.changeTo[index];
              })
            }
          })

        })
      )
    }
  }

  handleViewerClick(buttonName) {
    let boundingBox = this.state.visualizer.boundingBox.data;
    var center = {
      x: (boundingBox.lowX + boundingBox.highX) / 2.0,
      y: (boundingBox.lowY + boundingBox.highY) / 2.0,
      z: (boundingBox.lowZ + boundingBox.highZ) / 2.0
    }
    let fitDistance = Math.max(
      (boundingBox.highX - boundingBox.lowX),
      (boundingBox.highY - boundingBox.lowY),
      (boundingBox.highZ - boundingBox.lowZ)
    ) / Math.tan(Math.PI * 70 / 360);

    switch (buttonName) {
      case "iso":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = true;
            draft.visualizer.camera.position.x = center.x + fitDistance;
            draft.visualizer.camera.position.y = center.y - fitDistance;
            draft.visualizer.camera.position.z = center.z + fitDistance;
            draft.visualizer.camera.lookAt = center;
            draft.visualizer.camera.up = { x: 0, y: 0, z: 1 };
          })
        )
        break;

      case "front":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = true;
            draft.visualizer.camera.position.x = center.x;
            draft.visualizer.camera.position.y = center.y - fitDistance;
            draft.visualizer.camera.position.z = center.z;
            draft.visualizer.camera.lookAt = center;
            draft.visualizer.camera.up = { x: 0, y: 0, z: 1 };
          })
        )
        break;

      case "left":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = true;
            draft.visualizer.camera.position.x = center.x - fitDistance
            draft.visualizer.camera.position.y = center.y;
            draft.visualizer.camera.position.z = center.z;
            draft.visualizer.camera.lookAt = center;
            draft.visualizer.camera.up = { x: 0, y: 0, z: 1 };
          })
        )
        break;

      case "right":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = true;
            draft.visualizer.camera.position.x = center.x + fitDistance;
            draft.visualizer.camera.position.y = center.y;
            draft.visualizer.camera.position.z = center.z;
            draft.visualizer.camera.lookAt = center;
            draft.visualizer.camera.up = { x: 0, y: 0, z: 1 };
          })
        )
        break;

      case "back":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = true;
            draft.visualizer.camera.position.x = center.x;
            draft.visualizer.camera.position.y = center.y + fitDistance;
            draft.visualizer.camera.position.z = center.z;
            draft.visualizer.camera.lookAt = center;
            draft.visualizer.camera.up = { x: 0, y: 0, z: 1 };
          })
        )
        break;

      case "top":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = true;
            draft.visualizer.camera.position.x = center.x;
            draft.visualizer.camera.position.y = center.y;
            draft.visualizer.camera.position.z = center.z + fitDistance
            draft.visualizer.camera.lookAt = center;
            draft.visualizer.camera.up = { x: 0, y: 1, z: 0 };
          })
        )
        break;

      case "bot":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = true;
            draft.visualizer.camera.position.x = center.x;
            draft.visualizer.camera.position.y = center.y;
            draft.visualizer.camera.position.z = center.z - fitDistance
            draft.visualizer.camera.lookAt = center;
            draft.visualizer.camera.up = { x: 0, y: -1, z: 0 };
          })
        )
        break;

      case "fit":
        let visualizer = new ThreeJSViewer();
        let currentCameraPosition = visualizer.cameraPosition()
        let directionMag = Math.sqrt(
          Math.pow((currentCameraPosition.x - center.x), 2) +
          Math.pow((currentCameraPosition.y - center.y), 2) +
          Math.pow((currentCameraPosition.z - center.z), 2));

        let direction = {
          x: (currentCameraPosition.x - center.x) / directionMag,
          y: (currentCameraPosition.y - center.y) / directionMag,
          z: (currentCameraPosition.z - center.z) / directionMag,
        }

        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = true;
            draft.visualizer.camera.position.x = center.x + fitDistance * direction.x;
            draft.visualizer.camera.position.y = center.y + fitDistance * direction.y;
            draft.visualizer.camera.position.z = center.z + fitDistance * direction.z;
            draft.visualizer.camera.lookAt = center;
            draft.visualizer.camera.up = visualizer.cameraUp();
          })
        )
        break;

      case "faceSelect":
        var faceSelectStatus = this.state.viewButtons[2].checked;
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = false;
            draft.viewButtons[2].checked = !faceSelectStatus;
            draft.viewButtons[3].checked = false;
            draft.visualizer.select.enabled = !faceSelectStatus;
            draft.visualizer.select.type = !faceSelectStatus ? "face" : null;
          })
        )
        break;

      case "edgeSelect":
        var edgeSelectStatus = this.state.viewButtons[3].checked;
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = false;
            draft.viewButtons[3].checked = !edgeSelectStatus;
            draft.viewButtons[2].checked = false;
            draft.visualizer.select.enabled = !edgeSelectStatus;
            draft.visualizer.select.type = !edgeSelectStatus ? "edge" : null;
          })
        )
        break;

      // background color for threejs
      case "bgColor":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = false;
            draft.bgColor = "#ffffff"
          })
        )
        break;
      case "bgdarkgray":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = false;
            draft.bgColor = "#a9a9a9"
          })
        )
        break;
      case "bgwheat":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = false;
            draft.bgColor = "#F5DEB3"
          })
        )
        break;
      case "bgindigo":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = false;
            draft.bgColor = "#4B0082"
          })
        )
        break;
      case "bgnavy":
        this.setState(
          produce(draft => {
            draft.visualizer.geometryUpdated = false;
            draft.visualizer.cameraUpdated = false;
            draft.bgColor = "#000080"
          })
        )
        break;

      default:
        console.log("Error: check the button name")
        break;

    }
  }

  updateConfigFromServer() {
    // getting existing configurations from server 
    for (const menu of Object.keys(this.state.sideBar)) {
      if (
        menu !== "importGeometry" ||
        menu !== "uploadStep" ||
        menu !== "mesher"
      ) {
        $.ajax({
          url: `../../../solverConfig/${project}?category=${menu}`,
          datatype: 'json',
          type: 'GET',
          success: (data) => {
            let items = [];
            data ? data.forEach(element => {
              items.push(element.Name) // this is the Name of the entry, should be equal to Name in forms
            }) : null;
            this.setState(
              produce(draft => {
                draft.sideBar[menu].cardContent = items
              })
            )
          }
        });
      }

    }
  }

  getGeometryIfExists() {
    /* gets the geometry from the server if there is one imported before */
    $.ajax({
      url: `../../../visualizationMesh/${project}`,
      datatype: 'json',
      type: 'GET',
      success: (data) => {
        this.setState(
          produce(draft => {
            draft.visualizer.faces.data = JSON.parse(data).faces;
            draft.visualizer.edges.data = JSON.parse(data).edges;
            draft.visualizer.boundingBox.data = JSON.parse(data).boundingBox;
            draft.visualizer.faces.visibility = false;
            draft.visualizer.geometryUpdated = true;
            draft.visualizer.points.data = [];
            draft.viewButtons[0].disabled = false;
            draft.viewButtons[1].disabled = false;
            draft.viewButtons[2].disabled = false;
            draft.viewButtons[3].disabled = false;
          })
        )
        setTimeout(() => this.handleViewerClick("iso"), 1000);
      },
      error: (data) => {
        console.log("failed:", data)
      }
    });
  }

  getOptions() {

    // updates the select menus if they depends on the exisiting entries in the database 
    // for example it shows the created preforms in the section menu
    for (const [menu, items] of Object.entries(this.state.sideBar)) {
      if (
        menu !== "importGeometry" ||
        menu !== "uploadStep" ||
        menu !== "mesher"
      ) {
        items.form.forEach((input, index) => {
          if (Boolean(input.optionsFrom)) {
            $.ajax({
              url: `../../../solverConfig/${project}?category=${input.optionsFrom}`,
              datatype: 'json',
              type: 'GET',
              success: (data) => {
                let items = [];
                Boolean(data) ? data.forEach((element) => {
                  items.push(
                    { label: element.Name, value: element.Name }
                  )
                }) : null;
                this.setState(
                  produce(draft => {
                    draft.sideBar[menu].form[index].formOptions = items
                  })
                )
              }
            });
          }
        })
      }
    }
  }

  componentDidMount() {
    this.getGeometryIfExists()
    this.updateConfigFromServer()
    this.getOptions()
  }

  render() {
    return (
      <>
        <Container fluid style={{ paddingLeft: 0, paddingRight: 0, height: "100%", overflowX: "hidden" }}>
          <this.modalAlert />
          <Row noGutters style={{ backgroundColor: this.state.bgColor, height: "100%" }}>
            <Col xs={3} key="sideBar">
              <SideBar
                handleSidebarSubmit={this.handleSidebarSubmit}
                sideBarItems={this.state.sideBar}
                sideBarEdit={this.state.sideBarEdit}
                handleSidebarClick={this.handleSidebarClick}
                handleChangingFields={this.handleChangingFields}
                submitAnalysis={this.handleSidebarSubmitAnalysis}
                handleSideBarRemoveFromCard={this.handleSideBarRemoveFromCard}
                handleSideBarEdit={this.handleSideBarEdit}
              />
              <Alert show={this.state.error} variant="danger" onClose={() => this.setState({ error: false })} dismissible>
                <Alert.Heading>Error!</Alert.Heading>
                <p>
                  {this.state.errorMessage}
                </p>
              </Alert>
            </Col>
            <Col xs={9} key="viewer">
              <div style={{ position: "relative", textAlign: "center" }}>
                <ThreeJSViewer
                  visualizerItems={this.state.visualizer}
                  addBoundaryCondition={this.addBoundaryCondition}
                  removeBoundaryCondition={this.removeBoundaryCondition} />
                <div style={{ position: "fixed", display: "inline-block", top: "2%", left: "45%" }}>
                  <ViewButtons items={this.state.viewButtons} handleViewerClick={this.handleViewerClick} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
export default App;
