import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App';
import { config } from '../../config/config';
import '@testing-library/jest-dom';
import axios from 'axios';
import { act } from '@testing-library/react';
import { UserBehaviourTestProvidor } from '../../components/UserBehaviourTest';

// Mock react-i18next to provide a simple translation function.
// jest.mock('react-i18next', () => ({
//   useTranslation: () => ({
//     t: (key) => key,
//     i18n: { changeLanguage: () => jest.fn() },
//   }),
// }));

jest.mock('i18next', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('axios');
jest.mock("@uidotdev/usehooks", () => ({
    useLocalStorage: (key, initialValue) => [
      {
        settings: {
          language: "en",  // Force a different language
          dwelltime: 1000,
          button_font_size: 40,  // Custom button font size
          text_font_size: 25,    // Custom text font size
        },
        ranking: {}, // Custom ranking
      },
      jest.fn(), // Mock setter function
    ],
  }));
  

describe('Checking configurations', () => {
    const settings = 
    beforeEach(() => {
        // For tests that do not need suggestions (static), we return empty arrays.
        axios.post.mockImplementation((url) => {
            if (url.includes("continuations")) {
            return Promise.resolve({ data: { continuations: [] } });
            }
            if (url.includes("lettercontinuations")) {
            return Promise.resolve({ data: { continuations: [] } });
            }
            return Promise.resolve({ data: {} });
        });
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    const staticConfigs = [ // Some excluded as they contain special characters.
       // config.views["numbers2"],
        config.views["edit_language"],
        config.views["writing"],
        config.views["suggestions"],
        config.views["main_menu"],
        // config.views["writing_submenu"],
        config.views["navigation_menu"],
        config.views["edit_menu"],
        config.views["edit_dwelltime"],
        config.views["edit_settings"],
        config.views["more_function_menu"],
        config.views["ABCDEFGH_menu"],
        config.views["IJKLMNOP_menu"],
        config.views["QRSTUVWX_menu"],
        config.views["YZÆØÅ,?.._menu"],
        config.views["numbers"],
        //config.views["special_chars1"],
        //config.views["special_chars2"],
        //config.views["special_chars3"],
        config.views["adjust_font_size"],
        config.views["pause"]
    ];
    for (let i = 0; i < staticConfigs.length; i++) {
        test(`Static configuration: ${staticConfigs[i].name} renders correctly`, async () => {
            await act(async () => {
                render(
                  <UserBehaviourTestProvidor>
                    <App initialView={staticConfigs[i].name} />
                  </UserBehaviourTestProvidor>
                );
              });
            const textArea = document.getElementById('text_region');
            expect(textArea).toBeInTheDocument();
            const tiles = staticConfigs[i].tiles.filter(tile => tile.type !== 'textarea');
            tiles.forEach(tile => {
                if (tile.label.trim() !== "") {
                    expect(
                        screen.getByText((content, element) =>
                          element.classList.contains("label") &&
                          content.trim() === tile.label.trim()
                        )
                      ).toBeInTheDocument();
                }
            });
        });
    }
   

});
