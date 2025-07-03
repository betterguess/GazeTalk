export const layoutsConfig = {
    name: "layouts",
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
          type: "iconTile",
          label: "3+3x3",
          icon: "/layoutIcons/3+3x3.png",
          action: { type: "switch_layout", value: "3+3x3" }
        },
        {
          type: "iconTile",
          label: "2+2+4x2",
          icon: "/layoutIcons/2+2+4x2.png",
          action: { type: "switch_layout", value: "2+2+4x2" }
        },
        {
          type: "iconTile",
          label: "2+3+5x2",
          icon: "/layoutIcons/2+3+5x2.png",
          action: { type: "switch_layout", value: "2+3+5x2" }
        },
        {
          type: "iconTile",
          label: "2+3+5x3",
          icon: "/layoutIcons/2+3+5x3.png",
          action: { type: "switch_layout", value: "2+3+5x3" }
        },
        {
          type: "iconTile",
          label: "3+3x4",
          icon: "/layoutIcons/3+3x4.png",
          action: { type: "switch_layout", value: "3+3x4" }
        },
        {
          type: "iconTile",
          label: "4+4x4",
          icon: "/layoutIcons/4+4x4.png",
          action: { type: "switch_layout", value: "4+4x4" }
        },
        {
          type: "iconTile",
          label: "2+4+6x4",
          icon: "/layoutIcons/2+4+6x4.png",
          action: { type: "switch_layout", value: "2+4+6x4" }
        },
        {
          type: "iconTile",
          label: "2+4+6x5",
          icon: "/layoutIcons/2+4+6x5.png",
          action: { type: "switch_layout", value: "2+4+6x5" }
        },
        {
          type: "iconTile",
          label: "kbv2_4x4",
          icon: "/layoutIcons/kbv2_4x4.png",
          action: { type: "switch_layout", value: "kbv2_4x4" }
        }
        ,
        {
          type: "iconTile",
          label: "kbv2_4x3",
          icon: "/layoutIcons/kbv2_4x3.png",
          action: { type: "switch_layout", value: "kbv2_4x3" }
        }
      ]
  };