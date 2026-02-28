import React, { useEffect, useState } from "react";
import useGetUniversity from "../CustomHooks/UseGetUniversities";
import UseGetLoggedUser from "../CustomHooks/UseGetLoggedUser";
import Loader from "./Loader";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const AllotUniversity = ({
  FetchTheListData,
  OnCloseAllotUniversity,
  HandleOnClickUpdatePushUniversity,
  HandleRemoveUniversity,
}) => {
  const { GetUniversity, UniversityLoading, universities } = useGetUniversity();

  const { GetLoginUserDetails, GetLoggedUserLoader, LoggedUserData } =
    UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
  }, []);

  // State for tracking allotted and clicked sequence
  const [clickedSequence, setClickedSequence] = useState([]);
  const [checkingAllotedData, setCheckingAllotedData] = useState([]);

  // Populate already allotted data
  useEffect(() => {
    const allotedIds =
      FetchTheListData?.allotedUniversities?.map((item) => item._id) || [];
    setCheckingAllotedData(allotedIds);
    setClickedSequence(FetchTheListData?.allotedUniversities || []);
  }, [FetchTheListData]);

  const UserReduxData = useSelector((state) => state?.user);

  // Fetch university data
  useEffect(() => {
    if (UserReduxData?.id) {
      GetUniversity();
      HandleOnClickUpdatePushUniversity();
    }
  }, [UserReduxData?.id.trim() !== ""]);

  // Handle assigning a university
  const handleAssignUniversity = (university) => {
    if (
      LoggedUserData?.role === "center" ||
      LoggedUserData?.role === "subCenter" ||
      LoggedUserData?.role === "Counsellor" ||
      LoggedUserData?.role === "subCounsellor" ||
      LoggedUserData?.role === "university-manager" ||
      LoggedUserData?.role === "operation-manager"
    ) {
      console.log("university", university);
      const hasAccess = LoggedUserData?.allotedUniversities?.some((univers) => {
        return univers?._id === university?._id;
      });

      if (hasAccess) {
        setClickedSequence((prev) => [...prev, university]);
        setCheckingAllotedData((prev) => [...prev, university._id]);
        HandleOnClickUpdatePushUniversity(university, true);
      } else {
        toast("Contact Admin For The University!", {
          icon: "⚠",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } else if (LoggedUserData?.role === "Admin") {
      setClickedSequence((prev) => [...prev, university]);
      setCheckingAllotedData((prev) => [...prev, university._id]);
      HandleOnClickUpdatePushUniversity(university, true);
    } else {
      toast("Contact Admin For The University!", {
        icon: "⚠",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  // Handle removing a university
  const handleRemoveUniversity = (university) => {
    if (
      LoggedUserData?.role === "center" ||
      LoggedUserData?.role === "subCenter" ||
      LoggedUserData?.role === "Counsellor" ||
      LoggedUserData?.role === "subCounsellor" ||
      LoggedUserData?.role === "university-manager" ||
      LoggedUserData?.role === "operation-manager"
    ) {
      console.log("university", university);
      const hasAccess = LoggedUserData?.allotedUniversities?.some((univers) => {
        return univers?._id === university?._id;
      });

      if (hasAccess) {
        setClickedSequence((prev) =>
          prev.filter((item) => item._id !== university._id)
        );
        setCheckingAllotedData((prev) =>
          prev.filter((id) => id !== university._id)
        );
        HandleRemoveUniversity(university);
      } else {
        toast("Contact Admin For The University!", {
          icon: "⚠",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } else if (LoggedUserData?.role === "Admin") {
      setClickedSequence((prev) =>
        prev.filter((item) => item._id !== university._id)
      );
      setCheckingAllotedData((prev) =>
        prev.filter((id) => id !== university._id)
      );
      HandleRemoveUniversity(university);
    } else {
      toast("Contact Admin For The University!", {
        icon: "⚠",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 dark:text-white w-full max-w-5xl rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 border-b pb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Allot University
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              To <span className="font-semibold">{FetchTheListData?.role}</span>
            </p>
          </div>

          <button
            onClick={OnCloseAllotUniversity}
            className="text-3xl font-bold text-red-500 hover:text-red-700 transition transform hover:scale-110"
          >
            ×
          </button>
        </header>

        <div className="space-y-12">
          {/* Assigned Universities */}
          {clickedSequence.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-2 rounded-lg">
                Assigned Universities
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {clickedSequence.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                  >
                    <div className="w-full h-28 overflow-hidden">
                      <img
                        src={item?.photo || "https://via.placeholder.com/150"}
                        className="w-full h-full object-cover"
                        alt={item?.name}
                      />
                    </div>

                    <div className="px-3 pb-3 pt-2">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm border-b pb-1">
                        {item?.name}
                      </p>

                      <button
                        onClick={() => handleRemoveUniversity(item)}
                        className="mt-3 w-full py-2 rounded-md text-sm font-semibold text-red-600 border border-red-300 hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-500 transition"
                      >
                        Remove University
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Available Universities */}
          <section>
            <h2 className="text-lg font-semibold mb-4 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-2 rounded-lg">
              Available Universities
            </h2>

            {UniversityLoading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {universities
                  ?.filter((u) => !checkingAllotedData.includes(u._id))
                  .map((item, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-2xl transition overflow-hidden"
                    >
                      <div className="w-full h-28 overflow-hidden">
                        <img
                          src={item?.photo || "https://via.placeholder.com/150"}
                          className="w-full h-full object-cover"
                          alt={item?.name}
                        />
                      </div>

                      <div className="px-3 pb-3 pt-2">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm border-b pb-1">
                          {item?.name}
                        </p>

                        <button
                          onClick={() => handleAssignUniversity(item)}
                          className="mt-3 w-full py-2 rounded-md text-sm font-semibold text-green-600 border border-green-300 hover:bg-green-50 dark:hover:bg-green-900 dark:border-green-500 transition"
                        >
                          Assign University
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default AllotUniversity;
