import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UseGetWallet = () => {
  const [GetWalletLoading, setGetWalletLoading] = useState(false);
  const [GetWalletError, setGetWalletError] = useState(null);
  const [GetWallet, setGetWallet] = useState([]);

  const [ApproveWalletLoading, setApproveWalletLoading] = useState(false);
  const [ApproveWalletError, setApproveWalletError] = useState(null);
  const [ApproveWallet, setApproveWallet] = useState([]);

  const [RejectWalletLoading, setRejectWalletLoading] = useState(false);
  const [RejectWalletError, setRejectWalletError] = useState(null);
  const [RejectWallet, setRejectWallet] = useState([]);

  const GetWalletData = async () => {
    setGetWalletLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-all-wallets`,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        setGetWallet(response?.data?.data);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setGetWalletError(error.response?.data?.message || "An error occurred.");
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setGetWalletLoading(false);
    }
  };

  const HandleApproveWallet = async (walletId) => {
    setApproveWalletLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/approve-wallet`,
        {
          walletId,
        },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        setApproveWallet(response?.data?.data?.Wallet);
        GetWalletData();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setApproveWalletError(
        error.response?.data?.message || "An error occurred."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setApproveWalletLoading(false);
    }
  };

  const HandleRejectWallet = async (walletId) => {
    setRejectWalletLoading(true);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/reject-wallet`,
        { walletId },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        setRejectWallet(response?.data?.data?.Wallet);
        GetWalletData();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setRejectWalletError(
        error.response?.data?.message || "An error occurred."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setRejectWalletLoading(false);
    }
  };

  return {
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

  };
};

export default UseGetWallet;
