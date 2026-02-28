import React, { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ListOfProgram from "../ChildrenComps/ProgramType/ListOfProgram";
import CreateProgram from "../ChildrenComps/ProgramType/CreateProgram";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Programtype = () => {
  const [CreateProgramTypeButton, setCreateProgramTypeButton] = useState(false);

  const ReduxUniversity = useSelector((state) => state.university);

  const HandleOpenCreateProgramType = () => {
    setCreateProgramTypeButton(true);
  };
  const HandleCloseCreateProgramType = () => {
    setCreateProgramTypeButton(false);
  };

  // fetching Data
  const [ProgramTypeListData, setProgramTypeListData] = useState([]);
  const [ProgramTypeCurrentPage, setProgramTypeCurrentPage] = useState(1);
  const [ProgramTypeTotalPages, setProgramTypeTotalPages] = useState(0);
  const [ProgramTypeLimit, setProgramTypeLimit] = useState(6);
  const [ProgramTypeLoading, setProgramTypeLoading] = useState(false);
  const [ProgramTypeTotalDocs, setProgramTypeTotalDocs] = useState(0);

  const FetchProgramTypeByPagination = async (page, limit) => {
    try {
      setProgramTypeLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetProgramTypeByPagination`,
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
        setProgramTypeListData(response?.data?.data?.ProgramType); //acccess ni ho raha hai
        setProgramTypeCurrentPage(response?.data?.data?.currentPage);
        setProgramTypeTotalPages(response?.data?.data?.totalPages);
        setProgramTypeLimit(response?.data?.data?.limit);
        setProgramTypeTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setProgramTypeLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > ProgramTypeTotalPages) {
      toast.error(`Only Pages ${ProgramTypeTotalPages} Available`);
    } else {
      setProgramTypeCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    FetchProgramTypeByPagination(ProgramTypeCurrentPage, ProgramTypeLimit);
  }, [ProgramTypeCurrentPage, ProgramTypeLimit, ReduxUniversity.id]);

  const handleLimitChange = (event) => {
    setProgramTypeLimit(parseInt(event.target.value));
    setProgramTypeCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <>
      <section className="top-0  py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14 rounded-t-lg dark:bg-slate-900 dark:text-white bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">Course Type</div>
          <div className="text-lg font-bold flex justify-center items-center gap-x-6">
            {/* <button className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white">
              <BiSolidDownload size={19} />
            </button> */}
            <button
              onClick={HandleOpenCreateProgramType}
              className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white"
            >
              <MdOutlineAddCircleOutline size={19} />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:text-white h-full overflow-auto">
          <ListOfProgram
            ProgramTypeListData={ProgramTypeListData}
            ProgramTypeCurrentPage={ProgramTypeCurrentPage}
            ProgramTypeTotalPages={ProgramTypeTotalPages}
            ProgramTypeLimit={ProgramTypeLimit}
            ProgramTypeLoading={ProgramTypeLoading}
            ProgramTypeTotalDocs={ProgramTypeTotalDocs}
            FetchProgramTypeByPagination={FetchProgramTypeByPagination}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
          />
        </div>
      </section>

      {CreateProgramTypeButton && (
        <>
          <CreateProgram
            FetchProgramTypeByPagination={FetchProgramTypeByPagination}
            HandleCloseCreateProgramType={HandleCloseCreateProgramType}
          />
        </>
      )}
    </>
  );
};

export default Programtype;
