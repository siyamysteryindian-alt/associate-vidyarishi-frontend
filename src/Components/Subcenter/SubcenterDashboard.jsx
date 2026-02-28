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
import UseGetLoggedUser from "../../CustomHooks/UseGetLoggedUser";
import PaymentDetailsCard from "./PaymentDetailsCard";

const SubcenterDashboard = () => {
  const ReduxUniversity = useSelector((state) => state?.university);
  const UniversityGetDataFromRedux = useSelector((state) => state?.university);
  const ReduxUserlogin = useSelector((state) => state?.user);

  const { GetLoginUserDetails, GetLoggedUserLoader, LoggedUserData } =
    UseGetLoggedUser();

  // get university Hook
  const { GetUniversity, UniversityLoading, UniversityError, universities } =
    useGetUniversity();

  // get universitymanager operational & admin hook
  const {
    GetUniversityManager,
    UniversityManagerLoading,
    UniversityManagerError,
    UniversityManager,

    GetAdminDetails,
    AdminDetailsLoading,
    AdminDetailsError,
    AdminDetails,

    GetOperationalManager,
    OperationalManagerLoading,
    OperationalManagerError,
    OperationalManager,
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

  // Loading All Hooks
  useEffect(() => {
    if (UniversityGetDataFromRedux?.id) {
      GetLoginUserDetails();
      GetUniversityManager();
      GetAdminDetails();
      GetAccountantData();
      FetchAllStudentByPagination();
      GetAdmissionSession();
      GetAdmissionSession();
      GetOperationalManager();
    }
  }, [UniversityGetDataFromRedux?.id !== ""]);

  useEffect(() => {
    if (UniversityGetDataFromRedux?.id !== "") {
      GetCenter();
      GetSubCenter();
      GetCounsellorManager();
    }
  }, [UniversityGetDataFromRedux?.id !== ""]);

  useEffect(() => {
    GetUniversity();
  }, [ReduxUserlogin?.id]);

  // useEffect(() => {
  //   GetAdmissionSession();
  // }, [ReduxUserlogin?.id]);

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
  // }, [UniversityGetDataFromRedux !== "" || ReduxLoggedUser?.id]);

  return (
    <>
      <section className="top-0 dark:bg-slate-800  pb-2 rounded-lg ">
        <div className="ScrollBarStyle h-[calc(100vh-40px)]  overflow-hidden overflow-y-scroll">
          <div className="px-2.5 flex  flex-col ">
            <div className="text-base font-semibold bg-white text-left mt-3 rounded-2xl mb-4  p-4 ">
              Hi <span className=" font-bold"> {ReduxUserlogin?.name}</span> ,
              Welcome Back <br />
              <span className="font-bold">
                ({ReduxUserlogin?.role === "subCenter" && "Sub Center"}{" "}
                Dashboard)
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 grid grid-cols-2 md:grid-cols-3 gap-6 my-2">
              <DashboardCard
                title="Universities"
                count={LoggedUserData.allotedUniversities?.length || 0}
                // color="from-indigo-500 to-indigo-700"
                color="from-[#1F4E79]  to-[#1F4E79]"
                trend="+5%"
              />
              <DashboardCard
                title="All Students"
                count={
                  AllStudentListData?.filter(
                    (data) => data.university._id === ReduxUniversity?.id
                  )?.length || 0
                }
                // color="from-green-500 to-green-700"
                color="from-[#1F4E79]  to-[#1F4E79]"
                trend="+6%"
              />
            </div>

            <div className="flex flex-row text-sm flex-wrap  justify-start gap-6 dark:text-black mb-6 mt-4">
              {AdmissionsessionListData?.filter(
                (university) => university?.university === ReduxUniversity?.id
              ).map((data) => {
                // Filter the AllStudentListData for the current session once
                const studentsForSession = AllStudentListData?.filter(
                  (centerCheck) =>
                    centerCheck?.admissionSession?._id === data?._id
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
                    key={data?._id}
                    className="bg-white border shadow-xl border-gray-200 rounded-2xl p-4 w-full max-w-xs"
                  >
                    <div className="text-base font-bold mb-1 text-primary">
                      Session: {data?.name}
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Total Admissions:</span>
                        <span>{totalAdmissions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          Total Center Processed:
                        </span>
                        <span>{totalProcessed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Doc's Pending:</span>
                        <span>{totalPending}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Enrolled:</span>
                        <span>{totalEnrolled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Ready:</span>
                        <span>{totalReady}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="">
              <PaymentDetailsCard
                UniversityDetails={LoggedUserData.allotedUniversities}
                universityId={UniversityGetDataFromRedux.id}
              />
            </div>

            {/* University Details Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-8">
              <div className="px-6 py-4 font-bold text-sm text-primary">
                Alloted Universities To {ReduxUserlogin?.name} ({""}
                {ReduxUserlogin?.role === "operation-manager" &&
                  "Operational Manager"}
                )
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Photo",
                        "Name",
                        "Address",
                        "Departments",
                        "Courses",
                        "Specializations",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2 text-left font-semibold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {LoggedUserData.allotedUniversities?.length > 0 ? (
                      LoggedUserData.allotedUniversities?.map((u) => (
                        <tr
                          key={u?._id}
                          className="even:bg-gray-50 hover:bg-gray-100"
                        >
                          <td className="px-4 py-2">
                            <img
                              src={u?.photo}
                              alt=""
                              className="w-24 rounded-md"
                            />
                          </td>
                          <td className="px-4 py-2">{u?.name}</td>
                          <td className="px-4 py-2">{u?.address}</td>
                          <td className="px-4 py-2">
                            {u?.department?.length || 0}
                          </td>
                          <td className="px-4 py-2">
                            {u?.program?.length || 0}
                          </td>
                          <td className="px-4 py-2">
                            {u?.specialization?.length || 0}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                u?.isAvailable
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {u?.isAvailable ? "Available" : "Not Available"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <div>Not Alloted </div>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl mr-2 w-full h-auto bg-white shadow-xl border mb-10">
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
                      {SubCenter.length > 0 ? (
                        SubCenter.filter(
                          (subcent) => subcent?._id === ReduxUserlogin?.id
                        ).map((GetCent) => (
                          <tr
                            key={GetCent?.center?._id || GetCent?.center?.name}
                          >
                            <td className="px-4 py-2 capitalize">
                              {GetCent?.center?.role || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {GetCent?.center?.name || "N/A"} (
                              {GetCent?.center?.contactPersonName || "N/A"})
                            </td>
                            <td className="px-4 py-2">
                              {GetCent?.center?.contact || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {GetCent?.center?.email || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t">
                          <td className="px-4 py-2 capitalize">Counsellor</td>
                          <td className="px-4 py-2 capitalize" colSpan={3}>
                            Counsellor Not Allotted
                          </td>
                        </tr>
                      )}

                      {OperationalManager.length !== 0 ? (
                        OperationalManager?.slice(0, 1)?.map((data, i) => (
                          <>
                            <tr key={i} className="border-t ">
                              <td className="px-4 py-2 capitalize">
                                {data?.role === "operation-manager" &&
                                  "Operational Manager"}
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
                            <td className="px-4 py-2 capitalize">
                              Operational Manger
                            </td>
                            <td className="px-4 py-2">
                              Operational Manger Not Alloted
                            </td>
                          </tr>
                        </>
                      )}

                      {UniversityManagerDetails.length !== 0 ? (
                        UniversityManagerDetails?.slice(0, 1)?.map(
                          (data, i) => (
                            <>
                              <tr key={i} className="border-t ">
                                <td className="px-4 py-2 capitalize">
                                  {data?.role === "university-manager" &&
                                    "University Manager"}
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

export default SubcenterDashboard;
