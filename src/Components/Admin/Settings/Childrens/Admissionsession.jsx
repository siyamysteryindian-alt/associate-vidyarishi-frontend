import React, { useEffect, useState } from "react";
import { BiSolidDownload } from "react-icons/bi";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ListOfAdmissionsession from "../ChildrenComps/Admissionsession/ListOfAdmissionsession";
import CreateAdmissionsession from "../ChildrenComps/Admissionsession/CreateAdmissionsession";
import axios from "axios";
import { toast } from "react-hot-toast";

const Admissionsession = () => {
  const [CreateAdmissionsessionButton, setCreateAdmissionsessionButton] =
    useState(false);

  const HandleOpenCreateAdmissionsession = () => {
    setCreateAdmissionsessionButton(true);
  };
  const HandleCloseCreateAdmissionsession = () => {
    setCreateAdmissionsessionButton(false);
  };

  // fetching Data
  const [AdmissionsessionListData, setAdmissionsessionListData] = useState([]);
  const [AdmissionsessionCurrentPage, setAdmissionsessionCurrentPage] =
    useState(1);
  const [AdmissionsessionTotalPages, setAdmissionsessionTotalPages] =
    useState(0);
  const [AdmissionsessionLimit, setAdmissionsessionLimit] = useState(6);
  const [AdmissionsessionLoading, setAdmissionsessionLoading] = useState(false);
  const [AdmissionsessionTotalDocs, setAdmissionsessionTotalDocs] = useState(0);

  const FetchAdmissionsessionByPagination = async (page, limit) => {
    try {
      setAdmissionsessionLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAdmissionSessionByPagination`,
        {
          params: {
            page,
            limit,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setAdmissionsessionListData(response?.data?.data?.Admissionsession); //acccess ni ho raha hai
        setAdmissionsessionCurrentPage(response?.data?.data?.currentPage);
        setAdmissionsessionTotalPages(response?.data?.data?.totalPages);
        setAdmissionsessionLimit(response?.data?.data?.limit);
        setAdmissionsessionTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setAdmissionsessionLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > AdmissionsessionTotalPages) {
      toast.error(`Only Pages ${AdmissionsessionTotalPages} Available`);
    } else {
      setAdmissionsessionCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    FetchAdmissionsessionByPagination(
      AdmissionsessionCurrentPage,
      AdmissionsessionLimit
    );
  }, [AdmissionsessionCurrentPage, AdmissionsessionLimit]);

  const handleLimitChange = (event) => {
    setAdmissionsessionLimit(parseInt(event.target.value));
    setAdmissionsessionCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <>
      <section className="top-0  py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14 dark:bg-slate-900 dark:text-white rounded-t-lg bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">
            {" "}
            Admission Session
          </div>
          <div className="text-lg font-bold flex justify-center items-center gap-x-6">
            {/* <button className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white">
              <BiSolidDownload size={19} />
            </button> */}
            <button
              onClick={HandleOpenCreateAdmissionsession}
              className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white"
            >
              <MdOutlineAddCircleOutline size={19} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 dark:text-white h-full overflow-auto">
          <ListOfAdmissionsession
            AdmissionsessionListData={AdmissionsessionListData}
            AdmissionsessionCurrentPage={AdmissionsessionCurrentPage}
            AdmissionsessionTotalPages={AdmissionsessionTotalPages}
            AdmissionsessionLimit={AdmissionsessionLimit}
            AdmissionsessionLoading={AdmissionsessionLoading}
            AdmissionsessionTotalDocs={AdmissionsessionTotalDocs}
            FetchAdmissionsessionByPagination={
              FetchAdmissionsessionByPagination
            }
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
          />
        </div>
      </section>

      {CreateAdmissionsessionButton && (
        <>
          <span>
            <CreateAdmissionsession
              FetchAdmissionsessionByPagination={
                FetchAdmissionsessionByPagination
              }
              HandleCloseCreateAdmissionsession={
                HandleCloseCreateAdmissionsession
              }
            />
          </span>
        </>
      )}
    </>
  );
};

export default Admissionsession;
