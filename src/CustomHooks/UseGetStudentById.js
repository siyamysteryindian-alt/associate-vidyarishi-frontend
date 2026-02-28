import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const UseGetStudentById = () => {
  const [StudentByIdLoading, setStudentByIdLoading] = useState(false);
  const [StudentByIdError, setStudentByIdError] = useState(null);
  const [StudentDataById, setStudentDataById] = useState([]);

  const GetStudentById = async (StudentObjId) => {
    try {
      setStudentByIdLoading(true);

      // Ensure the ID is passed correctly as part of the URL
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetStudentsById/${StudentObjId}`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setStudentDataById(response?.data?.data);
      } else {
        toast.error(response.data.message || "Failed to fetch student data");
      }
    } catch (error) {
      setStudentByIdError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setStudentByIdLoading(false);
    }
  };

  return {
    StudentByIdLoading,
    StudentByIdError,
    StudentDataById,
    GetStudentById,
  };
};

export default UseGetStudentById;
