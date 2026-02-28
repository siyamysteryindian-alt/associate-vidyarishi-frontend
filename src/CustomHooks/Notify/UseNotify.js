import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UseNotifyData = () => {
  const [NotifyDataLoading, setNotifyDataLoading] = useState(false);
  const [NotifyData, setNotifyData] = useState([]);

  const FetchNotifyWindow = async () => {
    try {
      setNotifyDataLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-all-notify`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setNotifyData(response?.data?.data);
      }
    } catch (error) {
      if (error.response?.status === 304) {
        setNotifyData([]);
        // console.log("Error fetching notifications:", error);
      } else {
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    } finally {
      setNotifyDataLoading(false);
    }
  };

  return {
    NotifyDataLoading,
    NotifyData,
    FetchNotifyWindow,
  };
};

export default UseNotifyData;
