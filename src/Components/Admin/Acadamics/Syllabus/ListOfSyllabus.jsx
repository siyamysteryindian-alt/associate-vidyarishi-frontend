import React, { useMemo, useState } from "react";
import { BiSolidDownload } from "react-icons/bi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import UploadSemister from "./UploadSemister";
import DownloadSyllabus from "./DownloadSyllabus";
import Loader from "../../../../Helper/Loader";
import { useSelector } from "react-redux";

const ListOfSyllabus = ({
  SpecializationListData = [],
  SpecializationLoading = false,
  SpecializationCurrentPage = 1,
  SpecializationTotalPages = 1,
  SpecializationTotalDocs = 0,
  handlePageChange = () => {},
}) => {
  const [OpenUploadWindow, setOpenUploadWindow] = useState(false);
  const [OpenDownloadWindow, setOpenDownloadWindow] = useState(false);
  const [QuerySearch, setQuerySearch] = useState("");

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const HandleUploadButtonOpen = () => {
    setOpenUploadWindow(true);
    setOpenDownloadWindow(false);
  };

  const HandleUploadButtonClose = () => {
    setOpenUploadWindow(false);
    setOpenDownloadWindow(false);
  };

  const HandleDownloadButtonOpen = () => {
    setOpenDownloadWindow(true);
    setOpenUploadWindow(false);
  };

  const HandleDownloadButtonClose = () => {
    setOpenDownloadWindow(false);
    setOpenUploadWindow(false);
  };

  // 🔍 Filter by university + search
  const filteredStreams = useMemo(() => {
    const list =
      SpecializationListData?.filter(
        (s) =>
          s?.university?._id === UniversityGetDataFromRedux?.id && !s?.isDeleted
      ) || [];

    if (!QuerySearch.trim()) return list;

    const q = QuerySearch.toLowerCase();
    return list.filter((s) => {
      const name = `${s?.name || ""} ${s?.shortName || ""}`.toLowerCase();
      const program = `${s?.Program?.name || ""} ${
        s?.Program?.shortName || ""
      }`.toLowerCase();
      const mode = s?.mode?.name?.toLowerCase() || "";
      const uni = s?.university?.name?.toLowerCase() || "";
      return (
        name.includes(q) ||
        program.includes(q) ||
        mode.includes(q) ||
        uni.includes(q)
      );
    });
  }, [SpecializationListData, UniversityGetDataFromRedux?.id, QuerySearch]);

  return (
    <>
      <section className="px-1 sm:py-4">
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--soft-shadow)",
            borderRadius: "18px",
          }}
        >
          {/* Top controls: Search + helper text */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-4">
            <div className="flex-1 w-full">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={QuerySearch}
                  onChange={(e) => setQuerySearch(e.target.value)}
                  placeholder="Search stream / program / university..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border text-sm bg-white"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span style={{ color: "var(--muted)" }}>
                Upload / download semester-wise syllabus for each stream.
              </span>
            </div>
          </div>

          {/* Table area */}
          <div className="px-4 pb-4">
            <div className="h-[calc(100vh-250px)] min-h-[175px] overflow-auto">
              {SpecializationLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader />
                </div>
              ) : filteredStreams.length ? (
                <table
                  className="min-w-full text-sm table-fixed"
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 8px",
                  }}
                >
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      {[
                        "Stream",
                        "Program",
                        "Type",
                        "Scheme",
                        "Mode",
                        "University",
                        "Upload",
                        "Download",
                      ].map((head) => (
                        <th
                          key={head}
                          className="px-4 py-2 text-left font-medium"
                          style={{
                            color: "var(--brand-ink)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStreams.map((item) => (
                      <tr
                        key={item?._id}
                        className="align-middle"
                        style={{
                          background: "var(--surface)",
                          boxShadow: "0 4px 12px rgba(16,24,40,0.03)",
                          borderRadius: 12,
                        }}
                      >
                        {/* Stream */}
                        <td className="px-4 py-3">
                          <div
                            className="font-semibold truncate"
                            style={{ color: "var(--brand-ink)" }}
                          >
                            {item?.name}{" "}
                            {item?.shortName && (
                              <span className="text-xs text-slate-500">
                                ({item?.shortName})
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Program */}
                        <td className="px-4 py-3">
                          <div className="truncate text-xs sm:text-sm text-slate-700">
                            {item?.Program?.name}{" "}
                            {item?.Program?.shortName && (
                              <span className="text-xs text-slate-500">
                                ({item?.Program?.shortName})
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3">
                          <div className="truncate text-xs sm:text-sm text-slate-700 uppercase">
                            {item?.Program?.programType?.name || "-"}
                          </div>
                        </td>

                        {/* Scheme */}
                        <td className="px-4 py-3">
                          <div className="truncate text-xs sm:text-sm text-slate-700">
                            {item?.scheme?.name || "-"}
                          </div>
                        </td>

                        {/* Mode */}
                        <td className="px-4 py-3">
                          <div className="truncate text-xs sm:text-sm text-slate-700">
                            {item?.mode?.name || "-"}
                          </div>
                        </td>

                        {/* University */}
                        <td className="px-4 py-3">
                          <div className="truncate text-xs sm:text-sm text-slate-700">
                            {item?.university?.name || "-"}
                          </div>
                        </td>

                        {/* Upload */}
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={HandleUploadButtonOpen}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
                            style={{
                              background: "rgba(79,70,229,0.06)",
                              color: "var(--brand-ink)",
                              border: "1px solid rgba(79,70,229,0.18)",
                            }}
                          >
                            <FaCloudUploadAlt size={16} />
                            <span className="hidden sm:inline">Upload</span>
                          </button>
                        </td>

                        {/* Download */}
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={HandleDownloadButtonOpen}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
                            style={{
                              background: "rgba(16,185,129,0.06)",
                              color: "var(--brand-ink)",
                              border: "1px solid rgba(16,185,129,0.18)",
                            }}
                          >
                            <BiSolidDownload size={16} />
                            <span className="hidden sm:inline">Download</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div
                  className="flex items-center justify-center h-60 text-center px-4"
                  style={{ color: "var(--muted)" }}
                >
                  <div>
                    <div className="text-sm font-semibold mb-1">
                      No streams found for this university
                    </div>
                    <div className="text-xs">
                      Create streams (specializations) first, then you can
                      upload / download syllabus here.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination (controlled from parent, same pattern as other lists) */}
            <nav
              className="flex text-sm flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 mt-2 px-1"
              aria-label="Table navigation"
            >
              <span
                className="font-normal flex gap-1 flex-row"
                style={{ color: "var(--muted)" }}
              >
                Showing
                <span
                  className="font-semibold"
                  style={{ color: "var(--brand-ink)" }}
                >
                  {filteredStreams.length}
                </span>
                of
                <span
                  className="font-semibold"
                  style={{ color: "var(--brand-ink)" }}
                >
                  {SpecializationTotalDocs || SpecializationListData.length}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px text-xs">
                <li>
                  <button
                    onClick={() =>
                      handlePageChange(SpecializationCurrentPage - 1)
                    }
                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <IoChevronBack />
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center py-1.5 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                    {SpecializationCurrentPage + "-" + SpecializationTotalPages}
                  </div>
                </li>
                <li>
                  <button
                    onClick={() =>
                      handlePageChange(SpecializationCurrentPage + 1)
                    }
                    className="flex items-center justify-center h-full py-1.5 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <IoChevronForwardOutline />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {/* Upload Modal */}
      {OpenUploadWindow && (
        <section>
          <UploadSemister HandleUploadButtonClose={HandleUploadButtonClose} />
        </section>
      )}

      {/* Download Modal */}
      {OpenDownloadWindow && (
        <section>
          <DownloadSyllabus
            HandleUploadButtonOpen={HandleUploadButtonOpen}
            HandleDownloadButtonClose={HandleDownloadButtonClose}
          />
        </section>
      )}
    </>
  );
};

export default ListOfSyllabus;
