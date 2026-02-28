import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import uploadFile from "../../../../Helper/UploadFile";
import { useSelector } from "react-redux";

/**
 * UpdateOfflinePayment (refactor)
 * - Kept existing API / prop contract
 * - Improved responsiveness, accessibility, spacing, and minor UX (submit loader)
 * - Handles file upload using your uploadFile helper
 */

const UpdateOfflinePayment = ({
  PaymentDataById,
  HandleEditPaymentClose,
  GetAllPaymentData,
}) => {
  const [UpdatePaymentWindowData, setUpdatePaymentWindowData] = useState({
    studentId: PaymentDataById?.studentId?._id ?? "",
    PaymentType: PaymentDataById?.paymentMethod ?? "",
    BankName: PaymentDataById?.BankName ?? "",
    TransactionId: PaymentDataById?.transactionId ?? "",
    Amount: PaymentDataById?.paymentAmount ?? "",
    Date: PaymentDataById?.paymentDate
      ? PaymentDataById?.paymentDate.split?.("T")?.[0] ??
        PaymentDataById?.paymentDate
      : "",
    Photo: PaymentDataById?.ProofPhoto ?? "",
    paymentMark: PaymentDataById?.paymentRemark ?? "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Keep the local state in sync when PaymentDataById changes
    setUpdatePaymentWindowData({
      studentId: PaymentDataById?.studentId?._id ?? "",
      PaymentType: PaymentDataById?.paymentMethod ?? "",
      BankName: PaymentDataById?.BankName ?? "",
      TransactionId: PaymentDataById?.transactionId ?? "",
      Amount: PaymentDataById?.paymentAmount ?? "",
      Date: PaymentDataById?.paymentDate
        ? PaymentDataById?.paymentDate.split?.("T")?.[0] ??
          PaymentDataById?.paymentDate
        : "",
      Photo: PaymentDataById?.ProofPhoto ?? "",
      paymentMark: PaymentDataById?.paymentRemark ?? "",
    });
  }, [PaymentDataById]);

  const HandleInputData = (e) => {
    const { name, value, files } = e.target;
    setUpdatePaymentWindowData((prev) => ({
      ...prev,
      [name]: files && files[0] ? files[0] : value,
    }));
  };

  const HandleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const response = await uploadFile(file);
      setUpdatePaymentWindowData((prev) => ({
        ...prev,
        Photo: response?.url ?? prev.Photo,
      }));
    } catch (err) {
      toast.error("Photo upload failed. Try again.");
    }
  };

  const LoggedUserDataFromRedux = useSelector((state) => state?.user);

  const HandleUpdatePaymentEditData = async (e) => {
    e.preventDefault();
    // basic validation
    if (
      !UpdatePaymentWindowData?.PaymentType ||
      !UpdatePaymentWindowData?.BankName ||
      !UpdatePaymentWindowData?.TransactionId ||
      !UpdatePaymentWindowData?.Date
    ) {
      toast.error("Please fill required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/edit-payment-offline-in-payment`,
        {
          PaymentDataById: PaymentDataById?._id,
          StudentId: UpdatePaymentWindowData?.studentId,
          PaymentDate: UpdatePaymentWindowData.Date,
          Amount: UpdatePaymentWindowData?.Amount,
          BankName: UpdatePaymentWindowData?.BankName,
          PaymentType: UpdatePaymentWindowData?.PaymentType,
          TransactionId: UpdatePaymentWindowData?.TransactionId,
          Photo: UpdatePaymentWindowData?.Photo,
          paymentRemark: UpdatePaymentWindowData?.paymentMark,
        },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(
          response?.data?.message || "Payment updated successfully"
        );
        GetAllPaymentData?.();
        HandleEditPaymentClose?.();
      } else {
        toast.error(response?.data?.message || "Failed to update payment");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const [requiredMsg, setRequiredMsg] = useState({
    PaymentType: false,
    BankName: false,
    TransactionId: false,
    Date: false,
    Photo: false,
  });

  const validationFunc = () => {
    setRequiredMsg({
      PaymentType: UpdatePaymentWindowData?.PaymentType === "",
      BankName: UpdatePaymentWindowData?.BankName === "",
      TransactionId: UpdatePaymentWindowData?.TransactionId === "",
      Date: UpdatePaymentWindowData?.Date === "",
      Photo: UpdatePaymentWindowData?.Photo === "",
    });
  };

  useEffect(() => {
    validationFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UpdatePaymentWindowData]);

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-3xl mx-auto bg-slate-50 dark:bg-slate-900 rounded-lg shadow-lg overflow-auto"
        style={{ maxHeight: "92vh" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-slate-700 bg-slate-200 dark:bg-slate-800 rounded-t-lg">
          <div>
            <h1 className="text-lg font-semibold">Update Payment</h1>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Student:{" "}
              <span className="font-medium">
                {PaymentDataById?.studentId?.fullName}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Close"
              onClick={HandleEditPaymentClose}
              className="text-red-600 hover:text-red-700 font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={HandleUpdatePaymentEditData} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="PaymentType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Payment Type <span className="text-red-500">*</span>
              </label>
              <select
                id="PaymentType"
                name="PaymentType"
                onChange={HandleInputData}
                value={UpdatePaymentWindowData?.PaymentType}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-700 ${
                  requiredMsg.PaymentType ? "outline-red-500" : "outline-none"
                }`}
                required
                aria-required="true"
              >
                <option value="">Select</option>
                {[
                  "credit_card",
                  "debit_card",
                  "net_banking",
                  "cash",
                  "upi",
                ].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="BankName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                id="BankName"
                name="BankName"
                type="text"
                onChange={HandleInputData}
                value={UpdatePaymentWindowData?.BankName}
                placeholder="Ex: Union Bank"
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-700 ${
                  requiredMsg.BankName ? "outline-red-500" : "outline-none"
                }`}
                required
                aria-required="true"
              />
            </div>

            <div>
              <label
                htmlFor="TransactionId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                id="TransactionId"
                name="TransactionId"
                type="text"
                onChange={HandleInputData}
                value={UpdatePaymentWindowData?.TransactionId}
                placeholder="Ex: AXBD********"
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-700 ${
                  requiredMsg.TransactionId ? "outline-red-500" : "outline-none"
                }`}
                required
                aria-required="true"
              />
            </div>

            <div>
              <label
                htmlFor="Amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Amount
              </label>
              <input
                id="Amount"
                name="Amount"
                type="number"
                onChange={HandleInputData}
                value={UpdatePaymentWindowData?.Amount}
                className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-700"
              />
            </div>

            <div>
              <label
                htmlFor="Date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Date <span className="text-red-500">*</span>
              </label>
              <input
                id="Date"
                name="Date"
                type="date"
                onChange={HandleInputData}
                value={UpdatePaymentWindowData?.Date ?? ""}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-700 ${
                  requiredMsg.Date ? "outline-red-500" : "outline-none"
                }`}
                required
                aria-required="true"
              />
            </div>

            <div>
              <label
                htmlFor="Photo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Photo <span className="text-red-500">*</span>
              </label>
              <input
                id="Photo"
                name="Photo"
                type="file"
                accept="image/*"
                onChange={HandleUploadPhoto}
                className={`mt-1 block w-full text-sm text-gray-700 dark:text-gray-200`}
                aria-describedby="photo-help"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="paymentRemark2"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Payment Remark
              </label>
              <input
                id="paymentRemark2"
                name="paymentMark"
                type="text"
                onChange={HandleInputData}
                value={UpdatePaymentWindowData?.paymentMark}
                className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-700"
              />
            </div>
          </div>

          {UpdatePaymentWindowData?.Photo ? (
            <div className="flex items-start gap-4">
              <div className="w-40 h-24 rounded-lg overflow-hidden border">
                <img
                  src={UpdatePaymentWindowData?.Photo}
                  alt="Proof uploaded"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Preview of the uploaded proof. Upload a new file to replace.
              </div>
            </div>
          ) : null}

          <div className="flex justify-end items-center gap-3 pt-2">
            <button
              type="button"
              onClick={HandleEditPaymentClose}
              className="px-4 py-2 rounded-lg border text-sm bg-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateOfflinePayment;
