import React from "react";
import KeyboardGridV2 from "../components/KeyboardGridV2";
const KeyboardLayoutV2_3x3 = (props) => {
  return (
      <KeyboardGridV2 {...props}  />
  );
};

KeyboardLayoutV2_3x3.properties = {
  cols: 3,
  rows: 4,
};

export default KeyboardLayoutV2_3x3;
