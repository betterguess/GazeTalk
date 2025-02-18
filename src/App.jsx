import React, { useState, useRef } from "react";
import axios from "axios";
import settings from "./settings.json";
import { changeLanguage } from "i18next";
import "./App.css";
import { globalCursorPosition, cursorEventTarget, updateGlobalCursorPosition } from "./singleton/cursorSingleton";

import GenericView from "./views/GenericView";
import AlarmPopup from "./components/AlarmPopup";
import { config } from "./config/config";
import {speakText} from './singleton/textToSpeachSingleton'
import {
  deleteWordAtCursor,
  deleteSentence,
  deleteSection,
  getCurrentLine,
  getCharDistance,
  calcCursorDistance,
  getLastSentence,
  matchCase,
} from './util/textUtils';
import {
  getPreviousSection,
  getNextWord, 
  getNextSentence, 
  getNextSection, 
  getPreviousWord, 
  getPreviousSentence
} from './util/cursorUtils'


let dwellTime = 500;

function App() {
  const [currentLayoutName, setCurrentLayoutName] = useState("main_menu");
  const [textValue, setTextValue] = useState("");
  const [isCapsOn, setIsCapsOn] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const textAreaRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const layout = config.layouts[currentLayoutName] || config.layouts["main_menu"];
  const input = document.getElementById('text_region');

  const [buttonFontSize, setButtonFontSize] = useState(30)
  const [textFontSize, setTextFontSize] = useState(20)




  React.useEffect(() => {
    if (textValue.trim() === "") {
      setSuggestions([]);
      return;
    }
    

    const fetchSuggestions = async () => {

      const textUpToCursor = textValue.slice(0, globalCursorPosition.value)
      try {
        const response = await axios.post("https://cloudapidemo.azurewebsites.net/continuations", {
          locale: "en_US",
          prompt: textUpToCursor,
        });
        setSuggestions(response.data.continuations.slice(0, 8) || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [textValue]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();

        const loremText = "Lorem ipsum, consectetur adipiscing elit, sed do eiusmod.\nnostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
        const cursorPos = input.selectionStart;
        const newText = textValue.slice(0, cursorPos) + loremText + textValue.slice(cursorPos);

        setTextValue(newText);
        updateGlobalCursorPosition(cursorPos + loremText.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [textValue]); // Depend on textValue so it updates properly.


  const handleAction = (action) => {
    if (action.type === "enter_letter") {
      // insert the letter at the global cursor position
      const letter = isCapsOn ? action.value.toUpperCase() : action.value.toLowerCase();
      const newText = textValue.slice(0, globalCursorPosition.value) + letter + textValue.slice(globalCursorPosition.value);
      setTextValue(newText);

      
      updateGlobalCursorPosition(input.selectionStart + 1);
      // always go back to writing layout after entering a letter
      setCurrentLayoutName("writing");

      // if the last letter was punctuation speak it
      if (action.value === ".") {
        const lastSentenceStart = getLastSentence(textValue)
        const lastSentence = textValue.slice(lastSentenceStart, globalCursorPosition.value)
        console.log("last sentence : ", lastSentence)
        speakText(lastSentence)
      }

    } else if (action.type === "newline") {
      // insert a newline at the global cursor position
      const newText = textValue.slice(0, globalCursorPosition.value) + "\n" + textValue.slice(globalCursorPosition.value, textValue.length);
      setTextValue(newText);
      // move the cursor to the next line after inserting a newline
      updateGlobalCursorPosition(globalCursorPosition.value + 1);
    } else if (action.type === "switch_layout") {
      if (config.layouts[action.layout]) {
        setCurrentLayoutName(action.layout);
      }

    } else if (action.type === "delete_letter") {
      // delete the letter at the global cursor position
      const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
      updateGlobalCursorPosition(input.selectionStart - 1);
      setTextValue(newText);


      setCurrentLayoutName("writing");
    } else if (action.type === "delete_letter_edit") {
      const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
      updateGlobalCursorPosition(input.selectionStart - 1);
      setTextValue(newText);


    } else if (action.type === "toggle_case") {
      setIsCapsOn(prev => !prev);

    } else if (action.type === "cursor") {
      const cursorPosition = input.selectionStart;

      if (action.direction === "left") {
        if (cursorPosition === 0) return;
        input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);

      } else if (action.direction === "right") {
        if (cursorPosition === textValue.length) return;
        input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);

      } else if (action.direction === "up") {
        // get current linelength where there is mutlipe lines
        const currentLines = textValue.split("\n");
        // Get the current line the cursor is on
        let line = getCurrentLine(currentLines, cursorPosition);
        if (line === 0) {
          return;
        }
        let previousLine = currentLines[line - 1];
        let previousDistance = getCharDistance(currentLines, line - 1);
        let currentLineLength = currentLines[line].length;
        if (calcCursorDistance() === currentLineLength) {
          const previousLineLength = previousLine.length;
          input.setSelectionRange(previousDistance + previousLineLength, previousDistance + previousLineLength);
        } else {
          input.setSelectionRange(previousDistance + calcCursorDistance(), previousDistance + calcCursorDistance());

        }

      } else if (action.direction === "down") {
        input.focus();
        const currentLines = textValue.split("\n");
        let line = getCurrentLine(currentLines, cursorPosition);
        if (line === currentLines.length - 1) {
          return;
        }
        let nextLine = currentLines[line + 1];
        let nextDistance = getCharDistance(currentLines, line + 1);
        let currentLineLength = currentLines[line].length;
        if (calcCursorDistance() === currentLineLength) {
          const nextLineLength = nextLine.length;
          input.setSelectionRange(nextDistance + nextLineLength, nextDistance + nextLineLength);
        } else {
          input.setSelectionRange(nextDistance + calcCursorDistance(), nextDistance + calcCursorDistance());
        }
      }
      updateGlobalCursorPosition(input.selectionStart);
      input.focus();



    } else if (action.type === "delete_word") {
      const { newText, newCursorPosition } = deleteWordAtCursor(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);

    } else if (action.type === "delete_sentence") {
      const { newText, newCursorPosition } = deleteSentence(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);
    } else if (action.type === "delete_section") {
      const { newText, newCursorPosition } = deleteSection(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);
    } else if (action.type === "undo") {
      // todo
    } else if (action.type === "start_of_text") {
      updateGlobalCursorPosition(0)

    } else if (action.type === "previous_section") {
      let start = getPreviousSection(textValue);
      updateGlobalCursorPosition(start)
    } else if (action.type === "previous_sentence") {
      let start = getPreviousSentence(textValue);
      updateGlobalCursorPosition(start)
    } else if (action.type === "previous_word") {
      let start = getPreviousWord(textValue);
      updateGlobalCursorPosition(start)
    } else if (action.type === "end_of_text") {
      updateGlobalCursorPosition(textValue.length)

    } else if (action.type === "next_section") {
      let end = getNextSection(textValue);
      updateGlobalCursorPosition(end)
    } else if (action.type === "next_sentence") {
      let end = getNextSentence(textValue);
      updateGlobalCursorPosition(end)
    } else if (action.type === "next_word") {
      let end = getNextWord(textValue);
      updateGlobalCursorPosition(end)
    } else if (action.type === "show_suggestions") {
      if (suggestions.length > 0 && suggestions.some(s => s !== undefined)) {
        setShowSuggestions(true);
        setCurrentLayoutName("suggestions");
      }
    } else if (action.type === "insert_suggestion") {
      const suggestion = action.value;

      const cursorPos = globalCursorPosition.value;
      const textUpToCursor = textValue.slice(0, cursorPos);
      const rest = textValue.slice(cursorPos, textValue.length);
      const lastSpaceIndex = textUpToCursor.lastIndexOf(" ");
      const lastWord =
        lastSpaceIndex >= 0
          ? textUpToCursor.slice(lastSpaceIndex + 1)
          : textUpToCursor;
      const replaced = textUpToCursor.slice(0, textUpToCursor.length - lastWord.length);
      const casedSuggestion = matchCase(suggestion, lastWord);
      const newText = replaced + casedSuggestion + " " + rest;
      setTextValue(newText);
      const spaceLength = 1;
      updateGlobalCursorPosition(globalCursorPosition.value + casedSuggestion.length + spaceLength)

    } else if (action.type === "choose_button_layout") {
      settings.buttons_layout = action.value;
    } else if (action.type === "change_language") {
      // language = action.value;
      changeLanguage(action.value);
    } else if (action.type === "change_linger_time") {
      dwellTime = parseFloat(action.value);
      let goBack = {
        type: "switch_layout", layout: "main_menu"
      }
      handleAction(goBack);
    } else if (action.type === "play_alarm") {
      setAlarmActive(true);
    } else if (action.type === 'close_alarm') {
      setAlarmActive(false);
    } else if (action.type === "increase_button_font_size") {
      setButtonFontSize(buttonFontSize < 96 ? buttonFontSize + 1 : buttonFontSize)
    } else if (action.type === "decrease_button_font_size") {
      setButtonFontSize(buttonFontSize > 0 ? buttonFontSize - 1 : buttonFontSize)

    } else if (action.type === "increase_text_font_size") {
      setTextFontSize(textFontSize < 96 ? textFontSize + 1 : textFontSize)
    } else if (action.type === "decrease_text_font_size") {
      setTextFontSize(textFontSize > 0 ? textFontSize - 1 : textFontSize)

    }
    input.focus();    
  };

  return (
    <div className="App">
      <GenericView
        layout={layout}
        textValue={textValue}
        setTextValue={setTextValue}
        handleAction={handleAction}
        fontSize={buttonFontSize}
        textFontSize={textFontSize}
        suggestions={suggestions}
        dwellTime={dwellTime} />
      {alarmActive && <AlarmPopup onClose={() => setAlarmActive(false)} dwellTime={dwellTime} />}
    </div>
  );
}

export default App;
