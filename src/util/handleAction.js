import { updateGlobalCursorPosition } from "../singleton/cursorSingleton";
import * as CmdConst from "../constants/cmdConstants";
import * as UserDataConst from "../constants/userDataConstants";
import * as TestConst from "../constants/testConstants/testConstants";
import {
    deleteWordAtCursor,
    deleteSentence,
    deleteSection,
    getCurrentLine,
    getCharDistance,
    calcCursorDistance,
    getLastSentence,
    matchCase,
} from './textUtils';
import {
  updateSetting,
} from "./settingUtil";
import {
    getPreviousSection,
    getNextWord, 
    getNextSentence, 
    getNextSection, 
    getPreviousWord, 
    getPreviousSentence,
} from './cursorUtils';

import { layoutToButtonNum } from "../constants/layoutConstants";
import * as DataSavingSingleton from "../singleton/dataSavingSingleton";


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
    setAlarmActive,
    setIsPaused,
    suggestions,
    buttonFontSize,
    setButtonFontSize,
    textFontSize,
    setTextFontSize,
    config,
    setCurrentLayoutName,
    currentLayoutName,
    setShowSuggestions,
    changeButtonNum,
    isTesting,
    counterStarted,
    startUserTest,
    logEvent,
    dwellTime,
    currentTestIndex,
    setAlphabetPage,
    setNextLayout,
    setTestSuiteActive,
    setEnterForm
  }
) => {
    const startWrittingTest = () => {
        startUserTest();
        setCurrentViewName(CmdConst.WRITING)
    }
    const startTrackerTest = () => {
        setCurrentViewName("main_menu")
        setNextLayout(currentLayoutName)
        setCurrentLayoutName("tracker")
    }
  switch (action.type) {
    case CmdConst.ENTER_LETTER: {
      // insert the letter at the global cursor position
      const letter = isCapsOn ? action.value.toUpperCase() : action.value.toLowerCase();
      let newText;
      let newCursorPos;
      if (action.value === CmdConst.PERIOD && globalCursorPosition.value > 0 && 
            (textValue[globalCursorPosition.value - 1] === " " || textValue[globalCursorPosition.value - 1] === "\n")) {
        if (isTesting && !counterStarted) {
            return;
        }
        newText = textValue.slice(0, globalCursorPosition.value - 1) +
                    letter + textValue.slice(globalCursorPosition.value);
        newCursorPos = globalCursorPosition.value;
      } else {
        newText = textValue.slice(0, globalCursorPosition.value) +
                    letter + textValue.slice(globalCursorPosition.value);
        newCursorPos = input.selectionStart + 1;
      }
      logEvent({ type: CmdConst.ENTER_LETTER, value: letter});
      setTextValue(newText);
      updateGlobalCursorPosition(newCursorPos);
      if (action.value === CmdConst.PERIOD && isTesting 
            && currentTestIndex === TestConst.NUMBER_OF_TESTS - 1) {
        setCurrentViewName(CmdConst.MAIN_MENU);
      } else {
        setCurrentViewName(CmdConst.WRITING);
      }
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
        logEvent({ type: CmdConst.NEWLINE, value: newText});
        // move the cursor to the next line after inserting a newline
        updateGlobalCursorPosition(globalCursorPosition.value + 1);
        break;
    }
    case CmdConst.SWITCH_VIEW: {
        if (action.view === CmdConst.MAIN_MENU) {
            if (isTesting && currentTestIndex < TestConst.NUMBER_OF_TESTS) {
                if (counterStarted) {
                    logEvent({ type: CmdConst.SWITCH_VIEW, value: CmdConst.WRITING});
                }
                setCurrentViewName(CmdConst.WRITING);
                return;
              }
              setTextValue("");
              setCurrentViewName(CmdConst.MAIN_MENU);
        } else {
            if (action.view === "test") {
                // handleAction(action ={type: CmdConst.START_WRITING_TEST})
                startWrittingTest()
            } else {
                if (config.views[action.view]) {
                    if (counterStarted) {
                        logEvent({ type: CmdConst.SWITCH_VIEW, value: action.view});
                    }
                    if (action.view === CmdConst.ALPHABET_V2 && action.page != null) {
                        setAlphabetPage(action.page);
                    } else {
                        setAlphabetPage(0);
                    }
                    setCurrentViewName(action.view);
                } else {
                    console.error(`VIEW "${action.view}" NOT ADDED TO CONFIG`);
                }
            }
        }
        break;
    }
    case CmdConst.START_TEST_SUITE:{
        setNextLayout(currentLayoutName);
        setCurrentLayoutName("tracker");
        DataSavingSingleton.testActive.isActive = true;
        setTestSuiteActive(true);
        break;
    }
    case CmdConst.DOWNLOAD_DATA : {
        DataSavingSingleton.downloadFromBrowser()
        break;
    }
    case CmdConst.END_TEST_SUITE: {
        DataSavingSingleton.saveRemotely()
        DataSavingSingleton.testActive.isActive = false;
        
        break;
    }
    case CmdConst.START_WRITING_TEST: {
        startWrittingTest()

        break;
    }
    case CmdConst.START_TRACKER_TEST: {
        DataSavingSingleton.data.form_data.layout = currentLayoutName;
        startTrackerTest()
        break;
    }
    case CmdConst.ENTER_FORM: {
        setEnterForm(true)
        break;
    }

    case CmdConst.DELETE_LETTER: {
        // delete the letter at the global cursor position
        const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
        updateGlobalCursorPosition(input.selectionStart - 1);
        setTextValue(newText);
        logEvent({ type: CmdConst.DELETE_LETTER, value: newText});
        if (currentViewName !== "suggestions") {
            setCurrentViewName(CmdConst.WRITING);
        }
        break;
    }
    case CmdConst.DELETE_LETTER_EDIT: {
        const newText = textValue.slice(0, globalCursorPosition.value - 1) + textValue.slice(globalCursorPosition.value);
        updateGlobalCursorPosition(input.selectionStart - 1);
        setTextValue(newText);
        logEvent({ type: CmdConst.DELETE_LETTER_EDIT, value: newText});
        break;
    }
    case CmdConst.DELETE_WORD: {
        const { newText, newCursorPosition } = deleteWordAtCursor(textValue, input.selectionStart);
        setTextValue(newText);
        logEvent({ type: CmdConst.DELETE_WORD, value: newText});
        updateGlobalCursorPosition(newCursorPosition);
        break;
    }
    case CmdConst.DELETE_SENTENCE: {
      const { newText, newCursorPosition } = deleteSentence(textValue, input.selectionStart);
      setTextValue(newText);
      logEvent({ type: CmdConst.DELETE_SENTENCE, value: newText});
      updateGlobalCursorPosition(newCursorPosition);
      break;
    }
    case CmdConst.DELETE_SECTION: {
      const { newText, newCursorPosition } = deleteSection(textValue, input.selectionStart);
      setTextValue(newText);
      logEvent({ type: CmdConst.DELETE_SECTION, value: newText});
      updateGlobalCursorPosition(newCursorPosition);
      break;
    }
    case CmdConst.TOGGLE_CASE: {
      setIsCapsOn(prev => !prev);
      logEvent({ type: CmdConst.TOGGLE_CASE, value: isCapsOn });
      break;
    }
    case CmdConst.CURSOR: {
        logEvent({ type: CmdConst.CURSOR, value: action.direction });
        handleCurser(action.direction, input, textValue);
        break;
    }
    case CmdConst.DELETE_WORD: {
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
        logEvent({ type: CmdConst.START_OF_TEXT, value: 0 });
        updateGlobalCursorPosition(0);
        break;
    }
    case CmdConst.PREVIOUS_SECTION: {
        logEvent({ type: CmdConst.PREVIOUS_SECTION, value: textValue });
        let start = getPreviousSection(textValue);
        updateGlobalCursorPosition(start);
        break;
    }
    case CmdConst.PREVIOUS_SENTENCE: {
        logEvent({ type: CmdConst.PREVIOUS_SENTENCE, value: textValue });
        let start = getPreviousSentence(textValue);
        updateGlobalCursorPosition(start);
        break;
    }
    case CmdConst.PREVIOUS_WORD: {
        logEvent({ type: CmdConst.PREVIOUS_WORD, value: textValue });
        let start = getPreviousWord(textValue);
        updateGlobalCursorPosition(start);
        break;
    }
    case CmdConst.END_OF_TEXT: {
        logEvent({ type: CmdConst.END_OF_TEXT, value: textValue.length });
        updateGlobalCursorPosition(textValue.length);
        break;
    }
    case CmdConst.NEXT_SECTION: {
        logEvent({ type: CmdConst.NEXT_SECTION, value: textValue });
        let end = getNextSection(textValue);
        updateGlobalCursorPosition(end);
        break;
    }
    case CmdConst.NEXT_SENTENCE: {
        logEvent({ type: CmdConst.NEXT_SENTENCE, value: textValue });
        let end = getNextSentence(textValue);
        updateGlobalCursorPosition(end);
    }
    case CmdConst.NEXT_WORD: {
        logEvent({ type: CmdConst.NEXT_WORD, value: textValue });
        let end = getNextWord(textValue);
        updateGlobalCursorPosition(end);
        break;
    }
    case CmdConst.SHOW_SUGGESTIONS: {
        if (suggestions.length > 0 && suggestions.some(s => s !== undefined)) {
            setShowSuggestions(true);
            logEvent({ type: CmdConst.SHOW_SUGGESTIONS, value: suggestions });
            setCurrentViewName("suggestions");
        }
        break;
    }
    case CmdConst.INSERT_SUGGESTION: {
        const suggestion = action.value;
        const cursorPos = globalCursorPosition.value;
        const textUpToCursor = textValue.slice(0, cursorPos);
        const rest = textValue.slice(cursorPos, textValue.length);
        // Beginning of current line
        const lastNewlineIndex = textUpToCursor.lastIndexOf("\n");
        const lineStart = lastNewlineIndex !== -1 ? lastNewlineIndex + 1 : 0;
        const currentLineText = textUpToCursor.slice(lineStart);
        // Last space within the current line.
        const lastSpaceIndex = currentLineText.lastIndexOf(" ");
        const lastWord =
            lastSpaceIndex >= 0
            ? currentLineText.slice(lastSpaceIndex + 1)
            : currentLineText;
        const replacedCurrentLine = lastSpaceIndex >= 0
            ? currentLineText.slice(0, lastSpaceIndex + 1)
            : "";
        const replaced = textUpToCursor.slice(0, lineStart) + replacedCurrentLine;
        const casedSuggestion = matchCase(suggestion, lastWord);
        const newText = replaced + casedSuggestion + " " + rest;
        setTextValue(newText);
        logEvent({ type: CmdConst.INSERT_SUGGESTION, value: casedSuggestion });
        const spaceLength = 1;
        updateGlobalCursorPosition(replaced.length + casedSuggestion.length + spaceLength);
        break;
    }
    case CmdConst.CHANGE_LANGUAGE: {
        const newUserdata = updateSetting(userData, UserDataConst.LANGUAGE, action.value);
        setUserData(newUserdata);
        changeLanguage(userData[UserDataConst.SETTINGS][UserDataConst.LANGUAGE]);
        break;
    }
    case CmdConst.CHANGE_DWELL_TIME: {
        const newDwellTime = parseFloat(action.value);
        const newUserdata = updateSetting(userData, UserDataConst.DWELLTIME, newDwellTime);
        setUserData(newUserdata);
        dwellTime = newUserdata.settings[UserDataConst.DWELLTIME];
        setCurrentViewName(CmdConst.MAIN_MENU);
        break;
    }
    case CmdConst.INCREASE_DWELLTIME : {
        const oldDwellTime = userData.settings.dwelltime

        if (oldDwellTime + UserDataConst.DWELLTIME_INCREMENT < UserDataConst.MAX_DWELLTIME) {
            
            const newDwellTime = oldDwellTime + UserDataConst.DWELLTIME_INCREMENT
            const newUserdata = updateSetting(userData, UserDataConst.DWELLTIME, newDwellTime);
            setUserData(newUserdata);
            dwellTime = newUserdata.settings.dwelltime;
            setTextValue("Current dwelltime: " + dwellTime / 1000 + "s");
        } else {
            console.warn("Dwelltime max reached");
        }
        break;
    }
    case CmdConst.DECREASE_DWELLTIME : {
        const oldDwellTime = userData.settings.dwelltime

        if (oldDwellTime - UserDataConst.DWELLTIME_INCREMENT > UserDataConst.MIN_DWELLTIME) {
            
            const newDwellTime = oldDwellTime - UserDataConst.DWELLTIME_INCREMENT
            const newUserdata = updateSetting(userData, UserDataConst.DWELLTIME, newDwellTime);
            setUserData(newUserdata);
            dwellTime = newUserdata.settings.dwelltime;
            setTextValue("Current dwelltime: " + dwellTime / 1000 + "s");
        } else {
            console.warn("Dwelltime max reached");
        }
        console.log("current dwelltime : ", dwellTime)
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
        logEvent({ type: CmdConst.INSERT_LETTER_SUGGESTION, value: letter });
        updateGlobalCursorPosition(input.selectionStart + 1);
        // always go back to writing view after entering a letter
        setCurrentViewName(CmdConst.WRITING);

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
  input ? input.focus() : null;
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