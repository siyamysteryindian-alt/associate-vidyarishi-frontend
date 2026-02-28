import React, { useEffect, useState } from "react";
import UseGetStudentById from "../../../../CustomHooks/UseGetStudentById";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const StepperControl = ({
  HandleClick,
  currentStep,
  steps,
  UpdateUserData,
  UpdatePersonalData,
  UpdateHighschoolData,
  UpdateIntermediateData,
  UpdateAllDocuments,
  UpdateUnderGraduationData,
  UpdatePostGraduationData,
  UpdateOtherData,
}) => {
  const [UpdateUserDataValidations, setUpdateUserDataValidations] =
    useState(false);
  const [UpdatePersonalDataValidations, setUpdatePersonalDataValidations] =
    useState(false);
  const [AcademicsDataValidations, setAcademicsDataValidations] =
    useState(false);
  const [
    UpdateAllDocumentsDataValidations,
    setUpdateAllDocumentsDataValidations,
  ] = useState(false);

  // ------------------ BASIC DETAILS VALIDATION ------------------
  useEffect(() => {
    if (
      !UpdateUserData?.Aadhar ||
      !UpdateUserData?.AdmissionSession ||
      !UpdateUserData?.AdmissionType ||
      !UpdateUserData?.Category ||
      !UpdateUserData?.Center ||
      !UpdateUserData?.Course ||
      !UpdateUserData?.DOB ||
      !UpdateUserData?.EmploymentStatus ||
      !UpdateUserData?.FatherName ||
      !UpdateUserData?.FullName ||
      !UpdateUserData?.Gender ||
      !UpdateUserData?.MotherName ||
      !UpdateUserData?.MaritalStatus ||
      !UpdateUserData?.Nationality ||
      !UpdateUserData?.Religion ||
      !UpdateUserData?.year ||
      !UpdateUserData?.SubCourse
    ) {
      setUpdateUserDataValidations(true);
    } else {
      setUpdateUserDataValidations(false);
    }
  }, [UpdateUserData]);

  // ------------------ PERSONAL DETAILS VALIDATION ------------------
  useEffect(() => {
    if (
      !UpdatePersonalData?.Address ||
      !UpdatePersonalData?.City ||
      !UpdatePersonalData?.District ||
      !UpdatePersonalData?.Email ||
      !UpdatePersonalData?.Phone ||
      !UpdatePersonalData?.Pincode ||
      !UpdatePersonalData?.State
    ) {
      setUpdatePersonalDataValidations(true);
    } else {
      setUpdatePersonalDataValidations(false);
    }
  }, [UpdatePersonalData]);

  const StudentLoggedData = useSelector((state) => state.studentId);

  const {
    StudentByIdLoading,
    StudentByIdError,
    StudentDataById,
    GetStudentById,
  } = UseGetStudentById();

  const { id } = useParams();

  useEffect(() => {
    if (StudentLoggedData?.id !== "") {
      GetStudentById(id);
    }
  }, [StudentLoggedData?.id, id]);

  // ------------------ ACADEMICS VALIDATION ------------------
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
      "High School - 10th (SSC)": UpdateHighschoolData,
      "Intermediate - 12th (HSC)": UpdateIntermediateData,
      "Under Graduation (UG)": UpdateUnderGraduationData,
      "Post Graduation (PG)": UpdatePostGraduationData,
    };

    const isValid = StudentDataById?.SubCourse?.admissionEligibility?.every(
      (Eligibility) => {
        const trimmedEligibility = (Eligibility || "").trim();
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
    UpdateIntermediateData,
    UpdateHighschoolData,
    UpdateUnderGraduationData,
    UpdatePostGraduationData,
    UpdateOtherData,
  ]);

  // ------------------ DOCUMENTS VALIDATION ------------------
  useEffect(() => {
    if (
      !UpdateAllDocuments?.StudentSignature ||
      !UpdateAllDocuments?.aadhaar ||
      !UpdateAllDocuments?.photo ||
      !UpdateAllDocuments?.ABCID
    ) {
      setUpdateAllDocumentsDataValidations(true);
    } else {
      setUpdateAllDocumentsDataValidations(false);
    }
  }, [UpdateAllDocuments]);

  // ------------------ DISABLE LOGIC ------------------
  const isNextButtonDisabled = () => {
    // Enable whenever you’re ready:
    // if (currentStep === 1 && UpdateUserDataValidations) return true;
    // if (currentStep === 2 && UpdatePersonalDataValidations) return true;
    // if (currentStep === 3 && AcademicsDataValidations) return true;
    // if (currentStep === 4 && UpdateAllDocumentsDataValidations) return true;
    return false;
  };

  const handlePrimaryClick = () => {
    const isLastStep = currentStep === steps.length;
    HandleClick(isLastStep ? "submit" : "next");
  };

  // ------------------ UI / UX (MODERN) ------------------
  return (
    <div className="mt-4 flex justify-between max-w-2xl mx-auto px-2 md:px-1">
      {/* Back button */}
      <button
        onClick={() => HandleClick()}
        disabled={currentStep === 1}
        className={`
          inline-flex mx-2 md:mx-4 items-center justify-center rounded-lg border text-xs md:text-sm font-semibold
          px-4 md:px-6 py-2 transition-all duration-200
          bg-slate-100 text-slate-700 border-slate-300
          hover:bg-slate-200 hover:text-slate-900
          dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700
          ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        Back
      </button>

      {/* Save / Save & Next button */}
      <button
        onClick={handlePrimaryClick}
        disabled={isNextButtonDisabled()}
        className={`
          inline-flex mx-2 md:mx-4 items-center justify-center rounded-lg text-xs md:text-sm font-semibold
          px-5 md:px-8 py-2.5 shadow-sm transition-all duration-200
          bg-green-600 text-white hover:bg-green-700
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-green-500
          disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
        `}
      >
        {currentStep === steps.length ? "Save" : "Save or Next"}
      </button>
    </div>
  );
};

export default StepperControl;
