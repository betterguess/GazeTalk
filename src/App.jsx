import React, { useState, useRef } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

import axios from "axios";
// import {settings, setSettings} from "./util/userData.js"
import { changeLanguage } from "i18next";
import "./App.css";
import { globalCursorPosition, cursorEventTarget, updateGlobalCursorPosition } from "./singleton/cursorSingleton";

import LayoutPicker from "./layouts/LayoutPicker";
import AlarmPopup from "./components/AlarmPopup";
//import PausePopup from "./components/PausePopup";
import { config } from "./config/config";
import { speakText } from './singleton/textToSpeachSingleton'
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
import { updateSetting, updateRanking } from "./util/settingUtil";
import * as RankingSystem from "./util/ranking"
import { handleAction } from "./util/handleAction";
import {rank, updateRank, stripSpace, getRank} from "./util/ranking"
import * as UserDataConst from "./constants/userDataConstants"
import * as CmdConst from "./constants/cmdConstants"
import { layoutToButtonNum } from "./constants/layoutConstants";
let dwellTime = 1500;

function App({ initialView = "main_menu", initialLayout = "2+2+4x2", initialText="" }) {
  const [currentViewName, setCurrentViewName] = useState(initialView);
  const [currentLayoutName, setCurrentLayoutName] = useState(initialLayout);
  const [textValue, setTextValue] = useState(initialText);
  const [isCapsOn, setIsCapsOn] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [letterSuggestions, setLetterSuggestions] = useState([])
  const [nextLetters, setNextLetters] = useState([[],[],[],[],[],[],[]])
  const defaultLetterSuggestions  = useState(["e","t","a","space","o","i"])
  const [nextLetterSuggestion,setNextLetterSuggestion]  = useState(null)
  
  const textAreaRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const view = config.views[currentViewName] || config.views["main_menu"];
  const input = document.getElementById('text_region');

  const [buttonFontSize, setButtonFontSize] = useState(30)
  const [textFontSize, setTextFontSize] = useState(20)
  const [buttonNum, setButtonNum] = useState(6)

  const [userData, setUserData] = useLocalStorage(
    UserDataConst.USERDATA,  {
        settings : {
          language : UserDataConst.DEFAULT_LANGUAGE,
          dwelltime: UserDataConst.DEFAULT_DWELLTIME,
          button_font_size : UserDataConst.DEFAULT_BUTTON_FONT_SIZE,
          text_font_size : UserDataConst.DEFAULT_TEXT_FONT_SIZE,
        },
        ranking : UserDataConst.DEFAULT_RANKING
    },
  )

  const changeButtonNum = (newValue) => {
    
    if (newValue < 1) {
      console.warn("Button number can't be less than 1");
      return;
    }
    
    RankingSystem.setButtonNum(newValue);
    setButtonNum(newValue)
  };


  const handleLetterSelected = (otherLetters, selectedLetter) => {
    let Letters = RankingSystem.stripSpace(otherLetters)
    RankingSystem.updateRank(Letters, selectedLetter)
    const newUserdata = updateRanking(userData, RankingSystem.getRank())
    setUserData(newUserdata)
    // console.log("Other letters:", Letters, "Selected:", selectedLetter);
    let index = 0;
    for (let i = 0; i < Letters.length; i++) {
      if ( Letters[i] === selectedLetter) {
        index = i;
      }
    }
    if (nextLetters[index].length !== 0) {
      setNextLetterSuggestion(nextLetters[index])
      
    }
  };
  
  // load settings initalially
  React.useEffect(() => {
    // console.log("first load", userData)
    const settings = userData?.settings
    if (settings) {
      const language = settings[UserDataConst.LANGUAGE] || UserDataConst.DEFAULT_LANGUAGE;
      changeLanguage(language)
      dwellTime = settings[UserDataConst.DWELLTIME]

      setButtonFontSize(settings[UserDataConst.BUTTON_FONT_SIZE])
      setTextFontSize(settings[UserDataConst.TEXT_FONT_SIZE])
    }
    
  }, [userData]);

  React.useEffect(() => {
    const setTileFontSize = () => {
      const tileHeight = window.innerHeight / 3;
      const maxAllowedFontSize = tileHeight * 0.4;
      const newTileFontSize = Math.min(buttonFontSize, maxAllowedFontSize);
      document.documentElement.style.setProperty('--tile-font-size', `${newTileFontSize}px`);
    };
    setTileFontSize();
    window.addEventListener("resize", setTileFontSize);
    return () => window.removeEventListener("resize", setTileFontSize);
  }, [buttonFontSize]);

  React.useEffect(() => {
    const textUpToCursor = textValue.slice(0, globalCursorPosition.value)

    const fetchSuggestions = async () => {

      try {
        const response = await axios.post("https://cloudapidemo.azurewebsites.net/continuations", {
          locale: "en_US",
          prompt: textUpToCursor,
        });
        setSuggestions(response.data.continuations.slice(0, 16) || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();

    const fetchLetterSuggestions = async (text) => {
      try {
        const response = await axios.post("https://cloudapidemo.azurewebsites.net/lettercontinuations", {
          locale: "en_US",
          prompt: text,
        });
        return response
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        return []
        
      }
    }
    
    const fillLetterSuggestions = async () => {
      const getSug = async (text) => {
        const response = await fetchLetterSuggestions(text);
        const suggestionsString = response.data.continuations;
        const suggestionArray = [...suggestionsString]; // Using spread operator instead of the loop
        return suggestionArray.slice(0, RankingSystem.getButtonNum()).reverse();
      };
    
      // Get initial suggestions
      let rankedSuggestion = [];
      if (nextLetterSuggestion) {
        rankedSuggestion = nextLetterSuggestion;
      } else {
        const currentSuggestion = await getSug(textUpToCursor);
        rankedSuggestion = RankingSystem.rank(currentSuggestion, null, null);
      }
      setNextLetterSuggestion(null);
    
      // Make all next suggestion API calls in parallel using Promise.all
      const nextSugPromises = rankedSuggestion.map(async (suggestion, index) => {
        return getSug(textUpToCursor + suggestion);
      });
    
      const nextSugResults = await Promise.all(nextSugPromises);
      
      // Process results
      const letterSuggestionsArray = nextSugResults.map((result, i) => {
        return RankingSystem.rank(result, rankedSuggestion[i], i);
      });
      
      setLetterSuggestions(rankedSuggestion);
      setNextLetters(letterSuggestionsArray);
    };
    
    fillLetterSuggestions();

  }, [textValue, buttonNum]);

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


  const handleActionWrapper = (action) => {
    handleAction(action, {
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
    });
  };

  return (
    <div className="App">
      <LayoutPicker
        layout={currentLayoutName}
        view={view}
        textValue={textValue}
        setTextValue={setTextValue}
        handleAction={handleActionWrapper}
        fontSize={buttonFontSize}
        textFontSize={textFontSize}
        suggestions={suggestions}
        letterSuggestions={letterSuggestions}
        nextLetters={nextLetters}
        dwellTime={dwellTime} 
        handleLetterSelected={handleLetterSelected}
        />
      {alarmActive && <AlarmPopup onClose={() => setAlarmActive(false)} dwellTime={dwellTime} />}
        {
          // Uncomment to show debug button
          //<PausePopup isPaused={isPaused} /> 
        }
        {
          //<button onClick={() => setIsPaused((prev) => !prev)}>Toggle Pause</button> 
        }
    </div>
  );
}

export default App;
