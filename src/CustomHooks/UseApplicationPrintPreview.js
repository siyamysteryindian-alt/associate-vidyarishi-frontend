import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const UseApplicationPrintPreview = () => {
  const [StudentIdPdfLoading, setStudentIdPdfLoading] = useState(false);
  const [StudentIdPdfError, setStudentIdPdfError] = useState(null);
  const [StudentDataPdfById, setStudentDataPdfById] = useState([]);

  // Function to handle PDF generation and preview
  const HandlePrintPreview = async (data) => {
    try {
      setStudentIdPdfLoading(true);
      if (!data?._id) {
        toast.error("Student ID is missing. Please provide a valid ID.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/GenerateReportPdfLib`,
        { studentid: data?._id },
        {
          responseType: "blob", // Set response type to blob to handle the PDF file
          withCredentials: true,
        }
      );

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new tab for preview
      if (url) {
        window.open(url, "_blank");
      }

      // Cleanup after a delay
      setTimeout(() => window.URL.revokeObjectURL(url), 5000);
    } catch (error) {
      if (error?.status === 400) {
        toast.error("Student Form Is Not Completed.");
      } else {
        toast.error("Internal Server Error");
      }
    } finally {
      setStudentIdPdfLoading(false);
    }
  };

  const GetStudentIdPdf = async (StudentObjId) => {
    try {
      setStudentIdPdfLoading(true);

      // Ensure the ID is passed correctly as part of the URL
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/GetStudentsByIdForGeneratingPdf/${StudentObjId}`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setStudentDataPdfById(response?.data);
      } else {
        toast.error(response.data.message || "Failed to fetch student data");
      }
    } catch (error) {
      setStudentIdPdfError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setStudentIdPdfLoading(false);
    }
  };

  return {
    HandlePrintPreview,
    StudentIdPdfLoading,
    StudentIdPdfError,
    StudentDataPdfById,
    GetStudentIdPdf,
  };
};

export default UseApplicationPrintPreview;
