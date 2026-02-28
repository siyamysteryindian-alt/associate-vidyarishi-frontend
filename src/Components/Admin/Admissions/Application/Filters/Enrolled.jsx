import React, { useEffect, useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { BsFillPrinterFill } from "react-icons/bs";
import { RiEditLine, RiMailSendFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";

import Entrollmentno from "../ApplicationComponent/Entrollmentno";
import OAnumber from "../ApplicationComponent/OAnumber";
import ReviewDocuments from "../ApplicationComponent/Reviewdocuments";
import ViewPendency from "../ApplicationComponent/ViewPendency";
import useGetDocuments from "../../../../../CustomHooks/UseGetDocuments";
import Loader from "../../../../../Helper/Loader";
import UseApplicationPrintPreview from "../../../../../CustomHooks/UseApplicationPrintPreview";
import CourierAssign from "../ApplicationComponent/CourierAssign";
import DownloadOnStudent from "../ApplicationComponent/DownloadOnStudent";
import UseGetLoggedUser from "../../../../../CustomHooks/UseGetLoggedUser";

const Enrolled = ({
  FetchAllStudentByPagination,
  handlePageChange,
  AllStudentListData,
  AllStudentCurrentPage,
  AllStudentTotalPages,
  AllStudentLimit,
  AllStudentLoading,
  AllStudentTotalDocs,
}) => {
  const [RefreshApplications, setRefreshApplications] = useState(false);

  useEffect(() => {
    FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
  }, [AllStudentCurrentPage, AllStudentLimit]);

  useEffect(() => {
    if (RefreshApplications) {
      FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
      setRefreshApplications(false);
    }
  }, [RefreshApplications]);

  // OA Modal
  const [OANumberBooleanButton, setOANumberBooleanButton] = useState(false);
  const HandleOANumberOpen = () => setOANumberBooleanButton(true);
  const HandleOANumberClose = () => setOANumberBooleanButton(false);

  // Enrollment Modal
  const [EnrollmentNumberBooleanButton, setEnrollmentNumberBooleanButton] =
    useState(false);
  const HandleEnrollmentNumberOpen = () =>
    setEnrollmentNumberBooleanButton(true);
  const HandleEnrollmentNumberClose = () =>
    setEnrollmentNumberBooleanButton(false);

  const [CompleteStudentData, setCompleteStudentData] = useState({});
  const [OAData, setOAData] = useState("");

  const HandlOANumber = (e) => {
    setOAData(e.target.value);
  };

  // Redux
  const ReduxUser = useSelector((state) => state.user);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  useEffect(() => {
    FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
  }, [UniversityGetDataFromRedux]);

  const { GetAllDocuments, loadingDocuments, DocumentsError, Documents } =
    useGetDocuments();

  useEffect(() => {
    GetAllDocuments();
  }, []);

  // Status logic
  const [StatusDetails, setStatusDetails] = useState({
    MarkAsByCenter: false,
    MarkAsByUniversity: false,
    CancelAdmission: false,
  });

  const HandleInputData = (e) => {
    const { name, checked } = e.target;
    setStatusDetails((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  useEffect(() => {
    if (StatusDetails?.MarkAsByCenter && CompleteStudentData?._id) {
      UpdateProcessedByCenter(
        StatusDetails.MarkAsByCenter,
        CompleteStudentData._id
      );
    }

    if (StatusDetails?.MarkAsByUniversity && CompleteStudentData?._id) {
      UpdateProcessedByUniversity(
        StatusDetails.MarkAsByUniversity,
        CompleteStudentData._id
      );
    }

    if (StatusDetails?.CancelAdmission && CompleteStudentData?._id) {
      UpdateCancelAdmission(CompleteStudentData._id);
    }
  }, [
    StatusDetails?.MarkAsByCenter,
    StatusDetails?.MarkAsByUniversity,
    StatusDetails?.CancelAdmission,
    CompleteStudentData?._id,
  ]);

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
            Swal.fire(`${response?.data?.message}`, "", "success")?.then(
              (result) => {
                if (result?.isConfirmed) {
                  setRefreshApplications(true);
                }
              }
            );
          } else {
            toast.error(response?.data?.message || "Failed to Process.");
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              "An error occurred. Please try again."
          );
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
      title: `Mark As Processed By University ?`,
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
            Swal.fire(`${response?.data?.message}`, "", "success")?.then(
              (result) => {
                if (result?.isConfirmed) {
                  setRefreshApplications(true);
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
          toast.error(
            error.response?.data?.message ||
              "An error occurred. Please try again."
          );
        }
      } else {
        Swal.fire("Action canceled", "", "info");
      }
    });
  };

  const UpdateCancelAdmission = async (StudentId) => {
    if (!StudentId) {
      toast.error("Student Is Missing");
      return;
    }

    Swal.fire({
      title: `Do You Want to Cancel an Admission ?`,
      showCancelButton: true,
      confirmButtonText: "Cancel Admission ?",
      cancelButtonText: `Close`,
      customClass: {
        cancelButton: "custom-cancel-button",
        confirmButton: "custom-confirm2-button",
      },
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/admission-cancel`,
            {
              StudentId,
            },
            {
              withCredentials: true,
            }
          );

          if (response?.data?.success) {
            Swal.fire(`${response?.data?.message}`, "", "success")?.then(
              (result) => {
                if (result?.isConfirmed) {
                  setRefreshApplications(true);
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
          toast.error(
            error.response?.data?.message ||
              "An error occurred. Please try again."
          );
        }
      } else {
        Swal.fire("Action canceled", "", "info");
      }
    });
  };

  // Date helpers
  const ExtractDateFromDb = (submitFormDate) => {
    if (!submitFormDate) return null;
    const datePart = submitFormDate.split(",")[0];
    return datePart;
  };

  const DateOfBirthExtract = (dob) => new Date(dob).toISOString().split("T")[0];

  const ExtractDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  };

  const { HandlePrintPreview, StudentIdPdfLoading } =
    UseApplicationPrintPreview();

  // Courier
  const [CourierBooleanToggle, setCourierBooleanToggle] = useState(false);
  const [StudentCourier, setStudentCourier] = useState("");

  const HandleCourierOpen = (data) => {
    setCourierBooleanToggle(true);
    setStudentCourier(data);
  };
  const HandleCourierClose = () => {
    setCourierBooleanToggle(false);
  };

  // Download
  const [DownloadApplnOnStudent, setDownloadApplnOnStudent] = useState(false);
  const [DownloadApplnOnStudentId, setDownloadApplnOnStudentId] = useState("");

  const HandleDownloadStudentDataOpen = (data) => {
    setDownloadApplnOnStudent(true);
    setDownloadApplnOnStudentId(data);
  };
  const HandleDownloadStudentDataclose = () => {
    setDownloadApplnOnStudent(false);
  };

  // Review / Pendency modals
  const [ReviewDocBooleanButton, setReviewDocBooleanButton] = useState(false);
  const HandleReviewDocOpen = () => setReviewDocBooleanButton(true);
  const HandleReviewDocClose = () => setReviewDocBooleanButton(false);

  const [ViewPendencyBooleanButton, setViewPendencyBooleanButton] =
    useState(false);
  const HandleViewPendencyOpen = () => setViewPendencyBooleanButton(true);
  const HandleViewPendencyClose = () => setViewPendencyBooleanButton(false);

  // Logged user
  const { GetLoginUserDetails, LoggedUserData } = UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
  }, []);

  // FILTER: role-wise + enrolled stage
  const visibleStudents = AllStudentListData?.filter((data) => {
    if (data?.isDeleted) return false;
    if (data?.university?._id !== UniversityGetDataFromRedux?.id) return false;

    // role-based filters
    if (LoggedUserData?.role === "Counsellor") {
      if (data?.whoCreated?._id !== LoggedUserData?._id) return false;
    }
    if (LoggedUserData?.role === "subCounsellor") {
      if (data?.whoCreated?._id !== LoggedUserData?._id) return false;
    }
    if (LoggedUserData?.role === "center") {
      if (data?.center?._id !== LoggedUserData?._id) return false;
    }
    if (LoggedUserData?.role === "SubCenter") {
      if (data?.whoCreated?._id !== LoggedUserData?._id) return false;
    }
    if (
      LoggedUserData?.role === "operation-manager" ||
      LoggedUserData?.role === "Accountant" ||
      LoggedUserData?.role === "Admin"
    ) {
      if (data?.university?._id !== UniversityGetDataFromRedux?.id)
        return false;
    }

    // global approved docs condition (same as your original logic)
    const hasApprovedDocs =
      Documents.filter(
        (studentDoc) =>
          studentDoc.isPendency === false &&
          studentDoc.isApproved === true &&
          studentDoc.isApprovedDate !== ""
      ).length > 0;

    const status = data?.status || {};
    const isEligibleStudent =
      data?.university?._id === UniversityGetDataFromRedux?.id &&
      status?.TrackStatus === "4" &&
      status?.submitedFormDate !== "" &&
      status?.processedbyCenteron !== "" &&
      status?.processedtoUniversityon !== "" &&
      status?.admissionCancelDate === "" &&
      (data?.EnrollmentNo !== "" || data?.OANumber !== "") &&
      hasApprovedDocs;

    return isEligibleStudent;
  });

  const hasData = visibleStudents && visibleStudents.length > 0;
  const hasAnyInUniversity = AllStudentListData?.some(
    (data) =>
      !data?.isDeleted &&
      data?.university?._id === UniversityGetDataFromRedux?.id
  );

  return (
    <>
      <tbody className="overflow-x-scroll">
        {/* PDF overlay */}
        {StudentIdPdfLoading && (
          <tr>
            <td colSpan={20}>
              <div className="flex justify-center items-center py-10 bg-slate-50 bg-opacity-95">
                <Loader />
              </div>
            </td>
          </tr>
        )}

        {/* Main loader */}
        {AllStudentLoading ? (
          <tr>
            <td colSpan={20}>
              <div className="flex justify-center items-center py-10">
                <Loader />
              </div>
            </td>
          </tr>
        ) : hasData ? (
          <>
            {visibleStudents.map((StudentData, StudentIndex) => (
              <tr
                key={StudentData?._id || StudentIndex}
                className="bg-white dark:bg-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {/* Actions */}
                <td className="px-4 py-2 align-top">
                  <div className="w-[15vh] flex gap-2">
                    <button
                      onClick={() => {
                        const url = `/admin/update-student/${StudentData?._id}`;
                        window.open(url, "_blank");
                      }}
                      title="Edit Student"
                      className="text-green-600 hover:text-green-700"
                    >
                      <AiTwotoneEdit size={18} />
                    </button>
                    <button
                      title="Delete Student"
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <MdDelete size={18} />
                    </button>
                    <button
                      title="Send Mail"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <RiMailSendFill size={18} />
                    </button>
                  </div>
                </td>

                {/* Photo */}
                <td className="px-2 py-2 align-top">
                  <div className="w-[12vh]">
                    <img
                      src={StudentData?.documents?.photo?.studentPhoto}
                      alt=""
                      className="w-20 h-20 border rounded-md object-cover"
                    />
                  </div>
                </td>

                {/* Application Number */}
                <td className="px-4 py-2 align-top">
                  <div className="w-44 font-bold flex items-center justify-center">
                    <button
                      onClick={() => HandleDownloadStudentDataOpen(StudentData)}
                      className="px-4 py-1.5 tracking-wider rounded-md text-white font-semibold bg-pink-500 
                        hover:bg-white hover:text-pink-500 hover:border border-pink-500 transition"
                    >
                      {StudentData?.applicationNumber}
                    </button>
                  </div>
                </td>

                {/* Student */}
                <th
                  scope="row"
                  className="px-4 py-2 whitespace-nowrap align-top"
                >
                  <div className="w-[20vh] flex flex-col gap-1">
                    <div className="text-sm text-gray-900 dark:text-white font-semibold">
                      {StudentData?.fullName}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="font-medium">DOB: </span>
                      <span>
                        {DateOfBirthExtract(StudentData?.dateOfBirth)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="font-medium">Contact: </span>
                      <span>{StudentData?.personalDetails?.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="font-medium">Father's Name: </span>
                      <span>{StudentData?.fatherName}</span>
                    </div>
                  </div>
                </th>

                {/* Status & pipeline */}
                <td className="px-4 py-2 align-top">
                  <div className="w-[35vh] flex flex-col gap-1 text-[11px]">
                    {/* Track Status */}
                    {StudentData?.status?.TrackStatus !== "" && (
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Status:
                        </span>
                        <span className="text-green-600 font-bold">
                          {" "}
                          {StudentData?.status?.TrackStatus <= 3 ? (
                            <>In Draft @{StudentData?.status?.TrackStatus}</>
                          ) : (
                            <>
                              Completed (
                              {ExtractDateFromDb(
                                StudentData?.status?.submitedFormDate
                              )}
                              )
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Center toggle */}
                    {ReduxUser.role === "center" &&
                      StudentData?.status?.processedbyCenteron === "" && (
                        <div className="flex items-center my-2 gap-2">
                          <input
                            onChange={(e) => {
                              e.preventDefault();
                              HandleInputData(e);
                              setCompleteStudentData(StudentData);
                            }}
                            type="checkbox"
                            name="MarkAsByCenter"
                          />
                          <div>Mark As Processed By Center?</div>
                        </div>
                      )}

                    {/* Non-center processed info */}
                    {ReduxUser.role !== "center" &&
                      StudentData?.status?.processedbyCenteron === "" && (
                        <div className="flex items-center my-2 gap-2">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              Processed On :
                            </span>
                            <span className="text-rose-600 font-bold">
                              {" "}
                              Not Processed
                            </span>
                          </div>
                        </div>
                      )}

                    {StudentData?.status?.processedbyCenteron && (
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Processed by Center on:
                        </span>
                        <span className="text-green-600 font-bold">
                          {" "}
                          (
                          {ExtractDateFromDb(
                            StudentData?.status?.processedbyCenteron
                          )}
                          )
                        </span>
                      </div>
                    )}

                    {/* Document Verification */}
                    {(StudentData?.status?.documentVerifiedOn !== "" ||
                      StudentData?.status?.processedbyCenteron) && (
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Document Verified On:
                        </span>
                        {ReduxUser.role === "center" &&
                        !StudentData?.documents?.isPendency &&
                        !StudentData?.documents?.isApproved ? (
                          <span className="text-green-600 font-bold">
                            {" "}
                            <button>pending</button>
                          </span>
                        ) : (
                          <>
                            {(ReduxUser.role === "operation-manager" ||
                              ReduxUser.role === "Counsellor" ||
                              LoggedUserData?.role === "subCounsellor" ||
                              ReduxUser.role === "university-manager" ||
                              ReduxUser.role === "Admin") &&
                              !StudentData?.documents?.isPendency &&
                              !StudentData?.documents?.isApproved && (
                                <span className="text-green-600 font-bold">
                                  {" "}
                                  <button
                                    onClick={() => {
                                      HandleReviewDocOpen();
                                      setCompleteStudentData(StudentData);
                                    }}
                                  >
                                    Review
                                  </button>
                                </span>
                              )}
                          </>
                        )}
                        {(ReduxUser.role === "operation-manager" ||
                          ReduxUser.role === "Counsellor" ||
                          ReduxUser.role === "subCounsellor" ||
                          ReduxUser.role === "university-manager" ||
                          ReduxUser.role === "Admin") &&
                          StudentData?.documents?.isPendency && (
                            <span className="text-rose-600 font-bold">
                              {" "}
                              <button
                                onClick={() => {
                                  HandleViewPendencyOpen();
                                  setCompleteStudentData(StudentData);
                                }}
                              >
                                Pendency
                              </button>
                            </span>
                          )}
                        {StudentData?.documents?.isApproved && (
                          <span className="text-green-600 font-bold">
                            {" "}
                            Verified On (
                            {ExtractDateFromDb(
                              StudentData?.documents?.isApprovedDate
                            )}
                            )
                          </span>
                        )}
                      </div>
                    )}

                    {/* Processed To University */}
                    {StudentData?.status?.processedtoUniversityon !== "" &&
                    StudentData?.documents?.isApproved ? (
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Processed to University on:
                        </span>
                        <span className="text-green-600 font-bold">
                          {" "}
                          (
                          {ExtractDateFromDb(
                            StudentData?.status?.processedtoUniversityon
                          )}
                          )
                        </span>
                      </div>
                    ) : (
                      StudentData?.documents?.isApproved && (
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            Processed to University on:
                          </span>
                          <span className="text-rose-600 font-bold">
                            {" "}
                            Not Processed
                          </span>
                        </div>
                      )
                    )}

                    {/* admission cancel date */}
                    {StudentData?.status?.admissionCancelDate?.trim() !==
                      "" && (
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Admission Cancel on:
                        </span>
                        <span className="text-rose-600 font-bold">
                          {" "}
                          {ExtractDateFromDb(
                            StudentData?.status?.admissionCancelDate
                          )}
                        </span>
                      </div>
                    )}

                    {/* Cancel toggle */}
                    {(ReduxUser.role === "operation-manager" ||
                      ReduxUser.role === "university-manager" ||
                      ReduxUser.role === "Admin") &&
                      StudentData?.status?.admissionCancelDate === "" &&
                      StudentData?.status?.processedbyCenteron &&
                      StudentData?.status?.processedtoUniversityon &&
                      StudentData?.documents?.isApproved && (
                        <div className="flex items-center my-2 gap-2">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              e.preventDefault();
                              HandleInputData(e);
                              setCompleteStudentData(StudentData);
                            }}
                            name="CancelAdmission"
                          />
                          <div>Admission Cancel ?</div>
                        </div>
                      )}
                  </div>
                </td>

                {/* Enrollment No */}
                <td className="px-4 py-2 align-top">
                  <div className="flex gap-2 font-bold items-center justify-center">
                    <div>
                      {StudentData?.EnrollmentNo === ""
                        ? "N/A"
                        : StudentData?.EnrollmentNo}
                    </div>
                    {(ReduxUser.role === "operation-manager" ||
                      ReduxUser.role === "university-manager" ||
                      ReduxUser.role === "Admin") && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          HandleEnrollmentNumberOpen();
                          setCompleteStudentData(StudentData);
                        }}
                        title="Edit Enrollment"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <RiEditLine />
                      </button>
                    )}
                  </div>
                </td>

                {/* OA Number */}
                <td className="px-4 py-2 align-top">
                  <div className="w-32 font-bold flex gap-2 items-center justify-center">
                    <div>
                      {StudentData?.OANumber === ""
                        ? "N/A"
                        : StudentData?.OANumber}
                    </div>
                    {(ReduxUser.role === "operation-manager" ||
                      ReduxUser.role === "university-manager" ||
                      ReduxUser.role === "Admin") && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          HandleOANumberOpen();
                          setCompleteStudentData(StudentData);
                        }}
                        title="Online Application Number"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <RiEditLine />
                      </button>
                    )}
                  </div>
                </td>

                {/* Admission Details */}
                <td className="px-4 py-2 align-top">
                  <div className="w-auto flex flex-col gap-1 text-[11px]">
                    <div>
                      <span className="font-medium">Session: </span>
                      <span className="font-bold">
                        {StudentData?.admissionSession?.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Type: </span>
                      <span className="font-bold">
                        {StudentData?.admissionType?.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Program: </span>
                      <span className="font-bold">
                        {StudentData?.Course?.shortName} (
                        {StudentData?.SubCourse?.shortName})
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Sem: </span>
                      <span className="font-bold">{StudentData?.year}</span>
                    </div>
                  </div>
                </td>

                {/* Center Details */}
                <td className="px-4 py-2 align-top">
                  <div className="w-40 flex flex-col gap-1 text-[11px]">
                    <div>
                      <span className="font-medium">Center Name: </span>
                      <span className="font-bold">
                        {StudentData?.center?.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Center Code: </span>
                      <span className="font-bold">
                        {StudentData?.center?.code}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Who Created */}
                {(LoggedUserData?.role === "center" ||
                  LoggedUserData?.role === "Admin") && (
                  <td className="px-4 py-2 align-top">
                    <div className="w-60 flex flex-col gap-1 text-[11px]">
                      <div>
                        <span className="font-medium">Role: </span>
                        <span className="font-bold capitalize">
                          {StudentData?.whoCreated?.role}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Name: </span>
                        <span className="font-bold">
                          {StudentData?.whoCreated?.name}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Code: </span>
                        <span className="font-bold">
                          {StudentData?.whoCreated?.code}
                        </span>
                      </div>
                    </div>
                  </td>
                )}

                {/* Form */}
                <td className="px-4 py-2 align-center">
                  <div className="w-40">
                    <button
                      onClick={() => HandlePrintPreview(StudentData)}
                      title="Download Application"
                      className="font-medium bg-blue-100 hover:bg-blue-200 m-1 rounded-md text-gray-700 text-xs px-4 py-1.5 transition"
                    >
                      <div className="flex justify-center items-center gap-1.5">
                        <BsFillPrinterFill size={12} /> Print
                      </div>
                    </button>
                  </div>
                </td>

                {/* courier name */}
                <td className="px-4 py-2 align-center">
                  <div
                    className={`w-40 text-xs ${
                      StudentData?.Courier && "font-bold"
                    }`}
                  >
                    {StudentData?.Courier
                      ? StudentData?.Courier?.CourierName?.CourierName
                      : "N/A"}
                  </div>
                </td>

                {/* courier date */}
                <td className="px-4 py-2 align-center">
                  <div
                    className={`w-40 text-xs ${
                      StudentData?.Courier && "font-bold"
                    }`}
                  >
                    {StudentData?.Courier
                      ? ExtractDate(StudentData?.Courier?.DateTime)
                      : "N/A"}
                  </div>
                </td>

                {/* courier drop location */}
                <td className="px-4 py-2 align-center">
                  <div
                    className={`w-40 text-xs ${
                      StudentData?.Courier && "font-bold"
                    }`}
                  >
                    {StudentData?.Courier
                      ? StudentData?.Courier?.DropLocation
                      : "N/A"}
                  </div>
                </td>

                {/* courier status / assign */}
                {ReduxUser?.role === "Admin" && (
                  <td className="px-4 w-48 py-2 align-center">
                    <div className="flex justify-center">
                      {StudentData?.Courier ? (
                        <div className="-ml-2 px-4 py-1.5 bg-orange-400 rounded-lg font-bold text-white text-xs w-36 text-center">
                          Assigned Courier
                        </div>
                      ) : (
                        <button
                          onClick={() => HandleCourierOpen(StudentData)}
                          title="Assign Courier"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <div className="-ml-2 flex justify-center gap-2 px-2.5 py-2 bg-blue-400 rounded-lg font-bold text-white text-xs w-36">
                            Assign Courier
                            <RiEditLine />
                          </div>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {/* If no entries in this university at all */}
            {!hasAnyInUniversity && (
              <tr>
                <td colSpan={20}>
                  <div className="flex justify-center items-center h-40 text-slate-500 text-sm">
                    Not Created ANY Data Inside This University
                  </div>
                </td>
              </tr>
            )}
          </>
        ) : (
          <tr>
            <td colSpan={20}>
              <div className="flex justify-center items-center h-40 text-slate-500 font-semibold">
                Not Available
              </div>
            </td>
          </tr>
        )}
      </tbody>

      {/* Modals */}
      {OANumberBooleanButton && (
        <OAnumber
          HandleOANumberClose={HandleOANumberClose}
          OAData={OAData}
          CompleteStudentData={CompleteStudentData}
          setRefreshApplications={setRefreshApplications}
        />
      )}

      {CourierBooleanToggle && (
        <CourierAssign
          setRefreshApplications={setRefreshApplications}
          HandleCourierClose={HandleCourierClose}
          StudentDetails={StudentCourier}
        />
      )}

      {EnrollmentNumberBooleanButton && (
        <Entrollmentno
          CompleteStudentData={CompleteStudentData}
          HandleEnrollmentNumberClose={HandleEnrollmentNumberClose}
          RefreshApplications={RefreshApplications}
          setRefreshApplications={setRefreshApplications}
        />
      )}

      {DownloadApplnOnStudent && (
        <DownloadOnStudent
          HandleDownloadStudentDataclose={HandleDownloadStudentDataclose}
          DownloadApplnOnStudentId={DownloadApplnOnStudentId}
        />
      )}

      {ReviewDocBooleanButton && (
        <ReviewDocuments
          setRefreshApplications={setRefreshApplications}
          HandleReviewDocClose={HandleReviewDocClose}
          ReviewDocBooleanButton={ReviewDocBooleanButton}
          CompleteStudentData={CompleteStudentData}
        />
      )}

      {ViewPendencyBooleanButton && (
        <ViewPendency
          setRefreshApplications={setRefreshApplications}
          HandleViewPendencyClose={HandleViewPendencyClose}
          CompleteStudentData={CompleteStudentData}
        />
      )}
    </>
  );
};

export default Enrolled;
