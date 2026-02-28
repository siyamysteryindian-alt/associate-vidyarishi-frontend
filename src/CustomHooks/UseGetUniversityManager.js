import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const useGetUniversityManager = () => {
  const [UniversityManagerLoading, setUniversityLoading] = useState(false);
  const [UniversityManagerError, setUniversityManagerError] = useState(null);
  const [UniversityManager, setUniversityManager] = useState([]);

  const [OperationalManagerLoading, setOperationalLoading] = useState(false);
  const [OperationalManagerError, setOperationalManagerError] = useState(null);
  const [OperationalManager, setOperationalManager] = useState([]);

  const [AdminDetailsLoading, setAdminDetailsLoading] = useState(false);
  const [AdminDetailsError, setAdminDetailsManagerError] = useState(null);
  const [AdminDetails, setAdminDetailsManager] = useState([]);

  const GetUniversityManager = async () => {
    try {
      setUniversityLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetUniversityManagerByPagination`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setUniversityManager(response?.data?.data?.UniversityManager);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setUniversityManagerError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setUniversityLoading(false);
    }
  };

  const GetOperationalManager = async () => {
    try {
      setOperationalLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetOperationalManagerByPagination`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setOperationalManager(response?.data?.data?.OperationManager);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setOperationalManagerError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setOperationalLoading(false);
    }
  };

  const GetAdminDetails = async () => {
    try {
      setAdminDetailsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAdminDetails`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setAdminDetailsManager(response?.data?.data?.Admin);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setAdminDetailsManagerError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setAdminDetailsLoading(false);
    }
  };

  return {
    GetUniversityManager,
    UniversityManagerLoading,
    UniversityManagerError,
    UniversityManager,

    GetOperationalManager,
    OperationalManagerLoading,
    OperationalManagerError,
    OperationalManager,

    GetAdminDetails,
    AdminDetailsLoading,
    AdminDetailsError,
    AdminDetails,
  };
};

export default useGetUniversityManager;
