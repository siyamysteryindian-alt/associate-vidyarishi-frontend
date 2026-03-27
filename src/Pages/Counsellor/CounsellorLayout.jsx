import React, { Fragment, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Admin/Sidebar";
import { BiLogOut } from "react-icons/bi";
import { FaExchangeAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUniversityDetails } from "../../Redux/UniversitySlice";
import { setUserDetails } from "../../Redux/UserSlice";
import axios from "axios";
import DisplayWindowNotify from "../DisplayWindowNotify";
import UseNotifyData from "../../CustomHooks/Notify/UseNotify";
import UseGetLoggedUser from "../../CustomHooks/UseGetLoggedUser";
import Mainlogo from "../../../public/logo.jpg";
import "../../App.css";

/* Local skeleton helpers (same style as Center/Subcenter) */
const LineSkeleton = ({ w = "w-full", h = "h-4", rounded = "rounded-lg" }) => (
  <div className={`skeleton ${w} ${h} ${rounded}`} />
);
const BoxSkeleton = ({ w = "w-full", h = "h-24", rounded = "rounded-2xl" }) => (
  <div className={`skeleton ${w} ${h} ${rounded}`} />
);

const CounsellorLayout = () => {
  const dispatch = useDispatch();
  const Location = useLocation();
  const NavigateTo = useNavigate();

  const { GetLoginUserDetails, GetLoggedUserLoader, LoggedUserData } =
    UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
  }, []); // eslint-disable-line

  const GetDataFromRedux = useSelector((state) => state.university);
  const GetUserFromRedux = useSelector((state) => state.user);

  const { NotifyDataLoading, NotifyData, FetchNotifyWindow } = UseNotifyData();

  useEffect(() => {
    FetchNotifyWindow();
  }, []); // eslint-disable-line

  // University modal open state (persisted)
  const [UniversityChange, setUniversityChange] = useState(() => {
    try {
      const savedValue = localStorage.getItem("UniversityChange");
      return savedValue !== null ? JSON.parse(savedValue) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "UniversityChange",
        JSON.stringify(UniversityChange)
      );
    } catch {}
  }, [UniversityChange]);

  const ChangeUniversityOpen = () => setUniversityChange(true);
  const ChangeUniversityClose = () => setUniversityChange(false);

  // Search input for modal
  const [SearchInput, setSearchInput] = useState("");
  const HandleOnchangeButton = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  // Selecting a university -> dispatch to redux
  const SelectHandleUniversityData = (data) => {
    const UniversityData = {
      id: data?._id,
      name: data?.name,
      isAvailable: data?.isAvailable,
      photo: data?.photo,
      vertical: data?.vertical,
      creatorType: data?.creatorType,
      whoCreated: data?.whoCreated,
    };

    dispatch(setUniversityDetails(UniversityData));

    toast.success("University Changed");

    setUniversityChange(false);
    try {
      localStorage.setItem("UniversityChange", JSON.stringify(false));
    } catch {}
  };

  // Notice fetching (mirrors other layouts)
  const [NoticeListData, setNoticeListData] = useState([]);
  const [NoticeLoading, setNoticeLoading] = useState(false);

  const FetchNotice = async () => {
    try {
      setNoticeLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAllNotice`,
        {
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        setNoticeListData(response?.data?.data);
      } else {
        setNoticeListData([]);
      }
    } catch (error) {
      setNoticeListData([]);
    } finally {
      setNoticeLoading(false);
    }
  };

  useEffect(() => {
    if (GetUserFromRedux?.id) {
      FetchNotice();
    }
  }, [GetUserFromRedux?.id]); // eslint-disable-line

  const filteredNotices = NoticeListData?.filter(
    (filter) =>
      !filter?.isStopPublish &&
      (filter?.isPublishToAll || filter?.isPublishToCounsellor)
  );

  const shouldShowBanner =
    (Location.pathname === `/counsellor/dashboard` ||
      Location.pathname === `/counsellor`) &&
    (GetUserFromRedux?.role === "Counsellor" ||
      GetUserFromRedux?.role === "counsellor") &&
    filteredNotices?.length > 0;

  const hasValidNotifications = NotifyData?.some(
    (data) =>
      !data?.isDeleted &&
      !data?.isStopPublish &&
      (data?.isPublishToCounsellor ||
        data?.isPublishToSubCounsellor ||
        data?.isPublishToAll)
  );

  /* Footer height constant */
  const FOOTER_HEIGHT_PX = 64;

  const HandleLogOutUser = async () => {
    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {},
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        dispatch(
          setUserDetails({ id: "", name: "", email: "", photo: "", role: "" })
        );
        dispatch(
          setUniversityDetails({
            id: "",
            name: "",
            isAvailable: "",
            photo: "",
            vertical: "",
          })
        );
        NavigateTo("/");
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <Fragment>
      <Toaster position="top-right" />

      <div
        className="w-full overflow-hidden"
        style={{ background: "var(--color-bg)" }}
      >
        <div
          className="grid grid-cols-[300px_1fr] w-screen"
          style={{ height: "100vh" }}
        >
          {/* LEFT: sticky sidebar with brand, selected uni preview and nav */}
          <aside className="px-4">
            <div className="sticky top-4 flex flex-col gap-4">
              {/* Brand & quick stats */}
              <div className="flex flex-col gap-2">
                <div className="bg-[var(--color-surface)] rounded-2xl px-4 py-2 shadow flex items-center gap-3">
                  <img
                    src={Mainlogo}
                    className="px-2 py-0.5 w-full object-contain"
                    alt="Logo"
                  />
                </div>

                {/* Selected university preview */}
                <div className="bg-[var(--color-surface)] rounded-2xl px-4 py-1 shadow flex items-center gap-3 mt-2">
                  <div className="w-40 h-14 rounded bg-white flex items-center justify-center overflow-hidden">
                    {GetDataFromRedux?.photo ? (
                      <img
                        src={GetDataFromRedux.photo}
                        alt="uni"
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <div className="text-xs text-gray-400 px-2">No uni</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="w-28 whitespace-nowrap text-sm font-semibold truncate">
                      {GetDataFromRedux?.name || "University not selected"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {GetDataFromRedux?.id &&
                        `${GetDataFromRedux?.departments || 0} depts`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {GetDataFromRedux?.id &&
                        `${GetDataFromRedux?.departments || 0} programs`}
                    </div>
                  </div>

                  <button
                    onClick={() => setUniversityChange(true)}
                    className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-white font-medium shadow"
                    style={{ background: "var(--color-purple)" }}
                    title="Change University"
                  >
                    <FaExchangeAlt />
                  </button>
                </div>
              </div>

              {/* Main navigation */}
              <div
                className="bg-[var(--color-surface)] rounded-2xl px-4 shadow"
                style={{ boxShadow: "var(--soft-shadow)" }}
              >
                <Sidebar />
              </div>

              <div
                className="bg-[var(--color-surface)] rounded-2xl p-4 shadow text-center"
                style={{ boxShadow: "var(--soft-shadow)" }}
              >
                <div>
                  <div className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Vidyarishi
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: Main content area */}
          <main
            className="m-0 mt-2 px-0 pt-0 overflow-auto overflow-y-hidden"
            style={{ paddingBottom: `${FOOTER_HEIGHT_PX + 12}px` }}
          >
            {/* Notice bar (if any) */}
            {shouldShowBanner && (
              <div className="mb-6">
                <div
                  className="rounded-xl px-4 py-2 flex items-center justify-between"
                  style={{ background: "var(--color-surface)" }}
                >
                  <div className="font-semibold text-sm text-red-600">
                    Notice:
                  </div>
                  <div className="flex-1 mx-4 text-sm truncate">
                    {filteredNotices?.map((d) => d?.NoticeName).join(" • ")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            {/* Main route area */}
            <section className="bg-none">
              {Location.pathname === `/counsellor` ? (
                <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-6">
                  <h2 className="text-3xl font-semibold">Welcome Counsellor</h2>
                  <button
                    onClick={() => NavigateTo("/counsellor/dashboard")}
                    className="px-8 py-2 rounded-lg bg-yellow-400 hover:brightness-95 transition"
                  >
                    Go To Dashboard
                  </button>
                </div>
              ) : (
                <div>
                  {GetLoggedUserLoader ? (
                    <div className="grid grid-cols-1 gap-4">
                      <BoxSkeleton h="h-40" />
                      <div className="grid grid-cols-2 gap-4">
                        <BoxSkeleton />
                        <BoxSkeleton />
                      </div>
                    </div>
                  ) : (
                    <Outlet />
                  )}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* University change modal (right drawer) */}
      {UniversityChange && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4">
          {hasValidNotifications && (
            <div className="absolute top-6 left-6 z-50">
              <DisplayWindowNotify
                NotifyDataLoading={NotifyDataLoading}
                NotifyData={NotifyData}
              />
            </div>
          )}

          <div
            className="bg-[var(--color-surface)] rounded-2xl shadow-2xl w-full max-w-screen-lg h-[calc(100vh-90px)] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-university-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2
                  id="change-university-title"
                  className="text-lg font-semibold"
                >
                  Change University
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Select a university to switch context for counsellor actions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M21 21l-4.35-4.35M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <input
                    value={SearchInput}
                    onChange={HandleOnchangeButton}
                    placeholder="Search university..."
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[var(--color-purple)] focus:border-[var(--color-purple)] transition"
                    aria-label="Search universities"
                  />

                  {SearchInput && (
                    <button
                      onClick={() =>
                        HandleOnchangeButton({
                          target: { value: "" },
                          preventDefault: () => {},
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  onClick={ChangeUniversityClose}
                  className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label="Close dialog"
                  title="Close"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>

            {/* Content: scroll area + footer */}
            <div className="flex flex-col h-[calc(100%-88px)]">
              <div className="px-6 py-4 overflow-auto ScrollBarStyle flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-gray-700">
                    Number Of Universities:{" "}
                    <span className="font-bold text-gray-900">
                      {LoggedUserData?.allotedUniversities?.length || 0}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Tip: click a tile to switch university context
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 pb-6">
                  {GetLoggedUserLoader ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center rounded-xl bg-[var(--color-surface)] p-3 shadow-sm animate-pulse"
                      >
                        <BoxSkeleton h="h-20" />
                        <div className="mt-3 w-full">
                          <LineSkeleton h="h-4" />
                        </div>
                      </div>
                    ))
                  ) : LoggedUserData?.allotedUniversities?.length > 0 ? (
                    LoggedUserData?.allotedUniversities
                      .filter((u) =>
                        (u?.name || "")
                          .toLowerCase()
                          .includes((SearchInput || "").toLowerCase())
                      )
                      .map((data, index) => (
                        <article
                          key={index}
                          className="flex flex-col rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
                        >
                          <button
                            onClick={() => SelectHandleUniversityData(data)}
                            className="text-left w-full"
                          >
                            <div
                              className={`flex items-center justify-center text-center p-2 text-sm  
    ${
      data?.vertical === "Online"
        ? "bg-gradient-to-r from-blue-600 to-purple-500 text-white"
        : "bg-gradient-to-r from-slate-700 to-slate-500 text-slate-100"
    }`}
                            >
                              {data?.vertical}
                            </div>


                            <div className="w-full h-28 bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                              {data?.photo ? (
                                <img
                                  src={data?.photo}
                                  alt={data?.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              ) : (
                                <div className="text-sm text-gray-400 p-4">
                                  No image
                                </div>
                              )}
                            </div>

                            <div className="p-4">
                              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                                {data?.name}
                              </h3>

                              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                <div className="truncate">
                                  {data?.program?.length || 0} programs •{" "}
                                  {data?.department?.length || 0} depts
                                </div>

                                <div className="flex items-center gap-2">
                                  {data?.isAvailable ? (
                                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        </article>
                      ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 font-medium py-12">
                      No universities found.
                    </div>
                  )}
                </div>
              </div>

              {/* sticky footer inside dialog */}
              <div className="border-t px-6 py-3 bg-[var(--color-surface)] flex items-center justify-between gap-3">
                <div className="text-xs text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {LoggedUserData?.allotedUniversities?.filter((u) =>
                      (u?.name || "")
                        .toLowerCase()
                        .includes((SearchInput || "").toLowerCase())
                    ).length || 0}
                  </span>{" "}
                  results
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      HandleOnchangeButton({
                        target: { value: "" },
                        preventDefault: () => {},
                      })
                    }
                    className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Clear
                  </button>

                  <button
                    onClick={ChangeUniversityClose}
                    className="px-4 py-2 rounded-md bg-[var(--color-purple)] text-white font-medium shadow hover:brightness-95 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* bottom footer bar for counsellor (fixed) */}
      <div></div>
    </Fragment>
  );
};

export default CounsellorLayout;
