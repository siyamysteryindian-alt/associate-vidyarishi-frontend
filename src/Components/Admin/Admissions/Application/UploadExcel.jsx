import React from "react";
import { IoClose } from "react-icons/io5";

const UploadExcel = ({ HandleUploadExcelOptionClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 dark:text-white rounded-2xl w-[90vw] max-w-xl shadow-2xl border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide">
              Upload Excel
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Import student records using the official Excel template.
            </span>
          </div>
          <button
            type="button"
            onClick={HandleUploadExcelOptionClose}
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
          <div>
            <label
              htmlFor="Template"
              className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2 tracking-wide"
            >
              Upload Excel File
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                id="Template"
                className="block w-full text-xs md:text-sm
                  file:mr-3 file:px-3 file:py-1.5 file:rounded-full file:border-0
                  file:bg-pink-100 file:text-pink-700 file:text-xs file:font-semibold
                  hover:file:bg-pink-200
                  bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                  focus:ring-pink-500 focus:border-pink-500 
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white 
                  dark:focus:ring-pink-500 dark:focus:border-pink-500"
                placeholder="Ex: Fee Pending"
                required
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Supported formats: <span className="font-semibold">.xlsx</span>,{" "}
                <span className="font-semibold">.xls</span>,{" "}
                <span className="font-semibold">.csv</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              className="px-5 py-2 rounded-full text-xs md:text-sm font-semibold
                border border-emerald-600 text-emerald-600
                hover:bg-emerald-600 hover:text-white transition"
            >
              Upload &amp; Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadExcel;
