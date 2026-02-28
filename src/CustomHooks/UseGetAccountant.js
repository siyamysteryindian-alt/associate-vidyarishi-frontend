import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UseGetAccountant = () => {
  const [AccountantLoading, setAccountantLoading] = useState(false);
  const [AccountantError, setAccountantError] = useState(null);
  const [Accountant, setAccountant] = useState([]);

  const GetAccountantData = async () => {
    setAccountantLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-accounatant-by-pagination`,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        setAccountant(response?.data?.data?.Accountant);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setAccountantError(error.response?.data?.message || "An error occurred.");
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setAccountantLoading(false);
    }
  };

  return {
    AccountantLoading,
    AccountantError,
    Accountant,
    GetAccountantData,
  };
};

export default UseGetAccountant;
