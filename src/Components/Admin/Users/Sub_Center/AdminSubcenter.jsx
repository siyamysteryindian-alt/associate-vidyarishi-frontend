import React, { useEffect, useState } from "react";
import ListOfSubCenters from "./ListOfSubCenters";
import CreateSubCenters from "./CreateSubCenters";
import { HiDownload } from "react-icons/hi";
import { MdOutlineAdd } from "react-icons/md";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import UseGetCenterSubCenter from "../../../../CustomHooks/UseGetCenterSubCenter";

const AdminSubcenter = () => {
  const [CreateSubCenterButton, setCreateSubCenterButton] = useState(false);

  const HandleOpenSubCreateCenter = () => {
    setCreateSubCenterButton(true);
  };
  const HandleCloseSubCreateCenter = () => {
    setCreateSubCenterButton(false);
  };

  // fetching Data
  const [SubCenterListData, setSubCenterListData] = useState([]);
  const [SubCenterCurrentPage, setSubCenterCurrentPage] = useState(1);
  const [SubCenterTotalPages, setSubCenterTotalPages] = useState(0);
  const [SubCenterLimit, setSubCenterLimit] = useState(6);
  const [SubCenterLoading, setSubCenterLoading] = useState(false);
  const [SubCenterTotalDocs, setSubCenterTotalDocs] = useState(0);

  const UniversityGetDataFromRedux = useSelector((state) => state?.university);

  const FetchSubCenterByPagination = async (page, limit, searchQuery = "") => {
    try {
      setSubCenterLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetSubCenterByPagination`,
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
        setSubCenterListData(response?.data?.data?.subCenter);
        setSubCenterCurrentPage(response?.data?.data?.currentPage);
        setSubCenterTotalPages(response?.data?.data?.totalPages);
        setSubCenterLimit(response?.data?.data?.limit);
        setSubCenterTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSubCenterLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > CenterTotalPages) {
      toast.error(`Only Pages ${CenterTotalPages} Available`);
    } else {
      setSubCenterCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    FetchSubCenterByPagination(SubCenterCurrentPage, SubCenterLimit);
  }, [SubCenterCurrentPage, SubCenterLimit, UniversityGetDataFromRedux?.id]);

  const handleLimitChange = (event) => {
    setSubCenterLimit(parseInt(event.target.value));
    setSubCenterCurrentPage(1); // Reset to first page when limit changes
  };

  const handleExportSubCenter = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ExportSubCenterData`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      // Check if response is valid
      if (!response?.data) {
        throw new Error("No data received from the server.");
      }

      // Create a URL for the file
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"] || "application/octet-stream",
        })
      );

      // Create a link and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "subCenter_data.xlsx"); // File name
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Free up memory
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const ReduxLoggedUser = useSelector((state) => state?.user);

  const { GetCenter, CenterError, CenterLoading, Center } =
    UseGetCenterSubCenter();

  useEffect(() => {
    GetCenter();
  }, []);

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
            Sub Center
          </div>
          <div className="flex items-center  gap-3 w-full md:w-auto justify-between md:justify-end">
            {ReduxLoggedUser?.role === "Admin" && (
              <button
                onClick={handleExportSubCenter}
                className="px-4 py-1.5 dark:text-black bg-green-500  tracking-wide  uppercase text-white font-bold rounded-lg flex justify-center items-center gap-x-1 text-sm"
              >
                Download
                <HiDownload size={18} />
              </button>
            )}
            {ReduxLoggedUser?.role === "Admin" && (
              <button
                className="px-4 py-1.5 dark:text-black bg-green-500  tracking-wide  uppercase text-white font-bold rounded-lg flex justify-center items-center gap-x-1 text-sm"
                onClick={HandleOpenSubCreateCenter}
              >
                Create <MdOutlineAdd size={18} />
              </button>
            )}

            {ReduxLoggedUser?.role === "center" &&
              Center.some(
                (data) =>
                  data._id === ReduxLoggedUser.id && data.canCreateSubCenter
              ) && (
                <button
                  className="px-4 py-1.5 dark:text-black bg-green-500  tracking-wide  uppercase text-white font-bold rounded-lg flex justify-center items-center gap-x-1 text-sm"
                  onClick={HandleOpenSubCreateCenter}
                >
                  Create <MdOutlineAdd size={18} />
                </button>
              )}
          </div>
        </div>
        <section className="mt-2">
          <ListOfSubCenters
            SubCenterListData={SubCenterListData}
            SubCenterCurrentPage={SubCenterCurrentPage}
            SubCenterTotalPages={SubCenterTotalPages}
            SubCenterLimit={SubCenterLimit}
            SubCenterLoading={SubCenterLoading}
            SubCenterTotalDocs={SubCenterTotalDocs}
            FetchSubCenterByPagination={FetchSubCenterByPagination}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
          />
        </section>
      </section>

      {CreateSubCenterButton && (
        <span>
          <CreateSubCenters
            FetchSubCenterByPagination={FetchSubCenterByPagination}
            HandleCloseSubCreateCenter={HandleCloseSubCreateCenter}
          />
        </span>
      )}
    </>
  );
};

export default AdminSubcenter;
