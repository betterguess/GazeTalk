export const special_chars2Config = {
    name: "%@;!*",
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
          action: { type: "switch_view", view: "YZÆØÅ,?.._menu" }
        },
        {
          type: "letter",
          label: "\'",
          action: { type: "enter_letter", value: "\'" }
        },
        {
          type: "letter",
          label: "\"",
          action: { type: "enter_letter", value: "\"" }
        },
        {
          type: "letter",
          label: "%",
          action: { type: "enter_letter", value: "%" }
        },
        {
          type: "letter",
          label: "@",
          action: { type: "enter_letter", value: "@" }
        },
        {
          type: "letter",
          label: ";",
          action: { type: "enter_letter", value: ";" }
        },
        {
          type: "letter",
          label: "!",
          action: { type: "enter_letter", value: "!" }
        },
        {
          type: "letter",
          label: "*",
          action: { type: "enter_letter", value: "*" }
        },
        {
          type: "switch",
          label: "More9870",
          action: { type: "switch_view", view: "$£€#__menu" }
        }
      ]
  };