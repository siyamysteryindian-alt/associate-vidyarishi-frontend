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

const CenterDashboard = () => {
  const ReduxUniversity = useSelector((state) => state?.university);
  const UniversityGetDataFromRedux = useSelector((state) => state?.university);
  const ReduxLoggedUser = useSelector((state) => state?.user);

  // get university Hook
  const { GetUniversity, UniversityLoading, UniversityError, universities } =
    useGetUniversity();

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

  const { GetLoginUserDetails, GetLoggedUserLoader, LoggedUserData } =
    UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
    GetSubCenter();
  }, []);

  // Loading All Hooks
  useEffect(() => {
    if (UniversityGetDataFromRedux?.id) {
      GetUniversityManager();
      GetOperationalManager();
      GetAdminDetails();
      GetAccountantData();
      FetchAllStudentByPagination();
      GetAdmissionSession();
    }
  }, [UniversityGetDataFromRedux?.id !== ""]);

  useEffect(() => {
    if (ReduxLoggedUser?.id) {
      GetUniversity();
    }
  }, [ReduxLoggedUser?.id]);

  useEffect(() => {
    if (UniversityGetDataFromRedux?.id !== "") {
      GetCenter();
      GetCounsellorManager();
    }
  }, [UniversityGetDataFromRedux?.id !== ""]);

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

  const AccountantDetails = GetAccountantDetails();
  const UniversityManagerDetails = GetUniversityManagerDetails();
  const CounsellorDetails = GetCounsellorDetails();

  const matchingStudentsCount = AllStudentListData?.filter(
    (data) =>
      data?.university?._id === UniversityGetDataFromRedux?.id &&
      data?.center?._id === ReduxLoggedUser?.id &&
      !data?.isDeleted
  ).length;

  return (
    <>
      <section className="top-0 dark:bg-slate-800  pb-2 rounded-lg ">
        <div className="ScrollBarStyle h-[calc(100vh-40px)]  overflow-hidden overflow-y-scroll">
          <div className="px-2.5 flex  flex-col ">
            <div className="text-base font-semibold bg-white text-left mt-3 rounded-2xl mb-4  p-4 ">
              Hi <span className=" font-bold"> {ReduxLoggedUser?.name}</span> ,
              Welcome Back <br />
              <span className="font-bold">(Center Dashboard)</span>
            </div>

            <div className="bg-white rounded-2xl p-4 grid grid-cols-2 md:grid-cols-3 gap-6 ">
              <DashboardCard
                title="Sub Centers"
                count={
                  SubCenter?.filter(
                    (data) => data?.center?._id === ReduxLoggedUser?.id
                  ).length || 0
                }
                // color="from-pink-500 to-pink-700"
                color="from-[#1F4E79]  to-[#1F4E79]"
                trend="+1%"
              />
              <DashboardCard
                title="Your Students"
                count={matchingStudentsCount || 0}
                // color="from-green-500 to-green-700"
                color="from-[#1F4E79]  to-[#1F4E79]"
                trend="+6%"
              />
              <DashboardCard
                title="Universities"
                count={LoggedUserData?.allotedUniversities?.length || 0}
                // color="from-indigo-500 to-indigo-700"
                color="from-[#1F4E79]  to-[#1F4E79]"
                trend="+5%"
              />
            </div>

            <div className="flex flex-row text-sm flex-wrap justify-start gap-6 dark:text-black my-6">
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
                  <>
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
                  </>
                );
              })}
            </div>

            <div className="flex flex-wrap ml-2 justify-start gap-6 dark:text-black mb-10">
              {/* Payment Details */}
              <div className="bg-white w-full shadow-xl border border-gray-200 rounded-2xl">
                <div className="px-6 py-4 font-bold text-sm text-primary">
                  Payment Details
                </div>
                <div className="flex gap-5 px-6 pb-4 text-sm text-gray-700">
                  <div className="flex flex-col font-semibold gap-2">
                    <div>Account Holder</div>
                    <div>IFSC CODE</div>
                    <div>Account Number</div>
                    <div>Bank Name</div>
                    <div>Branch Name</div>
                  </div>
                  {LoggedUserData?.allotedUniversities
                    ?.filter((v) => v._id === UniversityGetDataFromRedux?.id)
                    ?.map((u) => (
                      <div
                        key={u?._id}
                        className="flex flex-col font-bold gap-2"
                      >
                        <div>: {u?.PaymentDetailsModel?.Name || "N/A"}</div>
                        <div>: {u?.PaymentDetailsModel?.IFSC || "N/A"}</div>
                        <div>
                          : {u?.PaymentDetailsModel?.AccountNumber || "N/A"}
                        </div>
                        <div>: {u?.PaymentDetailsModel?.BankName || "N/A"}</div>
                        <div>: {u?.PaymentDetailsModel?.Branch || "N/A"}</div>
                      </div>
                    ))}
                </div>
              </div>

              {/* University Details Table */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="px-6 py-4 font-bold text-sm text-primary">
                  Alloted Universities To {ReduxLoggedUser?.name} ({""}
                  {ReduxLoggedUser?.role === "center" && "Center"})
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
                      {LoggedUserData?.allotedUniversities?.length > 0 ? (
                        LoggedUserData?.allotedUniversities?.map((u) => (
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
                        <div>Not Alloted Any</div>
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
                          {["Level", "Name", "Mobile", "Email"].map(
                            (header) => (
                              <th
                                key={header}
                                className="px-4 py-2 text-left font-bold whitespace-nowrap"
                              >
                                {header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>

                      {/* Table Body */}
                      <tbody className="text-sm">
                        {CounsellorDetails.length !== 0 ? (
                          CounsellorDetails?.slice(0, 1)?.map((data) => (
                            <tr key={data?._id || data?.name}>
                              {" "}
                              {/* Use a unique identifier like _id or name */}
                              <td className="px-4 py-2 capitalize">
                                {data?.role}
                              </td>
                              <td className="px-4 py-2">{data?.name}</td>
                              <td className="px-4 py-2">{data?.contact}</td>
                              <td className="px-4 py-2">{data?.email}</td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-t">
                            <td className="px-4 py-2 capitalize">Counsellor</td>
                            <td className="px-4 py-2 capitalize">
                              Counsellor Not Alloted
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
                              <td className="px-4 py-2 capitalize">
                                Accountant
                              </td>
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
        </div>
      </section>
    </>
  );
};

export default CenterDashboard;
