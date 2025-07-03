export const suggestionsConfig = {
    name: "suggestions",
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
          label: "Back",
          action: { type: "switch_view", view: "writing" }
        }
      ]
  };