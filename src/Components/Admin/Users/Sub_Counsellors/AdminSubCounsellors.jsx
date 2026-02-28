import React, { useCallback, useEffect, useState } from "react";
import ListOfSubCounsellors from "./ListOfSubCounsellors";
import CreateSubCounsellors from "./CreateSubCounsellors";
import { HiDownload } from "react-icons/hi";
import { MdOutlineAdd } from "react-icons/md";
import axios from "axios";
import { toast } from "react-hot-toast";
import useGetCounsellor from "../../../../CustomHooks/UseGetCounsellor";
import { useSelector } from "react-redux";

const AdminSubCounsellors = () => {
  // modal
  const [createOpen, setCreateOpen] = useState(false);
  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);

  // global hooks / redux
  const ReduxLoggedUser = useSelector((s) => s?.user);
  const UniversityGetDataFromRedux = useSelector((s) => s?.university);

  // optional: your custom hook returns managers (kept to pass into create modal)
  const {
    GetCounsellorManager,
    CounsellorManagerLoading,
    CounsellorManagerError,
    CounsellorManager,
  } = useGetCounsellor();

  useEffect(() => {
    GetCounsellorManager();
  }, []);

  // consolidated state for list/pagination
  const [state, setState] = useState({
    list: [],
    currentPage: 1,
    totalPages: 0,
    limit: 6,
    totalDocs: 0,
    loading: false,
  });

  const fetchSubCounsellorByPagination = useCallback(
    async (page = 1, limit = state.limit, query = "") => {
      try {
        setState((p) => ({ ...p, loading: true }));
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/GetSubCounsellorByPagination`,
          {
            params: {
              page,
              limit,
              query,
              university: UniversityGetDataFromRedux?.id,
            },
            withCredentials: true,
          }
        );

        if (res?.data?.success) {
          const d = res.data.data || {};
          setState((p) => ({
            ...p,
            list: d.subcounsellor || [],
            currentPage: d.currentPage || page,
            totalPages: d.totalPages || 0,
            limit: d.limit || limit,
            totalDocs: d.totalDocs || 0,
            loading: false,
          }));
        } else {
          toast.error(res?.data?.message || "Failed to fetch sub-counsellors");
          setState((p) => ({ ...p, loading: false }));
        }
      } catch (err) {
        console.error("Fetch SubCounsellor error:", err);
        toast.error(
          err?.response?.data?.message || "An error occurred. Please try again."
        );
        setState((p) => ({ ...p, loading: false }));
      }
    },
    [UniversityGetDataFromRedux?.id, state.limit]
  );

  // initial & dependent fetches
  useEffect(() => {
    fetchSubCounsellorByPagination(state.currentPage, state.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage, state.limit, UniversityGetDataFromRedux?.id]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }
    if (pageNumber > state.totalPages && state.totalPages > 0) {
      toast.error(`Only ${state.totalPages} pages available`);
      return;
    }
    setState((p) => ({ ...p, currentPage: pageNumber }));
  };

  const handleLimitChange = (e) => {
    const v = parseInt(e.target.value, 10) || 6;
    setState((p) => ({ ...p, limit: v, currentPage: 1 }));
  };

  const handleExportSubCounsellor = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ExportSubCounsellorData`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "subcounsellors.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export started");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error(
        err?.response?.data?.message || "Failed to export sub-counsellor data"
      );
    }
  };

  return (
    <>
      <section
        className="mt-2 mx-2 rounded-lg"
        style={{ background: "var(--color-bg)" }}
      >
        {/* Header */}
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
            Sub Counsellors
          </div>

          <div className="flex flex-row gap-3">
            {ReduxLoggedUser?.role === "Admin" && (
              <button
                onClick={handleExportSubCounsellor}
                className="px-4 py-1.5 bg-green-500 uppercase text-white font-bold rounded-lg flex items-center gap-2 text-sm"
                title="Download sub-counsellors"
              >
                <HiDownload size={18} />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}

            {ReduxLoggedUser?.role !== "university-manager" && (
              <button
                onClick={openCreate}
                className="px-4 py-1.5 bg-green-500 uppercase text-white font-bold rounded-lg flex items-center gap-2 text-sm"
                title="Create sub-counsellor"
              >
                <MdOutlineAdd size={18} />
                <span className="hidden sm:inline">Create</span>
              </button>
            )}
          </div>
        </div>

        {/* List component */}
        <section>
          <ListOfSubCounsellors
            SubCounsellorListData={state.list}
            SubCounsellorCurrentPage={state.currentPage}
            SubCounsellorTotalPages={state.totalPages}
            SubCounsellorLimit={state.limit}
            SubCounsellorLoading={state.loading}
            SubCounsellorTotalDocs={state.totalDocs}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            FetchSubCounsellorByPagination={fetchSubCounsellorByPagination}
          />
        </section>
      </section>

      {/* Create modal */}
      {createOpen && (
        <CreateSubCounsellors
          CounsellorManager={CounsellorManager}
          CounsellorManagerLoading={CounsellorManagerLoading}
          FetchSubCounsellorByPagination={() =>
            fetchSubCounsellorByPagination(1, state.limit)
          }
          HandleCloseCreateSubCounsellors={closeCreate}
        />
      )}
    </>
  );
};

export default AdminSubCounsellors;
