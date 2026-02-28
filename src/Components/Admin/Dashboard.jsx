import React, { useEffect } from "react";
import useGetUniversity from "../../CustomHooks/UseGetUniversities";
import useGetProgramType from "../../CustomHooks/UseGetProgramType";
import useGetUniversityManager from "../../CustomHooks/UseGetUniversityManager";
import UseGetCenterSubCenter from "../../CustomHooks/UseGetCenterSubCenter";
import useGetCounsellor from "../../CustomHooks/UseGetCounsellor";
import Loader from "../../Helper/Loader";
import UseGetAllStudents from "../../CustomHooks/UseGetStudentsPagination";
import { useSelector } from "react-redux";
import UseGetLoggedUser from "../../CustomHooks/UseGetLoggedUser";
import AdminDashboard from "../DasboardComp/Main/AdminDashboard";

const Dashboard = () => {
  const UniversityGetReduxData = useSelector((state) => state.university);

  const { GetUniversity, UniversityLoading, UniversityError, universities } =
    useGetUniversity();
  const {
    GetProgramType,
    LoadingProgramTypes,
    ErrorProgramTypes,
    ProgramTypes,
  } = useGetProgramType();

  const {
    GetUniversityManager,
    UniversityManagerLoading,
    UniversityManagerError,
    UniversityManager,

    GetOperationalManager,
    OperationalManagerLoading,
    OperationalManagerError,
    OperationalManager,
  } = useGetUniversityManager();

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

  console.log(SubCounsellorManager);

  useEffect(() => {
    GetUniversity();
  }, []);

  useEffect(() => {
    if (UniversityGetReduxData?.id !== "") {
      GetProgramType();
      GetUniversityManager();
      GetOperationalManager();
      GetCenter();
      GetSubCenter();
      GetCounsellorManager();
      GetSubCounsellorManager();
    }
  }, [UniversityGetReduxData?.id !== ""]);

  const {
    FetchAllStudentByPagination,
    AllStudentListData,
    AllStudentCurrentPage,
    AllStudentTotalPages,
    AllStudentLimit,
    AllStudentLoading,
    AllStudentTotalDocs,
    handlePageChange,
  } = UseGetAllStudents();

  useEffect(() => {
    FetchAllStudentByPagination();
  }, [UniversityGetReduxData?.id !== ""]);

  const { GetLoginUserDetails, CheckingUserLogged, GetLoggedUserLoader } =
    UseGetLoggedUser();

  return (
    <>
      <section className="top-0 dark:bg-slate-800 py-2 rounded-lg ">
        <div className="ScrollBarStyle h-[calc(100vh-35px)] overflow-hidden overflow-y-scroll">
          <AdminDashboard />
        </div>
      </section>

      {GetLoggedUserLoader && <Loader />}
    </>
  );
};

export default Dashboard;
