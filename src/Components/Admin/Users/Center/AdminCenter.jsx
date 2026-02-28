import React, { useCallback, useEffect, useState } from "react";
import ListOfCenter from "./ListOfCenter";
import { HiDownload } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";

const AdminCenter = () => {
  const [createCenterOpen, setCreateCenterOpen] = useState(false);
  const [centerList, setCenterList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [totalDocs, setTotalDocs] = useState(0);

  const reduxUser = useSelector((s) => s?.user);
  const university = useSelector((s) => s?.university);

  const openCreate = () => setCreateCenterOpen(true);
  const closeCreate = () => setCreateCenterOpen(false);

  const fetchCenters = useCallback(
    async (page = 1, pageLimit = limit, query = "") => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/GetCenterMasterByPagination`,
          {
            params: {
              page,
              limit: pageLimit,
              query,
              university: university?.id,
            },
            withCredentials: true,
          }
        );

        if (res?.data?.success) {
          const data = res.data.data || {};
          setCenterList(data.Center || []);
          setCurrentPage(data.currentPage || page);
          setTotalPages(data.totalPages || 0);
          setLimit(data.limit || pageLimit);
          setTotalDocs(data.totalDocs || 0);
        } else {
          toast.error(res?.data?.message || "Failed to fetch centers");
        }
      } catch (err) {
        console.error("Fetch centers error:", err);
        toast.error(
          err?.response?.data?.message ||
            "An error occurred while fetching centers"
        );
      } finally {
        setLoading(false);
      }
    },
    [university?.id, limit]
  );

  useEffect(() => {
    fetchCenters(currentPage, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, university?.id]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }
    if (pageNumber > totalPages) {
      toast.error(`Only ${totalPages} pages available.`);
      return;
    }
    setCurrentPage(pageNumber);
  };

  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10) || 6;
    setLimit(value);
    setCurrentPage(1); // reset to first page on limit change
  };

  const handleExportCenter = async () => {
    try {
      const filtered = (centerList || []).filter(
        (c) =>
          !c?.isDeleted &&
          c?.allotedUniversities?.some((u) => u?._id === university?.id)
      );

      if (!filtered.length) {
        toast.error("No center data available to export.");
        return;
      }

      const headers = [
        "Sr No",
        "Center Name",
        "Email",
        "Mobile No",
        "Center Code",
        "Admissions",
        "Can Create Sub Center",
      ];
      const rows = filtered.map((c, i) => [
        i + 1,
        c?.name || "",
        c?.email || "",
        c?.contact || "",
        c?.code || "",
        (c?.admissions?.length || 0).toString(),
        c?.canCreateSubCenter ? "Yes" : "No",
      ]);

      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "vidyarishi_center_data.csv");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export center data.");
    }
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
            Centers
          </div>

          <div className="flex items-center gap-3">
            {reduxUser?.role === "Admin" && (
              <button
                onClick={handleExportCenter}
                aria-label="Download centers data"
                className="px-3 py-1.5 bg-green-500 text-white font-semibold rounded-lg flex items-center gap-2 text-sm"
              >
                <HiDownload size={18} />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}

            {/* If you plan to allow create on some roles, keep a button here */}
            {/* <button onClick={openCreate} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm">Create</button> */}
          </div>
        </div>

        <section className="mt-3">
          <ListOfCenter
            CenterListData={centerList}
            CenterCurrentPage={currentPage}
            CenterTotalPages={totalPages}
            CenterLimit={limit}
            CenterLoading={loading}
            CenterTotalDocs={totalDocs}
            FetchCenterByPagination={fetchCenters}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
          />
        </section>
      </section>

      {/* {createCenterOpen && (
        <CreateCenter
          FetchCenterByPagination={() => fetchCenters(1, limit)}
          HandleCloseCreateCenter={closeCreate}
        />
      )} */}
    </>
  );
};

export default AdminCenter;
