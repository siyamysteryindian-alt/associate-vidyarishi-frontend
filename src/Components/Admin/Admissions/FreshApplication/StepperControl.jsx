import React, { useEffect, useState } from "react";
import UseGetStudentById from "../../../../CustomHooks/UseGetStudentById";
import { useSelector } from "react-redux";

const StepperControl = ({
  HandleClick,
  currentStep,
  steps,
  UserData,
  PersonalData,
  HighschoolData,
  IntermediateData,
  AllDocuments,
  UnderGraduationData,
  PostGraduationData,
  OtherData,
}) => {
  const [UserDataValidations, setUserDataValidations] = useState(false);
  const [PersonalDataValidations, setPersonalDataValidations] = useState(false);
  const [AcademicsDataValidations, setAcademicsDataValidations] =
    useState(false);
  const [AllDocumentsDataValidations, setAllDocumentsDataValidations] =
    useState(false);

  // UserData
  useEffect(() => {
    if (
      !UserData?.Aadhar ||
      !UserData?.AdmissionSession ||
      !UserData?.AdmissionType ||
      !UserData?.Category ||
      !UserData?.Center ||
      !UserData?.Course ||
      !UserData?.DOB ||
      !UserData?.EmploymentStatus ||
      !UserData?.FatherName ||
      !UserData?.FullName ||
      !UserData?.Gender ||
      !UserData?.MotherName ||
      !UserData?.MaritalStatus ||
      !UserData?.Nationality ||
      !UserData?.Religion ||
      !UserData?.year ||
      !UserData?.SubCourse
    ) {
      setUserDataValidations(true);
    } else {
      setUserDataValidations(false);
    }
  }, [UserData, UserDataValidations]);

  // Personal Data
  useEffect(() => {
    if (
      !PersonalData?.Address ||
      !PersonalData?.City ||
      !PersonalData?.District ||
      !PersonalData?.Email ||
      !PersonalData?.Phone ||
      !PersonalData?.Pincode ||
      !PersonalData?.State
    ) {
      setPersonalDataValidations(true);
    } else {
      setPersonalDataValidations(false);
    }
  }, [PersonalData, PersonalDataValidations]);

  const StudentLoggedData = useSelector((state) => state.studentId);

  const {
    StudentByIdLoading,
    StudentByIdError,
    StudentDataById,
    GetStudentById,
  } = UseGetStudentById();

  useEffect(() => {
    if (StudentLoggedData?.id !== "") {
      GetStudentById(StudentLoggedData?.id);
    }
  }, [StudentLoggedData?.id !== ""]);

  // Intermediate & highschool data
  const CheckValidation = () => {
    const checkFields = (data, requiredFields) => {
      return requiredFields.some((field) => !data?.[field]);
    };

    const CASES = {
      "High School - 10th (SSC)": [
        "Subjects",
        "Year",
        "BoardUniversity",
        "Result",
        "photo",
      ],
      "Intermediate - 12th (HSC)": [
        "Subjects",
        "Year",
        "BoardUniversity",
        "Result",
        "photo",
      ],
      "Under Graduation (UG)": [
        "Subjects",
        "Year",
        "University",
        "Result",
        "photo",
      ],
      "Post Graduation (PG)": [
        "Subjects",
        "Year",
        "University",
        "Result",
        "photo",
      ],
    };

    const academicData = {
      "High School - 10th (SSC)": HighschoolData,
      "Intermediate - 12th (HSC)": IntermediateData,
      "Under Graduation (UG)": UnderGraduationData,
      "Post Graduation (PG)": PostGraduationData,
    };

    const isValid = StudentDataById?.SubCourse?.admissionEligibility?.every(
      (Eligibility) => {
        const trimmedEligibility = Eligibility.trim();
        const requiredFields = CASES[trimmedEligibility];
        const data = academicData[trimmedEligibility];

        return requiredFields ? !checkFields(data, requiredFields) : true;
      }
    );

    setAcademicsDataValidations(!isValid);
  };

  useEffect(() => {
    CheckValidation();
  }, [
    IntermediateData,
    HighschoolData,
    AcademicsDataValidations,
    UnderGraduationData,
    PostGraduationData,
    OtherData,
  ]);

  // all documents
  useEffect(() => {
    if (
      !AllDocuments?.StudentSignature ||
      !AllDocuments?.aadhaar ||
      !AllDocuments?.photo
    ) {
      setAllDocumentsDataValidations(true);
    } else {
      setAllDocumentsDataValidations(false);
    }
  }, [AllDocuments, AllDocumentsDataValidations]);

  // Function to determine when to disable the button
  const isNextButtonDisabled = () => {
    // if (currentStep === 1 && UserDataValidations) return true;
    // if (currentStep === 2 && PersonalDataValidations) return true;
    // if (currentStep === 3 && AcademicsDataValidations) return true;
    // if (currentStep === 4 && AllDocumentsDataValidations) return true;

    return false;
  };

  return (
    <div className="mt-6 flex justify-between max-w-2xl mx-auto px-2 md:px-1">
      <div className="">
        {/* Back button */}
        <button
          onClick={() => HandleClick()}
          className={`
          inline-flex mx-10 items-center justify-center rounded-lg border text-xs md:text-sm font-semibold
          px-4 md:px-6 py-2 transition-all duration-200
          bg-slate-100 text-slate-700 border-slate-300
          hover:bg-slate-200 hover:text-slate-900
          dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700
          ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}
        `}
        >
          Back
        </button>

        {/* Next / Submit button */}
        <button
          onClick={() => HandleClick("next")}
          disabled={isNextButtonDisabled()}
          className={`
          inline-flex mx-10 items-center justify-center rounded-lg text-xs md:text-sm font-semibold
          px-5 md:px-8 py-2.5 shadow-sm transition-all duration-200
          bg-green-600 text-white hover:bg-green-700
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-green-500
          disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
        `}
        >
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default StepperControl;
