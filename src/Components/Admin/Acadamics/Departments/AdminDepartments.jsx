import React, { useEffect, useState } from "react";
import ListOfDepartments from "./ListOfDepartments";
import CreateDepartment from "./CreateDepartment";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AdminDepartments = () => {
  const [OpenCreateDepartment, setOpenCreateDepartment] = useState(false);

  const HandleCloseButtonCreateDepartment = () => {
    setOpenCreateDepartment(false);
  };

  const HandleOpenButtonCreateDepartment = () => {
    setOpenCreateDepartment(true);
  };

  // fetching Data
  const [DepartmentListData, setDepartmentListData] = useState([]);
  const [DepartmentCurrentPage, setDepartmentCurrentPage] = useState(1);
  const [DepartmentTotalPages, setDepartmentTotalPages] = useState(0);
  const [DepartmentLimit, setDepartmentLimit] = useState(6);
  const [DepartmentLoading, setDepartmentLoading] = useState(false);
  const [DepartmentTotalDocs, setDepartmentTotalDocs] = useState(0);

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const FetchDepartmentByPagination = async (page, limit, searchQuery = "") => {
    try {
      setDepartmentLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetDepartmentsByPagination`,
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
        setDepartmentListData(response?.data?.data?.Department);
        setDepartmentCurrentPage(response?.data?.data?.currentPage);
        setDepartmentTotalPages(response?.data?.data?.totalPages);
        setDepartmentLimit(response?.data?.data?.limit);
        setDepartmentTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setDepartmentLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > DepartmentTotalPages) {
      toast.error(`Only Pages ${DepartmentTotalPages} Available`);
    } else {
      setDepartmentCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    FetchDepartmentByPagination(DepartmentCurrentPage, DepartmentLimit);
  }, [DepartmentCurrentPage, DepartmentLimit, UniversityGetDataFromRedux?.id]);

  const handleLimitChange = (event) => {
    setDepartmentLimit(parseInt(event.target.value));
    setDepartmentCurrentPage(1); // Reset to first page when limit changes
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
            Faculty
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
              onClick={HandleOpenButtonCreateDepartment}
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
          <ListOfDepartments
            DepartmentListData={DepartmentListData}
            DepartmentCurrentPage={DepartmentCurrentPage}
            DepartmentTotalPages={DepartmentTotalPages}
            DepartmentLimit={DepartmentLimit}
            DepartmentLoading={DepartmentLoading}
            DepartmentTotalDocs={DepartmentTotalDocs}
            FetchDepartmentByPagination={FetchDepartmentByPagination}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
          />
        </section>
      </section>

      {OpenCreateDepartment && (
        <CreateDepartment
          FetchDepartmentByPagination={FetchDepartmentByPagination}
          CloseButtonCreateDepartment={HandleCloseButtonCreateDepartment}
        />
      )}
    </>
  );
};

export default AdminDepartments;
