import React, { useEffect, useState } from "react";
import Personal_details from "./Forms/UpdatePersonal_details";
import Basic_details from "./Forms/UpdateBasic_details";
import Academics from "./Forms/UpdateAcademics";
import Documents from "./Forms/UpdateDocuments";
import { UpdateStepperContext } from "./UpdateStepperContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setStudentDetails } from "../../../../Redux/StudentSlice";
import Swal from "sweetalert2";
import UpdateStepper from "./UpdateStepper";
import UpdateStepperControl from "./UpdateStepperControl";
import { useParams } from "react-router-dom";
import UseGetStudentById from "../../../../CustomHooks/UseGetStudentById";

const AdminUpdateStudent = ({ children }) => {
  const [currentStep, setcurrentStep] = useState(1);
  const { id } = useParams();

  const {
    StudentByIdLoading,
    StudentByIdError,
    StudentDataById,
    GetStudentById,
  } = UseGetStudentById();

  useEffect(() => {
    GetStudentById(id);
  }, [id]);

  const [UpdateUserData, setUpdateUserData] = useState({});
  const [UpdatePersonalData, setUpdatePersonalData] = useState({});
  const [UpdateHighschoolData, setUpdateHighschoolData] = useState({});
  const [UpdateIntermediateData, setUpdateIntermediateData] = useState({});
  const [UpdateUnderGraduationData, setUpdateUnderGraduationData] = useState(
    {}
  );
  const [UpdatePostGraduationData, setUpdatePostGraduationData] = useState({});
  const [UpdateOtherData, setUpdateOtherData] = useState({});
  const [UpdateAllDocuments, setUpdateAllDocuments] = useState({});

  useEffect(() => {
    setUpdateUserData({
      Aadhar: StudentDataById?.aadharNo,
      AdmissionSession: StudentDataById?.admissionSession?._id,
      AdmissionType: StudentDataById?.admissionType?._id,
      Category: StudentDataById?.category,
      Center: StudentDataById?.center?._id,
      Course: StudentDataById?.Course?._id,
      DOB: StudentDataById?.dateOfBirth?.split("T")[0],
      EmploymentStatus: StudentDataById?.employmentStatus,
      FatherName: StudentDataById?.fatherName,
      FullName: StudentDataById?.fullName,
      Gender: StudentDataById?.gender,
      MaritalStatus: StudentDataById?.maritalStatus,
      MotherName: StudentDataById?.motherName,
      Nationality: StudentDataById?.nationality,
      Religion: StudentDataById?.religion,
      SubCourse: StudentDataById?.SubCourse?._id,
      year: StudentDataById?.year,
    });

    setUpdatePersonalData({
      Address: StudentDataById?.personalDetails?.address,
      AlternateEmail: StudentDataById?.personalDetails?.alternateEmail,
      AlternatePhone: StudentDataById?.personalDetails?.alternatePhone,
      City: StudentDataById?.personalDetails?.city,
      District: StudentDataById?.personalDetails?.district,
      Email: StudentDataById?.personalDetails?.email,
      Phone: StudentDataById?.personalDetails?.phone,
      Pincode: StudentDataById?.personalDetails?.pincode,
      State: StudentDataById?.personalDetails?.state,
    });

    setUpdateHighschoolData({
      BoardUniversity: StudentDataById?.highSchool?.boardOruniversity,
      Result: StudentDataById?.highSchool?.result,
      Subjects: StudentDataById?.highSchool?.subjects,
      Year: StudentDataById?.highSchool?.year,
      photo: StudentDataById?.highSchool?.marksheet,
      Percentage: StudentDataById?.highSchool?.Percentage,
    });

    setUpdateIntermediateData({
      BoardUniversity: StudentDataById?.intermediate?.boardOruniversity,
      Result: StudentDataById?.intermediate?.result,
      Subjects: StudentDataById?.intermediate?.subjects,
      Year: StudentDataById?.intermediate?.year,
      photo: StudentDataById?.intermediate?.marksheet,
      Percentage: StudentDataById?.intermediate?.Percentage,
    });

    setUpdateOtherData({
      Course: StudentDataById?.OtherAcademics?.course,
      Result: StudentDataById?.OtherAcademics?.result,
      Subjects: StudentDataById?.OtherAcademics?.subjects,
      University: StudentDataById?.OtherAcademics?.university,
      Year: StudentDataById?.OtherAcademics?.year,
      photo: StudentDataById?.OtherAcademics?.marksheet,
      PercentageOrCGPA: StudentDataById?.OtherAcademics?.PercentageOrCGPA,
      AllOtherPhoto: StudentDataById?.OtherAcademics?.AllOtherPhotos?.photos,
    });

    setUpdateUnderGraduationData({
      marksheet: StudentDataById?.underGradutaion?.marksheet,
      result: StudentDataById?.underGradutaion?.result,
      subjects: StudentDataById?.underGradutaion?.subjects,
      university: StudentDataById?.underGradutaion?.university,
      year: StudentDataById?.underGradutaion?.year,
      CGPA: StudentDataById?.underGradutaion?.CGPA,
      AllUgPhoto:
        StudentDataById?.underGradutaion?.AllUnderGraduationPhotos?.photos,
    });

    setUpdatePostGraduationData({
      marksheet: StudentDataById?.postGraduation?.marksheet,
      result: StudentDataById?.postGraduation?.result,
      subjects: StudentDataById?.postGraduation?.subjects,
      university: StudentDataById?.postGraduation?.university,
      year: StudentDataById?.postGraduation?.year,
      AllPgPhoto:
        StudentDataById?.postGraduation?.AllPostGraduationPhotos?.photos,
      CGPA: StudentDataById?.postGraduation?.CGPA,
    });

    setUpdateAllDocuments({
      Aafidavit: StudentDataById?.documents?.aafidavit?.aafidavitPhoto,
      Migration: StudentDataById?.documents?.migration?.migrationPhoto,
      OtherCertificate: StudentDataById?.documents?.other?.otherPhoto,
      MoreOtherPhoto: StudentDataById?.documents?.other?.MoreOtherPhoto,
      ParentSignature:
        StudentDataById?.documents?.parentSignature?.ParentSignPhoto,
      StudentSignature:
        StudentDataById?.documents?.studentSignature?.studentSignPhoto,
      aadhaar: StudentDataById?.documents?.aadhar?.aadharPhoto,
      aadharBack: StudentDataById?.documents?.aadharBack?.aadharBackPhoto,
      photo: StudentDataById?.documents?.photo?.studentPhoto,
      ABCID: StudentDataById?.documents?.ABCID?.ABCIDPhoto,
      DEBID: StudentDataById?.documents?.DEBID?.DEBIDPhoto,
    });
  }, [StudentDataById]);

  const [UpdateFinalData, setUpdateFinalData] = useState([]);
  const StudentLoggedData = useSelector((state) => state.studentId);

  const steps = ["Basic Details", "Contact Details", "Academics", "Documents"];

  const displayStep = (steps) => {
    switch (steps) {
      case 1:
        return <Basic_details />;
      case 2:
        return <Personal_details />;
      case 3:
        return <Academics />;
      case 4:
        return <Documents />;
      default:
    }
  };

  const [UpdateBooleanNextOnBasicDetails, setUpdateBooleanNextOnBasicDetails] =
    useState(false);

  const [
    UpdateBooleanNextOnPersonalDetails,
    setUpdateBooleanNextOnPersonalDetails,
  ] = useState(false);

  const [
    UpdateBooleanNextOnAcademicsDetails,
    setUpdateBooleanNextOnAcademicsDetails,
  ] = useState(false);

  const [
    UpdateBooleanNextOnUpdateAllDocuments,
    setUpdateBooleanNextOnUpdateAllDocuments,
  ] = useState(false);

  // REDUX USER
  const Dispatch = useDispatch();
  const LoggedUser = useSelector((state) => state?.user);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const [UserResponse, setUserResponse] = useState({});

  // Basic Details
  const UpdateHandleBasicDetailsSubmit = async (BasicDetails) => {
    console.log("BasicDetails", BasicDetails);
    if (UniversityGetDataFromRedux?.id === "") {
      alert("select The University");
    }

    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateBasicDetailsApplication`,
        {
          StudentId: id,
          university: UniversityGetDataFromRedux?.id,
          center: BasicDetails?.Center,
          admissionSession: BasicDetails?.AdmissionSession,
          admissionType: BasicDetails?.AdmissionType,
          Course: BasicDetails?.Course,
          SubCourse: BasicDetails?.SubCourse,
          year: BasicDetails?.year,
          fullName: BasicDetails?.FullName,
          fatherName: BasicDetails?.FatherName,
          motherName: BasicDetails?.MotherName,
          gender: BasicDetails?.Gender,
          category: BasicDetails?.Category,
          dateOfBirth: BasicDetails?.DOB,
          employmentStatus: BasicDetails?.EmploymentStatus,
          maritalStatus: BasicDetails?.MaritalStatus,
          religion: BasicDetails?.Religion,
          nationality: BasicDetails?.Nationality,
          aadharNo: BasicDetails?.Aadhar,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        setUpdateBooleanNextOnBasicDetails(true);
        setUserResponse(Response?.data?.data);
        console.log(Response?.data?.data);
      } else {
        toast.error(Response?.data?.message);
        setUpdateBooleanNextOnBasicDetails(false);
      }
    } catch (error) {
      setUpdateBooleanNextOnBasicDetails(false);
      toast.error(error.response?.data?.message);
      console.log(error);
      console.log(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Personal Details
  const UpdateHandlePersonalDetailsSubmit = async (PersonalDetails) => {
    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdatePersonalDetailsApplication`,
        {
          StudentObjId: id,
          address: PersonalDetails?.Address,
          alternateEmail: PersonalDetails?.AlternateEmail,
          alternatePhone: PersonalDetails?.AlternatePhone,
          city: PersonalDetails?.City,
          district: PersonalDetails?.District,
          email: PersonalDetails?.Email,
          phone: PersonalDetails?.Phone,
          pincode: PersonalDetails?.Pincode,
          state: PersonalDetails?.State,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        setUpdateBooleanNextOnPersonalDetails(true);
      } else {
        toast.error(Response?.data?.message);
        setUpdateBooleanNextOnPersonalDetails(false);
      }
    } catch (error) {
      setUpdateBooleanNextOnPersonalDetails(false);
      toast.error(error.response?.data?.message);
      console.log(error);
      console.log(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Academics
  const UpdateHandleAcademicDetails = async (
    Highschool,
    Intermediate,
    UnderGraduation,
    PostGraduation,
    Other
  ) => {
    try {
      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/updateAcademicDetailsApplication`,
        {
          StudentObjId: StudentDataById?._id,
          HighschoolId: StudentDataById?.highSchool?._id,
          IntermediateId: StudentDataById?.intermediate?._id,
          UnderGraduationId: StudentDataById?.underGradutaion?._id,
          PostGraduationId: StudentDataById?.postGraduation?._id,
          OtherCourseId: StudentDataById?.OtherAcademics?._id,

          Highschoolsubjects: Highschool?.Subjects,
          Highschoolyear: Highschool?.Year,
          HighschoolPercentage: Highschool?.Percentage,
          HighschoolboardOruniversity: Highschool?.BoardUniversity,
          Highschoolresult: Highschool?.Result,
          Highschoolmarksheet: Highschool?.photo,

          Intermediatesubjects: Intermediate?.Subjects,
          Intermediateyear: Intermediate?.Year,
          IntermediatePercentage: Intermediate?.Percentage,
          IntermediateboardOruniversity: Intermediate?.BoardUniversity,
          Intermediateresult: Intermediate?.Result,
          Intermediatemarksheet: Intermediate?.photo,

          UnderGraduationsubjects: UnderGraduation?.Subjects,
          UnderGraduationyear: UnderGraduation?.Year,
          UnderGraduationCGPA: UnderGraduation?.CGPA,
          UnderGraduationuniversity: UnderGraduation?.University,
          UnderGraduationresult: UnderGraduation?.Result,
          UnderGraduationmarksheet: UnderGraduation?.photo,
          AllUnderGraduationPhotos: UnderGraduation?.AllUgPhotos,

          PostGraduationsubjects: PostGraduation?.Subjects,
          PostGraduationyear: PostGraduation?.Year,
          PostGraduationCGPA: PostGraduation?.CGPA,
          PostGraduationuniversity: PostGraduation?.University,
          PostGraduationresult: PostGraduation?.Result,
          PostGraduationmarksheet: PostGraduation?.photo,
          AllPostGraduationPhotos: PostGraduation?.AllPgPhotos,

          Othercourse: Other?.Course,
          Othersubjects: Other?.Subjects,
          Otheryear: Other?.Year,
          OtherPercentageOrCGPA: Other?.PercentageOrCGPA,
          OtherboardOruniversity: Other?.University,
          Otherresult: Other?.Result,
          Othermarksheet: Other?.photo,
          AllOtherPhotos: Other?.AllOtherPhotos,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        setUpdateBooleanNextOnAcademicsDetails(true);
      } else {
        setUpdateBooleanNextOnAcademicsDetails(false);
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      setUpdateBooleanNextOnAcademicsDetails(false);
      toast.error(error.response?.data?.message);
      console.log(error);
      console.log(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const loggedUser = useSelector((state) => state?.user);
  const rolePath = loggedUser?.role && loggedUser?.role.toLowerCase();
  const url = `${import.meta.env.VITE_FRONTEND_URL}/${rolePath}/applications`;

  // All Documents
  const UpdateHandleDocumentsUpload = async (UploadDocuments) => {
    try {
      console.log("UploadDocuments", UploadDocuments);
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/updateAllDocumentsUploadApplicationForm`,
        {
          photo: UploadDocuments?.photo,
          aadhar: UploadDocuments?.aadhaar,
          aadharBack: UploadDocuments?.aadharBack,
          studentSignature: UploadDocuments?.StudentSignature,
          parentSignature: UploadDocuments?.ParentSignature,
          migration: UploadDocuments?.Migration,
          aafidavit: UploadDocuments?.Aafidavit,
          other: UploadDocuments?.OtherCertificate,
          ABCID: UploadDocuments?.ABCID,
          DEBID: UploadDocuments?.DEBID,
          MoreOtherPhoto: UploadDocuments?.MoreOtherPhoto,
          StudentObjId: StudentDataById?._id,
          DocumentId: StudentDataById?.documents?._id,
        },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        Swal.fire({
          title: response?.data?.message || "Documents updated successfully!",
          icon: "success",
        }).then(() => {
          window.close();
          const newTab = window.open(url, "_blank");
          if (!newTab) {
            toast.error("Unable to open new window due to popup blocker.");
          }
        });
        setUpdateBooleanNextOnUpdateAllDocuments(true);
      } else {
        setUpdateBooleanNextOnUpdateAllDocuments(false);
        toast.error(response?.data?.message || "Update failed.");
      }
    } catch (error) {
      setUpdateBooleanNextOnUpdateAllDocuments(false);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Error updating documents:", error);
    }
  };

  const checkNextCondition = () => {
    if (
      UpdateBooleanNextOnBasicDetails ||
      UpdateBooleanNextOnPersonalDetails ||
      UpdateBooleanNextOnAcademicsDetails ||
      UpdateBooleanNextOnUpdateAllDocuments
    ) {
      return true;
    }
  };

  const HandleClick = async (direction) => {
    let newStep = currentStep;

    if (direction === "next") {
      if (currentStep === 1) {
        Swal.fire({
          title: `Do You Want to Update Basic Details ?`,
          showCancelButton: true,
          confirmButtonText: "Update",
          cancelButtonText: `Next`,
          customClass: {
            cancelButton: "custom-cancel-button",
            confirmButton: "custom-confirm2-button",
          },
          icon: "question",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await UpdateHandleBasicDetailsSubmit(UpdateUserData);
          }
          newStep++;
          console.log("Next Step:", newStep);

          if (newStep > 0 && newStep <= steps.length) {
            setcurrentStep(newStep);
          }
        });
      }
      if (currentStep === 2) {
        Swal.fire({
          title: `Do You Want to Update Personal Details ?`,
          showCancelButton: true,
          confirmButtonText: "Update",
          cancelButtonText: `Next`,
          customClass: {
            cancelButton: "custom-cancel-button",
            confirmButton: "custom-confirm2-button",
          },
          icon: "question",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await UpdateHandlePersonalDetailsSubmit(UpdatePersonalData);
          }
          newStep++;
          console.log("Next Step:", newStep);

          if (newStep > 0 && newStep <= steps.length) {
            setcurrentStep(newStep);
          }
        });
      }
      if (currentStep === 3) {
        Swal.fire({
          title: `Do You Want to Update Academic Details ?`,
          showCancelButton: true,
          confirmButtonText: "Update",
          cancelButtonText: `Next`,
          customClass: {
            cancelButton: "custom-cancel-button",
            confirmButton: "custom-confirm2-button",
          },
          icon: "question",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await UpdateHandleAcademicDetails(
              UpdateHighschoolData,
              UpdateIntermediateData,
              UpdateUnderGraduationData,
              UpdatePostGraduationData,
              UpdateOtherData
            );
          }
          newStep++;
          console.log("Next Step:", newStep);
          if (newStep > 0 && newStep <= steps.length) {
            setcurrentStep(newStep);
          }
        });
      }
    } else if (direction === "submit") {
      if (currentStep === 4 && direction === "submit") {
        Swal.fire({
          title: `Do You Want to Update Documents ?`,
          showCancelButton: true,
          confirmButtonText: "Update",
          cancelButtonText: `Back`,
          customClass: {
            cancelButton: "custom-cancel-button",
            confirmButton: "custom-confirm2-button",
          },
          icon: "question",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await UpdateHandleDocumentsUpload(UpdateAllDocuments);
          }
        });
      }
    } else {
      newStep--;

      if (newStep > 0 && newStep <= steps.length) {
        setcurrentStep(newStep);
      }
    }
  };

  // 🔹 NEW UI/UX LAYOUT (aligned with AdminFreshapplication)
  return (
    <section className="m-2 rounded-2xl h-[calc(100vh-25px)] min-h-[175px] flex flex-col">
      {/* HEADER */}
      <div className="p-6 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 rounded-xl flex items-center">
        <div className="flex flex-col">
          <span className="text-sm md:text-base font-semibold tracking-wide dark:text-white">
            Update Student ({StudentDataById?.fullName || "Loading..."})
          </span>
          <span className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400">
            Review and update student application across all steps
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-hidden px-0.5 pt-4 pb-3 ">
        <div
          className="h-full w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm 
          border border-slate-200 dark:border-slate-700 flex flex-col"
        >
          {/* STEPPER AREA */}
          <div className="px-4 md:px-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-center">
              <UpdateStepper steps={steps} currentStep={currentStep} />
            </div>
          </div>

          {/* FORM AREA */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 ScrollBarStyle overflow-x-hidden">
            <UpdateStepperContext.Provider
              value={{
                UpdateUserData,
                setUpdateUserData,
                UpdateFinalData,
                setUpdateFinalData,
                UpdatePersonalData,
                setUpdatePersonalData,
                UpdateHighschoolData,
                setUpdateHighschoolData,
                UpdateIntermediateData,
                setUpdateIntermediateData,
                UpdateAllDocuments,
                setUpdateAllDocuments,
                UpdateUnderGraduationData,
                setUpdateUnderGraduationData,
                UpdatePostGraduationData,
                setUpdatePostGraduationData,
                UpdateOtherData,
                setUpdateOtherData,
              }}
            >
              {children}
              {displayStep(currentStep)}
            </UpdateStepperContext.Provider>
          </div>

          {/* FOOTER CONTROLS */}
          {currentStep && (
            <div className="px-4 md:px-8 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/80">
              <div className="flex justify-end">
                <UpdateStepperControl
                  HandleClick={HandleClick}
                  currentStep={currentStep}
                  steps={steps}
                  UpdateUserData={UpdateUserData}
                  UpdatePersonalData={UpdatePersonalData}
                  UpdateHighschoolData={UpdateHighschoolData}
                  UpdateIntermediateData={UpdateIntermediateData}
                  UpdateAllDocuments={UpdateAllDocuments}
                  UpdateBooleanNextOnBasicDetails={
                    UpdateBooleanNextOnBasicDetails
                  }
                  UpdateBooleanNextOnPersonalDetails={
                    UpdateBooleanNextOnPersonalDetails
                  }
                  UpdateBooleanNextOnAcademicsDetails={
                    UpdateBooleanNextOnAcademicsDetails
                  }
                  UpdateBooleanNextOnUpdateAllDocuments={
                    UpdateBooleanNextOnUpdateAllDocuments
                  }
                  UpdateUnderGraduationData={UpdateUnderGraduationData}
                  UpdatePostGraduationData={UpdatePostGraduationData}
                  UpdateOtherData={UpdateOtherData}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminUpdateStudent;
