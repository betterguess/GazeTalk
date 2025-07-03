export const first_pageConfig = {
    name: "first_page",
    tiles: [
        
        {
          type: "textarea",
          colspan: 2 
        },
        {
          type: "switch",
          label: "Start Tests",
          action: { type: "enter_form", value: "enter_form" }
        },
        {
          type: "Download Data",
          label: "Download Data",
          action: { type: "download_data" }
        },
        {
            type : "switch",
            label : "menu",
            action : { type : "switch_view", view : "main_menu" }
        }
      ]
  };