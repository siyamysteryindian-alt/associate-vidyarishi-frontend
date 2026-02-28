import React, { useEffect, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { GrDocumentPdf } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import ImageToPdf from "../../../../../Helper/ImageToPdf";
import jsPDF from "jspdf";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Responsive DownloadOnStudent modal
 *
 * - Header & Footer sticky
 * - Body scrolls when tall content
 * - Responsive grid (1 column on small screens, 2 on >= sm)
 * - Auto-updates AllDocumentsImages from DownloadApplnOnStudentId
 */
const DownloadOnStudent = ({
  DownloadApplnOnStudentId,
  HandleDownloadStudentDataclose,
}) => {
  const [AllDocumentsImages, setAllDocumentsImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Build flattened list of all images whenever the student data changes
  useEffect(() => {
    if (!DownloadApplnOnStudentId) {
      setAllDocumentsImages([]);
      return;
    }

    const otherAcademics =
      DownloadApplnOnStudentId?.OtherAcademics?.AllOtherPhotos?.photos || [];
    const ug =
      DownloadApplnOnStudentId?.underGradutaion?.AllUnderGraduationPhotos
        ?.photos || [];
    const pg =
      DownloadApplnOnStudentId?.postGraduation?.AllPostGraduationPhotos
        ?.photos || [];

    const ssc = DownloadApplnOnStudentId?.highSchool?.marksheet;
    const hsc = DownloadApplnOnStudentId?.intermediate?.marksheet;
    const aadhar = DownloadApplnOnStudentId?.documents?.aadhar?.aadharPhoto;
    const profilePhoto =
      DownloadApplnOnStudentId?.documents?.photo?.studentPhoto;
    const signature =
      DownloadApplnOnStudentId?.documents?.studentSignature?.studentSignPhoto;
    const parentSign =
      DownloadApplnOnStudentId?.documents?.parentSignature?.ParentSignPhoto;
    const affidavit =
      DownloadApplnOnStudentId?.documents?.aafidavit?.aafidavitPhoto;
    const migration =
      DownloadApplnOnStudentId?.documents?.migration?.migrationPhoto;
    const abcId = DownloadApplnOnStudentId?.documents?.ABCID?.ABCIDPhoto;
    const otherDoc = DownloadApplnOnStudentId?.documents?.other?.otherPhoto;

    const combined = [
      ...otherAcademics,
      ...ug,
      ...pg,
      ssc,
      hsc,
      aadhar,
      profilePhoto,
      signature,
      parentSign,
      affidavit,
      migration,
      abcId,
      otherDoc,
    ].filter(Boolean);

    setAllDocumentsImages(combined);
  }, [DownloadApplnOnStudentId]);

  // If you want to trigger recompute on-demand (matching your earlier API)
  const HandleDownloadApplicationForm = () => {
    // kept for compatibility: this function mirrors the previous behavior
    // but the effect above already sets images whenever the student changes.
    if (!DownloadApplnOnStudentId) {
      setAllDocumentsImages([]);
      return;
    }

    // This simply re-triggers the effect logic by reusing its implementation
    const otherAcademics =
      DownloadApplnOnStudentId?.OtherAcademics?.AllOtherPhotos?.photos || [];
    const ug =
      DownloadApplnOnStudentId?.underGradutaion?.AllUnderGraduationPhotos
        ?.photos || [];
    const pg =
      DownloadApplnOnStudentId?.postGraduation?.AllPostGraduationPhotos
        ?.photos || [];

    const ssc = DownloadApplnOnStudentId?.highSchool?.marksheet;
    const hsc = DownloadApplnOnStudentId?.intermediate?.marksheet;
    const aadhar = DownloadApplnOnStudentId?.documents?.aadhar?.aadharPhoto;
    const profilePhoto =
      DownloadApplnOnStudentId?.documents?.photo?.studentPhoto;
    const signature =
      DownloadApplnOnStudentId?.documents?.studentSignature?.studentSignPhoto;
    const parentSign =
      DownloadApplnOnStudentId?.documents?.parentSignature?.ParentSignPhoto;
    const affidavit =
      DownloadApplnOnStudentId?.documents?.aafidavit?.aafidavitPhoto;
    const migration =
      DownloadApplnOnStudentId?.documents?.migration?.migrationPhoto;
    const abcId = DownloadApplnOnStudentId?.documents?.ABCID?.ABCIDPhoto;
    const otherDoc = DownloadApplnOnStudentId?.documents?.other?.otherPhoto;

    const combined = [
      ...otherAcademics,
      ...ug,
      ...pg,
      ssc,
      hsc,
      aadhar,
      profilePhoto,
      signature,
      parentSign,
      affidavit,
      migration,
      abcId,
      otherDoc,
    ].filter(Boolean);

    setAllDocumentsImages(combined);
  };

  const generateApplicationPdf = async (action) => {
    if (!DownloadApplnOnStudentId?._id) {
      toast.error("Student ID is missing. Please provide a valid ID.");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/GenerateReportPdfLib`,
        { studentid: DownloadApplnOnStudentId?._id },
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      if (action === "save") {
        const link = document.createElement("a");
        link.href = url;
        link.download = `Student_Report_${
          DownloadApplnOnStudentId?.applicationNumber || "report"
        }.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else if (action === "print") {
        window.open(url, "_blank");
      }

      // cleanup
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error("generateApplicationPdf error:", error);
      toast.error(
        error?.response?.status === 400
          ? "Student Form Is Incomplete"
          : "Failed to generate the PDF. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-11/12 sm:w-10/12 md:w-3/4 lg:w-2/3 max-w-4xl rounded-2xl shadow-2xl border"
        style={{
          background: "var(--surface)",
          borderColor: "rgba(16,24,40,0.06)",
          boxShadow: "var(--soft-shadow)",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header (sticky) */}
        <div
          className="flex items-start justify-between px-5 py-3 border-b"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: "var(--surface)",
            borderColor: "rgba(16,24,40,0.03)",
          }}
        >
          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-800">
              Download Options
            </div>
            {DownloadApplnOnStudentId?.applicationNumber && (
              <div className="text-[11px] text-slate-500 mt-0.5">
                {DownloadApplnOnStudentId?.fullName} •{" "}
                <span className="font-mono">
                  {DownloadApplnOnStudentId?.applicationNumber}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={HandleDownloadStudentDataclose}
              aria-label="Close"
              className="rounded-full p-1 hover:bg-red-50 transition"
              style={{ color: "#ef4444" }}
            >
              <IoClose size={22} />
            </button>
          </div>
        </div>

        {/* Body (scrollable) */}
        <div
          className="px-6 py-6 overflow-y-auto"
          style={{
            maxHeight:
              "calc(90vh - 136px)" /* leaves space for header + footer */,
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* All Documents Card */}
            <div
              className="rounded-xl px-4 py-5 flex flex-col items-center justify-between transition border hover:shadow-md cursor-pointer"
              style={{
                borderColor: "rgba(16,24,40,0.04)",
                background: "var(--bg, rgba(249,250,251,0.8))",
              }}
              onClick={HandleDownloadApplicationForm}
            >
              <div className="flex flex-col items-center gap-3">
                <FaRegFilePdf size={64} className="text-red-500" />
                <div className="text-sm font-semibold">All Documents</div>
                <p className="text-[11px] text-center text-slate-500 max-w-[18rem]">
                  Merge uploaded academic & personal documents into a single PDF
                  file.
                </p>
              </div>

              <div className="mt-4 w-full flex flex-col gap-2 items-center sm:items-stretch">
                {/* ImageToPdf component (keeps your logic) */}
                <ImageToPdf
                  images={AllDocumentsImages}
                  HandleDownloadApplicationForm={HandleDownloadApplicationForm}
                />
                {/* show count for clarity */}
                <div className="text-[11px] text-slate-500 mt-2">
                  Documents ready: {AllDocumentsImages?.length || 0}
                </div>
              </div>
            </div>

            {/* Application Form Card */}
            <div
              className="rounded-xl px-4 py-5 flex flex-col items-center justify-between transition border hover:shadow-md"
              style={{
                borderColor: "rgba(16,24,40,0.04)",
                background: "var(--bg, rgba(249,250,251,0.8))",
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <GrDocumentPdf size={64} className="text-blue-500" />
                <div className="text-sm font-semibold">Application Form</div>
                <p className="text-[11px] text-center text-slate-500 max-w-[18rem]">
                  Download or print the compiled application form generated from
                  the student's data.
                </p>
              </div>

              <div className="mt-4 w-full flex flex-col gap-2 items-center sm:items-stretch">
                <button
                  onClick={() => generateApplicationPdf("save")}
                  disabled={isGenerating}
                  className="w-full sm:w-auto text-xs px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
                >
                  {isGenerating ? "Preparing..." : "Download PDF"}
                </button>

                <button
                  onClick={() => generateApplicationPdf("print")}
                  disabled={isGenerating}
                  className="w-full sm:w-auto text-xs px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
                >
                  Print PDF
                </button>
              </div>
            </div>
          </div>

          {/* optional: show a small preview of gathered docs (thumbnail grid) */}
          {AllDocumentsImages?.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">
                Preview documents
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {AllDocumentsImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="w-full h-20 bg-white rounded-md overflow-hidden border"
                    style={{ borderColor: "rgba(16,24,40,0.04)" }}
                  >
                    {/* defensive img rendering: if src is a blob/data url or remote url */}
                    <img
                      src={src}
                      alt={`doc-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer (sticky) */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 40,
            background: "var(--surface)",
            borderColor: "rgba(16,24,40,0.03)",
          }}
        >
          <button
            onClick={HandleDownloadStudentDataclose}
            className="text-[11px] px-4 py-1.5 rounded-lg border text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadOnStudent;
