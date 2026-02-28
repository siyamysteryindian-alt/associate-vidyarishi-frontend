import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const useGetScheme = () => {
  const [loadingScheme, setloadingScheme] = useState(false);
  const [SchemeError, setSchemeError] = useState(null);
  const [Scheme, setScheme] = useState([]); // New state for Scheme

  const GetAllScheme = async () => {
    try {
      setloadingScheme(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetScheme`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setScheme(response.data.data);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setSchemeError(
        error.response?.data?.message ||
          "An setModeError occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setloadingScheme(false);
    }
  };

  return { GetAllScheme, loadingScheme, SchemeError, Scheme }; // Return Scheme
};

export default useGetScheme;
