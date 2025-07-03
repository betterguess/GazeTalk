export const getKeyboardGridV2Consts = (cols, textAreaColSpan) => {
    const editIdx = 0;
    const dotIndex = textAreaColSpan + 1;
    const ABCDIdx = cols + 2;
    const spaceIdx = (cols + 2) * 2;
    const delIdx = (cols + 2) * 3;
    const pauseIdx = (cols + 2) * 4;

    return {
        ABCDIdx,
        dotIndex,
        spaceIdx,
        editIdx,
        delIdx,
        pauseIdx,
    };
  };

  export const getKeyboardGridV1Consts = (cols, rows) => {
    const spaceIdx = (rows-1)*cols;

    return {
        spaceIdx,
    };
  };