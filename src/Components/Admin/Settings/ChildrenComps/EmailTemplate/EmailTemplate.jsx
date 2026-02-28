import React, { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";

function EmailTemplate({ value, setValue, selectedItems, placeholder }) {
  const formattedItems = selectedItems.map(item => `{{${item}}}`).join(" "); // Make sure this is only added once

  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
    }),
    [placeholder]
  );

  return (
    <div className="App">
      <JoditEditor
        ref={editor}
        value={value}  
        config={config}
        tabIndex={2}
        onChange={(newContent) => {
          setValue(newContent);
        }}
      />
    </div>
  );
}

export default EmailTemplate;
