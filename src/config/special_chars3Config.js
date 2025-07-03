export const special_chars3Config = {
    name: "$£€#__menu",
    tiles: [
        {
          type: "textarea",
          colspan: 2 
        },
        {
          type: "letter",
          label: ".",
          action: { type: "enter_letter", value: "." }
        },
        {
          type: "switch",
          label: "Back",
          action: { type: "switch_view", view: "%@;!*" }
        },
        {
          type: "letter",
          label: "$",
          action: { type: "enter_letter", value: "$" }
        },
        {
          type: "letter",
          label: "£",
          action: { type: "enter_letter", value: "£" }
        },
        {
          type: "letter",
          label: "€",
          action: { type: "enter_letter", value: "€" }
        },
        {
          type:"empty",
          label: ""
        },
        {
          type: "letter",
          label: "#",
          action: { type: "enter_letter", value: "#" }
        },
        {
          type: "letter",
          label: "\\",
          action: { type: "enter_letter", value: "\\" }
        },
        {
          type: "letter",
          label: "_",
          action: { type: "enter_letter", value: "_" }
        }
    ]
  };