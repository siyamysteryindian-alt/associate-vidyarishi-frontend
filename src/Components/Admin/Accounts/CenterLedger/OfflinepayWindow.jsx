import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import uploadFile from "../../../../Helper/UploadFile";
import { useSelector } from "react-redux";
import UsePaymentData from "../../../../CustomHooks/UsePaymentData";
import UseGetAllStudents from "../../../../CustomHooks/UseGetStudentsPagination";

const OfflinepayWindow = ({
  StudentDetails,
  HandleOnClickPayPaymentClose,
  Refresh,
  setRefresh,
}) => {
  const [UpdatePaymentWindowData, setUpdatePaymentWindowData] = useState({
    studentId: StudentDetails?._id,
    PaymentType: "",
    BankName: "",
    TransactionId: "",
    Amount: StudentDetails?.SubCourse?.admissionFeeId?.feeAmount,
    Date: "",
    Photo: "",
    DiscountAmount: "",
    FinalAmount: "",
    CenterPercentage: "",
  });

  const calculateDiscount = (originalPrice, discount, type = "percent") => {
    if (!originalPrice || originalPrice <= 0) {
      return { finalPrice: 0, discountAmount: 0 };
    }

    let finalPrice = originalPrice;
    let discountAmount = 0;

    if (type === "percent") {
      discountAmount = (originalPrice * discount) / 100;
      finalPrice = originalPrice - discountAmount;
    } else if (type === "flat") {
      discountAmount = discount;
      finalPrice = originalPrice - discountAmount;
    }

    if (finalPrice < 0) finalPrice = 0;

    return {
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
    };
  };

  const HandleInputData = (e) => {
    const { name, value, files } = e.target;

    // If CenterPercentage is being updated
    if (name === "CenterPercentage") {
      const { finalPrice, discountAmount } = calculateDiscount(
        UpdatePaymentWindowData.Amount,
        value || 0, // percentage value
        "percent"
      );

      setUpdatePaymentWindowData((prev) => ({
        ...prev,
        CenterPercentage: value,
        DiscountAmount: discountAmount,
        FinalAmount: finalPrice,
      }));
    } else {
      setUpdatePaymentWindowData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const HandleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const response = await uploadFile(file);
      setUpdatePaymentWindowData((Preve) => {
        return {
          ...Preve,
          Photo: response?.url,
        };
      });
    } catch (err) {
      toast.error("Upload failed. Try again.");
    }
  };

  const LoggedUserDataFromRedux = useSelector((state) => state?.user);
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

  const HandleUpdatePaymentWindowData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/update-payment-in-student`,
        {
          StudentId: UpdatePaymentWindowData.studentId,
          PaymentDate: UpdatePaymentWindowData.Date,
          Amount: UpdatePaymentWindowData.Amount,
          BankName: UpdatePaymentWindowData.BankName,
          PaymentType: UpdatePaymentWindowData.PaymentType,
          TransactionId: UpdatePaymentWindowData.TransactionId,
          Photo: UpdatePaymentWindowData.Photo,
          createdByPayment: LoggedUserDataFromRedux?.id,
          paymentRemark: "",
          DiscountAmount: UpdatePaymentWindowData.DiscountAmount,
          FinalAmount: UpdatePaymentWindowData.FinalAmount,
          CenterPercentage: UpdatePaymentWindowData.CenterPercentage,
        },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(
          response?.data?.message || "Payment updated successfully"
        );
        GetAllPaymentData();
        HandleOnClickPayPaymentClose();
        setRefresh(true);
        FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
      } else {
        toast.error(response?.data?.message || "Failed to update payment");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  useEffect(() => {
    FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
    // eslint-disable-next-line
  }, [AllStudentCurrentPage, AllStudentLimit]);

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
  }, [UpdatePaymentWindowData]);

  return (
    <>
      <section className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/60 overflow-auto">
        <div className="bg-white dark:bg-slate-900 dark:text-white border border-slate-400 rounded-2xl w-full max-w-3xl px-5 py-4 my-8">
          <div className="mb-4 px-4 py-2.5 rounded-xl flex items-start md:items-center justify-between bg-white dark:bg-slate-800">
            <div>
              <h1 className="text-lg font-bold">Make Payment</h1>
            </div>
            <button
              aria-label="Close Update PaymentWindow Modal"
              onClick={HandleOnClickPayPaymentClose}
              className="px-2 text-xl font-bold text-red-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={HandleUpdatePaymentWindowData}>
            {/* responsive grid: 1 column on small, 2 cols on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="PaymentType"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Payment Type <span className="text-red-500">*</span>
                </label>

                <select
                  required
                  id="PaymentType"
                  name="PaymentType"
                  onChange={HandleInputData}
                  value={UpdatePaymentWindowData?.PaymentType}
                  className={`w-full px-2 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 ${
                    requiredMsg.PaymentType
                      ? "border-red-400"
                      : "border-gray-300"
                  } bg-white dark:bg-gray-700`}
                >
                  <option value="">Select</option>
                  {[
                    { value: "credit_card", label: "Credit Card" },
                    { value: "debit_card", label: "Debit Card" },
                    { value: "net_banking", label: "Net Banking" },
                    { value: "cash", label: "Cash" },
                    { value: "upi", label: "UPI" },
                  ].map((option, i) => (
                    <option key={i} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="BankName"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  placeholder="Ex: Union Bank, etc"
                  type="text"
                  id="BankName"
                  name="BankName"
                  onChange={HandleInputData}
                  value={UpdatePaymentWindowData?.BankName || ""}
                  className={`w-full px-2 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 ${
                    requiredMsg.BankName ? "border-red-400" : "border-gray-300"
                  } bg-white dark:bg-gray-700`}
                />
              </div>

              <div>
                <label
                  htmlFor="TransactionId"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  placeholder="Ex: AXBD********"
                  type="text"
                  id="TransactionId"
                  name="TransactionId"
                  onChange={HandleInputData}
                  value={UpdatePaymentWindowData?.TransactionId || ""}
                  className={`w-full px-2 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 ${
                    requiredMsg.TransactionId
                      ? "border-red-400"
                      : "border-gray-300"
                  } bg-white dark:bg-gray-700`}
                />
              </div>

              <div>
                <label
                  htmlFor="Amount"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  id="Amount"
                  name="Amount"
                  readOnly
                  value={UpdatePaymentWindowData?.Amount ?? ""}
                  className="w-full px-2 py-2 border rounded text-sm bg-gray-100 dark:bg-gray-800"
                />
              </div>

              <div>
                <label
                  htmlFor="CenterPercentage"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Center Percentage <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  id="CenterPercentage"
                  name="CenterPercentage"
                  onChange={HandleInputData}
                  value={UpdatePaymentWindowData?.CenterPercentage || ""}
                  className="w-full px-2 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label
                  htmlFor="DiscountAmount"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Discount Amount
                </label>
                <input
                  type="number"
                  id="DiscountAmount"
                  name="DiscountAmount"
                  readOnly
                  value={UpdatePaymentWindowData.DiscountAmount ?? ""}
                  className="w-full px-2 py-2 border rounded text-sm bg-gray-100 dark:bg-gray-800"
                />
              </div>

              <div>
                <label
                  htmlFor="FinalAmount"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Final Amount (To Pay)
                </label>
                <input
                  type="number"
                  id="FinalAmount"
                  name="FinalAmount"
                  readOnly
                  value={UpdatePaymentWindowData.FinalAmount ?? ""}
                  className="w-full px-2 py-2 border rounded text-sm bg-gray-100 dark:bg-gray-800"
                />
              </div>

              <div>
                <label
                  htmlFor="Date"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  id="Date"
                  name="Date"
                  onChange={HandleInputData}
                  value={UpdatePaymentWindowData?.Date || ""}
                  className={`w-full px-2 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 ${
                    requiredMsg.Date ? "border-red-400" : "border-gray-300"
                  } bg-white dark:bg-gray-700`}
                />
              </div>

              <div>
                <label
                  htmlFor="Photo"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Photo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="Photo"
                  name="Photo"
                  onChange={HandleUploadPhoto}
                  className={`w-full px-2 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 ${
                    requiredMsg.Photo ? "border-red-400" : "border-gray-300"
                  } bg-white dark:bg-gray-700`}
                />
              </div>
            </div>

            {/* image preview responsive */}
            {UpdatePaymentWindowData?.Photo && (
              <div className="mt-4">
                <div className="w-full md:max-w-sm border rounded-md overflow-hidden shadow-sm">
                  <img
                    src={UpdatePaymentWindowData?.Photo}
                    alt="Uploaded"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={HandleOnClickPayPaymentClose}
                className="px-4 py-2 rounded border text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded bg-green-600 text-white text-sm font-semibold"
              >
                PAYMENT
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default OfflinepayWindow;
