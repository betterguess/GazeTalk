export const navigation_menuConfig = {
    name : "navigation_menu",
    tiles : [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type : "switch",
          label : "Back",
          action : { type: "switch_view", view : "writing"}
        },
        {
          type : "switch",
          label : "Edit",
          action : { type : "switch_view", view : "edit_menu"}
        },
        {
          type : "switch",
          label : "More functions",
          action:  {type : "switch_view", view : "more_function_menu"}
        },
        {
          type : "cursor",
          label : "cursor to the left",
          action : { type: "cursor", direction : "left"}
        },
        {
          type : "cursor",
          label : "cursor to the right",
          action : { type: "cursor", direction : "right"}
        },
      ]
  };