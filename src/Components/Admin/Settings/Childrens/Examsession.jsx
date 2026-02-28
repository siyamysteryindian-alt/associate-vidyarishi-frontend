import React, { useEffect, useState } from "react";
import { BiSolidDownload } from "react-icons/bi";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ListOfExamsession from "../ChildrenComps/Examsession/ListOfExamsession";
import CreateExamsession from "../ChildrenComps/Examsession/CreateExamsession";
import axios from "axios";
import { toast } from "react-hot-toast";

const Examsession = () => {
  const [CreateExamsessionButton, setCreateExamsessionButton] = useState(false);

  const HandleOpenCreateExamsession = () => {
    setCreateExamsessionButton(true);
  };
  const HandleCloseCreateExamsession = () => {
    setCreateExamsessionButton(false);
  };

  // fetching Data
  const [ExamsessionListData, setExamsessionListData] = useState([]);
  const [ExamsessionCurrentPage, setExamsessionCurrentPage] = useState(1);
  const [ExamsessionTotalPages, setExamsessionTotalPages] = useState(0);
  const [ExamsessionLimit, setExamsessionLimit] = useState(6);
  const [ExamsessionLoading, setExamsessionLoading] = useState(false);
  const [ExamsessionTotalDocs, setExamsessionTotalDocs] = useState(0);

  const FetchExamsessionByPagination = async (page, limit) => {
    try {
      setExamsessionLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetExamsessionByPagination`,
        {
          params: {
            page,
            limit,
          },
        }
      );

      if (response?.data?.success) {
        setExamsessionListData(response?.data?.data?.Examsession); //acccess ni ho raha hai
        setExamsessionCurrentPage(response?.data?.data?.currentPage);
        setExamsessionTotalPages(response?.data?.data?.totalPages);
        setExamsessionLimit(response?.data?.data?.limit);
        setExamsessionTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      console.log(error.response?.data);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setExamsessionLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > ExamsessionTotalPages) {
      toast.error(`Only Pages ${ExamsessionTotalPages} Available`);
    } else {
      setExamsessionCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    FetchExamsessionByPagination(ExamsessionCurrentPage, ExamsessionLimit);
  }, [ExamsessionCurrentPage, ExamsessionLimit]);

  const handleLimitChange = (event) => {
    setExamsessionLimit(parseInt(event.target.value));
    setExamsessionCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <>
      <section className="top-0  py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14 rounded-t-lg dark:bg-slate-900 dark:text-white bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">Exam Session</div>
          <div className="text-lg font-bold flex justify-center items-center gap-x-6">
            {/* <button className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white">
              <BiSolidDownload size={19} />
            </button> */}
            <button
              onClick={HandleOpenCreateExamsession}
              className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white"
            >
              <MdOutlineAddCircleOutline size={19} />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:text-white h-full overflow-auto">
          <ListOfExamsession
            ExamsessionListData={ExamsessionListData}
            ExamsessionCurrentPage={ExamsessionCurrentPage}
            ExamsessionTotalPages={ExamsessionTotalPages}
            ExamsessionLimit={ExamsessionLimit}
            ExamsessionLoading={ExamsessionLoading}
            ExamsessionTotalDocs={ExamsessionTotalDocs}
            FetchExamsessionByPagination={FetchExamsessionByPagination}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
          />
        </div>
      </section>

      {CreateExamsessionButton && (
        <>
          <span>
            <CreateExamsession
              FetchExamsessionByPagination={FetchExamsessionByPagination}
              HandleCloseCreateExamsession={HandleCloseCreateExamsession}
            />
          </span>
        </>
      )}
    </>
  );
};

export default Examsession;
