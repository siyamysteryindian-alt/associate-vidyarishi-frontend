import React, { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import AllApplications from "./Filters/AllApplications";
import { FaBookOpenReader } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { FcDepartment } from "react-icons/fc";
import { RiMiniProgramFill } from "react-icons/ri";
import Filter1_applications from "./Filters/Filter1_applications";
import Filter2_applications from "./Filters/Filter2_applications";
import Canceladmission from "./Filters/Canceladmission";
import EnrolledList from "./Filters/Enrolled";
import NotprocessedList from "./Filters/Notprocessed";
import PendencyList from "./Filters/Pendency";
import Processedto_university from "./Filters/Processedto_university";
import Readyfor_verification from "./Filters/Readyfor_verification";
import Verifieddoc from "./Filters/Verifieddoc";
import NotFoundList from "./Filters/NotFoundList";
import { useSelector } from "react-redux";
import useGetDocuments from "../../../../CustomHooks/UseGetDocuments";
import UseGetProgramPagination from "../../../../CustomHooks/UseGetProgramPagination";
import UseGetDepartments from "../../../../CustomHooks/UseGetDepartments";
import UseGetCenterSubCenter from "../../../../CustomHooks/UseGetCenterSubCenter";
import UseGetAdmissionSession from "../../../../CustomHooks/UseGetAdmissionSession";
import UseGetLoggedUser from "../../../../CustomHooks/UseGetLoggedUser";

const ListOfApplications = ({
  FetchAllStudentByPagination,
  handlePageChange,
  AllStudentListData,
  AllStudentCurrentPage,
  AllStudentTotalPages,
  AllStudentLimit,
  AllStudentLoading,
  AllStudentTotalDocs,
}) => {
  const ReduxUniversityData = useSelector((state) => state.user);

  const {
    AllProgramsByPaginationLoading,
    AllProgramsByPaginationError,
    AllProgramsByPagination,
    GetAllProgramsByPagination,
  } = UseGetProgramPagination();

  const { DepartmentLoading, DepartmentError, Department, GetDepartment } =
    UseGetDepartments();

  const { GetCenter, CenterError, CenterLoading, Center } =
    UseGetCenterSubCenter();

  const {
    AdmissionsessionListData,
    AdmissionsessionCurrentPage,
    AdmissionsessionTotalPages,
    AdmissionsessionLimit,
    AdmissionsessionLoading,
    AdmissionsessionTotalDocs,
    GetAdmissionSession,
  } = UseGetAdmissionSession();

  useEffect(() => {
    GetCenter();
    GetAdmissionSession();
    GetAllProgramsByPagination();
  }, [ReduxUniversityData?.id]);

  const [Allapplications, setAllapplications] = useState(true);
  const [Notprocessed, setNotprocessed] = useState(false);
  const [ReadyForVerification, setReadyForVerification] = useState(false);
  const [Pendency, setPendency] = useState(false);
  const [ProcessedToUniversity, setProcessedToUniversity] = useState(false);
  const [Enrolled, setEnrolled] = useState(false);
  const [AdmissionCancel, setAdmissionCancel] = useState(false);
  const [Verified, setVerified] = useState(false);

  const resetTabs = () => {
    setAllapplications(false);
    setNotprocessed(false);
    setReadyForVerification(false);
    setPendency(false);
    setProcessedToUniversity(false);
    setEnrolled(false);
    setAdmissionCancel(false);
    setVerified(false);
    setSearchApplicationBoolean(false);
    setFilterOneBoolean(false);
  };

  const HandleAllApplicationsButton = () => {
    resetTabs();
    setAllapplications(true);
  };
  const HandleNotProcessedButton = () => {
    resetTabs();
    setNotprocessed(true);
  };
  const HandleReadyForVerificationButton = () => {
    resetTabs();
    setReadyForVerification(true);
  };
  const HandlePendencyButton = () => {
    resetTabs();
    setPendency(true);
  };
  const HandleProcessedToUniversityButton = () => {
    resetTabs();
    setProcessedToUniversity(true);
  };
  const HandleEnrolledButton = () => {
    resetTabs();
    setEnrolled(true);
  };
  const HandleAdmissionCancelButton = () => {
    resetTabs();
    setAdmissionCancel(true);
  };
  const HandleVerifiedButton = () => {
    resetTabs();
    setVerified(true);
  };

  // Search state
  const [SearchApplicationKeyWord, setSearchApplicationKeyWord] = useState({
    SearchListKeyWord: "",
  });
  const [SearchApplicationBoolean, setSearchApplicationBoolean] =
    useState(false);

  const HandleInputSearchApplication = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setSearchApplicationKeyWord((Preve) => ({
      ...Preve,
      [name]: value,
    }));

    if (value) {
      resetTabs();
      setAllapplications(true);
    }

    await FetchAllStudentByPagination(1, 100, value);
  };

  // Filter 1
  const [Filter1ListStateData, setFilter1ListStateData] = useState({
    ChangeYear: "",
    ChangeDepartment: " ",
    ChangeProgram: "",
    SelectDocument: "",
    ChooseCenter: "",
    FromDate: "",
    ToDate: "",
  });

  const [FilterOneBoolean, setFilterOneBoolean] = useState(false);

  const HandleFilter1applicationsListData = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilter1ListStateData((Preve) => ({
      ...Preve,
      [name]: value,
    }));

    let Programs;
    if (typeof value === "string") {
      Programs = value === "" ? " " : value;
    }

    if (value) {
      resetTabs();
      setAllapplications(true);
    }

    await FetchAllStudentByPagination(1, 100, Programs, value, value);
  };

  const LoggedUserDataFromRedux = useSelector((state) => state.user);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const { GetLoginUserDetails, GetLoggedUserLoader, LoggedUserData } =
    UseGetLoggedUser();

  const { GetAllDocuments, loadingDocuments, DocumentsError, Documents } =
    useGetDocuments();

  useEffect(() => {
    GetLoginUserDetails();
    GetAllDocuments();
    GetDepartment();
  }, [ReduxUniversityData?.id]);

  // counts
  const matchingStudentsCount = AllStudentListData?.filter(
    (data) =>
      data?.university?._id === UniversityGetDataFromRedux?.id &&
      !data?.isDeleted,
  ).length;

  const matchingStudentsCountNotProcessed = AllStudentListData?.filter(
    (data) =>
      data?.university?._id === UniversityGetDataFromRedux?.id &&
      !data?.isDeleted &&
      data?.status?.TrackStatus === "4" &&
      data?.status?.submitedFormDate !== "" &&
      data?.status?.processedbyCenteron === "" &&
      data?.status?.documentVerifiedOn === "" &&
      data?.status?.processedtoUniversityon === "",
  ).length;

  const matchingStudentsCountReadyForVerif = AllStudentListData?.filter(
    (StudentData) =>
      !StudentData?.isDeleted &&
      StudentData?.status?.processedbyCenteron !== "" &&
      StudentData?.status?.TrackStatus === "4" &&
      StudentData?.status?.submitedFormDate !== "" &&
      StudentData?.status?.processedbyCenteron !== "" &&
      StudentData?.status?.documentVerifiedOn === "" &&
      StudentData?.status?.processedtoUniversityon === "" &&
      StudentData?.university?._id === UniversityGetDataFromRedux?.id &&
      StudentData?.documents?.isPendency === false &&
      StudentData?.documents?.isApproved === false &&
      StudentData?.documents?.isApprovedDate === "",
  ).length;

  const matchingStudentsCountPendency = AllStudentListData?.filter(
    (StudentData) =>
      !StudentData?.isDeleted &&
      StudentData?.university?._id === UniversityGetDataFromRedux?.id &&
      StudentData?.status?.TrackStatus === "4" &&
      StudentData?.status?.submitedFormDate !== "" &&
      StudentData?.status?.processedbyCenteron !== "" &&
      StudentData?.status?.processedtoUniversityon === "" &&
      StudentData?.documents?.isPendency === true &&
      StudentData?.documents?.isApproved === false &&
      StudentData?.documents?.isApprovedDate === "",
  ).length;

  const matchingStudentsCountVerified = AllStudentListData?.filter(
    (StudentData) =>
      !StudentData?.isDeleted &&
      StudentData?.status?.TrackStatus === "4" &&
      StudentData?.status?.submitedFormDate !== "" &&
      StudentData?.status?.processedbyCenteron !== "" &&
      StudentData?.status?.processedtoUniversityon === "" &&
      StudentData?.status?.admissionCancelDate === "" &&
      StudentData?.university?._id === UniversityGetDataFromRedux?.id &&
      StudentData?.documents?.isPendency === false &&
      StudentData?.documents?.isApproved === true &&
      StudentData?.documents?.isApprovedDate !== "",
  ).length;

  const matchingStudentsCountProcessedToUniversity = AllStudentListData?.filter(
    (StudentData) =>
      !StudentData?.isDeleted &&
      StudentData?.university?._id === UniversityGetDataFromRedux?.id &&
      StudentData?.status?.TrackStatus === "4" &&
      StudentData?.status?.submitedFormDate !== "" &&
      StudentData?.status?.processedbyCenteron !== "" &&
      StudentData?.status?.processedtoUniversityon !== "" &&
      StudentData?.EnrollmentNo.trim() === "" &&
      StudentData?.status?.admissionCancelDate === "" &&
      StudentData?.documents?.isPendency === false &&
      StudentData?.documents?.isApproved === true &&
      StudentData?.documents?.isApprovedDate !== "",
  ).length;

  const matchingStudentsCountEnrolled = AllStudentListData?.filter(
    (StudentData) =>
      !StudentData?.isDeleted &&
      StudentData?.university?._id === UniversityGetDataFromRedux?.id &&
      StudentData?.status?.TrackStatus === "4" &&
      StudentData?.status?.submitedFormDate !== "" &&
      StudentData?.status?.processedbyCenteron !== "" &&
      StudentData?.status?.processedtoUniversityon !== "" &&
      StudentData?.status?.admissionCancelDate === "" &&
      (StudentData?.EnrollmentNo !== "" || StudentData?.OANumber !== "") &&
      Documents.filter(
        (studentDoc) =>
          studentDoc.isPendency === false &&
          studentDoc.isApproved === true &&
          studentDoc.isApprovedDate !== "",
      ).length > 0,
  ).length;

  const matchingStudentsAdmissionCancel = AllStudentListData?.filter(
    (StudentData) =>
      !StudentData?.isDeleted &&
      StudentData?.university?._id === UniversityGetDataFromRedux?.id &&
      StudentData?.status?.TrackStatus === "4" &&
      StudentData?.status?.submitedFormDate !== "" &&
      StudentData?.status?.processedbyCenteron !== "" &&
      StudentData?.status?.processedtoUniversityon !== "" &&
      StudentData?.status?.admissionCancelDate.trim() !== "" &&
      Documents.filter(
        (studentDoc) =>
          studentDoc.isPendency === false &&
          studentDoc.isApproved === true &&
          studentDoc.isApprovedDate !== "",
      ).length > 0,
  ).length;

  // const LoggedUserData = useSelector((s) => s.user);

  return (
    <>
      <section className="px-1 sm:py-2 text-sm">
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--soft-shadow)",
            borderRadius: "18px",
          }}
        >
          {/* Filter Row 1 – Year / Dept / Program / Docs / Center */}
          <div className="px-3 sm:px-4 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
            <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
              {/* Year */}
              <div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-slate-500">
                    <FaBookOpenReader size={16} />
                  </span>
                  <select
                    name="ChangeYear"
                    onChange={HandleFilter1applicationsListData}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value={""}>Choose Year</option>
                    {AdmissionsessionListData.length > 0 ? (
                      AdmissionsessionListData.filter(
                        (data) =>
                          data?.university === UniversityGetDataFromRedux.id &&
                          !data?.isDeleted,
                      ).map((data, i) => (
                        <option key={i} value={data?.name}>
                          {data?.name}
                        </option>
                      ))
                    ) : (
                      <option value="">Not Found</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Department (placeholder text) */}
              <div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <FcDepartment size={16} />
                  </span>
                  <select
                    name="ChangeDepartment"
                    onChange={HandleFilter1applicationsListData}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value={""}>Choose Department</option>
                    <option value={""}>We Are Working On It</option>
                  </select>
                </div>
              </div>

              {/* Program */}
              <div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-slate-500">
                    <RiMiniProgramFill size={16} />
                  </span>
                  <select
                    name="ChangeProgram"
                    onChange={HandleFilter1applicationsListData}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">Choose Program</option>
                    {AllProgramsByPagination?.length !== 0 ? (
                      AllProgramsByPagination.filter(
                        (data) =>
                          data?.university?._id ===
                            UniversityGetDataFromRedux.id && !data?.isDeleted,
                      )?.map((data, i) => (
                        <option key={i} value={data?.name}>
                          {data?.name}
                        </option>
                      ))
                    ) : (
                      <option value="">Not Found</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Documents */}
              <div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-slate-500">
                    <MdVerified size={16} />
                  </span>
                  <select
                    name="SelectDocument"
                    onChange={HandleFilter1applicationsListData}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value={""}>Choose Doc&apos;s</option>
                    <option value={""}>We Are Working On It</option>
                  </select>
                </div>
              </div>

              {/* Center (if not center user) */}
              {LoggedUserDataFromRedux?.role !== "center" && (
                <div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-slate-500">
                      <FaUserFriends size={16} />
                    </span>
                    <select
                      name="ChooseCenter"
                      onChange={HandleFilter1applicationsListData}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                      <option value={""}>Choose Center</option>
                      {Center.length !== 0 ? (
                        Center.filter((data) =>
                          data?.allotedUniversities?.some(
                            (university) =>
                              university?._id ===
                                UniversityGetDataFromRedux.id &&
                              !data?.isDeleted,
                          ),
                        ).map((data, i) => (
                          <option key={i} value={data?.name}>
                            {data?.name}
                          </option>
                        ))
                      ) : (
                        <option value="">Not Found</option>
                      )}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search row */}
          <nav
            className="flex flex-col md:flex-row items-center justify-between gap-2 px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-gray-900/80"
            aria-label="Table navigation"
          >
            <div className="w-full md:w-1/2">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-slate-500">
                  <IoMdSearch size={20} />
                </span>
                <input
                  type="text"
                  name="SearchListKeyWord"
                  onChange={HandleInputSearchApplication}
                  id="Application-search"
                  className="bg-gray-50 py-1.5 border border-gray-200 text-gray-900 rounded-full focus:ring-1 focus:ring-[var(--color-purple)] focus:border-[var(--color-purple)] block w-full pl-9 pr-3 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white text-sm"
                  placeholder="Search by Full Name, Aadhaar, Contact"
                />
              </div>
            </div>

            {/* (Pagination summary up here if needed later) */}
          </nav>

          {/* Status tabs row */}
          <div className="px-3 sm:px-4 py-2 dark:bg-slate-900/60 border-b ">
            <div className="w-full overflow-x-auto">
              <div className="inline-flex w-full min-w-[600px] rounded-full bg-white dark:bg-gray-800 shadow-sm border border-slate-100 dark:border-slate-700 text-xs">
                {/* each tab */}
                <button
                  onClick={HandleAllApplicationsButton}
                  title={`All Applications - ${matchingStudentsCount || 0}`}
                  className={`flex-1 px-2 py-2 rounded-l-full transition ${
                    Allapplications
                      ? "bg-yellow-300 text-slate-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200"
                  }`}
                >
                  All Applications - {matchingStudentsCount}
                </button>

                <button
                  onClick={HandleNotProcessedButton}
                  title={`Not Processed - ${
                    matchingStudentsCountNotProcessed || 0
                  }`}
                  className={`flex-1 px-2 py-2 transition ${
                    Notprocessed
                      ? "bg-yellow-300 text-slate-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200"
                  }`}
                >
                  Not Processed - {matchingStudentsCountNotProcessed}
                </button>

                <button
                  onClick={HandleReadyForVerificationButton}
                  title={`Ready for Verification - ${
                    matchingStudentsCountReadyForVerif || 0
                  }`}
                  className={`flex-1 px-2 py-2 transition ${
                    ReadyForVerification
                      ? "bg-yellow-300 text-slate-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200"
                  }`}
                >
                  Ready Verification - {matchingStudentsCountReadyForVerif || 0}
                </button>

                <button
                  onClick={HandlePendencyButton}
                  title={`Pendency - ${matchingStudentsCountPendency || 0}`}
                  className={`flex-1 px-2 py-2 transition ${
                    Pendency
                      ? "bg-yellow-300 text-slate-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200"
                  }`}
                >
                  Pendency - {matchingStudentsCountPendency}
                </button>

                <button
                  onClick={HandleVerifiedButton}
                  title={`Verified - ${matchingStudentsCountVerified || 0}`}
                  className={`flex-1 px-2 py-2 transition ${
                    Verified
                      ? "bg-yellow-300 text-slate-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200"
                  }`}
                >
                  Verified - {matchingStudentsCountVerified}
                </button>

                <button
                  onClick={HandleProcessedToUniversityButton}
                  title={`Processed To University - ${
                    matchingStudentsCountProcessedToUniversity || 0
                  }`}
                  className={`flex-1 px-2 py-2 transition ${
                    ProcessedToUniversity
                      ? "bg-yellow-300 text-slate-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200"
                  }`}
                >
                  Process University -{" "}
                  {matchingStudentsCountProcessedToUniversity}
                </button>

                <button
                  onClick={HandleEnrolledButton}
                  title={`Enrolled`}
                  className={`flex-1 px-2 py-2 transition ${
                    Enrolled
                      ? "bg-yellow-300 text-slate-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200"
                  }`}
                >
                  Enrolled - {matchingStudentsCountEnrolled}
                </button>

                <button
                  onClick={HandleAdmissionCancelButton}
                  title={`Admission Cancelled`}
                  className={`flex-1 px-2 py-2 rounded-r-full transition ${
                    AdmissionCancel
                      ? "bg-yellow-300 text-slate-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200"
                  }`}
                >
                  Admission Cancel - {matchingStudentsAdmissionCancel}
                </button>
              </div>
            </div>
          </div>

          {/* Table & content */}
          <div className="px-3 sm:px-4">
            <div className="overflow-auto h-[calc(100vh-300px)] min-h-[175px]">
              <div className="max-w-[146vh] min-w-full">
                <table className="min-w-full text-sm text-slate-900">
                  <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs uppercase">
                    <tr>
                      {[
                        "Actions",
                        "Photo",
                        "Application Number",
                        "Student",
                        "Status",
                        "Enrollment No",
                        "OA Number",
                        "Admission Details",
                        "Center Details",
                        ...(LoggedUserData?.role === "center" ||
                        LoggedUserData?.role === "Admin"
                          ? ["Who Created"]
                          : []),
                        "Form",
                        "Courier Name",
                        "Sent Date",
                        "Docket No",
                        "View Courier Details",
                        "Courier Actions",
                      ].map((header) => (
                        <th
                          scope="col"
                          className="px-4 py-2 whitespace-nowrap"
                          key={header}
                        >
                          <div className="flex gap-2 items-center">
                            <span
                              className={`${header === "Form" && "pl-2"} ${
                                header === "Application Number" && "pl-4 w-44"
                              } ${header === "OA Number" && "pl-4 w-32"} ${
                                header === "Enrollment No" && "pl-4 w-32"
                              } whitespace-nowrap overflow-hidden text-ellipsis`}
                            >
                              {header}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {Allapplications ? (
                    <AllApplications
                      searchkey={SearchApplicationKeyWord?.SearchListKeyWord}
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                    />
                  ) : Notprocessed ? (
                    <NotprocessedList
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                    />
                  ) : ReadyForVerification ? (
                    <Readyfor_verification
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                    />
                  ) : Pendency ? (
                    <PendencyList
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                    />
                  ) : ProcessedToUniversity ? (
                    <Processedto_university
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                    />
                  ) : Enrolled ? (
                    <EnrolledList
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                    />
                  ) : AdmissionCancel ? (
                    <Canceladmission
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                    />
                  ) : Verified ? (
                    <Verifieddoc
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                    />
                  ) : SearchApplicationBoolean ? (
                    <Filter2_applications
                      searchkey={SearchApplicationKeyWord?.SearchListKeyWord}
                      FetchAllStudentByPagination={FetchAllStudentByPagination}
                      handlePageChange={handlePageChange}
                      AllStudentListData={AllStudentListData}
                      AllStudentCurrentPage={AllStudentCurrentPage}
                      AllStudentTotalPages={AllStudentTotalPages}
                      AllStudentLimit={AllStudentLimit}
                      AllStudentLoading={AllStudentLoading}
                      AllStudentTotalDocs={AllStudentTotalDocs}
                    />
                  ) : FilterOneBoolean ? (
                    <Filter1_applications />
                  ) : (
                    <NotFoundList />
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListOfApplications;
