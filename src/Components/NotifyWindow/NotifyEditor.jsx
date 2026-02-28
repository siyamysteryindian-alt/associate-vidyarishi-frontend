import React, { useMemo, useRef } from "react";
import JoditEditor from "jodit-react";

function NotifyTemplate({
  NotifyWindowContent,
  setNotifyWindowContent,
  placeholder,
}) {
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
        value={NotifyWindowContent}
        config={config}
        tabIndex={1}
        onChange={(newContent) => {
          setNotifyWindowContent(newContent);
        }}
      />
    </div>
  );
}

export default NotifyTemplate;
