import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const UseGetAdmissionSession = () => {
  const [AdmissionsessionListData, setAdmissionsessionListData] = useState([]);
  const [AdmissionsessionCurrentPage, setAdmissionsessionCurrentPage] =
    useState(1);
  const [AdmissionsessionTotalPages, setAdmissionsessionTotalPages] =
    useState(0);
  const [AdmissionsessionLimit, setAdmissionsessionLimit] = useState(6);
  const [AdmissionsessionLoading, setAdmissionsessionLoading] = useState(false);
  const [AdmissionsessionTotalDocs, setAdmissionsessionTotalDocs] = useState(0);

  const GetAdmissionSession = async (page, limit) => {
    try {
      setAdmissionsessionLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAdmissionSessionByPagination`,
        {
          params: {
            page,
            limit,
          },
          withCredentials: true,
        },
       
      );

      if (response?.data?.success) {
        setAdmissionsessionListData(response?.data?.data?.Admissionsession); //acccess ni ho raha hai
        setAdmissionsessionCurrentPage(response?.data?.data?.currentPage);
        setAdmissionsessionTotalPages(response?.data?.data?.totalPages);
        setAdmissionsessionLimit(response?.data?.data?.limit);
        setAdmissionsessionTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setAdmissionsessionLoading(false);
    }
  };

  return {
    AdmissionsessionListData,
    AdmissionsessionCurrentPage,
    AdmissionsessionTotalPages,
    AdmissionsessionLimit,
    AdmissionsessionLoading,
    AdmissionsessionTotalDocs,
    GetAdmissionSession,
  };
};

export default UseGetAdmissionSession;
