export const special_chars1Config = {
    name: "():?+./=_menu",
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
          label: "(",
          action: { type: "enter_letter", value: "(" }
        },
        {
          type: "letter",
          label: ")",
          action: { type: "enter_letter", value: ")" }
        },
        {
          type: "letter",
          label: ":",
          action: { type: "enter_letter", value: ":" }
        },
        {
          type: "letter",
          label: "?",
          action: { type: "enter_letter", value: "?" }
        },
        {
          type: "letter",
          label: "+",
          action: { type: "enter_letter", value: "+" }
        },
        {
          type: "letter",
          label: "/",
          action: { type: "enter_letter", value: "/" }
        },
        {
          type: "letter",
          label: "=",
          action: { type: "enter_letter", value: "=" }
        },
        {
          type: "letter",
          label: "_",
          action: { type: "enter_letter", value: "_" }
        }
      ]
  };