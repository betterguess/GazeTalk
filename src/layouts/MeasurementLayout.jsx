import React, { useEffect, useState, useRef } from "react";
import "./TrackerLayout.css";

import { euclid_dist, pix2mm, getPPI } from "../util/dataAnalysis.js";
const MeasurementLayout = (props) => {
    const logInterval = 5;
    const transitionTime = 2000;
    
    const handleAction = props.onTileActivate;
    const nextLayout = props.nextLayout; 

    const screenPoints = [
        { top: "10%", left: "10%" },    
        { top: "10%", left: "55%" },    
    ];


    const [scale, setScale] = useState(0.2);
    const [isComplete, setIsComplete] = useState(false);

    const containerRef = useRef(null);

    const [distance, setDistance] = useState(0);

    useEffect(() => {
        setDistance(() => {
            const pixelDistance = euclid_dist([
                (screenPoints[0].left.replace('%', '') / 100) * window.innerWidth,
                (screenPoints[0].top.replace('%', '') / 100) * window.innerHeight
            ],
            [
                (screenPoints[1].left.replace('%', '') / 100) * window.innerWidth,
               (screenPoints[1].top.replace('%', '') / 100) * window.innerHeight
            ])
            return pix2mm(pixelDistance) 
        })
    },[]);

    // Shrinking animation function
    
    const switchToMainMenu = () => {
        // Call handleAction here
        if (handleAction) { 
            const action ={ type: "switch_layout", value: "2+2+4x2" };
            
            handleAction(action);
        }
        
    }
    return (

        <div>                                                   
             <div ref={containerRef} className="calibrationDiv">
                 {/* Static background circle with 50% opacity */}
                 

                 {/* Shrinking circle */}
                 <div
                     className={`dot ${isComplete ? 'fade-out' : ''}`}
                     style={{
                         top: screenPoints[0].top,
                         left: screenPoints[0].left,
                         transform: `translate(-50%, -50%) scale(${scale})`
                     }}
                 />
                 <div
                     className={`dot ${isComplete ? 'fade-out' : ''}`}
                     style={{
                         top: screenPoints[1].top,
                         left: screenPoints[1].left,
                         transform: `translate(-50%, -50%) scale(${scale})`
                     }}
                 />
                 <canvas id="plotting_canvas" width="500" height="500"></canvas>
             </div>
             <label>distance : {distance} ppi ; {getPPI()} </label>
         </div>
    );
};

MeasurementLayout.properties = {
    textAreaColSpan: 0,
    rows: 0,
    cols: 0,
};

export default MeasurementLayout;
