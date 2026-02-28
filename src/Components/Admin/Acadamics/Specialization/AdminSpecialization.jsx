import React, { useEffect, useState } from "react";
import ListOfSpecialization from "./ListOfSpecialization";
import CreateSpecialization from "./CreateSpecialization";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AdminSpecialization = () => {
  const [CreateSpecializationComponent, setCreateSpecializationComponent] =
    useState(false);

  const HandleButonOpenCreateSpecialization = () => {
    setCreateSpecializationComponent(true);
  };

  const HandleButonCloseeCreateSpecialization = () => {
    setCreateSpecializationComponent(false);
  };

  // fetching Data
  const [SpecializationListData, setSpecializationListData] = useState([]);
  const [SpecializationCurrentPage, setSpecializationCurrentPage] = useState(1);
  const [SpecializationTotalPages, setSpecializationTotalPages] = useState(0);
  const [SpecializationLimit, setSpecializationLimit] = useState(10);
  const [SpecializationLoading, setSpecializationLoading] = useState(false);
  const [SpecializationTotalDocs, setSpecializationTotalDocs] = useState(0);

  const UniversityGetDataFromRedux = useSelector((state) => state?.university);

  const FetchSpecializationByPagination = async (
    page,
    limit,
    searchQuery = ""
  ) => {
    try {
      setSpecializationLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetSpecializationByPagination`,
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
        setSpecializationListData(response?.data?.data?.Specialization);
        setSpecializationCurrentPage(response?.data?.data?.currentPage);
        setSpecializationTotalPages(response?.data?.data?.totalPages);
        setSpecializationLimit(response?.data?.data?.limit);
        setSpecializationTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSpecializationLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > SpecializationTotalPages) {
      toast.error(`Only Pages ${SpecializationTotalPages} Available`);
    } else {
      setSpecializationCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    FetchSpecializationByPagination(
      SpecializationCurrentPage,
      SpecializationLimit
    );
  }, [
    SpecializationCurrentPage,
    SpecializationLimit,
    UniversityGetDataFromRedux?.id,
  ]);

  const handleLimitChange = (event) => {
    setSpecializationLimit(parseInt(event.target.value));
    setSpecializationCurrentPage(1); // Reset to first page when limit changes
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
            Stream{" "}
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
              onClick={HandleButonOpenCreateSpecialization}
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

        <section>
          <ListOfSpecialization
            SpecializationListData={SpecializationListData}
            SpecializationCurrentPage={SpecializationCurrentPage}
            SpecializationTotalPages={SpecializationTotalPages}
            SpecializationLimit={SpecializationLimit}
            SpecializationLoading={SpecializationLoading}
            SpecializationTotalDocs={SpecializationTotalDocs}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            FetchSpecializationByPagination={FetchSpecializationByPagination}
          />
        </section>
      </section>
      {CreateSpecializationComponent && (
        <CreateSpecialization
          FetchSpecializationByPagination={FetchSpecializationByPagination}
          CloseeCreateSpecialization={HandleButonCloseeCreateSpecialization}
        />
      )}
    </>
  );
};

export default AdminSpecialization;
