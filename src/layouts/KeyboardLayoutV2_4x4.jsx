import React from "react";
import KeyboardGridV2 from "../components/KeyboardGridV2";
const KeyboardLayoutV2_4x4 = (props) => {
  return (
      <KeyboardGridV2 {...props}  />
  );
};

KeyboardLayoutV2_4x4.properties = {
  cols: 4,
  rows: 5,
};

export default KeyboardLayoutV2_4x4;
