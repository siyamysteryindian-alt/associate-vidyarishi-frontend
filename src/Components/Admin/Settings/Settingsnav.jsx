import React from "react";
import { NavLink } from "react-router-dom";

const Settingsnav = () => {
  return (
    <>
      <div
        className="px-6 dark:bg-slate-700 dark:text-white bg-white border-t-slate-200 flex justify-between
         flex-col top-0 rounded-2xl h-[calc(80vh-55px)] ScrollBarStyle overflow-y-scroll "
      >
        <div className="text-base font-semibold bg-white text-left mt-3 rounded-2xl mb-4  ">
          <ul className="space-y-2 pt-2 pb-2 flex justify-center flex-col gap-2">
            {[
              "notify-info",
              "courieer",
              "notice",
              "email-template",
              "admission-session",
              // "exam-session",
              "admission-type",
              "mode",
              "course-type",
              "schema",
              // "page-access",
            ].map((value, index) => (
              <li className="">
                <NavLink
                  to={value}
                  className={`sidehome px-4 py-2.5 border border-slate-400 w-full flex text-sm justify-center 
                  items-center hover:bg-green-400 rounded-lg`}
                >
                  <div className="flex justify-center items-center gap-2">
                    {value === "email-template"
                      ? "Email Template"
                      : // : value === "page-access"
                      // ? "Page Access"
                      value === "courieer"
                      ? "Courieer Company"
                      : value === "admission-type"
                      ? "Admission Type"
                      : value === "course-type"
                      ? "Course Type"
                      : value === "admission-session"
                      ? "Admission Session"
                      : // : value === "exam-session"
                      // ? "Exam Session"
                      value === "notice"
                      ? "Notice"
                      : value === "notify-info"
                      ? "Display Notify"
                      : value}
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Settingsnav;
