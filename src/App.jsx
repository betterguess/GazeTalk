import React, { useState, useRef } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import axios from "axios";
import { changeLanguage } from "i18next";
import "./App.css";
import { globalCursorPosition, updateGlobalCursorPosition } from "./singleton/cursorSingleton";

import LayoutPicker from "./layouts/LayoutPicker";
import AlarmPopup from "./components/AlarmPopup";
import FormPopup from "./components/formPopup";
import UnlockAudioPopup from "./components/UnluckAudioPopup";
import PausePopup from "./components/PausePopup";
import { config } from "./config/config";
import { speakText } from './singleton/textToSpeachSingleton'
import * as RankingSystem from "./util/ranking"
import { handleAction } from "./util/handleAction";
import * as UserDataConst from "./constants/userDataConstants"
import * as CmdConst from "./constants/cmdConstants"
import { layoutToButtonNum } from "./constants/layoutConstants";
import { useTesting } from "./components/UserBehaviourTest";
import { getLastSentence } from "./util/textUtils";
import * as TestConst from "./constants/testConstants/testConstants";
import { getDeviceType } from "./util/deviceUtils";

let dwellTime = 800;

function App({ initialView = CmdConst.MAIN_MENU, initialLayout = "2+3+5x3", initialText="", unitTesting=process.env.NODE_ENV === "test" }) {

  const [currentViewName, setCurrentViewName] = useState(initialView);
  const [currentLayoutName, setCurrentLayoutName] = useState(initialLayout);
  const [textValue, updateTextValue] = useState(initialText);
  const [isCapsOn, setIsCapsOn] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [enterForm, setEnterForm] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [letterSuggestions, setLetterSuggestions] = useState([])
  const [nextLetters, setNextLetters] = useState([[],[],[],[],[],[],[]])
  const defaultLetterSuggestions  = useState(["e","t","a","space","o","i"])
  const [nextLetterSuggestion,setNextLetterSuggestion]  = useState(null)
  const [alphabetPage, setAlphabetPage] = useState(0);
  
  const textAreaRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const view = config.views[currentViewName] || config.views[CmdConst.FIRST_PAGE];
  const input = document.getElementById('text_region');

  const [buttonFontSize, setButtonFontSize] = useState(30)
  const [textFontSize, setTextFontSize] = useState(20)
  const [buttonNum, setButtonNum] = useState(6)
  const [nextView, setNextView] = useState(CmdConst.FIRST_PAGE)
  const [nextLayout, setNextLayout] = useState("2+2+4x2")

  const showNextSuggestions = unitTesting // turn on to show next letters suggestions
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Testing 
  const { isTesting, currentTestIndex, targetSentence, counterStarted, initTest, startTest, endTest, completeTests, logEvent, setLogs, logs, cancelTest, testSuiteActive, setTestSuiteActive } = useTesting();
  const [inputEnabledForTests, setInputEnabledForTests] = useState(false);

  const unlockAudio = () => {
    const audio = new Audio("/click_button.mp3");
    audio.play().then(() => {
      setAudioUnlocked(true);
    });
  };

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
  const startUserTest = () => {
    initTest(0, userData);
  };

function setupRemoteLogging() {
    const originalLog = console.log;
    console.log = function (...args) {
      originalLog(...args);
      const currentIP = "172.104.225.14";
      fetch(`http://${currentIP}:5000/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: args })
      }).catch(err => originalLog("Failed to send log:", err));
    };
  }

  React.useEffect(() => {
    const deviceID = getDeviceType()
    if (unitTesting){
      return
    }
    if (deviceID === "ipad") {
      changeButtonNum(layoutToButtonNum["kbv2_3x3"]);
      setCurrentLayoutName("kbv2_3x3");
      setupRemoteLogging();
      console.log("Remote logging enabled for device:", deviceID);
    } else if (deviceID === "iphone") {
      changeButtonNum(layoutToButtonNum["4+4x4"]);
      setCurrentLayoutName("4+4x4");
      setupRemoteLogging();
      console.log("Remote logging enabled for device:", deviceID);
    } else {
      if (layoutToButtonNum[initialLayout] === undefined) {
        console.warn("Layout not found in layoutToButtonNum, using 6 as default.");
        changeButtonNum(6);
      } else {
        setCurrentLayoutName("kbv2_3x3");
        changeButtonNum(layoutToButtonNum["kbv2_3x3"]);
      }
      console.log("Remote logging enabled for device:", deviceID);
    }
  }, []);

  const handleLetterSelected = (otherLetters, selectedLetter) => {
    let Letters = RankingSystem.stripSpace(otherLetters)
    RankingSystem.updateRank(Letters, selectedLetter)
    const newUserdata = updateRanking(userData, RankingSystem.getRank())
    setUserData(newUserdata)
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
  const setTextValue = (text) => {
    if (isTesting && !inputEnabledForTests) {
      return;
    }
    if (isTesting && !counterStarted) {
      startTest();
      //gets last word of 'text'
      updateTextValue(text);
    } else if (isTesting && text === targetSentence 
      || isTesting 
         && (targetSentence.split("")[targetSentence.length - 1] === " ")
         && text === targetSentence.slice(0, targetSentence.length - 1)
      || isTesting && text.split("")[text.length - 1] === ".") {
        const lastSentenceIndex = getLastSentence(text);
        const lastSentence = text.slice(lastSentenceIndex).trim();
        logEvent({ type: "sentenceComplete", submittedText: lastSentence });
        endTest();
        //Tests are done
        if (currentTestIndex === TestConst.NUMBER_OF_TESTS - 1) {
          initTest(currentTestIndex + 1, userData);
          updateTextValue("");
          updateGlobalCursorPosition(0);
          console.log("All tests completed. Switching to tracker layout.");
          if (testSuiteActive){
              handleActionWrapper({type: "start_tracker_test"})
              setTestSuiteActive(false)
              
            }
        } else { //Next tests
          initTest(currentTestIndex + 1, userData);
          updateTextValue(targetSentence + "\n");
          updateGlobalCursorPosition((targetSentence + "\n").length);
        }
    }
    else {
      updateTextValue(text);
    }
  };
  const abandonTest = () => {
    cancelTest();
  }
  //Needed to unlock audio on browsers
  React.useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio();
      audio.play().catch(() => {});
      document.removeEventListener('hover', unlockAudio);
    };
  
    document.addEventListener('hover', unlockAudio);
  
    return () => {
      document.removeEventListener('hover', unlockAudio);
    };
  }, []);

  
  React.useEffect(() => {
    if (!isTesting && targetSentence === "") {
      
    } else if (isTesting && targetSentence) {
      updateTextValue(targetSentence + "\n");
      updateGlobalCursorPosition((targetSentence + "\n").length);
      setInputEnabledForTests(false);
      const waitBeforeWriting = setTimeout(() => {
        setInputEnabledForTests(true);
      }, 1000);
      return () => clearTimeout(waitBeforeWriting);
    }
  }, [targetSentence]);

  // load settings initalially
  React.useEffect(() => {
    const settings = userData?.settings
    if (settings) {
      const language = settings[UserDataConst.LANGUAGE] || UserDataConst.DEFAULT_LANGUAGE;
      changeLanguage(language)
      dwellTime = settings[UserDataConst.DWELLTIME]

      setButtonFontSize(settings[UserDataConst.BUTTON_FONT_SIZE])
      if (getDeviceType() === "ipad") {
        setButtonFontSize(50);
      }
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
    let textUpToCursor;
    textUpToCursor = textValue.slice(0, globalCursorPosition.value);
    if (isTesting) {
      textUpToCursor = textUpToCursor.replace(targetSentence, "");
    }

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
        const suggestionArray = [...suggestionsString]; 
        return suggestionArray.slice(0, RankingSystem.getButtonNum());
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

      // Process results
      if (showNextSuggestions) {
        // Make all next suggestion API calls in parallel using Promise.all
        const nextSugPromises = rankedSuggestion.map(async (suggestion, index) => {
          return getSug(textUpToCursor + suggestion);
        });
        const nextSugResults = await Promise.all(nextSugPromises);
        const letterSuggestionsArray = nextSugResults.map((result, i) => {
          return RankingSystem.rank(result, rankedSuggestion[i], i);
        });
        setNextLetters(letterSuggestionsArray);
      } else {
        setNextLetters(new Array(buttonNum).fill([]));
      }
      setLetterSuggestions(rankedSuggestion);
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
  }, [textValue]);

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
    });
  };

  return (
    <div className="App">
      {!unitTesting && !audioUnlocked && <UnlockAudioPopup onUnlock={unlockAudio} />}
      {(unitTesting || audioUnlocked) && !alarmActive && !enterForm && <LayoutPicker
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
        logEvent={logEvent}
        counterStarted={counterStarted}
        nextView={nextView}
        nextLayout={nextLayout}
        testSuiteActive={testSuiteActive}
        alphabetPage={alphabetPage}
        isTesting={isTesting}
        inputEnabledForTests={inputEnabledForTests}
        />
      }
      {alarmActive && <AlarmPopup onClose={() => setAlarmActive(false)} dwellTime={dwellTime} />}
      {enterForm && <FormPopup onClose={() =>{ 
        setEnterForm(false);
        handleActionWrapper({type: "start_test_suite"})
        
      }} dwellTime={dwellTime} />}
        {
          <PausePopup isPaused={isPaused} onActivate={handleActionWrapper} dwellTime={dwellTime} /> 
        }
    </div>
  );
}

export default App;
