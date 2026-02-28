import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const UseGetCenterSubCenter = () => {
  const [CenterLoading, setCenterLoading] = useState(false);
  const [CenterError, setCenterError] = useState(null);
  const [Center, setCenter] = useState([]);

  const [SubCenterLoading, setSubCenterLoading] = useState(false);
  const [SubCenterError, setSubCenterError] = useState(null);
  const [SubCenter, setSubCenter] = useState([]);

  const UniversityGetDataFromRedux = useSelector((state) => state?.university);

  const GetCenter = async (page, limit) => {
    try {
      setCenterLoading(true);
      console.log("center", document.cookie);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetCenterMasterByPagination`,
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
        setCenter(response?.data?.data?.Center);
      }
    } catch (error) {
      setCenterError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setCenterLoading(false);
    }
  };

  const GetSubCenter = async (page, limit, university) => {
    try {
      setSubCenterLoading(true);
      console.log("sub center", document.cookie);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetSubCenterByPagination`,
        {
          params: {
            page,
            limit,
            university: UniversityGetDataFromRedux?.id || university,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setSubCenter(response?.data?.data?.subCenter);
      }
    } catch (error) {
      setSubCenterError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSubCenterLoading(false);
    }
  };

  return {
    GetCenter,
    CenterError,
    CenterLoading,
    Center,
    GetSubCenter,
    SubCenterLoading,
    SubCenterError,
    SubCenter,
  };
};

export default UseGetCenterSubCenter;
