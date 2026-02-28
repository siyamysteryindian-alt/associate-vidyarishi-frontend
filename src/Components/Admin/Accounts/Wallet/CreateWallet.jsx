import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadFile from "../../../../Helper/UploadFile";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

const CreateWallet = ({
  HandleCloseAddWallet,
  GetLoginUserDetails,
  LoggedUserData,
}) => {
  const ReduxLoggedUser = useSelector((state) => state?.user);

  const [UpdateWalletWindowData, setUpdateWalletWindowData] = useState({
    CenterId:
      ReduxLoggedUser?.role === "center" ? ReduxLoggedUser?.id : undefined,
    walletId: LoggedUserData?.CenterWallet?._id,
    WalletAmount: LoggedUserData?.CenterWallet?.WalletAmount || "",
    WalletDate: "",
    BankName: "",
    WalletMethod: "",
    transactionId: "",
    WalletProofPhoto: "",
    createdByRole:
      (ReduxLoggedUser?.role === "center" ||
        ReduxLoggedUser?.role === "Admin") &&
      ReduxLoggedUser?.role,
    createdByWallet:
      (ReduxLoggedUser?.role === "center" ||
        ReduxLoggedUser?.role === "Admin") &&
      ReduxLoggedUser?.id,
  });

  useEffect(() => {
    // sync initial values when LoggedUserData changes (if modal opened)
    setUpdateWalletWindowData((prev) => ({
      ...prev,
      walletId: LoggedUserData?.CenterWallet?._id ?? prev.walletId,
      WalletAmount:
        LoggedUserData?.CenterWallet?.WalletAmount ?? prev.WalletAmount,
    }));
    // eslint-disable-next-line
  }, [LoggedUserData?.CenterWallet]);

  const [requiredMsg, setRequiredMsg] = useState({
    WalletAmount: false,
    WalletDate: false,
    BankName: false,
    WalletMethod: false,
    transactionId: false,
    WalletProofPhoto: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setRequiredMsg({
      WalletAmount:
        UpdateWalletWindowData?.WalletAmount === "" ||
        UpdateWalletWindowData?.WalletAmount === undefined,
      WalletMethod: UpdateWalletWindowData?.WalletMethod === "",
      BankName: UpdateWalletWindowData?.BankName === "",
      transactionId: UpdateWalletWindowData?.transactionId === "",
      WalletDate: UpdateWalletWindowData?.WalletDate === "",
      WalletProofPhoto: UpdateWalletWindowData?.WalletProofPhoto === "",
    });
  }, [UpdateWalletWindowData]);

  const HandleInputData = (e) => {
    const { name, value, files } = e.target;
    setUpdateWalletWindowData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const HandleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const response = await uploadFile(file);
      if (response?.url) {
        setUpdateWalletWindowData((prev) => ({
          ...prev,
          WalletProofPhoto: response.url,
        }));
        toast.success("Image uploaded");
      } else {
        throw new Error("Upload did not return URL");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const HandleUpdateWalletWindowData = async (e) => {
    e.preventDefault();

    if (
      !(ReduxLoggedUser?.role === "center" || ReduxLoggedUser?.role === "Admin")
    ) {
      toast.error("You are not a center. You can't recharge.");
      return;
    }

    // client-side quick validation
    const hasError =
      requiredMsg.WalletAmount ||
      requiredMsg.WalletMethod ||
      requiredMsg.BankName ||
      requiredMsg.transactionId ||
      requiredMsg.WalletDate ||
      requiredMsg.WalletProofPhoto;

    if (hasError) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (isUploading) {
      toast.loading("Waiting for image upload to finish...");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        walletId: UpdateWalletWindowData?.walletId,
        WalletAmount: UpdateWalletWindowData?.WalletAmount,
        WalletDate: UpdateWalletWindowData?.WalletDate,
        BankName: UpdateWalletWindowData?.BankName,
        WalletRemark: UpdateWalletWindowData?.WalletRemark,
        WalletStatus: "pending",
        WalletMethod: UpdateWalletWindowData?.WalletMethod,
        transactionId: UpdateWalletWindowData?.transactionId,
        WalletProofPhoto: UpdateWalletWindowData?.WalletProofPhoto,
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/update-wallet`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message || "Wallet successfully added");
        HandleCloseAddWallet();
        if (typeof GetLoginUserDetails === "function") GetLoginUserDetails();
      } else {
        toast.error(response?.data?.message || "Failed to update payment");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/60 overflow-auto">
      <div className="bg-white dark:bg-slate-900 dark:text-white border border-slate-400 rounded-2xl w-full max-w-3xl px-6 py-5 my-8">
        <div className="mb-4 rounded-xl flex items-start md:items-center justify-between bg-white dark:bg-slate-800 px-3 py-2">
          <div>
            <h1 className="text-lg font-bold">Wallet Window</h1>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Add or update center wallet (will be submitted as{" "}
              <strong>pending</strong>).
            </div>
          </div>

          <button
            aria-label="Close Create Wallet Modal"
            onClick={HandleCloseAddWallet}
            className="p-2 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Close"
          >
            <IoClose size={20} />
          </button>
        </div>

        <form onSubmit={HandleUpdateWalletWindowData}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wallet Type */}
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-800 dark:text-white">
                Wallet Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                id="WalletType"
                name="WalletMethod"
                onChange={HandleInputData}
                value={UpdateWalletWindowData?.WalletMethod}
                className={`w-full px-3 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 ${
                  requiredMsg.WalletMethod
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
                aria-required
              >
                <option value="">Select</option>
                {[
                  "credit_card",
                  "debit_card",
                  "net_banking",
                  "cash",
                  "upi",
                ].map((data, i) => (
                  <option key={i} value={data}>
                    {data}
                  </option>
                ))}
              </select>
              {requiredMsg.WalletMethod && (
                <p className="text-red-500 text-xs mt-1">
                  Wallet Type is required.
                </p>
              )}
            </div>

            {/* Bank Name */}
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-800 dark:text-white">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                placeholder="Ex: Union Bank, etc"
                type="text"
                id="BankName"
                name="BankName"
                onChange={HandleInputData}
                value={UpdateWalletWindowData?.BankName}
                className={`w-full px-3 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 ${
                  requiredMsg.BankName ? "border-red-400" : "border-gray-300"
                }`}
                aria-required
              />
              {requiredMsg.BankName && (
                <p className="text-red-500 text-xs mt-1">
                  Bank Name is required.
                </p>
              )}
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-800 dark:text-white">
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                required
                placeholder="Ex: AXBD********"
                type="text"
                id="TransactionId"
                name="transactionId"
                onChange={HandleInputData}
                value={UpdateWalletWindowData?.transactionId}
                className={`w-full px-3 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 ${
                  requiredMsg.transactionId
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
                aria-required
              />
              {requiredMsg.transactionId && (
                <p className="text-red-500 text-xs mt-1">
                  Transaction Id is required.
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-800 dark:text-white">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                id="Amount"
                name="WalletAmount"
                readOnly
                value={UpdateWalletWindowData?.WalletAmount ?? ""}
                className="w-full px-3 py-2 border rounded text-sm bg-gray-100 dark:bg-gray-800"
                aria-readonly
              />
              <p className="text-green-600 text-xs mt-1 font-semibold">
                Wallet amount to be paid
              </p>
            </div>

            {/* Date */}
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-800 dark:text-white">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="date"
                id="Date"
                name="WalletDate"
                onChange={HandleInputData}
                value={UpdateWalletWindowData?.WalletDate}
                className={`w-full px-3 py-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 ${
                  requiredMsg.WalletDate ? "border-red-400" : "border-gray-300"
                }`}
                aria-required
              />
              {requiredMsg.WalletDate && (
                <p className="text-red-500 text-xs mt-1">
                  Wallet Date is required.
                </p>
              )}
            </div>

            {/* Photo */}
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-800 dark:text-white">
                Photo <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="Photo"
                name="WalletProofPhoto"
                accept="image/*"
                onChange={HandleUploadPhoto}
                className={`w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700 ${
                  requiredMsg.WalletProofPhoto
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
                aria-required
              />
              {isUploading && (
                <p className="text-xs mt-1 text-gray-500">Uploading image...</p>
              )}
              {requiredMsg.WalletProofPhoto && (
                <p className="text-red-500 text-xs mt-1">
                  Wallet Proof Photo is required.
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          {UpdateWalletWindowData?.WalletProofPhoto && (
            <div className="mt-4">
              <div className="w-full md:max-w-sm border rounded-md overflow-hidden shadow-sm">
                <img
                  src={UpdateWalletWindowData?.WalletProofPhoto}
                  alt="Uploaded proof"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={HandleCloseAddWallet}
              className="px-4 py-2 rounded border text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2 rounded bg-green-600 text-white text-sm font-semibold disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Recharge"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateWallet;
