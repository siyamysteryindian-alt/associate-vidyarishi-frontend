import React, { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ListOfSchemas from "../ChildrenComps/Schemas/ListOfSchemas";
import CreateSchemas from "../ChildrenComps/Schemas/CreateSchemas";
import axios from "axios";
import { toast } from "react-hot-toast";

const Schema = () => {
  const [SchemaTypeButton, setSchemaTypeButton] = useState(false);

  const HandleOpenSchemaType = () => {
    setSchemaTypeButton(true);
  };
  const HandleCloseSchemaType = () => {
    setSchemaTypeButton(false);
  };

  // fetching Data
  const [SchemeListData, setSchemeListData] = useState([]);
  const [SchemeCurrentPage, setSchemeCurrentPage] = useState(1);
  const [SchemeTotalPages, setSchemeTotalPages] = useState(0);
  const [SchemeLimit, setSchemeLimit] = useState(6);
  const [SchemeLoading, setSchemeLoading] = useState(false);
  const [SchemeTotalDocs, setSchemeTotalDocs] = useState(0);

  const FetchSchemeByPagination = async (page, limit) => {
    try {
      setSchemeLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetSchemeByPagination`,
        {
          params: {
            page,
            limit,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setSchemeListData(response?.data?.data?.Scheme); //acccess ni ho raha hai
        setSchemeCurrentPage(response?.data?.data?.currentPage);
        setSchemeTotalPages(response?.data?.data?.totalPages);
        setSchemeLimit(response?.data?.data?.limit);
        setSchemeTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSchemeLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > SchemeTotalPages) {
      toast.error(`Only Pages ${SchemeTotalPages} Available`);
    } else {
      setSchemeCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    FetchSchemeByPagination(SchemeCurrentPage, SchemeLimit);
  }, [SchemeCurrentPage, SchemeLimit]);

  const handleLimitChange = (event) => {
    setSchemeLimit(parseInt(event.target.value));
    setSchemeCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <>
      <section className="top-0  py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14 dark:bg-slate-900 dark:text-white rounded-t-lg bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">Schema</div>
          <div className="text-lg font-bold flex justify-center items-center gap-x-6">
            {/* <button className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white">
              <BiSolidDownload size={19} />
            </button> */}
            <button
              onClick={HandleOpenSchemaType}
              className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white"
            >
              <MdOutlineAddCircleOutline size={19} />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:text-white h-full overflow-auto">
          <ListOfSchemas
            SchemeListData={SchemeListData}
            SchemeCurrentPage={SchemeCurrentPage}
            SchemeTotalPages={SchemeTotalPages}
            SchemeLimit={SchemeLimit}
            SchemeLoading={SchemeLoading}
            SchemeTotalDocs={SchemeTotalDocs}
            FetchSchemeByPagination={FetchSchemeByPagination}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
          />
        </div>
      </section>

      {SchemaTypeButton && (
        <>
          <CreateSchemas HandleCloseSchemaType={HandleCloseSchemaType} />
        </>
      )}
    </>
  );
};

export default Schema;
