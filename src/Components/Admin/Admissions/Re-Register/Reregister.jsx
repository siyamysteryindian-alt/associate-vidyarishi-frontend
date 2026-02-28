import React from "react";
import List_of_re_registers from "./List_of_re_registers";
import { MdDownload, MdFileDownload, MdFileUpload } from "react-icons/md";
import { HiCloudUpload } from "react-icons/hi";

const Reregister = () => {
  return (
    <section className="top-0  dark:bg-slate-900 py-2  m-2 rounded-2xl">
      {/* Header card */}
      <div
        className="px-6 sm:px-8 w-full h-16 flex items-center justify-between rounded-2xl"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
        }}
      >
        <div className="flex flex-col justify-center">
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: "var(--brand-ink)" }}
          >
            Student Management
          </span>
          <span className="text-xs mt-0.5 text-slate-500">
            {" "}
            Re-Registration
          </span>
        </div>

        <div className="flex flex-row gap-2 sm:gap-3 items-center">
          {/* Upload */}
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                       text-xs font-medium text-slate-700 dark:text-slate-200
                       hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600
                       dark:hover:bg-slate-700 dark:hover:border-pink-500 transition"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <MdFileUpload size={18} />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Download */}
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                       text-xs font-medium text-slate-700 dark:text-slate-200
                       hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600
                       dark:hover:bg-slate-700 dark:hover:border-pink-500 transition"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <MdFileDownload size={18} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
      {/* Body */}{" "}
      <section className="mt-2">
        <List_of_re_registers />
      </section>
    </section>
  );
};

export default Reregister;
