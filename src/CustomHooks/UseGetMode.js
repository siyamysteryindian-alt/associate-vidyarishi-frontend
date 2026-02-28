import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const useGetMode = () => {
  const [loadingMode, setloadingMode] = useState(false);
  const [ModeError, setModeError] = useState(null);
  const [Mode, setMode] = useState([]);

  const GetAllMode = async () => {
    try {
      setloadingMode(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetMode`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setMode(response.data.data);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setModeError(
        error.response?.data?.message ||
          "An ModeError occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setloadingMode(false);
    }
  };

  return { GetAllMode, loadingMode, ModeError, Mode }; // Return Mode
};

export default useGetMode;
