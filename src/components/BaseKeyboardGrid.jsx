// src/components/BaseKeyboardGrid.jsx
import React from "react";
import TextAreaTile from "./TextAreaTile";
import Tile from "./Tile";

const BaseKeyboardGrid = ({
  rows,
  cols,
  textAreaConfig,
  renderDynamic,
  view,
  textValue,
  setTextValue,
  handleTextAreaChange,
  onTileActivate,
  suggestions,
  letterSuggestions,
  dwellTime,
  buttonFontSize,
  textFontSize,
  nextLetters,
  handleLetterSelected,
  logEvent,
  counterStarted,
  isTesting,
  inputEnabledForTests
}) => {
  const total = rows * cols;
  const baseProps = { onActivate: onTileActivate, dwellTime, logEvent, counterStarted, isTesting, inputEnabledForTests };


  return (
    <div
      className="keyboard-grid"
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        width: "100%",
        height: "100%",
      }}
    >
      {[...Array(total)].map((_, idx) => {
        const row = Math.floor(idx/cols)+1;
        const col = (idx % cols)+1;

        // 1) textarea
        if (row === textAreaConfig.row && col === textAreaConfig.col) {
          return (
            <TextAreaTile
              key={`textarea-${idx}`}
              value={textValue}
              onChange={handleTextAreaChange||setTextValue}
              colspan={textAreaConfig.colSpan}
              customStyle={{ fontSize: `${textFontSize}px` }}
              logEvent={logEvent}
              counterStarted={counterStarted}
              style={{
                gridRowStart: row,
                gridColumnStart: col,
                gridColumnEnd: col + textAreaConfig.colSpan,
              }}
            />
          );
        }

        if (row === textAreaConfig.row && col > textAreaConfig.col && col < textAreaConfig.col + textAreaConfig.colSpan) {
          return;
        }

        const spec = renderDynamic(idx, row, col);
        if (!spec) {
          return <div key={idx} />;
        }
        return (
          <Tile
            key={spec.key}
            tile={spec.tile}
            {...baseProps}
            {...(spec.extraProps||{})}
          />
        );
      })}
    </div>
  );
};

export default BaseKeyboardGrid;
