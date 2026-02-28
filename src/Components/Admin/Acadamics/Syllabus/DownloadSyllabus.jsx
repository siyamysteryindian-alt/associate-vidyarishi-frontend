import React, { useState } from "react";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { FaFilePdf } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

const DownloadSyllabus = ({ HandleDownloadButtonClose, HandleUploadButtonOpen }) => {

  const [PdfAvailable, setPdfAvailable] = useState(true);

  return (
    <>

      <section
        className=" absolute top-0 left-0 right-0 bg-gray-900 z-30  bg-opacity-80  flex 
      justify-center h-screen"
      >
        <div className="w-[120vh] h-auto mb-10 mt-20 bg-white rounded-xl">
          <div>
            <div className="flex justify-between m-3 items-center border-b-2 border-b-slate-300">
              <div className="font-semibold ">Upload Syllabus</div>
              <button
                onClick={HandleDownloadButtonClose}
                className="bg-red-500 text-white p-3 mb-2 rounded-full"
              >
                <IoCloseSharp size={22} />
              </button>
            </div>

            <div className=" grid grid-cols-4 gap-y-6 gap-2 m-3 px-4 py-2">
              {PdfAvailable ? (
                <>
                  <div className="flex bg-slate-200 w-52 h-auto px-2 py-1 flex-col rounded-sm">
                    <div className=" bg-slate-300 font-bold w-full my-2 p-2 text-wrap line-clamp-1  text-center">
                      Semester 1
                    </div>
                    <div className=" mt-1 rounded-sm flex justify-center">
                      <BsFileEarmarkPdf size={125} className="text-red-500" />
                    </div>
                    <div className="m-1 py-1 w-48 text-wrap line-clamp-1 ">
                      {" "}
                      Lorem ipsum dolor sit amet.
                    </div>
                    <div className="m-2">
                      <button className="w-full px-2 py-1 font-semibold rounded-md justify-center flex bg-green-400">
                        Download
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex bg-slate-200 w-58 h-auto px-2 py-1 flex-col rounded-md">
                    <div className=" mt-4 rounded-sm flex justify-center">
                      <BsFileEarmarkPdf size={125} className="text-red-500" />
                    </div>
                    <div className="m-1 py-1 w-52 text-wrap text-center  ">
                      {" "}
                      SYLLABUS NOT UPLOADED
                    </div>
                    <div className="m-2">
                      <button onClick={HandleUploadButtonOpen} className="w-full px-2 py-1 font-semibold rounded-md justify-center flex text-white bg-blue-400">
                        Click Here To Upload
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DownloadSyllabus;
