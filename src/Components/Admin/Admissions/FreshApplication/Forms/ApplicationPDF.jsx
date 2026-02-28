import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Loader from "../../../../../Helper/Loader";
import Loader2 from "../../../../../Helper/Loader2";

const ApplicationPDF = () => {
  const StudentIdByReduxStore = useSelector((state) => state?.studentId);

  const [loading, setLoading] = useState({
    preview: false,
    download: false,
    print: false,
  });

  const [error, setError] = useState({
    preview: null,
  });

  const [studentData, setStudentData] = useState(null);

  /**
   * Fetch student application form preview details (HTML).
   */
  const fetchStudentDetails = async (studentId) => {
    try {
      setLoading((prev) => ({ ...prev, preview: true }));
      setError((prev) => ({ ...prev, preview: null }));

      if (!studentId) {
        throw new Error("Student ID is missing. Cannot fetch data.");
      }

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/GetStudentsByIdForGeneratingPdf/${studentId}`,
        { withCredentials: true }
      );

      // Backend agar sirf HTML bhej raha hai:
      // response.data ko hi store kar rahe hain.
      setStudentData(response?.data || null);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch details.";
      setError((prev) => ({
        ...prev,
        preview: msg,
      }));
      toast.error(msg);
    } finally {
      setLoading((prev) => ({ ...prev, preview: false }));
    }
  };

  /**
   * Common function to handle PDF download/print.
   */
  const handlePdfAction = async (studentId, action) => {
    try {
      setLoading((prev) => ({ ...prev, [action]: true }));

      if (!studentId) {
        throw new Error("Student ID is missing. Cannot generate PDF.");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/GenerateReportPdfLib`,
        { studentid: studentId },
        { responseType: "blob", withCredentials: true }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      if (action === "download") {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Report_${studentId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else if (action === "print") {
        window.open(url, "_blank");
      }

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.status === 400
          ? "Student form is incomplete."
          : err.response?.data?.message || "An error occurred."
      );
    } finally {
      setLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  /**
   * Fetch student details on mount / on ID change.
   */
  useEffect(() => {
    if (StudentIdByReduxStore?.id) {
      fetchStudentDetails(StudentIdByReduxStore.id);
    }
  }, [StudentIdByReduxStore?.id]);

  // HTML handle (string ya object ke andar html field)
  const getHtmlContent = () => {
    if (typeof studentData === "string") return studentData;
    if (studentData?.html) return studentData.html;
    return "";
  };

  const studentId = StudentIdByReduxStore?.id;
  const actionsDisabled = !studentId || loading.download || loading.print;

  return (
    <div className="bg-transparent">
      {/* Success message */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10 mb-2">
          <svg
            className="h-7 w-7 text-emerald-600 dark:text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              className="stroke-current"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M8 12.5L10.5 15L16 9.5"
              className="stroke-current"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-base md:text-lg font-semibold text-emerald-700 dark:text-emerald-400">
          Application submitted successfully
        </h2>
        <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
          We’ve received the application details. You can download or print the
          application PDF for your records.
        </p>

        {studentId && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Application ID
            </span>
            <span className="text-[11px] font-mono text-slate-800 dark:text-slate-100">
              {studentId}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-3 mt-4 px-1">
        <button
          onClick={() => handlePdfAction(studentId, "print")}
          disabled={actionsDisabled}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs md:text-sm font-semibold text-white
            bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all
            disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {loading.print ? <Loader2 /> : <span>Print PDF</span>}
        </button>

        <button
          onClick={() => handlePdfAction(studentId, "download")}
          disabled={actionsDisabled}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs md:text-sm font-semibold
            border border-emerald-500 text-emerald-600 dark:text-emerald-400
            bg-emerald-50/60 dark:bg-slate-900
            hover:bg-emerald-100/80 dark:hover:bg-slate-800 transition-all
            disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {loading.download ? <Loader2 /> : <span>Download PDF</span>}
        </button>
      </div>

      {/* Preview Section */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            Application preview
          </p>
          <span className="text-[10px] text-slate-400">
            This is a read-only preview of the submitted form
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 p-3 max-h-[55vh] overflow-y-auto">
          {loading.preview ? (
            <div className="flex justify-center items-center py-10">
              <Loader />
            </div>
          ) : error.preview ? (
            <div className="text-center py-6 text-xs md:text-sm text-red-500">
              {error.preview}
            </div>
          ) : getHtmlContent() ? (
            <div className="bg-white dark:bg-slate-950 rounded-lg shadow-sm p-4 text-xs md:text-sm text-slate-800 dark:text-slate-100">
              <div
                dangerouslySetInnerHTML={{
                  __html: getHtmlContent(),
                }}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-xs md:text-sm text-slate-400">
              Preview will be available once the application data is fully
              processed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationPDF;
