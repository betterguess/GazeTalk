import React from "react";
import Layout2_2_4x2 from "./Layout2_2_4x2";
import Layout3_3x3 from "./Layout3_3x3";
import Layout2_3_5x2 from "./Layout2_3_5x2";
import Layout2_3_5x3 from "./Layout2_3_5x3";
import Layout3_3x4 from "./Layout3_3x4";
import Layout4_4x4 from "./Layout4_4x4";
import Layout2_4_6x4 from "./Layout2_4_6x4";
import Layout2_4_6x5 from "./Layout2_4_6x5";
import KeyboardLayoutV2_4x4 from "./KeyboardLayoutV2_4x4";
import KeyboardLayoutV2_4x3 from "./KeyboardLayoutV2_4x3";
import KeyboardLayoutV2_3x3 from "./KeyboardLayoutV2_3x3";
import TrackerLayout from "./TrackerLayout";
import MeasurementLayout from "./MeasurementLayout";

const layouts = {
  "2+2+4x2": Layout2_2_4x2,
  "2+3+5x2": Layout2_3_5x2,
  "2+3+5x3": Layout2_3_5x3,
  "2+4+6x4": Layout2_4_6x4,
  "2+4+6x5": Layout2_4_6x5,
  "3+3x4": Layout3_3x4,
  "4+4x4": Layout4_4x4,
  "3+3x3": Layout3_3x3,
  "kbv2_3x3": KeyboardLayoutV2_3x3,
  "kbv2_4x4": KeyboardLayoutV2_4x4,
  "kbv2_4x3": KeyboardLayoutV2_4x3,
  "tracker" : TrackerLayout,
  "measurement" : MeasurementLayout,
};

const LayoutPicker = ({ layout, view, textValue, setTextValue, handleAction, suggestions, letterSuggestions, dwellTime,buttonFontSize,textFontSize, nextLetters, getNext, handleLetterSelected, logEvent, counterStarted, nextView, nextLayout, testSuiteActive, alphabetPage, isTesting, inputEnabledForTests}) => {
  const LayoutComponent = layouts[layout];
  const { textAreaColSpan, rows, cols } = LayoutComponent.properties;
  return (
    <div className="generic-view" data-layout={layout}>
      <Layout
        Component={LayoutComponent}
        textAreaColSpan={textAreaColSpan}
        rows={rows}
        cols={cols}
        view={view}
        textValue={textValue}
        setTextValue={setTextValue}
        onTileActivate={handleAction}
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
      <div
        data-testid="layout-metadata"
        data-textareacolspan={textAreaColSpan}
        data-rows={rows}
        data-cols={cols}
      />
    </div>
  );
};
const Layout = ({ Component, ...props }) => {
  return <Component {...props} />;
};
export default LayoutPicker;
