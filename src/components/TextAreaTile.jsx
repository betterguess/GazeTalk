import React, { useEffect, useRef, useState } from "react";
import { globalCursorPosition, cursorEventTarget, updateGlobalCursorPosition } from "../singleton/cursorSingleton";
import "./TextAreaTile.css";  // Import the external CSS file
import * as TestConstants from "../constants/testConstants/testConstants";

const TextAreaTile = ({ value, onChange, colspan = 2, customStyle, logEvent, counterStarted }) => {
  const inputRef = useRef(null);
  const displayRef = useRef(null);
  const [caretStyle, setCaretStyle] = useState("caret-bar"); 
  const gazeTimerRef = useRef(null);
  const gazedMoreThanThreshold = useRef(false);

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
  
  const updateDisplay = () => {
    if (!inputRef.current || !displayRef.current) return;
  
    const text = inputRef.current.value;
    const cursorPos = inputRef.current.selectionStart;
  
    const beforeCursor = text.substring(0, cursorPos);
    const afterCursor = text.substring(cursorPos);
  
    let content = beforeCursor;
  
    if (caretStyle === 'caret-block' && afterCursor.length > 0) {
      content += `<span class="caret ${caretStyle}">${afterCursor.charAt(0)}</span>`;
      content += afterCursor.substring(1);
    } else {
      content += `<span class="caret ${caretStyle}">${afterCursor.length > 0 ? '' : ' '}</span>`;
      content += afterCursor;
    }
  
    displayRef.current.innerHTML = content;

    const caretElement = displayRef.current.querySelector(".caret");
    if (caretElement) {
      const caretRect = caretElement.getBoundingClientRect();
      const containerRect = displayRef.current.getBoundingClientRect();
  
      if (caretRect.bottom > containerRect.bottom) {
        displayRef.current.scrollTop += caretRect.bottom - containerRect.bottom;
      } else if (caretRect.top < containerRect.top) {
        displayRef.current.scrollTop -= containerRect.top - caretRect.top;
      }
    }
  };
  
  const handleInput = () => updateDisplay();
  const handleClick = () => {
    if (gazeTimerRef.current) {
      clearTimeout(gazeTimerRef.current);
      gazeTimerRef.current = null;
    }
    gazedMoreThanThreshold.current = false;
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

  const handleMouseEnter = () => {
    if (!counterStarted) return;
    gazeTimerRef.current = setTimeout(() => {
      gazedMoreThanThreshold.current = true;
      gazeTimerRef.current = null;
    }, TestConstants.GAZE_MILLISECONDS);
  };

  const handleMouseLeave = () => {
    if (gazeTimerRef.current) {
      clearTimeout(gazeTimerRef.current);
      gazeTimerRef.current = null;
    }
    if (gazedMoreThanThreshold.current) {
      logEvent({ type: TestConstants.TEXT_AREA_GAZED, value: inputRef.current.value });
      gazedMoreThanThreshold.current = false;
    }
  };
  
  return (
    <div 
      className="tile textarea-tile" 
      style={{ gridColumn: `span ${colspan}`}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      >
      <div className="textarea-container" >
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
          style={customStyle}
        />
      </div>
    </div>
  );
};

export default TextAreaTile;
