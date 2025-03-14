import { updateGlobalCursorPosition } from "../singleton/cursorSingleton";
import { speakText } from '../singleton/textToSpeachSingleton';
import * as CmdConst from "../constants/cmdConstants";
import * as UserDataConst from "../constants/userDataConstants";
import {
  getLastSentence,
  matchCase,
} from './textUtils';
import {
  updateRanking,
  updateSetting,
} from "./settingUtil";
import { layoutToButtonNum } from "../constants/layoutConstants";



export const handleAction = (
  action,
  {
    textValue,
    setTextValue,
    setCurrentViewName,
    currentViewName,
    globalCursorPosition,
    updateGlobalCursorPosition,
    isCapsOn,
    setIsCapsOn,
    input,
    userData,
    setUserData,
    speakText,
    alarmActive,
    nextLetterSuggestion,
    setAlarmActive,
    isPaused,
    setIsPaused,
    setNextLetterSuggestion,
    letterSuggestions,
    setLetterSuggestions,
    nextLetters,
    setNextLetters,
    suggestions,
    setSuggestions,
    buttonFontSize,
    setButtonFontSize,
    textFontSize,
    setTextFontSize,
    config,
    setCurrentLayoutName,
    currentLayoutName,
    setShowSuggestions,
    showSuggestions, 
    changeButtonNum,
    buttonNum,
  }
) => {

  switch (action.type) {
    case CmdConst.ENTER_LETTER: {
      // insert the letter at the global cursor position
      const letter = isCapsOn ? action.value.toUpperCase() : action.value.toLowerCase();
      const newText = textValue.slice(0, globalCursorPosition.value) + letter + textValue.slice(globalCursorPosition.value);
      setTextValue(newText);
      
      updateGlobalCursorPosition(input.selectionStart + 1);
      // always go back to writing view after entering a letter
      setCurrentViewName("writing");

      // if the last letter was punctuation speak it
      if (action.value === CmdConst.PERIOD) {
        const lastSentenceStart = getLastSentence(textValue)
        const lastSentence = textValue.slice(lastSentenceStart, globalCursorPosition.value)
        speakText(lastSentence)
      }
      break;
    }
    case CmdConst.NEWLINE: {
        // insert a newline at the global cursor position 
        const newText = textValue.slice(0, globalCursorPosition.value) + "\n" + textValue.slice(globalCursorPosition.value, textValue.length);
        setTextValue(newText);
        // move the cursor to the next line after inserting a newline
        updateGlobalCursorPosition(globalCursorPosition.value + 1);
        break;
    }
    case CmdConst.SWITCH_VIEW: {
        if (config.views[action.view]) {
            setCurrentViewName(action.view);
        }
        break;
    }
    case CmdConst.DELETE_LETTER: {
        // delete the letter at the global cursor position
        const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
        updateGlobalCursorPosition(input.selectionStart - 1);
        setTextValue(newText);

        if (currentViewName !== "suggestions") {
            setCurrentViewName("writing");
        }
        break;
    }
    case CmdConst.DELETE_LETTER_EDIT: {
        const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
        updateGlobalCursorPosition(input.selectionStart - 1);
        setTextValue(newText);
        break;
    }
    case CmdConst.TOGGLE_CASE: {
      setIsCapsOn(prev => !prev);
      break;
    }
    case CmdConst.CURSOR: {
        handleCurser(action.direction, input, textValue);
        break;
    }
    case CmdConst.DELTE_WORD: {
        const { newText, newCursorPosition } = deleteWordAtCursor(textValue, input.selectionStart);
        setTextValue(newText);
        updateGlobalCursorPosition(newCursorPosition);
        break;
    }
    case CmdConst.DELETE_SENTENCE: {
      const { newText, newCursorPosition } = deleteSentence(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);
      break;
    }
    case CmdConst.DELETE_SECTION: {
      const { newText, newCursorPosition } = deleteSection(textValue, input.selectionStart);
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPosition);
      break;
    }
    case CmdConst.UNDO: {
        // todo
        break;
    }
    case CmdConst.START_OF_TEXT: {
        updateGlobalCursorPosition(0);
        break;
    }
    case CmdConst.PREVIOUS_SECTION: {
        let start = getPreviousSection(textValue);
        updateGlobalCursorPosition(start);
        break;
    }
    case CmdConst.PREVIOUS_SENTENCE: {
        let start = getPreviousSentence(textValue);
        updateGlobalCursorPosition(start);
        break;
    }
    case CmdConst.PREVIOUS_WORD: {
        let start = getPreviousWord(textValue);
        updateGlobalCursorPosition(start);
        break;
    }
    case CmdConst.END_OF_TEXT: {
        updateGlobalCursorPosition(textValue.length);
        break;
    }
    case CmdConst.NEXT_SECTION: {
        let end = getNextSection(textValue);
        updateGlobalCursorPosition(end);
        break;
    }
    case CmdConst.NEXT_SENTENCE: {
        let end = getNextSentence(textValue);
        updateGlobalCursorPosition(end);
    }
    case CmdConst.NEXT_WORD: {
        let end = getNextWord(textValue);
        updateGlobalCursorPosition(end);
        break;
    }
    case CmdConst.SHOW_SUGGESTIONS: {
        if (suggestions.length > 0 && suggestions.some(s => s !== undefined)) {
            setShowSuggestions(true);
            setCurrentViewName("suggestions");
        }
        break;
    }
    case CmdConst.INSERT_SUGGESTION: {
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
        updateGlobalCursorPosition(globalCursorPosition.value + casedSuggestion.length + spaceLength);
        break;
    }
    case CmdConst.CHANGE_LANGUAGE: {
        const newUserdata = updateSetting(userData, UserDataConst.LANGUAGE, action.value);
        setUserData(newUserdata);
        changeLanguage(userData[UserDataConst.SETTINGS][UserDataConst.LANGUAGE]);
        break;
    }
    case CmdConst.CHANGE_DWELL_TIME: {
        dwellTime = parseFloat(action.value);
        const newUserdata = updateSetting(userData, UserDataConst.DWELLTIME, dwellTime)
        setUserData(newUserdata)
        let goBack = { type: "switch_view", view: "main_menu" }
        handleAction(goBack);
        break;
    }
    case CmdConst.PLAY_ALARM: {
        setAlarmActive(true);
        break;
    }
    case CmdConst.CLOSE_ALARM: {
        setAlarmActive(true);
        break;
    }
    case CmdConst.INCREASE_BUTTON_FONT_SIZE: {
        const size = buttonFontSize < 96 ? buttonFontSize + 1 : buttonFontSize;
        const newUserdata = updateSetting(userData, UserDataConst.BUTTON_FONT_SIZE, size);
        setUserData(newUserdata);
        setButtonFontSize(size);
        break;
    }
    case CmdConst.DECREASE_BUTTON_FONT_SIZE: {
        const size = buttonFontSize > 0 ? buttonFontSize - 1 : buttonFontSize;
        const newUserdata = updateSetting(userData, UserDataConst.BUTTON_FONT_SIZE, size);
        setUserData(newUserdata);
        setButtonFontSize(size);
        break;
    }
    case CmdConst.INCREASE_TEXT_FONT_SIZE: {
        const size = textFontSize < 96 ? textFontSize + 1 : textFontSize;
        const newUserdata = updateSetting(userData, UserDataConst.TEXT_FONT_SIZE, size);
        setUserData(newUserdata);
        setTextFontSize(size);
        break;
    }
    case CmdConst.DECREASE_TEXT_FONT_SIZE: {
      const size = textFontSize > 0 ? textFontSize - 1 : textFontSize;
      const newUserdata = updateSetting(userData, UserDataConst.TEXT_FONT_SIZE, size);
      setUserData(newUserdata);
      setTextFontSize(size);
      break;
    }
    case CmdConst.INSERT_LETTER_SUGGESTION: {
        // insert the letter at the global cursor position
        const letter = action.value === "space" ? " " : 
        isCapsOn ? action.value.toUpperCase() : action.value.toLowerCase();
        const newText = textValue.slice(0, globalCursorPosition.value) + letter + textValue.slice(globalCursorPosition.value);
        setTextValue(newText);

        updateGlobalCursorPosition(input.selectionStart + 1);
        // always go back to writing view after entering a letter
        setCurrentViewName("writing");

        // if the last letter was punctuation speak it
        if (action.value === ".") {
            const lastSentenceStart = getLastSentence(textValue);
            const lastSentence = textValue.slice(lastSentenceStart, globalCursorPosition.value);
            speakText(lastSentence);
        }
        break;
    }
    case CmdConst.DECREASE_TEXT_FONT_SIZE: {
        const size = textFontSize > 0 ? textFontSize - 1 : textFontSize;
        const newUserdata = updateSetting(userData, UserDataConst.TEXT_FONT_SIZE, size);
        setUserData(newUserdata);
        setTextFontSize(size);
        break;
    }
    case CmdConst.TOGGLE_PAUSE: {
        setIsPaused((prev) => !prev);
        break;
    }
    case CmdConst.SWITCH_LAYOUT: {
        changeButtonNum(
            layoutToButtonNum[action.value] || 6
          )
        setCurrentLayoutName(action.value);
        break;
    }
    default:
      console.warn("Unhandled action:", action);
  }
};


const handleCurser = (direction, input, textValue) => {
    const cursorPosition = input.selectionStart;
    if (direction === CmdConst.LEFT) {
        if (cursorPosition === 0) return;
        input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);

    } else if (direction === CmdConst.RIGHT) {
        if (cursorPosition === textValue.length) return;
        input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
    } else if (direction === CmdConst.UP) {
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
    } else if (direction ===CmdConst.DOWN) {
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
}