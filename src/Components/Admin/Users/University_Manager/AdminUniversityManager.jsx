import React, { useEffect, useState, useCallback } from "react";
import ListUniversityManager from "./ListUniversityManager";
import CreateUniversityManager from "./CreateUniversityManager";
import { MdOutlineAdd } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminUniversityManager = () => {
  const [CreateUniButton, setCreateUniButton] = useState(false);

  const ReduxLoggedUser = useSelector((state) => state?.user);

  const HandleOpenCreateUniversityManager = () => {
    setCreateUniButton(true);
  };
  const HandleCloseCreateUniversityManager = () => {
    setCreateUniButton(false);
  };

  // fetching Data
  const [UniversityManagerListData, setUniversityManagerListData] = useState(
    []
  );
  const [UniversityManagerCurrentPage, setUniversityManagerCurrentPage] =
    useState(1);
  const [UniversityManagerTotalPages, setUniversityManagerTotalPages] =
    useState(0);
  const [UniversityManagerLimit, setUniversityManagerLimit] = useState(6);
  const [UniversityManagerLoading, setUniversityManagerLoading] =
    useState(false);
  const [UniversityManagerTotalDocs, setUniversityManagerTotalDocs] =
    useState(0);
  const [UniversityManagerError, setUniversityManagerError] = useState(null);

  // fetch function (useCallback so dependencies are stable)
  const FetchUniversityManagerByPagination = useCallback(
    async (page = 1, limit = UniversityManagerLimit, searchQuery = "") => {
      let isMounted = true;
      setUniversityManagerLoading(true);
      setUniversityManagerError(null);

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/GetUniversityManagerByPagination`,
          {
            params: {
              page,
              limit,
              query: searchQuery,
            },
            withCredentials: true,
          }
        );

        if (!isMounted) return;

        if (response?.data?.success) {
          const payload = response.data.data || {};
          setUniversityManagerListData(payload.UniversityManager || []);
          setUniversityManagerCurrentPage(payload.currentPage || page);
          setUniversityManagerTotalPages(payload.totalPages || 0);
          setUniversityManagerLimit(payload.limit || limit);
          setUniversityManagerTotalDocs(payload.totalDocs || 0);
        } else {
          setUniversityManagerError(
            response?.data?.message || "Failed to load"
          );
          toast.error(
            response?.data?.message || "Failed to load university managers"
          );
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          // request cancelled, ignore
        } else {
          console.error("FetchUniversityManagerByPagination error:", error);
          const message =
            error?.response?.data?.message ||
            "An error occurred. Please try again.";
          setUniversityManagerError(message);
          toast.error(message);
        }
      } finally {
        if (isMounted) setUniversityManagerLoading(false);
      }

      return () => {
        isMounted = false;
      };
    },
    [UniversityManagerLimit]
  );

  // page change handler
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (
      UniversityManagerTotalPages &&
      pageNumber > UniversityManagerTotalPages
    ) {
      toast.error(`Only Pages ${UniversityManagerTotalPages} Available`);
      return;
    }
    setUniversityManagerCurrentPage(pageNumber);
  };

  // effect: fetch when page or limit changes
  useEffect(() => {
    // fetch with the current page & limit
    FetchUniversityManagerByPagination(
      UniversityManagerCurrentPage,
      UniversityManagerLimit
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UniversityManagerCurrentPage, UniversityManagerLimit]);

  // limit change - reset to page 1
  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10) || 6;
    setUniversityManagerLimit(newLimit);
    setUniversityManagerCurrentPage(1);
  };

  return (
    <>
      <section
        className="mt-2 mx-2 rounded-lg"
        style={{ background: "var(--color-bg)" }}
      >
        {/* Top header bar */}
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
            University Manager
          </div>

          <div className="flex flex-row gap-6">
            {/* <button className="px-6 py-2 bg-green-300 rounded-lg">
              Download
            </button> */}

            {ReduxLoggedUser?.role !== "university-manager" && (
              <button
                className="px-4 py-1.5 dark:text-black bg-green-500 tracking-wide uppercase text-white font-bold rounded-lg flex justify-center items-center gap-x-1 text-sm"
                onClick={HandleOpenCreateUniversityManager}
              >
                Create <MdOutlineAdd size={20} />
              </button>
            )}
          </div>
        </div>

        <section className="px-1 pt-1">
          <ListUniversityManager
            UniversityManagerListData={UniversityManagerListData}
            UniversityManagerCurrentPage={UniversityManagerCurrentPage}
            UniversityManagerTotalPages={UniversityManagerTotalPages}
            UniversityManagerLimit={UniversityManagerLimit}
            UniversityManagerLoading={UniversityManagerLoading}
            UniversityManagerTotalDocs={UniversityManagerTotalDocs}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            FetchUniversityManagerByPagination={
              FetchUniversityManagerByPagination
            }
            UniversityManagerError={UniversityManagerError}
          />
        </section>
      </section>

      {CreateUniButton && (
        <CreateUniversityManager
          FetchUniversityManagerByPagination={
            FetchUniversityManagerByPagination
          }
          HandleCloseCreateUniversityManager={
            HandleCloseCreateUniversityManager
          }
        />
      )}
    </>
  );
};

export default AdminUniversityManager;
