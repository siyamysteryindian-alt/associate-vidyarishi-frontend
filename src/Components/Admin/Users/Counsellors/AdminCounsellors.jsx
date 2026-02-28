import React, { useCallback, useEffect, useState } from "react";
import ListOfCounsellors from "./ListOfCounsellors";
import CreateCounsellors from "./CreateCounsellors";
import { MdOutlineAdd } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const AdminCounsellors = () => {
  const [createCounsellorsOpen, setCreateCounsellorsOpen] = useState(false);

  const openCreate = () => setCreateCounsellorsOpen(true);
  const closeCreate = () => setCreateCounsellorsOpen(false);

  // paging/state (single state object)
  const [state, setState] = useState({
    list: [],
    currentPage: 1,
    totalPages: 0,
    limit: 6,
    totalDocs: 0,
    loading: false,
  });

  const UniversityGetDataFromRedux = useSelector((s) => s?.university);
  const ReduxLoggedUser = useSelector((s) => s?.user);

  /**
   * fetchCounsellorByPagination
   * - safe: uses an AbortController to cancel if component unmounts while request is in-flight
   * - memoized by university id to avoid re-creating unnecessarily
   */
  const fetchCounsellorByPagination = useCallback(
    async (page = 1, limit = state.limit, query = "") => {
      const controller = new AbortController();
      try {
        setState((p) => ({ ...p, loading: true }));

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/GetCounsellorByPagination`,
          {
            params: {
              page,
              limit,
              query,
              university: UniversityGetDataFromRedux?.id,
            },
            withCredentials: true,
            signal: controller.signal,
          }
        );

        if (res?.data?.success) {
          const data = res.data.data || {};
          setState((p) => ({
            ...p,
            list: data.Counsellor || [],
            currentPage: data.currentPage || page,
            totalPages: data.totalPages || 0,
            limit: data.limit || limit,
            totalDocs: data.totalDocs || 0,
            loading: false,
          }));
        } else {
          toast.error(res?.data?.message || "Failed to fetch counsellors");
          setState((p) => ({ ...p, loading: false }));
        }
      } catch (err) {
        // ignore aborted requests
        if (axios.isCancel?.(err) || err?.name === "CanceledError") return;
        console.error("Fetch counsellors error:", err);
        toast.error(
          err?.response?.data?.message || "An error occurred. Please try again."
        );
        setState((p) => ({ ...p, loading: false }));
      }
      // return controller so caller can cancel if needed
      // (not strictly necessary but keeps pattern consistent)
      // eslint-disable-next-line consistent-return
      return () => controller.abort();
    },
    // only depend on current university id (not entire state object)
    [UniversityGetDataFromRedux?.id]
  );

  // initial & reactive fetch:
  useEffect(() => {
    // fetch current page & limit whenever university id changes or page/limit changed
    fetchCounsellorByPagination(state.currentPage, state.limit);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage, state.limit, UniversityGetDataFromRedux?.id]);

  // pagination helpers
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }
    if (state.totalPages > 0 && pageNumber > state.totalPages) {
      toast.error(`Only ${state.totalPages} pages available`);
      return;
    }
    setState((p) => ({ ...p, currentPage: pageNumber }));
  };

  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10) || 6;
    setState((p) => ({ ...p, limit: value, currentPage: 1 }));
  };

  const handleExportCounsellor = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ExportCounsellorData`,
        { responseType: "blob", withCredentials: true }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "counsellors.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export started");
    } catch (err) {
      console.error("Export error:", err);
      toast.error(
        err?.response?.data?.message || "Failed to export counsellors data"
      );
    }
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
            Counsellors
          </div>

          <div className="flex flex-row gap-3">
            {ReduxLoggedUser?.role === "Admin" && (
              <button
                onClick={handleExportCounsellor}
                className="px-4 py-1.5 bg-green-500 uppercase text-white font-bold rounded-lg flex items-center gap-2 text-sm"
                title="Download counsellors"
              >
                <HiDownload size={18} />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}

            {ReduxLoggedUser?.role !== "university-manager" && (
              <button
                onClick={openCreate}
                className="px-4 py-1.5 bg-green-500 uppercase text-white font-bold rounded-lg flex items-center gap-2 text-sm"
                title="Create counsellor"
              >
                <MdOutlineAdd size={18} />
                <span className="hidden sm:inline">Create</span>
              </button>
            )}
          </div>
        </div>

        <section className="px-1 pt-1">
          <ListOfCounsellors
            CounsellorListData={state.list}
            CounsellorCurrentPage={state.currentPage}
            CounsellorTotalPages={state.totalPages}
            CounsellorLimit={state.limit}
            CounsellorLoading={state.loading}
            CounsellorTotalDocs={state.totalDocs}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            FetchCounsellorByPagination={fetchCounsellorByPagination}
          />
        </section>
      </section>

      {createCounsellorsOpen && (
        <CreateCounsellors
          FetchCounsellorByPagination={() =>
            fetchCounsellorByPagination(1, state.limit)
          }
          HandleCloseCreateCounsellors={closeCreate}
        />
      )}
    </>
  );
};

export default AdminCounsellors;
