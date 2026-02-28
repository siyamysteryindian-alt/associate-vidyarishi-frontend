import React from "react";
import { IoMdClose } from "react-icons/io";
import Loader from "../Helper/Loader";
import { useSelector } from "react-redux";

const DisplayWindowNotify = ({ NotifyDataLoading, NotifyData }) => {
  const ReduxUserData = useSelector((state) => state?.user);

  return (
    <>
      {(ReduxUserData?.role === "Counsellor" ||
        ReduxUserData?.role === "subCounsellor") && (
        <div
          className="fadeInUp FadeInbox  min-w-fit absolute top-0 
left-0 ml-32 mt-20  rounded.
rounded-lg bg-white w-auto h-auto px-8 pb-8"
        >
          <div className="text-center tracking-wide mb-2 mt-4 font-bold text-xl">
            Latest Updates
          </div>
          <div className="w-full h-0.5 bg-slate-400"></div>
          <div className="">
            {NotifyDataLoading ? (
              <Loader />
            ) : (
              NotifyData?.filter(
                (data) =>
                  !data?.isDeleted &&
                  !data?.isStopPublish &&
                  (data?.isPublishToCounsellor ||
                    data?.isPublishToSubCounsellor ||
                    data?.isPublishToAll)
              )?.map((Notice) => (
                <div
                  key={Notice?.id}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: Notice?.NotifyContent,
                    }}
                    className="text-gray-700 text-sm leading-relaxed"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {(ReduxUserData?.role === "center" ||
        ReduxUserData?.role === "subCenter") && (
        <div
          className="fadeInUp FadeInbox  min-w-fit absolute top-0 
left-0 ml-32 mt-20  rounded.
rounded-lg bg-white w-auto h-auto px-8 pb-8"
        >
          <div className="text-center tracking-wide mb-2 mt-4 font-bold text-xl">
            Latest Updates
          </div>
          <div className="w-full h-0.5 bg-slate-400"></div>
          <div className="">
            {NotifyDataLoading ? (
              <Loader />
            ) : (
              NotifyData?.filter(
                (data) =>
                  !data?.isDeleted &&
                  !data?.isStopPublish &&
                  (data?.isPublishToCenter ||
                    data?.isPublishToSubCenter ||
                    data?.isPublishToAll)
              )?.map((Notice) => (
                <div
                  key={Notice?.id}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: Notice?.NotifyContent,
                    }}
                    className="text-gray-700 text-sm leading-relaxed"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {(ReduxUserData?.role === "Admin" ||
        ReduxUserData?.role === "operation-manager" ||
        ReduxUserData?.role === "university-manager") && (
        <div
          className="fadeInUp FadeInbox  min-w-fit absolute top-0 
left-0 ml-32 mt-20  rounded.
rounded-lg bg-white w-auto h-auto px-8 pb-8"
        >
          <div className="text-center tracking-wide mb-2 mt-4 font-bold text-xl">
            Latest Updates
          </div>
          <div className="w-full h-0.5 bg-slate-400"></div>
          <div className="">
            {NotifyDataLoading ? (
              <Loader />
            ) : (
              NotifyData?.filter(
                (data) => !data?.isDeleted && !data?.isStopPublish
              )?.map((Notice) => (
                <div
                  key={Notice?.id}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: Notice?.NotifyContent,
                    }}
                    className="text-gray-700 text-sm leading-relaxed"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {ReduxUserData?.role === "Accuntant" && (
        <div
          className="fadeInUp FadeInbox  min-w-fit absolute top-0 
 left-0 ml-32 mt-20  rounded.
 rounded-lg bg-white w-auto h-auto px-8 pb-8"
        >
          <div className="text-center tracking-wide mb-2 mt-4 font-bold text-xl">
            Latest Updates
          </div>
          <div className="w-full h-0.5 bg-slate-400"></div>
          <div className="">
            {NotifyDataLoading ? (
              <Loader />
            ) : (
              NotifyData?.filter(
                (data) => !data?.isDeleted && !data?.isStopPublish
              )?.map((Notice) => (
                <div
                  key={Notice?.id}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: Notice?.NotifyContent,
                    }}
                    className="text-gray-700 text-sm leading-relaxed"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayWindowNotify;
