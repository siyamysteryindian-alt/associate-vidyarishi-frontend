import React, { useEffect, useState } from "react";
import { BiSolidChevronDown } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import EmailTemplate from "./EmailTemplate";

const UpdateEmailTemplate = ({
  SelectedEmailData,
  HandleCloseUpdateEmailTemplate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const options = [
    "Student Name",
    "Student Email",
    "Student Number",
    "Unique Number",
  ];

  console.log(SelectedEmailData);
  const [value, setValue] = useState("");

  const [EmailData, setEmailData] = useState({
    EmailName: SelectedEmailData?.name,
    Subject: SelectedEmailData?.subject,
  });

  const handleOnChangeInput = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemClick = (item) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems((prevItems) => [...prevItems, item]);
    }
  };

  const removeItem = (item) => {
    setSelectedItems((prevItems) => prevItems.filter((i) => i !== item));
  };

  // const filteredOptions = options.filter((option) =>
  //   option.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const HandleSubmitEmailData = async (e) => {
    e.preventDefault();
    try {
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CreateEmailTemplate`,
        {
          name: EmailData?.EmailName,
          subject: EmailData?.Subject,
          content: selectedItems,
          messageContent: value,
        },
        {
          withCredentials: true,
        }
      );

      if (Response?.data?.success) {
        toast.success(Response?.data?.message);
        // FetchNotice();
        HandleCloseCreateEmailTemplate();
      } else {
        toast.error(Response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <>
      <div className=" absolute z-30 top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-80 ">
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white dark:bg-slate-900 dark:text-white rounded-xl h-[80vh] w-[90vh] overflow-y-scroll ScrollBarStyle2 ">
            <div className=" flex justify-between items-center flex-row p-4 border-b-2 border-b-slate-400">
              <div className="text-base font-semibold">
                Create Email Template
              </div>
              <button onClick={HandleCloseUpdateEmailTemplate}>
                <IoClose
                  size={28}
                  className="text-red-600 hover:bg-red-600 hover:text-white rounded-full p-1"
                />
              </button>
            </div>
            <div>
              <form onSubmit={HandleSubmitEmailData}>
                <div className="m-6">
                  <label
                    for="EmailName"
                    className="block text-gray-70 dark:text-white0 font-bold mb-2"
                  >
                    Name
                  </label>
                  <input
                    onChange={handleOnChangeInput}
                    value={EmailData?.EmailName}
                    type="text"
                    name="EmailName"
                    id="EmailName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-2  dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                 dark:focus:border-blue-500"
                    placeholder="Ex: Email Name"
                    required
                  />
                </div>
                <div className="m-6">
                  <label
                    for="Subject"
                    className="block text-gray-70 dark:text-white0 font-bold mb-2"
                  >
                    Subject
                  </label>
                  <input
                    onChange={handleOnChangeInput}
                    value={EmailData?.Subject}
                    type="text"
                    name="Subject"
                    id="Subject"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-2 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                 dark:focus:border-blue-500"
                    placeholder="Ex: Email Subject"
                    required
                  />
                </div>
                <div className="m-6 ">
                  <div className="w-full ">
                    {/* Selected Items Display */}
                    <label
                      htmlFor="Academics"
                      onClick={() => setIsOpen(!isOpen)}
                      className="block text-gray-70 dark:text-white font-bold text-sm"
                    >
                      Email Content{" "}
                      <span className=" capitalize text-red-600">*</span>
                    </label>
                    <div
                      id="Academics"
                      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2 mt-2 dark:bg-gray-700 
                                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                                 dark:focus:border-blue-500 ${
                                   isOpen ? "border-[3px] border-black" : ""
                                 } flex  justify-start`}
                      onClick={toggleDropdown}
                    >
                      <div className="flex flex-wrap flex-col -ml-3 ">
                        <div className="flex flex-row px-3">
                          {selectedItems?.length > 0 ? (
                            selectedItems.map((item) => (
                              <div
                                key={item}
                                className="flex items-center bg-purple-100 text-purple-600 px-2 py-1 text-sm rounded-lg mr-2 mb-1"
                              >
                                <span>{item}</span>
                                <span
                                  className="ml-2 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeItem(item);
                                  }}
                                >
                                  <RiDeleteBin5Line
                                    size={16}
                                    className="text-red-700"
                                  />
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500">
                              Select options...
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="ml-2">
                        {/* <BiSolidChevronDown size={15} /> */}
                      </span>
                    </div>
                    {/* Dropdown Menu */}
                    {isOpen && (
                      <>
                        <div className="relative w-full ">
                          <div
                            className="relative left-0 mt-1 bg-white border rounded-lg shadow-md z-10 h-28 
                        overflow-auto overflow-y-scroll"
                          >
                            <ul>
                              {filteredOptions.length > 0 ? (
                                filteredOptions.map((item) => (
                                  <li
                                    key={item}
                                    className={`px-4 py-2 hover:bg-gray-200 text-sm cursor-pointer flex items-center ${
                                      selectedItems.includes(item)
                                        ? "bg-purple-100"
                                        : ""
                                    }`}
                                    onClick={() => handleItemClick(item)}
                                  >
                                    {item}
                                    {selectedItems.includes(item) && (
                                      <span className="ml-2 text-green-600">
                                        <IoMdCheckmark size={20} />
                                      </span>
                                    )}
                                  </li>
                                ))
                              ) : (
                                <li className="px-4 py-2 text-gray-500">
                                  No results found
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="m-6 h-auto">
                  <label
                    htmlFor="editor"
                    className="block text-gray-700 dark:text-white font-bold mb-2"
                  >
                    Message Content
                  </label>
                  <EmailTemplate
                    selectedItems={selectedItems}
                    value={value}
                    setValue={setValue}
                    placeholder={"Write Template For Mail"}
                  />
                </div>
                <div className="m-6">
                  <div className="flex justify-between">
                    <div></div>
                    <div>
                      <button
                        type="submit"
                        className="px-8 py-1.5 rounded-lg hover:bg-green-600 hover:text-white text-sm font-bold border-green-600 border-2 text-green-600"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateEmailTemplate;
