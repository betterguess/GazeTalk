import { handleAction } from '../../util/handleAction';
import * as CmdConst from '../../constants/cmdConstants';

const getDefaultProps = (overrides = {}) => ({
  textValue: "Hello",
  setTextValue: jest.fn(),
  setCurrentViewName: jest.fn(),
  currentViewName: "writing",
  globalCursorPosition: { value: 2 },
  updateGlobalCursorPosition: jest.fn(),
  isCapsOn: false,
  setIsCapsOn: jest.fn(),
  input: {
    selectionStart: 2,
    focus: jest.fn(),
    setSelectionRange: jest.fn(),
  },
  userData: { settings: { dwelltime: 1000 } },
  setUserData: jest.fn(),
  speakText: jest.fn(),
  alarmActive: false,
  nextLetterSuggestion: null,
  setAlarmActive: jest.fn(),
  isPaused: false,
  setIsPaused: jest.fn(),
  setNextLetterSuggestion: jest.fn(),
  letterSuggestions: [],
  setLetterSuggestions: jest.fn(),
  nextLetters: [],
  setNextLetters: jest.fn(),
  suggestions: ['foo', undefined],
  setSuggestions: jest.fn(),
  buttonFontSize: 10,
  setButtonFontSize: jest.fn(),
  textFontSize: 10,
  setTextFontSize: jest.fn(),
  config: { views: { test: {}, view1: {}, [CmdConst.ALPHABET_V2]: {} } },
  setCurrentLayoutName: jest.fn(),
  currentLayoutName: "layout1",
  setShowSuggestions: jest.fn(),
  showSuggestions: false,
  changeButtonNum: jest.fn(),
  buttonNum: 6,
  isTesting: false,
  counterStarted: false,
  startUserTest: jest.fn(),
  logEvent: jest.fn(),
  abandonTest: jest.fn(),
  dwellTime: 1000,
  currentTestIndex: 0,
  setAlphabetPage: jest.fn(),
  nextView: null,
  setNextView: jest.fn(),
  setNextLayout: jest.fn(),
  setTestSuiteActive: jest.fn(),
  enterForm: false,
  setEnterForm: jest.fn(),
  ...overrides,
});

// Mocks for helper modules and singleton
jest.mock('../../util/textUtils', () => ({
  deleteWordAtCursor: jest.fn(() => ({ newText: 'abc', newCursorPosition: 1 })),
  deleteSentence: jest.fn(() => ({ newText: 'abc', newCursorPosition: 1 })),
  deleteSection: jest.fn(() => ({ newText: 'abc', newCursorPosition: 1 })),
  getCurrentLine: jest.fn(),
  getCharDistance: jest.fn(),
  calcCursorDistance: jest.fn(() => 0),
  getLastSentence: jest.fn(() => 0),
  matchCase: jest.fn((s) => s),
}));
jest.mock('../../util/settingUtil', () => ({
  updateSetting: jest.fn((u, k, v) => ({ ...u, [k]: v, settings: { ...u.settings, [k]: v } })),
}));
jest.mock('../../util/cursorUtils', () => ({
  getPreviousSection: jest.fn(() => 0),
  getNextWord: jest.fn(() => 1),
  getNextSentence: jest.fn(() => 2),
  getNextSection: jest.fn(() => 3),
  getPreviousWord: jest.fn(() => 4),
  getPreviousSentence: jest.fn(() => 5),
}));
jest.mock('../../singleton/dataSavingSingleton', () => ({
  testActive: { isActive: false },
  data: { form_data: {} },
  downloadFromBrowser: jest.fn(),
  saveRemotely: jest.fn(),
}));

global.console = {
  ...global.console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

describe('handleAction 100% coverage', () => {
  it('ENTER_LETTER', () => {
    const props = getDefaultProps({
      globalCursorPosition: { value: 0 },
      input: { selectionStart: 0, focus: jest.fn(), setSelectionRange: jest.fn() },
    });
    handleAction({ type: CmdConst.ENTER_LETTER, value: "a" }, props);
    expect(props.setTextValue).toHaveBeenCalled();
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.setCurrentViewName).toHaveBeenCalled();
    expect(props.input.focus).toHaveBeenCalled();
  });

  it('NEWLINE', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.NEWLINE }, props);
    expect(props.setTextValue).toHaveBeenCalled();
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
    expect(props.input.focus).toHaveBeenCalled();
  });

  it('SWITCH_VIEW to main menu', () => {
    const props = getDefaultProps({ isTesting: false });
    handleAction({ type: CmdConst.SWITCH_VIEW, view: CmdConst.MAIN_MENU }, props);
    expect(props.setTextValue).toHaveBeenCalled();
    expect(props.setCurrentViewName).toHaveBeenCalledWith(CmdConst.MAIN_MENU);
  });

  it('SWITCH_VIEW test', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.SWITCH_VIEW, view: "test" }, props);
    expect(props.startUserTest).toHaveBeenCalled();
    expect(props.setCurrentViewName).toHaveBeenCalledWith(CmdConst.WRITING);
  });

  it('SWITCH_VIEW to a config view', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.SWITCH_VIEW, view: "view1" }, props);
    expect(props.setCurrentViewName).toHaveBeenCalledWith("view1");
    expect(props.setAlphabetPage).toHaveBeenCalled();
  });

  it('SWITCH_VIEW unknown config', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.SWITCH_VIEW, view: "notexists" }, props);
    expect(console.error).toHaveBeenCalled();
  });

  it('START_TEST_SUITE', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.START_TEST_SUITE }, props);
    expect(props.setNextLayout).toHaveBeenCalled();
    expect(props.setCurrentLayoutName).toHaveBeenCalled();
    expect(props.setTestSuiteActive).toHaveBeenCalledWith(true);
  });

  it('DOWNLOAD_DATA', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.DOWNLOAD_DATA }, props);
    // covered by mock
  });

  it('END_TEST_SUITE', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.END_TEST_SUITE }, props);
    // covered by mock
  });

  it('START_WRITING_TEST', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.START_WRITING_TEST }, props);
    expect(props.startUserTest).toHaveBeenCalled();
    expect(props.setCurrentViewName).toHaveBeenCalledWith(CmdConst.WRITING);
  });

  it('START_TRACKER_TEST', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.START_TRACKER_TEST }, props);
    expect(props.setCurrentViewName).toHaveBeenCalledWith("main_menu");
    expect(props.setCurrentLayoutName).toHaveBeenCalledWith("tracker");
    expect(props.setNextLayout).toHaveBeenCalledWith("layout1");
  });

  it('ENTER_FORM', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.ENTER_FORM }, props);
    expect(props.setEnterForm).toHaveBeenCalledWith(true);
  });

  it('DELETE_LETTER', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.DELETE_LETTER }, props);
    expect(props.setTextValue).toHaveBeenCalled();
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
    expect(props.setCurrentViewName).toHaveBeenCalled();
  });

  it('DELETE_LETTER_EDIT', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.DELETE_LETTER_EDIT }, props);
    expect(props.setTextValue).toHaveBeenCalled();
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('DELETE_WORD', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.DELETE_WORD }, props);
    expect(props.setTextValue).toHaveBeenCalled();
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('DELETE_SENTENCE', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.DELETE_SENTENCE }, props);
    expect(props.setTextValue).toHaveBeenCalled();
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('DELETE_SECTION', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.DELETE_SECTION }, props);
    expect(props.setTextValue).toHaveBeenCalled();
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('TOGGLE_CASE', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.TOGGLE_CASE }, props);
    expect(props.setIsCapsOn).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('CURSOR', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.CURSOR, direction: CmdConst.LEFT }, props);
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('UNDO', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.UNDO }, props);
    // no effect
  });

  it('START_OF_TEXT', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.START_OF_TEXT }, props);
    expect(props.updateGlobalCursorPosition).toHaveBeenCalledWith(0);
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('PREVIOUS_SECTION', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.PREVIOUS_SECTION }, props);
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('PREVIOUS_SENTENCE', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.PREVIOUS_SENTENCE }, props);
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('PREVIOUS_WORD', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.PREVIOUS_WORD }, props);
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('END_OF_TEXT', () => {
    const props = getDefaultProps({ textValue: "Hello world" });
    handleAction({ type: CmdConst.END_OF_TEXT }, props);
    expect(props.updateGlobalCursorPosition).toHaveBeenCalledWith(11);
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('NEXT_SECTION', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.NEXT_SECTION }, props);
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('NEXT_SENTENCE', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.NEXT_SENTENCE }, props);
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('NEXT_WORD', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.NEXT_WORD }, props);
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('SHOW_SUGGESTIONS', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.SHOW_SUGGESTIONS }, props);
    expect(props.setShowSuggestions).toHaveBeenCalledWith(true);
    expect(props.logEvent).toHaveBeenCalled();
    expect(props.setCurrentViewName).toHaveBeenCalledWith("suggestions");
  });

  it('INSERT_SUGGESTION', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.INSERT_SUGGESTION, value: "bar" }, props);
    expect(props.setTextValue).toHaveBeenCalled();
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
  });

  it('CHANGE_LANGUAGE', () => {
    const props = getDefaultProps();
    global.changeLanguage = jest.fn();
    handleAction({ type: CmdConst.CHANGE_LANGUAGE, value: "dk" }, props);
    expect(props.setUserData).toHaveBeenCalled();
  });

  it('CHANGE_DWELL_TIME', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.CHANGE_DWELL_TIME, value: "1234" }, props);
    expect(props.setUserData).toHaveBeenCalled();
    expect(props.setCurrentViewName).toHaveBeenCalledWith(CmdConst.MAIN_MENU);
  });

  it('INCREASE_DWELLTIME', () => {
    const props = getDefaultProps({ userData: { settings: { dwelltime: 1000 } } });
    handleAction({ type: CmdConst.INCREASE_DWELLTIME }, props);
    expect(props.setUserData).toHaveBeenCalled();
    expect(props.setTextValue).toHaveBeenCalled();
  });

  it('DECREASE_DWELLTIME', () => {
    const props = getDefaultProps({ userData: { settings: { dwelltime: 1000 } } });
    handleAction({ type: CmdConst.DECREASE_DWELLTIME }, props);
    expect(props.setUserData).toHaveBeenCalled();
    expect(props.setTextValue).toHaveBeenCalled();
  });

  it('PLAY_ALARM', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.PLAY_ALARM }, props);
    expect(props.setAlarmActive).toHaveBeenCalledWith(true);
  });

  it('CLOSE_ALARM', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.CLOSE_ALARM }, props);
    expect(props.setAlarmActive).toHaveBeenCalledWith(true);
  });

  it('INCREASE_BUTTON_FONT_SIZE', () => {
    const props = getDefaultProps({ buttonFontSize: 10 });
    handleAction({ type: CmdConst.INCREASE_BUTTON_FONT_SIZE }, props);
    expect(props.setUserData).toHaveBeenCalled();
    expect(props.setButtonFontSize).toHaveBeenCalledWith(11);
  });

  it('DECREASE_BUTTON_FONT_SIZE', () => {
    const props = getDefaultProps({ buttonFontSize: 10 });
    handleAction({ type: CmdConst.DECREASE_BUTTON_FONT_SIZE }, props);
    expect(props.setUserData).toHaveBeenCalled();
    expect(props.setButtonFontSize).toHaveBeenCalledWith(9);
  });

  it('INCREASE_TEXT_FONT_SIZE', () => {
    const props = getDefaultProps({ textFontSize: 10 });
    handleAction({ type: CmdConst.INCREASE_TEXT_FONT_SIZE }, props);
    expect(props.setUserData).toHaveBeenCalled();
    expect(props.setTextFontSize).toHaveBeenCalledWith(11);
  });

  it('DECREASE_TEXT_FONT_SIZE', () => {
    const props = getDefaultProps({ textFontSize: 10 });
    handleAction({ type: CmdConst.DECREASE_TEXT_FONT_SIZE }, props);
    expect(props.setUserData).toHaveBeenCalled();
    expect(props.setTextFontSize).toHaveBeenCalledWith(9);
  });

  it('INSERT_LETTER_SUGGESTION', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.INSERT_LETTER_SUGGESTION, value: 'x' }, props);
    expect(props.setTextValue).toHaveBeenCalled();
    expect(props.logEvent).toHaveBeenCalled();
    expect(props.updateGlobalCursorPosition).toHaveBeenCalled();
    expect(props.setCurrentViewName).toHaveBeenCalledWith(CmdConst.WRITING);
  });

  it('TOGGLE_PAUSE', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.TOGGLE_PAUSE }, props);
    expect(props.setIsPaused).toHaveBeenCalled();
  });

  it('SWITCH_LAYOUT', () => {
    const props = getDefaultProps();
    handleAction({ type: CmdConst.SWITCH_LAYOUT, value: "layout2" }, props);
    expect(props.changeButtonNum).toHaveBeenCalled();
    expect(props.setCurrentLayoutName).toHaveBeenCalledWith("layout2");
  });

  it('default', () => {
    const props = getDefaultProps();
    handleAction({ type: "UNKNOWN_TYPE" }, props);
    expect(console.warn).toHaveBeenCalled();
  });
});
