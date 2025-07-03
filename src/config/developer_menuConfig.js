export const development_menuConfig = {
    name: "development_menu",
    tiles: [
        
        {
          type: "switch",
          label: "Test Tracker",
          action :{type :"switch_layout", value : "tracker" }
        },
        {
          type: "switch",
          label: "Start Test",
          action :{type :"switch_view", view : "test" }
        },
        {
          type: "switch",
          label: "Test Measurement",
          action :{type :"switch_layout", value : "measurement" }
        },
        {
            type : "switch",
            label : "Back",
            action : {type : "switch_view", view : "main_menu" }
        },
        {
            type: "switch",
            label: "play alarm",
            action: { type: "play_alarm" }
          },
 
          
      ]
  };