import React from "react";
import { IoClose } from "react-icons/io5";

const DownloadDocuments = ({ HandleOpenDocumentDownloadClose }) => {
  const options = ["Select All", "Photos", "Documents"];

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 dark:text-white rounded-2xl w-[90vw] max-w-xl shadow-2xl border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide">
              Download Documents
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Choose what you want to export for this student.
            </span>
          </div>
          <button
            type="button"
            onClick={HandleOpenDocumentDownloadClose}
            className="shrink-0"
          >
            <IoClose
              size={26}
              className="text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1 transition-colors"
            />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          <div className="space-y-3">
            {options.map((label, index) => {
              const id = `download-option-${index}`;
              return (
                <div key={id} className="flex items-center">
                  <input
                    id={id}
                    type="checkbox"
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded 
                      focus:ring-pink-500 dark:focus:ring-pink-500 dark:ring-offset-gray-800 
                      focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={id}
                    className="ms-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {label}
                  </label>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              className="px-4 py-2 rounded-full text-xs md:text-sm font-semibold
                border border-emerald-600 text-emerald-600
                hover:bg-emerald-600 hover:text-white transition"
            >
              Export as Image
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-full text-xs md:text-sm font-semibold
                border border-pink-600 text-pink-600
                hover:bg-pink-600 hover:text-white transition"
            >
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadDocuments;
