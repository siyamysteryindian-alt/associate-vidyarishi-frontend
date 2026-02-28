import React, { useEffect, useState } from "react";
import { BiSolidDownload } from "react-icons/bi";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ListOfAdmissionType from "../ChildrenComps/AdmissionType/ListOfAdmissionType";
import CreateAdmissionType from "../ChildrenComps/AdmissionType/CreateAdmissionType";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Admissiontype = () => {
  const [CreateAdmissionTypeButton, setCreateAdmissionTypeButton] =
    useState(false);

  const HandleOpenCreateAdmissionType = () => {
    setCreateAdmissionTypeButton(true);
  };
  const HandleCloseCreateAdmissionType = () => {
    setCreateAdmissionTypeButton(false);
  };

  const ReduxUniversity = useSelector((state) => state.university);
  // fetching Data
  const [AdmissionTypeListData, setAdmissionTypeListData] = useState([]);
  const [AdmissionTypeCurrentPage, setAdmissionTypeCurrentPage] = useState(1);
  const [AdmissionTypeTotalPages, setAdmissionTypeTotalPages] = useState(0);
  const [AdmissionTypeLimit, setAdmissionTypeLimit] = useState(6);
  const [AdmissionTypeLoading, setAdmissionTypeLoading] = useState(false);
  const [AdmissionTypeTotalDocs, setAdmissionTypeTotalDocs] = useState(0);

  const FetchAdmissionTypeByPagination = async (page, limit) => {
    try {
      setAdmissionTypeLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAdmissionTypeByPagination`,
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
        setAdmissionTypeListData(response?.data?.data?.AdmissionType); //acccess ni ho raha hai
        setAdmissionTypeCurrentPage(response?.data?.data?.currentPage);
        setAdmissionTypeTotalPages(response?.data?.data?.totalPages);
        setAdmissionTypeLimit(response?.data?.data?.limit);
        setAdmissionTypeTotalDocs(response?.data?.data?.totalDocs);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setAdmissionTypeLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > AdmissionTypeTotalPages) {
      toast.error(`Only Pages ${AdmissionTypeTotalPages} Available`);
    } else {
      setAdmissionTypeCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    FetchAdmissionTypeByPagination(
      AdmissionTypeCurrentPage,
      AdmissionTypeLimit
    );
  }, [AdmissionTypeCurrentPage, AdmissionTypeLimit, ReduxUniversity.id]);

  const handleLimitChange = (event) => {
    setAdmissionTypeLimit(parseInt(event.target.value));
    setAdmissionTypeCurrentPage(1); // Reset to first page when limit changes
  };

  return (
    <>
      <section className="top-0  py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14 rounded-t-lg dark:bg-slate-900 dark:text-white bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">Admission Type</div>
          <div className="text-lg font-bold flex justify-center items-center gap-x-6">
            {/* <button className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white">
              <BiSolidDownload size={19} />
            </button> */}
            <button
              onClick={HandleOpenCreateAdmissionType}
              className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white"
            >
              <MdOutlineAddCircleOutline size={19} />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:text-white h-full overflow-auto">
          <ListOfAdmissionType
            AdmissionTypeListData={AdmissionTypeListData}
            AdmissionTypeCurrentPage={AdmissionTypeCurrentPage}
            AdmissionTypeTotalPages={AdmissionTypeTotalPages}
            AdmissionTypeLimit={AdmissionTypeLimit}
            AdmissionTypeLoading={AdmissionTypeLoading}
            AdmissionTypeTotalDocs={AdmissionTypeTotalDocs}
            FetchAdmissionTypeByPagination={FetchAdmissionTypeByPagination}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
          />
        </div>
      </section>

      {CreateAdmissionTypeButton && (
        <>
          <span>
            <CreateAdmissionType
              FetchAdmissionTypeByPagination={FetchAdmissionTypeByPagination}
              HandleCloseCreateAdmissionType={HandleCloseCreateAdmissionType}
            />
          </span>
        </>
      )}
    </>
  );
};

export default Admissiontype;
