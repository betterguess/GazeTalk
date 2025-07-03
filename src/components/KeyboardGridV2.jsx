import React from "react";
import BaseKeyboardGrid from "./BaseKeyboardGrid";
import * as CmdConst from "../constants/cmdConstants";
import { getKeyboardGridV2Consts } from "../util/keyboardGridUtils";

const KeyboardGridV2 = (props) => {
  const {
    cols = 4,
    rows = 5,
    view,
    textValue,
    setTextValue,
    handleTextAreaChange,
    suggestions = [],
    letterSuggestions = ["e", "t", "a", "space", "o", "i", "r"],
    nextLetters = [],
    onTileActivate,
    dwellTime,
    logEvent,
    counterStarted,
    textFontSize,
    handleLetterSelected,
    alphabetPage,
    isTesting,
    inputEnabledForTests,
  } = props;

  const textAreaColSpan = cols - 1;
  const totalCols = cols + 2;
  const totalRows = rows;
  const dynamicStart = 1 + textAreaColSpan;
  const baseTiles = view.tiles.filter((t) => t.type !== "textarea");
  const { ABCDIdx, dotIndex, spaceIdx, editIdx, delIdx, pauseIdx } = getKeyboardGridV2Consts(cols, textAreaColSpan);

  // --- Alphabet --- 
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i)
  );
  const pageSize = totalCols * (totalRows) - baseTiles.length - textAreaColSpan - 1;
  const page = alphabetPage || 0;
  const start = page * pageSize;
  const pageLetters = alphabet.slice(start, start + pageSize);
  const nextPageIdx = totalRows * totalCols - 1;
  // --- Alphabet --- 

  return (
    <BaseKeyboardGrid
      {...props}
      rows={totalRows}
      cols={totalCols}
      textAreaConfig={{ row:1, col:2, colSpan:textAreaColSpan }}
      renderDynamic={(idx,row,col) => {
        // --- WRITING VIEW ---
        if (view.name === "writing") {
          if (idx===ABCDIdx) return {
            key:"switch-abcd",
            tile:{ type:"switch", label:"ABCD…", action:{type:"switch_view",view:"Alphabet_V2"} }
          };
          else if (idx===dotIndex) return {
            key:"dot",
            tile:{ type:"letter",label:".", action:{type:CmdConst.ENTER_LETTER,value:"."} },
            extraProps:{ onLetterSelected: handleLetterSelected }
          };
          else if (idx===spaceIdx) return {
            key:"Space",
            tile:{ label:"Space", is_dynamic:true, action:{type:CmdConst.ENTER_LETTER,value:" "} }
          };
          else if (idx===editIdx) return {
            key:"edit",
            tile:{ label:"Edit", type:"switch", action:{type:CmdConst.SWITCH_VIEW, view:"edit_menu"} }
          };
          else if (idx===delIdx) return {
            key:"delete",
            tile:{ label:"DELETE", action:{type:CmdConst.DELETE_LETTER} }
          };
          else if (idx===pauseIdx) return {
            key:"pause",
            tile:{ label:"Pause", type:"switch",  action:{type:CmdConst.TOGGLE_PAUSE} }
          };
          else if (idx%totalCols === totalCols-1) {// word suggestions in the right side
            return {
              key:`sug-${row - 1}`,
              tile:{
                label: suggestions[row - 1],
                is_dynamic:true,
                action:{type:"insert_suggestion",value:suggestions[row - 1]},
                customStyle: { color: "#0f0" }
              },
            };
          } else {
            // letter‐suggestions in the grid (middle)
            const letterIndex = (row-2)*cols + (col-2);
            const letter = letterSuggestions[letterIndex];
            return {
              key:`let-${letterIndex}`,
              tile:{
                label: letter,
                is_dynamic:true,
                action:{type:"insert_letter_suggestion",value:letter},
                surroundingLetters: nextLetters[letterIndex],
              },
              extraProps:{ onLetterSelected: handleLetterSelected },
              customStyle: {color: "#0f0"}
            };
          }
        }
        const pos = idx < dynamicStart
                ? idx
                : idx - textAreaColSpan;
        if (pos < baseTiles.length) {
            return {
              key: `base-${idx}`,
              tile: baseTiles[pos],
            };
          }
        // --- ALPHABET_V2 VIEW ---
        if (view.name === "Alphabet_V2") {
          const letterStart = dynamicStart + baseTiles.length;
          const letterIndex = idx - letterStart + 1;
          if (letterIndex >= 0 && letterIndex < pageLetters.length) {
            // next: the pageLetters
            const letter = pageLetters[letterIndex];
            return {
              key:`alpha-${letter}`,
              tile:{ type:"letter", label:letter, action:{type:CmdConst.ENTER_LETTER,value:letter} },
              extraProps:{ onLetterSelected: handleLetterSelected }
            };
          }
          //swap pages in alphabet
          if (idx === nextPageIdx) {
            const firstPage = alphabetPage === 0;
            return {
              key:"alpha-nav",
              tile:{
                type:"switch",
                label: firstPage ? "→" : "←",
                action:{
                  type:"switch_view",
                  view:"Alphabet_V2",
                  page: alphabetPage + (firstPage ? 1 : -1)
                }
              }
            };
          }
        }
      }}
    />
  );
};

KeyboardGridV2.properties = {
  textAreaColSpan: 3,
  rows: 5,
  cols: 4,
};

export default KeyboardGridV2;
