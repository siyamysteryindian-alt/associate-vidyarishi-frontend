import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const useGetUniversity = () => {
  const [UniversityLoading, setLoading] = useState(false);
  const [UniversityError, setUniversityError] = useState(null);
  const [universities, setUniversities] = useState([]); // New state for universities

  const [AllDepartmentLoading, setAllDepartmentLoading] = useState(false);
  const [AllDepartmentError, setAllDepartmentError] = useState(null);
  const [AllDepartment, setAllDepartment] = useState([]); // New state for universities

  const GetUniversity = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAllUniversities`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setUniversities(response.data.data);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setUniversityError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const GetDepartment = async () => {
    try {
      setAllDepartmentLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAllDepartments`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setAllDepartment(response?.data?.data);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setAllDepartmentError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setAllDepartmentLoading(false);
    }
  };

  
  return {
    GetUniversity,
    UniversityLoading,
    UniversityError,
    universities,

    GetDepartment,
    AllDepartmentLoading,
    AllDepartmentError,
    AllDepartment,
  }; // Return universities
};

export default useGetUniversity;
