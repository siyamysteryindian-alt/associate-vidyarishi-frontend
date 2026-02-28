import React from "react";
import ApplicationPDF from "./ApplicationPDF";
import { useSelector } from "react-redux";

const Application_form = () => {
  const StudentIdByReduxStore = useSelector((state) => state?.studentId);

  return (
    <div className="w-full mx-2 flex-1">
      <div className="mt-3 h-[calc(100vh-30vh)] overflow-y-auto flex items-center justify-center">
        <div className="w-full max-w-3xl">
          {/* Success Card */}
          <div className="bg-white/90 dark:bg-slate-900/80  rounded-2xl px-5 py-6 md:px-8 md:py-8">
            {/* Icon + Heading */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
                <svg
                  className="h-7 w-7 text-emerald-600 dark:text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    className="stroke-current"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M8 12.5L10.5 15L16 9.5"
                    className="stroke-current"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="text-lg md:text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                Application submitted successfully
              </h1>

              <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                Your application has been recorded. You can download the
                application form as a PDF for your reference and future use.
              </p>

              {StudentIdByReduxStore?.id && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1">
                  <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Application ID
                  </span>
                  <span className="text-[11px] font-mono text-slate-800 dark:text-slate-100">
                    {StudentIdByReduxStore.id}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3">
              {/* Primary: Download / View Application */}
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-semibold px-4 py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <span>Download Application PDF</span>
              </button>

              {/* Secondary: Back / New Action (you can wire later) */}
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] md:text-xs font-medium text-slate-600 dark:text-slate-200 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Back to dashboard
              </button>
            </div>

            {/* PDF Preview / Component */}
            <div className="mt-6 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                  Application Form Preview
                </p>
                <span className="text-[10px] text-slate-400">
                  You can print / save from this view
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 p-3 overflow-hidden">
                <div className="bg-white dark:bg-slate-950 rounded-lg shadow-sm overflow-hidden">
                  <ApplicationPDF />
                </div>
              </div>
            </div>
          </div>

          {/* Small spacing at bottom */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default Application_form;
