import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import image from "../../../../../../public/logo.png";
import { BsFillPrinterFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { RiEditLine, RiMailSendFill } from "react-icons/ri";
import OAnumber from "../ApplicationComponent/OAnumber";
import ToggleButton from "../../../../../Common/ToggleButton";

import React, { useEffect, useState } from "react";
import Entrollmentno from "../ApplicationComponent/Entrollmentno";
import UseProcessedByCenter from "../../../../../CustomHooks/UseUpdateStatus";
import ReviewDocuments from "../ApplicationComponent/Reviewdocuments";
import ViewPendency from "../ApplicationComponent/ViewPendency";
import { useSelector } from "react-redux";
import useGetDocuments from "../../../../../CustomHooks/UseGetDocuments";
import Loader from "../../../../../Helper/Loader";
import UseApplicationPrintPreview from "../../../../../CustomHooks/UseApplicationPrintPreview";
import UseGetLoggedUser from "../../../../../CustomHooks/UseGetLoggedUser";

const Canceladmission = ({
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

  // OA / Enrollment modal states
  const [OANumberBooleanButton, setOANumberBooleanButton] = useState(false);
  const [EnrollmentNumberBooleanButton, setEnrollmentNumberBooleanButton] =
    useState(false);

  const [EnrollmentNo, setEnrollmentNo] = useState("");
  const [OAData, setOAData] = useState("");
  const [CompleteStudentData, setCompleteStudentData] = useState({});

  // Status / processed-by hooks
  const { UpdateProcessedByCenter, UpdateProcessedByUniversity } =
    UseProcessedByCenter();

  const [StatusDetails, setStatusDetails] = useState({
    MarkAsByCenter: false,
    MarkAsByUniversity: false,
  });

  // Review / Pendency modals
  const [ReviewDocBooleanButton, setReviewDocBooleanButton] = useState(false);
  const [ViewPendencyBooleanButton, setViewPendencyBooleanButton] =
    useState(false);

  // Redux + logged user
  const ReduxUser = useSelector((state) => state.user);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  // Documents
  const { GetAllDocuments, loadingDocuments, DocumentsError, Documents } =
    useGetDocuments();

  // Logged user hook
  const { GetLoginUserDetails, GetLoggedUserLoader, LoggedUserData } =
    UseGetLoggedUser();

  const { HandlePrintPreview, StudentIdPdfLoading } =
    UseApplicationPrintPreview();

  // ====== Effects ======

  useEffect(() => {
    FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
  }, [AllStudentCurrentPage, AllStudentLimit]);

  useEffect(() => {
    if (RefreshApplications) {
      FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
      setRefreshApplications(false);
    }
  }, [RefreshApplications]);

  useEffect(() => {
    FetchAllStudentByPagination(AllStudentCurrentPage, AllStudentLimit);
  }, [UniversityGetDataFromRedux]);

  useEffect(() => {
    GetLoginUserDetails();
    GetAllDocuments();
  }, []);

  useEffect(() => {
    if (StatusDetails?.MarkAsByCenter && CompleteStudentData?._id) {
      UpdateProcessedByCenter(
        StatusDetails.MarkAsByCenter,
        CompleteStudentData._id,
      );
      setRefreshApplications(true);
    }

    if (StatusDetails?.MarkAsByUniversity && CompleteStudentData?._id) {
      UpdateProcessedByUniversity(
        StatusDetails.MarkAsByUniversity,
        CompleteStudentData._id,
      );
      setRefreshApplications(true);
    }
  }, [
    StatusDetails?.MarkAsByCenter,
    StatusDetails?.MarkAsByUniversity,
    CompleteStudentData?._id,
  ]);

  // ====== Handlers ======

  const HandleOANumberOpen = () => setOANumberBooleanButton(true);
  const HandleOANumberClose = () => setOANumberBooleanButton(false);

  const HandleEnrollmentNumberOpen = () =>
    setEnrollmentNumberBooleanButton(true);
  const HandleEnrollmentNumberClose = () =>
    setEnrollmentNumberBooleanButton(false);

  const HandlEnrollment = (e) => {
    e.preventDefault();
    setEnrollmentNo(e.target.value);
  };

  const HandlOANumber = (e) => {
    e.preventDefault();
    setOAData(e.target.value);
  };

  const HandleInputData = (e) => {
    const { name, checked } = e.target;
    setStatusDetails((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const HandleReviewDocOpen = () => setReviewDocBooleanButton(true);
  const HandleReviewDocClose = () => setReviewDocBooleanButton(false);

  const HandleViewPendencyOpen = () => setViewPendencyBooleanButton(true);
  const HandleViewPendencyClose = () => setViewPendencyBooleanButton(false);

  // ====== Helpers ======

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

  // ====== Filtered Students (Cancelled Admissions) ======

  const visibleStudents = AllStudentListData?.filter((StudentData) => {
    if (StudentData?.isDeleted) return false;
    if (StudentData?.university?._id !== UniversityGetDataFromRedux?.id)
      return false;

    // Role-based access
    if (
      ["Counsellor", "subCounsellor", "SubCenter"].includes(
        LoggedUserData?.role,
      )
    ) {
      if (StudentData?.whoCreated?._id !== LoggedUserData?._id) return false;
    }

    if (LoggedUserData?.role === "center") {
      if (StudentData?.center?._id !== LoggedUserData?._id) return false;
    }

    if (
      ["operation-manager", "Accountant", "Admin"].includes(
        LoggedUserData?.role,
      )
    ) {
      if (StudentData?.university?._id !== UniversityGetDataFromRedux?.id)
        return false;
    }

    // Pipeline conditions – only cancelled admissions
    if (
      StudentData?.status?.TrackStatus !== "4" ||
      !StudentData?.status?.submitedFormDate ||
      !StudentData?.status?.processedbyCenteron ||
      !StudentData?.status?.processedtoUniversityon ||
      !StudentData?.status?.admissionCancelDate?.trim()
    ) {
      return false;
    }

    // Docs validation (same as original)
    const hasValidDocs =
      Documents.filter(
        (studentDoc) =>
          studentDoc.isPendency === false &&
          studentDoc.isApproved === true &&
          studentDoc.isApprovedDate !== "",
      ).length > 0;

    if (!hasValidDocs) return false;

    return true;
  });

  const hasData = visibleStudents && visibleStudents.length > 0;

  return (
    <>
      <tbody className="overflow-x-scroll">
        {/* PDF loading overlay */}
        {StudentIdPdfLoading && (
          <tr>
            <td colSpan={20}>
              <div className="flex justify-center items-center h-[42vh] bg-slate-50 bg-opacity-95">
                <Loader />
              </div>
            </td>
          </tr>
        )}

        {/* Global loading */}
        {AllStudentLoading ? (
          <tr>
            <td colSpan={20}>
              <div className="flex justify-center items-center h-[50vh]">
                <Loader />
              </div>
            </td>
          </tr>
        ) : hasData ? (
          <>
            {visibleStudents.map((StudentData, StudentIndex) => (
              <tr
                key={StudentData?._id || StudentIndex}
                className="bg-white dark:bg-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors m-2"
              >
                {/* Actions */}
                <td className="px-4 py-2 align-top">
                  <div className="w-[15vh] flex gap-3">
                    <button
                      title="Delete Student"
                      className="text-red-600 dark:text-red-500 hover:underline"
                    >
                      <MdDelete size={18} />
                    </button>
                    <button
                      title="Send Mail"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
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
                      className="px-4 py-1.5 tracking-wider rounded-md text-white font-bold bg-pink-500 
                        hover:bg-white hover:text-pink-500 hover:border-2 border-black transition"
                    >
                      {StudentData?.applicationNumber}
                    </button>
                  </div>
                </td>

                {/* Student Details */}
                <th
                  scope="row"
                  className="px-4 py-2 whitespace-nowrap align-top"
                >
                  <div className="w-[20vh] flex flex-col gap-1 items-start">
                    <div className="text-sm text-gray-900 dark:text-white font-semibold">
                      {StudentData?.fullName}
                    </div>
                    <div className="text-[11px]">
                      <span className="font-medium">DOB: </span>
                      <span>
                        {DateOfBirthExtract(StudentData?.dateOfBirth)}
                      </span>
                    </div>
                    <div className="text-[11px]">
                      <span className="font-medium">Contact: </span>
                      <span>{StudentData?.personalDetails?.phone}</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="font-medium">Father's Name: </span>
                      <span>{StudentData?.fatherName}</span>
                    </div>
                  </div>
                </th>

                {/* Status & Timeline */}
                <td className="px-4 py-2 align-top">
                  <div className="w-[35vh] flex flex-col gap-1">
                    {/* Status */}
                    {StudentData?.status?.TrackStatus !== "" && (
                      <div className="text-[11px]">
                        <span className="font-semibold text-black dark:text-white">
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

                    {/* Processed by center */}
                    {ReduxUser.role !== "center" &&
                      StudentData?.status?.processedbyCenteron === "" && (
                        <div className="flex items-center my-2 gap-2 text-[11px]">
                          <span className="font-semibold text-black dark:text-white">
                            Processed On :
                          </span>
                          <span className="text-red-600 font-bold">
                            Not Processed
                          </span>
                        </div>
                      )}

                    {StudentData?.status?.processedbyCenteron && (
                      <div className="text-[11px]">
                        <span className="font-semibold text-black dark:text-white">
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
                      <div className="text-[11px]">
                        <span className="font-semibold text-black dark:text-white">
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
                            {!StudentData?.documents?.isPendency &&
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
                        {StudentData?.documents?.isPendency && (
                          <span className="text-red-600 font-bold">
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
                    StudentData?.documents?.isApproved ? (
                      <div className="text-[11px]">
                        <span className="font-semibold text-black dark:text-white">
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
                    ) : (
                      StudentData?.documents?.isApproved && (
                        <div className="text-[11px]">
                          <span className="font-semibold text-black dark:text-white">
                            Processed to University on:
                          </span>
                          <span className="text-red-600 font-bold">
                            {" "}
                            Not Processed
                          </span>
                        </div>
                      )
                    )}

                    {/* Admission cancel date */}
                    {StudentData?.status?.admissionCancelDate?.trim() !==
                      "" && (
                      <div className="text-[11px]">
                        <span className="font-semibold text-black dark:text-white">
                          Admission Cancel on:
                        </span>
                        <span className="text-red-600 font-bold">
                          {" "}
                          {ExtractDateFromDb(
                            StudentData?.status?.admissionCancelDate,
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Enrollment No */}
                <td className="px-4 py-2 align-top">
                  <div className="w-[15vh] flex gap-3 items-center justify-center">
                    <div className="font-bold">
                      {StudentData?.EnrollmentNo === ""
                        ? "N/A"
                        : StudentData?.EnrollmentNo}
                    </div>
                  </div>
                </td>

                {/* OA Number */}
                <td className="px-4 py-2 align-top">
                  <div className="w-24 font-bold flex items-center justify-center">
                    <div>
                      {StudentData?.OANumber === ""
                        ? "N/A"
                        : StudentData?.OANumber}
                    </div>
                  </div>
                </td>

                {/* Admission Details */}
                <td className="px-4 py-2 align-top">
                  <div className="w-44 flex flex-col gap-1 text-[11px]">
                    <div>
                      Session:{" "}
                      <span className="font-bold">
                        {StudentData?.admissionSession?.name}
                      </span>
                    </div>
                    <div>
                      Type:{" "}
                      <span className="font-bold">
                        {StudentData?.admissionType?.name}
                      </span>
                    </div>
                    <div>
                      Program:{" "}
                      <span className="font-bold">
                        {StudentData?.Course?.shortName} (
                        {StudentData?.SubCourse?.shortName})
                      </span>
                    </div>
                    <div>
                      Sem:{" "}
                      <span className="font-bold">{StudentData?.year}</span>
                    </div>
                  </div>
                </td>

                {/* Center Details */}
                <td className="px-4 py-2 align-top">
                  <div className="w-52 flex flex-col gap-1 text-[11px]">
                    <div>
                      Center Name:{" "}
                      <span className="font-bold">
                        {StudentData?.center?.name}
                      </span>
                    </div>
                    <div>
                      Center Code:{" "}
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
                        Role:{" "}
                        <span className="font-bold capitalize">
                          {StudentData?.whoCreated?.role}
                        </span>
                      </div>
                      <div>
                        Name:{" "}
                        <span className="font-bold">
                          {StudentData?.whoCreated?.name}
                        </span>
                      </div>
                      <div>
                        Code:{" "}
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
                      className="font-medium bg-blue-200 hover:bg-blue-300 m-1 rounded-md text-gray-700 text-xs px-5 py-1 transition"
                    >
                      <div className="flex justify-center items-center gap-1.5">
                        <BsFillPrinterFill size={12} /> Print
                      </div>
                    </button>
                  </div>
                </td>

                {/* Courier Name */}
                <td className="px-4 py-2 align-center">
                  <div
                    className={`w-40 text-sm ${
                      StudentData?.Courier && "font-bold"
                    }`}
                  >
                    {StudentData?.Courier
                      ? StudentData?.Courier?.CourierName?.CourierName
                      : "N/A"}
                  </div>
                </td>

                {/* Courier Date */}
                <td className="px-4 py-2 align-center">
                  <div
                    className={`w-40 text-sm ${
                      StudentData?.Courier && "font-bold"
                    }`}
                  >
                    {StudentData?.Courier
                      ? ExtractDate(StudentData?.Courier?.DateTime)
                      : "N/A"}
                  </div>
                </td>

                {/* Courier Drop Location */}
                <td className="px-4 py-2 align-center">
                  <div
                    className={`w-40 text-sm ${
                      StudentData?.Courier && "font-bold"
                    }`}
                  >
                    {StudentData?.Courier
                      ? StudentData?.Courier?.DocketNo
                      : "N/A"}
                  </div>
                </td>

                {ReduxUser.role === "center" && (
                  <td className="text-center">
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
                  </td>
                )}
                
                {/* Courier Status for Admin */}
                {ReduxUser?.role === "Admin" && (
                  <td className="px-4 w-48 py-2 align-center">
                    <div className="flex justify-center items-center ml-10">
                      {StudentData?.Courier ? (
                        <div className="-ml-14 px-4 py-1.5 bg-orange-400 rounded-lg font-bold text-white text-sm w-36 text-center">
                          Assigned Courier
                        </div>
                      ) : (
                        <div className="-ml-14 px-2.5 py-1.5 bg-yellow-400 rounded-lg font-bold text-black text-xs w-36 text-center">
                          Not Assigned Courier
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </>
        ) : (
          <tr>
            <td colSpan={20}>
              <div className="flex justify-center items-center h-[60vh] font-bold tracking-wider text-slate-500">
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
    </>
  );
};

export default Canceladmission;
