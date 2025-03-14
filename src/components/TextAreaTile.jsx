import React, { useEffect, useRef, useState } from "react";
import { globalCursorPosition, cursorEventTarget, updateGlobalCursorPosition } from "../singleton/cursorSingleton";
import "./TextAreaTile.css";  // Import the external CSS file

const TextAreaTile = ({ value, onChange, colspan = 2, customStyle }) => {
  const inputRef = useRef(null);
  const displayRef = useRef(null);
  const [caretStyle, setCaretStyle] = useState("caret-bar"); // Default caret style

  useEffect(() => {
    const handleCursorUpdate = (event) => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(globalCursorPosition.value, globalCursorPosition.value);
        inputRef.current.focus();
        updateDisplay();
      }
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
      updateDisplay();
    }
  }, [value]);
  
  // Function to update the display with custom caret
  const updateDisplay = () => {
    if (!inputRef.current || !displayRef.current) return;
    
    const text = inputRef.current.value;
    const cursorPos = inputRef.current.selectionStart;
    
    // Split text into before and after cursor
    const beforeCursor = text.substring(0, cursorPos);
    const afterCursor = text.substring(cursorPos);
    
    // Create content with caret
    let content = '';
    
    // Before cursor text
    content += beforeCursor;
    
    // Add caret
    if (caretStyle === 'caret-block' && afterCursor.length > 0) {
      content += `<span class="caret ${caretStyle}">${afterCursor.charAt(0)}</span>`;
      content += afterCursor.substring(1);
    } else {
      content += `<span class="caret ${caretStyle}">${afterCursor.length > 0 ? '' : ' '}</span>`;
      content += afterCursor;
    }
    
    displayRef.current.innerHTML = content;
  };
  
  // Event handlers for textarea
  const handleInput = () => updateDisplay();
  const handleClick = () => {
    if (inputRef.current) {
      updateGlobalCursorPosition(inputRef.current.selectionStart);
      updateDisplay();
    }
  };
  const handleKeyUp = handleClick;
  const handleKeyDown = (e) => {
    setTimeout(() => {
      if (inputRef.current) {
        updateGlobalCursorPosition(inputRef.current.selectionStart);
        updateDisplay();
      }
    }, 10);
  };
  
  return (
    <div className="tile textarea-tile" style={{ gridColumn: `span ${colspan}` }}>
      <div className="textarea-container" style={customStyle}>
        <textarea
          readOnly
          ref={inputRef}
          value={value}
          id="text_region"
          className="text-region"
          onInput={handleInput}
          onClick={handleClick}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
        />
        <div 
          ref={displayRef} 
          className="text-display" 
        />
      </div>
    </div>
  );
};

export default TextAreaTile;
