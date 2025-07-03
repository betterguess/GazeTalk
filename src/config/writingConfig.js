export const writingConfig = {
    name: "writing",
    tiles: [
       
        {
          type: "textarea",
          colspan: 2 
        },
        {
          type: "delete",
          label: "DELETE",
          action: { type: "delete_letter" }
        },
        {
          type: "switch",
          label: "ABCD...",
          action: { type: "switch_view", view: "writing_submenu" }
        },
        {
          type: "letter", 
          label: "",
          surroundingLetters: [],
          action: { type: "show_suggestions", value: "" }
        },
        
      ]
  };