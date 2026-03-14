import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import Loader from "../../../../../Helper/Loader";

const Markaspendency = ({
  setRefreshApplications,
  HandleReviewDocClose,
  HandleMarkAsPendencyClose,
  CompleteStudentData,
}) => {
  const [MarkasPendencyData, setMarkasPendencyData] = useState({
    photo: "",
    aadhar: "",
    aadharBack: "",
    studentSignature: "",
    parentSignature: "",
    other: "",
    aafidavit: "",
    migration: "",
    ABCID: "",
    DEBID: "",
  });

  const [MarkasPendencyOnAcademicsData, setMarkasPendencyOnAcademicsData] =
    useState({
      HighSchoolMarksheet: "",
      IntermediateMarksheet: "",
      underGraduationMarksheet: "",
      postGraduationMarksheet: "",
      otherMarksheet: "",
    });

  const HandleInputOnchange = (e) => {
    const { name, value } = e.target;
    setMarkasPendencyData((preve) => ({
      ...preve,
      [name]: value,
    }));
    setMarkasPendencyOnAcademicsData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  useEffect(() => {}, [MarkasPendencyData]);

  const [BooleanCheckBox, setBooleanCheckBox] = useState({
    photo: false,
    aadhar: false,
    aadharBack: false,
    studentSignature: false,
    parentSignature: false,
    other: false,
    aafidavit: false,
    migration: false,
    highschool: false,
    intermediate: false,
    underGraduation: false,
    postGraduation: false,
    otherAcademic: false,
    ABCID: false,
    DEBID: false,
  });

  const HandleOncheckBox = (e) => {
    const { name, checked } = e.target;

    setBooleanCheckBox((preve) => ({
      ...preve,
      [name]: checked,
    }));

    setMarkasPendencyData((preve) => ({
      ...preve,
      [name]: checked ? preve[name] : "",
    }));
  };

  const ReduxLoggedUser = useSelector((state) => state.user);

  const [LoadingPendency, setLoadingPendency] = useState(false);
  const [ErrorPendency, setErrorPendency] = useState(false);

  const HandleSubmitPendency = async () => {
    try {
      setLoadingPendency(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/mark-as-pendency-remark`,
        {
          StudentId: CompleteStudentData?._id,
          photo: MarkasPendencyData?.photo,
          aadhar: MarkasPendencyData?.aadhar,
          aadharBack: MarkasPendencyData?.aadharBack,
          studentSignature: MarkasPendencyData?.studentSignature,
          parentSignature: MarkasPendencyData?.parentSignature,
          migration: MarkasPendencyData?.migration,
          other: MarkasPendencyData?.other,
          ABCID: MarkasPendencyData?.ABCID,
          DEBID: MarkasPendencyData?.DEBID,
          aafidavit: MarkasPendencyData?.aafidavit,
          HighSchoolMarksheet:
            MarkasPendencyOnAcademicsData?.HighSchoolMarksheet,
          IntermediateMarksheet:
            MarkasPendencyOnAcademicsData?.IntermediateMarksheet,
          UnderGraduateMarksheet:
            MarkasPendencyOnAcademicsData?.underGraduationMarksheet,
          PostGraduateMarksheet:
            MarkasPendencyOnAcademicsData?.postGraduationMarksheet,
          OtherMarksheet: MarkasPendencyOnAcademicsData?.otherMarksheet,
        },
        {
          withCredentials: true,
        },
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        HandleMarkAsPendencyClose();
        HandleReviewDocClose();
        setRefreshApplications(true);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      setErrorPendency(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setLoadingPendency(false);
    }
  };

  useEffect(() => {}, [BooleanCheckBox]);

  return (
    // <div className="absolute z-30 inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
    <div className="fixed z-[9999] inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="flex justify-center items-center mt-4 mb-4 w-full px-4">
        <div className="bg-white dark:bg-slate-900 dark:text-white rounded-2xl w-[90vw] max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide">
                Mark as Pendency
              </span>
              {CompleteStudentData?.applicationNumber && (
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {CompleteStudentData?.fullName} •{" "}
                  <span className="font-mono">
                    {CompleteStudentData?.applicationNumber}
                  </span>
                </span>
              )}
            </div>
            <button onClick={HandleMarkAsPendencyClose}>
              <IoClose
                size={26}
                className="text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1 transition-colors"
              />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {LoadingPendency && (
              <div className="flex justify-center mb-3">
                <Loader />
              </div>
            )}

            {ErrorPendency && (
              <div className="mb-3 text-xs text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {ErrorPendency}
              </div>
            )}

            <div className="mb-4 text-[11px] text-slate-500">
              Select the documents that have issues and add specific remarks so
              the center/counsellor can re-upload them correctly.
            </div>

            <div className="space-y-3 text-xs">
              {/* Photo */}
              {CompleteStudentData?.documents?.photo?.remark !== " " &&
                CompleteStudentData?.documents?.photo?.studentPhoto !== "" && (
                  <div>
                    <div
                      className={`flex cursor-pointer items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.photo &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        }`}
                    >
                      <input
                        id="photo"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="photo"
                        className="hidden"
                      />
                      <label
                        htmlFor="photo"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        Photo
                      </label>
                    </div>
                    {BooleanCheckBox?.photo &&
                      CompleteStudentData?.documents?.photo?.remark !== " " &&
                      !CompleteStudentData?.documents?.photo?.pendency && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          value={MarkasPendencyData?.photo}
                          onChange={HandleInputOnchange}
                          name="photo"
                          placeholder="Remark for Photo"
                        />
                      )}
                  </div>
                )}

              {/* Aadhaar Front */}
              {CompleteStudentData?.documents?.aadhar?.remark !== " " &&
                CompleteStudentData?.documents?.aadhar?.aadharPhoto !== "" && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.aadhar &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="aadhar"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="aadhar"
                        className="hidden"
                      />
                      <label
                        htmlFor="aadhar"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        Aadhaar Front
                      </label>
                    </div>

                    {BooleanCheckBox?.aadhar &&
                      CompleteStudentData?.documents?.aadhar?.remark !== " " &&
                      !CompleteStudentData?.documents?.aadhar?.pendency && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          name="aadhar"
                          onChange={HandleInputOnchange}
                          value={MarkasPendencyData?.aadhar}
                          placeholder="Remark for Aadhaar Front"
                        />
                      )}
                  </div>
                )}

              {/* Aadhaar Back */}
              {CompleteStudentData?.documents?.aadharBack?.remark !== " " &&
                CompleteStudentData?.documents?.aadharBack?.aadharBackPhoto !==
                  "" && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.aadharBack &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="aadharBack"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="aadharBack"
                        className="hidden"
                      />
                      <label
                        htmlFor="aadharBack"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        Aadhaar Back
                      </label>
                    </div>

                    {BooleanCheckBox?.aadharBack &&
                      CompleteStudentData?.documents?.aadharBack?.remark !==
                        " " &&
                      !CompleteStudentData?.documents?.aadharBack?.pendency && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          name="aadharBack"
                          onChange={HandleInputOnchange}
                          value={MarkasPendencyData?.aadharBack}
                          placeholder="Remark for Aadhaar Back"
                        />
                      )}
                  </div>
                )}

              {/* Student Signature */}
              {CompleteStudentData?.documents?.studentSignature
                ?.studentSignPhoto !== "" &&
                CompleteStudentData?.documents?.studentSignature?.remark !==
                  " " && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.studentSignature &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="studentSignature"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="studentSignature"
                        className="hidden"
                      />
                      <label
                        htmlFor="studentSignature"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        Student Signature
                      </label>
                    </div>

                    {BooleanCheckBox?.studentSignature &&
                      CompleteStudentData?.documents?.studentSignature
                        ?.remark !== " " &&
                      !CompleteStudentData?.documents?.studentSignature
                        ?.pendency && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          name="studentSignature"
                          onChange={HandleInputOnchange}
                          value={MarkasPendencyData?.studentSignature}
                          placeholder="Remark for Student Signature"
                        />
                      )}
                  </div>
                )}

              {/* Parent Signature */}
              {CompleteStudentData?.documents?.parentSignature
                ?.ParentSignPhoto !== "" &&
                CompleteStudentData?.documents?.studentSignature?.remark !==
                  " " && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.parentSignature &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="parentSignature"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="parentSignature"
                        className="hidden"
                      />
                      <label
                        htmlFor="parentSignature"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        Parent Signature
                      </label>
                    </div>

                    {BooleanCheckBox?.parentSignature &&
                      CompleteStudentData?.documents?.parentSignature
                        ?.remark !== " " &&
                      !CompleteStudentData?.documents?.parentSignature
                        ?.pendency && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          onChange={HandleInputOnchange}
                          value={MarkasPendencyData?.parentSignature}
                          name="parentSignature"
                          placeholder="Remark for Parent Signature"
                        />
                      )}
                  </div>
                )}

              {/* Migration */}
              {CompleteStudentData?.documents?.migration?.remark !== " " &&
                CompleteStudentData?.documents?.migration?.migrationPhoto !==
                  "" && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.migration &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="migration"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="migration"
                        className="hidden"
                      />
                      <label
                        htmlFor="migration"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        Migration
                      </label>
                    </div>
                    {BooleanCheckBox?.migration &&
                      CompleteStudentData?.documents?.migration?.remark !==
                        " " &&
                      !CompleteStudentData?.documents?.migration?.pendency && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          onChange={HandleInputOnchange}
                          value={MarkasPendencyData?.migration}
                          name="migration"
                          placeholder="Remark for Migration"
                        />
                      )}
                  </div>
                )}

              {/* Aafidavit */}
              {CompleteStudentData?.documents?.aafidavit?.remark !== " " &&
                CompleteStudentData?.documents?.aafidavit?.aafidavitPhoto !==
                  "" && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.aafidavit &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="aafidavit"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="aafidavit"
                        className="hidden"
                      />
                      <label
                        htmlFor="aafidavit"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        Affidavit
                      </label>
                    </div>

                    {BooleanCheckBox?.aafidavit &&
                      CompleteStudentData?.documents?.aafidavit?.remark !==
                        " " &&
                      !CompleteStudentData?.documents?.aafidavit?.pendency && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          onChange={HandleInputOnchange}
                          name="aafidavit"
                          value={MarkasPendencyData?.aafidavit}
                          placeholder="Remark for Affidavit"
                        />
                      )}
                  </div>
                )}

              {/* Other Doc */}
              {CompleteStudentData?.documents?.other?.remark !== " " &&
                CompleteStudentData?.documents?.other?.otherPhoto !== "" && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.other &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="other"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="other"
                        className="hidden"
                      />
                      <label
                        htmlFor="other"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        Other Document
                      </label>
                    </div>

                    {BooleanCheckBox?.other &&
                      CompleteStudentData?.documents?.other?.remark !== " " &&
                      !CompleteStudentData?.documents?.other?.pendency && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          name="other"
                          onChange={HandleInputOnchange}
                          value={MarkasPendencyData?.other}
                          placeholder="Remark for Other Document"
                        />
                      )}
                  </div>
                )}

              {/* ABCID */}
              {CompleteStudentData?.documents?.ABCID?.remark !== " " &&
                CompleteStudentData?.documents?.ABCID?.ABCIDPhoto !== "" && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.ABCID &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="ABCID"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="ABCID"
                        className="hidden"
                      />
                      <label
                        htmlFor="ABCID"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        ABCID
                      </label>
                    </div>

                    {BooleanCheckBox?.ABCID &&
                      CompleteStudentData?.documents?.ABCID?.remark !== " " &&
                      !CompleteStudentData?.documents?.ABCID?.pendency && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          name="ABCID"
                          onChange={HandleInputOnchange}
                          value={MarkasPendencyData?.ABCID}
                          placeholder="Remark for ABCID"
                        />
                      )}
                  </div>
                )}

              {/* DEBID */}
              {CompleteStudentData?.documents?.DEBID?.remark !== " " &&
                CompleteStudentData?.documents?.DEBID?.ABCIDPhoto !== "" && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.DEBID &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="DEBID"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="DEBID"
                        className="hidden"
                      />
                      <label
                        htmlFor="DEBID"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        DEBID
                      </label>
                    </div>

                    {BooleanCheckBox?.DEBID &&
                      CompleteStudentData?.documents?.DEBID?.remark !== " " &&
                      !CompleteStudentData?.documents?.DEBID?.pendency && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          name="DEBID"
                          onChange={HandleInputOnchange}
                          value={MarkasPendencyData?.DEBID}
                          placeholder="Remark for DEBID"
                        />
                      )}
                  </div>
                )}

              {/* High School */}
              {CompleteStudentData?.highSchool?.marksheetRemark !== " " &&
                CompleteStudentData?.highSchool?.marksheet && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.highschool &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="highschool"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="highschool"
                        className="hidden"
                      />
                      <label
                        htmlFor="highschool"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        High School Marksheet
                      </label>
                    </div>

                    {BooleanCheckBox?.highschool &&
                      CompleteStudentData?.highSchool?.marksheetRemark !==
                        " " && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          onChange={HandleInputOnchange}
                          value={
                            MarkasPendencyOnAcademicsData?.HighSchoolMarksheet
                          }
                          name="HighSchoolMarksheet"
                          placeholder="Remark for High School Marksheet"
                        />
                      )}
                  </div>
                )}

              {/* Intermediate */}
              {CompleteStudentData?.intermediate?.marksheetRemark !== " " &&
                CompleteStudentData?.intermediate?.marksheet !== "" && (
                  <div>
                    <div
                      className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                        border-gray-200 dark:border-gray-700 ${
                          BooleanCheckBox?.intermediate &&
                          "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                        } cursor-pointer`}
                    >
                      <input
                        id="intermediate"
                        type="checkbox"
                        onChange={HandleOncheckBox}
                        name="intermediate"
                        className="hidden"
                      />
                      <label
                        htmlFor="intermediate"
                        className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                      >
                        Intermediate Marksheet
                      </label>
                    </div>

                    {BooleanCheckBox?.intermediate &&
                      CompleteStudentData?.intermediate?.marksheetRemark !==
                        " " && (
                        <input
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                          type="text"
                          onChange={HandleInputOnchange}
                          value={
                            MarkasPendencyOnAcademicsData?.IntermediateMarksheet
                          }
                          name="IntermediateMarksheet"
                          placeholder="Remark for Intermediate Marksheet"
                        />
                      )}
                  </div>
                )}

              {/* Under Graduation */}
              {CompleteStudentData?.underGradutaion?.AllUnderGraduationPhotos
                ?.remark !== " " && (
                <div>
                  <div
                    className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                      border-gray-200 dark:border-gray-700 ${
                        BooleanCheckBox?.underGraduation &&
                        "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                      } cursor-pointer`}
                  >
                    <input
                      id="underGraduation"
                      type="checkbox"
                      onChange={HandleOncheckBox}
                      name="underGraduation"
                      className="hidden"
                    />
                    <label
                      htmlFor="underGraduation"
                      className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                    >
                      Under Graduation Marksheet
                    </label>
                  </div>

                  {BooleanCheckBox?.underGraduation &&
                    CompleteStudentData?.underGradutaion
                      ?.AllUnderGraduationPhotos?.remark !== " " && (
                      <input
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        type="text"
                        onChange={HandleInputOnchange}
                        value={
                          MarkasPendencyOnAcademicsData?.underGraduationMarksheet
                        }
                        name="underGraduationMarksheet"
                        placeholder="Remark for Under Graduation Marksheet"
                      />
                    )}
                </div>
              )}

              {/* Post Graduation */}
              {CompleteStudentData?.postGradutaion?.AllPostGraduationPhotos
                ?.remark !== "" && (
                <div>
                  <div
                    className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                      border-gray-200 dark:border-gray-700 ${
                        BooleanCheckBox?.postGraduation &&
                        "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                      } cursor-pointer`}
                  >
                    <input
                      id="postGraduation"
                      type="checkbox"
                      onChange={HandleOncheckBox}
                      name="postGraduation"
                      className="hidden"
                    />
                    <label
                      htmlFor="postGraduation"
                      className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                    >
                      Post Graduation Marksheet
                    </label>
                  </div>

                  {BooleanCheckBox?.postGraduation &&
                    CompleteStudentData?.postGraduation?.AllPostGraduationPhotos
                      ?.remark !== " " && (
                      <input
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        type="text"
                        onChange={HandleInputOnchange}
                        value={
                          MarkasPendencyOnAcademicsData?.postGraduationMarksheet
                        }
                        name="postGraduationMarksheet"
                        placeholder="Remark for Post Graduation Marksheet"
                      />
                    )}
                </div>
              )}

              {/* Other Academics */}
              {CompleteStudentData?.OtherAcademics?.AllOtherPhotos?.remark !==
                " " && (
                <div>
                  <div
                    className={`flex items-center ps-4 border rounded-lg bg-white dark:bg-slate-800 
                      border-gray-200 dark:border-gray-700 ${
                        BooleanCheckBox?.otherAcademic &&
                        "bg-pink-50 dark:bg-pink-900/20 border-pink-500"
                      } cursor-pointer`}
                  >
                    <input
                      id="otherAcademic"
                      type="checkbox"
                      onChange={HandleOncheckBox}
                      name="otherAcademic"
                      value={BooleanCheckBox?.otherAcademic}
                      className="hidden"
                    />
                    <label
                      htmlFor="otherAcademic"
                      className="w-full cursor-pointer py-2.5 ms-2 text-[11px] font-medium text-gray-900 dark:text-gray-200"
                    >
                      Other Academic Marksheet
                    </label>
                  </div>

                  {BooleanCheckBox?.otherAcademic &&
                    CompleteStudentData?.OtherAcademics?.AllOtherPhotos
                      ?.remark !== " " && (
                      <input
                        className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-md my-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        type="text"
                        onChange={HandleInputOnchange}
                        value={MarkasPendencyOnAcademicsData?.otherMarksheet}
                        name="otherMarksheet"
                        placeholder="Remark for Other Academic Marksheet"
                      />
                    )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
              onClick={HandleSubmitPendency}
              className="px-8 py-2 rounded-full text-xs font-semibold border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition"
            >
              Save Pendency Remarks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markaspendency;
