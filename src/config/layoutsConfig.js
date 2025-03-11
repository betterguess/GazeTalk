export const layoutsConfig = {
    name: "layouts",
    tiles: [
        {
          type: "textarea",
          colspan: 2 // This tile spans 2 columns
        },
        {
          type: "switch",
          label: "back",
          action: { type: "switch_view", view: "main_menu" }
        },
        {
          type: "iconTile",
          icon: "/layoutIcons/3+3x3.png",
          action: { type: "switch_layout", value: "3+3x3" }
        },
        {
          type: "iconTile",
          icon: "/layoutIcons/2+2+4x2.png",
          action: { type: "switch_layout", value: "2+2+4x2" }
        },
        {
          type: "iconTile",
          icon: "/layoutIcons/2+3+5x2.png",
          action: { type: "switch_layout", value: "2+3+5x2" }
        },
        {
          type: "iconTile",
          icon: "/layoutIcons/2+3+5x3.png",
          action: { type: "switch_layout", value: "2+3+5x3" }
        },
        {
          type: "iconTile",
          icon: "/layoutIcons/3+3x4.png",
          action: { type: "switch_layout", value: "3+3x4" }
        },
        {
          type: "iconTile",
          icon: "/layoutIcons/4+4x4.png",
          action: { type: "switch_layout", value: "4+4x4" }
        }
      ]
  };