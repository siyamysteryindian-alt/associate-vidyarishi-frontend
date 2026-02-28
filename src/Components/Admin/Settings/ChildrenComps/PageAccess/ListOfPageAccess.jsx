import React, { useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import ToggleButton from "../../../../../Common/ToggleButton";

const ListOfPageAccess = () => {
  // Inhouse Status
  const [InhouseStatus, setInhouseStatus] = useState("No");
  const isChecked = InhouseStatus === "Yes";

  const HandleInhouseStatusYes = () => {
    setInhouseStatus("Yes");
    console.log(isChecked);
  };
  const HandleInhouseStatusNo = () => {
    setInhouseStatus("No");
    console.log(isChecked);
  };

  // Center Status
  const [CenterStatus, setCenterStatus] = useState("No");
  const isChecked2 = CenterStatus === "Yes";

  const HandleCenterStatusYes = () => {
    setCenterStatus("Yes");
    console.log(isChecked2);
  };
  const HandleCenterStatusNo = () => {
    setCenterStatus("No");
    console.log(isChecked2);
  };

  // Sub Center Status
  const [SubCenterStatus, setSubCenterStatus] = useState("No");

  const HandleSubCenterStatusYes = () => {
    setSubCenterStatus("Yes");
  };
  const HandleSubCenterStatusNo = () => {
    setSubCenterStatus("No");
  };

  // Student Status
  const [StudentStatus, setStudentStatus] = useState("No");

  const HandleStudentStatusYes = () => {
    setStudentStatus("Yes");
  };
  const HandleStudentStatusNo = () => {
    setStudentStatus("No")
  };

  return (
    <>
      <div className="py-2.5 px-4">
        <div className="h-auto w-auto">
          {/* <!-- Table --> */}
          <table className=" min-w-full max-w-screen-xl  overflow-x-scroll text-base text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {/* <thead className="text-sm sticky top-0 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="p-2 mt-1">
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Template Name
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      In House
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Center
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Sub Center
                    </h1>
                  </div>
                </th>
                <th scope="col" className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      Student
                    </h1>
                  </div>
                </th>
              </tr>
            </thead> */}
            <tbody>
              {/* <tr
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b
                     dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  E-Books (Download)
                </th>
                <td className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      <ToggleButton
                        ClickYes={HandleInhouseStatusYes}
                        ClickNo={HandleInhouseStatusNo}
                        StateUpdate={InhouseStatus}
                      />
                      <span>
                        {isChecked ? <span>Yes</span> : <span>No</span>}
                      </span>
                    </h1>
                  </div>{" "}
                </td>
                <td className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      <ToggleButton
                        ClickYes={HandleCenterStatusYes}
                        ClickNo={HandleCenterStatusNo}
                        StateUpdate={CenterStatus}
                      />
                      <span>
                        {isChecked2 ? <span>Yes</span> : <span>No</span>}
                      </span>
                    </h1>
                  </div>{" "}
                </td>
                <td className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      <ToggleButton
                        ClickYes={HandleSubCenterStatusYes}
                        ClickNo={HandleSubCenterStatusNo}
                        StateUpdate={SubCenterStatus}
                      />
                      <span>
                        {SubCenterStatus === "Yes" ? (
                          <span>Yes</span>
                        ) : (
                          <span>No</span>
                        )}
                      </span>
                    </h1>
                  </div>{" "}
                </td>
                <td className="px-4 py-2">
                  <div className="w-full max-w-lg">
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                      <ToggleButton
                        ClickYes={HandleStudentStatusYes}
                        ClickNo={HandleStudentStatusNo}
                        StateUpdate={StudentStatus}
                      />
                      <span>
                        {StudentStatus === "Yes" ? (
                          <span>Yes</span>
                        ) : (
                          <span>No</span>
                        )}
                      </span>
                    </h1>
                  </div>{" "}
                </td>
              </tr> */}
              <div className=" text-xl text-black text-center font-bold" >
                We Are Working On It
              </div>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListOfPageAccess;
