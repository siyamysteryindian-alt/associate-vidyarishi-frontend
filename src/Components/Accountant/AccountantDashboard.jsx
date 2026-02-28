import React, { useEffect } from "react";
import useGetUniversity from "../../CustomHooks/UseGetUniversities";
import useGetProgramType from "../../CustomHooks/UseGetProgramType";
import useGetUniversityManager from "../../CustomHooks/UseGetUniversityManager";
import UseGetCenterSubCenter from "../../CustomHooks/UseGetCenterSubCenter";
import useGetCounsellor from "../../CustomHooks/UseGetCounsellor";
import Loader from "../../Helper/Loader";
import { useSelector } from "react-redux";
import UseGetAccountant from "../../CustomHooks/UseGetAccountant";
import UseGetAllStudents from "../../CustomHooks/UseGetStudentsPagination";
import UseGetAdmissionSession from "../../CustomHooks/UseGetAdmissionSession";
import useGetDocuments from "../../CustomHooks/UseGetDocuments";
import DashboardCard from "../DasboardComp/DashboardCard";

const AccountantDashboard = () => {
  const ReduxUniversity = useSelector((state) => state?.university);
  const UniversityGetDataFromRedux = useSelector((state) => state?.university);
  const ReduxUserlogin = useSelector((state) => state?.user);

  // get university Hook
  const { GetUniversity, UniversityLoading, UniversityError, universities } =
    useGetUniversity();

  // Get program types hook
  const {
    GetProgramType,
    LoadingProgramTypes,
    ErrorProgramTypes,
    ProgramTypes,
  } = useGetProgramType();

  // get universitymanager operational & admin hook
  const {
    GetUniversityManager,
    UniversityManagerLoading,
    UniversityManagerError,
    UniversityManager,

    GetOperationalManager,
    OperationalManagerLoading,
    OperationalManagerError,
    OperationalManager,

    GetAdminDetails,
    AdminDetailsLoading,
    AdminDetailsError,
    AdminDetails,
  } = useGetUniversityManager();

  // Get SubCenter Hook
  const {
    GetCenter,
    GetSubCenter,
    CenterLoading,
    SubCenterLoading,
    CenterError,
    SubCenterError,
    Center,
    SubCenter,
  } = UseGetCenterSubCenter();

  // Get Counsellor & subcounsellor Hook
  const {
    GetCounsellorManager,
    CounsellorManagerLoading,
    CounsellorManagerError,
    CounsellorManager,

    GetSubCounsellorManager,
    SubCounsellorManagerLoading,
    SubCounsellorManagerError,
    SubCounsellorManager,
  } = useGetCounsellor();

  // Get Accounting Hook
  const { AccountantLoading, AccountantError, Accountant, GetAccountantData } =
    UseGetAccountant();

  // Get Student Hook
  const {
    FetchAllStudentByPagination,
    handlePageChange,
    AllStudentListData,
    AllStudentCurrentPage,
    AllStudentTotalPages,
    AllStudentLimit,
    AllStudentLoading,
    AllStudentTotalDocs,
  } = UseGetAllStudents();

  // Get Admission Hook
  const {
    AdmissionsessionListData,
    AdmissionsessionCurrentPage,
    AdmissionsessionTotalPages,
    AdmissionsessionLimit,
    AdmissionsessionLoading,
    AdmissionsessionTotalDocs,
    GetAdmissionSession,
  } = UseGetAdmissionSession();

  // Get All Documents Hook
  const { GetAllDocuments, loadingDocuments, DocumentsError, Documents } =
    useGetDocuments();

  // Loading All Hooks
  useEffect(() => {
    if (UniversityGetDataFromRedux?.id) {
      GetProgramType();
      GetUniversityManager();
      GetOperationalManager();
      GetCenter();
      GetSubCenter();
      GetCounsellorManager();
      GetSubCounsellorManager();
      GetAdminDetails();
      GetAccountantData();
      FetchAllStudentByPagination();
      GetAdmissionSession();
      GetAllDocuments();
    }
  }, [UniversityGetDataFromRedux?.id]);

  useEffect(() => {
    GetUniversity();
  }, []);

  useEffect(() => {
    GetAdmissionSession();
  }, [ReduxUserlogin?.id]);

  const GetCounsellorDetails = () => {
    return CounsellorManager?.filter((data) =>
      data?.allotedUniversities?.some(
        (university) => university?._id === ReduxUniversity?.id
      )
    );
  };

  const GetUniversityManagerDetails = () => {
    return UniversityManager?.filter((data) =>
      data?.allotedUniversities?.some(
        (university) => university?._id === ReduxUniversity?.id
      )
    );
  };
  const GetAccountantDetails = () => {
    return Accountant?.filter((data) =>
      data?.allotedUniversities?.some(
        (university) => university?._id === ReduxUniversity?.id
      )
    );
  };

  const filterUniversities = () => {
    return universities?.filter(
      (university) => university?._id === ReduxUniversity?.id
    );
  };

  const filteredUniversities = filterUniversities();

  const AccountantDetails = GetAccountantDetails();
  const UniversityManagerDetails = GetUniversityManagerDetails();
  const CounsellorDetails = GetCounsellorDetails();

  // useEffect(() => {
  //   GetUniversity();
  //   GetProgramType();
  //   GetUniversityManager();
  //   GetOperationalManager();
  //   GetCenter();
  //   GetSubCenter();
  //   GetCounsellorManager();
  //   GetSubCounsellorManager();
  //   FetchAllStudentByPagination();
  // }, []);

  return (
    <>
      <section className="top-0 dark:bg-slate-800  pb-2 rounded-lg ">
        <div className="ScrollBarStyle h-[calc(100vh-40px)]  overflow-hidden overflow-y-scroll">
          <div className="px-2.5 flex  flex-col ">
            <div className="text-base font-semibold bg-white text-left mt-3 rounded-2xl p-4 ">
              Hi <span className=" font-bold"> {ReduxUserlogin?.name}</span> ,
              Welcome Back <br />
              <span className="font-bold">
                ({ReduxUserlogin?.role === "Accountant" && "Accountant"}{" "}
                Dashboard)
              </span>
            </div>

            <div className="flex flex-row text-sm flex-wrap ml-2  justify-start gap-6 dark:text-black mb-6">
              {AdmissionsessionListData?.filter(
                (university) => university?.university === ReduxUniversity?.id
              ).map((data) => {
                // Filter the AllStudentListData for the current session once
                const studentsForSession = AllStudentListData?.filter(
                  (counsellorCheck) =>
                    counsellorCheck?.admissionSession?._id === data?._id
                );

                const totalAdmissions = studentsForSession.length;

                const totalProcessed = studentsForSession.filter(
                  (Processed) =>
                    Processed?.status?.TrackStatus === "4" &&
                    Processed?.status?.submitedFormDate !== "" &&
                    !Processed?.documents?.isApproved &&
                    !Processed?.documents?.isPendency &&
                    Processed?.status?.processedbyCenteron !== "" &&
                    Processed?.status?.processedtoUniversityon === "" &&
                    Processed?.EnrollmentNo !== ""
                ).length;

                const totalEnrolled = studentsForSession.filter(
                  (Processed) =>
                    Processed?.status?.TrackStatus === "4" &&
                    Processed?.status?.submitedFormDate !== "" &&
                    Processed?.documents?.isApproved &&
                    !Processed?.documents?.isPendency &&
                    Processed?.status?.processedbyCenteron !== "" &&
                    Processed?.status?.processedtoUniversityon !== "" &&
                    Processed?.EnrollmentNo === ""
                ).length;

                const totalReady = studentsForSession.filter(
                  (Processed) =>
                    Processed?.status?.TrackStatus === "4" &&
                    Processed?.status?.submitedFormDate !== "" &&
                    Processed?.documents?.isApproved &&
                    !Processed?.documents?.isPendency &&
                    Processed?.status?.processedbyCenteron !== "" &&
                    Processed?.status?.processedtoUniversityon !== "" &&
                    Processed?.EnrollmentNo !== ""
                ).length;

                const totalPending = studentsForSession.filter(
                  (Processed) =>
                    Processed?.status?.TrackStatus === "4" &&
                    Processed?.status?.submitedFormDate !== "" &&
                    Processed?.documents?.isApproved &&
                    !Processed?.documents?.isPendency &&
                    Processed?.documents?.isApprovedDate !== "" &&
                    Processed?.status?.processedbyCenteron !== "" &&
                    Processed?.status?.processedtoUniversityon === "" &&
                    Processed?.EnrollmentNo === ""
                ).length;

                return (
                  <div
                    key={data?.id}
                    className="rounded-2xl  bg-white p-6 shadow-xl border w-full max-w-xs "
                  >
                    <div className="text-sm font-bold mb-4">
                      Session: {data?.name}
                    </div>

                    <div className="space-y-4">
                      {/* Total Admissions */}
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Admissions:</span>
                        <span>{totalAdmissions}</span>
                      </div>

                      {/* Total Processed */}
                      <div className="flex justify-between">
                        <span className="font-semibold">
                          Total Center Processed:
                        </span>
                        <span>{totalProcessed}</span>
                      </div>

                      {/* Total Pending */}
                      <div className="flex justify-between">
                        <span className="font-semibold">
                          Doc's Pending/Approved :
                        </span>
                        <span>{totalPending}</span>
                      </div>

                      {/* Total Enrolled */}
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Enrolled:</span>
                        <span>{totalEnrolled}</span>
                      </div>

                      {/* Ready */}
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Ready:</span>
                        <span>{totalReady}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-4">
              <DashboardCard
                title="This University Students"
                count={
                  AllStudentListData?.filter(
                    (data) => data.university._id === ReduxUniversity?.id
                  )?.length || 0
                }
                // color="from-indigo-500 to-indigo-700"
                // trend="+5%"
                color="from-[#1F4E79]  to-[#1F4E79]"
                trend=""
              />
            </div>

            <div className="bg-white w-full shadow-xl border border-gray-200 rounded-2xl mb-6 mt-2">
              <div className="text-left mx-5 mt-4 tracking-wide font-bold text-sm">
                Payment Details
              </div>
              <div className="text-left ml-6 mb-2 flex justify-start items-start flex-row gap-5 px-4 py-2">
                <div className="flex justify-start items-start flex-col gap-5 text-xs">
                  <div>Account Holder</div>
                  <div>IFSC CODE</div>
                  <div>Account Number</div>
                  <div>Bank Name</div>
                  <div>Branch Name</div>
                </div>

                {filteredUniversities?.map((data) => (
                  <div className="flex justify-start items-start flex-col gap-5 text-xs">
                    <div>: {data?.PaymentDetailsModel?.Name || "N/A"}</div>
                    <div>: {data?.PaymentDetailsModel?.IFSC || "N/A"}</div>
                    <div>
                      : {data?.PaymentDetailsModel?.AccountNumber || "N/A"}
                    </div>
                    <div>: {data?.PaymentDetailsModel?.BankName || "N/A"}</div>
                    <div>: {data?.PaymentDetailsModel?.Branch || "N/A"}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm my-4">
              <div className="text-left m-5 tracking-wide font-bold text-sm">
                University Details
              </div>
              <div className="text-left m-5">
                <table className="bg-white border border-gray-200 rounded">
                  {/* Table Header */}
                  <thead className="">
                    <tr className=" text-sm">
                      {[
                        "Photo",
                        "Name",
                        "Address",
                        "No Of Departments",
                        "No Of Courses",
                        "No Of Sub-Course",
                        "isAvailable",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 text-left font-bold whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {AccountantDetails?.filter(
                      (Accountantcheck) =>
                        Accountantcheck?._id === ReduxUserlogin?.id
                    )?.map((data, i) =>
                      data?.allotedUniversities?.length > 0 ? (
                        data?.allotedUniversities.map((university, index) => (
                          <tr key={index} className="border-t text-sm">
                            <td className="px-4 py-2">
                              <img
                                width={150}
                                height={150}
                                src={university?.photo || "N/A"}
                                alt={university?.name || "N/A"}
                                className="rounded-lg"
                              />
                            </td>
                            <td className="px-4 py-2">
                              {university?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2 w-64">
                              {university?.address || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {university?.department?.length || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {university?.program?.length || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {university?.specialization?.length || "N/A"}
                            </td>
                            <td className={`px-4 py-2 font-bold `}>
                              <button
                                className={`px-4 py-1 rounded-sm font-bold ${
                                  university?.isAvailable
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                              >
                                {university?.isAvailable
                                  ? "Available"
                                  : "Not Available"}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr key={i} className="border-t">
                          <td colSpan="7" className="px-4 py-2 text-center">
                            No universities found in this center.
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className=" mr-2 w-full h-auto rounded-2xl bg-white shadow-xl border">
              <div className="w-full h-auto ">
                <div className="text-left m-5 tracking-wide font-bold text-sm">
                  Help & Support
                </div>
                <div className="text-left m-5">
                  <table className="bg-white border w-full border-gray-200 rounded">
                    {/* Table Header */}
                    <thead className="text-sm">
                      <tr>
                        {["Level", "Name", "Mobile", "Email"].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-2 text-left font-bold whitespace-nowrap"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="text-sm">
                      {SubCounsellorManager?.length > 0 ? (
                        SubCounsellorManager?.filter(
                          (filter) => filter?._id === ReduxUserlogin?.id
                        )?.map((subcouns) => (
                          <tr
                            key={subcouns?.counsellors?._id}
                            className="border-t"
                          >
                            <td className="px-4 py-2 capitalize">
                              {subcouns?.counsellors?.role || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {subcouns?.counsellors?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {subcouns?.counsellors?.contact || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {subcouns?.counsellors?.email || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t">
                          <td className="px-4 py-2 capitalize">Center</td>
                          <td className="px-4 py-2 capitalize" colSpan={3}>
                            Centers Not Allotted
                          </td>
                        </tr>
                      )}

                      {SubCounsellorManager?.length > 0 ? (
                        SubCounsellorManager.filter(
                          (subcouns) =>
                            subcouns?.counsellors?._id === ReduxUserlogin?.id
                        ).map((GetCouns) => (
                          <tr key={GetCouns?._id} className="border-t">
                            <td className="px-4 py-2 capitalize">
                              {GetCouns?.role || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {GetCouns?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {GetCouns?.contact || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {GetCouns?.email || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t">
                          <td className="px-4 py-2 capitalize">
                            Sub Counsellor
                          </td>
                          <td className="px-4 py-2 capitalize" colSpan={3}>
                            Sub Counsellor Not Allotted
                          </td>
                        </tr>
                      )}

                      {UniversityManagerDetails.length !== 0 ? (
                        UniversityManagerDetails?.slice(0, 1)?.map(
                          (data, i) => (
                            <>
                              <tr key={i} className="border-t ">
                                <td className="px-4 py-2 capitalize">
                                  {data?.role}
                                </td>
                                <td className="px-4 py-2">{data?.name}</td>
                                <td className="px-4 py-2">{data?.contact}</td>
                                <td className="px-4 py-2">{data?.email}</td>
                              </tr>
                            </>
                          )
                        )
                      ) : (
                        <>
                          <tr className="border-t">
                            <td className="px-4 py-2 capitalize">
                              University Manger
                            </td>
                            <td className="px-4 py-2">
                              University Manger Not Alloted
                            </td>
                          </tr>
                        </>
                      )}
                      {AccountantDetails.length !== 0 ? (
                        AccountantDetails?.slice(0, 1)?.map((data, i) => (
                          <>
                            <tr key={i} className="border-t">
                              <td className="px-4 py-2 capitalize">
                                {data?.role}
                              </td>
                              <td className="px-4 py-2">{data?.name}</td>
                              <td className="px-4 py-2">{data?.contact}</td>
                              <td className="px-4 py-2">{data?.email}</td>
                            </tr>
                          </>
                        ))
                      ) : (
                        <>
                          <tr className="border-t">
                            <td className="px-4 py-2 capitalize">Accountant</td>
                            <td className="px-4 py-2">
                              Accountant Not Alloted
                            </td>
                          </tr>
                        </>
                      )}

                      {AdminDetails?.slice(0, 1)?.map((data, i) => (
                        <>
                          <tr key={i} className="border-t">
                            <td className="px-4 py-2 capitalize">Head</td>
                            <td className="px-4 py-2">{data?.name}</td>
                            <td className="px-4 py-2">{data?.contact}</td>
                            <td className="px-4 py-2">{data?.email}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountantDashboard;
