import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const useGetProgramType = () => {
  const [LoadingProgramTypes, setLoading] = useState(false);
  const [ErrorProgramTypes, setErrorProgramTypes] = useState(null);
  const [ProgramTypes, setProgramTypes] = useState([]); // New state for universities

  const [Loadingdepartment, setLoadingdepartment] = useState(false);
  const [Errordepartment, setErrordepartment] = useState(null);
  const [department, setdepartment] = useState([]); // New state for universities

  const [LoadingAdmissionType, setLoadingAdmissionType] = useState(false);
  const [ErrorAdmissionType, setErrorAdmissionType] = useState(null);
  const [AdmissionType, setAdmissionType] = useState([]); // New state for universities

  const ReduxUniversity = useSelector((state) => state.university);

  const GetProgramType = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetProgramType`,
        {
          params: {
            university: ReduxUniversity.id,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setProgramTypes(response.data.data);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setErrorProgramTypes(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const GetAdmissionType = async () => {
    try {
      setLoadingAdmissionType(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAdmissionTypeByPagination`,
        {
          params: {
            university: ReduxUniversity.id,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setAdmissionType(response?.data?.data?.AdmissionType);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching admission types:", error);
      setErrorAdmissionType(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoadingAdmissionType(false);
    }
  };

  const GetDepartmentByUniversity = async (UniversityId) => {
    try {
      setLoadingdepartment(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/GetDepartmentByUniversities`,
        {
          UniversityId,
        },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setdepartment(response.data.data);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setErrordepartment(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoadingdepartment(false);
    }
  };

  return {
    GetProgramType,
    LoadingProgramTypes,
    ErrorProgramTypes,
    ProgramTypes,
    GetDepartmentByUniversity,
    Loadingdepartment,
    Errordepartment,
    department,

    GetAdmissionType,
    LoadingAdmissionType,
    ErrorAdmissionType,
    AdmissionType,
  }; // Return universities
};

export default useGetProgramType;
