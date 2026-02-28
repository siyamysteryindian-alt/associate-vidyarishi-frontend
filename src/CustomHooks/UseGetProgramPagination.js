import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const UseGetProgramPagination = () => {
  const [AllProgramsByPaginationLoading, setAllProgramsByPaginationLoading] =
    useState(false);
  const [AllProgramsByPaginationError, setAllProgramsByPaginationError] =
    useState(null);
  const [AllProgramsByPagination, setAllProgramsByPagination] = useState([]);

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const GetAllProgramsByPagination = async (page, limit) => {
    try {
      setAllProgramsByPaginationLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetProgramByPagination`,
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
        setAllProgramsByPagination(response?.data?.data?.programs);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setAllProgramsByPaginationError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setAllProgramsByPaginationLoading(false);
    }
  };

  return {
    AllProgramsByPaginationLoading,
    AllProgramsByPaginationError,
    AllProgramsByPagination,
    GetAllProgramsByPagination,
  };
};

export default UseGetProgramPagination;
