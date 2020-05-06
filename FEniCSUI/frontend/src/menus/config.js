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
        label: "Resin:",
        placeholder: "Resin name",
        default: "",
        isInvalid: false,
        invalidFeedback: "Please enter a valid name",
        validation: { required: true }
      },
      {
        id: "resinViscosity",
        as: "input",
        label: "Viscosity:",
        placeholder: "0.05",
        default: "",
        isInvalid: false,
        invalidFeedback: "Please enter viscosity in the range of 0.05 to 1e5",
        validation: { characterLength: null, minValue: 0.05, maxValue: 1e5, required: true }
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
        label: "BCs Name:",
        placeholder: "BC_1",
        default: "",
        isInvalid: false,
        invalidFeedback: "Please enter a valid name",
        validation: { required: true }
      },
      {
        id: "BCType",
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
        hides:
        {
          element: "pressure",
          condition: "wall"
        }
      },
      {
        id: "pressure",
        as: "input",
        label: "Pressure:",
        placeholder: "Boundary Pressure [Pa]",
        default: "10",
        isInvalid: false,
        invalidFeedback: "Please enter Pressure in the range of 10 to 1e9",
        validation: { minValue: 10, maxValue: 1e9 },
      }
    ],
    formButtons: [
      { id: "submit-BCs", label: "Apply BCs" }
    ],
    visualizerSelect: "edges", // options are edges, faces, false
    cardShow: false,
    cardContent: [],
  },

  preforms: {
    label: "Preforms",
    icon: "faLayerGroup",
    popoverState: false,
    form: [
      {
        id: "Name", // it should start with a capital letter, do not use name
        as: "input",
        label: "Name:",
        placeholder: "preform 1",
        default: "",
        isInvalid: false,
        invalidFeedback: "Please enter a valid name",
        validation: { required: true },
      },
      {
        id: "thickness",
        as: "input",
        label: "Thickness:",
        placeholder: "0.01",
        default: "",
        isInvalid: false,
        invalidFeedback: "Please enter a value between 0.001 and 1",
        validation: { minValue: 0.001, maxValue: 1, required: true },
      },
      {
        id: "phi",
        as: "input",
        label: "Volume Fraction:",
        placeholder: "0.56",
        default: "",
        helperText: "Please enter a value between 0 and 1",
        isInvalid: false,
        invalidFeedback: "Please enter a value between 0 and 1",
        validation: { minValue: 0, maxValue: 1, required: true },
      },
      {
        id: "K11",
        as: "input",
        label: "K11:",
        placeholder: "1e-10",
        default: "",
        helperText: "Please enter the permeability in 1st direction",
        isInvalid: false,
        invalidFeedback: "Please enter a value between 0 and 1",
        validation: { minValue: 0, maxValue: 1, required: true },
      },
      {
        id: "K12",
        as: "input",
        label: "K12:",
        placeholder: "0",
        default: "",
        helperText: "Please enter the permeability in shear",
        isInvalid: false,
        invalidFeedback: "Please enter a value between 0 and 1",
        validation: { minValue: 0, maxValue: 1, required: true },
      },
      {
        id: "K22",
        as: "input",
        label: "K22:",
        placeholder: "2e-10",
        default: "",
        helperText: "Please enter the permeability in 2st direction",
        isInvalid: false,
        invalidFeedback: "Please enter a value between 0 and 1",
        validation: { minValue: 0, maxValue: 1, required: true },
      },
    ],
    formButtons: [
      { id: "submit-preforms", label: "Create new preform" }
    ],
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
        default: "",
        isInvalid: false,
        invalidFeedback: "Please enter a valid name",
        validation: { required: true },
      },
      {
        id: "preform",
        as: "select",
        type: "select",
        formOptions: [],
        optionsFrom: "preforms",
        label: "Preform:",
        placeholder: "",
        default: "",
        isInvalid: false,
        invalidFeedback: "",
        validation: null,
      },
      {
        id: "rotation",
        as: "input",
        label: "Rotation:",
        placeholder: "0",
        default: "0",
        isInvalid: false,
        invalidFeedback: "Please enter an angle between -90 to 90",
        validation: { minValue: -90, maxValue: 90, required: true },
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
        id: "termination",
        as: "select",
        type: "select",
        formOptions: [
          { label: "Fill Everywhere", value: "fillEverywhere" },
          { label: "Reach Outlet", value: "reachOutlet" },
        ],
        label: "Termination Type:",
        placeholder: "",
        default: "",
        isInvalid: false,
        invalidFeedback: "",
        helperText: 'The analysis might terminate with unfilled region if your choose "Reach Outlet"',
        validation: null,
      },
      {
        id: "endTime",
        as: "input",
        label: "End Time:",
        placeholder: "1000",
        default: "",
        isInvalid: false,
        helperText: 'End time of the analysis',
        invalidFeedback: "Please enter a value greater than 0",
        validation: { required: true, minValue: 0 }
      },
      {
        id: "outputFrequency",
        as: "input",
        label: "Output time step:",
        placeholder: "0.01",
        default: "",
        isInvalid: false,
        helperText: 'Size of the time step to write output',
        invalidFeedback: "Please enter a value greater than 0",
        validation: { required: true, minValue: 0 }
      },
      {
        id: "maximumIteration",
        as: "input",
        label: "Maximum iteration:",
        placeholder: "10000",
        default: "",
        isInvalid: false,
        helperText: 'Maximum number of iterations',
        invalidFeedback: "Please enter a value greater than 10",
        validation: { required: true, minValue: 10 }
      },
      {
        id: "maximumIdleIteration",
        as: "input",
        label: "Maximum idle iteration:",
        placeholder: "10000",
        default: "",
        isInvalid: false,
        helperText: 'Maximum number of idle iterations',
        invalidFeedback: "Please enter a value greater than 0",
        validation: { required: true, minValue: 0 }
      },
      {
        id: "maximumSaturationChange",
        as: "input",
        label: "Maximum saturation change:",
        placeholder: "0.001",
        default: "",
        isInvalid: false,
        helperText: 'Maximum acceptable change of saturation',
        invalidFeedback: "Please enter a value greater than 0",
        validation: { required: true, minValue: 0 }
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