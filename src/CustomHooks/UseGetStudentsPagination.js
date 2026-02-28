import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const UseGetAllStudents = () => {
  const [AllStudentListData, setAllStudentListData] = useState([]);
  const [AllStudentLoading, setAllStudentLoading] = useState(false);
  const [AllStudentCurrentPage, setAllStudentCurrentPage] = useState(1);
  const [AllStudentTotalPages, setAllStudentTotalPages] = useState(1);
  const [AllStudentLimit, setAllStudentLimit] = useState(10); // Default limit
  const [AllStudentTotalDocs, setAllStudentTotalDocs] = useState();

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const getAllStudentByPagination = async () => {
    try {
      setAllStudentLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-all-students`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        const { Students } = response.data.data;
        setAllStudentListData(Students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setAllStudentLoading(false);
    }
  };

  const FetchAllStudentByPagination = async (
    page = 1,
    limit = 1000,
    searchQuery = "",
    from,
    to
  ) => {
    try {
      if (!UniversityGetDataFromRedux?.id) {
        return;
      }

      setAllStudentLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-all-students-by-pagination`,
        {
          params: {
            page,
            limit,
            query: searchQuery,
            from,
            to,
            university: UniversityGetDataFromRedux?.id,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        const { Students, currentPage, totalPages, limit, totalDocs } =
          response.data.data;
        setAllStudentListData(Students);
        setAllStudentCurrentPage(currentPage);
        setAllStudentTotalPages(totalPages);
        setAllStudentLimit(limit);
        setAllStudentTotalDocs(totalDocs);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setAllStudentLoading(false);
    }
  };

  const handlePageChange = async (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > AllStudentTotalPages) {
      toast.error(`Only Pages ${AllStudentTotalPages} Available`);
      return;
    }

    setAllStudentCurrentPage(pageNumber);
    await FetchAllStudentByPagination(pageNumber, AllStudentLimit);
  };

  return {
    FetchAllStudentByPagination, 
    getAllStudentByPagination,
    handlePageChange,
    AllStudentListData,
    AllStudentCurrentPage,
    AllStudentTotalPages,
    AllStudentLimit,
    AllStudentLoading,
    AllStudentTotalDocs,
  };
};

export default UseGetAllStudents;
