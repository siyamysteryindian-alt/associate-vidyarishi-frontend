import React, { useEffect, useState } from "react";
import ListOfUniversities from "./ListOfUniversities";
import CreateUniversity from "./CreateUniversity";
import useGetUniversity from "../../../../CustomHooks/UseGetUniversities";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AdminUniversity = () => {
  const { GetUniversity, loading, error, universities } = useGetUniversity();

  const [UniversityCreate, setUniversityCreate] = useState(false);
  const OncloseUniversityCreate = () => setUniversityCreate(false);
  const HandleClickCreateUniversity = () => setUniversityCreate(true);

  useEffect(() => {
    GetUniversity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pagination & list state (kept same names)
  const [UniversityListData, setUniversityListData] = useState([]);
  const [UniversityCurrentPage, setUniversityCurrentPage] = useState(1);
  const [UniversityTotalPages, setUniversityTotalPages] = useState(0);
  const [UniversityLimit, setUniversityLimit] = useState(6);
  const [UniversityLoading, setUniversityLoading] = useState(false);
  const [UniversityTotalDocs, setUniversityTotalDocs] = useState(0);

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const FetchUniversitiesByPagination = async (
    page,
    limit,
    searchQuery = ""
  ) => {
    try {
      setUniversityLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetUniversitiesByPagination`,
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
        setUniversityListData(response?.data?.data?.University || []);
        setUniversityCurrentPage(response?.data?.data?.currentPage || 1);
        setUniversityTotalPages(response?.data?.data?.totalPages || 0);
        setUniversityLimit(response?.data?.data?.limit || limit);
        setUniversityTotalDocs(response?.data?.data?.totalDocs || 0);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setUniversityLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }
    if (pageNumber > UniversityTotalPages) {
      toast.error(`Only Pages ${UniversityTotalPages} Available`);
      return;
    }
    setUniversityCurrentPage(pageNumber);
  };

  useEffect(() => {
    FetchUniversitiesByPagination(UniversityCurrentPage, UniversityLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UniversityCurrentPage, UniversityLimit]);

  const handleLimitChange = (event) => {
    setUniversityLimit(parseInt(event.target.value || 0, 10));
    setUniversityCurrentPage(1);
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
            Universities
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
              onClick={HandleClickCreateUniversity}
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

        <div className="">
          <ListOfUniversities
            UniversityListData={UniversityListData}
            UniversityCurrentPage={UniversityCurrentPage}
            UniversityTotalPages={UniversityTotalPages}
            UniversityLimit={UniversityLimit}
            UniversityLoading={UniversityLoading}
            UniversityTotalDocs={UniversityTotalDocs}
            FetchUniversitiesByPagination={FetchUniversitiesByPagination}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
          />
        </div>
      </section>

      {UniversityCreate && (
        <CreateUniversity
          OncloseUniversityCreate={OncloseUniversityCreate}
          FetchUniversitiesByPagination={FetchUniversitiesByPagination}
        />
      )}
    </>
  );
};

export default AdminUniversity;
