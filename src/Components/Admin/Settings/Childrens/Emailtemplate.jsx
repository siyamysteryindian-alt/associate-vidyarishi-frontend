import React, { useEffect, useState } from "react";
import { BiSolidDownload } from "react-icons/bi";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ListEmailTemplate from "../ChildrenComps/EmailTemplate/ListEmailTemplate";
import CreateEmailTemplate from "../ChildrenComps/EmailTemplate/CreateEmailTemplate";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

const Emailtemplate = () => {
  const [CreateEmailTemplateButton, setCreateEmailTemplateButton] =
    useState(false);

  const HandleOpenCreateEmailTemplate = () => {
    setCreateEmailTemplateButton(true);
  };
  const HandleCloseCreateEmailTemplate = () => {
    setCreateEmailTemplateButton(false);
  };

  const [EmailTemplateListData, setEmailTemplateListData] = useState([]);
  const [EmailTemplateLoading, setEmailTemplateLoading] = useState([]);

  const FetchEmailTemplate = async () => {
    try {
      setEmailTemplateLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetAllEmailTemplate`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setEmailTemplateListData(response?.data?.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setEmailTemplateLoading(false);
    }
  };

  const GetFromReduxUser = useSelector((state) => state?.user);

  useEffect(() => {
    if (GetFromReduxUser?.id) {
      FetchEmailTemplate();
    }
  }, [GetFromReduxUser?.id]);

  return (
    <>
      <section className="top-0 py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14 rounded-t-lg dark:bg-slate-900 dark:text-white bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">Email Template</div>
          <div className="text-lg font-bold flex justify-center items-center gap-x-6">
            {/* <button className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white">
              <BiSolidDownload size={19} />
            </button> */}
            <button
              onClick={HandleOpenCreateEmailTemplate}
              className="hover:bg-blue-600 p-1.5 rounded-full hover:text-white"
            >
              <MdOutlineAddCircleOutline size={19} />
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:text-white h-full overflow-auto">
          <ListEmailTemplate
            EmailTemplateListData={EmailTemplateListData}
            EmailTemplateLoading={EmailTemplateLoading}
            FetchEmailTemplate={FetchEmailTemplate}
          />
        </div>
      </section>

      {CreateEmailTemplateButton && (
        <>
          <span>
            <CreateEmailTemplate
              HandleCloseCreateEmailTemplate={HandleCloseCreateEmailTemplate}
            />
          </span>
        </>
      )}
    </>
  );
};

export default Emailtemplate;
