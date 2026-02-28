import { useContext, useEffect } from "react";
import { UpdateStepperContext } from "../UpdateStepperContext";
import UseGetCenterSubCenter from "../../../../../CustomHooks/UseGetCenterSubCenter";
import UseGetSpecialization from "../../../../../CustomHooks/UseGetSpecialization";
import UseGetProgramPagination from "../../../../../CustomHooks/UseGetProgramPagination";
import UseGetAdmissionSession from "../../../../../CustomHooks/UseGetAdmissionSession";
import useGetProgramType from "../../../../../CustomHooks/UseGetProgramType";
import { useSelector } from "react-redux";

const UpdateBasic_details = () => {
  const { UpdateUserData, setUpdateUserData } =
    useContext(UpdateStepperContext);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const {
    AllProgramsByPaginationLoading,
    AllProgramsByPaginationError,
    AllProgramsByPagination,
    GetAllProgramsByPagination,
  } = UseGetProgramPagination();

  const {
    GetSpecializationByProgramId,
    SpecializationByProgramIdLoading,
    SpecializationByProgramIdError,
    SpecializationByProgramId,
  } = UseGetSpecialization();

  const {
    SpecializationLoading,
    SpecializationError,
    Specialization,
    GetSpecialization,
  } = UseGetSpecialization();

  useEffect(() => {
    GetSpecialization();
  }, []);

  const {
    GetAdmissionType,
    LoadingAdmissionType,
    ErrorAdmissionType,
    AdmissionType,
  } = useGetProgramType();

  const {
    AdmissionsessionListData,
    AdmissionsessionCurrentPage,
    AdmissionsessionTotalPages,
    AdmissionsessionLimit,
    AdmissionsessionLoading,
    AdmissionsessionTotalDocs,
    GetAdmissionSession,
  } = UseGetAdmissionSession();

  const { GetCenter, CenterError, CenterLoading, Center } =
    UseGetCenterSubCenter();

  useEffect(() => {
    GetAdmissionSession();
    GetAdmissionType();
    GetCenter();
    GetAllProgramsByPagination();
  }, [UniversityGetDataFromRedux?.id]);

  useEffect(() => {
    if (UpdateUserData?.Course) {
      GetSpecializationByProgramId(UpdateUserData?.Course);
    }
  }, [UpdateUserData?.Course, UpdateUserData?.SubCourse]);

  const HandleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      name === "Aadhar"
        ? value
            .replace(/\s+/g, "")
            .match(/.{1,4}/g)
            ?.join(" ") || ""
        : value;

    setUpdateUserData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  useEffect(() => {
    GetCenter();
  }, [UniversityGetDataFromRedux?.id]);

  const isAadhaarValid = (Aadhaar) =>
    /^[2-9]{1}[0-9]{3} [0-9]{4} [0-9]{4}$/.test(Aadhaar);

  // 🔹 Common styles for inputs & selects (same as Basic_details)
  const fieldWrapperClass = "flex flex-col gap-1.5";
  const labelClass =
    "block text-[11px] font-medium text-slate-600 dark:text-slate-300";
  const inputBaseClass =
    "block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 " +
    "px-3 py-2.5 text-xs md:text-sm text-slate-900 dark:text-slate-100 " +
    "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
    "focus:outline-none focus:ring-2 focus:ring-pink-500/80 focus:border-pink-500 " +
    "transition-all duration-200 shadow-sm focus:shadow-md";
  const selectBaseClass =
    "block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 " +
    "px-3 py-2.5 text-xs md:text-sm text-slate-900 dark:text-slate-100 " +
    "focus:outline-none focus:ring-2 focus:ring-pink-500/80 focus:border-pink-500 " +
    "transition-all duration-200 shadow-sm focus:shadow-md";
  const errorTextClass = "mt-0.5 text-[11px] text-red-500";

  console.log("UpdateUserData", UpdateUserData);

  return (
    <div className="mx-2 flex-1 space-y-4 mt-4">
      {/* Applying For */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-white/80 dark:bg-slate-900/70 shadow-sm">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
            Applying For
          </h2>
          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300">
            Step 1 · Program & Session
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Center */}
            <div className={fieldWrapperClass}>
              <label htmlFor="Center" className={labelClass}>
                Center <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="Center"
                id="Center"
                value={UpdateUserData?.Center || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {Center && Center.length !== 0 ? (
                  Center?.filter(
                    (data) =>
                      !data?.isDeleted &&
                      data?.allotedUniversities?.some(
                        (university) =>
                          university?._id === UniversityGetDataFromRedux.id
                      )
                  ).map((center) => (
                    <option key={center?._id} value={center?._id}>
                      {center?.name}
                    </option>
                  ))
                ) : (
                  <option value="">Not Found</option>
                )}
              </select>
              {UpdateUserData?.Center === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Admission Session */}
            <div className={fieldWrapperClass}>
              <label htmlFor="AdmissionSession" className={labelClass}>
                Admission Session <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="AdmissionSession"
                id="AdmissionSession"
                value={UpdateUserData?.AdmissionSession || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {AdmissionsessionListData?.map((data) =>
                  data.university === UniversityGetDataFromRedux?.id &&
                  !data?.isDeleted ? (
                    <option key={data?._id} value={data?._id}>
                      {data?.name}
                    </option>
                  ) : null
                )}
              </select>
              {UpdateUserData?.AdmissionSession === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Admission Type */}
            <div className={fieldWrapperClass}>
              <label htmlFor="AdmissionType" className={labelClass}>
                Admission Type <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="AdmissionType"
                id="AdmissionType"
                value={UpdateUserData?.AdmissionType || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {AdmissionType?.filter((data) => !data?.isDeleted)?.map(
                  (data) => (
                    <option key={data?._id} value={data?._id}>
                      {data?.name}
                    </option>
                  )
                )}
              </select>
              {UpdateUserData?.AdmissionType === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Course */}
            <div className={fieldWrapperClass}>
              <label htmlFor="Course" className={labelClass}>
                Course <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="Course"
                id="Course"
                value={UpdateUserData?.Course || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {AllProgramsByPagination?.length !== 0 ? (
                  AllProgramsByPagination?.filter(
                    (data) =>
                      data?.university?._id === UniversityGetDataFromRedux.id &&
                      !data?.isDeleted
                  )?.map((data) => (
                    <option key={data?._id} value={data?._id}>
                      {data?.name}
                    </option>
                  ))
                ) : (
                  <option value="">Not Found</option>
                )}
              </select>
              {UpdateUserData?.Course === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Sub course / Stream */}
            <div className={fieldWrapperClass}>
              <label htmlFor="SubCourse" className={labelClass}>
                Stream <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="SubCourse"
                id="SubCourse"
                value={UpdateUserData?.SubCourse || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {SpecializationByProgramId.filter(
                  (data) =>
                    data?.university?._id === UniversityGetDataFromRedux?.id &&
                    data?.Program?._id === UpdateUserData?.Course &&
                    !data?.isDeleted
                ).map((data) => (
                  <option key={data?._id} value={data?._id}>
                    {data?.name}
                  </option>
                ))}
              </select>
              {UpdateUserData?.SubCourse === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Year */}
            <div className={fieldWrapperClass}>
              <label htmlFor="year" className={labelClass}>
                Year <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="year"
                id="year"
                value={UpdateUserData?.year || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                <option value={"1"}>1</option>
              </select>
              {UpdateUserData?.year === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Details Block */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-white/80 dark:bg-slate-900/70 shadow-sm">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
            Basic Details
          </h2>
          <span className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500">
            Personal information (Update)
          </span>
        </div>

        <form className="p-4 space-y-4">
          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Full Name */}
            <div className={fieldWrapperClass}>
              <label htmlFor="FullName" className={labelClass}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                onChange={HandleChange}
                name="FullName"
                placeholder="Student full name"
                id="FullName"
                value={UpdateUserData?.FullName || ""}
                className={inputBaseClass}
              />
              {UpdateUserData?.FullName === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Father Name */}
            <div className={fieldWrapperClass}>
              <label htmlFor="FatherName" className={labelClass}>
                Father Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                onChange={HandleChange}
                name="FatherName"
                placeholder="Father full name"
                id="FatherName"
                value={UpdateUserData?.FatherName || ""}
                className={inputBaseClass}
              />
              {UpdateUserData?.FatherName === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Mother Name */}
            <div className={fieldWrapperClass}>
              <label htmlFor="MotherName" className={labelClass}>
                Mother Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Mother full name"
                onChange={HandleChange}
                name="MotherName"
                id="MotherName"
                value={UpdateUserData?.MotherName || ""}
                className={inputBaseClass}
              />
              {UpdateUserData?.MotherName === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>
          </div>

          {/* Row: DOB / Gender / Category / Employment */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* DOB */}
            <div className={fieldWrapperClass}>
              <label htmlFor="DOB" className={labelClass}>
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="DOB"
                onChange={HandleChange}
                value={UpdateUserData?.DOB || ""}
                className={inputBaseClass}
                id="DOB"
              />
              {UpdateUserData?.DOB === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Gender */}
            <div className={fieldWrapperClass}>
              <label htmlFor="Gender" className={labelClass}>
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="Gender"
                id="Gender"
                value={UpdateUserData?.Gender || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {["Male", "Female", "Other"].map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
              {UpdateUserData?.Gender === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Category */}
            <div className={fieldWrapperClass}>
              <label htmlFor="Category" className={labelClass}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="Category"
                id="Category"
                value={UpdateUserData?.Category || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {["General", "OBC", "SC", "ST"].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {UpdateUserData?.Category === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Employment Status */}
            <div className={fieldWrapperClass}>
              <label htmlFor="EmploymentStatus" className={labelClass}>
                Employment Status <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="EmploymentStatus"
                id="EmploymentStatus"
                value={UpdateUserData?.EmploymentStatus || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {["Employed", "Unemployed"].map((employ) => (
                  <option key={employ} value={employ}>
                    {employ}
                  </option>
                ))}
              </select>
              {UpdateUserData?.EmploymentStatus === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>
          </div>

          {/* Row: Marital / Aadhaar / Religion / Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Marital Status */}
            <div className={fieldWrapperClass}>
              <label htmlFor="MaritalStatus" className={labelClass}>
                Marital Status <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="MaritalStatus"
                id="MaritalStatus"
                value={UpdateUserData?.MaritalStatus || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {["Married", "Unmarried"].map((married) => (
                  <option key={married} value={married}>
                    {married}
                  </option>
                ))}
              </select>
              {UpdateUserData?.MaritalStatus === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Aadhaar */}
            <div className={fieldWrapperClass}>
              <label htmlFor="Aadhar" className={labelClass}>
                Aadhaar <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Aadhar"
                value={UpdateUserData?.Aadhar || ""}
                onChange={HandleChange}
                className={inputBaseClass}
                id="Aadhar"
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
                aria-label="Enter your Aadhaar Number"
                aria-required="true"
                required
              />
              {UpdateUserData?.Aadhar &&
                !isAadhaarValid(UpdateUserData?.Aadhar) && (
                  <p className={errorTextClass}>
                    Invalid Aadhaar. Must follow format:{" "}
                    <span className="font-semibold">XXXX XXXX XXXX</span>
                  </p>
                )}
            </div>

            {/* Religion */}
            <div className={fieldWrapperClass}>
              <label htmlFor="Religion" className={labelClass}>
                Religion <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="Religion"
                id="Religion"
                value={UpdateUserData?.Religion || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {["Hindu", "Muslim", "sikh", "Christan", "Jain"].map(
                  (religion) => (
                    <option key={religion} value={religion}>
                      {religion}
                    </option>
                  )
                )}
              </select>
              {UpdateUserData?.Religion === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Nationality */}
            <div className={fieldWrapperClass}>
              <label htmlFor="Nationality" className={labelClass}>
                Nationality <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                name="Nationality"
                id="Nationality"
                value={UpdateUserData?.Nationality || ""}
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {["Indian", "NRI"].map((nation) => (
                  <option key={nation} value={nation}>
                    {nation}
                  </option>
                ))}
              </select>
              {UpdateUserData?.Nationality === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBasic_details;
