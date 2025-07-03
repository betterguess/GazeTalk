import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";
import App from '../../App';
import { UserBehaviourTestProvidor } from '../../components/UserBehaviourTest';
// Mock react-i18next to return a translation function.

HTMLMediaElement.prototype.play = () => Promise.resolve();

jest.mock('i18next', () => ({
    changeLanguage: jest.fn(),
  }));

jest.mock("axios");

describe("Layout4_4x4", () => {
  const dwellTime = 2000;

  test("switches to layout '4+4x4' when the corresponding layoutTile is hovered for the dwell time", async () => {
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
        <App initialView="layouts" initialLayout="2+2+4x2"  />
      </UserBehaviourTestProvidor> 
    );
  
    let metadataBefore = screen.getByTestId("layout-metadata");
    expect(metadataBefore).toHaveAttribute("data-textareacolspan", "2");
    expect(metadataBefore).toHaveAttribute("data-rows", "3");
    expect(metadataBefore).toHaveAttribute("data-cols", "4");


    const layoutTile = screen.getByRole("button", { name: /4\+4x4/i });
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
      expect(metadataAfter.getAttribute("data-textareacolspan")).toBe("4");
      expect(metadataAfter.getAttribute("data-rows")).toBe("5");
      expect(metadataAfter.getAttribute("data-cols")).toBe("4");
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
        <App initialView="writing" initialLayout="4+4x4"  />
      </UserBehaviourTestProvidor> 
    );
    await waitFor(() => {
        const tileElements = document.querySelectorAll(".tile");
        expect(tileElements.length).toBe(17); 
      });
  });

  test("renders the expected number of tiles in suggestions view", async () => {
    axios.post.mockImplementation(async (url, data) => {
      if (url.includes("continuations")) {
        return {
          data: {
            continuations: ["the", "it", "if", "is", "what", "for", "can", "are", "that", "no", "yes", "not", "i", "you"]
          }
        };
      }
      return { data: { continuations: [] } };
    });
  
  render(
    <UserBehaviourTestProvidor>
      <App initialView="suggestions" initialLayout="4+4x4"  />
    </UserBehaviourTestProvidor> 
  );

  await waitFor(() => {
      const tileElements = document.querySelectorAll(".tile");
      expect(tileElements.length).toBe(17);
    });
  });
});
