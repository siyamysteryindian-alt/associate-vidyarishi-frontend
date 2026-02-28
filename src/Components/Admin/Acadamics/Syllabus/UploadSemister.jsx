import React from "react";
import { IoCloseSharp } from "react-icons/io5";

const UploadSemister = ({ HandleUploadButtonClose }) => {
  return (
    <>
      <section
        className=" absolute top-0 left-0 right-0 bg-gray-900 z-30 bg-opacity-80 flex 
      justify-center h-screen"
      >
        <div className="w-[90vh] h-[31vh] mt-20 bg-white rounded-xl">
          <div>
            <div className="flex justify-between m-3 items-center border-b-2 border-b-slate-300">
              <div className="font-semibold ">Upload Syllabus</div>
              <button
                onClick={HandleUploadButtonClose}
                className="bg-red-500 text-white p-3 mb-2 rounded-full"
              >
                <IoCloseSharp />
              </button>
            </div>

            <div className="px-10 pb-3">
              <div className="flex justify-between flex-row gap-14 space-y-6">
                <div>
                  <label
                    htmlFor="Semester"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Semester
                  </label>
                  <select
                    id="Semester"
                    name="Semester"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option selected>Choose a Semester</option>
                    <option value="US">Semester 1</option>
                    <option value="CA">Semester 2</option>
                    <option value="FR">Semester 3</option>
                    <option value="DE">Semester 4</option>
                    <option value="DE">Semester 5</option>
                    <option value="DE">Semester 6</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="semisterFile"
                  >
                    {/* Upload file */}
                  </label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer 
                    bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help"
                    id="semisterFile"
                    type="file"
                    required
                    name="semisterFile"
                  />
                  <p
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    SVG, PNG, JPG or GIF (MAX. 800x400px).
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right m-3">
              <button className="bg-green-600 px-6 py-2 text-white font-semibold rounded-lg">
                Upload Syllabus
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UploadSemister;
