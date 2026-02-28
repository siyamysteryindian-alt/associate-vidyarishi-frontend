import React, { useEffect, useMemo, useState } from "react";
import FreshStudents from "./ListOf_FreshStudents";
import Re_Reg_Students from "./ListOf_Re_Reg_Students";
import Processed from "./ListOf_Processed";
import ListOf_Pending from "./ListOf_Pending";
import FilterList from "./FilterList";
import UseGetAllStudents from "../../../../CustomHooks/UseGetStudentsPagination";
import UsePaymentData from "../../../../CustomHooks/UsePaymentData";
import UseGetCenterSubCenter from "../../../../CustomHooks/UseGetCenterSubCenter";
import UseGetAdmissionSession from "../../../../CustomHooks/UseGetAdmissionSession";
import { useSelector } from "react-redux";
import CreateWallet from "../Wallet/CreateWallet";
import UseGetLoggedUser from "../../../../CustomHooks/UseGetLoggedUser";
import toast from "react-hot-toast";
import ListOf_ApprovedWalletList from "./WalletsList/ListOf_ApprovedWalletList";
import ListOf_PendingWallets from "./WalletsList/ListOf_PendingWallets";
import ListOf_RejectedWalletList from "./WalletsList/ListOf_RejectedWalletList";
import UseGetWallet from "../../../../CustomHooks/Wallet/useWallet";
import {
  IoCreate,
  IoChevronBack,
  IoChevronForwardOutline,
} from "react-icons/io5";
import axios from "axios";

const AdminCenterLedger = () => {
  // redux + hooks
  const UniversityGetDataFromRedux = useSelector((s) => s?.university);
  const UserLoggedGetDataFromRedux = useSelector((s) => s?.user);

  const { GetLoginUserDetails, GetLoggedUserLoader, LoggedUserData } =
    UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
    // eslint-disable-next-line
  }, [UserLoggedGetDataFromRedux?.id]);

  const {
    FetchAllStudentByPagination,
    handlePageChange,
    AllStudentListData,
    AllStudentCurrentPage,
    AllStudentTotalPages,
    AllStudentLimit,
    AllStudentLoading,
    AllStudentTotalDocs,
  } = UseGetAllStudents();

  const { PaymentLoading, PaymentError, Payment, GetAllPaymentData } =
    UsePaymentData();

  const { GetCenter, Center } = UseGetCenterSubCenter();

  const { AdmissionsessionListData, GetAdmissionSession } =
    UseGetAdmissionSession();

  const { GetWallet, GetWalletData } = UseGetWallet();

  // ui state
  const [activeView, setActiveView] = useState("fresh"); // fresh | pending | processed | filter | re-register | wallet-*
  const [filters, setFilters] = useState({
    CenterFilter: "",
    AdmissionFilter: "",
    ExamFilter: "",
  });

  const [openAddWallet, setOpenAddWallet] = useState(false);
  const [refreshForWallet, setRefreshForWallet] = useState(false);
  const [updatedWalletData, setUpdatedWalletData] = useState([]);
  const [updatedWalletLoading, setUpdatedWalletLoading] = useState(false);

  // initial fetches
  useEffect(() => {
    FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
    GetAllPaymentData();
    GetCenter();
    GetAdmissionSession();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (UniversityGetDataFromRedux?.id) {
      FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
    }
    // eslint-disable-next-line
  }, [UniversityGetDataFromRedux?.id]);

  useEffect(() => {
    if (
      LoggedUserData?.role === "Admin" ||
      LoggedUserData?.role === "Accountant"
    ) {
      GetWalletData();
    }
    // eslint-disable-next-line
  }, [LoggedUserData?.role]);

  useEffect(() => {
    if (refreshForWallet) {
      GetWalletData();
      setRefreshForWallet(false);
    }
  }, [refreshForWallet, GetWalletData]);

  // derived counts
  const PendingNotpaid = useMemo(
    () =>
      AllStudentListData.filter(
        (data) => data?.payments?.paymentStatus === "pending"
      ).length,
    [AllStudentListData]
  );

  const AllCenterPayments = useMemo(
    () =>
      AllStudentListData.filter(
        (data) =>
          data?.SubCourse?.admissionFeeId?.feeAmount &&
          data?.payments?.paymentStatus !== "pending" &&
          data?.payments?.paymentStatus !== "approved"
      ).length,
    [AllStudentListData]
  );

  const ApprovedCenterPayments = useMemo(
    () =>
      AllStudentListData.filter(
        (f) => f?.payments?.paymentStatus === "approved"
      ).length,
    [AllStudentListData]
  );

  const PendingWalletListWithFilter = useMemo(
    () =>
      GetWallet.filter((w) => w?.WalletStatus === "pending" && !w?.isDeleted)
        .length,
    [GetWallet]
  );
  const ApprovedWalletListWithFilter = useMemo(
    () =>
      GetWallet.filter((w) => w?.WalletStatus === "approved" && !w?.isDeleted)
        .length,
    [GetWallet]
  );
  const RejectedWalletListWithFilter = useMemo(
    () =>
      GetWallet.filter((w) => w?.WalletStatus === "rejected" && !w?.isDeleted)
        .length,
    [GetWallet]
  );

  // handlers
  const HandleFreshStudentsButton = () => setActiveView("fresh");
  const HandlePendingButton = () => setActiveView("pending");
  const HandleProcessedButton = () => setActiveView("processed");
  const HandleReRegisterButton = () => setActiveView("re-register");
  const HandleFilterList = () => setActiveView("filter");

  const HandleApprovedWalletList = () => setActiveView("wallet-approved");
  const HandlePendingWalletList = () => setActiveView("wallet-pending");
  const HandleRejectedWalletList = () => setActiveView("wallet-rejected");

  const HandleOpenAddWallet = () => setOpenAddWallet(true);
  const HandleCloseAddWallet = () => setOpenAddWallet(false);

  const HandleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // When any filter applied, show fresh as default view (same behaviour you had)
  useEffect(() => {
    if (
      filters?.CenterFilter ||
      filters?.AdmissionFilter ||
      filters?.ExamFilter
    ) {
      setActiveView("fresh");
    }
    // eslint-disable-next-line
  }, [filters]);

  // page change safe helpers (kept semantics from your Departments example)
  const handlePageChangeSafe = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }
    if (pageNumber > AllStudentTotalPages) {
      toast.error(`Only Pages ${AllStudentTotalPages} Available`);
      return;
    }
    handlePageChange(pageNumber);
  };

  const handleLimitChange = (event) => {
    const value = parseInt(event.target.value || 10);
    // your pagination hook uses external state; here we emulate Departments approach by setting limit via hook if supported
    // if your pagination hook exposes a setter, call it here; otherwise call FetchAllStudentByPagination with new limit:
    FetchAllStudentByPagination(1, value, filters.CenterFilter || "");
  };

  // table headers (based on activeView)
  const headers =
    activeView === "wallet-approved" ||
    activeView === "wallet-pending" ||
    activeView === "wallet-rejected"
      ? [
          "Center Name",
          "Wallet Method",
          "Recharge Date",
          "Bank Name",
          "Transaction Id",
          "Wallet Amount",
          "Wallet Status",
          "Wallet Proof Photo",
          "Actions",
        ]
      : [
          "Sr No",
          "Student Name",
          "Admission Type",
          "Admission Session",
          "Payable Amount",
          "Status",
        ];

  // UI: header bar & actions similar to AdminDepartments
  return (
    <>
      <section
        className="mt-2 mx-2 rounded-lg"
        style={{ background: "var(--color-bg)" }}
      >
        {/* Top header bar */}
        <div
          className="w-full h-16 flex items-center justify-between px-6 rounded-lg"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--soft-shadow)",
            borderRadius: "var(--card-radius)",
          }}
        >
          <div
            className="text-base font-bold"
            style={{ color: "var(--brand-ink)" }}
          >
            Center Ledger
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-full text-sm font-semibold transition-transform"
              style={{
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.06)",
                color: "var(--brand-ink)",
              }}
              onClick={() => {
                // placeholder for export download implementation
                toast("Download triggered (implement export).");
              }}
            >
              Download
            </button>

            {/* Primary create/add wallet button */}
            <button
              type="button"
              onClick={HandleOpenAddWallet}
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "var(--accent-mint)",
                color: "var(--brand-ink)",
                boxShadow: "var(--soft-shadow)",
              }}
            >
              Add Wallet
            </button>
          </div>
        </div>

        {/* content card */}
        <section>
          <div
            className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden mt-4"
            style={{ borderRadius: "var(--card-radius)" }}
          >
            {/* Filters area */}
            <div className="px-4 py-3 border-b flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex-1 w-full md:max-w-2xl">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs">Centers</label>
                    <select
                      id="CenterFilter"
                      name="CenterFilter"
                      value={filters.CenterFilter}
                      onChange={HandleInputChange}
                      className={`mt-1 block w-full rounded border px-2 py-1 text-sm bg-white dark:bg-gray-700`}
                    >
                      <option value="">Choose Center</option>
                      {UserLoggedGetDataFromRedux?.role !== "center" &&
                        (Center?.length ? (
                          Center.filter((data) =>
                            data?.allotedUniversities?.some(
                              (university) =>
                                university?._id ===
                                  UniversityGetDataFromRedux?.id &&
                                !data?.isDeleted
                            )
                          ).map((data, i) => (
                            <option key={i} value={data?.name}>
                              {data?.name}
                            </option>
                          ))
                        ) : (
                          <option value="">Not Found</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs">Admission Sessions</label>
                    <select
                      id="AdmissionFilter"
                      name="AdmissionFilter"
                      value={filters.AdmissionFilter}
                      onChange={HandleInputChange}
                      className="mt-1 block w-full rounded border px-2 py-1 text-sm bg-white dark:bg-gray-700"
                    >
                      <option value="">Select</option>
                      {AdmissionsessionListData?.filter(
                        (s) => !s?.isDeleted
                      ).map((s, i) => (
                        <option key={i} value={s?.name}>
                          {s?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFilters({
                          CenterFilter: "",
                          AdmissionFilter: "",
                          ExamFilter: "",
                        })
                      }
                      className="px-3 py-1.5 rounded border text-sm"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={HandleFilterList}
                      className="px-3 py-1.5 rounded bg-[var(--color-purple)] text-white text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Wallet status / quick stats area */}
            <div className="px-4 py-4 border-b">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={HandleFreshStudentsButton}
                    className={`px-4 py-1.5 text-xs text-gray-900 bg-white border ${
                      activeView === "fresh" ? "bg-yellow-300" : ""
                    }`}
                  >
                    Fresh Students - {AllCenterPayments}
                  </button>
                  <button
                    onClick={HandlePendingButton}
                    className={`px-4 py-1.5 text-xs text-gray-900 bg-white border ${
                      activeView === "pending" ? "bg-yellow-300" : ""
                    }`}
                  >
                    Pending - {PendingNotpaid}
                  </button>
                  <button
                    onClick={HandleProcessedButton}
                    className={`px-4 py-1.5 text-xs text-gray-900 bg-white border ${
                      activeView === "processed" ? "bg-yellow-300" : ""
                    }`}
                  >
                    Processed - {ApprovedCenterPayments}
                  </button>
                </div>

                {(LoggedUserData?.role === "Admin" ||
                  LoggedUserData?.role === "Accountant") && (
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={HandlePendingWalletList}
                      className={`px-3 py-1.5 text-xs border ${
                        activeView === "wallet-pending" ? "bg-yellow-300" : ""
                      }`}
                    >
                      Pending Wallet - {PendingWalletListWithFilter}
                    </button>
                    <button
                      onClick={HandleRejectedWalletList}
                      className={`px-3 py-1.5 text-xs border ${
                        activeView === "wallet-rejected" ? "bg-yellow-300" : ""
                      }`}
                    >
                      Rejected Wallet - {RejectedWalletListWithFilter}
                    </button>
                    <button
                      onClick={HandleApprovedWalletList}
                      className={`px-3 py-1.5 text-xs border ${
                        activeView === "wallet-approved" ? "bg-yellow-300" : ""
                      }`}
                    >
                      Approved Wallet - {ApprovedWalletListWithFilter}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Table area */}
            <div
              className={`overflow-auto pb-2.5 px-2 h-[calc(100vh-320px)] min-h-[30px] `}
              // style={{ height: "calc(100vh - 360px)" }}
            >
              <div className="flex justify-center items-center">
                <table className="min-w-full text-base text-left text-slate-900">
                  <thead className="text-xs sticky top-0 p-10 text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      {headers.map((header) => (
                        <th
                          scope="col"
                          className="px-4 py-1.5 whitespace-nowrap"
                          key={header}
                        >
                          <div className="flex gap-3 flex-row">
                            <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {header}
                            </h1>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Body branches */}
                  {activeView === "fresh" ? (
                    <FreshStudents
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                      PaymentLoading={PaymentLoading}
                      PaymentError={PaymentError}
                      Payment={Payment}
                      GetAllPaymentData={GetAllPaymentData}
                    />
                  ) : activeView === "re-register" ? (
                    <Re_Reg_Students />
                  ) : activeView === "processed" ? (
                    <Processed
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                      PaymentLoading={PaymentLoading}
                      PaymentError={PaymentError}
                      Payment={Payment}
                      GetAllPaymentData={GetAllPaymentData}
                    />
                  ) : activeView === "pending" ? (
                    <ListOf_Pending
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                      PaymentLoading={PaymentLoading}
                      PaymentError={PaymentError}
                      Payment={Payment}
                      GetAllPaymentData={GetAllPaymentData}
                    />
                  ) : activeView === "filter" ? (
                    <FilterList />
                  ) : activeView === "wallet-approved" ? (
                    <ListOf_ApprovedWalletList
                      setRefreshForWallet={setRefreshForWallet}
                      UpdatedWalletData={updatedWalletData}
                      UpdatedWalletLoading={updatedWalletLoading}
                      LoggedUserData={LoggedUserData}
                    />
                  ) : activeView === "wallet-pending" ? (
                    <ListOf_PendingWallets
                      setRefreshForWallet={setRefreshForWallet}
                      UpdatedWalletData={updatedWalletData}
                      UpdatedWalletLoading={updatedWalletLoading}
                      LoggedUserData={LoggedUserData}
                    />
                  ) : activeView === "wallet-rejected" ? (
                    <ListOf_RejectedWalletList
                      setRefreshForWallet={setRefreshForWallet}
                      UpdatedWalletData={updatedWalletData}
                      LoggedUserData={LoggedUserData}
                      UpdatedWalletLoading={updatedWalletLoading}
                    />
                  ) : (
                    <tbody>
                      <tr>
                        <td
                          colSpan={headers.length}
                          className="p-8 text-center"
                        >
                          <span className="text-lg tracking-wider font-bold">
                            Not Found
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>

            {/* Pagination / footer area */}
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {AllStudentListData?.length || 0} of{" "}
                {AllStudentTotalDocs || 0}
              </div>

              <div className="flex items-center gap-3">
                <select
                  onChange={handleLimitChange}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={6}>6</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>

                <button
                  onClick={() =>
                    handlePageChangeSafe(Math.max(1, AllStudentCurrentPage - 1))
                  }
                  className="px-3 py-1 rounded border"
                >
                  <IoChevronBack />
                </button>

                <div className="text-sm">
                  Page {AllStudentCurrentPage} / {AllStudentTotalPages || 1}
                </div>

                <button
                  onClick={() =>
                    handlePageChangeSafe(
                      Math.min(
                        AllStudentTotalPages || 1,
                        AllStudentCurrentPage + 1
                      )
                    )
                  }
                  className="px-3 py-1 rounded border"
                >
                  <IoChevronForwardOutline />
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>

      {openAddWallet && (
        <CreateWallet
          HandleCloseAddWallet={HandleCloseAddWallet}
          GetLoggedUserLoader={GetLoggedUserLoader}
          GetLoginUserDetails={GetLoginUserDetails}
          LoggedUserData={LoggedUserData}
        />
      )}
    </>
  );
};

export default AdminCenterLedger;
