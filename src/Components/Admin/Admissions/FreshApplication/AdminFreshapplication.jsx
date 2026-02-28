import React, { useState } from "react";
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import Personal_details from "./Forms/Personal_details";
import Basic_details from "./Forms/Basic_details";
import Academics from "./Forms/Academics";
import Documents from "./Forms/Documents";
import Application_form from "./Forms/Application_form";
import { StepperContext } from "./StepperContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setStudentDetails } from "../../../../Redux/StudentSlice";
import Swal from "sweetalert2";

const AdminFreshapplication = ({ children }) => {
  const [currentStep, setcurrentStep] = useState(1);

  const [UserData, setUserData] = useState({});
  const [PersonalData, setPersonalData] = useState({});
  const [HighschoolData, setHighschoolData] = useState({});
  const [IntermediateData, setIntermediateData] = useState({});
  const [UnderGraduationData, setUnderGraduationData] = useState({});
  const [PostGraduationData, setPostGraduationData] = useState({});
  const [OtherData, setOtherData] = useState({});
  const [AllDocuments, setAllDocuments] = useState({});

  const [FinalData, setFinalData] = useState([]);
  const StudentLoggedData = useSelector((state) => state.studentId);

  const steps = [
    "Basic Details",
    "Contact Details",
    "Academics",
    "Documents",
    "Print Form",
  ];

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
      case 5:
        return <Application_form />;
      default:
    }
  };

  const [BooleanNextOnBasicDetails, setBooleanNextOnBasicDetails] =
    useState(false);

  const [BooleanNextOnPersonalDetails, setBooleanNextOnPersonalDetails] =
    useState(false);

  const [BooleanNextOnAcademicsDetails, setBooleanNextOnAcademicsDetails] =
    useState(false);

  const [BooleanNextOnAllDocuments, setBooleanNextOnAllDocuments] =
    useState(false);

  // REDUX USER
  const Dispatch = useDispatch();
  const LoggedUser = useSelector((state) => state?.user);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const [UserResponse, setUserResponse] = useState({});

  // Basic Details
  const HandleBasicDetailsSubmit = async (BasicDetails) => {
    console.log("BasicDetails", BasicDetails);
    if (UniversityGetDataFromRedux?.id === "") {
      alert("select The University");
    }
    try {
      const Response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/basic-details-fresh-application-form`,
        {
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
          ABCIDNo: BasicDetails?.ABCIDNo,
          DEBIDNo: BasicDetails?.DEBIDNo,
          creatorType:
            LoggedUser?.role === "subCounsellor"
              ? "SubCounsellor"
              : LoggedUser?.role === "Counsellor"
              ? "Counsellor"
              : LoggedUser?.role === "center"
              ? "Center"
              : LoggedUser?.role === "subCenter"
              ? "SubCenter"
              : LoggedUser?.role === "Admin"
              ? "Main"
              : LoggedUser?.role === "operation-manager"
              ? "Main"
              : LoggedUser?.role === "university-manager"
              ? "Main"
              : LoggedUser?.role === "Accountant" && "Accountant",
          whoCreated: LoggedUser?.id,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        setBooleanNextOnBasicDetails(true);
        setUserResponse(Response?.data?.data);
        Dispatch(setStudentDetails({ id: Response?.data?.data?._id }));
      } else {
        toast.error(Response?.data?.message);
        setBooleanNextOnBasicDetails(false);
      }
    } catch (error) {
      setBooleanNextOnBasicDetails(false);
      toast.error(error.response?.data?.message);
      console.log(error);
      console.log(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Personal Details
  const HandlePersonalDetailsSubmit = async (StudentId, PersonalDetails) => {
    console.log(StudentId);

    try {
      const Response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/personal-details-fresh-application-form`,
        {
          StudentObjId: StudentId || StudentId?.id,
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
        setBooleanNextOnPersonalDetails(true);
      } else {
        toast.error(Response?.data?.message);
        setBooleanNextOnPersonalDetails(false);
      }
    } catch (error) {
      setBooleanNextOnPersonalDetails(false);
      toast.error(error.response?.data?.message);
      console.log(error);
      console.log(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Academics
  const HandleAcademicDetails = async (
    StudentId,
    Highschool,
    Intermediate,
    UnderGraduation,
    PostGraduation,
    Other
  ) => {
    try {
      const Response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/academics-records-fresh-application-form`,
        {
          StudentObjId: StudentId,

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
        setBooleanNextOnAcademicsDetails(true);
      } else {
        setBooleanNextOnAcademicsDetails(false);
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      setBooleanNextOnAcademicsDetails(false);
      toast.error(error.response?.data?.message);
      console.log(error);
      console.log(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // All Documents
  const HandleDocumentsUpload = async (StudentId, UploadDocuments) => {
    try {
      const Response = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/documents-upload-fresh-application-form`,
        {
          photo: UploadDocuments?.photo,
          aadhar: UploadDocuments?.aadhaar,
          aadharBack: UploadDocuments?.aadharBack,
          studentSignature: UploadDocuments?.StudentSignature,
          parentSignature: UploadDocuments?.ParentSignature,
          migration: UploadDocuments?.Migration,
          aafidavit: UploadDocuments?.Aafidavit,
          other: UploadDocuments?.OtherCertificate,
          MoreOtherCertificates: UploadDocuments?.MoreOtherCertificates,
          ABCID: UploadDocuments?.ABCID,
          DEBID: UploadDocuments?.DEBID,
          StudentObjId: StudentId,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        Swal.fire({
          title: Response?.data?.message,
          icon: Response?.data?.success ? "success" : "error",
        });
        setBooleanNextOnAllDocuments(true);
      } else {
        setBooleanNextOnAllDocuments(false);
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      setBooleanNextOnAllDocuments(false);
      toast.error(error.response?.data?.message);
      console.log(error);
      console.log(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const checkNextCondition = () => {
    if (
      BooleanNextOnBasicDetails ||
      BooleanNextOnPersonalDetails ||
      BooleanNextOnAcademicsDetails ||
      BooleanNextOnAllDocuments
    ) {
      return true;
    }
  };

  const HandleClick = async (direction) => {
    let newStep = currentStep;
    direction == "next" ? newStep++ : newStep--;
    newStep > 0 && newStep <= steps.length && setcurrentStep(newStep);

    console.log("Current Step:", currentStep);
    console.log("Next Step:", newStep);

    if (currentStep === 1) {
      await HandleBasicDetailsSubmit(UserData);
      console.log(UserResponse);
    } else if (currentStep === 2) {
      await HandlePersonalDetailsSubmit(
        UserResponse || StudentLoggedData?.id,
        PersonalData
      );
    } else if (currentStep === 3) {
      await HandleAcademicDetails(
        UserResponse || StudentLoggedData?.id,
        HighschoolData,
        IntermediateData,
        UnderGraduationData,
        PostGraduationData,
        OtherData
      );
    } else if (currentStep === 4) {
      await HandleDocumentsUpload(
        UserResponse || StudentLoggedData?.id,
        AllDocuments
      );
    }
  };


  //  NEW MODERN UI WRAPPER (logic untouched)
  return (
    <section className="m-2 rounded-2xl h-[calc(100vh-25px)] min-h-[175px] flex flex-col">
      {/* HEADER */}
      <div className="p-6 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 rounded-xl flex items-center">
        <div className="flex flex-col">
          <span className="text-sm md:text-base font-semibold tracking-wide dark:text-white">
            Fresh Application Form
          </span>
          <span className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400">
            Fill all steps carefully to submit a new admission application
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
              <Stepper steps={steps} currentStep={currentStep} />
            </div>
          </div>

          {/* FORM AREA */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 ScrollBarStyle overflow-x-hidden">
            <StepperContext.Provider
              value={{
                UserData,
                setUserData,
                FinalData,
                setFinalData,
                PersonalData,
                setPersonalData,
                HighschoolData,
                setHighschoolData,
                IntermediateData,
                setIntermediateData,
                AllDocuments,
                setAllDocuments,
                UnderGraduationData,
                setUnderGraduationData,
                PostGraduationData,
                setPostGraduationData,
                OtherData,
                setOtherData,
              }}
            >
              {children}
              {displayStep(currentStep)}
            </StepperContext.Provider>
          </div>

          {/* FOOTER CONTROLS */}
          {currentStep !== steps.length && (
            <div className="px-4 md:px-8 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/80">
              <div className="flex justify-end">
                <StepperControl
                  HandleClick={HandleClick}
                  currentStep={currentStep}
                  steps={steps}
                  UserData={UserData}
                  PersonalData={PersonalData}
                  HighschoolData={HighschoolData}
                  IntermediateData={IntermediateData}
                  AllDocuments={AllDocuments}
                  BooleanNextOnBasicDetails={BooleanNextOnBasicDetails}
                  BooleanNextOnPersonalDetails={BooleanNextOnPersonalDetails}
                  BooleanNextOnAcademicsDetails={BooleanNextOnAcademicsDetails}
                  BooleanNextOnAllDocuments={BooleanNextOnAllDocuments}
                  UnderGraduationData={UnderGraduationData}
                  PostGraduationData={PostGraduationData}
                  OtherData={OtherData}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminFreshapplication;
