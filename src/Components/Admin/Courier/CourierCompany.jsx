import React, { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import ListOfCourieerCompaniesComp from "./ListOfCourieerComp";
import CreateCourierComp from "./CreateCourierComp";

const CourierCompany = () => {
  const [CreateCourieerCompaniesButton, setCreateCourieerCompaniesButton] =
    useState(false);

  const HandleOpenCreateCourieerCompanies = () => {
    setCreateCourieerCompaniesButton(true);
  };
  const HandleCloseCreateCourieerCompanies = () => {
    setCreateCourieerCompaniesButton(false);
  };

  // fetching Data
  const [CourieerCompaniesListData, setCourieerCompaniesListData] = useState(
    []
  );
  const [CourieerCompaniesLoading, setCourieerCompaniesLoading] =
    useState(false);

  const FetchCourieerCompanies = async () => {
    try {
      setCourieerCompaniesLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetCourierCompanies`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setCourieerCompaniesListData(response?.data?.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setCourieerCompaniesLoading(false);
    }
  };

  const GetFromReduxUser = useSelector((state) => state?.user);

  useEffect(() => {
    if (GetFromReduxUser?.id) {
      FetchCourieerCompanies();
    }
  }, [GetFromReduxUser?.id]);

  return (
    <>
      <section className="top-0  py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14  rounded-t-lg dark:bg-slate-900 dark:text-white bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">
            Courieer Companies
          </div>
          <div className="text-lg font-bold flex justify-center items-center gap-x-6">
            {/* <button className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white">
          <BiSolidDownload size={19} />
        </button> */}
            <button
              onClick={HandleOpenCreateCourieerCompanies}
              className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white"
            >
              <MdOutlineAddCircleOutline size={19} />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:text-white h-full overflow-auto">
          <ListOfCourieerCompaniesComp
            CourieerCompaniesListData={CourieerCompaniesListData}
            CourieerCompaniesLoading={CourieerCompaniesLoading}
            FetchCourieerCompanies={FetchCourieerCompanies}
          />
        </div>
      </section>

      {CreateCourieerCompaniesButton && (
        <>
          <CreateCourierComp
            FetchCourieerCompaniesCompanies={FetchCourieerCompanies}
            HandleCloseCreateCourieerCompanies={
              HandleCloseCreateCourieerCompanies
            }
          />
        </>
      )}
    </>
  );
};

export default CourierCompany;
