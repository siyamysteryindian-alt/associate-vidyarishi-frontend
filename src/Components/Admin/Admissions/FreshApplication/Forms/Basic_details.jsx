import { useContext, useEffect } from "react";
import { StepperContext } from "../StepperContext";
import UseGetCenterSubCenter from "../../../../../CustomHooks/UseGetCenterSubCenter";
import UseGetSpecialization from "../../../../../CustomHooks/UseGetSpecialization";
import UseGetProgramPagination from "../../../../../CustomHooks/UseGetProgramPagination";
import UseGetAdmissionSession from "../../../../../CustomHooks/UseGetAdmissionSession";
import useGetProgramType from "../../../../../CustomHooks/UseGetProgramType";
import { useSelector } from "react-redux";
import useGetCounsellor from "../../../../../CustomHooks/UseGetCounsellor";

const Basic_details = () => {
  const { UserData, setUserData } = useContext(StepperContext);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);
  const ReduxGetDataFromRedux = useSelector((state) => state.user);

  const { AllProgramsByPagination, GetAllProgramsByPagination } =
    UseGetProgramPagination();

  const {
    GetSpecializationByProgramId,
    SpecializationByProgramId,
    GetSpecialization,
  } = UseGetSpecialization();

  const { GetAdmissionType, AdmissionType } = useGetProgramType();

  const { AdmissionsessionListData, GetAdmissionSession } =
    UseGetAdmissionSession();

  const { GetCenter, Center, GetSubCenter, SubCenter } =
    UseGetCenterSubCenter();

  const {
    GetCounsellorManager,
    CounsellorManager,
    GetSubCounsellorManager,
    SubCounsellorManager,
  } = useGetCounsellor();

  useEffect(() => {
    GetSpecialization();
  }, []);

  useEffect(() => {
    GetSubCounsellorManager();
    GetCounsellorManager();
    GetAdmissionSession();
    GetAdmissionType();
    GetCenter();
    GetSubCenter();
    GetAllProgramsByPagination();
  }, [UniversityGetDataFromRedux?.id]);

  useEffect(() => {
    if (UserData?.Course) {
      GetSpecializationByProgramId(UserData?.Course);
    }
  }, [UserData?.Course]);

  const HandleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      name === "Aadhar"
        ? value
            .replace(/\s+/g, "")
            .match(/.{1,4}/g)
            ?.join(" ") || ""
        : value;

    setUserData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const isAadhaarValid = (Aadhaar) =>
    /^[2-9]{1}[0-9]{3} [0-9]{4} [0-9]{4}$/.test(Aadhaar);

  // 🔹 Common styles for inputs & selects
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

  return (
    <div className="mx-2 flex-1 space-y-4">
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
                value={UserData?.Center || ""}
                name="Center"
                id="Center"
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {Center && Center.length !== 0 ? (
                  <>
                    {Center?.filter((data) => {
                      if (data?.isDeleted) return false;

                      if (ReduxGetDataFromRedux?.role === "center") {
                        return ReduxGetDataFromRedux?.id === data?._id;
                      }

                      return data?.allotedUniversities?.some(
                        (university) =>
                          university?._id === UniversityGetDataFromRedux?.id,
                      );
                    }).map((center) => {
                      if (ReduxGetDataFromRedux?.role === "Counsellor") {
                        const counsellor = CounsellorManager.find(
                          (couns) =>
                            couns?._id === ReduxGetDataFromRedux?.id &&
                            couns?.allotedCenter?.some(
                              (centerData) => centerData?._id === center?._id,
                            ),
                        );

                        if (counsellor) {
                          return counsellor.allotedCenter.map((centerData) => (
                            <option
                              key={centerData?._id}
                              value={centerData?._id}
                            >
                              {centerData?.name}
                            </option>
                          ));
                        }
                      } else if (
                        ReduxGetDataFromRedux?.role === "subCounsellor"
                      ) {
                        const subcounsellor = SubCounsellorManager.find(
                          (subcouns) =>
                            subcouns?._id === ReduxGetDataFromRedux?.id &&
                            subcouns?.allotedCenter?.some(
                              (centerData) => centerData?._id === center?._id,
                            ),
                        );

                        if (subcounsellor) {
                          return subcounsellor.allotedCenter.map(
                            (centerData) => (
                              <option
                                key={centerData?._id}
                                value={centerData?._id}
                              >
                                {centerData?.name}
                              </option>
                            ),
                          );
                        }
                      } else if (ReduxGetDataFromRedux?.role === "subCenter") {
                        return SubCenter.map(
                          (data) =>
                            data?._id === ReduxGetDataFromRedux?.id &&
                            !data?.isDeleted && (
                              <option
                                key={data?.center?._id}
                                value={data?.center?._id}
                              >
                                {data?.center?.name}
                              </option>
                            ),
                        );
                      } else {
                        return (
                          <option key={center?._id} value={center?._id}>
                            {center?.name}
                          </option>
                        );
                      }

                      return null;
                    })}
                  </>
                ) : (
                  <option value="">Not Found</option>
                )}
              </select>
              {UserData?.Center === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Admission Session */}
            <div className={fieldWrapperClass}>
              <label htmlFor="AdmissionSession" className={labelClass}>
                Admission Session <span className="text-red-500">*</span>
              </label>
              <select
                value={UserData?.AdmissionSession || ""}
                onChange={HandleChange}
                name="AdmissionSession"
                id="AdmissionSession"
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {AdmissionsessionListData?.map((data) =>
                  data.university === UniversityGetDataFromRedux?.id &&
                  !data?.isDeleted ? (
                    <option key={data?._id} value={data?._id}>
                      {data?.name}
                    </option>
                  ) : null,
                )}
              </select>
              {UserData?.AdmissionSession === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Admission Type */}
            <div className={fieldWrapperClass}>
              <label htmlFor="AdmissionType" className={labelClass}>
                Admission Type <span className="text-red-500">*</span>
              </label>
              <select
                value={UserData?.AdmissionType || ""}
                onChange={HandleChange}
                name="AdmissionType"
                id="AdmissionType"
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {AdmissionType?.filter((data) => !data?.isDeleted)?.map(
                  (data) => (
                    <option key={data?._id} value={data?._id}>
                      {data?.name}
                    </option>
                  ),
                )}
              </select>
              {UserData?.AdmissionType === "" && (
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
                value={UserData?.Course || ""}
                name="Course"
                id="Course"
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {AllProgramsByPagination?.length !== 0 ? (
                  AllProgramsByPagination?.filter(
                    (data) =>
                      data?.university?._id === UniversityGetDataFromRedux.id &&
                      !data?.isDeleted,
                  )?.map((data) => (
                    <option key={data?._id} value={data?._id}>
                      {data?.name}
                    </option>
                  ))
                ) : (
                  <option value="">Not Found</option>
                )}
              </select>
              {UserData?.Course === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* Stream */}
            <div className={fieldWrapperClass}>
              <label htmlFor="SubCourse" className={labelClass}>
                Stream <span className="text-red-500">*</span>
              </label>
              <select
                onChange={HandleChange}
                value={UserData?.SubCourse || ""}
                name="SubCourse"
                id="SubCourse"
                className={selectBaseClass}
              >
                <option value="">Select</option>
                {SpecializationByProgramId.filter(
                  (data) =>
                    data?.university?._id === UniversityGetDataFromRedux?.id &&
                    data?.Program?._id === UserData?.Course &&
                    !data?.isDeleted,
                ).map((data) => (
                  <option key={data?._id} value={data?._id}>
                    {data?.name}
                  </option>
                ))}
              </select>
              {UserData?.SubCourse === "" && (
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
                value={UserData?.year || ""}
                name="year"
                id="year"
                className={selectBaseClass}
              >
                <option value="">Select</option>
                <option value={"1"}>1</option>
              </select>
              {UserData?.year === "" && (
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
            Personal information
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
                value={UserData?.FullName || ""}
                placeholder="Student full name"
                id="FullName"
                className={inputBaseClass}
              />
              {UserData?.FullName === "" && (
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
                value={UserData?.FatherName || ""}
                name="FatherName"
                placeholder="Father full name"
                id="FatherName"
                className={inputBaseClass}
              />
              {UserData?.FatherName === "" && (
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
                value={UserData?.MotherName || ""}
                placeholder="Mother full name"
                onChange={HandleChange}
                name="MotherName"
                id="MotherName"
                className={inputBaseClass}
              />
              {UserData?.MotherName === "" && (
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
                value={UserData?.DOB || ""}
                onChange={HandleChange}
                className={inputBaseClass}
                id="DOB"
              />
              {UserData?.DOB === "" && (
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
                className={selectBaseClass}
                value={UserData?.Gender || ""}
              >
                <option value="">Select</option>
                <option value={"Male"}>Male</option>
                <option value={"Female"}>Female</option>
                <option value={"Other"}>Other</option>
              </select>
              {UserData?.Gender === "" && (
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
                className={selectBaseClass}
                value={UserData?.Category || ""}
              >
                <option value="">Select</option>
                <option value={"General"}>General</option>
                <option value={"OBC"}>OBC</option>
                <option value={"SC"}>SC</option>
                <option value={"ST"}>ST</option>
              </select>
              {UserData?.Category === "" && (
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
                className={selectBaseClass}
                value={UserData?.EmploymentStatus || ""}
              >
                <option value="">Select</option>
                <option value={"Employed"}>Employed</option>
                <option value={"Unemployed"}>Unemployed</option>
              </select>
              {UserData?.EmploymentStatus === "" && (
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
                value={UserData?.MaritalStatus || ""}
                name="MaritalStatus"
                id="MaritalStatus"
                className={selectBaseClass}
              >
                <option value="">Select</option>
                <option value={"Married"}>Married</option>
                <option value={"Unmarried"}>Unmarried</option>
              </select>
              {UserData?.MaritalStatus === "" && (
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
                value={UserData?.Aadhar || ""}
                onChange={HandleChange}
                className={inputBaseClass}
                id="Aadhar"
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
                aria-label="Enter your Aadhaar Number"
                aria-required="true"
                required
              />
              {UserData?.Aadhar && !isAadhaarValid(UserData?.Aadhar) && (
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
                value={UserData?.Religion || ""}
                name="Religion"
                id="Religion"
                className={selectBaseClass}
              >
                <option value="">Select</option>
                <option value={"Hindu"}>Hindu</option>
                <option value={"Muslim"}>Muslim</option>
                <option value={"sikh"}>Sikh</option>
                <option value={"Christan"}>Christian</option>
                <option value={"Jain"}>Jain</option>
              </select>
              {UserData?.Religion === "" && (
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
                value={UserData?.Nationality || ""}
                name="Nationality"
                id="Nationality"
                className={selectBaseClass}
              >
                <option value="">Select</option>
                <option value={"Indian"}>Indian</option>
                <option value={"NRI"}>NRI</option>
              </select>
              {UserData?.Nationality === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>
          </div>

          {/* ABC / DEB IDs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* ABC ID */}
            {/* ABC ID */}
            <div className={fieldWrapperClass}>
              <label htmlFor="ABCIDNo" className={labelClass}>
                ABC ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="ABCIDNo"
                value={UserData?.ABCIDNo || ""}
                onChange={HandleChange}
                className={inputBaseClass}
                id="ABCIDNo"
                placeholder="Enter ABC ID"
                required
              />

              {UserData?.ABCIDNo === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            {/* DEB ID */}
            {/* DEB ID */}
            <div className={fieldWrapperClass}>
              <label htmlFor="DEBIDNo" className={labelClass}>
                DEB ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="DEBIDNo"
                value={UserData?.DEBIDNo || ""}
                onChange={HandleChange}
                className={inputBaseClass}
                id="DEBIDNo"
                placeholder="Enter DEB ID"
                required
              />

              {UserData?.DEBIDNo === "" && (
                <p className={errorTextClass}>This field is required</p>
              )}
            </div>

            <div className="hidden md:block" />
            <div className="hidden md:block" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Basic_details;
