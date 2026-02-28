import React, { useEffect, useState } from "react";
import ListOfPrograms from "./ListOfPrograms";
import CreatePrograms from "./CreatePrograms";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AdminPrograms = () => {
  const [CreateProgramComponent, setCreateProgramComponent] = useState(false);

  const HandleOpenButtonCreateProgram = () => {
    setCreateProgramComponent(true);
  };

  const HandleCloseButtonCreateProgram = () => {
    setCreateProgramComponent(false);
  };

  // fetching Data
  const [ProgramListData, setProgramListData] = useState([]);
  const [ProgramCurrentPage, setProgramCurrentPage] = useState(1);
  const [ProgramTotalPages, setProgramTotalPages] = useState(0);
  const [ProgramLimit, setProgramLimit] = useState(6);
  const [ProgramLoading, setProgramLoading] = useState(false);
  const [ProgramTotalDocs, setProgramTotalDocs] = useState(0);

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const FetchProgramByPagination = async (page, limit, searchQuery = "") => {
    try {
      setProgramLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetProgramByPagination`,
        {
          params: {
            page,
            limit,
            query: searchQuery,
            university: UniversityGetDataFromRedux?.id,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setProgramListData(response?.data?.data?.programs);
        setProgramCurrentPage(response?.data?.data?.currentPage);
        setProgramTotalPages(response?.data?.data?.totalPages);
        setProgramLimit(response?.data?.data?.limit);
        setProgramTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setTimeout(() => {
        setProgramLoading(false);
      }, 300);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > ProgramTotalPages) {
      toast.error(`Only Pages ${ProgramTotalPages} Available`);
    } else {
      setProgramCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    FetchProgramByPagination(ProgramCurrentPage, ProgramLimit);
  }, [ProgramCurrentPage, ProgramLimit, UniversityGetDataFromRedux?.id]);

  const handleLimitChange = (event) => {
    setProgramLimit(parseInt(event.target.value));
    setProgramCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <>
      <section
        className="mt-2 mx-2 rounded-lg"
        style={{ background: "var(--color-bg)" }}
      >
        <div
          className="w-full h-16 flex items-center justify-between px-6 rounded-lg"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--soft-shadow)",
            borderRadius: "var(--card-radius)",
          }}
        >
          <div
            className="text-base font-bold"
            style={{ color: "var(--brand-ink)" }}
          >
            Course
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-full text-sm font-semibold transition-transform"
              style={{
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.06)",
                color: "var(--brand-ink)",
              }}
              onClick={() => {
                // placeholder for export download implementation
                toast("Download triggered (implement export).");
              }}
            >
              Download
            </button>

            <button
              type="button"
              onClick={HandleOpenButtonCreateProgram}
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "var(--accent-mint)",
                color: "var(--brand-ink)",
                boxShadow: "var(--soft-shadow)",
              }}
            >
              Create
            </button>
          </div>
        </div>

        {/* List section */}
        <section>
          <ListOfPrograms
            ProgramListData={ProgramListData}
            ProgramCurrentPage={ProgramCurrentPage}
            ProgramTotalPages={ProgramTotalPages}
            ProgramLimit={ProgramLimit}
            ProgramLoading={ProgramLoading}
            ProgramTotalDocs={ProgramTotalDocs}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            FetchProgramByPagination={FetchProgramByPagination}
          />
        </section>
      </section>

      {/* Create Program Modal */}
      {CreateProgramComponent && (
        <CreatePrograms
          FetchProgramByPagination={FetchProgramByPagination}
          CloseButtonCreateProgram={HandleCloseButtonCreateProgram}
        />
      )}
    </>
  );
};

export default AdminPrograms;
