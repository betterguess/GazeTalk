export const QRSTUVWX_menuConfig = {
    name: "QRSTUVWX_menu",
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
          action: { type: "switch_layout", layout: "writing" }
        },
        {
          type: "letter",
          label: "Q",
          action: { type: "enter_letter", value: "Q" }
        },
        {
          type: "letter",
          label: "R",
          action: { type: "enter_letter", value: "R" }
        },
        {
          type: "letter",
          label: "S",
          action: { type: "enter_letter", value: "S" }
        },
        {
          type: "letter",
          label: "T",
          action: { type: "enter_letter", value: "T" }
        },
        {
          type: "letter",
          label: "U",
          action: { type: "enter_letter", value: "U" }
        },
        {
          type: "letter",
          label: "V",
          action: { type: "enter_letter", value: "V" }
        },
        {
          type: "letter",
          label: "W",
          action: { type: "enter_letter", value: "W" }
        },
        {
          type: "letter",
          label: "X",
          action: { type: "enter_letter", value: "X" }
        }
      ]
  };