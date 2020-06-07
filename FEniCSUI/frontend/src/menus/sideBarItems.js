import {config} from './config';

// define the initial structure of the sidebar
const sideBarItems =
{
  uploadStep: {
    label: "Upload Step File",
    icon: "faFileUpload",
    popoverState: false,
    form: [
      {
        id: "upload",
        as: "input",
        type: "file",
        label: "Choose step file:",
        placeholder: "",
        default: "",
        isInvalid: false,
        invalidFeedback: "",
        validation: { required: true }
      },
    ],
    formButtons: [
      { id: "submit-upload", label: "Upload", type: "primary" }
    ],
    cardShow: false,
    cardContent: [projectName]
  },

  mesher: {
    label: "Mesh",
    icon: "faThLarge",
    popoverState: false,
    form: [
      {
        id: "mesher",
        as: "select",
        type: "select",
        label: "Mesh:",
        placeholder: "",
        default: "Medium",
        validated: false,
        invalidFeedback: null,
        formOptions: [
          { label: "Coarse", value: 0.5 },
          { label: "Medium", value: 0.3 },
          { label: "Fine", value: 0.1 }
        ],
        validation: null,
      },
    ],
    formButtons: [
      { id: "submit-mesher", label: "Mesh", type: "primary" }
    ],
    cardShow: false,
    cardContent: [`${projectName} mesh`]
  }
}

Object.assign(sideBarItems, config)

export default sideBarItems;