import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import UseGetCenterSubCenter from "../../CustomHooks/UseGetCenterSubCenter";
import UseGetSpecialization from "../../CustomHooks/UseGetSpecialization";
import UseGetProgramPagination from "../../CustomHooks/UseGetProgramPagination";
import UseGetAdmissionSession from "../../CustomHooks/UseGetAdmissionSession";
import useGetProgramType from "../../CustomHooks/UseGetProgramType";
import axios from "axios";
import toast from "react-hot-toast";
import ShowStudentIdModal from "./ShowStudentId";
import useLeads from "../../CustomHooks/Leads/useLeads";
import countriesData from "country-codes-list/dist/countriesData";

const GenerateLead = ({
  ReduxGetDataFromRedux,
  SubCenter,
  CounsellorManager,
  SubCounsellorManager,
}) => {
  const { refetchLeads } = useLeads();

  const ReduxSelectedUniversity = useSelector((state) => state.university);
  const ReduxUser = useSelector((state) => state.user);
  const Navigate = useNavigate();

  const { GetSpecializationByProgramId, SpecializationByProgramId } =
    UseGetSpecialization();
  const { GetSpecialization } = UseGetSpecialization();
  const { GetAdmissionType } = useGetProgramType();
  const { GetAdmissionSession } = UseGetAdmissionSession();
  const { GetCenter, Center, GetSubCenter } = UseGetCenterSubCenter();
  const { GetAllProgramsByPagination, AllProgramsByPagination } =
    UseGetProgramPagination();

  const [isApiUsed, setIsApiUsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const [StudentLoader, setStudentLoader] = useState(false);
  const [ShowStudentId, setShowStudentId] = useState("");

  const [form, setForm] = useState({
    leadOwner: "",
    fullName: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    course: "",
    subCourse: "",
    dob: "",
    state: "",
    district: "",
    Center: "",
  });

  const countryOptions = Object.values(countriesData).map((country) => ({
    code: `+${country.countryCallingCode}`,
  }));

  useEffect(() => {
    GetAdmissionSession();
    GetAdmissionType();
    GetCenter();
    GetSubCenter();
    GetAllProgramsByPagination();
    GetSpecialization();
  }, [ReduxSelectedUniversity?.id]);

  useEffect(() => {
    if (form.course) {
      GetSpecializationByProgramId(form.course);
    }
  }, [form.course]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setStudentLoader(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-student-lead`,
        {
          university: ReduxSelectedUniversity.id,
          Program: form.course,
          SubCourse: form.subCourse,
          FirstName: form.fullName.split(" ")[0],
          LastName: form.fullName.split(" ")[1] || "N/A",
          EmailAddress: form.email,
          DateOfBirth: form.dob,
          CountryCode: form.countryCode,
          Phone: form.mobile,
          creatorType:
            ReduxUser?.role === "center"
              ? "Center"
              : ReduxUser?.role === "subCenter"
                ? "SubCenter"
                : ReduxUser?.role === "subCounsellor"
                  ? "SubCounsellor"
                  : ReduxUser?.role,
          whoCreated: ReduxUser?.id,
          State: form.state,
          District: form.district,
        },
      );

      if (response.data.save === true) {
        toast.success(response.data.message || "Lead created successfully!");
        setTimeout(() => {
          setStudentLoader(false);
          setShowStudentId(response.data.data.StudentId);
          setIsApiUsed(response.data.universityApiUsed);
          setIsModalOpen(true);
          refetchLeads();
        }, 1000);
      } else {
        refetchLeads();
        setStudentLoader(false);
        toast.error(response.data.data.status);
      }
    } catch (error) {
      setStudentLoader(false);
      console.error("Error creating lead:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to create lead.");
      } else if (error.request) {
        toast.error("No response from server. Check your network.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <section
        className="mt-2 mx-2 rounded-lg"
        style={{ background: "var(--color-bg)" }}
      >
        <div
          className="w-full h-16 flex items-center justify-between px-6 rounded-lg mb-4"
          style={{
            background: "var(--surface)",
            boxShadow: "var(--soft-shadow)",
            borderRadius: "var(--card-radius)",
          }}
        >
          <div
            className="text-base font-bold"
            style={{ color: "var(--brand-ink)" }}
          >
            <h2 className="text-base font-bold text-gray-800">
              Generate New Lead In{" "}
              <span className="text-slate-800 text-base capitalize font-extrabold">
                ( {ReduxSelectedUniversity.name} )
                {ReduxSelectedUniversity.shortName}
              </span>
            </h2>
          </div>
          <div className="flex items-start gap-2 my-2">
            {/* <NavLink
              to={"/admin/universal-lead-generator"}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Universal Lead Genertor
            </NavLink> */}
            <NavLink
              to={`/${ReduxUser.role}/show-lead`}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Show Leads
            </NavLink>
          </div>
        </div>

        <div className="h-[calc(100vh-110px)] rounded-2xl min-h-[100px] overflow-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white dark:bg-gray-800 px-6 md:px-7 py-2 md:py-6 rounded-2xl shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lead Owner = Center */}
              <div className="w-full">
                <label
                  htmlFor="Center"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Lead Owner (Center) <span className="text-red-600">*</span>
                </label>
                <select
                  onChange={handleChange}
                  value={form.leadOwner || ""}
                  name="leadOwner"
                  id="leadOwner"
                  className="bg-white border border-gray-300 text-sm text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="">Select</option>
                  <option key={ReduxUser?._id} value={ReduxUser?._id}>
                    {ReduxUser?.name} ({ReduxUser?.role})
                  </option>
                </select>
              </div>

              <FormField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />

              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    {countryOptions.map((opt, index) => (
                      <option key={index} value={opt.code}>
                        ({opt.code})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Enter number"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="course"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Course <span className="text-red-600">*</span>
                </label>
                <select
                  onChange={handleChange}
                  value={form.course}
                  name="course"
                  id="course"
                  className="bg-white border border-gray-300 text-sm text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="">Select</option>
                  {AllProgramsByPagination?.filter(
                    (data) =>
                      data?.university?._id === ReduxSelectedUniversity?.id &&
                      !data?.isDeleted,
                  ).map((data, i) => (
                    <option key={i} value={data?._id}>
                      {data?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label
                  htmlFor="subCourse"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Stream <span className="text-red-600">*</span>
                </label>
                <select
                  onChange={handleChange}
                  value={form.subCourse}
                  name="subCourse"
                  id="subCourse"
                  className="bg-white border border-gray-300 text-sm text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="">Select</option>
                  {SpecializationByProgramId?.filter(
                    (data) =>
                      data?.university?._id === ReduxSelectedUniversity?.id &&
                      data?.Program?._id === form.course &&
                      !data?.isDeleted,
                  ).map((data, i) => (
                    <option key={i} value={data?._id}>
                      {data?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <FormField
                label="Date of Birth"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
              />
              <FormField
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
              />
              <FormField
                label="District"
                name="district"
                value={form.district}
                onChange={handleChange}
              />
            </div>

            <div className="text-right pt-8">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded-md transition-all"
              >
                Submit Lead
              </button>
            </div>
          </form>
        </div>
      </section>
      {StudentLoader && <FullPageLoader />}

      {isModalOpen && (
        // <ShowStudentIdModal onClose={handleModalClose} Show={ShowStudentId} />
        <ShowStudentIdModal
          onClose={handleModalClose}
          Show={ShowStudentId}
          isApiUsed={isApiUsed}
        />
      )}
    </>
  );
};

const FormField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
    />
  </div>
);

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-white text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default GenerateLead;
