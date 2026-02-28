import React, { useEffect, useState } from "react";
import Loader from "../../../../../Helper/Loader";
import PreviewImage from "../../../../../Helper/PreviewImage";
import { GrUpdate } from "react-icons/gr";
import UseGetWallet from "../../../../../CustomHooks/Wallet/useWallet";
import WalletOpenUpdate from "./WalletOpenUpdate";

const ListOf_ApprovedWalletList = ({
  UpdatedWalletData,
  UpdatedWalletLoading,
  LoggedUserData,
  setRefreshForWallet,
}) => {
  const {
    GetWalletLoading,
    GetWalletError,
    GetWallet,
    GetWalletData,
    ApproveWalletLoading,
    ApproveWalletError,
    ApproveWallet,
    HandleApproveWallet,
    RejectWalletLoading,
    RejectWalletError,
    RejectWallet,
    HandleRejectWallet,
  } = UseGetWallet();

  useEffect(() => {
    if (
      LoggedUserData?.role === "Admin" ||
      LoggedUserData?.role === "Accountant"
    ) {
      GetWalletData();
    }
    // eslint-disable-next-line
  }, [
    LoggedUserData?.role === "Admin" || LoggedUserData?.role === "Accountant",
  ]);

  // preview image
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handlePreviewImage = (data) => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    // simulate slight delay to show loader (match previous behavior)
    setTimeout(() => {
      setPreviewData(data);
      setPreviewLoading(false);
    }, 500);
  };

  // wallet update modal
  const [openWalletWindow, setOpenWalletWindow] = useState(false);
  const [walletById, setWalletById] = useState(null);
  const [refreshWalletWindow, setRefreshWalletWindow] = useState(false);

  useEffect(() => {
    if (refreshWalletWindow) {
      GetWalletData();
      setRefreshWalletWindow(false);
    }
    // eslint-disable-next-line
  }, [refreshWalletWindow]);

  const handleOpenWindowWallet = (data) => {
    setWalletById(data);
    setOpenWalletWindow(true);
  };
  const handleCloseWindowWallet = () => setOpenWalletWindow(false);

  // derived approved rows
  const approvedRows = (GetWallet || []).filter(
    (w) => !w?.isDeleted && w?.WalletStatus === "approved"
  );

  return (
    <>
      {/* tbody only — parent table handles table/thead */}
      {GetWalletLoading ? (
        <tbody>
          <tr>
            <td colSpan={9} className="px-4 py-8">
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
              colSpan={9}
              className="px-4 py-8 text-center text-sm text-gray-500"
            >
              No approved wallets available.
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody className="text-sm">
          {approvedRows.map((data, i) => {
            const key = data?._id ?? `wallet-${i}`;
            return (
              <tr
                key={key}
                className="bg-white dark:bg-slate-900 dark:text-white text-sm border-b"
              >
                {/* Center Name */}
                <td className="px-4 py-1.5 align-top text-sm">
                  <div className="font-semibold truncate">
                    {data?.CenterId?.name || "—"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {data?.CenterId?.code || ""}
                  </div>
                </td>

                {/* Wallet Method */}
                <td className="px-4 py-1.5 align-top text-sm">
                  {data?.WalletMethod || "—"}
                </td>

                {/* Wallet Date */}
                <td className="px-4 py-1.5 align-top text-sm">
                  {data?.WalletDate || "—"}
                </td>

                {/* Bank Name */}
                <td className="px-4 py-1.5 align-top text-sm">
                  {data?.BankName || "—"}
                </td>

                {/* Transaction Id */}
                <td className="px-4 py-1.5 align-top text-sm">
                  {data?.transactionId ?? "—"}
                </td>

                {/* Wallet Amount */}
                <td className="px-4 py-1.5 align-top text-sm font-semibold">
                  ₹ {data?.WalletAmount ?? "-"}
                </td>

                {/* Wallet Status */}
                <td className="px-4 py-1.5 align-top text-sm">
                  <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {data?.WalletStatus}
                  </div>
                </td>

                {/* Proof Photo (preview) */}
                <td className="px-4 py-1.5 align-top text-sm">
                  {data?.WalletProofPhoto ? (
                    <button
                      onClick={() => handlePreviewImage(data)}
                      title="Preview Image"
                      className="inline-block"
                    >
                      <img
                        src={data?.WalletProofPhoto}
                        alt="proof"
                        className="w-24 h-16 object-cover border"
                      />
                    </button>
                  ) : (
                    <div className="text-xs text-gray-500">No proof</div>
                  )}
                </td>

                {/* Actions: update */}
                <td className="px-4 py-1.5 align-top text-sm">
                  <button
                    onClick={() => handleOpenWindowWallet(data)}
                    title="Update Wallet"
                    className="inline-flex items-center gap-2 px-2 py-1 bg-white border rounded hover:bg-gray-50"
                  >
                    <GrUpdate size={16} className="text-blue-500" />
                    <span className="text-xs">Update</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      )}

      {/* Preview modal */}
      {previewOpen && (
        <PreviewImage
          HandlePreviewImageToggle={previewOpen}
          setHandlePreviewImageToggle={setPreviewOpen}
          HandlePreviewImageDataParams={previewData}
          HandlePreviewImageLoader={previewLoading}
        />
      )}

      {/* Wallet update modal */}
      {openWalletWindow && (
        <WalletOpenUpdate
          HandleCloseWindowWallet={handleCloseWindowWallet}
          WalletById={walletById}
          setRefreshForWallet={setRefreshForWallet}
          setRefreshWalletWindow={setRefreshWalletWindow}
        />
      )}
    </>
  );
};

export default ListOf_ApprovedWalletList;
