import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { BsFillPrinterFill } from "react-icons/bs";
import { RiMailSendFill } from "react-icons/ri";

import React, { useEffect, useState } from "react";
import Entrollmentno from "../ApplicationComponent/Entrollmentno";
import OAnumber from "../ApplicationComponent/OAnumber";
import ReviewDocuments from "../ApplicationComponent/Reviewdocuments";
import ViewPendency from "../ApplicationComponent/ViewPendency";
import { useSelector } from "react-redux";
import useGetDocuments from "../../../../../CustomHooks/UseGetDocuments";
import Loader2 from "../../../../../Helper/Loader2";
import Loader from "../../../../../Helper/Loader";
import Swal from "sweetalert2";
import axios from "axios";
import UseApplicationPrintPreview from "../../../../../CustomHooks/UseApplicationPrintPreview";
import DownloadOnStudent from "../ApplicationComponent/DownloadOnStudent";
import UseGetLoggedUser from "../../../../../CustomHooks/UseGetLoggedUser";

const Verifieddoc = ({
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

  const { HandlePrintPreview, StudentIdPdfLoading } =
    UseApplicationPrintPreview();

  // OAnumber
  const [OANumberBooleanButton, setOANumberBooleanButton] = useState(false);
  const HandleOANumberOpen = () => setOANumberBooleanButton(true);
  const HandleOANumberClose = () => setOANumberBooleanButton(false);

  // Enrollment number
  const [EnrollmentNumberBooleanButton, setEnrollmentNumberBooleanButton] =
    useState(false);
  const HandleEnrollmentNumberOpen = () =>
    setEnrollmentNumberBooleanButton(true);
  const HandleEnrollmentNumberClose = () =>
    setEnrollmentNumberBooleanButton(false);

  // Enrollment & OA data
  const [EnrollmentNo, setEnrollmentNo] = useState("");
  const [OAData, setOAData] = useState("");

  const HandlEnrollment = (e) => {
    e.preventDefault();
    setEnrollmentNo(e.target.value);
  };

  const HandlOANumber = (e) => {
    e.preventDefault();
    setOAData(e.target.value);
  };

  const ExtractDateFromDb = (submitFormDate) => {
    if (!submitFormDate) return null;
    const datePart = submitFormDate.split(",")[0];
    return datePart;
  };

  const [StatusDetails, setStatusDetails] = useState({
    MarkAsByCenter: false,
    MarkAsByUniversity: false,
    CancelAdmission: false,
  });
  const [CompleteStudentData, setCompleteStudentData] = useState({});

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
            { withCredentials: true },
          );

          if (response?.data?.success) {
            Swal.fire(`${response?.data?.message}`, "", "success")?.then(
              (result) => {
                if (result?.isConfirmed) {
                  setRefreshApplications(true);
                }
              },
            );
          } else {
            toast.error(response?.data?.message || "Failed to Process.");
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              "An error occurred. Please try again.",
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
            { withCredentials: true },
          );

          if (response?.data?.success) {
            Swal.fire(`${response?.data?.message}`, "", "success")?.then(
              (result) => {
                if (result?.isConfirmed) {
                  setRefreshApplications(true);
                }
              },
            );
          } else {
            Swal.fire(
              `${response?.data?.message || "Failed to Process University!"}`,
              "",
              "success",
            );
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              "An error occurred. Please try again.",
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
            { StudentId },
            { withCredentials: true },
          );

          if (response?.data?.success) {
            Swal.fire(`${response?.data?.message}`, "", "success")?.then(
              (result) => {
                if (result?.isConfirmed) {
                  setRefreshApplications(true);
                }
              },
            );
          } else {
            Swal.fire(
              `${response?.data?.message || "Failed to Process University!"}`,
              "",
              "success",
            );
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              "An error occurred. Please try again.",
          );
        }
      } else {
        Swal.fire("Action canceled", "", "info");
      }
    });
  };

  useEffect(() => {
    if (StatusDetails?.MarkAsByCenter && CompleteStudentData?._id) {
      UpdateProcessedByCenter(
        StatusDetails.MarkAsByCenter,
        CompleteStudentData._id,
      );
    }

    if (StatusDetails?.MarkAsByUniversity && CompleteStudentData?._id) {
      UpdateProcessedByUniversity(
        StatusDetails.MarkAsByUniversity,
        CompleteStudentData._id,
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

  const HandleInputData = (e) => {
    const { name, checked } = e.target;
    setStatusDetails((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Modals
  const [ReviewDocBooleanButton, setReviewDocBooleanButton] = useState(false);
  const HandleReviewDocOpen = () => setReviewDocBooleanButton(true);
  const HandleReviewDocClose = () => setReviewDocBooleanButton(false);

  const [ViewPendencyBooleanButton, setViewPendencyBooleanButton] =
    useState(false);
  const HandleViewPendencyOpen = () => setViewPendencyBooleanButton(true);
  const HandleViewPendencyClose = () => setViewPendencyBooleanButton(false);

  // redux
  const ReduxUser = useSelector((state) => state.user);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  useEffect(() => {
    FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
  }, [UniversityGetDataFromRedux]);

  const { GetAllDocuments } = useGetDocuments();

  useEffect(() => {
    GetAllDocuments();
  }, []);

  const DateOfBirthExtract = (dob) => new Date(dob).toISOString().split("T")[0];

  const ExtractDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  };

  const [DownloadApplnOnStudent, setDownloadApplnOnStudent] = useState(false);
  const [DownloadApplnOnStudentId, setDownloadApplnOnStudentId] = useState("");

  const HandleDownloadStudentDataOpen = (data) => {
    setDownloadApplnOnStudent(true);
    setDownloadApplnOnStudentId(data);
  };
  const HandleDownloadStudentDataclose = () => {
    setDownloadApplnOnStudent(false);
  };

  const { GetLoginUserDetails, LoggedUserData } = UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
  }, []);

  const [viewCourierData, setViewCourierData] = useState(null);
  const [viewCourierModal, setViewCourierModal] = useState(false);
  const HandleViewCourier = (courier) => {
    setViewCourierData(courier);
    setViewCourierModal(true);
  };

  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedCourierId, setSelectedCourierId] = useState(null);
  const HandleMarkReceived = async (courierId) => {
    try {
      const confirm = window.confirm("Mark this courier as received?");

      if (!confirm) return;

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/mark-courier-received/${courierId}`,
        {},
        { withCredentials: true },
      );

      toast.success("Courier marked as received");

      // refresh table
      FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update courier status");
    }
  };

  // FILTER: only verified-doc students + role-based visibility
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

    const status = data?.status || {};
    const docs = data?.documents || {};

    // VERIFIED DOC condition
    const isEligibleStudent =
      status?.TrackStatus === "4" &&
      status?.submitedFormDate !== "" &&
      status?.processedbyCenteron !== "" &&
      status?.processedtoUniversityon === "" &&
      status?.admissionCancelDate === "" &&
      data?.university?._id === UniversityGetDataFromRedux?.id &&
      docs?.isPendency === false &&
      docs?.isApproved === true &&
      docs?.isApprovedDate !== "";

    return isEligibleStudent;
  });

  const hasData = visibleStudents && visibleStudents.length > 0;

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
                  <div className="w-[28vh] flex flex-col gap-1 text-left">
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
                      <span className="font-medium">Father Name: </span>
                      <span>{StudentData?.fatherName}</span>
                    </div>
                  </div>
                </th>

                {/* Status */}
                <td className="px-4 py-2 align-top">
                  {AllStudentLoading ? (
                    <div className="w-[35vh] flex justify-center">
                      <Loader2 />
                    </div>
                  ) : (
                    <div className="w-[42vh] flex flex-col gap-1 text-[11px]">
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
                                  StudentData?.status?.submitedFormDate,
                                )}
                                )
                              </>
                            )}
                          </span>
                        </div>
                      )}

                      {/* Center role checkbox */}
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

                      {/* Non-center info */}
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
                              StudentData?.status?.processedbyCenteron,
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
                                ReduxUser.role === "subCounsellor" ||
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
                                StudentData?.documents?.isApprovedDate,
                              )}
                              )
                            </span>
                          )}
                        </div>
                      )}

                      {/* Processed To University */}
                      {StudentData?.status?.processedtoUniversityon !== "" &&
                        StudentData?.documents?.isApproved && (
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              Processed to University on:
                            </span>
                            <span className="text-green-600 font-bold">
                              {" "}
                              (
                              {ExtractDateFromDb(
                                StudentData?.status?.processedtoUniversityon,
                              )}
                              )
                            </span>
                          </div>
                        )}

                      {ReduxUser.role !== "Admin" &&
                        StudentData?.documents?.isApproved &&
                        StudentData?.status?.processedtoUniversityon === "" && (
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              Processed to University on :
                            </span>
                            <span className="text-rose-600 font-bold">
                              {" "}
                              Not Processed
                            </span>
                          </div>
                        )}

                      {/* University checkbox */}
                      {(ReduxUser.role === "Admin" ||
                        ReduxUser.role === "university-manager" ||
                        ReduxUser.role === "operation-manager") &&
                        StudentData?.status?.processedtoUniversityon === "" &&
                        StudentData?.documents?.isApproved && (
                          <div className="flex items-center my-2 gap-2">
                            <input
                              onChange={(e) => {
                                e.preventDefault();
                                HandleInputData(e);
                                setCompleteStudentData(StudentData);
                              }}
                              type="checkbox"
                              name="MarkAsByUniversity"
                            />
                            <div>Mark As Processed By University ?</div>
                          </div>
                        )}

                      {/* Admission cancel date */}
                      {StudentData?.status?.admissionCancelDate !== " " ||
                        (StudentData?.status?.processedtoUniversityon && (
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              Admission Cancel on:
                            </span>
                            <span className="text-green-600 font-bold">
                              {" "}
                              {StudentData?.status?.admissionCancelDate}
                            </span>
                          </div>
                        ))}

                      {/* Cancel admission toggle */}
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
                              name="CancelAdmission"
                              onChange={(e) => {
                                e.preventDefault();
                                HandleInputData(e);
                                setCompleteStudentData(StudentData);
                              }}
                            />
                            <div>Admission Cancel ?</div>
                          </div>
                        )}
                    </div>
                  )}
                </td>

                {/* Enrollment No */}
                <td className="px-4 py-2 align-top">
                  <div className="flex gap-2 font-bold items-center justify-center">
                    <div>
                      {StudentData?.EnrollmentNo === ""
                        ? "N/A"
                        : StudentData?.EnrollmentNo}
                    </div>
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
                  </div>
                </td>

                {/* Admission Details */}
                <td className="px-4 py-2 align-top">
                  <div className="w-52 flex flex-col gap-1 text-[11px]">
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
                  <div className="w-44 flex flex-col gap-1 text-[11px]">
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

                {/* courier */}
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
                <td className="px-4 py-2 align-center">
                  <div
                    className={`w-40 text-xs ${
                      StudentData?.Courier && "font-bold"
                    }`}
                  >
                    {StudentData?.Courier
                      ? StudentData?.Courier?.DocketNo
                      : "N/A"}
                  </div>
                </td>
                <td className="text-center">
                  {ReduxUser.role === "center" && (
                    <div className="flex justify-center gap-2">
                      {StudentData?.Courier && (
                        <>
                          <button
                            className="px-3 py-1 text-[11px] rounded bg-blue-500 text-white"
                            onClick={() =>
                              HandleViewCourier(StudentData?.Courier)
                            }
                          >
                            View
                          </button>

                          {!StudentData?.Courier?.Received && (
                            <button
                              className="px-3 py-1 text-[11px] rounded bg-green-500 text-white"
                              onClick={() => {
                                setSelectedCourierId(StudentData?.Courier?._id);
                                setConfirmModal(true);
                              }}
                            >
                              Mark Received
                            </button>
                          )}

                          {StudentData?.Courier?.Received && (
                            <span className="px-3 py-1 text-[11px] rounded bg-green-100 text-green-700">
                              Received
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </td>

                {/* Courier status */}
                {ReduxUser?.role === "Admin" && (
                  <td className="px-4 w-48 py-2 align-center">
                    <div className="flex justify-center">
                      {StudentData?.Courier ? (
                        <div className="px-4 py-1.5 bg-orange-400 rounded-lg font-bold text-white text-xs w-36 text-center">
                          Assigned Courier
                        </div>
                      ) : (
                        <div className="px-2.5 py-1.5 bg-yellow-400 rounded-lg font-bold text-black text-xs w-36 text-center">
                          Not Assigned Courier
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {/* If no data in this university at all */}
            {AllStudentListData?.some(
              (data) =>
                data.university?._id === UniversityGetDataFromRedux?.id &&
                !data?.isDeleted,
            ) ? null : (
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

      {OANumberBooleanButton && (
        <OAnumber
          HandleOANumberClose={HandleOANumberClose}
          HandlOANumber={HandlOANumber}
          OAData={OAData}
        />
      )}
      {EnrollmentNumberBooleanButton && (
        <Entrollmentno
          HandleEnrollmentNumberClose={HandleEnrollmentNumberClose}
          EnrollmentNo={EnrollmentNo}
          HandlEnrollment={HandlEnrollment}
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
      {DownloadApplnOnStudent && (
        <DownloadOnStudent
          HandleDownloadStudentDataclose={HandleDownloadStudentDataclose}
          DownloadApplnOnStudentId={DownloadApplnOnStudentId}
        />
      )}
    </>
  );
};

export default Verifieddoc;
