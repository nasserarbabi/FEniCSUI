import config from './config';

// define the initial structure of the sidebar
const sideBarItems =
{
  importGeometry: {
    label: "OnShape Import",
    icon: "faFileImport",
    popoverState: false,
    form: [
      { id: "input_did", as: "input", label: "did:", placeholder: "Enter did", default: "3540b67dfbd4305386dbaf66", isInvalid: false, invalidFeedback: "Please provide the 24 character did of the part from OnShape", validation: { characterLength: 24, minValue: null, maxValue: null } },
      { id: "input_wid", as: "input", label: "wid:", placeholder: "Enter wid", default: "754620732409e7f522ebba16", isInvalid: false, invalidFeedback: "Please provide the 24 character wid of the part from OnShape", validation: { characterLength: 24, minValue: null, maxValue: null } },
      { id: "input_eid", as: "input", label: "eid:", placeholder: "Enter eid", default: "37fd466866dfdb249cc25be8", isInvalid: false, invalidFeedback: "Please provide the 24 character eid of the part from OnShape", validation: { characterLength: 24, minValue: null, maxValue: null } }
    ],
    formButtons: [
      { id: "submit-import", label: "Import", type: "primary" }
    ],
    cardShow: false,
    cardContent: [projectName]
  },

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