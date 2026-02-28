import React, { useState } from "react";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import ToggleButton from "../../../../Common/ToggleButton";

const List_of_re_registers = () => {
  const [LoginStatusToggleButton, setLoginStatusToggleButton] = useState("No");
  const HandleLoginStatusToggleYes = () => setLoginStatusToggleButton("Yes");
  const HandleLoginStatusToggleNo = () => setLoginStatusToggleButton("No");

  const [IdStatusToggleButton, setIdStatusToggleButton] = useState("No");
  const HandleIdStatusToggleYes = () => setIdStatusToggleButton("Yes");
  const HandleIdStatusToggleNo = () => setIdStatusToggleButton("No");

  return (
    <section className="bg-white mx-1 mt-4 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      {/* SEARCH BAR */}
      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-sm">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 
                  3.476l4.817 4.817a1 1 0 01-1.414 
                  1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search student..."
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-slate-100 
              dark:bg-slate-800 border border-slate-300 dark:border-slate-700 
              text-sm dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>
      </div>

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          {/* TABLE HEADER */}
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-xs tracking-wide">
            <tr>
              {[
                "Student Name",
                "Current Sem",
                "Re-Register For",
                "Course",
                "Mode",
                "Added By",
                "Status",
              ].map((head) => (
                <th key={head} className="px-4 py-3 font-semibold text-left">
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                Comming Soon....!
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 dark:border-slate-700">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold">1–10</span> of{" "}
          <span className="font-semibold">1000</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-md border border-slate-300 dark:border-slate-600 
            bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <IoChevronBack size={16} />
          </button>

          <button
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 
            bg-white dark:bg-slate-800 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            1
          </button>

          <button
            className="p-2 rounded-md border border-slate-300 dark:border-slate-600 
            bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <IoChevronForwardOutline size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default List_of_re_registers;
