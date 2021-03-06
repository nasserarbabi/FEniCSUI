
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
        isInvalid: false,
        validation: { required: true }
      },
    ],
    formButtons: [
      { id: "submit-upload", label: "Upload", type: "primary" }
    ],
  },
}


export default sideBarItems;