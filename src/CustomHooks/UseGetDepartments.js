import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const UseGetDepartments = () => {
  const [DepartmentLoading, setDepartmentLoading] = useState(false);
  const [DepartmentError, setDepartmentError] = useState(null);
  const [Department, setDepartment] = useState([]);

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const GetDepartment = async (page, limit, search = "") => {
    try {
      setDepartmentLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetDepartmentsByPagination`,
        {
          params: {
            page,
            limit,
            query: search,
            university: UniversityGetDataFromRedux?.id ? UniversityGetDataFromRedux?.id : "",
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setDepartment(response?.data?.data?.Department); // Store Department
        console.log("data department")
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setDepartmentError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setDepartmentLoading(false);
    }
  };

  return {
    DepartmentLoading,
    DepartmentError,
    Department,
    GetDepartment,
  };
};

export default UseGetDepartments;
