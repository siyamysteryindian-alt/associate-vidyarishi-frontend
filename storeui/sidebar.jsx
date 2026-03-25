import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { RiArrowDropDownFill, RiLockPasswordFill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { MdLeaderboard, MdOutlineDashboard } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { MdOutlineAccountBalance } from "react-icons/md";
import { MdAddTask } from "react-icons/md";
import { SiMicrosoftacademic } from "react-icons/si";
import { RiArrowDropRightFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import UseGetLoggedUser from "../../CustomHooks/UseGetLoggedUser";
import { GoDotFill } from "react-icons/go";
import { PiStudentFill } from "react-icons/pi";

const Sidebar = () => {
  const LoggedUser = useSelector((state) => state.user);
  const GetSelectedUniversity = useSelector((state) => state.university);

  const { GetLoginUserDetails, LoggedUserData } = UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
  }, [LoggedUser]);

  // student
  const [NavLeadStudentToggle, setNavLeadStudentToggle] = useState(false);

  const NavLeadStudentButtonToggle = () => {
    setNavLeadStudentToggle(!NavLeadStudentToggle);
    setNavLeadToggle(false);
    setNavAdmissionToggle(false);
    setNavAcademicToggle(false);
    setNavAccountsToggle(false);
    setNavSettingToggle(false);
    setNavUsersToggle(false);
  };

  // Users
  const [NavLeadToggle, setNavLeadToggle] = useState(false);

  const NavLeadButtonToggle = () => {
    setNavLeadToggle(!NavLeadToggle);
    setNavAdmissionToggle(false);
    setNavAcademicToggle(false);
    setNavAccountsToggle(false);
    setNavSettingToggle(false);
    setNavUsersToggle(false);
    setNavLeadStudentToggle(false);
  };

  // Academic
  const [NavAcademicToggle, setNavAcademicToggle] = useState(false);

  const NavAcademicButtonToggle = () => {
    setNavAcademicToggle(!NavAcademicToggle);
    setNavAdmissionToggle(false);
    setNavAccountsToggle(false);
    setNavUsersToggle(false);
    setNavSettingToggle(false);
    setNavLeadToggle(false);
    setNavLeadStudentToggle(false);
  };

  // Admission
  const [NavAdmissionToggle, setNavAdmissionToggle] = useState(false);

  const NavAdmissionButtonToggle = () => {
    setNavAdmissionToggle(!NavAdmissionToggle);
    setNavAcademicToggle(false);
    setNavAccountsToggle(false);
    setNavUsersToggle(false);
    setNavSettingToggle(false);
    setNavLeadToggle(false);
    setNavLeadStudentToggle(false);
  };

  // Accounts
  const [NavAccountsToggle, setNavAccountsToggle] = useState(false);

  const NavAccountsButtonToggle = () => {
    setNavAccountsToggle(!NavAccountsToggle);
    setNavAcademicToggle(false);
    setNavUsersToggle(false);
    setNavSettingToggle(false);
    setNavAdmissionToggle(false);
    setNavLeadToggle(false);
    setNavLeadStudentToggle(false);
  };

  // Users
  const [NavUsersToggle, setNavUsersToggle] = useState(false);

  const NavUsersButtonToggle = () => {
    setNavUsersToggle(!NavUsersToggle);
    setNavAdmissionToggle(false);
    setNavAcademicToggle(false);
    setNavAccountsToggle(false);
    setNavSettingToggle(false);
    setNavLeadToggle(false);
    setNavLeadStudentToggle(false);
  };

  // Settings
  const [NavSettingToggle, setNavSettingToggle] = useState(false);

  const NavSettingsButtonToggle = () => {
    setNavUsersToggle(false);
    setNavAdmissionToggle(false);
    setNavAcademicToggle(false);
    setNavAccountsToggle(false);
    setNavLeadToggle(false);
    setNavLeadStudentToggle(false);
  };

  // Dashboard
  const NavAdminDasboardButtonToggle = () => {
    setNavUsersToggle(false);
    setNavAdmissionToggle(false);
    setNavAcademicToggle(false);
    setNavAccountsToggle(false);
    setNavLeadToggle(false);
    setNavLeadStudentToggle(false);
  };

  // Profile
  const [NavMyProfileToggle, setNavMyProfileToggle] = useState(false);
  const NavMyProfileButtonToggle = () => {
    setNavMyProfileToggle(!NavMyProfileToggle);
  };

  const Location = useLocation();

  const [DynamicColoring0, setDynamicColoring0] = useState(false);
  const [DynamicColoring, setDynamicColoring] = useState(false);
  const [DynamicColoring2, setDynamicColoring2] = useState(false);
  const [DynamicColoring3, setDynamicColoring3] = useState(false);
  const [DynamicColoring4, setDynamicColoring4] = useState(false);
  const [DynamicColoring5, setDynamicColoring5] = useState(false);
  const [DynamicColoring6, setDynamicColoring6] = useState(false);
  const [DynamicColoring7, setDynamicColoring7] = useState(false);
  const [DynamicColoring8, setDynamicColoring8] = useState(false);

  const activeColoring0 = () => {
    if (Location.pathname === "/admin/dashboard") {
      return setDynamicColoring0(true);
    } else if (Location.pathname === "/center/dashboard") {
      return setDynamicColoring0(true);
    } else if (Location.pathname === "/sub-center/dashboard") {
      return setDynamicColoring0(true);
    } else if (Location.pathname === "/counsellor/dashboard") {
      return setDynamicColoring0(true);
    } else if (Location.pathname === "/sub-counsellor/dashboard") {
      return setDynamicColoring0(true);
    } else if (Location.pathname === "/accountant/dashboard") {
      return setDynamicColoring0(true);
    } else if (Location.pathname === "/operational/dashboard") {
      return setDynamicColoring0(true);
    } else if (Location.pathname === "/university-manager/dashboard") {
      return setDynamicColoring0(true);
    } else {
      return setDynamicColoring0(false);
    }
  };

  // Academics
  const activeColoring1 = () => {
    if (
      Location.pathname === "/admin/universities" ||
      Location.pathname === "/admin/programs" ||
      Location.pathname === "/admin/departments" ||
      Location.pathname === "/admin/specialization" ||
      Location.pathname === "/admin/syllabus"
    ) {
      return setDynamicColoring(true);
    } else if (
      Location.pathname === "/operational/universities" ||
      Location.pathname === "/operational/programs" ||
      Location.pathname === "/operational/departments" ||
      Location.pathname === "/operational/specialization" ||
      Location.pathname === "/operational/syllabus"
    ) {
      return setDynamicColoring(true);
    } else if (
      Location.pathname === "/university-manager/programs" ||
      Location.pathname === "/university-manager/departments" ||
      Location.pathname === "/university-manager/specialization" ||
      Location.pathname === "/university-manager/syllabus"
    ) {
      return setDynamicColoring(true);
    } else {
      return setDynamicColoring(false);
    }
  };

  // Admissions
  const activeColoring2 = () => {
    if (
      Location.pathname === "/admin/re-register" ||
      Location.pathname === "/admin/applications" ||
      Location.pathname === "/admin/new-application"
    ) {
      return setDynamicColoring2(true);
    } else if (
      Location.pathname === "/center/re-register" ||
      Location.pathname === "/center/applications" ||
      Location.pathname === "/center/new-application"
    ) {
      return setDynamicColoring2(true);
    } else if (
      Location.pathname === "/sub-center/re-register" ||
      Location.pathname === "/sub-center/applications" ||
      Location.pathname === "/sub-center/new-application"
    ) {
      return setDynamicColoring2(true);
    } else if (
      Location.pathname === "/counsellor/re-register" ||
      Location.pathname === "/counsellor/applications" ||
      Location.pathname === "/counsellor/new-application"
    ) {
      return setDynamicColoring2(true);
    } else if (
      Location.pathname === "/sub-counsellor/re-register" ||
      Location.pathname === "/sub-counsellor/applications" ||
      Location.pathname === "/sub-counsellor/new-application"
    ) {
      return setDynamicColoring2(true);
    } else if (
      Location.pathname === "/operational/re-register" ||
      Location.pathname === "/operational/applications" ||
      Location.pathname === "/operational/new-application"
    ) {
      return setDynamicColoring2(true);
    } else if (
      Location.pathname === "/university-manager/re-register" ||
      Location.pathname === "/university-manager/applications" ||
      Location.pathname === "/university-manager/new-application"
    ) {
      return setDynamicColoring2(true);
    } else if (
      Location.pathname === "/accountant/re-register" ||
      Location.pathname === "/accountant/applications" ||
      Location.pathname === "/accountant/new-application"
    ) {
      return setDynamicColoring2(true);
    } else {
      return setDynamicColoring2(false);
    }
  };

  // Users
  const activeColoring3 = () => {
    if (
      Location.pathname === "/admin/university-manager" ||
      Location.pathname === "/admin/operations" ||
      Location.pathname === "/admin/counsellors" ||
      Location.pathname === "/admin/sub-counsellors" ||
      Location.pathname === "/admin/center-master" ||
      Location.pathname === "/admin/center" ||
      Location.pathname === "/admin/sub-center" ||
      Location.pathname === "/admin/student"
    ) {
      return setDynamicColoring3(true);
    } else if (
      Location.pathname === "/operational/university-manager" ||
      Location.pathname === "/operational/operations" ||
      Location.pathname === "/operational/counsellors" ||
      Location.pathname === "/operational/sub-counsellors" ||
      Location.pathname === "/operational/center-master" ||
      Location.pathname === "/operational/center" ||
      Location.pathname === "/operational/sub-center" ||
      Location.pathname === "/operational/student"
    ) {
      return setDynamicColoring3(true);
    } else if (
      Location.pathname === "/university-manager/counsellors" ||
      Location.pathname === "/university-manager/sub-counsellors" ||
      Location.pathname === "/university-manager/center" ||
      Location.pathname === "/university-manager/sub-center"
    ) {
      return setDynamicColoring3(true);
    } else if (
      Location.pathname === "/center/counsellors" ||
      Location.pathname === "/center/sub-counsellors" ||
      Location.pathname === "/center/sub-center"
    ) {
      return setDynamicColoring3(true);
    } else if (Location.pathname === "/counsellor/sub-center") {
      return setDynamicColoring3(true);
    } else {
      return setDynamicColoring3(false);
    }
  };

  // Admin Settings
  const activeColoring4 = () => {
    if (Location.pathname === "/admin/settings") {
      return setDynamicColoring4(true);
    } else {
      return setDynamicColoring4(false);
    }
  };

  // Accounting
  const activeColoring5 = () => {
    if (
      Location.pathname === "/admin/center-ledger" ||
      Location.pathname === "/admin/offline-payment" ||
      Location.pathname === "/admin/online-payment" ||
      Location.pathname === "/admin/student-ledger"
    ) {
      return setDynamicColoring5(true);
    } else if (
      Location.pathname === "/center/center-ledger" ||
      Location.pathname === "/center/offline-payment" ||
      Location.pathname === "/center/online-payment" ||
      Location.pathname === "/center/student-ledger"
    ) {
      return setDynamicColoring5(true);
    } else if (
      Location.pathname === "/accountant/center-ledger" ||
      Location.pathname === "/accountant/offline-payment" ||
      Location.pathname === "/accountant/online-payment" ||
      Location.pathname === "/accountant/student-ledger"
    ) {
      return setDynamicColoring5(true);
    } else if (
      Location.pathname === "/operational/center-ledger" ||
      Location.pathname === "/operational/offline-payment" ||
      Location.pathname === "/operational/online-payment" ||
      Location.pathname === "/operational/student-ledger"
    ) {
      return setDynamicColoring5(true);
    } else {
      return setDynamicColoring5(false);
    }
  };

  // Profile Change Password
  const activeColoring6 = () => {
    if (
      Location.pathname === "/admin/profile" ||
      Location.pathname === "/admin/change-password"
    ) {
      setNavMyProfileToggle(false);
      return setDynamicColoring6(true);
    } else if (
      Location.pathname === "/center/profile" ||
      Location.pathname === "/center/change-password"
    ) {
      setNavMyProfileToggle(false);
      return setDynamicColoring6(true);
    } else if (
      Location.pathname === "/sub-center/profile" ||
      Location.pathname === "/sub-center/change-password"
    ) {
      setNavMyProfileToggle(false);
      return setDynamicColoring6(true);
    } else if (
      Location.pathname === "/counsellor/profile" ||
      Location.pathname === "/counsellor/change-password"
    ) {
      setNavMyProfileToggle(false);
      return setDynamicColoring6(true);
    } else if (
      Location.pathname === "/sub-counsellor/profile" ||
      Location.pathname === "/sub-counsellor/change-password"
    ) {
      setNavMyProfileToggle(false);
      return setDynamicColoring6(true);
    } else if (
      Location.pathname === "/operational/profile" ||
      Location.pathname === "/operational/change-password"
    ) {
      setNavMyProfileToggle(false);
      return setDynamicColoring6(true);
    } else if (
      Location.pathname === "/university-manager/profile" ||
      Location.pathname === "/university-manager/change-password"
    ) {
      setNavMyProfileToggle(false);
      return setDynamicColoring6(true);
    } else if (
      Location.pathname === "/accountant/profile" ||
      Location.pathname === "/accountant/change-password"
    ) {
      setNavMyProfileToggle(false);
      return setDynamicColoring6(true);
    } else {
      return setDynamicColoring6(false);
    }
  };

  // Leads
  const activeColoring7 = () => {
    if (
      Location.pathname === "/admin/lead-generate" ||
      Location.pathname === "/admin/show-lead" ||
      Location.pathname === "/admin/prospectus-registration" ||
      Location.pathname === "/admin/universal-lead-generator"
    ) {
      setNavMyProfileToggle(false);
      return setDynamicColoring7(true);
    } else {
      return setDynamicColoring7(false);
    }
  };

  // Leads Student
  const activeColoring8 = () => {
    if (
      Location.pathname === "/admin/lead-application-form" ||
      Location.pathname === "/admin/show-application-forms"
    ) {
      setNavMyProfileToggle(false);
      return setDynamicColoring8(true);
    } else {
      return setDynamicColoring8(false);
    }
  };

  useEffect(() => {
    activeColoring0();
    activeColoring1();
    activeColoring2();
    activeColoring3();
    activeColoring4();
    activeColoring5();
    activeColoring6();
    activeColoring7();
    activeColoring8();
  }, [Location.pathname]);

  // redux state
  const ReduxUser = useSelector((state) => state.user);

  const [CenterLogged, setCenterLogged] = useState(false);
  const [SubCenterLogged, setSubCenterLogged] = useState(false);
  const [OPManagerLogged, setOPManagerLogged] = useState(false);
  const [CounsellorLogged, setCounsellorLogged] = useState(false);
  const [SubCounsellorLogged, setSubCounsellorLogged] = useState(false);
  const [UniversityManagerLogged, setUniversityManagerLogged] = useState(false);
  const [AccountantLogged, setAccountantLogged] = useState(false);

  useEffect(() => {
    if (ReduxUser?.role === "Admin") {
      setCenterLogged(false);
      setOPManagerLogged(false);
      setSubCenterLogged(false);
      setCounsellorLogged(false);
      setSubCounsellorLogged(false);
      setAccountantLogged(false);
      setUniversityManagerLogged(false);
    }
    if (ReduxUser?.role === "center") {
      setCenterLogged(true);
      setOPManagerLogged(false);
      setSubCenterLogged(false);
      setCounsellorLogged(false);
      setSubCounsellorLogged(false);
      setAccountantLogged(false);
      setUniversityManagerLogged(false);
    }
    if (ReduxUser?.role === "Accountant") {
      setCenterLogged(false);
      setOPManagerLogged(false);
      setSubCenterLogged(false);
      setCounsellorLogged(false);
      setSubCounsellorLogged(false);
      setAccountantLogged(true);
      setUniversityManagerLogged(false);
    }
    if (ReduxUser?.role === "operation-manager") {
      setCenterLogged(false);
      setOPManagerLogged(true);
      setSubCenterLogged(false);
      setCounsellorLogged(false);
      setSubCounsellorLogged(false);
      setAccountantLogged(false);
      setUniversityManagerLogged(false);
    }
    if (ReduxUser?.role === "Counsellor") {
      setCenterLogged(false);
      setOPManagerLogged(false);
      setSubCenterLogged(false);
      setCounsellorLogged(true);
      setSubCounsellorLogged(false);
      setAccountantLogged(false);
      setUniversityManagerLogged(false);
    }
    if (ReduxUser?.role === "subCounsellor") {
      setCenterLogged(false);
      setOPManagerLogged(false);
      setSubCenterLogged(false);
      setCounsellorLogged(false);
      setSubCounsellorLogged(true);
      setAccountantLogged(false);
      setUniversityManagerLogged(false);
    }
    if (ReduxUser?.role === "subCenter") {
      setCenterLogged(false);
      setOPManagerLogged(false);
      setSubCenterLogged(true);
      setCounsellorLogged(false);
      setSubCounsellorLogged(false);
      setAccountantLogged(false);
      setUniversityManagerLogged(false);
    }
    if (ReduxUser?.role === "university-manager") {
      setCenterLogged(false);
      setOPManagerLogged(false);
      setSubCenterLogged(false);
      setCounsellorLogged(false);
      setSubCounsellorLogged(false);
      setAccountantLogged(false);
      setUniversityManagerLogged(true);
    }
  }, [ReduxUser?.role]);

  const { id } = useParams();
  const UpdateStudentUrl = Location.pathname.slice(0, 22) + id;
  const UpdateStudentUrlcounsellor = Location.pathname.slice(0, 27) + id;
  const UpdateStudentUrlsubcounsellor = Location.pathname.slice(0, 30) + id;
  const UpdateStudentUrlCenter = Location.pathname.slice(0, 23) + id;
  const UpdateStudentUrlsubcenter = Location.pathname.slice(0, 26) + id;
  const UpdateStudentUrloperational = Location.pathname.slice(0, 28) + id;

  const blockedUniversities = [
    "SWAMI VIVEKANAND SUBHARTI UNIVERSITY",
    "ASIAN INTERNATIONAL UNIVERSITY",
  ];

  return (
    <>
      {CenterLogged ? (
        <>
          {Location.pathname === UpdateStudentUrlCenter ? null : (
            <div className="w-full max-h-full grid grid-cols-[400px,1fr] text-xs ">
              <div
                className="w-52 h-screen py-2 dark:text-white bg-slate-100 dark:bg-slate-900 border-t 
            dark:border-t-slate-900  border-t-slate-180 px-4 flex justify-between
         flex-col"
              >
                <div className="h-[calc(100vh-25vh)] overflow-y-scroll ScrollBarStyle ">
                  <ul className="space-y-2 pt-6 flex justify-center flex-col gap-2">
                    {/* Dashboard */}
                    <li>
                      <NavLink
                        to={"dashboard"}
                        onClick={NavAdminDasboardButtonToggle}
                        className={`
                    ${DynamicColoring0 ? "bg-green-400" : "bg-none"}
                    hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-2">
                          <MdOutlineDashboard size={18} />
                          Dashboard
                        </div>
                      </NavLink>
                    </li>

                    {!blockedUniversities.includes(
                      GetSelectedUniversity.name
                    ) ? (
                      <>
                        {/* Leads */}
                        <li>
                          <button
                            onClick={NavLeadButtonToggle}
                            className={`
                ${DynamicColoring7 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdLeaderboard size={18} />
                              Leads
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-generate"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Generate
                                </NavLink>

                                <NavLink
                                  to={"show-lead"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show
                                </NavLink>
                                <NavLink
                                  to={"prospectus-registration"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                    Show All Leads
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>

                        {/* Leads Student */}
                        <li>
                          <button
                            onClick={NavLeadStudentButtonToggle}
                            className={`
                ${DynamicColoring8 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <PiStudentFill size={18} />
                              Students
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadStudentToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadStudentToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-application-form"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>

                                <NavLink
                                  to={"show-application-forms"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show Students
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>
                      </>
                    ) : (
                      <>
                        {/* Admission */}
                        <li>
                          <button
                            onClick={NavAdmissionButtonToggle}
                            className={`  ${
                              DynamicColoring2 ? "bg-green-400" : "bg-none"
                            } hover:bg-green-400 px-6 text-xs py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdAddTask size={18} />
                              Admissions
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavAdmissionToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavAdmissionToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex flex-col gap-1`}
                              >
                                <NavLink
                                  to={"applications"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Applications
                                </NavLink>
                                <NavLink
                                  to={"new-application"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>
                                <NavLink
                                  to={"re-register"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Re-Register
                                </NavLink>
                              </li>
                            </ul>
                          )}
                          <div></div>
                        </li>
                      </>
                    )}

                    {/* Accounts */}
                    <li>
                      <button
                        onClick={NavAccountsButtonToggle}
                        className={`  ${
                          DynamicColoring5 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <MdOutlineAccountBalance size={18} />
                          Accounts
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavAccountsToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavAccountsToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex flex-col gap-1`}
                          >
                            <NavLink
                              to={"center-ledger"}
                              className={
                                " dark:hover:bg-slate-600hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Center Ledgers
                            </NavLink>
                            <NavLink
                              to={"offline-payment"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Offline Payment
                            </NavLink>
                            <NavLink
                              to={"online-payment"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Online Payment
                            </NavLink>
                            <NavLink
                              to={"student-ledger"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Student Ledger
                            </NavLink>
                          </li>
                        </ul>
                      )}
                      <div></div>
                    </li>

                    {/* Users */}
                    <li>
                      <button
                        onClick={NavUsersButtonToggle}
                        className={`  ${
                          DynamicColoring3 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <HiUsers size={18} />
                          Users
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavUsersToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavUsersToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                          >
                            <NavLink
                              to={"sub-center"}
                              className={
                                " dark:hover:bg-slate-600  AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Sub-Center
                            </NavLink>
                          </li>
                        </ul>
                      )}
                      {LoggedUserData?.userType === "Inhouse" ||
                        (LoggedUserData?.userType === "Both" && (
                          <>
                            {NavUsersToggle && (
                              <ul>
                                <li
                                  className={` ${
                                    NavUsersToggle
                                      ? "animate-slideDown"
                                      : "animate-slideup"
                                  } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                                >
                                  <NavLink
                                    to={"counsellors"}
                                    className={
                                      " dark:hover:bg-slate-600  AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                    }
                                  >
                                    <RiArrowDropRightFill size={18} />
                                    Counsellor
                                  </NavLink>
                                </li>
                              </ul>
                            )}
                            {NavUsersToggle && (
                              <ul>
                                <li
                                  className={` ${
                                    NavUsersToggle
                                      ? "animate-slideDown"
                                      : "animate-slideup"
                                  } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                                >
                                  <NavLink
                                    to={"sub-counsellors"}
                                    className={
                                      " dark:hover:bg-slate-600  AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                    }
                                  >
                                    <RiArrowDropRightFill size={18} />
                                    Sub Counsellor
                                  </NavLink>
                                </li>
                              </ul>
                            )}
                          </>
                        ))}
                      <div></div>
                    </li>
                  </ul>
                </div>

                {/* Profile */}
                <div className="mb-28">
                  {NavMyProfileToggle && (
                    <div
                      className={`flex flex-col gap-y-2 dark:bg-slate-700 bg-gray-200 py-2 px-3 rounded-lg`}
                    >
                      {/* User Info */}
                      <div className="text-left flex justify-center gap-x-1 font-semibold text-xs">
                        <div className="truncate">{LoggedUser?.name}</div>
                        <div className=" flex">
                          ({LoggedUser?.role}){" "}
                          <span className="text-green-400 relative -top-1 -left-0.5 ">
                            <GoDotFill size={14} />
                          </span>{" "}
                        </div>
                      </div>

                      {/* Profile Link */}
                      <NavLink to={"profile"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password Link */}
                      <NavLink to={"change-password"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>
                    </div>
                  )}
                  <ul className=" flex justify-center flex-col  ">
                    <button onClick={NavMyProfileButtonToggle}>
                      <li
                        className={` hover:bg-green-400 cursor-pointer px-6 py-2  
                w-full flex justify-between items-center border-2 border-slate-180 shadow-2xl 
            rounded-xl ${DynamicColoring6 ? "bg-green-400" : "bg-none"}`}
                      >
                        <div className="flex justify-center items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-red-300 rounded-full  font-semibold">
                            <img src={LoggedUser?.photo} alt="not found" />
                          </div>
                          <div> {LoggedUser?.name}</div>
                        </div>
                      </li>
                    </button>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      ) : SubCenterLogged ? (
        <>
          {Location.pathname === UpdateStudentUrlsubcenter ? null : (
            <div className="w-full max-h-full grid grid-cols-[400px,1fr] text-xs ">
              <div
                className="w-52 h-screen py-2 dark:text-white bg-slate-100 dark:bg-slate-900 border-t 
            dark:border-t-slate-900  border-t-slate-180 px-4 flex justify-between
         flex-col"
              >
                <div className="h-[calc(100vh-25vh)] overflow-y-scroll ScrollBarStyle ">
                  <ul className="space-y-2 pt-6 flex justify-center flex-col gap-2">
                    {/* Dashboard */}
                    <li>
                      <NavLink
                        to={"dashboard"}
                        onClick={NavAdminDasboardButtonToggle}
                        className={`
                    ${DynamicColoring0 ? "bg-green-400" : "bg-none"}
                    hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-2">
                          <MdOutlineDashboard size={18} />
                          Dashboard
                        </div>
                      </NavLink>
                    </li>

                    {!blockedUniversities.includes(
                      GetSelectedUniversity.name
                    ) ? (
                      <>
                        {/* Leads */}
                        <li>
                          <button
                            onClick={NavLeadButtonToggle}
                            className={`
                ${DynamicColoring7 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdLeaderboard size={18} />
                              Leads
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-generate"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Generate
                                </NavLink>

                                <NavLink
                                  to={"show-lead"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show
                                </NavLink>
                                <NavLink
                                  to={"prospectus-registration"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                    Show All Leads
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>

                        {/* Leads Student */}
                        <li>
                          <button
                            onClick={NavLeadStudentButtonToggle}
                            className={`
                ${DynamicColoring8 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <PiStudentFill size={18} />
                              Students
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadStudentToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadStudentToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-application-form"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>

                                <NavLink
                                  to={"show-application-forms"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show Students
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>
                      </>
                    ) : (
                      <>
                        {/* Admission */}
                        <li>
                          <button
                            onClick={NavAdmissionButtonToggle}
                            className={`  ${
                              DynamicColoring2 ? "bg-green-400" : "bg-none"
                            } hover:bg-green-400 px-6 text-xs py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdAddTask size={18} />
                              Admissions
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavAdmissionToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavAdmissionToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex flex-col gap-1`}
                              >
                                <NavLink
                                  to={"applications"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Applications
                                </NavLink>
                                <NavLink
                                  to={"new-application"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>
                                <NavLink
                                  to={"re-register"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Re-Register
                                </NavLink>
                              </li>
                            </ul>
                          )}
                          <div></div>
                        </li>
                      </>
                    )}

                    {/* Accounts */}
                    <li>
                      <button
                        onClick={NavAccountsButtonToggle}
                        className={`  ${
                          DynamicColoring5 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <MdOutlineAccountBalance size={18} />
                          Accounts
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavAccountsToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavAccountsToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex flex-col gap-1`}
                          >
                            <NavLink
                              to={"center-ledger"}
                              className={
                                " dark:hover:bg-slate-600hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Center Ledgers
                            </NavLink>
                            <NavLink
                              to={"offline-payment"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Offline Payment
                            </NavLink>
                            <NavLink
                              to={"student-ledger"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Student Ledger
                            </NavLink>
                          </li>
                        </ul>
                      )}
                      <div></div>
                    </li>
                  </ul>
                </div>

                {/* Profile */}
                <div className="mb-28">
                  {NavMyProfileToggle && (
                    <div
                      className={`flex flex-col gap-y-2 dark:bg-slate-700 bg-gray-200 py-2 px-3 rounded-lg`}
                    >
                      {/* User Info */}
                      <div className="text-left flex justify-center gap-x-1 font-semibold text-xs">
                        <div className="truncate">{LoggedUser?.name}</div>
                        <div className=" flex">
                          ({LoggedUser?.role}){" "}
                          <span className="text-green-400 relative -top-1 -left-0.5 ">
                            <GoDotFill size={14} />
                          </span>{" "}
                        </div>
                      </div>

                      {/* Profile Link */}
                      <NavLink to={"profile"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password Link */}
                      <NavLink to={"change-password"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>
                    </div>
                  )}
                  <ul className=" flex justify-center flex-col  ">
                    <button onClick={NavMyProfileButtonToggle}>
                      <li
                        className={` hover:bg-green-400 cursor-pointer px-6 py-2  
                w-full flex justify-between items-center border-2 border-slate-180 shadow-2xl 
            rounded-xl ${DynamicColoring6 ? "bg-green-400" : "bg-none"}`}
                      >
                        <div className="flex justify-center items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-red-300 rounded-full  font-semibold">
                            <img src={LoggedUser?.photo} alt="not found" />
                          </div>
                          <div> {LoggedUser?.name}</div>
                        </div>
                      </li>
                    </button>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      ) : OPManagerLogged ? (
        <>
          {Location.pathname === UpdateStudentUrloperational ? null : (
            <div className="w-full max-h-full grid grid-cols-[400px,1fr] text-base ">
              <div
                className="w-52 h-screen py-2 dark:text-white bg-slate-100 dark:bg-slate-900 border-t dark:border-t-slate-900 border-t-slate-180 px-4 flex justify-between
         flex-col"
              >
                <div className="h-[calc(100vh-25vh)] overflow-y-scroll ScrollBarStyle ">
                  <ul className="space-y-2 pt-6 flex justify-center flex-col gap-2">
                    {/* Dashboard */}
                    <li>
                      <NavLink
                        to={"dashboard"}
                        onClick={NavAdminDasboardButtonToggle}
                        className={`
                    ${DynamicColoring0 ? "bg-green-400" : "bg-none"}
                    hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-2">
                          <MdOutlineDashboard size={18} />
                          Dashboard
                        </div>
                      </NavLink>
                    </li>

                    {/* Academic */}
                    <li>
                      <button
                        onClick={NavAcademicButtonToggle}
                        className={`
                ${DynamicColoring ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <SiMicrosoftacademic size={18} />
                          Academic
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavAcademicToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavAcademicToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                          >
                            <NavLink
                              to={"departments"}
                              className={
                                "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Faculty
                            </NavLink>
                            <NavLink
                              to={"programs"}
                              className={
                                "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Course
                            </NavLink>
                            <NavLink
                              to={"specialization"}
                              className={
                                "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Stream
                            </NavLink>
                          </li>
                        </ul>
                      )}
                    </li>

                    {GetSelectedUniversity.name ===
                      "SWAMI VIVEKANAND SUBHARTI UNIVERSITY" ||
                    GetSelectedUniversity.name ===
                      "AISAN INTERNATIONAL UNIVERSITY" ? (
                      <>
                        {/* Leads */}
                        <li>
                          <button
                            onClick={NavLeadButtonToggle}
                            className={`
                ${DynamicColoring7 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdLeaderboard size={18} />
                              Leads
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-generate"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Generate
                                </NavLink>

                                <NavLink
                                  to={"show-lead"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show
                                </NavLink>
                                <NavLink
                                  to={"prospectus-registration"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                    Show All Leads
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>

                        {/* Leads Student */}
                        <li>
                          <button
                            onClick={NavLeadStudentButtonToggle}
                            className={`
                ${DynamicColoring8 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <PiStudentFill size={18} />
                              Students
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadStudentToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadStudentToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-application-form"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>

                                <NavLink
                                  to={"show-application-forms"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show Students
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>
                      </>
                    ) : (
                      <>
                        {/* Admission */}
                        <li>
                          <button
                            onClick={NavAdmissionButtonToggle}
                            className={`  ${
                              DynamicColoring2 ? "bg-green-400" : "bg-none"
                            } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdAddTask size={18} />
                              Admissions
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavAdmissionToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavAdmissionToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex flex-col gap-1`}
                              >
                                <NavLink
                                  to={"applications"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Applications
                                </NavLink>
                                <NavLink
                                  to={"new-application"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>
                              </li>
                            </ul>
                          )}
                          <div></div>
                        </li>
                      </>
                    )}

                    {/* Accounts */}
                    <li>
                      <button
                        onClick={NavAccountsButtonToggle}
                        className={`  ${
                          DynamicColoring5 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <MdOutlineAccountBalance size={18} />
                          Accounts
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavAccountsToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavAccountsToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex flex-col gap-1`}
                          >
                            <NavLink
                              to={"center-ledger"}
                              className={
                                " dark:hover:bg-slate-600hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Center Ledgers
                            </NavLink>
                            <NavLink
                              to={"offline-payment"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Offline Payment
                            </NavLink>
                            <NavLink
                              to={"online-payment"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Online Payment
                            </NavLink>
                            <NavLink
                              to={"student-ledger"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Student Ledger
                            </NavLink>
                          </li>
                        </ul>
                      )}
                      <div></div>
                    </li>

                    {/* Users */}
                    <li>
                      <button
                        onClick={NavUsersButtonToggle}
                        className={`  ${
                          DynamicColoring3 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <HiUsers size={18} />
                          Users
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavUsersToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavUsersToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                          >
                            <NavLink
                              to={"counsellors"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Counsellors
                            </NavLink>
                            <NavLink
                              to={"sub-counsellors"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Sub-Counsellors
                            </NavLink>
                            <NavLink
                              to={"center-master"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Center Master
                            </NavLink>
                            <NavLink
                              to={"center"}
                              className={
                                "  dark:hover:bg-slate-600 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Center
                            </NavLink>
                            <NavLink
                              to={"create-accountant"}
                              className={
                                " dark:hover:bg-slate-600  AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Account
                            </NavLink>
                          </li>
                        </ul>
                      )}
                      <div></div>
                    </li>

                    {/* SETTING */}
                    <li className="text-xs">
                      <NavLink
                        to={"settings"}
                        onClick={NavSettingsButtonToggle}
                        className={`  ${
                          DynamicColoring4 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <IoSettingsSharp size={18} />
                          Setting
                        </div>
                      </NavLink>
                      <div></div>
                    </li>
                  </ul>
                </div>

                {/* Profile */}
                <div className="mb-28">
                  {NavMyProfileToggle && (
                    <div
                      className={`flex flex-col gap-y-2 dark:bg-slate-700 bg-gray-200 py-2 px-3 rounded-lg`}
                    >
                      {/* User Info */}
                      <div className="text-left flex justify-center gap-x-1 font-semibold text-xs">
                        <div className="truncate">{LoggedUser?.name}</div>
                        <div className=" flex">
                          ({LoggedUser?.role}){" "}
                          <span className="text-green-400 relative -top-1 -left-0.5 ">
                            <GoDotFill size={14} />
                          </span>{" "}
                        </div>
                      </div>

                      {/* Profile Link */}
                      <NavLink to={"profile"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password Link */}
                      <NavLink to={"change-password"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>
                    </div>
                  )}
                  <ul className=" flex justify-center flex-col  ">
                    <button onClick={NavMyProfileButtonToggle}>
                      <li
                        className={` hover:bg-green-400 cursor-pointer px-6 py-2  
                w-full flex justify-between items-center border-2 border-slate-180 shadow-2xl 
            rounded-xl ${DynamicColoring6 ? "bg-green-400" : "bg-none"}`}
                      >
                        <div className="flex justify-center items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-red-300 rounded-full  font-semibold">
                            <img src={LoggedUser?.photo} alt="not found" />
                          </div>
                          <div> {LoggedUser?.name}</div>
                        </div>
                      </li>
                    </button>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      ) : AccountantLogged ? (
        <>
          <div className="w-full max-h-full grid grid-cols-[400px,1fr] text-base ">
            <div
              className="w-52 h-screen py-2 dark:text-white bg-slate-100 dark:bg-slate-900 border-t dark:border-t-slate-900 border-t-slate-180 px-4 flex justify-between
       flex-col"
            >
              <div className="h-[calc(100vh-25vh)] overflow-y-scroll ScrollBarStyle ">
                <ul className="space-y-2 pt-6 flex justify-center flex-col gap-2">
                  {/* Dashboard */}
                  <li>
                    <NavLink
                      to={"dashboard"}
                      onClick={NavAdminDasboardButtonToggle}
                      className={`
                  ${DynamicColoring0 ? "bg-green-400" : "bg-none"}
                  hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                    >
                      <div className="flex justify-center items-center gap-2">
                        <MdOutlineDashboard size={18} />
                        Dashboard
                      </div>
                    </NavLink>
                  </li>

                  {!blockedUniversities.includes(GetSelectedUniversity.name) ? (
                    <>
                      {/* Leads */}
                      <li>
                        <button
                          onClick={NavLeadButtonToggle}
                          className={`
                ${DynamicColoring7 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                        >
                          <div className="flex justify-center items-center gap-x-2 ">
                            <MdLeaderboard size={18} />
                            Leads
                          </div>
                          <RiArrowDropDownFill size={18} />
                        </button>
                        {NavLeadToggle && (
                          <ul>
                            <li
                              className={` ${
                                NavLeadToggle
                                  ? "animate-slideDown"
                                  : "animate-slideup"
                              } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                            >
                              <NavLink
                                to={"lead-generate"}
                                className={
                                  "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                Generate
                              </NavLink>

                              <NavLink
                                to={"show-lead"}
                                className={
                                  "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                Show
                              </NavLink>
                              <NavLink
                                to={"prospectus-registration"}
                                className={
                                  "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                  Show All Leads
                              </NavLink>
                            </li>
                          </ul>
                        )}
                      </li>

                      {/* Leads Student */}
                      <li>
                        <button
                          onClick={NavLeadStudentButtonToggle}
                          className={`
                ${DynamicColoring8 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                        >
                          <div className="flex justify-center items-center gap-x-2 ">
                            <PiStudentFill size={18} />
                            Students
                          </div>
                          <RiArrowDropDownFill size={18} />
                        </button>
                        {NavLeadStudentToggle && (
                          <ul>
                            <li
                              className={` ${
                                NavLeadStudentToggle
                                  ? "animate-slideDown"
                                  : "animate-slideup"
                              } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                            >
                              <NavLink
                                to={"lead-application-form"}
                                className={
                                  "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                Fresh Apply
                              </NavLink>

                              <NavLink
                                to={"show-application-forms"}
                                className={
                                  "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                Show Students
                              </NavLink>
                            </li>
                          </ul>
                        )}
                      </li>
                    </>
                  ) : (
                    <>
                      {/* Admission */}
                      <li>
                        <button
                          onClick={NavAdmissionButtonToggle}
                          className={`  ${
                            DynamicColoring2 ? "bg-green-400" : "bg-none"
                          } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                        >
                          <div className="flex justify-center items-center gap-x-2 ">
                            <MdAddTask size={18} />
                            Admissions
                          </div>
                          <RiArrowDropDownFill size={18} />
                        </button>
                        {NavAdmissionToggle && (
                          <ul>
                            <li
                              className={` ${
                                NavAdmissionToggle
                                  ? "animate-slideDown"
                                  : "animate-slideup"
                              } -ml-2 my-2 text-xs flex flex-col gap-1`}
                            >
                              <NavLink
                                to={"applications"}
                                className={
                                  "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                Applications
                              </NavLink>
                            </li>
                          </ul>
                        )}
                        <div></div>
                      </li>
                    </>
                  )}

                  {/* Accounts */}
                  <li>
                    <button
                      onClick={NavAccountsButtonToggle}
                      className={`  ${
                        DynamicColoring5 ? "bg-green-400" : "bg-none"
                      } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                    >
                      <div className="flex justify-center items-center gap-x-2 ">
                        <MdOutlineAccountBalance size={18} />
                        Accounts
                      </div>
                      <RiArrowDropDownFill size={18} />
                    </button>
                    {NavAccountsToggle && (
                      <ul>
                        <li
                          className={` ${
                            NavAccountsToggle
                              ? "animate-slideDown"
                              : "animate-slideup"
                          } -ml-2 my-2 text-xs flex flex-col gap-1`}
                        >
                          <NavLink
                            to={"center-ledger"}
                            className={
                              " dark:hover:bg-slate-600hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Center Ledgers
                          </NavLink>
                          <NavLink
                            to={"offline-payment"}
                            className={
                              " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Offline Payment
                          </NavLink>
                          <NavLink
                            to={"online-payment"}
                            className={
                              " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Online Payment
                          </NavLink>
                          <NavLink
                            to={"student-ledger"}
                            className={
                              " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Student Ledger
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              </div>

              {/* Profile */}
              <div className="mb-28">
                {NavMyProfileToggle && (
                  <div
                    className={`flex flex-col gap-y-2 dark:bg-slate-700 bg-gray-200 py-2 px-3 rounded-lg`}
                  >
                    {/* User Info */}
                    <div className="text-left flex justify-center gap-x-1 font-semibold text-xs">
                      <div className="truncate">{LoggedUser?.name}</div>
                      <div className=" flex">
                        ({LoggedUser?.role}){" "}
                        <span className="text-green-400 relative -top-1 -left-0.5 ">
                          <GoDotFill size={14} />
                        </span>{" "}
                      </div>
                    </div>

                    {/* Profile Link */}
                    <NavLink to={"profile"} className="text-xs">
                      <div
                        className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                      >
                        <FaUser /> Profile
                      </div>
                    </NavLink>

                    {/* Change Password Link */}
                    <NavLink to={"change-password"} className="text-xs">
                      <div
                        className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                      >
                        <RiLockPasswordFill /> Change Password
                      </div>
                    </NavLink>
                  </div>
                )}
                <ul className=" flex justify-center flex-col  ">
                  <button onClick={NavMyProfileButtonToggle}>
                    <li
                      className={` hover:bg-green-400 cursor-pointer px-6 py-2  
                w-full flex justify-between items-center border-2 border-slate-180 shadow-2xl 
            rounded-xl ${DynamicColoring6 ? "bg-green-400" : "bg-none"}`}
                    >
                      <div className="flex justify-center items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-red-300 rounded-full  font-semibold">
                          <img src={LoggedUser?.photo} alt="not found" />
                        </div>
                        <div> {LoggedUser?.name}</div>
                      </div>
                    </li>
                  </button>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : CounsellorLogged ? (
        <>
          {Location.pathname === UpdateStudentUrlcounsellor ? null : (
            <div className="w-full max-h-full grid grid-cols-[400px,1fr] text-base ">
              <div
                className="w-52 h-screen py-2 dark:text-white bg-slate-100 dark:bg-slate-900 border-t dark:border-t-slate-900 border-t-slate-180 px-4 flex justify-between
       flex-col"
              >
                <div className="h-[calc(100vh-25vh)] overflow-y-scroll ScrollBarStyle ">
                  <ul className="space-y-2 pt-6 flex justify-center flex-col gap-2">
                    {/* Dashboard */}
                    <li>
                      <NavLink
                        to={"dashboard"}
                        onClick={NavAdminDasboardButtonToggle}
                        className={`
                  ${DynamicColoring0 ? "bg-green-400" : "bg-none"}
                  hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-2">
                          <MdOutlineDashboard size={18} />
                          Dashboard
                        </div>
                      </NavLink>
                    </li>

                    {!blockedUniversities.includes(
                      GetSelectedUniversity.name
                    ) ? (
                      <>
                        {/* Leads */}
                        <li>
                          <button
                            onClick={NavLeadButtonToggle}
                            className={`
                ${DynamicColoring7 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdLeaderboard size={18} />
                              Leads
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-generate"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Generate
                                </NavLink>

                                <NavLink
                                  to={"show-lead"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show
                                </NavLink>
                                <NavLink
                                  to={"prospectus-registration"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                    Show All Leads
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>

                        {/* Leads Student */}
                        <li>
                          <button
                            onClick={NavLeadStudentButtonToggle}
                            className={`
                ${DynamicColoring8 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <PiStudentFill size={18} />
                              Students
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadStudentToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadStudentToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-application-form"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>

                                <NavLink
                                  to={"show-application-forms"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show Students
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>
                      </>
                    ) : (
                      <>
                        {/* Admission */}
                        <li>
                          <button
                            onClick={NavAdmissionButtonToggle}
                            className={`  ${
                              DynamicColoring2 ? "bg-green-400" : "bg-none"
                            } hover:bg-green-400 px-6 text-xs py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdAddTask size={18} />
                              Admissions
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavAdmissionToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavAdmissionToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex flex-col gap-1`}
                              >
                                <NavLink
                                  to={"applications"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Applications
                                </NavLink>
                                <NavLink
                                  to={"new-application"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>
                                <NavLink
                                  to={"re-register"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Re-Register
                                </NavLink>
                              </li>
                            </ul>
                          )}
                          <div></div>
                        </li>
                      </>
                    )}

                    {/* user */}
                    <li>
                      <button
                        onClick={NavUsersButtonToggle}
                        className={`  ${
                          DynamicColoring3 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <HiUsers size={18} />
                          Users
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavUsersToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavUsersToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                          >
                            <NavLink
                              to={"sub-counsellors"}
                              className={
                                " dark:hover:bg-slate-600  AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Sub-Counsellor
                            </NavLink>
                          </li>
                        </ul>
                      )}
                      <div></div>
                    </li>
                  </ul>
                </div>

                {/* Profile */}
                <div className="mb-28">
                  {NavMyProfileToggle && (
                    <div
                      className={`flex flex-col gap-y-2 dark:bg-slate-700 bg-gray-200 py-2 px-3 rounded-lg`}
                    >
                      {/* User Info */}
                      <div className="text-left flex justify-center gap-x-1 font-semibold text-xs">
                        <div className="truncate">{LoggedUser?.name}</div>
                        <div className=" flex">
                          ({LoggedUser?.role}){" "}
                          <span className="text-green-400 relative -top-1 -left-0.5 ">
                            <GoDotFill size={14} />
                          </span>{" "}
                        </div>
                      </div>

                      {/* Profile Link */}
                      <NavLink to={"profile"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password Link */}
                      <NavLink to={"change-password"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>
                    </div>
                  )}
                  <ul className=" flex justify-center flex-col  ">
                    <button onClick={NavMyProfileButtonToggle}>
                      <li
                        className={` hover:bg-green-400 cursor-pointer px-6 py-2  
                w-full flex justify-between items-center border-2 border-slate-180 shadow-2xl 
            rounded-xl ${DynamicColoring6 ? "bg-green-400" : "bg-none"}`}
                      >
                        <div className="flex justify-center items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-red-300 rounded-full  font-semibold">
                            <img src={LoggedUser?.photo} alt="not found" />
                          </div>
                          <div> {LoggedUser?.name}</div>
                        </div>
                      </li>
                    </button>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      ) : SubCounsellorLogged ? (
        <>
          {Location.pathname === UpdateStudentUrlsubcounsellor ? null : (
            <div className="w-full max-h-full grid grid-cols-[400px,1fr] text-base ">
              <div
                className="w-52 h-screen py-2 dark:text-white bg-slate-100 dark:bg-slate-900 border-t dark:border-t-slate-900 border-t-slate-180 px-4 flex justify-between
       flex-col"
              >
                <div className="h-[calc(100vh-25vh)] overflow-y-scroll ScrollBarStyle ">
                  <ul className="space-y-2 pt-6 flex justify-center flex-col gap-2">
                    {/* Dashboard */}
                    <li>
                      <NavLink
                        to={"dashboard"}
                        onClick={NavAdminDasboardButtonToggle}
                        className={`
                  ${DynamicColoring0 ? "bg-green-400" : "bg-none"}
                  hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-2">
                          <MdOutlineDashboard size={18} />
                          Dashboard
                        </div>
                      </NavLink>
                    </li>

                    {!blockedUniversities.includes(
                      GetSelectedUniversity.name
                    ) ? (
                      <>
                        {/* Leads */}
                        <li>
                          <button
                            onClick={NavLeadButtonToggle}
                            className={`
                ${DynamicColoring7 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdLeaderboard size={18} />
                              Leads
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-generate"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Generate
                                </NavLink>

                                <NavLink
                                  to={"show-lead"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show
                                </NavLink>
                                <NavLink
                                  to={"prospectus-registration"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                    Show All Leads
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>

                        {/* Leads Student */}
                        <li>
                          <button
                            onClick={NavLeadStudentButtonToggle}
                            className={`
                ${DynamicColoring8 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <PiStudentFill size={18} />
                              Students
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadStudentToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadStudentToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-application-form"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>

                                <NavLink
                                  to={"show-application-forms"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show Students
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>
                      </>
                    ) : (
                      <>
                        {/* Admission */}
                        <li>
                          <button
                            onClick={NavAdmissionButtonToggle}
                            className={`  ${
                              DynamicColoring2 ? "bg-green-400" : "bg-none"
                            } hover:bg-green-400 px-6 text-xs py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdAddTask size={18} />
                              Admissions
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavAdmissionToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavAdmissionToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex flex-col gap-1`}
                              >
                                <NavLink
                                  to={"applications"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Applications
                                </NavLink>
                                <NavLink
                                  to={"new-application"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>
                                <NavLink
                                  to={"re-register"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Re-Register
                                </NavLink>
                              </li>
                            </ul>
                          )}
                          <div></div>
                        </li>
                      </>
                    )}

                    {/* Admission */}
                  </ul>
                </div>

                {/* Profile */}
                <div className="mb-28">
                  {NavMyProfileToggle && (
                    <div
                      className={`flex flex-col gap-y-2 dark:bg-slate-700 bg-gray-200 py-2 px-3 rounded-lg`}
                    >
                      {/* User Info */}
                      <div className="text-left flex justify-center gap-x-1 font-semibold text-xs">
                        <div className="truncate">{LoggedUser?.name}</div>
                        <div className=" flex">
                          ({LoggedUser?.role}){" "}
                          <span className="text-green-400 relative -top-1 -left-0.5 ">
                            <GoDotFill size={14} />
                          </span>{" "}
                        </div>
                      </div>

                      {/* Profile Link */}
                      <NavLink to={"profile"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password Link */}
                      <NavLink to={"change-password"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>
                    </div>
                  )}
                  <ul className=" flex justify-center flex-col  ">
                    <button onClick={NavMyProfileButtonToggle}>
                      <li
                        className={` hover:bg-green-400 cursor-pointer px-6 py-2  
                w-full flex justify-between items-center border-2 border-slate-180 shadow-2xl 
            rounded-xl ${DynamicColoring6 ? "bg-green-400" : "bg-none"}`}
                      >
                        <div className="flex justify-center items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-red-300 rounded-full  font-semibold">
                            <img src={LoggedUser?.photo} alt="not found" />
                          </div>
                          <div> {LoggedUser?.name}</div>
                        </div>
                      </li>
                    </button>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      ) : UniversityManagerLogged ? (
        <>
          <div className="w-full max-h-full grid grid-cols-[400px,1fr] text-base ">
            <div
              className="w-52 h-screen py-2 dark:text-white bg-slate-100 dark:bg-slate-900 border-t dark:border-t-slate-900 border-t-slate-180 px-4 flex justify-between
       flex-col"
            >
              <div className="h-[calc(100vh-25vh)] overflow-y-scroll ScrollBarStyle ">
                <ul className="space-y-2 pt-6 flex justify-center flex-col gap-2">
                  {/* Dashboard */}
                  <li>
                    <NavLink
                      to={"dashboard"}
                      onClick={NavAdminDasboardButtonToggle}
                      className={`
                  ${DynamicColoring0 ? "bg-green-400" : "bg-none"}
                  hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                    >
                      <div className="flex justify-center items-center gap-2">
                        <MdOutlineDashboard size={18} />
                        Dashboard
                      </div>
                    </NavLink>
                  </li>

                  {!blockedUniversities.includes(GetSelectedUniversity.name) ? (
                    <>
                      {/* Leads */}
                      <li>
                        <button
                          onClick={NavLeadButtonToggle}
                          className={`
                ${DynamicColoring7 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                        >
                          <div className="flex justify-center items-center gap-x-2 ">
                            <MdLeaderboard size={18} />
                            Leads
                          </div>
                          <RiArrowDropDownFill size={18} />
                        </button>
                        {NavLeadToggle && (
                          <ul>
                            <li
                              className={` ${
                                NavLeadToggle
                                  ? "animate-slideDown"
                                  : "animate-slideup"
                              } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                            >
                              <NavLink
                                to={"lead-generate"}
                                className={
                                  "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                Generate
                              </NavLink>

                              <NavLink
                                to={"show-lead"}
                                className={
                                  "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                Show
                              </NavLink>
                              <NavLink
                                to={"prospectus-registration"}
                                className={
                                  "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                  Show All Leads
                              </NavLink>
                            </li>
                          </ul>
                        )}
                      </li>

                      {/* Leads Student */}
                      <li>
                        <button
                          onClick={NavLeadStudentButtonToggle}
                          className={`
                ${DynamicColoring8 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                        >
                          <div className="flex justify-center items-center gap-x-2 ">
                            <PiStudentFill size={18} />
                            Students
                          </div>
                          <RiArrowDropDownFill size={18} />
                        </button>
                        {NavLeadStudentToggle && (
                          <ul>
                            <li
                              className={` ${
                                NavLeadStudentToggle
                                  ? "animate-slideDown"
                                  : "animate-slideup"
                              } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                            >
                              <NavLink
                                to={"lead-application-form"}
                                className={
                                  "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                Fresh Apply
                              </NavLink>

                              <NavLink
                                to={"show-application-forms"}
                                className={
                                  "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                }
                              >
                                <RiArrowDropRightFill size={18} />
                                Show Students
                              </NavLink>
                            </li>
                          </ul>
                        )}
                      </li>
                    </>
                  ) : (
                    <li>
                      <button
                        onClick={NavAdmissionButtonToggle}
                        className={`  ${
                          DynamicColoring2 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <MdAddTask size={18} />
                          Admissions
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavAdmissionToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavAdmissionToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex flex-col gap-1`}
                          >
                            <NavLink
                              to={"applications"}
                              className={
                                "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Applications
                            </NavLink>
                          </li>
                          <li
                            className={` ${
                              NavAdmissionToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex flex-col gap-1`}
                          >
                            <NavLink
                              to={"new-application"}
                              className={
                                "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Fresh Apply
                            </NavLink>
                          </li>
                        </ul>
                      )}
                      <div></div>
                    </li>
                  )}

                  {/* Accounts */}
                  <li>
                    <button
                      onClick={NavAccountsButtonToggle}
                      className={`  ${
                        DynamicColoring5 ? "bg-green-400" : "bg-none"
                      } hover:bg-green-400 px-6 text-xs py-2  w-full flex justify-between items-center rounded-lg`}
                    >
                      <div className="flex justify-center items-center gap-x-2 ">
                        <MdOutlineAccountBalance size={18} />
                        Accounts
                      </div>
                      <RiArrowDropDownFill size={18} />
                    </button>
                    {NavAccountsToggle && (
                      <ul>
                        <li
                          className={` ${
                            NavAccountsToggle
                              ? "animate-slideDown"
                              : "animate-slideup"
                          } -ml-2 my-2 text-xs flex flex-col gap-1`}
                        >
                          <NavLink
                            to={"student-ledger"}
                            className={
                              " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Student Ledger
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>

                  {/* Academic */}
                  <li>
                    <button
                      onClick={NavAcademicButtonToggle}
                      className={`
                ${DynamicColoring ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                    >
                      <div className="flex justify-center items-center gap-x-2 ">
                        <SiMicrosoftacademic size={18} />
                        Academic
                      </div>
                      <RiArrowDropDownFill size={18} />
                    </button>
                    {NavAcademicToggle && (
                      <ul>
                        <li
                          className={` ${
                            NavAcademicToggle
                              ? "animate-slideDown"
                              : "animate-slideup"
                          } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                        >
                          <NavLink
                            to={"departments"}
                            className={
                              "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Departments
                          </NavLink>
                          <NavLink
                            to={"programs"}
                            className={
                              "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Programs
                          </NavLink>
                          <NavLink
                            to={"specialization"}
                            className={
                              "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Specialization
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>

                  {/* Users */}
                  <li>
                    <button
                      onClick={NavUsersButtonToggle}
                      className={`  ${
                        DynamicColoring3 ? "bg-green-400" : "bg-none"
                      } hover:bg-green-400 px-6 text-xs py-2 w-full flex justify-between items-center rounded-lg`}
                    >
                      <div className="flex justify-center items-center gap-x-2 ">
                        <HiUsers size={18} />
                        Users
                      </div>
                      <RiArrowDropDownFill size={18} />
                    </button>
                    {NavUsersToggle && (
                      <ul>
                        <li
                          className={` ${
                            NavUsersToggle
                              ? "animate-slideDown"
                              : "animate-slideup"
                          } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                        >
                          <NavLink
                            to={"counsellors"}
                            className={
                              " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Counsellors
                          </NavLink>
                          <NavLink
                            to={"sub-counsellors"}
                            className={
                              " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Sub-Counsellors
                          </NavLink>
                          <NavLink
                            to={"center"}
                            className={
                              "  dark:hover:bg-slate-600 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Center
                          </NavLink>
                          <NavLink
                            to={"sub-center"}
                            className={
                              " dark:hover:bg-slate-600  AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                            }
                          >
                            <RiArrowDropRightFill size={18} />
                            Sub-Center
                          </NavLink>
                        </li>
                      </ul>
                    )}
                    <div></div>
                  </li>
                </ul>
              </div>

              {/* Profile */}
              <div className="mb-28">
                {NavMyProfileToggle && (
                  <div
                    className={`flex flex-col gap-y-2 dark:bg-slate-700 bg-gray-200 py-2 px-3 rounded-lg`}
                  >
                    {/* User Info */}
                    <div className="text-left flex justify-center gap-x-1 font-semibold text-xs">
                      <div className="truncate">{LoggedUser?.name}</div>
                      <div className=" flex">
                        ({LoggedUser?.role}){" "}
                        <span className="text-green-400 relative -top-1 -left-0.5 ">
                          <GoDotFill size={14} />
                        </span>{" "}
                      </div>
                    </div>

                    {/* Profile Link */}
                    <NavLink to={"profile"} className="text-xs">
                      <div
                        className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                      >
                        <FaUser /> Profile
                      </div>
                    </NavLink>

                    {/* Change Password Link */}
                    <NavLink to={"change-password"} className="text-xs">
                      <div
                        className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                      >
                        <RiLockPasswordFill /> Change Password
                      </div>
                    </NavLink>
                  </div>
                )}
                <ul className=" flex justify-center flex-col  ">
                  <button onClick={NavMyProfileButtonToggle}>
                    <li
                      className={` hover:bg-green-400 cursor-pointer px-6 py-2  
                w-full flex justify-between items-center border-2 border-slate-180 shadow-2xl 
            rounded-xl ${DynamicColoring6 ? "bg-green-400" : "bg-none"}`}
                    >
                      <div className="flex justify-center items-center gap-2 text-sm">
                        <div className="w-8 h-8 bg-red-300 rounded-full  font-semibold">
                          <img src={LoggedUser?.photo} alt="not found" />
                        </div>
                        <div> {LoggedUser?.name}</div>
                      </div>
                    </li>
                  </button>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        Location.pathname !== UpdateStudentUrl && (
          <>
            <div className="w-full max-h-full grid grid-cols-[400px, 1fr] text-base ">
              <div
                className="w-52 h-screen py-2 dark:text-white bg-slate-100 dark:bg-slate-900 border-t dark:border-t-slate-900 border-t-slate-180 px-4 flex justify-between
         flex-col"
              >
                <div className="h-[calc(100vh-25vh)] overflow-y-scroll ScrollBarStyle pb-5">
                  <ul className="space-y-2 pt-6 flex justify-center flex-col gap-2">
                    {/* Dashboard */}
                    <li>
                      <NavLink
                        to={"dashboard"}
                        onClick={NavAdminDasboardButtonToggle}
                        className={`
                    ${DynamicColoring0 ? "bg-green-400" : "bg-none"}
                    hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-2">
                          <MdOutlineDashboard size={18} />
                          Dashboard
                        </div>
                      </NavLink>
                    </li>

                    {/* Academic */}
                    <li>
                      <button
                        onClick={NavAcademicButtonToggle}
                        className={`
                ${DynamicColoring ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <SiMicrosoftacademic size={18} />
                          Academic
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavAcademicToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavAcademicToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                          >
                            <NavLink
                              to={"universities"}
                              className={
                                "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Universities
                            </NavLink>
                            <NavLink
                              to={"departments"}
                              className={
                                "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Faculty
                            </NavLink>
                            <NavLink
                              to={"programs"}
                              className={
                                "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Course
                            </NavLink>
                            <NavLink
                              to={"specialization"}
                              className={
                                "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Stream
                            </NavLink>
                            <NavLink
                              to={"syllabus"}
                              className={
                                "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Syllabus
                            </NavLink>
                          </li>
                        </ul>
                      )}
                    </li>

                    {!blockedUniversities.includes(
                      GetSelectedUniversity.name
                    ) ? (
                      <>
                        {/* Leads */}
                        <li>
                          <button
                            onClick={NavLeadButtonToggle}
                            className={`
                ${DynamicColoring7 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdLeaderboard size={18} />
                              Leads
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-generate"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Generate
                                </NavLink>

                                <NavLink
                                  to={"show-lead"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show
                                </NavLink>
                                <NavLink
                                  to={"prospectus-registration"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                    Show All Leads
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>

                        {/* Leads Student */}
                        <li>
                          <button
                            onClick={NavLeadStudentButtonToggle}
                            className={`
                ${DynamicColoring8 ? "bg-green-400" : "bg-none"}
                hover:bg-green-400 text-xs px-6 py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <PiStudentFill size={18} />
                              Students
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavLeadStudentToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavLeadStudentToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                              >
                                <NavLink
                                  to={"lead-application-form"}
                                  className={
                                    "dark:hover:bg-slate-600  hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>

                                <NavLink
                                  to={"show-application-forms"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Show Students
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </li>
                      </>
                    ) : (
                      <>
                        {/* Admission */}
                        <li>
                          <button
                            onClick={NavAdmissionButtonToggle}
                            className={`  ${
                              DynamicColoring2 ? "bg-green-400" : "bg-none"
                            } hover:bg-green-400 px-6 text-xs py-2 w-full flex justify-between items-center rounded-lg`}
                          >
                            <div className="flex justify-center items-center gap-x-2 ">
                              <MdAddTask size={18} />
                              Admissions
                            </div>
                            <RiArrowDropDownFill size={18} />
                          </button>
                          {NavAdmissionToggle && (
                            <ul>
                              <li
                                className={` ${
                                  NavAdmissionToggle
                                    ? "animate-slideDown"
                                    : "animate-slideup"
                                } -ml-2 my-2 text-xs flex flex-col gap-1`}
                              >
                                <NavLink
                                  to={"applications"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Applications
                                </NavLink>
                                <NavLink
                                  to={"new-application"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Fresh Apply
                                </NavLink>
                                <NavLink
                                  to={"re-register"}
                                  className={
                                    "dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                                  }
                                >
                                  <RiArrowDropRightFill size={18} />
                                  Re-Register
                                </NavLink>
                              </li>
                            </ul>
                          )}
                          <div></div>
                        </li>
                      </>
                    )}

                    {/* Accounts */}
                    <li>
                      <button
                        onClick={NavAccountsButtonToggle}
                        className={`  ${
                          DynamicColoring5 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <MdOutlineAccountBalance size={18} />
                          Accounts
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavAccountsToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavAccountsToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex flex-col gap-1`}
                          >
                            <NavLink
                              to={"center-ledger"}
                              className={
                                " dark:hover:bg-slate-600hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Center Ledgers
                            </NavLink>
                            <NavLink
                              to={"offline-payment"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Offline Payment
                            </NavLink>
                            <NavLink
                              to={"online-payment"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Online Payment
                            </NavLink>
                            <NavLink
                              to={"student-ledger"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Student Ledger
                            </NavLink>
                          </li>
                        </ul>
                      )}
                      <div></div>
                    </li>

                    {/* Users */}
                    <li>
                      <button
                        onClick={NavUsersButtonToggle}
                        className={`  ${
                          DynamicColoring3 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <HiUsers size={18} />
                          Users
                        </div>
                        <RiArrowDropDownFill size={18} />
                      </button>
                      {NavUsersToggle && (
                        <ul>
                          <li
                            className={` ${
                              NavUsersToggle
                                ? "animate-slideDown"
                                : "animate-slideup"
                            } -ml-2 my-2 text-xs flex gap-1 flex-col`}
                          >
                            <NavLink
                              to={"university-manager"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 text-[12.5px] AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              University Managers
                            </NavLink>
                            <NavLink
                              to={"operations"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Operations
                            </NavLink>
                            <NavLink
                              to={"counsellors"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Counsellors
                            </NavLink>
                            <NavLink
                              to={"sub-counsellors"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Sub-Counsellors
                            </NavLink>
                            <NavLink
                              to={"center-master"}
                              className={
                                " dark:hover:bg-slate-600 hover:bg-slate-300 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Center Master
                            </NavLink>
                            <NavLink
                              to={"center"}
                              className={
                                "  dark:hover:bg-slate-600 AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Center
                            </NavLink>
                            <NavLink
                              to={"sub-center"}
                              className={
                                " dark:hover:bg-slate-600  AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Sub-Center
                            </NavLink>
                            {/* <NavLink
                          to={"student"}
                          className={
                            " dark:hover:bg-slate-600  AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                          }
                        >
                          <RiArrowDropRightFill size={18} />
                          Students
                        </NavLink> */}
                            <NavLink
                              to={"create-accountant"}
                              className={
                                " dark:hover:bg-slate-600  AcademicHome px-6 py-2  w-full flex justify-start items-center rounded-lg"
                              }
                            >
                              <RiArrowDropRightFill size={18} />
                              Accountant
                            </NavLink>
                          </li>
                        </ul>
                      )}
                      <div></div>
                    </li>

                    {/* SETTING */}
                    <li className="text-xs">
                      <NavLink
                        to={"settings"}
                        onClick={NavSettingsButtonToggle}
                        className={`  ${
                          DynamicColoring4 ? "bg-green-400" : "bg-none"
                        } hover:bg-green-400 px-6 text-xs py-2 w-full flex justify-between items-center rounded-lg`}
                      >
                        <div className="flex justify-center items-center gap-x-2 ">
                          <IoSettingsSharp size={18} />
                          Setting
                        </div>
                      </NavLink>
                      <div></div>
                    </li>
                  </ul>
                </div>

                {/* Profile */}
                <div className="mb-28">
                  {NavMyProfileToggle && (
                    <div
                      className={`flex flex-col gap-y-2 dark:bg-slate-700 bg-gray-200 py-2 px-3 rounded-lg`}
                    >
                      {/* User Info */}
                      <div className="text-left flex justify-center gap-x-1 font-semibold text-xs">
                        <div className="truncate">{LoggedUser?.name}</div>
                        <div className=" flex">
                          ({LoggedUser?.role}){" "}
                          <span className="text-green-400 relative -top-1 -left-0.5 ">
                            <GoDotFill size={14} />
                          </span>{" "}
                        </div>
                      </div>

                      {/* Profile Link */}
                      <NavLink to={"profile"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password Link */}
                      <NavLink to={"change-password"} className="text-xs">
                        <div
                          className="bg-slate-180 dark:bg-slate-500 flex items-center gap-x-2 hover:bg-green-300 
                              cursor-pointer px-3 w-full py-2 rounded-lg"
                        >
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>
                    </div>
                  )}
                  <ul className=" flex justify-center flex-col  ">
                    <button onClick={NavMyProfileButtonToggle}>
                      <li
                        className={` hover:bg-green-400 cursor-pointer px-6 py-2  
                w-full flex justify-between items-center border-2 border-slate-180 shadow-2xl 
            rounded-xl ${DynamicColoring6 ? "bg-green-400" : "bg-none"}`}
                      >
                        <div className="flex justify-center items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-red-300 rounded-full  font-semibold">
                            <img src={LoggedUser?.photo} alt="not found" />
                          </div>
                          <div> {LoggedUser?.name}</div>
                        </div>
                      </li>
                    </button>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </>
  );
};

export default Sidebar;
