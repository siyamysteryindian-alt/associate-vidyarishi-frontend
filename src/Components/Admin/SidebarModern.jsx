import React, { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

/* icons used in your original sidebar */
import {
  MdOutlineDashboard,
  MdLeaderboard,
  MdAddTask,
  MdOutlineAccountBalance,
} from "react-icons/md";
import {
  RiArrowDropDownFill,
  RiArrowDropRightFill,
  RiLockPasswordFill,
} from "react-icons/ri";
import { PiStudentFill } from "react-icons/pi";
import { HiUsers } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoSettingsSharp } from "react-icons/io5";

/**
 * SidebarModern
 *
 * Props:
 * - role: "center" | "subcenter" | "opmanager" | "admin" (string)
 * - loggedUser: { name, photo, role, userType, allotedUniversities? }  (object)
 * - selectedUniversity: { name } (object)
 * - blockedUniversities: array of names (array)
 * - onToggleProfile: () => void  (optional)
 * - onLogout: () => Promise<void> or () => void (optional)
 *
 * It uses NavLink so your route structure stays the same.
 */
const SidebarModern = ({
  role = "center",
  loggedUser = {},
  selectedUniversity = { name: "" },
  blockedUniversities = [],
  onToggleProfile = () => {},
  onLogout = () => {},
}) => {
  const location = useLocation();

  // collapsed sidebar state (for compact UI)
  const [collapsed, setCollapsed] = useState(false);

  // submenu open states
  const [openMenus, setOpenMenus] = useState({
    leads: false,
    students: false,
    admissions: false,
    accounts: false,
    users: false,
    academic: false,
  });

  const toggleMenu = (key) => setOpenMenus((s) => ({ ...s, [key]: !s[key] }));

  // convenience flags
  const isBlocked = blockedUniversities.includes(selectedUniversity?.name);
  const userType = loggedUser?.userType || "";

  // small helper to render a group header with icon and caret
  const GroupButton = ({ Icon, label, keyName, defaultOpen = false }) => {
    const isOpen = !!openMenus[keyName];
    return (
      <button
        onClick={() => toggleMenu(keyName)}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg transition-colors text-sm
          hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-200`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          <span className={`${collapsed ? "hidden" : "inline-block"}`}>
            {label}
          </span>
        </div>

        <RiArrowDropDownFill
          size={18}
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
    );
  };

  const NavItem = ({ to, label, icon: Icon, small = false }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-sm ${
          isActive ? "bg-green-400 text-white" : "hover:bg-green-50"
        }`
      }
    >
      <Icon size={18} />
      <span className={`${collapsed ? "hidden" : "inline-block"}`}>
        {label}
      </span>
    </NavLink>
  );

  // precompute which menu to show based on role
  const showLeadsAndStudents =
    role === "center" || role === "subcenter" || role === "opmanager";
  const showAdmissions = !isBlocked; // original logic: when not blocked, show Leads/Students else show Admissions
  const showUsers = true;
  const showAccounts = true;
  const showSettings = true;

  return (
    <aside
      className={`bg-white dark:bg-slate-900 border-r dark:border-slate-800 h-screen p-3 flex flex-col justify-between transition-all
        ${collapsed ? "w-20" : "w-56"}`}
      aria-label="Main navigation"
    >
      <div>
        {/* top: logo + collapse toggle */}
        <div className="flex items-center justify-between gap-2 px-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shadow">
              V
            </div>
            {!collapsed && (
              <div className="font-semibold text-sm">Vidyarishi</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              title={collapsed ? "Expand" : "Collapse"}
              onClick={() => setCollapsed((c) => !c)}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-pressed={collapsed}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d={collapsed ? "M6 9l6 6 6-6" : "M18 15l-6-6-6 6"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search (compact) */}
        {!collapsed && (
          <div className="px-2 mb-3">
            <input
              placeholder="Search..."
              className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-green-200"
              aria-label="Sidebar search"
              onChange={() => {}}
            />
          </div>
        )}

        {/* Main nav groups */}
        <nav className="space-y-2 px-1">
          <div>
            {/* Dashboard */}
            <NavItem
              to="dashboard"
              label="Dashboard"
              icon={MdOutlineDashboard}
            />
          </div>

          {showLeadsAndStudents && (
            <div className="mt-1">
              {/* Leads group */}
              <div>
                <GroupButton
                  Icon={MdLeaderboard}
                  label="Leads"
                  keyName="leads"
                />
                {openMenus.leads && (
                  <div className="pl-6 mt-2 flex flex-col gap-1">
                    <NavLink
                      to="lead-generate"
                      className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                    >
                      <RiArrowDropRightFill /> {!collapsed && "Generate"}
                    </NavLink>
                    <NavLink
                      to="show-lead"
                      className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                    >
                      <RiArrowDropRightFill /> {!collapsed && "Show"}
                    </NavLink>
                    <NavLink
                      to="prospectus-registration"
                      className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                    >
                      <RiArrowDropRightFill /> {!collapsed && "Show All Leads"}
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Students group */}
              <div className="mt-2">
                <GroupButton
                  Icon={PiStudentFill}
                  label="Students"
                  keyName="students"
                />
                {openMenus.students && (
                  <div className="pl-6 mt-2 flex flex-col gap-1">
                    <NavLink
                      to="lead-application-form"
                      className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                    >
                      <RiArrowDropRightFill /> {!collapsed && "Fresh Apply"}
                    </NavLink>
                    <NavLink
                      to="show-application-forms"
                      className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                    >
                      <RiArrowDropRightFill /> {!collapsed && "Show Students"}
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          )}

          {!showLeadsAndStudents && showAdmissions && (
            <div className="mt-2">
              <GroupButton
                Icon={MdAddTask}
                label="Admissions"
                keyName="admissions"
              />
              {openMenus.admissions && (
                <div className="pl-6 mt-2 flex flex-col gap-1">
                  <NavLink
                    to="applications"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                  >
                    <RiArrowDropRightFill /> {!collapsed && "Applications"}
                  </NavLink>
                  <NavLink
                    to="new-application"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                  >
                    <RiArrowDropRightFill /> {!collapsed && "Fresh Apply"}
                  </NavLink>
                  <NavLink
                    to="re-register"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                  >
                    <RiArrowDropRightFill /> {!collapsed && "Re-Register"}
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Accounts */}
          {showAccounts && (
            <div className="mt-2">
              <GroupButton
                Icon={MdOutlineAccountBalance}
                label="Accounts"
                keyName="accounts"
              />
              {openMenus.accounts && (
                <div className="pl-6 mt-2 flex flex-col gap-1">
                  <NavLink
                    to="center-ledger"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                  >
                    <RiArrowDropRightFill /> {!collapsed && "Center Ledgers"}
                  </NavLink>
                  <NavLink
                    to="offline-payment"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                  >
                    <RiArrowDropRightFill /> {!collapsed && "Offline Payment"}
                  </NavLink>
                  <NavLink
                    to="online-payment"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                  >
                    <RiArrowDropRightFill /> {!collapsed && "Online Payment"}
                  </NavLink>
                  <NavLink
                    to="student-ledger"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                  >
                    <RiArrowDropRightFill /> {!collapsed && "Student Ledger"}
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Users */}
          {showUsers && (
            <div className="mt-2">
              <GroupButton Icon={HiUsers} label="Users" keyName="users" />
              {openMenus.users && (
                <div className="pl-6 mt-2 flex flex-col gap-1">
                  <NavLink
                    to="sub-center"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                  >
                    <RiArrowDropRightFill /> {!collapsed && "Sub-Center"}
                  </NavLink>

                  {/* conditional extra user routes for certain userTypes */}
                  {(userType === "Inhouse" || userType === "Both") && (
                    <>
                      <NavLink
                        to="counsellors"
                        className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                      >
                        <RiArrowDropRightFill /> {!collapsed && "Counsellor"}
                      </NavLink>
                      <NavLink
                        to="sub-counsellors"
                        className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                      >
                        <RiArrowDropRightFill />{" "}
                        {!collapsed && "Sub Counsellor"}
                      </NavLink>
                    </>
                  )}

                  <NavLink
                    to="create-accountant"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded hover:bg-slate-100"
                  >
                    <RiArrowDropRightFill /> {!collapsed && "Account"}
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          {showSettings && (
            <div className="mt-3">
              <NavItem to="settings" label="Settings" icon={IoSettingsSharp} />
            </div>
          )}
        </nav>
      </div>

      {/* profile + logout (sticky bottom) */}
      <div className="mt-4">
        <div className="px-2">
          <div
            className={`flex items-center gap-3 p-3 rounded-lg ${
              collapsed ? "justify-center" : ""
            } hover:bg-slate-100`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
              {loggedUser?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={loggedUser.photo}
                  alt={loggedUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-sm font-semibold">
                  {(loggedUser?.name || "U").charAt(0)}
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="flex-1">
                <div className="text-sm font-semibold truncate">
                  {loggedUser?.name || "User"}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{loggedUser?.role || ""}</span>
                  <span className="text-green-400 -mt-1">
                    <GoDotFill />
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {!collapsed && (
                <button
                  onClick={() => onToggleProfile()}
                  className="px-3 py-1 rounded-md text-xs hover:bg-slate-100"
                >
                  Profile
                </button>
              )}
              <button
                onClick={onLogout}
                className="px-3 py-1 rounded-md text-xs bg-red-500 text-white hover:brightness-95"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>

          {/* small links below profile when expanded */}
          {!collapsed && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <NavLink
                to="profile"
                className="text-xs px-3 py-2 rounded-md hover:bg-slate-100 text-center"
              >
                Profile
              </NavLink>
              <NavLink
                to="change-password"
                className="text-xs px-3 py-2 rounded-md hover:bg-slate-100 text-center"
              >
                Change Password
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarModern;
