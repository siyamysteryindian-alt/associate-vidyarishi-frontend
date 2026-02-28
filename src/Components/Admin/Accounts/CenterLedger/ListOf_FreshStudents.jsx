import React, { useEffect, useState } from "react";
import { FcApproval } from "react-icons/fc";
import { useSelector } from "react-redux";
import OfflinepayWindow from "./OfflinepayWindow";
import Loader from "../../../../Helper/Loader";

/**
 * Minimal in-place update so this component aligns with AdminCenterLedger table
 * - returns <tbody> only (keeps parent table intact)
 * - stable keys, loader + empty state rows compatible with sticky header
 * - cell paddings and font sizes match parent table's utilities
 */

const ListOf_FreshStudents = ({
  FetchAllStudentByPagination,
  handlePageChange,
  AllStudentListData = [],
  AllStudentCurrentPage = 1,
  AllStudentTotalPages = 1,
  AllStudentLimit,
  AllStudentLoading = false,
  AllStudentTotalDocs = 0,
}) => {
  const [Refresh, setRefresh] = useState(false);
  const [OpenPaymentWindowOffline, setOpenPaymentWindowOffline] =
    useState(false);
  const [StudentDetails, setStudentDetails] = useState(null);

  const ReduxUserLoggedIn = useSelector((state) => state.user);

  useEffect(() => {
    if (Refresh) {
      // call parent fetch (keeps original contract)
      FetchAllStudentByPagination?.(AllStudentCurrentPage, AllStudentLimit);
      setRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Refresh]);

  const HandleOnClickPayPaymentOpen = (data) => {
    setStudentDetails(data);
    setOpenPaymentWindowOffline(true);
  };

  const HandleOnClickPayPaymentClose = () => {
    setOpenPaymentWindowOffline(false);
  };

  // same filter as before (keeps your logic)
  const rows = (AllStudentListData || []).filter(
    (data) =>
      data?.SubCourse?.admissionFeeId?.feeAmount &&
      data?.payments?.paymentStatus !== "pending" &&
      data?.payments?.paymentStatus !== "approved"
  );

  // --- render tbody only so it aligns with AdminCenterLedger's table ---
  return (
    <>
      {/* loader row — compatible with sticky header and table layout */}
      {AllStudentLoading ? (
        <tbody>
          <tr>
            <td colSpan={7} className="px-4 py-8">
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            </td>
          </tr>
        </tbody>
      ) : rows.length === 0 ? (
        <tbody>
          <tr>
            <td
              colSpan={7}
              className="px-4 py-8 text-center text-sm text-gray-500"
            >
              No records found
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody className="text-sm">
          {rows.map((data, idx) => {
            const key = data?._id ?? `${data?.fullName ?? "student"}-${idx}`;
            const fee = data?.SubCourse?.admissionFeeId?.feeAmount ?? "-";
            const paymentStatus = data?.payments?.paymentStatus ?? "";
            const displayStatus =
              paymentStatus === "approved"
                ? "Approved"
                : paymentStatus === "pending"
                ? "Pending"
                : paymentStatus === "rejected"
                ? "Rejected"
                : "Not Paid";

            return (
              <tr
                key={key}
                className="bg-white dark:bg-gray-800 dark:text-white text-sm border-b"
              >
                {/* Sr No */}
                <th
                  scope="row"
                  className="px-4 py-1.5 whitespace-nowrap align-top text-sm font-medium text-gray-900 dark:text-white"
                >
                  {idx + 1}
                </th>

                {/* Student name */}
                <td className="px-4 py-1.5 align-top">
                  <div className="font-semibold text-sm truncate">
                    {data?.fullName || "—"}
                  </div>
                </td>

                {/* Admission type */}
                <td className="px-4 py-1.5 align-top">
                  <div className="text-sm truncate">
                    {data?.admissionType?.name || "—"}
                  </div>
                </td>

                {/* Admission session */}
                <td className="px-4 py-1.5 align-top">
                  <div className="text-sm truncate">
                    {data?.admissionSession?.name || "—"}
                  </div>
                </td>

                {/* Fee amount */}
                <td className="px-4 py-1.5 align-top text-sm font-semibold">
                  ₹ {fee}
                </td>

                {/* Status */}
                <td className="px-4 py-1.5 align-top text-sm">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                      displayStatus === "Approved"
                        ? "bg-green-100 text-green-800"
                        : displayStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                    aria-label={`Payment status ${displayStatus}`}
                  >
                    {displayStatus}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-1.5 align-top text-sm">
                  {(ReduxUserLoggedIn?.role === "Admin" ||
                    ReduxUserLoggedIn?.role === "Accountant" ||
                    ReduxUserLoggedIn?.role === "center" ||
                    ReduxUserLoggedIn?.role === "subCenter") && (
                    <button
                      onClick={() => HandleOnClickPayPaymentOpen(data)}
                      title="Pay Offline"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-md shadow-sm hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-green-300"
                      aria-label={`Pay for ${data?.fullName}`}
                    >
                      <FcApproval size={18} />
                      <span className="text-sm font-medium">Pay</span>
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      )}

      {/* Offline payment modal */}
      {OpenPaymentWindowOffline && (
        <OfflinepayWindow
          Refresh={Refresh}
          setRefresh={setRefresh}
          StudentDetails={StudentDetails}
          HandleOnClickPayPaymentClose={HandleOnClickPayPaymentClose}
        />
      )}
    </>
  );
};

export default ListOf_FreshStudents;
