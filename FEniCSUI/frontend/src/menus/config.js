// define the solver configuration
const config =
{
  materials: {
    label: "Materials",
    icon: "faTint",
    popoverState: false,
    form: [
      {
        id: "Name", // for name it should start with a capital letter, do not use name
        as: "input",
        label: "Material Name:",
        placeholder: "water",
        default: "",
        isInvalid: false,
        invalidFeedback: "Please enter a valid name",
        validation: { required: true }
      },
      {
        id: "viscosity",
        as: "input",
        label: "Viscosity:",
        placeholder: "0.001",
        default: "",
        isInvalid: false,
        invalidFeedback: "Please enter viscosity in the range of 0.0001 to 1e5",
        validation: { characterLength: null, minValue: 0.0001, maxValue: 1e5, required: true }
      }
    ],
    formButtons: [
      { id: "submit-material", label: "Set Material" }
    ],
    cardShow: false,
    cardContent: [],
  },

  BCs: {
    label: "Boundary Conditions",
    icon: "faBorderStyle",
    popoverState: false,
    form: [
      {
        id: "Name", // for name it should start with a capital letter, do not use name
        as: "input",
        label: "Name:",
        placeholder: "BC_1",
        default: "",
        isInvalid: false,
        invalidFeedback: "Please enter a valid name",
        validation: { required: true }
      },
      {
        id: "boundaryType",
        as: "select",
        type: "select",
        formOptions: [
          { label: "Inlet", value: "inlet" },
          { label: "Outlet", value: "outlet" },
          { label: "Wall", value: "wall" }
        ],
        label: "Boundary Type:",
        placeholder: "",
        default: "",
        isInvalid: false,
        invalidFeedback: "",
        validation: null,
        // if selecting one field in this input changes another input in this form
        fieldChange: 
          [
            {
              selectedField: "outlet",
              targetId: "value",
              changingfields: ["label", "placeholder"],
              changeTo:["Pressure", "10"]
            },
            {
              selectedField: "inlet",
              targetId: "value",
              changingfields: ["label", "placeholder"],
              changeTo:["Velocity", "[1,0,0]"]
            },
            {
              selectedField: "wall",
              targetId: "value",
              changingfields: "hide",
            }
          ]
      },
      {
        id: "value",
        as: "input",
        label: "Velocity:",
        placeholder: "[1,0,0]",
        default:"",
        isInvalid: false,
        invalidFeedback: "Please enter Pressure in the range of 10 to 1e9",
        validation:null,
      }
    ],
    formButtons: [
      { id: "submit-BCs", label: "Apply BCs" }
    ],
    visualizerSelect: "edges", // options are edges, faces, false
    cardShow: false,
    cardContent: [],
  },
  sections: {
    label: "Sections",
    icon: "faPuzzlePiece",
    popoverState: false,
    form: [
      {
        id: "Name", // for name it should start with a capital letter, do not use name
        as: "input",
        label: "Name:",
        placeholder: "section 1",
        default: "section_1",
        isInvalid: false,
        invalidFeedback: "Please enter a valid name",
        validation: { required: true },
      },
      {
        id: "material",
        as: "select",
        type: "select",
        formOptions: [],
        optionsFrom: "materials",
        label: "Material:",
        placeholder: "",
        default: "",
        isInvalid: false,
        invalidFeedback: "",
        validation: null,
      },
    ],
    formButtons: [
      { id: "submit-sections", label: "Assign Section" }
    ],
    visualizerSelect: "faces", // options are edges, faces, false
    cardShow: false,
    cardContent: [],
  },
  steps: {
    label: "steps",
    icon: "faTint",
    popoverState: false,
    form: [
      {
        id: "Name",
        as: "input",
        label: "Name:",
        placeholder: "Step 1",
        default: "",
        isInvalid: false,
        invalidFeedback: "Please enter a valid name",
        validation: { required: true }
      },
      {
        id: "finalTime",
        as: "input",
        label: "Final time:",
        placeholder: "1",
        default: "1",
        isInvalid: false,
        invalidFeedback: "Please enter a value grater than 0.001",
        helperText: 'The total time of analysis',
        validation: { required: true, minValue: .001, },
      },
      {
        id: "iterationNo",
        as: "input",
        label: "Number of iterations:",
        placeholder: "5000",
        default: "5000",
        isInvalid: false,
        invalidFeedback: "Please enter a value between 1 and 20,000",
        helperText: 'The total time of analysis',
        validation: { required: true, minValue: 1, maxValue: 20000 },
      },
    ],
    formButtons: [
      { id: "submit-steps", label: "Create Step" }
    ],
    cardShow: false,
    cardContent: [],
  },

};

export default config;