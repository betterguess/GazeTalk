import React, { useEffect, useRef, useState } from "react";
import Tile from "./Tile";
import * as DataSavingSingleton from "../singleton/dataSavingSingleton";

const FormPopup = ({ onClose, dwellTime }) => {
  const [selectedDeviceMethod, setSelectedDeviceMethod] = useState(""); 

  useEffect(() => {
  }, []);

  const submit = () => {
    const data = {
      name: document.querySelector('.nameInput').value,
      device: document.querySelector('.deviceInput').value,
      screensize: document.querySelector('.screensizeInput').value,
      screen_resolution: window.screen.width + "x" + window.screen.height,
      interaction_method: selectedDeviceMethod, 
    }
    DataSavingSingleton.data.form_data = data;
    onClose();
  };

  const handleCheckboxChange = (method) => {
    setSelectedDeviceMethod(method);
  };

  return (
    <div className="form-overlay">
      <div className="form-popup-content">
        <h2>Data form</h2> 
        <div>
          <p>Please enter your name</p>
          <input className="nameInput" type="text" placeholder="Name" />
        </div>
        <div>
          <p>Please write what device you are using</p>
          <input className="deviceInput" type="text" placeholder="iPad gen 10" />
          If you are not using iPhone or iPad, please enter the screen size in inches
          <input className="screensizeInput" type="text" placeholder="27" />
        </div>
        <div>
          <p>Select your interaction method:</p>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedDeviceMethod === "eye-tracking"}
              onChange={() => handleCheckboxChange("eye-tracking")}
            />
            Eye Tracking
          </label>
          <br />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedDeviceMethod === "head-tracking"}
              onChange={() => handleCheckboxChange("head-tracking")}
            />
            Head Tracking
          </label>
          <br />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedDeviceMethod === "touch/mouse"}
              onChange={() => handleCheckboxChange("touch/mouse")}
            />
            Touch/Mouse
          </label>
        </div>
        <button onClick={submit}>Start Test</button>
      </div>

      <style jsx>{`
        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .form-popup-content {
          background-color: #333;
          padding: 2rem;
          border-radius: 8px;
          width: 80%;
          max-width: 500px;
        }
        
        .form-popup-content h2,
        .form-popup-content p,
        .form-popup-content div {
          color: white;
          margin-bottom: 1rem;
        }
        
        .form-popup-content input[type="text"] {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 4px;
          border: 1px solid #555;
          background-color: #444;
          color: white;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          user-select: none;
        }

        .form-popup-content input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #4CAF50; /* Green checkboxes */
          border-radius: 0; /* Make square */
        }
        
        .form-popup-content button {
          background-color: #4CAF50;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 1rem;
        }
        
        .form-popup-content button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default FormPopup;
