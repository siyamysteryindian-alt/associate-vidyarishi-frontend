import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const useGetCounsellor = () => {
  const [CounsellorManagerLoading, setCounsellorLoading] = useState(false);
  const [CounsellorManagerError, setCounsellorManagerError] = useState(null);
  const [CounsellorManager, setCounsellorManager] = useState([]);

  const [SubCounsellorManagerLoading, setSubCounsellorLoading] =
    useState(false);
  const [SubCounsellorManagerError, setSubCounsellorManagerError] =
    useState(null);
  const [SubCounsellorManager, setSubCounsellorManager] = useState([]);

  const UniversityGetDataFromRedux = useSelector((state) => state?.university);

  const GetCounsellorManager = async (page, limit) => {
    try {
      setCounsellorLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetCounsellorByPagination`,
        {
          params: {
            page,
            limit,
            university: UniversityGetDataFromRedux?.id,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setCounsellorManager(response?.data?.data?.Counsellor); // Store CounsellorManager
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setCounsellorManagerError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setCounsellorLoading(false);
    }
  };

  const GetSubCounsellorManager = async (page, limit) => {
    try {
      setSubCounsellorLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetSubCounsellorByPagination`,
        {
          params: {
            page,
            limit,
            university: UniversityGetDataFromRedux?.id,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setSubCounsellorManager(response?.data?.data?.subcounsellor);
      }
    } catch (error) {
      setSubCounsellorManagerError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSubCounsellorLoading(false);
    }
  };

  return {
    GetCounsellorManager,
    CounsellorManagerLoading,
    CounsellorManagerError,
    CounsellorManager,

    GetSubCounsellorManager,
    SubCounsellorManagerLoading,
    SubCounsellorManagerError,
    SubCounsellorManager,
  };
};

export default useGetCounsellor;
