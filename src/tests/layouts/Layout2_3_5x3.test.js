import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";
import App from '../../App';
import { UserBehaviourTestProvidor } from '../../components/UserBehaviourTest';

HTMLMediaElement.prototype.play = () => Promise.resolve();

// Mock react-i18next to return a translation function.
jest.mock('i18next', () => ({
    changeLanguage: jest.fn(),
  }));

jest.mock("axios");

describe("Layout2_3_5x3", () => {
  const dwellTime = 2000;
  test("switches to layout '2+3+5x3' when the corresponding layoutTile is hovered for the dwell time", async () => {
    axios.post.mockImplementation(async (url, data) => {
        if (url.includes("lettercontinuations")) {
          return {
            data: {
              continuations: "etaoinshrlcd"
            }
          };
        }
        return { data: { continuations: [] } };
      });
    render(
      <UserBehaviourTestProvidor>
        <App initialView="layouts" initialLayout="2+2+4x2" />
      </UserBehaviourTestProvidor>
    );
    
    let metadataBefore = screen.getByTestId("layout-metadata");
    expect(metadataBefore).toHaveAttribute("data-textareacolspan", "2");
    expect(metadataBefore).toHaveAttribute("data-rows", "3");
    expect(metadataBefore).toHaveAttribute("data-cols", "4");


    const layoutTile = screen.getByRole("button", { name: /2\+3\+5x3/i });
    expect(layoutTile).toBeInTheDocument();
    jest.useFakeTimers();
    fireEvent.mouseEnter(layoutTile);
    act(() => {
      jest.advanceTimersByTime(dwellTime);
    });
    fireEvent.mouseLeave(layoutTile);
    jest.useRealTimers();
    
    await waitFor(() => {
      const metadataAfter = screen.getByTestId("layout-metadata");
      expect(metadataAfter.getAttribute("data-textareacolspan")).toBe("2");
      expect(metadataAfter.getAttribute("data-rows")).toBe("4");
      expect(metadataAfter.getAttribute("data-cols")).toBe("5");
    }, { timeout: 500 });
  });
  
  test("renders the expected number of tiles in writing view", async () => {
    axios.post.mockImplementation(async (url, data) => {
        if (url.includes("lettercontinuations")) {
          return {
            data: {
              continuations: "etaoinshrlcd"
            }
          };
        }
        return { data: { continuations: [] } };
      });
    
    render(
      <UserBehaviourTestProvidor>
        <App initialView="writing" initialLayout="2+3+5x3"  />
      </UserBehaviourTestProvidor>
    );
    await waitFor(() => {
        const tileElements = document.querySelectorAll(".tile");
        expect(tileElements.length).toBe(19); 
    });
  });


  test("renders the expected number of tiles in suggestions view", async () => {
    axios.post.mockImplementation(async (url, data) => {
      if (url.includes("continuations")) {
        return {
          data: {
            continuations: ["the", "it", "if", "is", "what", "for", "can", "are", "that", "no", "yes", "not", "i", "you", "just", "please"]
          }
        };
      }
      return { data: { continuations: [] } };
    });
  
  render(
    <UserBehaviourTestProvidor>
      <App initialView="suggestions" initialLayout="2+3+5x3"  />
    </UserBehaviourTestProvidor>
  );

  await waitFor(() => {
      const tileElements = document.querySelectorAll(".tile");
      expect(tileElements.length).toBe(19); 
    });
  });
});
