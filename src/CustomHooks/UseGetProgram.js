import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const useGetProgram = () => {
  const [loadingProgram, setloadingProgram] = useState(false);
  const [ProgramError, setProgramError] = useState(null);
  const [Program, setProgram] = useState([]); // New state for Program

  const GetAllProgram = async () => {
    try {
      setloadingProgram(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetPrograms`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setProgram(response.data.data);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setProgramError(
        error.response?.data?.message ||
          "An setModeError occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setloadingProgram(false);
    }
  };

  return { GetAllProgram, loadingProgram, ProgramError, Program }; // Return Program
};

export default useGetProgram;
