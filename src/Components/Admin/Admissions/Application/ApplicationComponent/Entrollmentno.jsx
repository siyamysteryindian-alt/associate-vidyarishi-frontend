import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

const Entrollmentno = ({
  CompleteStudentData,
  HandleEnrollmentNumberClose,
  setRefreshApplications,
}) => {
  // For handling Enrollment Number as a string value
  const [EnrollmentNo, setEnrollmentNo] = useState(
    CompleteStudentData?.EnrollmentNo
  );

  const HandlEnrollment = (e) => {
    setEnrollmentNo(e.target.value);
  };

  const HandleSubmitEnrollmentNo = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/EnrollmentUpdate`,
        {
          StudentId: CompleteStudentData?._id,
          EntrollmentNo:
            CompleteStudentData?.EnrollmentNo !== "" ? "" : EnrollmentNo,
        },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        HandleEnrollmentNumberClose();
        setRefreshApplications(true);
        setTimeout(() => {
          setRefreshApplications(false);
        }, 600);
        if (EnrollmentNo === "") {
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const HandleSubmitEnrollmentNoDelete = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/EnrollmentUpdate`,
        {
          StudentId: CompleteStudentData?._id,
          EntrollmentNo: "",
        },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        HandleEnrollmentNumberClose();
        setRefreshApplications(true);
        setTimeout(() => {
          setRefreshApplications(false);
        }, 600);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl w-[80vh] max-w-xl shadow-2xl border border-slate-200/70 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold tracking-wide">
            Enrollment Number
          </h2>
          <button onClick={HandleEnrollmentNumberClose}>
            <IoClose
              size={26}
              className="text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1 transition-colors duration-150"
            />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-2">
          <label
            htmlFor="EnrollmentNo"
            className="block text-[11px] font-semibold text-gray-700 dark:text-gray-200 mb-1.5 uppercase tracking-wide"
          >
            Enrollment No
          </label>
          <input
            type="text"
            id="EnrollmentNo"
            value={EnrollmentNo || ""}
            onChange={HandlEnrollment}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter Enrollment Number"
            required
          />
          <p className="mt-1 text-[11px] text-slate-500">
            This enrollment number will be used for university records and
            tracking.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-700">
          {CompleteStudentData?.EnrollmentNo !== "" && (
            <button
              onClick={HandleSubmitEnrollmentNoDelete}
              className="px-4 py-1.5 inline-flex items-center gap-2 rounded-md text-xs font-semibold border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
            >
              <MdDelete size={14} />
              Delete
            </button>
          )}

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={HandleEnrollmentNumberClose}
              className="px-4 py-1.5 rounded-md text-xs font-semibold border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={HandleSubmitEnrollmentNo}
              className="px-6 py-1.5 rounded-md text-xs font-semibold border border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entrollmentno;
