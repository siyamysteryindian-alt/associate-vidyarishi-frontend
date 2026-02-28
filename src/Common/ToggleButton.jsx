import React, { useState } from "react";

const SegmentedToggle = ({
  ClickYes,
  ClickNo,
  StateUpdate,
  NoName,
  YesName,
}) => {

  return (
    <div>
      <div className="inline-flex mb-4">
        {/* No Button */}
        <button
          className={`px-3 py-1 text-sm font-semibold rounded-l-md focus:outline-none transition-colors cursor-pointer ${
            StateUpdate === false
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={ClickNo}
        >
          {NoName || "No"}
        </button>

        {/* Yes Button */}
        <button
          className={`px-3 py-1 text-sm font-semibold rounded-r-md focus:outline-none transition-colors cursor-pointer ${
            StateUpdate === true
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={ClickYes}
        >
          {YesName || "Yes"}
        </button>
      </div>
    </div>
  );
};

export default SegmentedToggle;
