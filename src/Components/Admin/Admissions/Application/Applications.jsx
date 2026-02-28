import React, { useEffect, useState } from "react";
import { HiCloudUpload, HiOutlineDocumentDownload } from "react-icons/hi";
import { MdDownload } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import ListOfApplications from "./ListOfApplications";
import UseGetAllStudents from "../../../../CustomHooks/UseGetStudentsPagination";
import DownloadDocuments from "./DownloadDocuments";
import UploadExcel from "./UploadExcel";
import { useSelector } from "react-redux";
// 👉 make sure you have this installed:  npm i file-saver
import { saveAs } from "file-saver";

const Applications = () => {
  const [OpenDocumentDownloadOption, setOpenDocumentDownloadOption] =
    useState(false);

  const GetDataFromRedux = useSelector((state) => state?.user);
  const UniversityGetDataFromRedux = useSelector((state) => state?.university);

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
    FetchAllStudentByPagination(1, 100000, "", "", "");
  }, []);

  const HandleOpenDocumentDownloadOpen = () => {
    setOpenDocumentDownloadOption(true);
  };
  const HandleOpenDocumentDownloadClose = () => {
    setOpenDocumentDownloadOption(false);
  };

  const [UploadExcelOption, setUploadExcelOption] = useState(false);

  const HandleUploadExcelOptionOpen = () => {
    setUploadExcelOption(true);
  };
  const HandleUploadExcelOptionClose = () => {
    setUploadExcelOption(false);
  };

  const HandleAddNewStudent = () => {
    window.open("/admin/new-application", "_blank", "noopener,noreferrer");
  };

  const HandleDownloadStudentExcel = async () => {
    await FetchAllStudentByPagination();

    const FilteredData = AllStudentListData?.filter(
      (data) =>
        !data?.isDeleted &&
        data?.university?._id === UniversityGetDataFromRedux?.id
    );

    const csvHeaders = [
      "Sr No",
      "Application Number",
      "Enrollment Number",
      "Online Application Number",
      "Student Name",
      "Gender",
      "DOB",
      "Category",
      "Religion",
      "Aadhar Number",
      "Nationality",
      "Student Email",
      "Student Contact Number",
      "University",
      "Admission Session",
      "Course",
      "Sub Course",
      "Center",
    ];

    const csvRows = FilteredData?.map((data, i) => [
      i + 1,
      data?.applicationNumber || "",
      data?.EnrollmentNo || "Not Alloted",
      data?.OANumber || "Not Alloted",
      data?.fullName || "",
      data?.gender || "",
      data?.dateOfBirth || "",
      data?.category || "",
      data?.religion || "",
      data?.aadharNo || "",
      data?.nationality || "",
      data?.personalDetails?.email || "",
      data?.personalDetails?.phone || "",
      data?.university?.name || "",
      data?.admissionSession?.name || "",
      data?.Course?.name || "",
      data?.SubCourse?.name || "",
      data?.center?.name || "",
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "vidyarishi_student_data.csv");
  };

  return (
    <>
      {/* Page wrapper (same structure as AdminDepartments / Programs) */}
      <section className="top-0 dark:bg-slate-900 py-2  m-2 rounded-2xl">
        {/* Header card */}
        <div
          className="px-6 sm:px-8 w-full h-16 flex items-center justify-between rounded-2xl"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--soft-shadow)",
          }}
        >
          <div className="flex flex-col justify-center">
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: "var(--brand-ink)" }}
            >
              Applications
            </span>
            <span className="text-xs mt-0.5 text-slate-500">
              {GetDataFromRedux?.name
                ? `${GetDataFromRedux?.name} • ${
                    GetDataFromRedux?.role || "User"
                  }`
                : "Student applications overview"}
            </span>
          </div>

          <div className="flex flex-row gap-2 sm:gap-3 items-center">
            {/* Admin-only actions */}
            {GetDataFromRedux?.role === "Admin" && (
              <div className="flex flex-row gap-2 sm:gap-3 items-center">
                <button
                  title="Download Documents"
                  onClick={HandleOpenDocumentDownloadOpen}
                  className="inline-flex items-center justify-center rounded-full border bg-white text-slate-800 text-xs sm:text-sm px-2.5 py-1.5 shadow-sm hover:bg-slate-50 transition"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <HiOutlineDocumentDownload size={16} />
                  <span className="hidden sm:inline ml-1">Docs</span>
                </button>

                <button
                  title="Upload Excel"
                  onClick={HandleUploadExcelOptionOpen}
                  className="inline-flex items-center justify-center rounded-full border bg-white text-slate-800 text-xs sm:text-sm px-2.5 py-1.5 shadow-sm hover:bg-slate-50 transition"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <HiCloudUpload size={16} />
                  <span className="hidden sm:inline ml-1">Upload</span>
                </button>

                <button
                  onClick={HandleDownloadStudentExcel}
                  title="Download Excel"
                  className="inline-flex items-center justify-center rounded-full border bg-white text-slate-800 text-xs sm:text-sm px-2.5 py-1.5 shadow-sm hover:bg-slate-50 transition"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <MdDownload size={16} />
                  <span className="hidden sm:inline ml-1">Excel</span>
                </button>
              </div>
            )}

            {/* Add student button */}
            <button
              title="Add Student"
              onClick={HandleAddNewStudent}
              className="inline-flex items-center justify-center rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 font-medium shadow-sm transition"
              style={{
                background: "var(--accent-mint)",
                color: "var(--brand-ink)",
              }}
            >
              <TiUserAdd size={16} />
              <span className="hidden sm:inline ml-1">New</span>
            </button>
          </div>
        </div>

        {/* List section (kept as-is, just inside same page wrapper) */}
        <section className="mt-2">
          <ListOfApplications
            FetchAllStudentByPagination={FetchAllStudentByPagination}
            AllStudentListData={AllStudentListData}
            AllStudentCurrentPage={AllStudentCurrentPage}
            AllStudentTotalPages={AllStudentTotalPages}
            AllStudentLimit={AllStudentLimit}
            AllStudentLoading={AllStudentLoading}
            AllStudentTotalDocs={AllStudentTotalDocs}
            handlePageChange={handlePageChange}
          />
        </section>
      </section>

      {OpenDocumentDownloadOption && (
        <DownloadDocuments
          HandleOpenDocumentDownloadClose={HandleOpenDocumentDownloadClose}
        />
      )}

      {UploadExcelOption && (
        <UploadExcel
          HandleUploadExcelOptionClose={HandleUploadExcelOptionClose}
        />
      )}
    </>
  );
};

export default Applications;
