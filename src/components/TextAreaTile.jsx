import React, { useEffect, useRef } from "react";
import { globalCursorPosition, cursorEventTarget, updateGlobalCursorPosition } from "../singleton/cursorSingleton";

const TextAreaTile = ({ value, onChange, colspan = 2, customStyle }) => {
  const inputRef = useRef(null);
  useEffect(() => {
    const handleCursorUpdate = (event) => {
      inputRef.current.setSelectionRange(globalCursorPosition.value, globalCursorPosition.value);
      inputRef.current.focus();
      
    };
    cursorEventTarget.addEventListener("cursorUpdated", handleCursorUpdate);

    return () => {
      cursorEventTarget.removeEventListener("cursorUpdated", handleCursorUpdate);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(globalCursorPosition.value, globalCursorPosition.value);
      inputRef.current.focus();
    }
  }, [value]);

  return (
    <div className="tile textarea-tile" style={{ gridColumn: `span ${colspan}` }}>
      <textarea ref={inputRef} value={value}  id="text_region" style={customStyle} />
    </div>
  );
};

export default TextAreaTile;
