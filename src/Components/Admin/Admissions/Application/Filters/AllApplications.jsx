import React, { useEffect, useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import image from "../../../../../../public/logo.png";
import { BsFillPrinterFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { RiEditLine, RiMailSendFill } from "react-icons/ri";
import ToggleButton from "../../../../../Common/ToggleButton";
import Entrollmentno from "../ApplicationComponent/Entrollmentno";
import OAnumber from "../ApplicationComponent/OAnumber";
import UseProcessedByCenter from "../../../../../CustomHooks/UseUpdateStatus";
import ReviewDocuments from "../ApplicationComponent/Reviewdocuments";
import ViewPendency from "../ApplicationComponent/ViewPendency";
import { useSelector } from "react-redux";
import UseApplicationPrintPreview from "../../../../../CustomHooks/UseApplicationPrintPreview";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "../../../../../Helper/Loader";
import Loader2 from "../../../../../Helper/Loader2";
import { useNavigate } from "react-router-dom";
import CourierAssign from "../ApplicationComponent/CourierAssign";
import DownloadOnStudent from "../ApplicationComponent/DownloadOnStudent";
import UseGetLoggedUser from "../../../../../CustomHooks/UseGetLoggedUser";

const AllApplications = ({
  FetchAllStudentByPagination,
  handlePageChange,
  AllStudentListData,
  AllStudentCurrentPage,
  AllStudentTotalPages,
  AllStudentLimit,
  AllStudentLoading,
  AllStudentTotalDocs,
  searchkey,
}) => {
  const [RefreshApplications, setRefreshApplications] = useState(false);

  useEffect(() => {
    if (RefreshApplications) {
      FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
    }
  }, [RefreshApplications]);

  // Login permission
  const [LoginStatusToggleButton, setLoginStatusToggleButton] = useState("No");
  const HandleLoginStatusToggleYes = () => {
    setLoginStatusToggleButton("Yes");
  };
  const HandleLoginStatusToggleNo = () => {
    setLoginStatusToggleButton("No");
  };

  // id permission
  const [IdStatusToggleButton, setIdStatusToggleButton] = useState("Yes");
  const HandleIdStatusToggleYes = () => {
    setIdStatusToggleButton("Yes");
  };
  const HandleIdStatusToggleNo = () => {
    setIdStatusToggleButton("No");
  };

  // OAnumber Button Open
  const [OANumberBooleanButton, setOANumberBooleanButton] = useState(false);
  const HandleOANumberOpen = () => {
    setOANumberBooleanButton(true);
  };
  const HandleOANumberClose = () => {
    setOANumberBooleanButton(false);
  };

  // AssignCourier Button Open
  const [AssignCourierButton, setAssignCourierButton] = useState(false);
  const [StudentDetails, setStudentDetails] = useState(null);

  const HandleCourierOpen = (data) => {
    setAssignCourierButton(true);
    setStudentDetails(data);
  };
  const HandleCourierClose = () => {
    setAssignCourierButton(false);
  };

  // Enrollment number Button Open
  const [EnrollmentNumberBooleanButton, setEnrollmentNumberBooleanButton] =
    useState(false);

  const HandleEnrollmentNumberOpen = () => {
    setEnrollmentNumberBooleanButton(true);
  };
  const HandleEnrollmentNumberClose = () => {
    setEnrollmentNumberBooleanButton(false);
  };

  // Enreollment & OA data
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

  // Extracting DATE
  const ExtractDateFromDb = (submitFormDate) => {
    if (!submitFormDate) {
      return null;
    }
    const datePart = submitFormDate.split(",")[0];
    return datePart;
  };

  const ExtractDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  };

  const [StatusDetails, setStatusDetails] = useState({
    MarkAsByCenter: false,
    MarkAsByUniversity: false,
    CancelAdmission: false,
  });

  const [CompleteStudentData, setCompleteStudentData] = useState({});

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
            },
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
            {
              withCredentials: true,
            },
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
            {
              StudentId,
            },
            {
              withCredentials: true,
            },
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

  const HandleInputData = (e) => {
    const { name, checked } = e.target;
    setStatusDetails((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Review Document Button Open
  const [ReviewDocBooleanButton, setReviewDocBooleanButton] = useState(false);
  const HandleReviewDocOpen = () => {
    setReviewDocBooleanButton(true);
  };
  const HandleReviewDocClose = () => {
    setReviewDocBooleanButton(false);
  };

  // View Pendency Button
  const [ViewPendencyBooleanButton, setViewPendencyBooleanButton] =
    useState(false);

  const HandleViewPendencyOpen = () => {
    setViewPendencyBooleanButton(true);
  };
  const HandleViewPendencyClose = () => {
    setViewPendencyBooleanButton(false);
  };

  const { GetLoginUserDetails, GetLoggedUserLoader, LoggedUserData } =
    UseGetLoggedUser();
  const ReduxUser = useSelector((state) => state.user);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  useEffect(() => {
    GetLoginUserDetails();
  }, []);

  useEffect(() => {
    FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
  }, [UniversityGetDataFromRedux]);

  const { HandlePrintPreview, StudentIdPdfLoading } =
    UseApplicationPrintPreview();

  const DateOfBirthExtract = (dob) => {
    return new Date(dob).toISOString().split("T")[0];
  };

  const HandleDeleteStudent = async (data) => {
    Swal.fire({
      title: `Do you want to Delete ${data?.fullName} `,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`,
      customClass: {
        confirmButton: "custom-confirm-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        HandleDeleteStudentAPI(data?._id, true);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const HandleDeleteStudentAPI = async (StudentId, BooleanValue) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/DeleteStudentForm`,
        { StudentId, BooleanValue },
        {
          withCredentials: true,
        },
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        Swal.fire({
          title: `Student Deleted Successfulyy!`,
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            FetchAllStudentByPagination();
          }
        });
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  const NavigateTo = useNavigate();

  const [DownloadApplnOnStudent, setDownloadApplnOnStudent] = useState(false);
  const [DownloadApplnOnStudentId, setDownloadApplnOnStudentId] = useState("");

  const HandleDownloadStudentDataOpen = (data) => {
    setDownloadApplnOnStudent(true);
    setDownloadApplnOnStudentId(data);
  };
  const HandleDownloadStudentDataclose = () => {
    setDownloadApplnOnStudent(false);
  };

  // filtered list for current user
  const visibleStudents = AllStudentListData?.filter((data) => {
    if (data?.isDeleted) return false;
    if (data?.university?._id !== UniversityGetDataFromRedux?.id) return false;

    if (LoggedUserData?.role === "Counsellor") {
      return data?.whoCreated?._id === LoggedUserData?._id;
    }
    if (LoggedUserData?.role === "subCounsellor") {
      return data?.whoCreated?._id === LoggedUserData?._id;
    }
    if (LoggedUserData?.role === "center") {
      return data?.center?._id === LoggedUserData?._id;
    }
    if (LoggedUserData?.role === "SubCenter") {
      return data?.whoCreated?._id === LoggedUserData?._id;
    }
    if (
      LoggedUserData?.role === "operation-manager" ||
      LoggedUserData?.role === "Accountant" ||
      LoggedUserData?.role === "Admin"
    ) {
      return data?.university?._id === UniversityGetDataFromRedux?.id;
    }
    return true;
  });

  const hasData = visibleStudents && visibleStudents.length > 0;

  return (
    <>
      {StudentIdPdfLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 z-20">
          <Loader />
        </div>
      )}

      <tbody className="overflow-x-scroll">
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
            {visibleStudents?.map((StudentData, StudentIndex) => (
              <tr
                key={StudentData?._id || StudentIndex}
                className="align-top text-xs bg-white dark:bg-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {/* Actions */}
                <td className="px-4 py-2 align-top">
                  <div className="w-[15vh] flex gap-2 flex-row">
                    {ReduxUser?.role !== "Accountant" && (
                      <button
                        onClick={() => {
                          const url = `/${
                            ReduxUser?.role === "Admin"
                              ? "admin"
                              : ReduxUser?.role === "center"
                                ? "center"
                                : ReduxUser?.role === "operation-manager"
                                  ? "operational"
                                  : ReduxUser?.role === "Counsellor"
                                    ? "counsellor"
                                    : ""
                          }/update-student/${StudentData?._id}`;
                          window.open(url, "_blank");
                        }}
                        title="Edit Student"
                        className="text-green-600 hover:text-green-700"
                      >
                        <AiTwotoneEdit size={18} />
                      </button>
                    )}
                    {/* <button
                      onClick={() => {
                        const url = `/${
                          ReduxUser?.role === "Admin"
                            ? "admin"
                            : ReduxUser?.role === "center"
                            ? "center"
                            : ReduxUser?.role === "operation-manager"
                            ? "operational"
                            : ReduxUser?.role === "Counsellor"
                            ? "counsellor"
                            : ""
                        }/update-student/${StudentData?._id}`;
                        window.open(url, "_blank");
                      }}
                      title="Edit Student"
                      className="text-green-600 hover:text-green-700"
                    >
                      <AiTwotoneEdit size={18} />
                    </button> */}

                    {(ReduxUser?.role == "Admin" ||
                      ReduxUser?.role == "operation-manager" ||
                      ReduxUser?.role == "university-manager" ||
                      // ReduxUser?.role == "Accountant" ||
                      ReduxUser?.role == "Counsellor" ||
                      ReduxUser?.role == "subCounsellor") && (
                      <button
                        onClick={() => HandleDeleteStudent(StudentData)}
                        title="Delete Student"
                        className="text-rose-600 hover:text-rose-700"
                      >
                        <MdDelete size={18} />
                      </button>
                    )}

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
                {AllStudentLoading ? (
                  <td className="px-4 py-2 align-top">
                    <div className="w-[35vh] flex justify-center">
                      <Loader2 />
                    </div>
                  </td>
                ) : (
                  <td className="px-4 py-2 align-top">
                    <div className="w-[42vh] flex flex-col gap-1 text-[11px]">
                      {/* Status block */}
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

                      {/* center role processed checkbox */}
                      {ReduxUser.role === "center" && (
                        <>
                          {(!StudentData.payments?.paymentStatus ||
                            StudentData.payments?.paymentStatus.trim() !==
                              "") &&
                            StudentData.payments?.studentId ===
                              StudentData?._id &&
                            (!StudentData?.status?.processedbyCenteron ||
                              StudentData?.status?.processedbyCenteron.trim() ===
                                "") && (
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
                        </>
                      )}

                      {/* Process By center info (non-center roles) */}
                      {ReduxUser.role !== "center" && (
                        <>
                          {StudentData.payments?.paymentStatus.trim() !== "" &&
                            StudentData.payments?.studentId ===
                              StudentData?._id && (
                              <>
                                {StudentData?.status?.processedbyCenteron ===
                                  "" &&
                                  StudentData?.status?.submitedFormDate !==
                                    "" && (
                                    <div className="flex items-center my-2 gap-2">
                                      <div>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                          Processed On:
                                        </span>
                                        <span className="text-rose-600 font-bold">
                                          {" "}
                                          Not Processed
                                        </span>
                                      </div>
                                    </div>
                                  )}
                              </>
                            )}
                        </>
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

                      {/* Payment Pending Check */}
                      {StudentData?.payments?.paymentStatus === "pending" &&
                        StudentData?.status?.processedbyCenteron !== "" && (
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              Payment Status:{" "}
                            </span>
                            <span className="text-rose-600 font-bold">
                              Pending
                            </span>
                          </div>
                        )}

                      {/* Document Verification */}
                      {StudentData?.payments?.paymentStatus === "approved" &&
                        (StudentData?.status?.documentVerifiedOn !== "" ||
                          StudentData?.status?.processedbyCenteron !== "") && (
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              Document Verified On:
                            </span>

                            {ReduxUser.role === "center" &&
                            !StudentData?.documents?.isPendency &&
                            !StudentData?.documents?.isApproved ? (
                              <span className="text-rose-600 font-bold">
                                {" "}
                                <button>Pending</button>
                              </span>
                            ) : (
                              <>
                                {(ReduxUser.role === "operation-manager" ||
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

                            {/* re-upload + pendency / view */}
                            {StudentData?.documents?.photo?.reUploaded ||
                            StudentData?.documents?.aadhar?.reUploaded ||
                            StudentData?.documents?.studentSignature
                              ?.reUploaded ||
                            StudentData?.documents?.parentSignature
                              ?.reUploaded ||
                            StudentData?.documents?.aafidavit?.reUploaded ||
                            StudentData?.documents?.DEBID?.reUploaded ||
                            StudentData?.documents?.ABCID?.reUploaded ||
                            StudentData?.documents?.other?.reUploaded ||
                            StudentData?.documents?.migration?.reUploaded ? (
                              ReduxUser.role === "Counsellor" ||
                              ReduxUser.role === "center" ||
                              ReduxUser.role === "subCenter" ||
                              ReduxUser.role === "subCounsellor" ? (
                                StudentData?.documents?.isPendency && (
                                  <span className="text-rose-600 font-bold">
                                    {" "}
                                    <button title="Re Uploaded Documents Under Review">
                                      Under Review
                                    </button>
                                  </span>
                                )
                              ) : (
                                <>
                                  {ReduxUser.role === "Accountant" && (
                                    <span className="text-rose-600 font-bold">
                                      {" "}
                                      <button title="Re Uploaded Documents Under Review">
                                        Re Uploaded
                                      </button>
                                    </span>
                                  )}
                                  {(ReduxUser.role === "Admin" ||
                                    ReduxUser.role === "operation-manager" ||
                                    ReduxUser.role === "university-manager") &&
                                    StudentData?.documents?.isPendency && (
                                      <span className="text-rose-600 font-bold">
                                        {" "}
                                        <button
                                          onClick={() => {
                                            HandleViewPendencyOpen();
                                            setCompleteStudentData(StudentData);
                                          }}
                                          title="Re Uploaded Documents Under Review"
                                        >
                                          View Re Uploaded
                                        </button>
                                      </span>
                                    )}
                                </>
                              )
                            ) : (
                              <>
                                {(ReduxUser.role === "operation-manager" ||
                                  ReduxUser.role === "Accountant" ||
                                  ReduxUser.role === "Counsellor" ||
                                  ReduxUser.role === "center" ||
                                  ReduxUser.role === "subCenter" ||
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
                              </>
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

                      {(ReduxUser.role !== "Admin" ||
                        ReduxUser.role !== "university-manager" ||
                        ReduxUser.role !== "operation-manager") && (
                        <>
                          {StudentData?.documents?.isApproved &&
                            StudentData?.status?.processedtoUniversityon ===
                              "" && (
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  Processed to University on:
                                </span>
                                <span className="text-rose-600 font-bold">
                                  {" "}
                                  Not Processed
                                </span>
                              </div>
                            )}
                        </>
                      )}

                      {(ReduxUser.role === "Admin" ||
                        ReduxUser.role === "university-manager" ||
                        ReduxUser.role === "operation-manager") && (
                        <>
                          {StudentData?.status?.processedtoUniversityon ===
                            "" &&
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
                                <div>Mark As Processed By Univesity ?</div>
                              </div>
                            )}
                        </>
                      )}

                      {/* admission cancel date */}
                      {StudentData?.status?.admissionCancelDate && (
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            Admission Cancel on:
                          </span>
                          <span className="text-rose-600 font-bold">
                            {" "}
                            {ExtractDateFromDb(
                              StudentData?.status?.admissionCancelDate,
                            )}
                          </span>
                        </div>
                      )}

                      {/* Delete Toggle */}
                      {(ReduxUser.role === "Admin" ||
                        ReduxUser.role === "university-manager" ||
                        ReduxUser.role === "operation-manager") && (
                        <>
                          {StudentData?.status?.admissionCancelDate === "" &&
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
                                  id="CancelAdmission"
                                />
                                <div>Admission Cancel ?</div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </td>
                )}

                {/* Enrollment No */}
                <td className="px-4 py-2 align-top">
                  <div className="flex gap-2 items-center justify-center font-bold">
                    <div>
                      {StudentData?.EnrollmentNo === ""
                        ? "N/A"
                        : StudentData?.EnrollmentNo}
                    </div>
                    {(ReduxUser.role === "Admin" ||
                      ReduxUser.role === "university-manager" ||
                      ReduxUser.role === "Counsellor" ||
                      ReduxUser.role === "operation-manager") && (
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
                    {(ReduxUser.role === "Admin" ||
                      ReduxUser.role === "university-manager" ||
                      ReduxUser.role === "Counsellor" ||
                      ReduxUser.role === "operation-manager") && (
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
                  <div className="w-60 flex flex-col gap-1 text-[11px]">
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

                {/* form */}
                <td className="px-4 py-2 align-center">
                  <div className="w-40">
                    <button
                      onClick={() => HandlePrintPreview(StudentData)}
                      title="Download Application"
                      className="font-medium bg-blue-100 hover:bg-blue-200 text-gray-700 rounded-md text-xs px-4 py-1.5 transition"
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

                {/* courier sent date */}
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

                {/* courier docket / to deliver */}

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

                {(ReduxUser.role === "Admin" ||
                  ReduxUser.role === "operation-manager") && (
                  <td className="px-4 w-48 py-2 align-center">
                    <div className="flex justify-center">
                      {StudentData?.Courier ? (
                        <div className="px-4 py-1.5 bg-orange-400 rounded-lg font-bold text-white text-xs w-36 text-center">
                          Assigned Courier
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            HandleCourierOpen(StudentData);
                          }}
                          title="Assign Courier"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <div className="flex justify-center gap-2 px-2.5 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold text-white text-[11px] w-36">
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

            {/* not created any condition */}
            {AllStudentListData?.some(
              (data) =>
                data.university?._id === !UniversityGetDataFromRedux?.id &&
                !data?.isDeleted,
            ) && (
              <tr>
                <td colSpan={20}>
                  <div className="flex justify-center items-center h-40 text-slate-500 text-sm">
                    Not Created ANY Data Inside This University
                  </div>
                </td>
              </tr>
            )}

            {/* select university */}
            {AllStudentListData?.some(
              (data) =>
                !data?.isDeleted &&
                data?.university?._id === "" &&
                UniversityGetDataFromRedux?.id === "",
            ) && (
              <tr>
                <td colSpan={20}>
                  <div className="flex justify-center items-center h-40 text-slate-500 text-sm">
                    Select The University
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
          OAData={OAData}
          CompleteStudentData={CompleteStudentData}
          setRefreshApplications={setRefreshApplications}
        />
      )}
      {EnrollmentNumberBooleanButton && (
        <Entrollmentno
          CompleteStudentData={CompleteStudentData}
          HandleEnrollmentNumberClose={HandleEnrollmentNumberClose}
          setRefreshApplications={setRefreshApplications}
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
      {AssignCourierButton && (
        <CourierAssign
          setRefreshApplications={setRefreshApplications}
          HandleCourierClose={HandleCourierClose}
          StudentDetails={StudentDetails}
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

export default AllApplications;
