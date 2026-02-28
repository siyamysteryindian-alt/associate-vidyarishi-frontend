import React, { useEffect, useState, useMemo } from "react";
import UseGetCenterSubCenter from "../CustomHooks/UseGetCenterSubCenter";
import UseGetLoggedUser from "../CustomHooks/UseGetLoggedUser";

const AllotCenter = ({
  HandleOnClickUpdatePushCenter,
  HandleRemoveCenter,
  FetchTheListData,
  HandleCloseAllotCenterToCounsellor,
  AssignUser,
}) => {
  const { GetCenter, CenterError, CenterLoading, Center } =
    UseGetCenterSubCenter();

  // Fetch centers on mount
  useEffect(() => {
    GetCenter();
  }, []);

  // State for tracking assigned centers
  const [clickedSequence, setClickedSequence] = useState([]);

  // Memoized list of assigned center IDs
  const checkingAllotedData = useMemo(
    () => FetchTheListData?.allotedCenter?.map((item) => item._id) || [],
    [FetchTheListData]
  );

  // Set initial clickedSequence based on assigned centers
  useEffect(() => {
    setClickedSequence(FetchTheListData?.allotedCenter || []);
  }, [FetchTheListData]);

  const { GetLoginUserDetails, GetLoggedUserLoader, LoggedUserData } =
    UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
  }, []);

  // Function to assign a center
  const handleAssignUniversity = (center) => {
    if (!checkingAllotedData.includes(center._id)) {
      setClickedSequence((prev) => [...prev, center]);
      HandleOnClickUpdatePushCenter(center);
    }
  };

  // Function to remove a center
  const handleRemoveUniversity = (center) => {
    setClickedSequence((prev) =>
      prev.filter((item) => item._id !== center._id)
    );
    HandleRemoveCenter(center);
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 dark:text-white w-full max-w-5xl rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[85vh] border border-gray-300 dark:border-gray-700">
        {/* Header */}
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Allot Center
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Counsellor –{" "}
              <span className="font-semibold">
                {AssignUser?.counsellors?.name}
              </span>
            </p>
          </div>

          <button
            onClick={HandleCloseAllotCenterToCounsellor}
            className="text-3xl text-red-500 hover:text-red-700 transition transform hover:scale-110"
          >
            &times;
          </button>
        </header>

        <div className="flex flex-col gap-10">
          {/* Assigned Centers */}
          {clickedSequence.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-green-600">
                Assigned Centers
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {clickedSequence.map((data) => (
                  <div
                    key={`assigned-${data._id}`}
                    className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md p-3 flex flex-col items-center hover:shadow-xl transition"
                  >
                    <div className="w-full h-28 rounded-lg overflow-hidden">
                      <img
                        src={data?.photo || "https://via.placeholder.com/150"}
                        className="w-full h-full object-cover"
                        alt={data?.name || "Center"}
                      />
                    </div>

                    <div className="mt-3 font-medium text-gray-800 dark:text-gray-200">
                      {data?.name}
                    </div>

                    <button
                      onClick={() => handleRemoveUniversity(data)}
                      className="mt-3 w-full py-2 text-sm font-bold text-red-600 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900 transition"
                    >
                      Remove Center
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Not Assigned Centers */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-blue-600">
              Available Centers
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Center.filter(
                (data) => !checkingAllotedData.includes(data._id)
              ).map((data) => (
                <div
                  key={`available-${data._id}`}
                  className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md p-3 flex flex-col items-center hover:shadow-2xl transition"
                >
                  <div className="w-full h-28 rounded-lg overflow-hidden">
                    <img
                      src={data?.photo || "https://via.placeholder.com/150"}
                      className="w-full h-full object-cover"
                      alt={data?.name || "Center"}
                    />
                  </div>

                  <div className="mt-3 font-medium text-gray-800 dark:text-gray-200">
                    {data?.name}
                  </div>

                  <button
                    onClick={() => handleAssignUniversity(data)}
                    className="mt-3 w-full py-2 text-sm font-bold text-green-600 border border-green-300 dark:border-green-600 rounded-md hover:bg-green-50 dark:hover:bg-green-900 transition"
                  >
                    Assign Center
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default AllotCenter;
