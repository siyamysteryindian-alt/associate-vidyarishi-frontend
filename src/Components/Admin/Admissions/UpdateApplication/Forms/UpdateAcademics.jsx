import React, { useContext, useEffect } from "react";
import { UpdateStepperContext } from "../UpdateStepperContext";
import uploadFile from "../../../../../Helper/UploadFile";
import { useSelector } from "react-redux";
import UseGetStudentById from "../../../../../CustomHooks/UseGetStudentById";
import { useParams } from "react-router-dom";

const UpdateAcademics = () => {
  const { UpdateHighschoolData, setUpdateHighschoolData } =
    useContext(UpdateStepperContext);
  const { UpdateIntermediateData, setUpdateIntermediateData } =
    useContext(UpdateStepperContext);
  const { UpdateUnderGraduationData, setUpdateUnderGraduationData } =
    useContext(UpdateStepperContext);
  const { UpdatePostGraduationData, setUpdatePostGraduationData } =
    useContext(UpdateStepperContext);
  const { UpdateOtherData, setUpdateOtherData } =
    useContext(UpdateStepperContext);

  const StudentLoggedData = useSelector((state) => state.studentId);

  const {
    StudentByIdLoading,
    StudentByIdError,
    StudentDataById,
    GetStudentById,
  } = UseGetStudentById();

  const { id } = useParams();

  useEffect(() => {
    GetStudentById(id);
  }, [id]);

  useEffect(() => {
    if (StudentLoggedData?.id !== "") {
      StudentLoggedData?.id;
    }
  }, [StudentLoggedData?.id !== ""]);

  // ------- Change Handlers -------

  const HandleChange1 = (e) => {
    const { name, value } = e.target;
    setUpdateHighschoolData({ ...UpdateHighschoolData, [name]: value });
  };

  const HandleChange2 = (e) => {
    const { name, value } = e.target;
    setUpdateIntermediateData({ ...UpdateIntermediateData, [name]: value });
  };

  const HandleChange3 = (e) => {
    const { name, value } = e.target;
    setUpdateUnderGraduationData({
      ...UpdateUnderGraduationData,
      [name]: value,
    });
  };

  const HandleChange4 = (e) => {
    const { name, value } = e.target;
    setUpdatePostGraduationData({ ...UpdatePostGraduationData, [name]: value });
  };

  const HandleChange5 = (e) => {
    const { name, value } = e.target;
    setUpdateOtherData({ ...UpdateOtherData, [name]: value });
  };

  // ------- Single file uploads -------

  const HandleUploadPhoto1 = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const response = await uploadFile(file);
      if (response?.url) {
        setUpdateHighschoolData((prev) => ({
          ...prev,
          photo: response.url,
        }));
      }
    } catch (error) {
      console.error("High school upload error:", error);
    }
  };

  const HandleUploadPhoto2 = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const response = await uploadFile(file);
      if (response?.url) {
        setUpdateIntermediateData((prev) => ({
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
        setUpdateUnderGraduationData((prev) => ({
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
        setUpdatePostGraduationData((prev) => ({
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
        setUpdateOtherData((prev) => ({
          ...prev,
          photo: response.url,
        }));
      }
    } catch (error) {
      console.error("Other upload error:", error);
    }
  };

  // ------- Multi file uploads -------

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
        setUpdateUnderGraduationData((prev) => ({
          ...prev,
          AllUgPhotos: [...(prev.photos || []), ...urls], // (logic unchanged)
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
        setUpdatePostGraduationData((prev) => ({
          ...prev,
          AllPgPhotos: [...(prev.photos || []), ...urls], // (logic unchanged)
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
        setUpdateOtherData((prev) => ({
          ...prev,
          AllOtherPhotos: [...(prev.photos || []), ...urls], // (logic unchanged)
        }));
      }
    } catch (error) {
      console.error("Other multiple upload error:", error);
    }
  };

  // ------- Years list -------

  const years = Array.from(
    { length: new Date().getFullYear() - 1980 + 1 },
    (_, index) => 1980 + index
  ).reverse();

  // ------- Common UI classes (matching reference Academics UI) -------

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
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
            Academic Details
          </h2>
          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300">
            Step 3 · Education History (Update)
          </span>
        </div>

        {/* Body */}
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

                // ------- High School -------

                if (trimmedEligibility === CASE1) {
                  return (
                    <div key={`ssc-${index}`} className={sectionCardClass}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
                          High School (SSC)
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
                            placeholder="Ex: English, Hindi, etc"
                            onChange={HandleChange1}
                            value={UpdateHighschoolData?.Subjects || ""}
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
                            onChange={HandleChange1}
                            value={UpdateHighschoolData?.Year || ""}
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
                            Board / University{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="HBoardUniversity"
                            name="BoardUniversity"
                            placeholder="Ex: CBSE / State Board"
                            onChange={HandleChange1}
                            value={UpdateHighschoolData?.BoardUniversity || ""}
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
                            onChange={HandleChange1}
                            value={UpdateHighschoolData?.Result || ""}
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
                            id="HPercentage"
                            name="Percentage"
                            placeholder="Ex: 99.99"
                            min={0}
                            max={1}
                            step="0.01"
                            onChange={HandleChange1}
                            value={UpdateHighschoolData?.Percentage || ""}
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

                          {UpdateHighschoolData?.photo && (
                            <div className="mt-2">
                              <img
                                className="w-28 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                src={UpdateHighschoolData?.photo}
                                alt="Highschool Marksheet"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // ------- Intermediate -------

                if (trimmedEligibility === CASE2) {
                  return (
                    <div key={`hsc-${index}`} className={sectionCardClass}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-50">
                          Intermediate (HSC)
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
                            placeholder="Ex: Physics, Chemistry etc"
                            onChange={HandleChange2}
                            value={UpdateIntermediateData?.Subjects || ""}
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
                            onChange={HandleChange2}
                            value={UpdateIntermediateData?.Year || ""}
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
                            Board / University{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="IBoardUniversity"
                            name="BoardUniversity"
                            placeholder="Ex: CBSE / State Board"
                            onChange={HandleChange2}
                            value={
                              UpdateIntermediateData?.BoardUniversity || ""
                            }
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
                            onChange={HandleChange2}
                            value={UpdateIntermediateData?.Result || ""}
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
                            id="IPercentage"
                            name="Percentage"
                            placeholder="Ex: 99.99"
                            min={0}
                            max={1}
                            step="0.01"
                            onChange={HandleChange2}
                            value={UpdateIntermediateData?.Percentage || ""}
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

                          {UpdateIntermediateData?.photo && (
                            <div className="mt-2">
                              <img
                                className="w-28 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                src={UpdateIntermediateData?.photo}
                                alt="Intermediate Marksheet"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // ------- Under Graduation -------

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
                            placeholder="Major subjects"
                            onChange={HandleChange3}
                            value={UpdateUnderGraduationData?.subjects || ""}
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
                            onChange={HandleChange3}
                            value={UpdateUnderGraduationData?.year || ""}
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
                            placeholder="Ex: Mumbai University"
                            onChange={HandleChange3}
                            value={UpdateUnderGraduationData?.university || ""}
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
                            onChange={HandleChange3}
                            value={UpdateUnderGraduationData?.result || ""}
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
                            id="UGCGPA"
                            name="CGPA"
                            placeholder="Ex: 9.00"
                            min={0}
                            max={10}
                            step="0.01"
                            onChange={HandleChange3}
                            value={UpdateUnderGraduationData?.CGPA || ""}
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Multiple Marksheets */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="AllUgPhoto" className={labelClass}>
                            Upload More Marksheets{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="AllUgPhoto"
                            name="AllUgPhoto"
                            type="file"
                            multiple
                            onChange={HandleUploadUGMultiplePhoto}
                            className={fileInputClass}
                          />

                          {UpdateUnderGraduationData?.AllUgPhoto?.length >
                            0 && (
                            <div className="w-full mt-2 grid grid-cols-3 gap-2">
                              {UpdateUnderGraduationData.AllUgPhoto.map(
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

                // ------- Post Graduation -------

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
                            placeholder="Major subjects"
                            onChange={HandleChange4}
                            value={UpdatePostGraduationData?.subjects || ""}
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
                            onChange={HandleChange4}
                            value={UpdatePostGraduationData?.year || ""}
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
                            placeholder="Ex: DU / MU"
                            onChange={HandleChange4}
                            value={UpdatePostGraduationData?.university || ""}
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
                            onChange={HandleChange4}
                            value={UpdatePostGraduationData?.result || ""}
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
                            id="PGCGPA"
                            name="CGPA"
                            placeholder="Ex: 9.20"
                            min={0}
                            max={10}
                            step="0.01"
                            onChange={HandleChange4}
                            value={UpdatePostGraduationData?.CGPA || ""}
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Multiple Marksheets */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="AllPgPhotos" className={labelClass}>
                            Upload More Marksheets{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="AllPgPhotos"
                            name="AllPgPhotos"
                            type="file"
                            multiple
                            onChange={HandleUploadPGMultiplePhoto}
                            className={fileInputClass}
                          />

                          {UpdatePostGraduationData?.AllPgPhoto?.length > 0 && (
                            <div className="w-full mt-2 grid grid-cols-3 gap-2">
                              {UpdatePostGraduationData.AllPgPhoto.map(
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

                // ------- Other -------

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
                            placeholder="Course / Program"
                            onChange={HandleChange5}
                            value={UpdateOtherData?.Course || ""}
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
                            placeholder="Major subjects"
                            onChange={HandleChange5}
                            value={UpdateOtherData?.Subjects || ""}
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
                            onChange={HandleChange5}
                            value={UpdateOtherData?.Year || ""}
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
                            placeholder="Ex: Any University"
                            onChange={HandleChange5}
                            value={UpdateOtherData?.University || ""}
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
                            onChange={HandleChange5}
                            value={UpdateOtherData?.Result || ""}
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
                            id="OtherPercentageOrCGPA"
                            name="PercentageOrCGPA"
                            placeholder="Ex: 75 / 8.5"
                            min={0}
                            max={1}
                            step="0.01"
                            onChange={HandleChange5}
                            value={UpdateOtherData?.PercentageOrCGPA || ""}
                            className={inputBaseClass}
                          />
                        </div>

                        {/* Multiple Marksheets */}
                        <div className={fieldWrapperClass}>
                          <label htmlFor="AllOtherPhoto" className={labelClass}>
                            Upload More Marksheets
                          </label>
                          <input
                            id="AllOtherPhoto"
                            name="photo"
                            type="file"
                            multiple
                            onChange={HandleUploadOtherMultiplePhoto}
                            className={fileInputClass}
                          />

                          {UpdateOtherData?.AllOtherPhoto?.length > 0 && (
                            <div className="w-full mt-2 grid grid-cols-3 gap-2">
                              {UpdateOtherData?.AllOtherPhoto.map(
                                (photoUrl, inx) => (
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
                                )
                              )}
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

export default UpdateAcademics;
