import React from "react";
import BaseKeyboardGrid from "./BaseKeyboardGrid";
import * as CmdConst from "../constants/cmdConstants";
import { getKeyboardGridV1Consts } from "../util/keyboardGridUtils";
import Tile from "./Tile";

const KeyboardGridV1 = (props) => {
  const {
    rows = 3,
    cols = 4,
    textAreaColSpan = 2,
    view,
    suggestions,
    letterSuggestions = ["e", "t", "a", "space", "o", "i", "r"],
    nextLetters,
    onTileActivate,
    dwellTime,
    logEvent,
    counterStarted,
    setTextValue,
    handleTextAreaChange,
    textValue,
    textFontSize,
    handleLetterSelected,
    isTesting,
    inputEnabledForTests,
  } = props;


  const baseTiles = view.tiles.filter(t => t.type !== "textarea");

  const remainingTiles = cols * rows - textAreaColSpan - baseTiles.length;
  const { spaceIdx } = getKeyboardGridV1Consts(cols, rows);
  return (
    <BaseKeyboardGrid
      {...props}
      rows={rows}
      cols={cols}
      textAreaConfig={{ row:1, col:1, colSpan:textAreaColSpan }}
      renderDynamic={(idx, row, col) => {
        // skip textarea
        if (row === 1 && col <= textAreaColSpan) {
          return;
        }

        // shift left after textarea
        const pos = idx < textAreaColSpan
          ? idx
          : idx - textAreaColSpan;

        // config tiles
        if (pos < baseTiles.length) {
          const tile = baseTiles[pos];
          if (tile.action?.type === "show_suggestions") {
            const preview = suggestions.slice(0,4).join("\n");
            return {
              key:`base-${idx}`,
              tile:{
                ...tile,
                label: preview,
                customStyle:{ whiteSpace:"pre-line", color:"#0f0", lineHeight: "1" },
                action:{ type:"show_suggestions" }
              }
            };
          }
          
          return {
            key:`base-${idx}`,
            tile:{
              ...tile,
              customStyle:{
                color:
                  tile.label === "Back"       ? "#0f0"
                  : tile.type === "switch"    ? "#ff0"
                  :                            "#fff"
              }
            }
          };
        }

        // suggestions view
        if (view.name === "suggestions") {
          const sugIdx = pos - baseTiles.length;
          if (sugIdx >= 0 && sugIdx < remainingTiles) {
            return {
              key:`sug-${sugIdx}`,
              tile:{
                label: suggestions[sugIdx] || "",
                is_dynamic:true,
                action:{
                  type:"insert_suggestion",
                  value: suggestions[sugIdx]
                }
              }
            };
          }
        }

        // writing view
        if (view.name === "writing") {
          // hardcoded space position
          if (idx === spaceIdx) {
            return {
              key:"Space",
              tile:{
                label:"Space",
                action:{ type:CmdConst.ENTER_LETTER, value:" " }
              }
            };
          }
          // letter suggestions
          const basePos  = pos - baseTiles.length;
          const letterIdx = idx < spaceIdx
            ? basePos
            : basePos - 1;
          if (letterIdx >= 0 && letterIdx < remainingTiles - 1) {
            const letter = letterSuggestions[letterIdx];
            return {
              key: `let-${letterIdx}`,
              tile: {
                label: letter,
                is_dynamic: true,
                action: { type: "insert_letter_suggestion", value: letter },
                surroundingLetters: nextLetters[letterIdx]
              },
              extraProps: { onLetterSelected: handleLetterSelected }
            };
          }
        }
        // the rest tiles are blank
        return;
      }}
    />
  );
};

KeyboardGridV1.properties = {
  textAreaColSpan: 2,
  rows: 3,
  cols: 4,
};

export default KeyboardGridV1;
