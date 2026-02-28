import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Settingsnav from "./Settingsnav";

const AdminSettings = () => {
  const Location = useLocation();
  const pathnames = Location.pathname.split("/").filter((x) => x);

  useEffect(() => {}, []);

  return (
    <>
      <section className="top-0 dark:bg-slate-800  pb-2 rounded-lg ">
        <div className="ScrollBarStyle h-[calc(100vh-40px)]  overflow-hidden overflow-y-scroll">
          <div className="px-2.5 flex  flex-col ">
            <div className="text-base font-semibold bg-white text-left mt-3 rounded-2xl mb-4  p-4 ">
              Settings
            </div>

            <div>
              <nav class="flex" aria-label="Breadcrumb">
                <ol class="inline-flex items-center px-4 py-1 rounded-2xl m-0.5 mb-2 text-base font-semibold bg-white">
                  {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathnames.length - 1;

                    return (
                      <li class="inline-flex items-center m-0.5">
                        <span className="mx-1">/</span>

                        {isLast ? (
                          <div
                            class="text-base font-semibold inline-flex items-center text-gray-700 
                      hover:text-blue-600 cursor-pointer dark:text-white"
                          >
                            {value === "email-template"
                              ? "Email Template"
                              : value === "page-access"
                              ? "Page Access"
                              : value === "admission-type"
                              ? "Admission Type"
                              : value === "course-type"
                              ? "Course Type"
                              : value === "admission-session"
                              ? "Admission Session"
                              : value === "exam-session"
                              ? "Exam Session"
                              : value === "notify-info"
                              ? "Display Notify"
                              : value}
                          </div>
                        ) : (
                          <>
                            <NavLink
                              to={to === "/admin" ? "/admin/dashboard" : to}
                              class="inline-flex hover:underline items-center text-sm font-medium 
                          text-gray-700 hover:text-blue-600"
                            >
                              {value}
                            </NavLink>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>

            {/* admin area with sidebar */}
            <div className="grid lg:grid-cols-[250px,1fr]">
              <section className="m-2">
                <Settingsnav />
              </section>

              <section className="justify-start mr-3 rounded-lg p-1">
                {Location.pathname === "/admin/settings" ? (
                  <>
                    <div className="flex justify-center items-center h-full text-2xl font-bold uppercase tracking-wider">
                      Settings
                    </div>
                  </>
                ) : (
                  <Outlet />
                )}
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminSettings;
