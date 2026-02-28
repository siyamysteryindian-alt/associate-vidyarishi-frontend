import React, { useCallback, useEffect, useRef, useState } from "react";
import ListOperations from "./ListOperations";
import CreateOperations from "./CreateOperations";
import { MdOutlineAdd } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminOperations = () => {
  const ReduxLoggedUser = useSelector((state) => state?.user);

  const [createOperationsOpen, setCreateOperationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [data, setData] = useState({
    list: [],
    currentPage: 1,
    totalPages: 0,
    limit: 6,
    totalDocs: 0,
    loading: false,
  });

  // debounce ref for search
  const searchTimer = useRef(null);

  const openCreate = () => setCreateOperationsOpen(true);
  const closeCreate = () => setCreateOperationsOpen(false);

  const fetchOperationalManagerByPagination = useCallback(
    async (page = 1, limit = data.limit, query = "") => {
      try {
        setData((prev) => ({ ...prev, loading: true }));
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/GetOperationalManagerByPagination`,
          {
            params: { page, limit, query },
            withCredentials: true,
          }
        );

        if (response?.data?.success) {
          const res = response.data.data || {};
          setData((prev) => ({
            ...prev,
            list: res.OperationManager || [],
            currentPage: res.currentPage || page,
            totalPages: res.totalPages || 0,
            limit: res.limit || limit,
            totalDocs: res.totalDocs || 0,
            loading: false,
          }));
        } else {
          toast.error(response?.data?.message || "Failed to fetch data");
          setData((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Fetch Operational Manager error:", error);
        toast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
        setData((prev) => ({ ...prev, loading: false }));
      }
    },
    [data.limit]
  );

  // initial fetch
  useEffect(() => {
    fetchOperationalManagerByPagination(data.currentPage, data.limit, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle page changes
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }
    if (pageNumber > data.totalPages && data.totalPages > 0) {
      toast.error(`Only ${data.totalPages} pages available.`);
      return;
    }
    setData((prev) => ({ ...prev, currentPage: pageNumber }));
    fetchOperationalManagerByPagination(pageNumber, data.limit, searchQuery);
  };

  // handle limit change
  const handleLimitChange = (event) => {
    const value = Number(event.target.value) || 6;
    setData((prev) => ({ ...prev, limit: value, currentPage: 1 }));
    fetchOperationalManagerByPagination(1, value, searchQuery);
  };

  // handle search with debounce
  const handleSearchInput = (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      // when search changes, reset to first page
      setData((prev) => ({ ...prev, currentPage: 1 }));
      fetchOperationalManagerByPagination(1, data.limit, q);
    }, 350);
  };

  // effect to refetch when currentPage or limit changes through other means
  useEffect(() => {
    // fetch when page or limit changes (if changed outside)
    // we guard against repeated calls by checking loading flag
    // but keep it lightweight: only re-run if not initial fetch
    // (Most updates call fetchOperationalManagerByPagination directly)
  }, [data.currentPage, data.limit]);

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
            Operation Manager
          </div>

          <div className="flex items-center  gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* create button */}
            {ReduxLoggedUser?.role !== "university-manager" && (
              <button
                onClick={openCreate}
                className="px-3 py-2 inline-flex items-center gap-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600"
                aria-label="Create operation"
              >
                <MdOutlineAdd size={18} />
                <span className="hidden sm:inline">Create</span>
              </button>
            )}
          </div>
        </div>

        {/* list area */}
        <section className="mt-3 px-1 md:px-1">
          <ListOperations
            OperationalManagerListData={data.list}
            OperationalManagerCurrentPage={data.currentPage}
            OperationalManagerTotalPages={data.totalPages}
            OperationalManagerLimit={data.limit}
            OperationalManagerLoading={data.loading}
            OperationalManagerTotalDocs={data.totalDocs}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            FetchOperationalManagerByPagination={
              fetchOperationalManagerByPagination
            }
          />
        </section>
      </section>

      {/* create modal */}
      {createOperationsOpen && (
        <CreateOperations
          FetchOperationalManagerByPagination={() =>
            fetchOperationalManagerByPagination(1, data.limit, searchQuery)
          }
          HandleCloseCreateOperations={closeCreate}
        />
      )}
    </>
  );
};

export default AdminOperations;
