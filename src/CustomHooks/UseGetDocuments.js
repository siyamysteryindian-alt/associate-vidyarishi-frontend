import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const useGetDocuments = () => {
  const [loadingDocuments, setloadingDocuments] = useState(false);
  const [DocumentsError, setDocumentsError] = useState(null);
  const [Documents, setDocuments] = useState([]); // New state for Documents

  const GetAllDocuments = async () => {
    try {
      setloadingDocuments(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetDocuments`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setDocuments(response?.data?.data?.Documents);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setDocumentsError(
        error.response?.data?.message ||
          "An DocumentsError occurred. Please try again."
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setloadingDocuments(false);
    }
  };

  return { GetAllDocuments, loadingDocuments, DocumentsError, Documents }; // Return Documents
};

export default useGetDocuments;
