import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const UseGetSpecialization = () => {
  const [SpecializationLoading, setSpecializationLoading] = useState(false);
  const [SpecializationError, setSpecializationError] = useState(null);
  const [Specialization, setSpecialization] = useState([]);

  const [
    SpecializationByProgramIdLoading,
    setSpecializationByProgramIdLoading,
  ] = useState(false);
  const [SpecializationByProgramIdError, setSpecializationByProgramIdError] =
    useState(null);
  const [SpecializationByProgramId, setSpecializationByProgramId] = useState(
    []
  );

  const UniversityGetDataFromRedux = useSelector((state) => state?.university);

  const GetSpecialization = async (page, limit) => {
    try {
      setSpecializationLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetSpecializationByPagination`,
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
        setSpecialization(response?.data?.data?.Specialization);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setSpecializationError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSpecializationLoading(false);
    }
  };

  const GetSpecializationByProgramId = async (programId) => {
    try {
      setSpecializationByProgramIdLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetSpecializationByProgramId`,
        {
          programId: programId,
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setSpecializationByProgramId(
          response?.data?.data?.SpecializationByProgramId
        );
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setSpecializationByProgramIdError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSpecializationByProgramIdLoading(false);
    }
  };

  return {
    SpecializationLoading,
    SpecializationError,
    Specialization,
    GetSpecialization,

    GetSpecializationByProgramId,
    SpecializationByProgramIdLoading,
    SpecializationByProgramIdError,
    SpecializationByProgramId,
  };
};

export default UseGetSpecialization;
