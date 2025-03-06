export const numbers2Config = {
    name: "67890_menu",
    tiles: [
      {
        type: "textarea",
        colspan: 2 // This tile spans 2 columns
      },
      {
        type: "letter",
        label: ".",
        action: { type: "enter_letter", value: "." }
      },
      {
        type: "switch",
        label: "back",
        action: { type: "switch_view", layout: "writing" }
      },
      {
        type: "letter",
        label: "6",
        action: { type: "enter_letter", value: "6" }
      },
      {
        type: "letter",
        label: "7",
        action: { type: "enter_letter", value: "7" }
      },
      {
        type: "letter",
        label: "8",
        action: { type: "enter_letter", value: "8" }
      },
      {
        type: "letter",
        label: "9",
        action: { type: "enter_letter", value: "9" }
      },
      {
        type: "letter",
        label: "0",
        action: { type: "enter_letter", value: "0" }
      },
      {
        type: "empty",
        label: ""
      },
      {
        type: "empty",
        label: ""
      },
      {
        type: "empty",
        label: ""
      }
    ]
  };