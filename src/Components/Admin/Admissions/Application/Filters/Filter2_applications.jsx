import React, { useEffect, useState } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
 import image from "../../../../../../public/logo.png";
import { BsFillPrinterFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { RiEditLine, RiMailSendFill } from "react-icons/ri";
import ToggleButton from "../../../../../Common/ToggleButton";
import Entrollmentno from "../ApplicationComponent/Entrollmentno";
import { useSelector } from "react-redux";

const Filter2_applications = ({
  FetchAllStudentByPagination,
  handlePageChange,
  AllStudentListData,
  AllStudentCurrentPage,
  AllStudentTotalPages,
  AllStudentLimit,
  AllStudentLoading,
  AllStudentTotalDocs,
  searchkey,
}) => {
  useEffect(() => {
    FetchAllStudentByPagination(1, 100, searchkey);
    console.log(searchkey);
  }, [searchkey]);

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

  // Extracting DATE
  const ExtractDateFromDb = (submitFormDate) => {
    if (!submitFormDate) {
      return null;
    }
    const datePart = submitFormDate.split(",")[0];

    return datePart;
  };
  const ReduxUser = useSelector((state) => state.user);
  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  return (
    <>
      <tbody className="overflow-x-scroll ">
        {AllStudentListData?.length !== 0 ? (
          <>
            {AllStudentListData?.map(
              (StudentData, StudentIndex) =>
                StudentData?.university?._id ===
                  UniversityGetDataFromRedux?.id && (
                  <tr
                    key={StudentIndex}
                    className="bg-white dark:bg-slate-900 dark:text-white text-sm border-b-4 border-b-slate-300 m-2 "
                  >
                    {/* SR NO */}
                    {/* <th
                      scope="row"
                      className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                    >
                      <div className="w-[5vh] flex gap-y-1 flex-col items-start">
                        <div className="text-base dark:text-white text-gray-900">
                          {StudentIndex + 1}
                        </div>
                      </div>
                    </th> */}

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
                        <img
                          src={StudentData?.documents?.photo?.studentPhoto}
                          alt=""
                          className="w-20 h-20 border "
                        />
                      </div>
                    </td>

                    {/* Student */}
                    <th
                      scope="row"
                      className="px-4 py-2 whitespace-nowrap dark:text-white align-top"
                    >
                      <div className="w-[20vh] flex gap-y-1 flex-col items-start">
                        <div className="text-base text-gray-900">
                          <span>{StudentData?.fullName}</span>
                          {/* <span> (00045)</span> */}
                        </div>
                        <div className="text-xs">
                          <span>DOB: </span>
                          <span>{StudentData?.dateOfBirth}</span>
                        </div>
                        <div className="text-xs">
                          <span>Contact: </span>
                          <span>{StudentData?.personalDetails?.phone}</span>
                        </div>
                        <div className="text-xs">
                          <span>Father's Name: </span>
                          <span>{StudentData?.fatherName}</span>
                        </div>
                      </div>
                    </th>

                    {/* Status */}
                    <td className="px-4 py-2 align-top ">
                      <div className="w-[35vh] flex gap-y-1 flex-col">
                        {/* Status */}
                        {StudentData?.status?.TrackStatus !== "" && (
                          <div>
                            <span className="text-black dark:text-white font-semibold">
                              Status:
                            </span>
                            <span className="text-green-600 font-bold">
                              {" "}
                              {StudentData?.status?.TrackStatus <= 3 ? (
                                <>
                                  In Draft @{StudentData?.status?.TrackStatus}{" "}
                                </>
                              ) : (
                                <>
                                  Completed (
                                  {ExtractDateFromDb(
                                    StudentData?.status?.submitedFormDate
                                  )}
                                  )
                                </>
                              )}
                            </span>
                          </div>
                        )}

                        {/* THIS FIELD IS FOR CENTER JUST TRYING AT ADMIN */}

                        {ReduxUser.role === "center" && (
                          <>
                            {StudentData?.status?.processedbyCenteron ===
                              "" && (
                              <div className="flex items-center my-2 gap-2">
                                <input
                                  onChange={(e) => {
                                    e.preventDefault();
                                    HandleInputData(e),
                                      setCompleteStudentData(StudentData);
                                  }}
                                  type="checkbox"
                                  name="MarkAsByCenter"
                                />
                                <div>Mark As Processed By Center?</div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Process By center */}
                        {ReduxUser.role !== "center" && (
                          <>
                            {StudentData?.status?.processedbyCenteron === "" &&
                              StudentData?.status?.submitedFormDate !== "" && (
                                <div className="flex items-center my-2 gap-2">
                                  <div>
                                    <span className="text-black dark:text-white font-semibold">
                                      Processed On:
                                    </span>
                                    <span className="text-red-600 font-bold">
                                      Not Processed
                                    </span>
                                  </div>
                                </div>
                              )}
                          </>
                        )}

                        {StudentData?.status?.processedbyCenteron && (
                          <div>
                            <span className="text-black dark:text-white font-semibold">
                              Processed by Center on:
                              <span className="text-green-600 font-bold">
                                {" "}
                                ({" "}
                                {ExtractDateFromDb(
                                  StudentData?.status?.processedbyCenteron
                                )}{" "}
                                )
                              </span>
                            </span>
                          </div>
                        )}

                        {/* Document Verification */}

                        {StudentData?.status?.documentVerifiedOn !== "" ||
                          (StudentData?.status?.processedbyCenteron && (
                            <div>
                              <span className="text-black dark:text-white font-semibold">
                                Document Verified On:
                              </span>
                              {ReduxUser.role === "center" &&
                              !StudentData?.documents?.isPendency &&
                              !StudentData?.documents?.isApproved ? (
                                <>
                                  <span className="text-green-600 font-bold">
                                    {" "}
                                    <button>pending</button>
                                  </span>
                                </>
                              ) : (
                                <>
                                  {!StudentData?.documents?.isPendency &&
                                    !StudentData?.documents?.isApproved && (
                                      <>
                                        <span className="text-green-600 font-bold">
                                          {" "}
                                          <button
                                            onClick={() => {
                                              HandleReviewDocOpen(),
                                                setCompleteStudentData(
                                                  StudentData
                                                );
                                            }}
                                          >
                                            Review
                                          </button>
                                        </span>
                                      </>
                                    )}
                                </>
                              )}
                              {StudentData?.documents?.isPendency && (
                                <>
                                  {" "}
                                  <span className="text-red-600 font-bold">
                                    {" "}
                                    <button
                                      onClick={() => {
                                        HandleViewPendencyOpen(),
                                          setCompleteStudentData(StudentData);
                                      }}
                                    >
                                      Pendency
                                    </button>
                                  </span>
                                </>
                              )}
                              {StudentData?.documents?.isApproved && (
                                <>
                                  <span className="text-green-600 font-bold">
                                    Verified On (
                                    {ExtractDateFromDb(
                                      StudentData?.documents?.isApprovedDate
                                    )}
                                    )
                                  </span>
                                </>
                              )}

                              <button></button>
                            </div>
                          ))}

                        {/* THIS FIELD IS FOR UNIVERSITY JUST TRYING AT ADMIN */}
                        {ReduxUser.role !== "center" && (
                          <>
                            {StudentData?.status?.processedtoUniversityon ===
                              "" &&
                              StudentData?.documents?.isApproved && (
                                //  || StudentData?.status?.documentVerifiedOn !== ""
                                <div className="flex items-center my-2 gap-2">
                                  <input
                                    onChange={(e) => {
                                      HandleInputData(e),
                                        setCompleteStudentData(StudentData);
                                    }}
                                    type="checkbox"
                                    name="MarkAsByUniversity"
                                  />
                                  <div>Mark As Processed By Univesity ?</div>
                                </div>
                              )}
                          </>
                        )}

                        {/* Processed To University */}

                        <>
                          {StudentData?.status?.processedtoUniversityon !==
                            "" && StudentData?.documents?.isApproved ? (
                            <>
                              <div>
                                <span className="text-black dark:text-white font-semibold">
                                  Processed to University on:
                                </span>
                                <span className="text-green-600 font-bold">
                                  {" "}
                                  (
                                  {ExtractDateFromDb(
                                    StudentData?.status?.processedtoUniversityon
                                  )}
                                  )
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              {StudentData?.documents?.isApproved && (
                                <div>
                                  <span className="text-black dark:text-white font-semibold">
                                    Processed to University on:
                                  </span>
                                  <span className="text-red-600 font-bold">
                                    Not Processed
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </>

                        {/* admission cancel date */}
                        {StudentData?.status?.admissionCancelDate !== " " ||
                          (StudentData?.status?.processedtoUniversityon && (
                            <div>
                              <span className="text-black dark:text-white font-semibold">
                                Admission Cancel on:
                              </span>
                              <span className="text-green-600 font-bold">
                                {" "}
                                {StudentData?.status?.admissionCancelDate}
                              </span>
                            </div>
                          ))}

                        {/* Delete Toggle */}
                        {ReduxUser.role !== "center" && (
                          <>
                            {StudentData?.status?.admissionCancelDate === "" &&
                              StudentData?.status?.processedbyCenteron &&
                              StudentData?.status?.processedtoUniversityon &&
                              StudentData?.documents?.isApproved && (
                                <div className="flex items-center my-2 gap-2">
                                  <input
                                    type="checkbox"
                                    name="CancelAddmission"
                                    id=""
                                  />

                                  <div>Admission Cancel ?</div>
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    </td>

                    {/* Enrollment No */}
                    <td className="px-4 py-2 align-top ">
                      <div className="w-[15vh] flex gap-3 items-center justify-center flex-row dark:text-white">
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
                      <div className="w-auto flex gap-y-1 flex-col">
                        <div>
                          Session: {StudentData?.admissionSession?.name}
                        </div>
                        <div>Type: {StudentData?.admissionType?.name}</div>
                        <div>
                          Program: {StudentData?.Course?.shortName} (
                          {StudentData?.SubCourse?.shortName})
                        </div>
                        <div>Sem: {StudentData?.semester}</div>
                      </div>
                    </td>

                    {/* Permissions */}
                    {/* <td className="px-4 py-2 align-top">
                      <div className="w-auto flex gap-y-1 flex-row">
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
                        <div>Center Name: {StudentData?.center?.name} </div>
                        <div>Center Code: {StudentData?.center?.code}</div>
                        <div>Counsellor (TC001)</div>
                      </div>
                    </td>

                    {/* Form */}
                    <td className="px-4 py-2  align-center ">
                      <div className="w-40">
                        <button
                          title="Download Application"
                          className="font-medium bg-blue-400 m-1 rounded-lg text-white text-sm
                               px-10 py-2 hover:underline"
                        >
                          <div className="flex justify-center items-center gap-1.5">
                            <BsFillPrinterFill size={15} /> Print
                          </div>
                        </button>
                        {/* <button
                  title="Print Application"
                  className="font-medium bg-green-400 m-1 text-center rounded-lg text-white text-sm
                               px-6 py-2 hover:underline"
                >
                  <div className="flex justify-center items-center gap-1.5">
                    <FaDownload size={15} /> Download
                  </div>
                </button> */}
                      </div>
                    </td>
                  </tr>
                )
            )}

            {/* not created any condition */}

            {AllStudentListData?.some(
              (data) => data.university?._id === UniversityGetDataFromRedux?.id
            ) ? (
              <></>
            ) : (
              <div className=" absolute">
                <div
                  className="flex justify-center items-center h-[60vh] 
             w-[150vh] relative top-0 left-0 "
                >
                  Not Created ANY Data Inside This University
                </div>
              </div>
            )}

            {/* select university */}
            {AllStudentListData?.some(
              (data) => data.university?._id === ""
            ) && (
              <>
                <div className=" absolute">
                  <div
                    className="flex justify-center items-center h-[60vh] 
               w-[150vh] relative top-0 left-0 "
                  >
                    Select The University
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className=" absolute">
              <div
                className="flex justify-center items-center h-[60vh] 
                 w-[150vh] relative -top-20 left-0 font-bold tracking-wider text-slate-500 "
              >
                Not Found
              </div>
            </div>
          </>
        )}
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

export default Filter2_applications;
