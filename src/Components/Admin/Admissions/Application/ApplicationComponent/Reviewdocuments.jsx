import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import Markaspendency from "./Markaspendency";
import axios from "axios";
import toast from "react-hot-toast";

const ReviewDocuments = ({
  setRefreshApplications,
  HandleReviewDocClose,
  CompleteStudentData,
}) => {
  const [BooleanMarkAsPendency, setBooleanMarkAsPendency] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For preview modal

  const HandleMarkAsPendencyOpen = () => setBooleanMarkAsPendency(true);
  const HandleMarkAsPendencyClose = () => setBooleanMarkAsPendency(false);

  const HandleApproveDocuments = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/approval-for-documents`,
        { StudentId: CompleteStudentData?._id },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        HandleReviewDocClose();
        setRefreshApplications(true);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const RenderDocCard = (title, src) => {
    if (!src) return null;
    return (
      <button
        type="button"
        className="group w-36 h-32 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer flex flex-col overflow-hidden"
        onClick={() => setSelectedImage({ title, src })}
      >
        <div className="text-[11px] font-semibold tracking-wide px-2 py-1 text-center bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 border-b border-slate-200/70 dark:border-slate-700">
          {title}
        </div>
        <div className="flex-1 flex items-center justify-center p-2 bg-slate-50/60 dark:bg-slate-900/40">
          <img
            src={src}
            alt={title}
            className="max-h-full max-w-full object-contain group-hover:scale-[1.03] transition-transform duration-150"
          />
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Main Overlay */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto py-8">
        <div className="bg-white dark:bg-slate-900 dark:text-white rounded-2xl w-[95%] max-w-6xl shadow-2xl border border-slate-200/70 dark:border-slate-800 max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-bold tracking-wide">
                Review & Verify Documents
              </h2>
              {CompleteStudentData?.fullName && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {CompleteStudentData?.fullName} •{" "}
                  <span className="uppercase tracking-wide">
                    {CompleteStudentData?.applicationNumber}
                  </span>
                </p>
              )}
            </div>
            <button onClick={HandleReviewDocClose}>
              <IoClose
                size={26}
                className="text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1 transition-colors duration-150"
              />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pt-5 pb-4 space-y-6 overflow-y-auto flex-1">
            {CompleteStudentData?._id ? (
              <>
                {/* Personal Documents */}
                <section className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300">
                      Personal Documents
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {RenderDocCard(
                      "Photo",
                      CompleteStudentData?.documents?.photo?.studentPhoto
                    )}
                    {RenderDocCard(
                      "Aadhaar Front",
                      CompleteStudentData?.documents?.aadhar?.aadharPhoto
                    )}
                    {RenderDocCard(
                      "Aadhaar Back",
                      CompleteStudentData?.documents?.aadharBack
                        ?.aadharBackPhoto
                    )}
                    {RenderDocCard(
                      "Student Sign",
                      CompleteStudentData?.documents?.studentSignature
                        ?.studentSignPhoto
                    )}
                    {RenderDocCard(
                      "Parent Sign",
                      CompleteStudentData?.documents?.parentSignature
                        ?.ParentSignPhoto
                    )}
                    {RenderDocCard(
                      "Migration",
                      CompleteStudentData?.documents?.migration?.migrationPhoto
                    )}
                    {RenderDocCard(
                      "Affidavit",
                      CompleteStudentData?.documents?.aafidavit?.aafidavitPhoto
                    )}
                    {RenderDocCard(
                      "Other",
                      CompleteStudentData?.documents?.other?.otherPhoto
                    )}
                    {RenderDocCard(
                      "DEB Id",
                      CompleteStudentData?.documents?.DEBID?.DEBIDPhoto
                    )}
                    {RenderDocCard(
                      "ABC Id",
                      CompleteStudentData?.documents?.ABCID?.ABCIDPhoto
                    )}
                  </div>
                </section>

                {/* Academic Documents */}
                <section className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300">
                      Academic Documents
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {RenderDocCard(
                      "SSC Marksheet",
                      CompleteStudentData?.highSchool?.marksheet
                    )}
                    {RenderDocCard(
                      "HSC Marksheet",
                      CompleteStudentData?.intermediate?.marksheet
                    )}
                  </div>
                </section>

                {/* Under Graduation */}
                <section className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300">
                      Under Graduation Documents
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {CompleteStudentData?.underGradutaion?.AllUnderGraduationPhotos.photos?.map(
                      (photo, inx) =>
                        RenderDocCard(`Under Graduation ${inx + 1}`, photo)
                    )}
                  </div>
                </section>

                {/* Post Graduation */}
                <section className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300">
                      Post Graduation Documents
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {CompleteStudentData?.postGraduation?.AllPostGraduationPhotos.photos?.map(
                      (photo, inx) =>
                        RenderDocCard(`Post Graduation ${inx + 1}`, photo)
                    )}
                  </div>
                </section>

                {/* Other Academic */}
                <section className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-900/60 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300">
                      Other Academic Documents
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {CompleteStudentData?.OtherAcademics?.AllOtherPhotos.photos?.map(
                      (photo, inx) =>
                        RenderDocCard(`Other Academics ${inx + 1}`, photo)
                    )}
                  </div>
                </section>
              </>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No documents available for this student.
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center gap-4 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Click on any document card to view it in full size.
            </div>
            <div className="flex gap-3">
              <button
                onClick={HandleMarkAsPendencyOpen}
                className="px-5 py-2 rounded-lg text-[11px] font-semibold border border-red-500 text-red-600 hover:bg-red-500 hover:text-white flex items-center gap-2 transition-colors"
              >
                <MdDelete size={14} />
                Mark As Pendency
              </button>
              <button
                onClick={HandleApproveDocuments}
                className="px-6 py-2 rounded-lg text-[11px] font-semibold border border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-w-5xl w-full px-6">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 right-4 text-white hover:text-red-400 transition-colors"
            >
              <IoClose size={32} />
            </button>
            <h3 className="text-white text-center mb-4 font-semibold text-sm">
              {selectedImage.title}
            </h3>
            <div className="bg-black/40 rounded-xl p-3 border border-slate-600">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {BooleanMarkAsPendency && (
        <Markaspendency
          setRefreshApplications={setRefreshApplications}
          HandleReviewDocClose={HandleReviewDocClose}
          HandleMarkAsPendencyClose={HandleMarkAsPendencyClose}
          CompleteStudentData={CompleteStudentData}
        />
      )}
    </>
  );
};

export default ReviewDocuments;
