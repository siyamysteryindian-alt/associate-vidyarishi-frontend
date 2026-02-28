import React, { useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
 import image from "../../../../../../public/logo.png";
import { BsFillPrinterFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { RiEditLine, RiMailSendFill } from "react-icons/ri";
import ToggleButton from "../../../../../Common/ToggleButton";
import Entrollmentno from "../ApplicationComponent/Entrollmentno";
import OAnumber from "../ApplicationComponent/OAnumber";

const Filter1_applications = () => {
  // Login permission
  const [LoginStatusToggleButton, setLoginStatusToggleButton] = useState("No");

  const HandleLoginStatusToggleYes = () => {
    setLoginStatusToggleButton("Yes");
  };
  const HandleLoginStatusToggleNo = () => {
    setLoginStatusToggleButton("No");
  };

  // id permission
  const [IdStatusToggleButton, setIdStatusToggleButton] = useState("Yes");

  const HandleIdStatusToggleYes = () => {
    setIdStatusToggleButton("Yes");
  };
  const HandleIdStatusToggleNo = () => {
    setIdStatusToggleButton("No");
  };

  // OAnumber Button Open
  const [OANumberBooleanButton, setOANumberBooleanButton] = useState(false);

  const HandleOANumberOpen = () => {
    setOANumberBooleanButton(true);
  };
  const HandleOANumberClose = () => {
    setOANumberBooleanButton(false);
  };

  // Enrollment number Button Open
  const [EnrollmentNumberBooleanButton, setEnrollmentNumberBooleanButton] =
    useState(false);

  const HandleEnrollmentNumberOpen = () => {
    setEnrollmentNumberBooleanButton(true);
  };
  const HandleEnrollmentNumberClose = () => {
    setEnrollmentNumberBooleanButton(false);
  };

  // Enreollment & OA data
  const [EnrollmentNo, setEnrollmentNo] = useState("");
  const [OAData, setOAData] = useState("");

  // For handling Enrollment Number as a string value
  const HandlEnrollment = (e) => {
    e.preventDefault();
    setEnrollmentNo(e.target.value);
    console.log("EnrollmentNo:", e.target.value);
  };

  // For handling OA Number as a string value
  const HandlOANumber = (e) => {
    e.preventDefault();
    setOAData(e.target.value);
    console.log("OAData:", e.target.value);
  };

  return (
    <>
      <tbody className="overflow-x-scroll ">
        <tr className="bg-white text-sm border-b-4 border-b-slate-300 m-2 ">
          {/* SR NO */}
          <th
            scope="row"
            className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
          >
            <div className="w-[5vh] flex gap-y-1 flex-col items-start">
              <div className="text-base text-gray-900">1</div>
            </div>
          </th>

          {/* Actions */}
          <td className="px-4 py-2  align-top ">
            <div className="w-[15vh] flex gap-3 flex-row">
              <button
                title="Edit Student"
                className="font-medium text-green-600 dark:text-green-500 hover:underline"
              >
                <AiTwotoneEdit size={18} />
              </button>
              <button
                title="Delete Student"
                className="font-medium text-red-600 dark:text-red-500 hover:underline"
              >
                <MdDelete size={18} />
              </button>
              <button
                title="Send Mail"
                className="font-medium text-blue-600 dark:text-red-500 hover:underline"
              >
                <RiMailSendFill size={18} />
              </button>
            </div>
          </td>

          {/* Photo */}
          <td className="px-2 py-2 align-top ">
            <div className="w-[12vh] flex gap-y-1 flex-row">
              <img src={image} alt="" className="w-20 h-20 border " />
            </div>
          </td>

          {/* Student */}
          <th
            scope="row"
            className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
          >
            <div className="w-[20vh] flex gap-y-1 flex-col items-start">
              <div className="text-base text-gray-900">
                <span>filter 1</span>
                <span> (00045)</span>
              </div>
              <div className="text-xs">
                <span>DOB: </span>
                <span>12-OCT-2003</span>
              </div>
              <div className="text-xs">
                <span>Contact: </span>
                <span>1234567890</span>
              </div>
              <div className="text-xs">
                <span>Father's Name: </span>
                <span>N/A</span>
              </div>
            </div>
          </th>

          {/* Status */}
          <td className="px-4 py-2 align-top ">
            <div className="w-[35vh] flex gap-y-1 flex-col">
              <div>
                <span className="text-black font-semibold">Status:</span>
                <span className="text-green-600 font-bold">
                  {" "}
                  Completed (10-07-2024)
                </span>
              </div>
              <div>
                <span className="text-black font-semibold">
                  Processed by Center on:
                </span>
                <span className="text-green-600 font-bold"> 10-07-2024</span>
              </div>
              <div>
                <span className="text-black font-semibold">
                  Document Verified On:
                </span>
                <span className="text-green-600 font-bold"> 07-08-2024</span>
              </div>
              <div>
                <span className="text-black font-semibold">
                  Processed to University on:
                </span>
                <span className="text-green-600 font-bold"> 07-08-2024</span>
              </div>
              <div>
                <span className="text-black font-semibold">
                  Admission Cancel on:
                </span>
                <span className="text-green-600 font-bold"> 13-09-2024</span>
              </div>
              <div>
                <span className="text-black font-semibold">Processed on:</span>
                <span className="text-red-600 font-bold"> Not Processed</span>
              </div>
              <div className="flex items-center my-2 gap-2">
                <input type="checkbox" name="CancelAddmission" id="" />

                <div>Admission Cancel ?</div>
              </div>
            </div>
          </td>

          {/* Enrollment No */}
          <td className="px-4 py-2 align-top ">
            <div className="w-[15vh] flex gap-3 items-center justify-center flex-row">
              <div>{EnrollmentNo}</div>
              <div>
                <button
                  onClick={HandleEnrollmentNumberOpen}
                  title="Edit Enrollment"
                  className="font-medium text-blue-600 dark:text-red-500 hover:underline"
                >
                  <RiEditLine />
                </button>
              </div>
            </div>
          </td>

          {/* OA Number */}
          <td className="px-4 py-2 align-top">
            <div className="w-auto font-bold flex gap-3 items-center justify-center flex-row dark:text-white">
              <div>{StudentData?.applicationNumber}</div>
              <div>
                {/* <button
                            onClick={HandleOANumberOpen}
                            title="Edit OA Number"
                            className="font-medium text-blue-600 dark:text-red-500 hover:underline"
                          >
                            <RiEditLine />
                          </button> */}
              </div>
            </div>
          </td>

          {/* Admission Details */}
          <td className="px-4 py-2 align-top">
            <div className="w-40 flex gap-y-1 flex-col">
              <div>Session: Jul-24</div>
              <div>Type: Fresh</div>
              <div>Program: BBA (General)</div>
              <div>Sem: 1</div>
            </div>
          </td>

          {/* Permissions */}
          {/* <td className="px-4 py-2 align-top">
            <div className="w-[15vh] flex gap-y-1 flex-row">
              <ToggleButton
                ClickYes={HandleLoginStatusToggleYes}
                ClickNo={HandleLoginStatusToggleNo}
                StateUpdate={LoginStatusToggleButton}
                NoName={"Login"}
                YesName={"Login"}
              />
              {LoginStatusToggleButton === "Yes" ? "yes" : "No"}
            </div>

            {EnrollmentNo !== "" ? (
              <>
                <div className="w-[15vh] flex gap-y-1 flex-row">
                  <ToggleButton
                    ClickYes={HandleIdStatusToggleYes}
                    ClickNo={HandleIdStatusToggleNo}
                    StateUpdate={IdStatusToggleButton}
                    NoName={"Id"}
                    YesName={"Id"}
                  />
                  {IdStatusToggleButton === "Yes" ? "yes" : "No"}
                </div>
              </>
            ) : (
              <>
                <div>Id Is Not Available</div>
              </>
            )}
          </td> */}

          {/* Center Details */}
          <td className="px-4 py-2 align-top">
            <div className="w-40 flex gap-y-1 flex-col">
              <div>Center Name: SV Academy </div>
              <div>Center Code: 0044</div>
              <div>Counsellor (TC001)</div>
            </div>
          </td>

          {/* Form */}
          <td className="px-4 py-2  align-center ">
            <div className="w-[20vh]">
              <button
                title="Download Application"
                className="font-medium bg-blue-400 m-1 rounded-lg text-white text-sm
                             px-10 py-2 hover:underline"
              >
                <div className="flex justify-center items-center gap-1.5">
                  <BsFillPrinterFill size={15} /> Print
                </div>
              </button>
              <button
                title="Print Application"
                className="font-medium bg-green-400 m-1 text-center rounded-lg text-white text-sm
                             px-6 py-2 hover:underline"
              >
                <div className="flex justify-center items-center gap-1.5">
                  <FaDownload size={15} /> Download
                </div>
              </button>
            </div>
          </td>
        </tr>
      </tbody>

      {OANumberBooleanButton && (
        <OAnumber
          HandleOANumberClose={HandleOANumberClose}
          HandlOANumber={HandlOANumber}
          OAData={OAData}
        />
      )}
      {EnrollmentNumberBooleanButton && (
        <Entrollmentno
          HandleEnrollmentNumberClose={HandleEnrollmentNumberClose}
          EnrollmentNo={EnrollmentNo}
          HandlEnrollment={HandlEnrollment}
        />
      )}
    </>
  );
};

export default Filter1_applications;
