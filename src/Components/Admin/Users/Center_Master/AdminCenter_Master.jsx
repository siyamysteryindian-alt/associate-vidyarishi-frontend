import React, { useCallback, useEffect, useState } from "react";
import CreateCenterMaster from "./CreateCenterMaster";
import ListCenterMaster from "./ListCenterMaster";
import { HiDownload } from "react-icons/hi";
import { MdOutlineAdd } from "react-icons/md";
import axios from "axios";
import { toast } from "react-hot-toast";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";

const AdminCenter_Master = () => {
  const [createCenterOpen, setCreateCenterOpen] = useState(false);
  const ReduxLoggedUser = useSelector((s) => s?.user);
  const UniversityGetDataFromRedux = useSelector((s) => s?.university);

  const [state, setState] = useState({
    list: [],
    currentPage: 1,
    totalPages: 0,
    limit: 6,
    totalDocs: 0,
    loading: false,
  });

  const openCreate = () => setCreateCenterOpen(true);
  const closeCreate = () => setCreateCenterOpen(false);

  const fetchCenterByPagination = useCallback(
    async (page = 1, limit = state.limit, query = "") => {
      try {
        setState((p) => ({ ...p, loading: true }));
        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/GetCenterMasterByPagination`,
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

        if (resp?.data?.success) {
          const data = resp.data.data || {};
          setState((p) => ({
            ...p,
            list: data.Center || [],
            currentPage: data.currentPage || page,
            totalPages: data.totalPages || 0,
            limit: data.limit || limit,
            totalDocs: data.totalDocs || 0,
            loading: false,
          }));
        } else {
          toast.error(resp?.data?.message || "Failed to fetch centers");
          setState((p) => ({ ...p, loading: false }));
        }
      } catch (err) {
        console.error("FetchCenterByPagination:", err);
        toast.error(
          err?.response?.data?.message || "An error occurred. Please try again."
        );
        setState((p) => ({ ...p, loading: false }));
      }
    },
    [UniversityGetDataFromRedux?.id, state.limit]
  );

  useEffect(() => {
    // initial fetch and whenever university / page / limit change
    fetchCenterByPagination(state.currentPage, state.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage, state.limit, UniversityGetDataFromRedux?.id]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }
    if (pageNumber > state.totalPages) {
      toast.error(`Only ${state.totalPages} pages available`);
      return;
    }
    setState((p) => ({ ...p, currentPage: pageNumber }));
  };

  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10) || 6;
    setState((p) => ({ ...p, limit: value, currentPage: 1 }));
  };

  const handleExportCenterMaster = async () => {
    try {
      // Filter client-side to only included non-deleted centers for current university.
      const filtered = (state.list || []).filter(
        (data) =>
          !data?.isDeleted &&
          data?.allotedUniversities?.some(
            (u) => u?._id === UniversityGetDataFromRedux?.id
          )
      );

      const headers = [
        "Sr No",
        "Center Name",
        "Email",
        "Mobile No",
        "Center Code",
        "Admissions",
        "Can Create Sub Center",
      ];

      const rows = filtered.map((d, i) => [
        i + 1,
        d?.name || "",
        d?.email || "",
        d?.contact || "",
        d?.code || "",
        (d?.admissions?.length || 0).toString(),
        d?.canCreateSubCenter ? "Yes" : "No",
      ]);

      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "vidyarishi_Center_data.csv");
    } catch (err) {
      console.error("Export Center Master error:", err);
      toast.error("Failed to export center data.");
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
            Center Master
          </div>

          <div className="flex items-center gap-3">
            {ReduxLoggedUser?.role === "Admin" && (
              <button
                onClick={handleExportCenterMaster}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm font-semibold hover:bg-green-600 flex items-center gap-2"
                title="Download center data"
              >
                <HiDownload size={16} />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}

            {ReduxLoggedUser?.role !== "university-manager" && (
              <button
                onClick={openCreate}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm font-semibold hover:bg-green-600 flex items-center gap-2"
                title="Create center"
              >
                <MdOutlineAdd size={18} />
                <span className="hidden sm:inline">Create</span>
              </button>
            )}
          </div>
        </div>

        <section className="mt-3">
          <ListCenterMaster
            CenterListData={state.list}
            CenterCurrentPage={state.currentPage}
            CenterTotalPages={state.totalPages}
            CenterLimit={state.limit}
            CenterLoading={state.loading}
            CenterTotalDocs={state.totalDocs}
            FetchCenterByPagination={fetchCenterByPagination}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
          />
        </section>
      </section>

      {createCenterOpen && (
        <CreateCenterMaster
          FetchCenterByPagination={() =>
            fetchCenterByPagination(1, state.limit)
          }
          HandleCloseCreateCenterMaster={closeCreate}
        />
      )}
    </>
  );
};

export default AdminCenter_Master;
