import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { testSentences } from '../constants/testConstants/testSentences';
import { minimumNumberOfKeystrokes } from '../constants/testConstants/minimumNumberOfKeystrokes';
import * as CmdConst from "../constants/cmdConstants";
import * as TestConst from "../constants/testConstants/testConstants";
import levenshtein from 'js-levenshtein';
import { getDeviceType } from '../util/deviceUtils';
import * as DataSavingSingleton from "../singleton/dataSavingSingleton";
const UserBehaviourTest = createContext();
const numberOfTests = TestConst.NUMBER_OF_TESTS


const shuffleTestSentences = (array) => {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const UserBehaviourTestProvidor = ({ children }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testStartTime, setTestStartTime] = useState(null);
  const [logs, setLogs] = useState([]);
  const logsRef = useRef([]);
  const completeTestLogs = useRef([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1); 
  const [targetSentence, setTargetSentence] = useState("");
  const [counterStarted, setCounterStarted] = useState(false);
  const [testSuiteActive,setTestSuiteActive] = useState(false)
  const randomTests = useRef([]);

  const initTest = (id, userData) => {
    if (id > numberOfTests - 1) {
      completeTests();
      return;
    }
    if (id === 0) {
      randomTests.current = shuffleTestSentences([...testSentences]).slice(0, numberOfTests); // pick n random sentences
      setIsTesting(true);
      setLogs([]); // clear previous logs
      const settingsEvent = {
        type: "userSettings",
        settings: userData.settings,
        timestamp: new Date().toISOString(),
      };
      logsRef.current.push(settingsEvent);
      //right here
    }
    console.log("Starting test with sentence ", randomTests.current[id]);
    setCurrentTestIndex(id);
    setTargetSentence(randomTests.current[id]);
    setCounterStarted(false);
  }

  // Function to start the test
  const startTest = () => {
    setTestStartTime(Date.now());
    setCounterStarted(true);
  };


  // Function to end the test
  const endTest = () => {
    if (counterStarted) {
      const duration = Date.now() - testStartTime;
      const newAddition = { type: "finished_test", testIndex: currentTestIndex, targetSentence, duration };
      const updatedLogs = [...logsRef.current, newAddition];
      console.log(`Test ${currentTestIndex} completed. Collected logs:`, updatedLogs);
      const metrics = calculateMetrics(updatedLogs);
      const metricsEvent = metrics ? { type: "metrics", ...metrics } : null;
      const finalLogs = metricsEvent ? [...updatedLogs, metricsEvent] : updatedLogs;
      completeTestLogs.current.push(finalLogs);
      logsRef.current = [];
      setLogs([]);
      setCounterStarted(false);
    }
  };
  const saveOnServerOrDownloadLocally = () => {
    const testData = {
      testResults: completeTestLogs.current,
      timestamp: new Date().toISOString(),
      device : getDeviceType(),
      mouseArray: mouseArray ? mouseArray : [],
      
    };
    
    // Log that we're sending data
    console.log("Sending test data to server:", testData);
    
    // Send data to server
    // const currentIP = window.location.hostname;
    const currentIP ="172.104.225.14";
    console.log("Current IP:", currentIP);
    fetch(`http://${currentIP}:5000/save-json`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle failure - could fall back to local download
      const dataToDownload = JSON.stringify(completeTestLogs.current, null, 2);
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var time = String(today.getHours()).padStart(2, '0') + "-" + String(today.getMinutes()).padStart(2, '0') + "-" + String(today.getSeconds()).padStart(2, '0');
      const filename = `test_run_${dd}-${mm}_${time}.json`;
      downloadTestData(dataToDownload, filename);
      alert("Failed to save data to server. Downloaded locally instead." + currentIP);
    })
    .finally(() => {
      DataSavingSingleton.data.writing_test = completeTestLogs.current;
      completeTestLogs.current = [];
      setCurrentTestIndex(-1);
      setTargetSentence("");
  })
};

  const completeTests = () => {
    setIsTesting(false);

    // save locally if you are running the test seperately
    if (!DataSavingSingleton.testActive.isActive) {
      saveOnServerOrDownloadLocally();
    
    } else {
      DataSavingSingleton.data.writing_test = completeTestLogs.current;
      completeTestLogs.current = [];
      setCurrentTestIndex(-1);
      setTargetSentence("");

    }
   
    };
  const cancelTest = () => {
    setIsTesting(false);
    setCurrentTestIndex(-1);
    setTargetSentence("");
    setCounterStarted(false);
    completeTestLogs.current = [];
    logsRef.current = [];
    console.log("Test reset");
  };

  const logEvent = (event) => {
    if (!isTesting) {
      setLogs(prevLogs => [
        ...prevLogs
      ]);
    } else {
      console.log("LOGGING: ", event);
      logsRef.current.push({ ...event, timestamp: new Date().toISOString() });
      setLogs(prevLogs => [
        ...prevLogs,
        { ...event, timestamp: new Date().toISOString() },
      ]);
    }
  };

  const calculateMetrics = (logs) => {
    console.log(`Test ${currentTestIndex} completed. Collected logs:`, logs);
    const testEndLog = logs.find(log => log.duration !== undefined);
    const submittedTextLog = logs.find(log => log.submittedText  !== undefined);
    const submittedText = submittedTextLog ? submittedTextLog.submittedText : "";
    if (!testEndLog) {console.log("No log with duration found"); return;}
    const durationMinutes = testEndLog.duration / 60000;
    const charactersTyped = targetSentence.length - 1; // -1 to account for the space at the end

    // WPM
    const WPM = (charactersTyped) / (durationMinutes * 5);
    // KSPC 
    const numberOfKeystrokes = logs.filter(e =>
      e.type === CmdConst.ENTER_LETTER || 
      e.type === CmdConst.NEWLINE ||
      e.type === CmdConst.SWITCH_VIEW ||
      e.type === CmdConst.DELETE_LETTER ||
      e.type === CmdConst.DELETE_LETTER_EDIT ||
      e.type === CmdConst.DELETE_WORD ||
      e.type === CmdConst.DELETE_SENTENCE ||
      e.type === CmdConst.DELETE_SECTION ||
      e.type === CmdConst.CURSOR ||
      e.type === CmdConst.START_OF_TEXT ||
      e.type === CmdConst.PREVIOUS_SECTION ||
      e.type === CmdConst.PREVIOUS_SENTENCE ||
      e.type === CmdConst.PREVIOUS_WORD ||
      e.type === CmdConst.END_OF_TEXT ||
      e.type === CmdConst.NEXT_SECTION ||
      e.type === CmdConst.NEXT_SENTENCE ||
      e.type === CmdConst.NEXT_WORD ||
      e.type === CmdConst.SHOW_SUGGESTIONS ||
      e.type === CmdConst.INSERT_SUGGESTION ||
      e.type === CmdConst.INSERT_LETTER_SUGGESTION 
    ).length;
    const KSPC = charactersTyped > 0 ? (numberOfKeystrokes / charactersTyped) : 0;
    
    //MSDErrorRate
    const MSD = levenshtein(submittedText.trim(), targetSentence.trim());
    const MSDErrorRate = MSD / charactersTyped;

    //OR
    const OR = numberOfKeystrokes / minimumNumberOfKeystrokes[targetSentence];
    //RBA
    const numberOfDeletions = logs.filter(e =>
      e.type === CmdConst.DELETE_LETTER ||
      e.type === CmdConst.DELETE_LETTER_EDIT ||
      e.type === CmdConst.DELETE_WORD ||
      e.type === CmdConst.DELETE_SENTENCE ||
      e.type === CmdConst.DELETE_SECTION
    ).length;
    const RBA = numberOfDeletions / charactersTyped;
    //RTE
    const numberOfGazesToTextField = logs.filter(e =>
      e.type === TestConst.TEXT_AREA_GAZED
    ).length;
    const RTE = numberOfGazesToTextField / charactersTyped;

    //ANSR
    const numberOfAttendedButNotSelected = logs.filter(e =>
      e.type === TestConst.TILE_GAZED_NOT_SELECTED 
    ).length;
    const ANSR = numberOfAttendedButNotSelected / charactersTyped;
    return { WPM, KSPC, MSDErrorRate, OR, RBA, RTE, ANSR };
  };

   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
   const [mouseArray, setMouseArray] = useState([]);
   useEffect(() => {
      const handleMouseMove = (event) => {
          setMousePosition({ x: event.clientX, y: event.clientY });
          setMouseArray(prevArray => [...prevArray, { x: event.clientX, y: event.clientY }]);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
          window.removeEventListener("mousemove", handleMouseMove);
      };
  }, []);

  const downloadTestData  = (data, filename) => {
    const blob = new Blob([data], { type: "application/json;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  return (
    <UserBehaviourTest.Provider
      value={{
        isTesting,
        currentTestIndex,
        targetSentence,
        counterStarted,
        initTest,
        startTest,
        endTest,
        completeTests,
        logEvent,
        setLogs,
        logs,
        cancelTest,
        testSuiteActive,
        setTestSuiteActive
      }}
    >
      {children}
    </UserBehaviourTest.Provider>
  );
};


export const useTesting = () => {
  return useContext(UserBehaviourTest);
};
