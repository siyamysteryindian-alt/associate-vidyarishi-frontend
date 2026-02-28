import React, { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ListMode from "../ChildrenComps/Mode/ListMode";
import CreateMode from "../ChildrenComps/Mode/CreateMode";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Mode = () => {
  const [CreateModeButton, setCreateModeButton] = useState(false);
  const ReduxUniversity = useSelector((state) => state.university);

  const HandleOpenCreateMode = () => {
    setCreateModeButton(true);
  };
  const HandleCloseCreateMode = () => {
    setCreateModeButton(false);
  };

  // fetching Data
  const [ModeListData, setModeListData] = useState([]);
  const [ModeCurrentPage, setModeCurrentPage] = useState(1);
  const [ModeTotalPages, setModeTotalPages] = useState(0);
  const [ModeLimit, setModeLimit] = useState(6);
  const [ModeLoading, setModeLoading] = useState(false);
  const [ModeTotalDocs, setModeTotalDocs] = useState(0);

  const FetchModeByPagination = async (page, limit) => {
    try {
      setModeLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetModeByPagination`,
        {
          params: {
            page,
            limit,
            university: ReduxUniversity.id,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setModeListData(response?.data?.data?.Mode); //acccess ni ho raha hai
        setModeCurrentPage(response?.data?.data?.currentPage);
        setModeTotalPages(response?.data?.data?.totalPages);
        setModeLimit(response?.data?.data?.limit);
        setModeTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setModeLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > ModeTotalPages) {
      toast.error(`Only Pages ${ModeTotalPages} Available`);
    } else {
      setModeCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    FetchModeByPagination(ModeCurrentPage, ModeLimit);
  }, [ModeCurrentPage, ModeLimit, ReduxUniversity.id]);

  const handleLimitChange = (event) => {
    setModeLimit(parseInt(event.target.value));
    setModeCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <>
      <section className="top-0  py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14  rounded-t-lg dark:bg-slate-900 dark:text-white bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">Mode</div>
          <div className="text-lg font-bold flex justify-center items-center gap-x-6">
            {/* <button className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white">
              <BiSolidDownload size={19} />
            </button> */}
            <button
              onClick={HandleOpenCreateMode}
              className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white"
            >
              <MdOutlineAddCircleOutline size={19} />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:text-white h-full overflow-auto">
          <ListMode
            ModeListData={ModeListData}
            ModeCurrentPage={ModeCurrentPage}
            ModeTotalPages={ModeTotalPages}
            ModeLimit={ModeLimit}
            ModeLoading={ModeLoading}
            ModeTotalDocs={ModeTotalDocs}
            FetchModeByPagination={FetchModeByPagination}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
          />
        </div>
      </section>

      {CreateModeButton && (
        <>
          <CreateMode
            FetchModeByPagination={FetchModeByPagination}
            HandleCloseCreateMode={HandleCloseCreateMode}
          />
        </>
      )}
    </>
  );
};

export default Mode;
