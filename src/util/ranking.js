import { useState } from "react";

let buttonNum = 14;
let ranking = {};

export const setRanking = (xRanking) => {
    ranking = xRanking;
}

export const setButtonNum = (xNum) => {
    ranking = {};
    buttonNum = xNum;
}

export const getButtonNum = () => {
    return buttonNum;
}

export const getRank = () => {
    return ranking;
}

const assert = function(condition, message) {
    if (!condition)
        throw Error('Assert failed: ' + (message || ''));
};


const getCharacterPreferenceScores = (character) => {
    assert(ranking, "ranking does not exist");
    assert(character, "character does not exist");
    
    if (character in ranking) {
        return ranking[character];
    }

    if (process.env.NODE_ENV === "test"){
        return Array(buttonNum).fill(0);
    }
    ranking[character] = Array(buttonNum).fill(0).map(() => Math.floor(Math.random() * 5));

    return ranking[character];
}


const getRankedPositions = (scores) => {
    const indexedScores = scores.map((score, index) => ({ score, index }));
    indexedScores.sort((a, b) => b.score - a.score);
    return indexedScores.map(item => item.index);
}


export const updateRank = (layout, character) => {
    if (layout.length !== buttonNum) {
        throw new Error("Array length must be equal to button number constant");
    }
    
    let selectionIndex = -1;
    for (let i = 0; i < layout.length; i++) {
        if (layout[i] === character) {
            selectionIndex = i;
            break;
        }
    }
    
    if (selectionIndex === -1) return;

    const currentScores = getCharacterPreferenceScores(character);
    currentScores[selectionIndex] = currentScores[selectionIndex] + 1;
    ranking[character] = currentScores;
}

export const rank = (characters, suggestionCharacter, currentSelection) => {
    const proposers = characters.slice(0, buttonNum); 
    const reviewers = Array.from({ length: buttonNum }, (_, i) => i);

    const proposerPreferences = new Map(); 
    const reviewerPreferences = new Map(); 

    for (const char of proposers) {
        let scores = getCharacterPreferenceScores(char);
       
        if (char === suggestionCharacter) {
            const boostedScores = [...scores];
            boostedScores[currentSelection]++;
            proposerPreferences.set(char, getRankedPositions(boostedScores));
        } else {
            proposerPreferences.set(char, getRankedPositions(scores));
        }
    }

    for (const pos of reviewers) {
        const positionScores = proposers.map(char => ({
            char: char,
            score: getCharacterPreferenceScores(char)[pos]
        }));
        positionScores.sort((a, b) => b.score - a.score);
        reviewerPreferences.set(pos, positionScores.map(item => item.char));
    }
    
    const reviewerRankings = new Map();
    for (const [pos, prefList] of reviewerPreferences.entries()) {
        const rankMap = new Map();
        prefList.forEach((char, rank) => rankMap.set(char, rank));
        reviewerRankings.set(pos, rankMap);
    }

    const freeProposers = [...proposers];
    const engagements = new Map(); 
    const proposalsMade = new Map(proposers.map(p => [p, 0])); 

    while (freeProposers.length > 0) {
        const currentProposer = freeProposers.shift();
        const proposalIndex = proposalsMade.get(currentProposer);
        
        if (!proposerPreferences.has(currentProposer) || proposalIndex >= proposerPreferences.get(currentProposer).length) {
            continue; 
        }
        
        const preferredReviewer = proposerPreferences.get(currentProposer)[proposalIndex];
        proposalsMade.set(currentProposer, proposalIndex + 1);

        const currentPartner = engagements.get(preferredReviewer);

        if (currentPartner === undefined) {
            engagements.set(preferredReviewer, currentProposer);
        } else {
            const rankingsForReviewer = reviewerRankings.get(preferredReviewer);
            const currentPartnerRank = rankingsForReviewer.get(currentPartner);
            const newProposerRank = rankingsForReviewer.get(currentProposer);

            if (newProposerRank < currentPartnerRank) {
                engagements.set(preferredReviewer, currentProposer);
                freeProposers.push(currentPartner);
            } else {
                freeProposers.push(currentProposer);
            }
        }
    }

    const newLayout = Array(buttonNum).fill("");
    for (const [position, character] of engagements.entries()) {
        newLayout[position] = character;
    }

    return newLayout;
}

export const stripSpace = (arr) => {
    return arr.filter(item => item !== "space");
}