export const adjust_font_sizeConfig = {
    name: "adjust_font_size",
    tiles: [
        {
          type: "textarea",
          colspan: 2
        },
        {
          type: "switch",
          label: "Back",
          action: { type: "switch_view", view: "main_menu" }
        },
        {
            type : "decrease_button_font_size",
            label: "- button font size",
            action : {type : "decrease_button_font_size"}
        },
        {
            type : "increase_button_font_size",
            label: "+ button font size",
            action : {type : "increase_button_font_size"}
        },
        {
            type : "decrease_text_font_size",
            label: "- written text size",
            action : {type : "decrease_text_font_size"}  
        },
        {
          type : "increase_text_font_size",
          label: "+ written text size",
          action : {type : "increase_text_font_size"}
        },
      ]
  };