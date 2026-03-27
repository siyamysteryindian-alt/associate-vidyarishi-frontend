import React, { useEffect, useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdCancel, MdDelete } from "react-icons/md";
import image from "../../../../../public/logo.jpg";
import { FcApproval } from "react-icons/fc";
import { useSelector } from "react-redux";
import Loader from "../../../../Helper/Loader";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";

const ListOf_Processed = ({
  FetchAllStudentByPagination,
  handlePageChange,
  AllStudentListData = [],
  AllStudentCurrentPage = 1,
  AllStudentTotalPages = 1,
  AllStudentLimit,
  AllStudentLoading = false,
  AllStudentTotalDocs = 0,
}) => {
  const ReduxUserLoggedIn = useSelector((state) => state.user);

  // Open Payment Data
  const [OpenPaymentWindowOffline, setOpenPaymentWindowOffline] =
    useState(false);
  const [StudentDetails, setStudentDetails] = useState(null);

  const HandleOnClickPayPaymentOpen = (data) => {
    setOpenPaymentWindowOffline(true);
    setStudentDetails(data);
  };

  const HandleOnClickPayPaymentClose = () => {
    setOpenPaymentWindowOffline(false);
  };

  // approved rows derived from props (stable)
  const approvedRows = (AllStudentListData || []).filter(
    (item) => item?.payments?.paymentStatus === "approved"
  );

  // optional refresh hook kept out as original — add if needed
  useEffect(() => {
    // placeholder if you want to trigger fetch on mount/refresh
    // FetchAllStudentByPagination?.(AllStudentCurrentPage, AllStudentLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Loader row compatible with parent table header */}
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
      ) : approvedRows.length === 0 ? (
        <tbody>
          <tr>
            <td
              colSpan={7}
              className="px-4 py-8 text-center text-sm text-gray-500"
            >
              No approved students found.
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody className="text-sm">
          {approvedRows.map((data, i) => {
            const key = data?._id ?? `${data?.fullName ?? "approved"}-${i}`;
            const fee = data?.SubCourse?.admissionFeeId?.feeAmount ?? "-";
            const paymentStatus = data?.payments?.paymentStatus ?? "";
            const displayStatus =
              paymentStatus === "approved"
                ? "Approved"
                : paymentStatus === "pending"
                ? "Pending"
                : paymentStatus === "rejected"
                ? "Rejected"
                : "—";

            return (
              <tr
                key={key}
                className="bg-white dark:bg-slate-900 dark:text-white text-sm border-b"
              >
                {/* SR NO */}
                <th
                  scope="row"
                  className="px-4 py-1.5 whitespace-nowrap align-top text-sm font-medium text-gray-900 dark:text-white"
                >
                  {i + 1}
                </th>

                {/* STUDENT name */}
                <td className="px-4 py-1.5 align-top">
                  <div className="font-semibold text-sm truncate">
                    {data?.fullName || "—"}
                  </div>
                </td>

                {/* admission type */}
                <td className="px-4 py-1.5 align-top">
                  <div className="text-sm truncate">
                    {data?.admissionType?.name || "—"}
                  </div>
                </td>

                {/* admission session */}
                <td className="px-4 py-1.5 align-top">
                  <div className="text-sm truncate">
                    {data?.admissionSession?.name || "—"}
                  </div>
                </td>

                {/* fee amount */}
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
                        : displayStatus === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                    aria-label={`Payment status ${displayStatus}`}
                  >
                    {displayStatus}
                  </span>
                </td>

                {/* Action (kept same access rules as original) */}
                <td className="px-4 py-1.5 align-top text-sm">
                  {(ReduxUserLoggedIn?.role === "Admin" ||
                    ReduxUserLoggedIn?.role === "Accountant") &&
                    data?.payments?.paymentStatus !== "approved" &&
                    data?.payments?.paymentStatus !== "pending" &&
                    data?.payments?.studentId === data?._id && (
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


      {/* Not-found fallback (kept from original) */}
      {approvedRows?.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-500">Not Found</div>
      )}
    </>
  );
};

export default ListOf_Processed;
