import React, { useContext, useEffect } from "react";
import { StepperContext } from "../StepperContext";
import uploadFile from "../../../../../Helper/UploadFile";
import { useSelector } from "react-redux";
import UseGetStudentById from "../../../../../CustomHooks/UseGetStudentById";

const Academics = () => {
  const { HighschoolData, setHighschoolData } = useContext(StepperContext);
  const { IntermediateData, setIntermediateData } = useContext(StepperContext);
  const { UnderGraduationData, setUnderGraduationData } =
    useContext(StepperContext);
  const { PostGraduationData, setPostGraduationData } =
    useContext(StepperContext);
  const { OtherData, setOtherData } = useContext(StepperContext);

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

  // ---------- Handlers for text/select change ----------
  const HandleChange1 = (e) => {
    const { name, value } = e.target;
    setHighschoolData({ ...HighschoolData, [name]: value });
  };

  const HandleChange2 = (e) => {
    const { name, value } = e.target;
    setIntermediateData({ ...IntermediateData, [name]: value });
  };

  const HandleChange3 = (e) => {
    const { name, value } = e.target;
    setUnderGraduationData({ ...UnderGraduationData, [name]: value });
  };

  const HandleChange4 = (e) => {
    const { name, value } = e.target;
    setPostGraduationData({ ...PostGraduationData, [name]: value });
  };

  const HandleChange5 = (e) => {
    const { name, value } = e.target;
    setOtherData({ ...OtherData, [name]: value });
  };

  useEffect(() => {
    console.log("UnderGraduationData", UnderGraduationData);
    console.log("PostGraduationData", PostGraduationData);
    console.log("OtherData", OtherData);
    console.log("StudentDataById", StudentDataById);
  }, [UnderGraduationData, PostGraduationData, OtherData]);

  // ---------- Single File Uploads ----------
  const HandleUploadPhoto1 = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const response = await uploadFile(file);
      if (response?.url) {
        setHighschoolData((prev) => ({
          ...prev,
          photo: response.url,
        }));
      }
    } catch (error) {
      console.error("Highschool upload error:", error);
    }
  };

  const HandleUploadPhoto2 = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const response = await uploadFile(file);
      if (response?.url) {
        setIntermediateData((prev) => ({
          ...prev,
          photo: response.url,
        }));
      }
    } catch (error) {
      console.error("Intermediate upload error:", error);
    }
  };

  const HandleUploadPhoto3 = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const response = await uploadFile(file);
      if (response?.url) {
        setUnderGraduationData((prev) => ({
          ...prev,
          photo: response.url,
        }));
      }
    } catch (error) {
      console.error("UG upload error:", error);
    }
  };

  const HandleUploadPhoto4 = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const response = await uploadFile(file);
      if (response?.url) {
        setPostGraduationData((prev) => ({
          ...prev,
          photo: response.url,
        }));
      }
    } catch (error) {
      console.error("PG upload error:", error);
    }
  };

  const HandleUploadPhoto5 = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const response = await uploadFile(file);
      if (response?.url) {
        setOtherData((prev) => ({
          ...prev,
          photo: response.url,
        }));
      }
    } catch (error) {
      console.error("Other upload error:", error);
    }
  };

  // ---------- Multiple File Uploads ----------
  const HandleUploadUGMultiplePhoto = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const uploadPromises = files.map(async (file) => {
        const response = await uploadFile(file);
        return response?.url || null;
      });

      const urls = (await Promise.all(uploadPromises)).filter(Boolean);

      if (urls.length > 0) {
        setUnderGraduationData((prev) => ({
          ...prev,
          AllUgPhotos: [...(prev.AllUgPhotos || []), ...urls], // 🔹 use AllUgPhotos consistently
        }));
      }
    } catch (error) {
      console.error("UG multiple upload error:", error);
    }
  };

  const HandleUploadPGMultiplePhoto = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const uploadPromises = files.map(async (file) => {
        const response = await uploadFile(file);
        return response?.url || null;
      });

      const urls = (await Promise.all(uploadPromises)).filter(Boolean);

      if (urls.length > 0) {
        setPostGraduationData((prev) => ({
          ...prev,
          AllPgPhotos: [...(prev.AllPgPhotos || []), ...urls], // 🔹 use AllPgPhotos consistently
        }));
      }
    } catch (error) {
      console.error("PG multiple upload error:", error);
    }
  };

  const HandleUploadOtherMultiplePhoto = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const uploadPromises = files.map(async (file) => {
        const response = await uploadFile(file);
        return response?.url || null;
      });

      const urls = (await Promise.all(uploadPromises)).filter(Boolean);

      if (urls.length > 0) {
        setOtherData((prev) => ({
          ...prev,
          AllOtherPhotos: [...(prev.AllOtherPhotos || []), ...urls], // 🔹 use AllOtherPhotos consistently
        }));
      }
    } catch (error) {
      console.error("Other multiple upload error:", error);
    }
  };

  // ---------- Generate Year Options ----------
  const years = Array.from(
    { length: new Date().getFullYear() - 1980 + 1 },
    (_, index) => 1980 + index
  ).reverse();

  // Common Tailwind styles (same vibe as Basic_details)
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
  const fileInputClass =
    "block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/80 " +
    "dark:bg-slate-900/60 px-3 py-2 text-xs md:text-sm text-slate-700 dark:text-slate-200 " +
    "cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500/80 focus:border-pink-500";

  const sectionCardClass =
    "w-full border border-slate-200 dark:border-slate-700 rounded-2xl " +
    "bg-white/80 dark:bg-slate-900/70 shadow-sm px-4 py-4 mt-3";

  return (
    <div className="w-full mx-2 flex-1">
      <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-white/80 dark:bg-slate-900/70 shadow-sm">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
            Academic Details
          </h2>
          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300">
            Step 3 · Education History
          </span>
        </div>

        <div className="p-4">
          <div className="flex flex-col gap-4">
            {StudentDataById?.SubCourse?.admissionEligibility?.map(
              (Eligibility, index) => {
                const CASE1 = "High School - 10th (SSC)";
                const CASE2 = "Intermediate - 12th (HSC)";
                const CASE3 = "Under Graduation (UG)";
                const CASE4 = "Post Graduation (PG)";
                const CASE5 = "Other";

                const trimmedEligibility = (Eligibility || "").trim();

                // ---------- High School ----------
                if (trimmedEligibility === CASE1) {
                  return (
                    <div key={`ssc-${index}`} className={sectionCardClass}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
                          High School (10th / SSC)
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          Mandatory
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
                        {/* Subjects */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="HSubjects" className={labelClass}>
                            Subjects <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="HSubjects"
                            name="Subjects"
                            value={HighschoolData?.Subjects || ""}
                            onChange={HandleChange1}
                            placeholder="Ex: English, Maths, Science"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Year */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="HYear" className={labelClass}>
                            Year <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="HYear"
                            name="Year"
                            value={HighschoolData?.Year || ""}
                            onChange={HandleChange1}
                            className={selectBaseClass}
                          >
                            <option value="">Select</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Board */}
                        <div className={fieldWrapperClass}>
                          <label
                            htmlFor="HBoardUniversity"
                            className={labelClass}
                          >
                            Board <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="HBoardUniversity"
                            name="BoardUniversity"
                            value={HighschoolData?.BoardUniversity || ""}
                            onChange={HandleChange1}
                            placeholder="Ex: CBSE / State Board"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Result */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="HResult" className={labelClass}>
                            Result <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="HResult"
                            name="Result"
                            value={HighschoolData?.Result || ""}
                            onChange={HandleChange1}
                            className={selectBaseClass}
                          >
                            <option value="">Select</option>
                            {["Passed", "Failed", "Discontinued"].map(
                              (data) => (
                                <option key={data} value={data}>
                                  {data}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Percentage */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="HPercentage" className={labelClass}>
                            Percentage <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            id="HPercentage"
                            name="Percentage"
                            value={HighschoolData?.Percentage || ""}
                            onChange={HandleChange1}
                            placeholder="Ex: 88.50"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Upload */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="HPhoto" className={labelClass}>
                            Upload Marksheet{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="HPhoto"
                            name="photo"
                            type="file"
                            onChange={HandleUploadPhoto1}
                            className={fileInputClass}
                          />

                          {HighschoolData?.photo && (
                            <div className="mt-2">
                              <img
                                src={HighschoolData?.photo}
                                alt="Highschool Marksheet"
                                className="w-28 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // ---------- Intermediate ----------
                if (trimmedEligibility === CASE2) {
                  return (
                    <div key={`hsc-${index}`} className={sectionCardClass}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
                          Intermediate (12th / HSC)
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          Mandatory
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
                        {/* Subjects */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="ISubjects" className={labelClass}>
                            Subjects <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="ISubjects"
                            name="Subjects"
                            value={IntermediateData?.Subjects || ""}
                            onChange={HandleChange2}
                            placeholder="Ex: PCM / PCB / Commerce"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Year */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="IYear" className={labelClass}>
                            Year <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="IYear"
                            name="Year"
                            value={IntermediateData?.Year || ""}
                            onChange={HandleChange2}
                            className={selectBaseClass}
                          >
                            <option value="">Select</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Board */}
                        <div className={fieldWrapperClass}>
                          <label
                            htmlFor="IBoardUniversity"
                            className={labelClass}
                          >
                            Board <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="IBoardUniversity"
                            name="BoardUniversity"
                            value={IntermediateData?.BoardUniversity || ""}
                            onChange={HandleChange2}
                            placeholder="Ex: CBSE / State Board"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Result */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="IResult" className={labelClass}>
                            Result <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="IResult"
                            name="Result"
                            value={IntermediateData?.Result || ""}
                            onChange={HandleChange2}
                            className={selectBaseClass}
                          >
                            <option value="">Select</option>
                            {["Passed", "Failed", "Discontinued"].map(
                              (data) => (
                                <option key={data} value={data}>
                                  {data}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Percentage */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="IPercentage" className={labelClass}>
                            Percentage <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            id="IPercentage"
                            name="Percentage"
                            value={IntermediateData?.Percentage || ""}
                            onChange={HandleChange2}
                            placeholder="Ex: 90.25"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Upload */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="IPhoto" className={labelClass}>
                            Upload Marksheet{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="IPhoto"
                            name="photo"
                            type="file"
                            onChange={HandleUploadPhoto2}
                            className={fileInputClass}
                          />

                          {IntermediateData?.photo && (
                            <div className="mt-2">
                              <img
                                src={IntermediateData?.photo}
                                alt="Intermediate Marksheet"
                                className="w-28 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // ---------- Under Graduation ----------
                if (trimmedEligibility === CASE3) {
                  return (
                    <div key={`ug-${index}`} className={sectionCardClass}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
                          Under Graduation (UG)
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          If applicable
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
                        {/* Subjects */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="UGSubjects" className={labelClass}>
                            Subjects <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="UGSubjects"
                            name="Subjects"
                            value={UnderGraduationData?.Subjects || ""}
                            onChange={HandleChange3}
                            placeholder="Major subjects"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Year */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="UGYear" className={labelClass}>
                            Year <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="UGYear"
                            name="Year"
                            value={UnderGraduationData?.Year || ""}
                            onChange={HandleChange3}
                            className={selectBaseClass}
                          >
                            <option value="">Select</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* University */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="UGUniversity" className={labelClass}>
                            University <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="UGUniversity"
                            name="University"
                            value={UnderGraduationData?.University || ""}
                            onChange={HandleChange3}
                            placeholder="Ex: Mumbai University"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Result */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="UGResult" className={labelClass}>
                            Result <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="UGResult"
                            name="Result"
                            value={UnderGraduationData?.Result || ""}
                            onChange={HandleChange3}
                            className={selectBaseClass}
                          >
                            <option value="">Select</option>
                            {["Passed", "Failed", "Discontinued"].map(
                              (data) => (
                                <option key={data} value={data}>
                                  {data}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* CGPA */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="UGCGPA" className={labelClass}>
                            CGPA <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            max={10}
                            id="UGCGPA"
                            name="CGPA"
                            value={UnderGraduationData?.CGPA || ""}
                            onChange={HandleChange3}
                            placeholder="Ex: 8.75"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Upload Single Marksheet */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="UGPhoto" className={labelClass}>
                            Upload Marksheet
                          </label>
                          <input
                            id="UGPhoto"
                            name="photo"
                            type="file"
                            onChange={HandleUploadPhoto3}
                            className={fileInputClass}
                          />
                          {UnderGraduationData?.photo && (
                            <div className="mt-2">
                              <img
                                src={UnderGraduationData?.photo}
                                alt="UG Marksheet"
                                className="w-28 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                              />
                            </div>
                          )}
                        </div>

                        {/* Multiple Marksheets */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="AllUgPhotos" className={labelClass}>
                            Upload More Marksheets
                          </label>
                          <input
                            id="AllUgPhotos"
                            name="AllUgPhotos"
                            type="file"
                            multiple
                            onChange={HandleUploadUGMultiplePhoto}
                            className={fileInputClass}
                          />

                          {UnderGraduationData?.AllUgPhotos?.length > 0 && (
                            <div className="w-full mt-2 grid grid-cols-3 gap-2">
                              {UnderGraduationData.AllUgPhotos.map(
                                (photoUrl, inx) => (
                                  <div
                                    key={inx}
                                    className="flex flex-col items-center"
                                  >
                                    <img
                                      src={photoUrl}
                                      alt={`UG ${inx + 1}`}
                                      className="w-20 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                    />
                                    <p className="text-[10px] mt-1 text-slate-500">
                                      #{inx + 1}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // ---------- Post Graduation ----------
                if (trimmedEligibility === CASE4) {
                  return (
                    <div key={`pg-${index}`} className={sectionCardClass}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
                          Post Graduation (PG)
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          If applicable
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
                        {/* Subjects */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="PGSubjects" className={labelClass}>
                            Subjects <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="PGSubjects"
                            name="Subjects"
                            value={PostGraduationData?.Subjects || ""}
                            onChange={HandleChange4}
                            placeholder="Major subjects"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Year */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="PGYear" className={labelClass}>
                            Year <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="PGYear"
                            name="Year"
                            value={PostGraduationData?.Year || ""}
                            onChange={HandleChange4}
                            className={selectBaseClass}
                          >
                            <option value="">Select</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* University */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="PGUniversity" className={labelClass}>
                            University <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="PGUniversity"
                            name="University"
                            value={PostGraduationData?.University || ""}
                            onChange={HandleChange4}
                            placeholder="Ex: DU / MU"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Result */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="PGResult" className={labelClass}>
                            Result <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="PGResult"
                            name="Result"
                            value={PostGraduationData?.Result || ""}
                            onChange={HandleChange4}
                            className={selectBaseClass}
                          >
                            <option value="">Select</option>
                            {["Passed", "Failed", "Discontinued"].map(
                              (data) => (
                                <option key={data} value={data}>
                                  {data}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* CGPA */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="PGCGPA" className={labelClass}>
                            CGPA <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={0}
                            max={10}
                            id="PGCGPA"
                            name="CGPA"
                            value={PostGraduationData?.CGPA || ""}
                            onChange={HandleChange4}
                            placeholder="Ex: 9.20"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Upload Single Marksheet */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="PGPhoto" className={labelClass}>
                            Upload Marksheet
                          </label>
                          <input
                            id="PGPhoto"
                            name="photo"
                            type="file"
                            onChange={HandleUploadPhoto4}
                            className={fileInputClass}
                          />
                          {PostGraduationData?.photo && (
                            <div className="mt-2">
                              <img
                                src={PostGraduationData?.photo}
                                alt="PG Marksheet"
                                className="w-28 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                              />
                            </div>
                          )}
                        </div>

                        {/* Multiple Marksheets */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="AllPgPhotos" className={labelClass}>
                            Upload More Marksheets
                          </label>
                          <input
                            id="AllPgPhotos"
                            name="AllPgPhotos"
                            type="file"
                            multiple
                            onChange={HandleUploadPGMultiplePhoto}
                            className={fileInputClass}
                          />

                          {PostGraduationData?.AllPgPhotos?.length > 0 && (
                            <div className="w-full mt-2 grid grid-cols-3 gap-2">
                              {PostGraduationData.AllPgPhotos.map(
                                (photoUrl, inx) => (
                                  <div
                                    key={inx}
                                    className="flex flex-col items-center"
                                  >
                                    <img
                                      src={photoUrl}
                                      alt={`PG ${inx + 1}`}
                                      className="w-20 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                    />
                                    <p className="text-[10px] mt-1 text-slate-500">
                                      #{inx + 1}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // ---------- Other ----------
                if (trimmedEligibility === CASE5) {
                  return (
                    <div key={`other-${index}`} className={sectionCardClass}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
                          Other Qualification
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          Optional
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
                        {/* Course */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="OtherCourse" className={labelClass}>
                            Course / Program
                          </label>
                          <input
                            type="text"
                            id="OtherCourse"
                            name="Course"
                            value={OtherData?.Course || ""}
                            onChange={HandleChange5}
                            placeholder="Course / Program"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Subjects */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="OtherSubjects" className={labelClass}>
                            Subjects
                          </label>
                          <input
                            type="text"
                            id="OtherSubjects"
                            name="Subjects"
                            value={OtherData?.Subjects || ""}
                            onChange={HandleChange5}
                            placeholder="Major subjects"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Year */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="OtherYear" className={labelClass}>
                            Year
                          </label>
                          <select
                            id="OtherYear"
                            name="Year"
                            value={OtherData?.Year || ""}
                            onChange={HandleChange5}
                            className={selectBaseClass}
                          >
                            <option value="">Select</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* University */}
                        <div className={fieldWrapperClass}>
                          <label
                            htmlFor="OtherUniversity"
                            className={labelClass}
                          >
                            University
                          </label>
                          <input
                            type="text"
                            id="OtherUniversity"
                            name="University"
                            value={OtherData?.University || ""}
                            onChange={HandleChange5}
                            placeholder="Ex: Any University"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Result */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="OtherResult" className={labelClass}>
                            Result
                          </label>
                          <select
                            id="OtherResult"
                            name="Result"
                            value={OtherData?.Result || ""}
                            onChange={HandleChange5}
                            className={selectBaseClass}
                          >
                            <option value="">Select</option>
                            {["Passed", "Failed", "Discontinued"].map(
                              (data) => (
                                <option key={data} value={data}>
                                  {data}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Percentage / CGPA */}
                        <div className={fieldWrapperClass}>
                          <label
                            htmlFor="OtherPercentageOrCGPA"
                            className={labelClass}
                          >
                            Percentage / CGPA
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            id="OtherPercentageOrCGPA"
                            name="PercentageOrCGPA"
                            value={OtherData?.PercentageOrCGPA || ""}
                            onChange={HandleChange5}
                            placeholder="Ex: 75 / 8.5"
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Single Marksheet */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="OtherPhoto" className={labelClass}>
                            Upload Marksheet
                          </label>
                          <input
                            id="OtherPhoto"
                            name="photo"
                            type="file"
                            onChange={HandleUploadPhoto5}
                            className={fileInputClass}
                          />
                          {OtherData?.photo && (
                            <div className="mt-2">
                              <img
                                src={OtherData?.photo}
                                alt="Other Marksheet"
                                className="w-28 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                              />
                            </div>
                          )}
                        </div>

                        {/* Multiple Marksheets */}
                        <div className={fieldWrapperClass}>
                          <label
                            htmlFor="AllOtherPhotos"
                            className={labelClass}
                          >
                            Upload More Marksheets
                          </label>
                          <input
                            id="AllOtherPhotos"
                            name="AllOtherPhotos"
                            type="file"
                            multiple
                            onChange={HandleUploadOtherMultiplePhoto}
                            className={fileInputClass}
                          />

                          {OtherData?.AllOtherPhotos?.length > 0 && (
                            <div className="w-full mt-2 grid grid-cols-3 gap-2">
                              {OtherData.AllOtherPhotos.map((photoUrl, inx) => (
                                <div
                                  key={inx}
                                  className="flex flex-col items-center"
                                >
                                  <img
                                    src={photoUrl}
                                    alt={`Other ${inx + 1}`}
                                    className="w-20 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                  />
                                  <p className="text-[10px] mt-1 text-slate-500">
                                    #{inx + 1}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academics;
