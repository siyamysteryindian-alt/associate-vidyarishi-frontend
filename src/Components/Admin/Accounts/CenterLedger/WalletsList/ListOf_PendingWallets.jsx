import React, { useEffect, useState } from "react";
import Loader from "../../../../../Helper/Loader";
import PreviewImage from "../../../../../Helper/PreviewImage";
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import UseGetWallet from "../../../../../CustomHooks/Wallet/useWallet";
import Swal from "sweetalert2";
import WalletOpenUpdate from "../WalletsList/WalletOpenUpdate";

const ListOf_PendingWallets = ({
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

  // preview image state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handlePreviewImage = (data) => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    setTimeout(() => {
      setPreviewData(data);
      setPreviewLoading(false);
    }, 600);
  };

  // wallet update modal state
  const [openWalletWindow, setOpenWalletWindow] = useState(false);
  const [refreshWalletWindow, setRefreshWalletWindow] = useState(false);
  const [walletById, setWalletById] = useState(null);

  useEffect(() => {
    if (refreshWalletWindow) {
      GetWalletData();
      setRefreshWalletWindow(false);
    }
    // eslint-disable-next-line
  }, [refreshWalletWindow]);

  const handleOpenWindowWallet = (data) => {
    setOpenWalletWindow(true);
    setWalletById(data);
  };
  const handleCloseWindowWallet = () => setOpenWalletWindow(false);

  const handleApproveWalletBySwal = (data) => {
    Swal.fire({
      title: `Do You Want To Approve Wallet ?`,
      showCancelButton: true,
      confirmButtonText: "Approve ?",
      cancelButtonText: `Cancel`,
      customClass: {
        cancelButton: "custom-cancel-button",
        confirmButton: "custom-confirm2-button",
      },
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await HandleApproveWallet(data?._id);
        GetWalletData();
        setRefreshForWallet(true);
        setTimeout(() => setRefreshForWallet(false), 600);
      } else {
        Swal.fire("Action canceled", "", "info");
      }
    });
  };

  const handleRejectWalletBySwal = (data) => {
    Swal.fire({
      title: `Do You Want To Reject Wallet ?`,
      showCancelButton: true,
      confirmButtonText: "Reject ?",
      cancelButtonText: `Cancel`,
      customClass: {
        cancelButton: "custom-cancel-button",
        confirmButton: "custom-confirm2-button",
      },
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await HandleRejectWallet(data?._id);
        GetWalletData();
        setRefreshForWallet(true);
        setTimeout(() => setRefreshForWallet(false), 600);
      } else {
        Swal.fire("Action canceled", "", "info");
      }
    });
  };

  // derived rows: pending wallets
  const pendingRows = (GetWallet || []).filter(
    (d) => !d?.isDeleted && d?.WalletStatus === "pending"
  );

  return (
    <>
      {/* tbody only — parent table provides thead */}
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
      ) : pendingRows.length === 0 ? (
        <tbody>
          <tr>
            <td
              colSpan={9}
              className="px-4 py-8 text-center text-sm text-gray-500"
            >
              No pending wallets available.
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody className="text-sm">
          {pendingRows.map((data, i) => {
            const key = data?._id ?? `pending-wallet-${i}`;
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
                  <div className="inline-block px-3 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
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

                {/* Actions */}
                <td className="px-4 py-1.5 align-top text-sm">
                  <div className="flex items-center gap-3">
                    <button
                      title="Approve Wallet"
                      onClick={() => handleApproveWalletBySwal(data)}
                      className="p-1"
                    >
                      <FaCheck className="text-green-500" size={18} />
                    </button>

                    <button
                      title="Reject Wallet"
                      onClick={() => handleRejectWalletBySwal(data)}
                      className="p-1"
                    >
                      <MdCancel className="text-red-500" size={18} />
                    </button>

                    <button
                      title="Update Wallet"
                      onClick={() => handleOpenWindowWallet(data)}
                      className="p-1"
                    >
                      <GrUpdate className="text-blue-500" size={18} />
                    </button>
                  </div>
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

export default ListOf_PendingWallets;
