import React, { useEffect, useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdCancel, MdDelete } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import UpdateOfflinePayment from "./UpdateOfflinePayment";
import PreviewImage from "../../../../Helper/PreviewImage";
import Loader from "../../../../Helper/Loader";
import UseGetAllStudents from "../../../../CustomHooks/UseGetStudentsPagination";

const ListOfOflinePayments = ({
  PaymentLoading,
  PaymentError,
  Payment,
  GetAllPaymentData,
}) => {
  const [approveLoading, setApproveLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

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

  useEffect(() => {
    FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
    // eslint-disable-next-line
  }, [AllStudentCurrentPage, AllStudentLimit]);

  const currentUser = useSelector((state) => state?.user);

  const handlePreview = (data) => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    setTimeout(() => {
      setPreviewData(data);
      setPreviewLoading(false);
    }, 400);
  };

  const handleEditOpen = (data) => {
    setPaymentToEdit(data);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setPaymentToEdit(null);
  };

  const handleApprove = async (data) => {
    if (!data?._id) return toast.error("Payment ID missing");
    const confirm = await Swal.fire({
      title: "Do you want to approve this payment?",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      icon: "question",
    });
    if (!confirm.isConfirmed) return Swal.fire("Action canceled", "", "info");

    try {
      setApproveLoading(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/approve-payment/${data?._id}`,
        {},
        { withCredentials: true },
      );
      if (res?.data?.success) {
        Swal.fire(res.data.message || "Payment approved", "", "success");
        GetAllPaymentData();
      } else {
        toast.error(res?.data?.message || "Failed to approve");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async (data) => {
    if (!data?._id) return toast.error("Payment ID missing");
    const confirm = await Swal.fire({
      title: "Do you want to reject this payment?",
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      icon: "question",
    });
    if (!confirm.isConfirmed) return Swal.fire("Action canceled", "", "info");

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/reject-payment`,
        { paymentid: data?._id },
        { withCredentials: true },
      );
      if (res?.data?.success) {
        Swal.fire(res.data.message || "Payment rejected", "", "success");
        GetAllPaymentData();
      } else {
        toast.error(res?.data?.message || "Failed to reject");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = (data) => {
    // keep placeholder for your delete implementation
    toast("Delete handler - implement if needed.");
  };

  // filter payments for display same as original criteria
  const rows =
    Payment?.filter((d) => {
      const hasBasicData =
        d?.paymentStatus && d?.transactionId && d?.paymentAmount && d?.BankName;

      const isStudentApproved = d?.studentId?.status?.TrackStatus === "4";

      const isLead = !!d?.leadStudentId; // 🔥 THIS IS KEY

      return hasBasicData && (isStudentApproved || isLead);
    }) || [];
  return (
    <>
      {PaymentLoading ? (
        <tbody>
          <tr>
            <td colSpan={16} className="p-8 text-center">
              <Loader />
            </td>
          </tr>
        </tbody>
      ) : rows.length === 0 ? (
        <tbody>
          <tr>
            <td colSpan={16} className="p-8 text-center text-sm text-gray-500">
              No records found
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody className="text-xs">
          {rows.map((data, i) => {
            const student = data?.studentId || data?.leadStudentId;

            const centerName =
              student?.center?.name ||
              student?.whoCreated?.centerName ||
              student?.whoCreated?.name ||
              "N/A";

            const studentName =
              student?.fullName ||
              `${student?.FirstName || ""} ${student?.LastName || ""}`;

            const key = data._id || `${i}`;
            const amount = data?.paymentAmount ?? "0";
            const discount = data?.DiscountAmount ?? "0";
            const finalAmount = data?.FinalAmount ?? amount;

            return (
              <tr
                key={key}
                className="bg-white dark:bg-slate-900 dark:text-white border-b last:border-b-0"
              >
                {/* Sr */}
                <td className="px-3 py-2 text-center w-8">{i + 1}</td>

                {/* Center / creator */}
                <td className="px-3 py-2">
                  {data?.createdByRole === "Center" ? (
                    <>
                      <div className="font-semibold">{centerName}</div>
                      <div className="text-xs text-gray-500">
                        {student?.center?.code || student?.whoCreated?.code}
                      </div>
                    </>
                  ) : (
                    <div className="font-semibold">Admin</div>
                  )}
                </td>

                {/* Student */}
                <td className="px-3 py-2">
                  <div className="font-semibold">{studentName}</div>
                </td>

                {/* Proof */}
                <td className="px-2 py-2">
                  <button
                    onClick={() => handlePreview(data)}
                    aria-label="Preview proof"
                  >
                    <img
                      src={data?.ProofPhoto}
                      alt="proof"
                      className="w-24 h-16 object-cover border"
                    />
                  </button>
                </td>

                {/* Transaction */}
                <td className="px-3 py-2">
                  <div className="font-semibold uppercase">
                    {data?.transactionId}
                  </div>
                </td>

                {/* Mode */}
                <td className="px-3 py-2">
                  <div className="font-semibold uppercase">
                    {data?.paymentMethod}
                  </div>
                </td>

                {/* Bank */}
                <td className="px-3 py-2">
                  <div className="font-semibold">{data?.BankName}</div>
                </td>

                {/* Amounts */}
                <td className="px-3 py-2 text-right font-bold">₹ {amount}</td>
                <td className="px-3 py-2 text-right">₹ {discount}</td>
                <td className="px-3 py-2 text-right font-bold">
                  ₹ {finalAmount}
                </td>

                {/* By */}
                <td className="px-3 py-2">
                  <div className="font-medium">
                    {data?.createdByPayment?.name}
                  </div>
                </td>

                {/* Date */}
                <td className="px-3 py-2">{data?.paymentDate}</td>

                {/* Remark */}
                <td className="px-3 py-2 max-w-xs truncate">
                  {data?.paymentRemark}
                </td>

                {/* Status */}
                <td className="px-3 py-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      data?.paymentStatus === "approved"
                        ? "bg-green-100 text-green-800"
                        : data?.paymentStatus === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {data?.paymentStatus}
                  </span>
                </td>

                {/* Actions (admin/accountant only) */}
                <td className="px-3 py-2">
                  {(currentUser?.role === "Admin" ||
                    currentUser?.role === "Accountant") && (
                    <div className="flex items-center gap-2">
                      {data?.paymentStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(data)}
                            title="Approve"
                            className="p-1 hover:opacity-90"
                            aria-label="Approve payment"
                          >
                            <FcApproval size={18} />
                          </button>

                          <button
                            onClick={() => handleReject(data)}
                            title="Reject"
                            className="p-1 text-red-600 hover:opacity-90"
                            aria-label="Reject payment"
                          >
                            <MdCancel size={18} />
                          </button>

                          <button
                            onClick={() => handleEditOpen(data)}
                            title="Edit payment"
                            className="p-1 text-slate-700 hover:opacity-90"
                            aria-label="Edit payment"
                          >
                            <AiTwotoneEdit size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(data)}
                            title="Delete payment"
                            className="p-1 text-red-600 hover:opacity-90"
                            aria-label="Delete payment"
                          >
                            <MdDelete size={18} />
                          </button>
                        </>
                      )}

                      {data?.paymentStatus === "rejected" && (
                        <>
                          <button
                            onClick={() => handleApprove(data)}
                            title="Approve"
                            className="p-1"
                          >
                            <FcApproval size={18} />
                          </button>
                          <button
                            onClick={() => handleEditOpen(data)}
                            title="Edit"
                            className="p-1"
                          >
                            <AiTwotoneEdit size={18} />
                          </button>
                        </>
                      )}
                      {/* approved -> no actions */}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      )}

      {/* Edit modal */}
      {editOpen && paymentToEdit && (
        <UpdateOfflinePayment
          PaymentDataById={paymentToEdit}
          HandleEditPaymentClose={handleEditClose}
          GetAllPaymentData={GetAllPaymentData}
        />
      )}

      {/* Preview modal */}
      {previewOpen && previewData && (
        <PreviewImage
          HandlePreviewImageToggle={previewOpen}
          setHandlePreviewImageToggle={setPreviewOpen}
          HandlePreviewImageDataParams={previewData}
          HandlePreviewImageLoader={previewLoading}
        />
      )}
    </>
  );
};

export default ListOfOflinePayments;
