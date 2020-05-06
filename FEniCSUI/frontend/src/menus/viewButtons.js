// defining the view botton
const viewButtons = [
    {
      name: "iso", icon: "faCube", disabled: true, type: "dropDown",
      menuItems: [
        { name: "front", icon: "front" },
        { name: "left", icon: "left" },
        { name: "right", icon: "right" },
        { name: "back", icon: "back" },
        { name: "top", icon: "top" },
        { name: "bot", icon: "bot" }
      ]
    },
    {
      name: "fit", icon: "faExpandArrowsAlt", disabled: true, type: "button"
    },
    { name: "faceSelect", icon: "faObjectUngroup", type: "checkBox", disabled: true, checked: false },
    { name: "edgeSelect", icon: "faObjectGroup", type: "checkBox", disabled: true, checked: false },
    {
      name: "bgColor", icon: "faFillDrip", disabled: false, type: "dropDown",
      menuItems: [
        { name: "bgdarkgray", icon: "faSquare", color: "darkgray" },
        { name: "bgwheat", icon: "faSquare", color: "wheat" },
        { name: "bgindigo", icon: "faSquare", color: "indigo" },
        { name: "bgnavy", icon: "faSquare", color: "navy" },
      ]
    },
  ]

export default viewButtons;