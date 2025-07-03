export const writing_submenuConfig = {
    name: "writing_submenu",
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
          action: { type: "switch_view", view: "main_menu" }
        },
        {
          type: "switch",
          label: "ABCD\nEFGH",
          action: { type: "switch_view", view: "ABCDEFGH_menu" }
        },
        {
          type: "switch",
          label: "IJKL\nMNOP",
          action: { type: "switch_view", view: "IJKLMNOP_menu" }
        },
        {
          type: "switch",
          label: "QRST\nUVWX",
          action: { type: "switch_view", view: "QRSTUVWX_menu" }
        },
        {
          type: "switch",
          label: "YZÆØ\nÅ,?.._",
          action: { type: "switch_view", view: "YZÆØÅ,?.._menu" }
        },
        {
          type: "switch",
          label: "0-9",
          action: { type: "switch_view", view: "numbers" }
        },
        {
          type: "switch",
          label: "Navigation",
          action: { type: "switch_view", view: "navigation_menu" }
        },
        {
          type : "switch",
          label : "Edit",
          action : { type : "switch_view", view : "edit_menu"}
        }
      ]
  };