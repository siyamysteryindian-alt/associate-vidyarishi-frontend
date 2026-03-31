import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  RiArrowDropDownFill,
  RiLockPasswordFill,
  RiLogoutCircleRFill,
} from "react-icons/ri";
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
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { setUniversityDetails } from "../../Redux/UniversitySlice";
import useGetUniversity from "../../CustomHooks/UseGetUniversities";

const Sidebar = () => {
  const LoggedUser = useSelector((state) => state.user);
  const GetSelectedUniversity = useSelector((state) => state.university);

  const { GetUniversity, UniversityLoading, UniversityError, universities } =
    useGetUniversity();

  const dispatch = useDispatch();
  const NavigateTo = useNavigate();

  // Logout handler (same as your code)
  const HandleLogout = async () => {
    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        dispatch(
          setUniversityDetails({
            id: "",
            name: "",
            isAvailable: "",
            photo: "",
            vertical: "",
            creatorType: "",
            whoCreated: "",
          }),
        );
        NavigateTo("/");
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred. Please try again.",
      );
    }
  };

  const { GetLoginUserDetails, LoggedUserData } = UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
    GetUniversity();
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
      Location.pathname === "/admin/show-all-leads" ||
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

  console.log("UpdateStudentUrl", UpdateStudentUrl);

  // Better variable name than "id"
  const blockedUniversities = universities.filter(
    (uni) => uni.vertical?.trim(" ") === "Distance",
  );

  const isBlocked =
    !!GetSelectedUniversity &&
    blockedUniversities.some((uni) => uni.name === GetSelectedUniversity.name);

  console.log(!!GetSelectedUniversity);
  console.log(blockedUniversities);
  console.log(GetSelectedUniversity.name, "isBlocked =>", isBlocked);

  // const blockedUniversities = [
  //   "SWAMI VIVEKANAND SUBHARTI UNIVERSITY",
  //   "ASIAN INTERNATIONAL UNIVERSITY",
  // ];

  return (
    <div className="mt-1">
      {CenterLogged ? (
        <>
          {Location.pathname === UpdateStudentUrlCenter ? null : (
            <div className="flex flex-col h-[calc(100vh-250px)] text-xs">
              {/* Scrollable Menu Area */}
              <div
                className="flex-1 overflow-y-auto mt-4 ScrollBarStyle2 px-2"
                role="navigation"
                aria-label="Admin sidebar"
              >
                <ul className="space-y-2 pt-6 flex flex-col gap-2">
                  {/* Dashboard */}
                  <li>
                    <NavLink
                      to={"dashboard"}
                      onClick={NavAdminDasboardButtonToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring0 || isActive
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`
                      }
                      aria-current={DynamicColoring0 ? "page" : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineDashboard size={18} />
                        <span className="truncate">Dashboard</span>
                      </div>
                    </NavLink>
                  </li>

                  {!isBlocked ? (
                    <>
                      {/* Leads */}
                      <li>
                        <button
                          onClick={NavLeadButtonToggle}
                          aria-expanded={NavLeadToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring7
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Leads"
                        >
                          <div className="flex items-center gap-2">
                            <MdLeaderboard size={18} />
                            <span className="truncate">Leads</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <RiArrowDropDownFill
                              size={18}
                              className={`${
                                NavLeadToggle ? "rotate-180 transform" : ""
                              } transition-transform`}
                            />
                          </div>
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-generate"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Generate
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-lead"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-all-leads"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show All Leads
                            </NavLink>
                          </li>
                        </ul>
                      </li>

                      {/* Leads Student */}
                      <li>
                        <button
                          onClick={NavLeadStudentButtonToggle}
                          aria-expanded={NavLeadStudentToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring8
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Students"
                        >
                          <div className="flex items-center gap-2">
                            <PiStudentFill size={18} />
                            <span className="truncate">Students</span>
                          </div>

                          <div>
                            <RiArrowDropDownFill
                              size={18}
                              className={`${
                                NavLeadStudentToggle
                                  ? "rotate-180 transform"
                                  : ""
                              } transition-transform`}
                            />
                          </div>
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadStudentToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadStudentToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-application-form"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-application-forms"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show Students
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  ) : (
                    <>
                      {/* Admission (when blocked) */}
                      <li>
                        <button
                          onClick={NavAdmissionButtonToggle}
                          aria-expanded={NavAdmissionToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring2
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Admissions"
                        >
                          <div className="flex items-center gap-2">
                            <MdAddTask size={18} />
                            <span className="truncate">Admissions</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavAdmissionToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavAdmissionToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavAdmissionToggle}
                        >
                          <li>
                            <NavLink
                              to={"applications"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Applications
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"new-application"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"re-register"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Re-Register
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}

                  {/* Accounts */}
                  <li>
                    <button
                      onClick={NavAccountsButtonToggle}
                      aria-expanded={NavAccountsToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring5
                          ? "bg-green-400 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title="Accounts"
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineAccountBalance size={18} />
                        <span className="truncate">Accounts</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavAccountsToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavAccountsToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavAccountsToggle}
                    >
                      <li>
                        <NavLink
                          to={"center-ledger"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Center Ledgers
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"offline-payment"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Offline Payment
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"online-payment"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Online Payment
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"student-ledger"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Student Ledger
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  {/* Users */}
                  <li>
                    <button
                      onClick={NavUsersButtonToggle}
                      aria-expanded={NavUsersToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring3
                          ? "bg-green-400 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title="Users"
                    >
                      <div className="flex items-center gap-2">
                        <HiUsers size={18} />
                        <span className="truncate">Users</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavUsersToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavUsersToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavUsersToggle}
                    >
                      <li>
                        <NavLink
                          to={"sub-center"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Sub-Center
                        </NavLink>
                      </li>

                      {(LoggedUserData?.userType === "Inhouse" ||
                        LoggedUserData?.userType === "Both") && (
                        <>
                          <li>
                            <NavLink
                              to={"counsellors"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Counsellor
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"sub-counsellors"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Sub Counsellor
                            </NavLink>
                          </li>
                        </>
                      )}
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Fixed Bottom Profile Section */}
              <div className="relative px-4 py-3 dark:bg-slate-900 bg-white bottom-0 rounded-2xl mb-1.5">
                {/* Dropdown Menu */}
                {NavMyProfileToggle && (
                  <div className="absolute bottom-16 left-0 w-full px-4">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg shadow-lg p-2 animate-fade-in">
                      {/* User Info */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-slate-600">
                        <div className="text-xs font-semibold">
                          <span>{LoggedUser?.name}</span>
                          <span className="ml-1">({LoggedUser?.role})</span>
                        </div>
                        <GoDotFill size={12} className="text-green-400" />
                      </div>

                      {/* Profile */}
                      <NavLink to="profile">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password */}
                      <NavLink to="change-password">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>

                      {/* Logout */}
                      <button
                        onClick={HandleLogout}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-red-300 cursor-pointer text-red-700">
                          <RiLogoutCircleRFill /> Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile Button */}
                <button onClick={NavMyProfileButtonToggle} className="w-full">
                  <div
                    className={`cursor-pointer px-6 py-2 flex justify-between items-center rounded-xl border 
      ${
        DynamicColoring6
          ? "bg-green-500 text-white shadow-lg"
          : "hover:bg-green-100"
      }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-11 h-11 bg-red-300 rounded-2xl overflow-hidden flex justify-center items-center">
                        {LoggedUser?.photo ? (
                          <img
                            src={LoggedUser.photo}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <>
                            <span>{(LoggedUser?.name || "U").charAt(0)}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="truncate">{LoggedUser?.name}</span>
                        <span className="ml-1">({LoggedUser?.role})</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </>
      ) : SubCenterLogged ? (
        <>
          {Location.pathname === UpdateStudentUrlsubcenter ? null : (
            <div className="flex flex-col h-[calc(100vh-250px)] text-xs">
              {/* Scrollable Menu Area */}
              <div
                className="flex-1 overflow-y-auto mt-4 ScrollBarStyle2 px-2"
                role="navigation"
                aria-label="Admin sidebar"
              >
                <ul className="space-y-2 pt-6 flex flex-col gap-2">
                  {/* Dashboard */}
                  <li>
                    <NavLink
                      to={"dashboard"}
                      onClick={NavAdminDasboardButtonToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring0 || isActive
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`
                      }
                      aria-current={DynamicColoring0 ? "page" : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineDashboard size={18} />
                        <span className="truncate">Dashboard</span>
                      </div>
                    </NavLink>
                  </li>

                  {!isBlocked ? (
                    <>
                      {/* Leads */}
                      <li>
                        <button
                          onClick={NavLeadButtonToggle}
                          aria-expanded={NavLeadToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring7
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Leads"
                        >
                          <div className="flex items-center gap-2">
                            <MdLeaderboard size={18} />
                            <span className="truncate">Leads</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavLeadToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-generate"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Generate
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-lead"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-all-leads"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show All Leads
                            </NavLink>
                          </li>
                        </ul>
                      </li>

                      {/* Leads Student */}
                      <li>
                        <button
                          onClick={NavLeadStudentButtonToggle}
                          aria-expanded={NavLeadStudentToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring8
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Students"
                        >
                          <div className="flex items-center gap-2">
                            <PiStudentFill size={18} />
                            <span className="truncate">Students</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavLeadStudentToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadStudentToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadStudentToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-application-form"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-application-forms"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show Students
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  ) : (
                    <>
                      {/* Admission */}
                      <li>
                        <button
                          onClick={NavAdmissionButtonToggle}
                          aria-expanded={NavAdmissionToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring2
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Admissions"
                        >
                          <div className="flex items-center gap-2">
                            <MdAddTask size={18} />
                            <span className="truncate">Admissions</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavAdmissionToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavAdmissionToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavAdmissionToggle}
                        >
                          <li>
                            <NavLink
                              to={"applications"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Applications
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"new-application"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"re-register"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Re-Register
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}

                  {/* Accounts */}
                  <li>
                    <button
                      onClick={NavAccountsButtonToggle}
                      aria-expanded={NavAccountsToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring5
                          ? "bg-green-400 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title="Accounts"
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineAccountBalance size={18} />
                        <span className="truncate">Accounts</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavAccountsToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavAccountsToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavAccountsToggle}
                    >
                      <li>
                        <NavLink
                          to={"center-ledger"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Center Ledgers
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"offline-payment"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Offline Payment
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"student-ledger"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Student Ledger
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Fixed Bottom Profile Section */}
              <div className="relative px-4 py-3 dark:bg-slate-900 bg-white bottom-0 rounded-2xl mb-1.5">
                {/* Dropdown Menu */}
                {NavMyProfileToggle && (
                  <div className="absolute bottom-16 left-0 w-full px-4">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg shadow-lg p-2 animate-fade-in">
                      {/* User Info */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-slate-600">
                        <div className="text-xs font-semibold">
                          <span>{LoggedUser?.name}</span>
                          <span className="ml-1">({LoggedUser?.role})</span>
                        </div>
                        <GoDotFill size={12} className="text-green-400" />
                      </div>

                      {/* Profile */}
                      <NavLink to="profile">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password */}
                      <NavLink to="change-password">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>

                      {/* Logout */}
                      <button
                        onClick={HandleLogout}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-red-300 cursor-pointer text-red-700">
                          <RiLogoutCircleRFill /> Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile Button */}
                <button onClick={NavMyProfileButtonToggle} className="w-full">
                  <div
                    className={`cursor-pointer px-6 py-2 flex justify-between items-center rounded-xl border 
      ${
        DynamicColoring6
          ? "bg-green-500 text-white shadow-lg"
          : "hover:bg-green-100"
      }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-11 h-11 bg-red-300 rounded-2xl overflow-hidden flex justify-center items-center">
                        {LoggedUser?.photo ? (
                          <img
                            src={LoggedUser.photo}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <>
                            <span>{(LoggedUser?.name || "U").charAt(0)}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="truncate w-28">
                          {LoggedUser?.name}
                        </span>
                        <span className="ml-1">({LoggedUser?.role})</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </>
      ) : OPManagerLogged ? (
        <>
          {Location.pathname === UpdateStudentUrloperational ? null : (
            <div className="flex flex-col h-[calc(100vh-250px)] text-xs">
              {/* Scrollable Menu Area */}
              <div
                className="flex-1 overflow-y-auto mt-4 ScrollBarStyle2 px-2"
                role="navigation"
                aria-label="Admin sidebar"
              >
                <ul className="space-y-2 pt-6 flex flex-col gap-2">
                  {/* Dashboard */}
                  <li>
                    <NavLink
                      to={"dashboard"}
                      onClick={NavAdminDasboardButtonToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring0 || isActive
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`
                      }
                      aria-current={DynamicColoring0 ? "page" : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineDashboard size={18} />
                        <span className="truncate">Dashboard</span>
                      </div>
                    </NavLink>
                  </li>

                  {/* Academic */}
                  <li>
                    <button
                      onClick={NavAcademicButtonToggle}
                      aria-expanded={NavAcademicToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring
                          ? "bg-green-400 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title="Academic"
                    >
                      <div className="flex items-center gap-2">
                        <SiMicrosoftacademic size={18} />
                        <span className="truncate">Academic</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavAcademicToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavAcademicToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavAcademicToggle}
                    >
                      <li>
                        <NavLink
                          to={"departments"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Faculty
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"programs"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Course
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"specialization"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Stream
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  {!isBlocked ? (
                    <>
                      {/* Leads */}
                      <li>
                        <button
                          onClick={NavLeadButtonToggle}
                          aria-expanded={NavLeadToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring7
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Leads"
                        >
                          <div className="flex items-center gap-2">
                            <MdLeaderboard size={18} />
                            <span className="truncate">Leads</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavLeadToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-generate"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Generate
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-lead"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-all-leads"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show All Leads
                            </NavLink>
                          </li>
                        </ul>
                      </li>

                      {/* Leads Student */}
                      <li>
                        <button
                          onClick={NavLeadStudentButtonToggle}
                          aria-expanded={NavLeadStudentToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring8
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Students"
                        >
                          <div className="flex items-center gap-2">
                            <PiStudentFill size={18} />
                            <span className="truncate">Students</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavLeadStudentToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadStudentToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadStudentToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-application-form"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-application-forms"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show Students
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  ) : (
                    <>
                      {/* Admission */}
                      <li>
                        <button
                          onClick={NavAdmissionButtonToggle}
                          aria-expanded={NavAdmissionToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring2
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Admissions"
                        >
                          <div className="flex items-center gap-2">
                            <MdAddTask size={18} />
                            <span className="truncate">Admissions</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavAdmissionToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavAdmissionToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavAdmissionToggle}
                        >
                          <li>
                            <NavLink
                              to={"applications"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Applications
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"new-application"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}

                  {/* Accounts */}
                  <li>
                    <button
                      onClick={NavAccountsButtonToggle}
                      aria-expanded={NavAccountsToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring5
                          ? "bg-green-400 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title="Accounts"
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineAccountBalance size={18} />
                        <span className="truncate">Accounts</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavAccountsToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavAccountsToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavAccountsToggle}
                    >
                      <li>
                        <NavLink
                          to={"center-ledger"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Center Ledgers
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"offline-payment"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Offline Payment
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"online-payment"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Online Payment
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"student-ledger"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Student Ledger
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  {/* Users */}
                  <li>
                    <button
                      onClick={NavUsersButtonToggle}
                      aria-expanded={NavUsersToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring3
                          ? "bg-green-400 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title="Users"
                    >
                      <div className="flex items-center gap-2">
                        <HiUsers size={18} />
                        <span className="truncate">Users</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavUsersToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavUsersToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavUsersToggle}
                    >
                      <li>
                        <NavLink
                          to={"counsellors"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Counsellors
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"sub-counsellors"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Sub-Counsellors
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"center-master"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Center Master
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"center"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Center
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"create-accountant"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Account
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  {/* Setting */}
                  <li className="text-xs">
                    <NavLink
                      to={"settings"}
                      onClick={NavSettingsButtonToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring4 || isActive
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`
                      }
                    >
                      <div className="flex items-center gap-2">
                        <IoSettingsSharp size={18} />
                        <span className="truncate">Setting</span>
                      </div>
                    </NavLink>
                  </li>
                </ul>
              </div>

              {/* Fixed Bottom Profile Section */}
              <div className="relative px-4 py-3 dark:bg-slate-900 bg-white bottom-0 rounded-2xl mb-1.5">
                {/* Dropdown Menu */}
                {NavMyProfileToggle && (
                  <div className="absolute bottom-16 left-0 w-full px-4">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg shadow-lg p-2 animate-fade-in">
                      {/* User Info */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-slate-600">
                        <div className="text-xs font-semibold">
                          <span>{LoggedUser?.name}</span>
                          <span className="ml-1">({LoggedUser?.role})</span>
                        </div>
                        <GoDotFill size={12} className="text-green-400" />
                      </div>

                      {/* Profile */}
                      <NavLink to="profile">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password */}
                      <NavLink to="change-password">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>

                      {/* Logout */}
                      <button
                        onClick={HandleLogout}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-red-300 cursor-pointer text-red-700">
                          <RiLogoutCircleRFill /> Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile Button */}
                <button onClick={NavMyProfileButtonToggle} className="w-full">
                  <div
                    className={`cursor-pointer px-6 py-2 flex justify-between items-center rounded-xl border 
      ${
        DynamicColoring6
          ? "bg-green-500 text-white shadow-lg"
          : "hover:bg-green-100"
      }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-11 h-11 bg-red-300 rounded-2xl overflow-hidden flex justify-center items-center">
                        {LoggedUser?.photo ? (
                          <img
                            src={LoggedUser.photo}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <>
                            <span>{(LoggedUser?.name || "U").charAt(0)}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="truncate">{LoggedUser?.name}</span>
                        <span className="ml-1">({LoggedUser?.role})</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </>
      ) : AccountantLogged ? (
        <>
          <div className="flex flex-col h-[calc(100vh-250px)] text-xs">
            {/* Scrollable Menu Area */}
            <div
              className="flex-1 overflow-y-auto mt-4 ScrollBarStyle2 px-2"
              role="navigation"
              aria-label="Admin sidebar"
            >
              <ul className="space-y-2 pt-6 flex flex-col gap-2">
                {/* Dashboard */}
                <li>
                  <NavLink
                    to={"dashboard"}
                    onClick={NavAdminDasboardButtonToggle}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring0 || isActive
                          ? "bg-green-400 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`
                    }
                    aria-current={DynamicColoring0 ? "page" : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <MdOutlineDashboard size={18} />
                      <span className="truncate">Dashboard</span>
                    </div>
                  </NavLink>
                </li>

                {!isBlocked ? (
                  <>
                    {/* Leads */}
                    <li>
                      <button
                        onClick={NavLeadButtonToggle}
                        aria-expanded={NavLeadToggle}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring7
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="Leads"
                      >
                        <div className="flex items-center gap-2">
                          <MdLeaderboard size={18} />
                          <span className="truncate">Leads</span>
                        </div>

                        <RiArrowDropDownFill
                          size={18}
                          className={`${
                            NavLeadToggle ? "rotate-180 transform" : ""
                          } transition-transform`}
                        />
                      </button>

                      <ul
                        className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                          NavLeadToggle
                            ? "max-h-96 opacity-100 translate-y-0"
                            : "max-h-0 opacity-0 -translate-y-1"
                        }`}
                        aria-hidden={!NavLeadToggle}
                      >
                        <li>
                          <NavLink
                            to={"lead-generate"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Generate
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to={"show-lead"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Show
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to={"show-all-leads"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Show All Leads
                          </NavLink>
                        </li>
                      </ul>
                    </li>

                    {/* Leads Student */}
                    <li>
                      <button
                        onClick={NavLeadStudentButtonToggle}
                        aria-expanded={NavLeadStudentToggle}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring8
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="Students"
                      >
                        <div className="flex items-center gap-2">
                          <PiStudentFill size={18} />
                          <span className="truncate">Students</span>
                        </div>

                        <RiArrowDropDownFill
                          size={18}
                          className={`${
                            NavLeadStudentToggle ? "rotate-180 transform" : ""
                          } transition-transform`}
                        />
                      </button>

                      <ul
                        className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                          NavLeadStudentToggle
                            ? "max-h-96 opacity-100 translate-y-0"
                            : "max-h-0 opacity-0 -translate-y-1"
                        }`}
                        aria-hidden={!NavLeadStudentToggle}
                      >
                        <li>
                          <NavLink
                            to={"lead-application-form"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Fresh Apply
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to={"show-application-forms"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Show Students
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    {/* Admission */}
                    <li>
                      <button
                        onClick={NavAdmissionButtonToggle}
                        aria-expanded={NavAdmissionToggle}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring2
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="Admissions"
                      >
                        <div className="flex items-center gap-2">
                          <MdAddTask size={18} />
                          <span className="truncate">Admissions</span>
                        </div>

                        <RiArrowDropDownFill
                          size={18}
                          className={`${
                            NavAdmissionToggle ? "rotate-180 transform" : ""
                          } transition-transform`}
                        />
                      </button>

                      <ul
                        className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                          NavAdmissionToggle
                            ? "max-h-96 opacity-100 translate-y-0"
                            : "max-h-0 opacity-0 -translate-y-1"
                        }`}
                        aria-hidden={!NavAdmissionToggle}
                      >
                        <li>
                          <NavLink
                            to={"applications"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Applications
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                  </>
                )}

                {/* Accounts */}
                <li>
                  <button
                    onClick={NavAccountsButtonToggle}
                    aria-expanded={NavAccountsToggle}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      DynamicColoring5
                        ? "bg-green-400 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    title="Accounts"
                  >
                    <div className="flex items-center gap-2">
                      <MdOutlineAccountBalance size={18} />
                      <span className="truncate">Accounts</span>
                    </div>

                    <RiArrowDropDownFill
                      size={18}
                      className={`${
                        NavAccountsToggle ? "rotate-180 transform" : ""
                      } transition-transform`}
                    />
                  </button>

                  <ul
                    className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                      NavAccountsToggle
                        ? "max-h-96 opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-1"
                    }`}
                    aria-hidden={!NavAccountsToggle}
                  >
                    <li>
                      <NavLink
                        to={"center-ledger"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Center Ledgers
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to={"offline-payment"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Offline Payment
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to={"online-payment"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Online Payment
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to={"student-ledger"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Student Ledger
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Fixed Bottom Profile Section */}
            <div className="relative px-4 py-3 dark:bg-slate-900 bg-white bottom-0 rounded-2xl mb-1.5">
              {/* Dropdown Menu */}
              {NavMyProfileToggle && (
                <div className="absolute bottom-16 left-0 w-full px-4">
                  <div className="bg-gray-100 dark:bg-slate-700 rounded-lg shadow-lg p-2 animate-fade-in">
                    {/* User Info */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-slate-600">
                      <div className="text-xs font-semibold">
                        <span>{LoggedUser?.name}</span>
                        <span className="ml-1">({LoggedUser?.role})</span>
                      </div>
                      <GoDotFill size={12} className="text-green-400" />
                    </div>

                    {/* Profile */}
                    <NavLink to="profile">
                      <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                        <FaUser /> Profile
                      </div>
                    </NavLink>

                    {/* Change Password */}
                    <NavLink to="change-password">
                      <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                        <RiLockPasswordFill /> Change Password
                      </div>
                    </NavLink>

                    {/* Logout */}
                    <button onClick={HandleLogout} className="w-full text-left">
                      <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-red-300 cursor-pointer text-red-700">
                        <RiLogoutCircleRFill /> Logout
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Button */}
              <button onClick={NavMyProfileButtonToggle} className="w-full">
                <div
                  className={`cursor-pointer px-6 py-2 flex justify-between items-center rounded-xl border 
      ${
        DynamicColoring6
          ? "bg-green-500 text-white shadow-lg"
          : "hover:bg-green-100"
      }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-11 h-11 bg-red-300 rounded-2xl overflow-hidden flex justify-center items-center">
                      {LoggedUser?.photo ? (
                        <img
                          src={LoggedUser.photo}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <>
                          <span>{(LoggedUser?.name || "U").charAt(0)}</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="truncate">{LoggedUser?.name}</span>
                      <span className="ml-1">({LoggedUser?.role})</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      ) : CounsellorLogged ? (
        <>
          {Location.pathname === UpdateStudentUrlcounsellor ? null : (
            <div className="flex flex-col h-[calc(100vh-250px)] text-xs">
              {/* Scrollable Menu Area */}
              <div
                className="flex-1 overflow-y-auto mt-4 ScrollBarStyle2 px-2"
                role="navigation"
                aria-label="Admin sidebar"
              >
                <ul className="space-y-2 pt-6 flex flex-col gap-2">
                  {/* Dashboard */}
                  <li>
                    <NavLink
                      to={"dashboard"}
                      onClick={NavAdminDasboardButtonToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring0 || isActive
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`
                      }
                      aria-current={DynamicColoring0 ? "page" : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineDashboard size={18} />
                        <span className="truncate">Dashboard</span>
                      </div>
                    </NavLink>
                  </li>

                  {!isBlocked ? (
                    <>
                      {/* Leads */}
                      <li>
                        <button
                          onClick={NavLeadButtonToggle}
                          aria-expanded={NavLeadToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring7
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Leads"
                        >
                          <div className="flex items-center gap-2">
                            <MdLeaderboard size={18} />
                            <span className="truncate">Leads</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavLeadToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-generate"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Generate
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-lead"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-all-leads"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show All Leads
                            </NavLink>
                          </li>
                        </ul>
                      </li>

                      {/* Leads Student */}
                      <li>
                        <button
                          onClick={NavLeadStudentButtonToggle}
                          aria-expanded={NavLeadStudentToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring8
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Students"
                        >
                          <div className="flex items-center gap-2">
                            <PiStudentFill size={18} />
                            <span className="truncate">Students</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavLeadStudentToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadStudentToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadStudentToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-application-form"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-application-forms"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show Students
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  ) : (
                    <>
                      {/* Admission */}
                      <li>
                        <button
                          onClick={NavAdmissionButtonToggle}
                          aria-expanded={NavAdmissionToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring2
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Admissions"
                        >
                          <div className="flex items-center gap-2">
                            <MdAddTask size={18} />
                            <span className="truncate">Admissions</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavAdmissionToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavAdmissionToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavAdmissionToggle}
                        >
                          <li>
                            <NavLink
                              to={"applications"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Applications
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"new-application"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"re-register"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Re-Register
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}

                  {/* user */}
                  <li>
                    <button
                      onClick={NavUsersButtonToggle}
                      aria-expanded={NavUsersToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring3
                          ? "bg-green-400 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <HiUsers size={18} />
                        <span className="truncate">Users</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavUsersToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavUsersToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavUsersToggle}
                    >
                      <li>
                        <NavLink
                          to={"sub-counsellors"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Sub-Counsellor
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* Fixed Bottom Profile Section */}
              <div className="relative px-4 py-3 dark:bg-slate-900 bg-white bottom-0 rounded-2xl mb-1.5">
                {/* Dropdown Menu */}
                {NavMyProfileToggle && (
                  <div className="absolute bottom-16 left-0 w-full px-4">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg shadow-lg p-2 animate-fade-in">
                      {/* User Info */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-slate-600">
                        <div className="text-xs font-semibold">
                          <span>{LoggedUser?.name}</span>
                          <span className="ml-1">({LoggedUser?.role})</span>
                        </div>
                        <GoDotFill size={12} className="text-green-400" />
                      </div>

                      {/* Profile */}
                      <NavLink to="profile">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password */}
                      <NavLink to="change-password">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>

                      {/* Logout */}
                      <button
                        onClick={HandleLogout}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-red-300 cursor-pointer text-red-700">
                          <RiLogoutCircleRFill /> Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile Button */}
                <button onClick={NavMyProfileButtonToggle} className="w-full">
                  <div
                    className={`cursor-pointer px-6 py-2 flex justify-between items-center rounded-xl border 
      ${
        DynamicColoring6
          ? "bg-green-500 text-white shadow-lg"
          : "hover:bg-green-100"
      }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-11 h-11 bg-red-300 rounded-2xl overflow-hidden flex justify-center items-center">
                        {LoggedUser?.photo ? (
                          <img
                            src={LoggedUser.photo}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <>
                            <span>{(LoggedUser?.name || "U").charAt(0)}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="truncate">{LoggedUser?.name}</span>
                        <span className="ml-1">({LoggedUser?.role})</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </>
      ) : SubCounsellorLogged ? (
        <>
          {Location.pathname === UpdateStudentUrlsubcounsellor ? null : (
            <div className="flex flex-col h-[calc(100vh-250px)] text-xs">
              {/* Scrollable Menu Area */}
              <div
                className="flex-1 overflow-y-auto mt-4 ScrollBarStyle2 px-2"
                role="navigation"
                aria-label="Admin sidebar"
              >
                <ul className="space-y-2 pt-6 flex flex-col gap-2">
                  {/* Dashboard */}
                  <li>
                    <NavLink
                      to={"dashboard"}
                      onClick={NavAdminDasboardButtonToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring0 || isActive
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`
                      }
                      aria-current={DynamicColoring0 ? "page" : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineDashboard size={18} />
                        <span className="truncate">Dashboard</span>
                      </div>
                    </NavLink>
                  </li>

                  {!isBlocked ? (
                    <>
                      {/* Leads */}
                      <li>
                        <button
                          onClick={NavLeadButtonToggle}
                          aria-expanded={NavLeadToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring7
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Leads"
                        >
                          <div className="flex items-center gap-2">
                            <MdLeaderboard size={18} />
                            <span className="truncate">Leads</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavLeadToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-generate"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Generate
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-lead"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-all-leads"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show All Leads
                            </NavLink>
                          </li>
                        </ul>
                      </li>

                      {/* Leads Student */}
                      <li>
                        <button
                          onClick={NavLeadStudentButtonToggle}
                          aria-expanded={NavLeadStudentToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring8
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Students"
                        >
                          <div className="flex items-center gap-2">
                            <PiStudentFill size={18} />
                            <span className="truncate">Students</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavLeadStudentToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadStudentToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadStudentToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-application-form"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-application-forms"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show Students
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  ) : (
                    <>
                      {/* Admission */}
                      <li>
                        <button
                          onClick={NavAdmissionButtonToggle}
                          aria-expanded={NavAdmissionToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring2
                              ? "bg-green-400 text-white"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Admissions"
                        >
                          <div className="flex items-center gap-2">
                            <MdAddTask size={18} />
                            <span className="truncate">Admissions</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavAdmissionToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavAdmissionToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavAdmissionToggle}
                        >
                          <li>
                            <NavLink
                              to={"applications"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Applications
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"new-application"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"re-register"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Re-Register
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Fixed Bottom Profile Section */}
              <div className="relative px-4 py-3 dark:bg-slate-900 bg-white bottom-0 rounded-2xl mb-1.5">
                {/* Dropdown Menu */}
                {NavMyProfileToggle && (
                  <div className="absolute bottom-16 left-0 w-full px-4">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg shadow-lg p-2 animate-fade-in">
                      {/* User Info */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-slate-600">
                        <div className="text-xs font-semibold">
                          <span>{LoggedUser?.name}</span>
                          <span className="ml-1">({LoggedUser?.role})</span>
                        </div>
                        <GoDotFill size={12} className="text-green-400" />
                      </div>

                      {/* Profile */}
                      <NavLink to="profile">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password */}
                      <NavLink to="change-password">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>

                      {/* Logout */}
                      <button
                        onClick={HandleLogout}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-red-300 cursor-pointer text-red-700">
                          <RiLogoutCircleRFill /> Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile Button */}
                <button onClick={NavMyProfileButtonToggle} className="w-full">
                  <div
                    className={`cursor-pointer px-6 py-2 flex justify-between items-center rounded-xl border 
      ${
        DynamicColoring6
          ? "bg-green-500 text-white shadow-lg"
          : "hover:bg-green-100"
      }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-11 h-11 bg-red-300 rounded-2xl overflow-hidden flex justify-center items-center">
                        {LoggedUser?.photo ? (
                          <img
                            src={LoggedUser.photo}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <>
                            <span>{(LoggedUser?.name || "U").charAt(0)}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="truncate">{LoggedUser?.name}</span>
                        <span className="ml-1">({LoggedUser?.role})</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </>
      ) : UniversityManagerLogged ? (
        <>
          <div className="flex flex-col h-[calc(100vh-250px)] text-xs">
            {/* Scrollable Menu Area */}
            <div
              className="flex-1 overflow-y-auto mt-4 ScrollBarStyle2 px-2"
              role="navigation"
              aria-label="Admin sidebar"
            >
              <ul className="space-y-2 pt-6 flex flex-col gap-2">
                {/* Dashboard */}
                <li>
                  <NavLink
                    to={"dashboard"}
                    onClick={NavAdminDasboardButtonToggle}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring0 || isActive
                          ? "bg-green-400 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`
                    }
                    aria-current={DynamicColoring0 ? "page" : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <MdOutlineDashboard size={18} />
                      <span className="truncate">Dashboard</span>
                    </div>
                  </NavLink>
                </li>

                {!isBlocked ? (
                  <>
                    {/* Leads */}
                    <li>
                      <button
                        onClick={NavLeadButtonToggle}
                        aria-expanded={NavLeadToggle}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring7
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="Leads"
                      >
                        <div className="flex items-center gap-2">
                          <MdLeaderboard size={18} />
                          <span className="truncate">Leads</span>
                        </div>

                        <RiArrowDropDownFill
                          size={18}
                          className={`${
                            NavLeadToggle ? "rotate-180 transform" : ""
                          } transition-transform`}
                        />
                      </button>

                      <ul
                        className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                          NavLeadToggle
                            ? "max-h-96 opacity-100 translate-y-0"
                            : "max-h-0 opacity-0 -translate-y-1"
                        }`}
                        aria-hidden={!NavLeadToggle}
                      >
                        <li>
                          <NavLink
                            to={"lead-generate"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Generate
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to={"show-lead"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Show
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to={"show-all-leads"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Show All Leads
                          </NavLink>
                        </li>
                      </ul>
                    </li>

                    {/* Leads Student */}
                    <li>
                      <button
                        onClick={NavLeadStudentButtonToggle}
                        aria-expanded={NavLeadStudentToggle}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring8
                            ? "bg-green-400 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="Students"
                      >
                        <div className="flex items-center gap-2">
                          <PiStudentFill size={18} />
                          <span className="truncate">Students</span>
                        </div>

                        <RiArrowDropDownFill
                          size={18}
                          className={`${
                            NavLeadStudentToggle ? "rotate-180 transform" : ""
                          } transition-transform`}
                        />
                      </button>

                      <ul
                        className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                          NavLeadStudentToggle
                            ? "max-h-96 opacity-100 translate-y-0"
                            : "max-h-0 opacity-0 -translate-y-1"
                        }`}
                        aria-hidden={!NavLeadStudentToggle}
                      >
                        <li>
                          <NavLink
                            to={"lead-application-form"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Fresh Apply
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to={"show-application-forms"}
                            className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <RiArrowDropRightFill size={16} />
                            Show Students
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <li>
                    <button
                      onClick={NavAdmissionButtonToggle}
                      aria-expanded={NavAdmissionToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring2
                          ? "bg-green-400 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title="Admissions"
                    >
                      <div className="flex items-center gap-2">
                        <MdAddTask size={18} />
                        <span className="truncate">Admissions</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavAdmissionToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavAdmissionToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavAdmissionToggle}
                    >
                      <li>
                        <NavLink
                          to={"applications"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Applications
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={"new-application"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Fresh Apply
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                )}

                {/* Accounts */}
                <li>
                  <button
                    onClick={NavAccountsButtonToggle}
                    aria-expanded={NavAccountsToggle}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      DynamicColoring5
                        ? "bg-green-400 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MdOutlineAccountBalance size={18} />
                      <span className="truncate">Accounts</span>
                    </div>

                    <RiArrowDropDownFill
                      size={18}
                      className={`${
                        NavAccountsToggle ? "rotate-180 transform" : ""
                      } transition-transform`}
                    />
                  </button>

                  <ul
                    className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                      NavAccountsToggle
                        ? "max-h-96 opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-1"
                    }`}
                    aria-hidden={!NavAccountsToggle}
                  >
                    <li>
                      <NavLink
                        to={"student-ledger"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Student Ledger
                      </NavLink>
                    </li>
                  </ul>
                </li>

                {/* Academic */}
                <li>
                  <button
                    onClick={NavAcademicButtonToggle}
                    aria-expanded={NavAcademicToggle}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      DynamicColoring
                        ? "bg-green-400 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    title="Academic"
                  >
                    <div className="flex items-center gap-2">
                      <SiMicrosoftacademic size={18} />
                      <span className="truncate">Academic</span>
                    </div>

                    <RiArrowDropDownFill
                      size={18}
                      className={`${
                        NavAcademicToggle ? "rotate-180 transform" : ""
                      } transition-transform`}
                    />
                  </button>

                  <ul
                    className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                      NavAcademicToggle
                        ? "max-h-96 opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-1"
                    }`}
                    aria-hidden={!NavAcademicToggle}
                  >
                    <li>
                      <NavLink
                        to={"departments"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Departments
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to={"programs"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Programs
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to={"specialization"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Specialization
                      </NavLink>
                    </li>
                  </ul>
                </li>

                {/* Users */}
                <li>
                  <button
                    onClick={NavUsersButtonToggle}
                    aria-expanded={NavUsersToggle}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      DynamicColoring3
                        ? "bg-green-400 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <HiUsers size={18} />
                      <span className="truncate">Users</span>
                    </div>

                    <RiArrowDropDownFill
                      size={18}
                      className={`${
                        NavUsersToggle ? "rotate-180 transform" : ""
                      } transition-transform`}
                    />
                  </button>

                  <ul
                    className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                      NavUsersToggle
                        ? "max-h-96 opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-1"
                    }`}
                    aria-hidden={!NavUsersToggle}
                  >
                    <li>
                      <NavLink
                        to={"counsellors"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Counsellors
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to={"sub-counsellors"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Sub-Counsellors
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to={"center"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Center
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to={"sub-center"}
                        className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RiArrowDropRightFill size={16} />
                        Sub-Center
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Fixed Bottom Profile Section */}
            <div className="relative px-4 py-3 dark:bg-slate-900 bg-white bottom-0 rounded-2xl mb-1.5">
              {/* Dropdown Menu */}
              {NavMyProfileToggle && (
                <div className="absolute bottom-16 left-0 w-full px-4">
                  <div className="bg-gray-100 dark:bg-slate-700 rounded-lg shadow-lg p-2 animate-fade-in">
                    {/* User Info */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-slate-600">
                      <div className="text-xs font-semibold">
                        <span>{LoggedUser?.name}</span>
                        <span className="ml-1">({LoggedUser?.role})</span>
                      </div>
                      <GoDotFill size={12} className="text-green-400" />
                    </div>

                    {/* Profile */}
                    <NavLink to="profile">
                      <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                        <FaUser /> Profile
                      </div>
                    </NavLink>

                    {/* Change Password */}
                    <NavLink to="change-password">
                      <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                        <RiLockPasswordFill /> Change Password
                      </div>
                    </NavLink>

                    {/* Logout */}
                    <button onClick={HandleLogout} className="w-full text-left">
                      <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-red-300 cursor-pointer text-red-700">
                        <RiLogoutCircleRFill /> Logout
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Button */}
              <button onClick={NavMyProfileButtonToggle} className="w-full">
                <div
                  className={`cursor-pointer px-6 py-2 flex justify-between items-center rounded-xl border 
      ${
        DynamicColoring6
          ? "bg-green-500 text-white shadow-lg"
          : "hover:bg-green-100"
      }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-11 h-11 bg-red-300 rounded-2xl overflow-hidden flex justify-center items-center">
                      {LoggedUser?.photo ? (
                        <img
                          src={LoggedUser.photo}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <>
                          <span>{(LoggedUser?.name || "U").charAt(0)}</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="truncate">{LoggedUser?.name}</span>
                      <span className="ml-1">({LoggedUser?.role})</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      ) : (
        Location.pathname && (
          <>
            <div className="flex flex-col h-[calc(100vh-250px)] text-xs">
              {/* Scrollable Menu Area */}
              <div
                className="flex-1 overflow-y-auto mt-4 ScrollBarStyle2 px-2"
                role="navigation"
                aria-label="Admin sidebar"
              >
                <ul className="space-y-2">
                  {/* Dashboard */}
                  <li>
                    <NavLink
                      to={"dashboard"}
                      onClick={NavAdminDasboardButtonToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring0 || isActive
                            ? "bg-green-500 text-white shadow-md"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`
                      }
                      aria-current={DynamicColoring0 ? "page" : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineDashboard size={18} />
                        <span className="truncate">Dashboard</span>
                      </div>
                    </NavLink>
                  </li>

                  {/* Academic */}
                  <li>
                    <button
                      onClick={NavAcademicButtonToggle}
                      aria-expanded={NavAcademicToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring
                          ? "bg-green-500 text-white shadow-md"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title="Academic"
                    >
                      <div className="flex items-center gap-2">
                        <SiMicrosoftacademic size={18} />
                        <span className="truncate">Academic</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavAcademicToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavAcademicToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavAcademicToggle}
                    >
                      <li>
                        <NavLink
                          to={"universities"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Universities
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"departments"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Faculty
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"programs"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Course
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"specialization"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Stream
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"syllabus"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Syllabus
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  {!isBlocked ? (
                    <>
                      {/* Leads */}
                      <li>
                        <button
                          onClick={NavLeadButtonToggle}
                          aria-expanded={NavLeadToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring7
                              ? "bg-green-500 text-white shadow-md"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Leads"
                        >
                          <div className="flex items-center gap-2">
                            <MdLeaderboard size={18} />
                            <span className="truncate">Leads</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavLeadToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-generate"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Generate
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-lead"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-all-leads"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show All Leads
                            </NavLink>
                          </li>
                        </ul>
                      </li>

                      {/* Leads Student */}
                      <li>
                        <button
                          onClick={NavLeadStudentButtonToggle}
                          aria-expanded={NavLeadStudentToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring8
                              ? "bg-green-500 text-white shadow-md"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Students"
                        >
                          <div className="flex items-center gap-2">
                            <PiStudentFill size={18} />
                            <span className="truncate">Students</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavLeadStudentToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavLeadStudentToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavLeadStudentToggle}
                        >
                          <li>
                            <NavLink
                              to={"lead-application-form"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"show-application-forms"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Show Students
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  ) : (
                    <>
                      {/* Admission */}
                      <li>
                        <button
                          onClick={NavAdmissionButtonToggle}
                          aria-expanded={NavAdmissionToggle}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            DynamicColoring2
                              ? "bg-green-500 text-white shadow-md"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title="Admissions"
                        >
                          <div className="flex items-center gap-2">
                            <MdAddTask size={18} />
                            <span className="truncate">Admissions</span>
                          </div>

                          <RiArrowDropDownFill
                            size={18}
                            className={`${
                              NavAdmissionToggle ? "rotate-180 transform" : ""
                            } transition-transform`}
                          />
                        </button>

                        <ul
                          className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                            NavAdmissionToggle
                              ? "max-h-96 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-1"
                          }`}
                          aria-hidden={!NavAdmissionToggle}
                        >
                          <li>
                            <NavLink
                              to={"applications"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Applications
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"new-application"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Fresh Apply
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to={"re-register"}
                              className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <RiArrowDropRightFill size={16} />
                              Re-Register
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}

                  {/* Accounts */}
                  <li>
                    <button
                      onClick={NavAccountsButtonToggle}
                      aria-expanded={NavAccountsToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring5
                          ? "bg-green-500 text-white shadow-md"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineAccountBalance size={18} />
                        <span className="truncate">Accounts</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavAccountsToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavAccountsToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavAccountsToggle}
                    >
                      <li>
                        <NavLink
                          to={"center-ledger"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Center Ledgers
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"offline-payment"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Offline Payment
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"online-payment"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Online Payment
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"student-ledger"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Student Ledger
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  {/* Users */}
                  <li>
                    <button
                      onClick={NavUsersButtonToggle}
                      aria-expanded={NavUsersToggle}
                      className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        DynamicColoring3
                          ? "bg-green-500 text-white shadow-md"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <HiUsers size={18} />
                        <span className="truncate">Users</span>
                      </div>

                      <RiArrowDropDownFill
                        size={18}
                        className={`${
                          NavUsersToggle ? "rotate-180 transform" : ""
                        } transition-transform`}
                      />
                    </button>

                    <ul
                      className={`pl-2 mt-2 space-y-1 transition-[max-height,opacity,transform] overflow-hidden ${
                        NavUsersToggle
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-1"
                      }`}
                      aria-hidden={!NavUsersToggle}
                    >
                      <li>
                        <NavLink
                          to={"university-manager"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-[12.5px] hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          University Managers
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"operations"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Operations
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"counsellors"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Counsellors
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"sub-counsellors"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Sub-Counsellors
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"center-master"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Center Master
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"center"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Center
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"sub-center"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Sub-Center
                        </NavLink>
                      </li>

                      <li>
                        <NavLink
                          to={"create-accountant"}
                          className="flex items-center gap-2 px-6 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <RiArrowDropRightFill size={16} />
                          Accountant
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  {/* SETTING */}
                  <li className="text-xs">
                    <NavLink
                      to={"settings"}
                      onClick={NavSettingsButtonToggle}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                          DynamicColoring4 || isActive
                            ? "bg-green-500 text-white shadow-md"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`
                      }
                    >
                      <div className="flex items-center gap-2">
                        <IoSettingsSharp size={18} />
                        <span className="truncate">Setting</span>
                      </div>
                    </NavLink>
                  </li>
                </ul>
              </div>

              {/* Fixed Bottom Profile Section */}
              <div className="relative px-4 py-3 dark:bg-slate-900 bg-white bottom-0 rounded-2xl mb-1.5">
                {/* Dropdown Menu */}
                {NavMyProfileToggle && (
                  <div className="absolute bottom-16 left-0 w-full px-4">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-lg shadow-lg p-2 animate-fade-in">
                      {/* User Info */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-300 dark:border-slate-600">
                        <div className="text-xs font-semibold">
                          <span>{LoggedUser?.name}</span>
                          <span className="ml-1">({LoggedUser?.role})</span>
                        </div>
                        <GoDotFill size={12} className="text-green-400" />
                      </div>

                      {/* Profile */}
                      <NavLink to="profile">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <FaUser /> Profile
                        </div>
                      </NavLink>

                      {/* Change Password */}
                      <NavLink to="change-password">
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-green-300 cursor-pointer">
                          <RiLockPasswordFill /> Change Password
                        </div>
                      </NavLink>

                      {/* Logout */}
                      <button
                        onClick={HandleLogout}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-md hover:bg-red-300 cursor-pointer text-red-700">
                          <RiLogoutCircleRFill /> Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile Button */}
                <button onClick={NavMyProfileButtonToggle} className="w-full">
                  <div
                    className={`cursor-pointer px-6 py-2 flex justify-between items-center rounded-xl border 
      ${
        DynamicColoring6
          ? "bg-green-500 text-white shadow-lg"
          : "hover:bg-green-100"
      }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-11 h-11 bg-red-300 rounded-2xl overflow-hidden flex justify-center items-center">
                        {LoggedUser?.photo ? (
                          <img
                            src={LoggedUser.photo}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <>
                            <span>{(LoggedUser?.name || "U").charAt(0)}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="truncate">{LoggedUser?.name}</span>
                        <span className="ml-1">({LoggedUser?.role})</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Sidebar;
