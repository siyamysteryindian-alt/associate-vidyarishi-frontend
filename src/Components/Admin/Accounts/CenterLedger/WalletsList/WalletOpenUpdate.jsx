import React, { useEffect, useState } from "react";
import UseGetWallet from "../../../../../CustomHooks/Wallet/useWallet";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../../../../Helper/Loader";
import uploadFile from "../../../../../Helper/UploadFile";

const WalletOpenUpdate = ({
  HandleCloseWindowWallet,
  WalletById = {},
  setRefreshForWallet,
  setRefreshWalletWindow,
}) => {
  // initialize with WalletById safely and keep local form state
  const [walletUpdateData, setWalletUpdateData] = useState({
    BankName: "",
    walletId: "",
    WalletAmount: "",
    WalletDate: "",
    WalletMethod: "",
    WalletProofPhoto: "",
    WalletRemark: "",
    WalletStatus: "",
    transactionId: "",
  });

  useEffect(() => {
    // when WalletById changes (open with different wallet), populate form
    if (WalletById) {
      setWalletUpdateData({
        BankName: WalletById?.BankName || "",
        walletId: WalletById?._id || "",
        WalletAmount: WalletById?.WalletAmount || "",
        WalletDate: WalletById?.WalletDate
          ? WalletById?.WalletDate.split("T")[0]
          : "",
        WalletMethod: WalletById?.WalletMethod || "",
        WalletProofPhoto: WalletById?.WalletProofPhoto || "",
        WalletRemark: WalletById?.WalletRemark || "",
        WalletStatus: WalletById?.WalletStatus || "pending",
        transactionId: WalletById?.transactionId || "",
      });
    }
  }, [WalletById]);

  const HandleInputData = (e) => {
    const { name, value } = e.target;
    setWalletUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleUploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const response = await uploadFile(file);
      if (response?.url) {
        setWalletUpdateData((prev) => ({
          ...prev,
          WalletProofPhoto: response.url,
        }));
      } else {
        toast.error("Upload failed — try again.");
      }
    } catch (err) {
      toast.error("Upload failed — try again.");
    }
  };

  const [requiredMsg, setRequiredMsg] = useState({
    WalletAmount: false,
    WalletDate: false,
    BankName: false,
    WalletMethod: false,
    transactionId: false,
    WalletProofPhoto: false,
  });

  useEffect(() => {
    setRequiredMsg({
      WalletAmount:
        walletUpdateData?.WalletAmount === "" ||
        walletUpdateData?.WalletAmount === null,
      WalletMethod: walletUpdateData?.WalletMethod === "",
      BankName: walletUpdateData?.BankName === "",
      transactionId:
        walletUpdateData?.transactionId === "" ||
        walletUpdateData?.transactionId === null,
      WalletDate:
        walletUpdateData?.WalletDate === "" ||
        walletUpdateData?.WalletDate === null,
      WalletProofPhoto:
        walletUpdateData?.WalletProofPhoto === "" ||
        walletUpdateData?.WalletProofPhoto === null,
    });
  }, [walletUpdateData]);

  const [updateWalletLoading, setUpdateWalletLoading] = useState(false);
  const {
    /* if you need methods from hook, keep them */
  } = UseGetWallet();

  const HandleUpdateWalletData = async (e) => {
    e.preventDefault();

    // basic validation
    if (
      requiredMsg.WalletAmount ||
      requiredMsg.WalletMethod ||
      requiredMsg.BankName ||
      requiredMsg.transactionId ||
      requiredMsg.WalletDate ||
      requiredMsg.WalletProofPhoto
    ) {
      toast.error("Please fill the required fields.");
      return;
    }

    setUpdateWalletLoading(true);
    try {
      const payload = {
        walletId: walletUpdateData.walletId,
        WalletAmount: walletUpdateData.WalletAmount,
        WalletDate: walletUpdateData.WalletDate,
        BankName: walletUpdateData.BankName,
        WalletRemark: walletUpdateData.WalletRemark,
        WalletStatus: walletUpdateData.WalletStatus,
        WalletMethod: walletUpdateData.WalletMethod,
        transactionId: walletUpdateData.transactionId,
        WalletProofPhoto: walletUpdateData.WalletProofPhoto,
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/update-wallet`,
        payload,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message || "Wallet updated");
        HandleCloseWindowWallet();
        setRefreshForWallet(true);
        setRefreshWalletWindow(true);
        setTimeout(() => setRefreshWalletWindow(false), 600);
      } else {
        toast.error(response?.data?.message || "Update failed");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setUpdateWalletLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow p-4 mt-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-update-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="wallet-update-title" className="text-lg font-semibold">
            Update Wallet
          </h2>
          <button
            aria-label="Close Update Wallet Modal"
            onClick={HandleCloseWindowWallet}
            className="text-xl font-bold text-red-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={HandleUpdateWalletData}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs block mb-1">
                Wallet Type <span className="text-red-500">*</span>
              </label>
              <select
                id="WalletType"
                name="WalletMethod"
                onChange={HandleInputData}
                value={walletUpdateData.WalletMethod}
                className={`block w-full px-2 py-1 text-sm rounded border ${
                  requiredMsg.WalletMethod
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">Select</option>
                {[
                  "credit_card",
                  "debit_card",
                  "net_banking",
                  "cash",
                  "upi",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {requiredMsg.WalletMethod && (
                <p className="text-red-500 text-xs mt-1">
                  Wallet Type is required.
                </p>
              )}
            </div>

            <div>
              <label className="text-xs block mb-1">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                id="BankName"
                name="BankName"
                value={walletUpdateData.BankName}
                onChange={HandleInputData}
                placeholder="Ex: Union Bank"
                className={`block w-full px-2 py-1 text-sm rounded border ${
                  requiredMsg.BankName ? "border-red-400" : "border-gray-300"
                }`}
                required
              />
              {requiredMsg.BankName && (
                <p className="text-red-500 text-xs mt-1">
                  Bank Name is required.
                </p>
              )}
            </div>

            <div>
              <label className="text-xs block mb-1">
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                id="TransactionId"
                name="transactionId"
                value={walletUpdateData.transactionId}
                onChange={HandleInputData}
                placeholder="Ex: AXBD********"
                className={`block w-full px-2 py-1 text-sm rounded border ${
                  requiredMsg.transactionId
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
                required
              />
              {requiredMsg.transactionId && (
                <p className="text-red-500 text-xs mt-1">
                  Transaction Id is required.
                </p>
              )}
            </div>

            <div>
              <label className="text-xs block mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                id="Amount"
                name="WalletAmount"
                value={walletUpdateData.WalletAmount}
                onChange={HandleInputData}
                type="number"
                className={`block w-full px-2 py-1 text-sm rounded border ${
                  requiredMsg.WalletAmount
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
                required
              />
              {requiredMsg.WalletAmount && (
                <p className="text-red-500 text-xs mt-1">
                  Wallet Amount is required.
                </p>
              )}
            </div>

            <div>
              <label className="text-xs block mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                id="Date"
                name="WalletDate"
                value={walletUpdateData.WalletDate}
                onChange={HandleInputData}
                type="date"
                className={`block w-full px-2 py-1 text-sm rounded border ${
                  requiredMsg.WalletDate ? "border-red-400" : "border-gray-300"
                }`}
                required
              />
              {requiredMsg.WalletDate && (
                <p className="text-red-500 text-xs mt-1">
                  Wallet Date is required.
                </p>
              )}
            </div>

            <div>
              <label className="text-xs block mb-1">
                Photo <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="WalletProofPhoto"
                onChange={HandleUploadPhoto}
                className={`block w-full px-2 py-1 text-sm rounded border ${
                  requiredMsg.WalletProofPhoto
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
                required={!walletUpdateData.WalletProofPhoto}
              />
              {requiredMsg.WalletProofPhoto && (
                <p className="text-red-500 text-xs mt-1">
                  Wallet Proof Photo is required.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-xs block mb-1">Change Status</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="WalletStatus"
                    value="pending"
                    checked={walletUpdateData.WalletStatus === "pending"}
                    onChange={HandleInputData}
                  />
                  <span className="text-sm">Pending</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="WalletStatus"
                    value="approved"
                    checked={walletUpdateData.WalletStatus === "approved"}
                    onChange={HandleInputData}
                  />
                  <span className="text-sm">Approved</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="WalletStatus"
                    value="DirectApproval"
                    checked={walletUpdateData.WalletStatus === "DirectApproval"}
                    onChange={HandleInputData}
                  />
                  <span className="text-sm">Direct Approve</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              {walletUpdateData?.WalletProofPhoto && (
                <div className="mt-2">
                  <div className="w-60 h-24 border rounded-md overflow-hidden">
                    <img
                      src={walletUpdateData.WalletProofPhoto}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={HandleCloseWindowWallet}
              className="px-4 py-1 text-sm rounded border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-1 text-sm font-semibold rounded bg-green-600 text-white"
              disabled={updateWalletLoading}
            >
              {updateWalletLoading ? <Loader /> : "Update"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default WalletOpenUpdate;
