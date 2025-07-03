import React from "react";
import { ABCDEFGH_menuConfig } from "./ABCDEFGH_menuConfig";
import { IJKLMNOP_menuConfig } from "./IJKLMNOP_menuConfig";
import { QRSTUVWX_menuConfig } from "./QRSTUVWX_menuConfig";
import { YZ_menuConfig } from "./YZ_menuConfig";
import { numbersConfig } from "./numbersConfig";
import { numbers2Config } from "./numbers2Config";
import { edit_languageConfig } from "./edit_languageConfig";
import { writingConfig } from "./writingConfig";
import { suggestionsConfig } from "./suggestionsConfig";
import { main_menuConfig } from "./main_menuConfig";
import { writing_submenuConfig } from "./writing_submenuConfig";
import { navigation_menuConfig } from "./navigation_menuConfig";
import { edit_menuConfig } from "./edit_menuConfig";
import { edit_dwelltimeConfig } from "./edit_dwelltimeConfig";
import { edit_settingsConfig } from "./edit_settingsConfig";
import { more_function_menuConfig } from "./more_function_menuConfig";
import { special_chars1Config } from "./special_chars1Config";
import { special_chars2Config } from "./special_chars2Config";
import { special_chars3Config } from "./special_chars3Config";
import { adjust_font_sizeConfig } from "./adjust_font_sizeConfig"
import { pauseConfig } from "./pauseConfig"
import { layoutsConfig } from "./layoutsConfig"
import { trackerTestConfig } from "./trackerTestConfig"
import { first_pageConfig } from "./first_pageConfig";
import { Alphabet_V2Config } from "./AlphabetV2";
import {development_menuConfig} from "./developer_menuConfig"
export const config = {
  views: {
      "first_page": first_pageConfig,
      "numbers2": numbers2Config,
      "edit_language": edit_languageConfig,
      "writing": writingConfig,
      "suggestions": suggestionsConfig,
      "main_menu": main_menuConfig,
      "writing_submenu": writing_submenuConfig,
      "navigation_menu": navigation_menuConfig,
      "edit_menu": edit_menuConfig,
      "edit_dwelltime": edit_dwelltimeConfig,
      "edit_settings": edit_settingsConfig,
      "more_function_menu": more_function_menuConfig,
      "ABCDEFGH_menu": ABCDEFGH_menuConfig,
      "IJKLMNOP_menu": IJKLMNOP_menuConfig,
      "QRSTUVWX_menu": QRSTUVWX_menuConfig,
      "YZÆØÅ,?.._menu": YZ_menuConfig,
      "numbers": numbersConfig,
      "special_chars1": special_chars1Config,
      "special_chars2": special_chars2Config,
      "special_chars3": special_chars3Config,
      "adjust_font_size" : adjust_font_sizeConfig,
      "pause" : pauseConfig,
      "layouts": layoutsConfig,
      "tracker_test" : trackerTestConfig,
      "Alphabet_V2": Alphabet_V2Config,
      "development_menu" : development_menuConfig,
    }
};