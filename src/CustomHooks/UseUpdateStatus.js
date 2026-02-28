import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import UseGetAllStudents from "./UseGetStudentsPagination";
import Swal from "sweetalert2";

const UseProcessedByCenter = () => {
  const [ProcessedByCenterLoading, setProcessedByCenterLoading] =
    useState(false);
  const [ProcessedByCenterError, setProcessedByCenterError] = useState(null);
  const [ProcessedByCenter, setProcessedByCenter] = useState([]);

  const [ProcessedByUniversityLoading, setProcessedByUniversityLoading] =
    useState(false);
  const [ProcessedByUniversityError, setProcessedByUniversityError] =
    useState(null);
  const [ProcessedByUniversity, setProcessedByUniversity] = useState([]);

  const {
    FetchAllStudentByPagination,
    handlePageChange,
    AllStudentListData,
    AllStudentCurrentPage,
    AllStudentTotalPages,
    AllStudentLimit,
    AllStudentLoading,
    AllStudentTotalDocs,
  } = UseGetAllStudents();

  const refreshData = async () => {
    await FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
  };

  const UpdateProcessedByCenter = async (MarkAsByCenter, StudentId) => {
    if (!MarkAsByCenter) {
      toast.error("Not Processed is missing.");
      return;
    }

    Swal.fire({
      title: `Mark As Processed By Center ?`,
      showCancelButton: true,
      confirmButtonText: "Process ?",
      cancelButtonText: `Cancel`,
      customClass: {
        cancelButton: "custom-cancel-button",
        confirmButton: "custom-confirm2-button",
      },
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setProcessedByCenterLoading(true);
          const response = await axios.patch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/update-status-processed-center`,
            {
              MarkAsByCenter,
              StudentId,
            },
            {
              withCredentials: true,
            }
          );

          if (response?.data?.success) {
            setProcessedByCenter(response?.data?.data);
            Swal.fire(`${response?.data?.message}`, "", "success")?.then(
              (result) => {
                if (result?.isConfirmed) {
                  refreshData();
                }
              }
            );
          } else {
            toast.error(response?.data?.message || "Failed to Process.");
          }
        } catch (error) {
          setProcessedByCenterError(
            error.response?.data?.message ||
              "An error occurred. Please try again."
          );
          toast.error(
            error.response?.data?.message ||
              "An error occurred. Please try again."
          );
        } finally {
          setProcessedByCenterLoading(false);
        }
      } else {
        Swal.fire("Action canceled", "", "info");
      }
    });
  };

  const UpdateProcessedByUniversity = async (MarkAsByUniversity, StudentId) => {
    if (!MarkAsByUniversity) {
      toast.error("Not Processed is missing.");
      return;
    }

    Swal.fire({
      title: `Mark As Processed By Center ?`,
      showCancelButton: true,
      confirmButtonText: "Process ?",
      cancelButtonText: `Cancel`,
      customClass: {
        cancelButton: "custom-cancel-button",
        confirmButton: "custom-confirm2-button",
      },
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setProcessedByUniversityLoading(true);
          const response = await axios.patch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/update-status-processed-university`,
            {
              MarkAsByUniversity,
              StudentId,
            },
            {
              withCredentials: true,
            }
          );

          if (response?.data?.success) {
            setProcessedByUniversity(response?.data?.data);
            Swal.fire(`${response?.data?.message}`, "", "success")?.then(
              (result) => {
                if (result?.isConfirmed) {
                  refreshData();
                }
              }
            );
          } else {
            Swal.fire(
              `${response?.data?.message || "Failed to Process University!"}`,
              "",
              "success"
            );
          }
        } catch (error) {
          setProcessedByUniversityError(
            error.response?.data?.message ||
              "An error occurred. Please try again."
          );
          toast.error(
            error.response?.data?.message ||
              "An error occurred. Please try again."
          );
        } finally {
          setProcessedByUniversityLoading(false);
        }
      } else {
        Swal.fire("Action canceled", "", "info");
      }
    });
  };

  return {
    ProcessedByCenterLoading,
    ProcessedByCenterError,
    ProcessedByCenter,
    UpdateProcessedByCenter,

    UpdateProcessedByUniversity,
    ProcessedByUniversityLoading,
    ProcessedByUniversityError,
    ProcessedByUniversity,
  };
};

export default UseProcessedByCenter;
