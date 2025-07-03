export const getNeighbours = (tileIndex, cols, rows, nextLetters, offset, suggestion) => {
    if (nextLetters.length == 0) {
    }
    if (nextLetters == null) {
        return [];
    }
    if (tileIndex >= nextLetters.length) {
        return [];
    }
    if (tileIndex < 0) {
        return [];
    }
    if (cols <= 0) {
        return [];
    }
    if (rows <= 0) {
        return [];
    }
    let neighbours = {}
    const spacePosition = (rows - 1) * cols;
    let tilePositionInGrid = tileIndex + offset;
    if (tileIndex + offset >= spacePosition) {
        tilePositionInGrid += 1;
        tileIndex += 1;
    }
    const row = Math.floor(tilePositionInGrid / cols);
    const col = tilePositionInGrid % cols;
    
    const left = tilePositionInGrid - 1;
    const up = tilePositionInGrid - cols
    const right = tilePositionInGrid + 1;
    const down = tilePositionInGrid + cols

    // Top-left
    if (row - 1 >= 0 && col - 1 >= 0 && (up - 1) >= offset) {
        neighbours["top-left"] = nextLetters[tileIndex - cols - 1];
    }
    // Top-middle
    if (row - 1 >= 0 && up >= offset) {
        neighbours["top-center"] = nextLetters[tileIndex - cols];
    }
    // Top-right
    if (row - 1 >= 0 && col + 1 < cols && (up + 1) >= offset) {
        neighbours["top-right"] = nextLetters[tileIndex - cols + 1];
    }
    // Middle-left
    if (col - 1 >= 0 && left != spacePosition && left >= offset) { 
        if (left > spacePosition) {
            neighbours["center-left"] = nextLetters[tileIndex - 2]; 
        } else {
            neighbours["center-left"] = nextLetters[tileIndex - 1]; 
        }
    }
    // Middle-right
    if (col + 1 < cols && right >= offset) {
        if (right > spacePosition) {
            neighbours["center-right"] = nextLetters[tileIndex];  
        } else {
            neighbours["center-right"] = nextLetters[tileIndex + 1];  
        }
    }
    // Bottom-left
    if (row + 1 < rows && col - 1 >= 0 && down - 1 != spacePosition && down - 1 >= offset) {
        if (down - 1 > spacePosition) {
            neighbours["bottom-left"] = nextLetters[tileIndex + cols - 2];
        } else {
            neighbours["bottom-left"] = nextLetters[tileIndex + cols - 1];
        }
    }
    // Bottom-middle
    if (row + 1 < rows && down != spacePosition && down >= offset) {
        if (down > spacePosition) {
            neighbours["bottom-center"] = nextLetters[tileIndex + cols - 1];
        } else {
            neighbours["bottom-center"] = nextLetters[tileIndex + cols];
        }
    }
    // Bottom-right
    if (row + 1 < rows && col + 1 < cols && (down + 1) >= offset) {
        if (down + 1 > spacePosition) {
            neighbours["bottom-right"] = nextLetters[tileIndex + cols];
        } else {
            neighbours["bottom-right"] = nextLetters[tileIndex + cols + 1];
        }
    }
    return neighbours;
}

