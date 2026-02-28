import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UseGetAdmissionSession from "../../../CustomHooks/UseGetAdmissionSession";
import UseGetProgramPagination from "../../../CustomHooks/UseGetProgramPagination";
import UseGetSpecialization from "../../../CustomHooks/UseGetSpecialization";
import useGetProgramType from "../../../CustomHooks/UseGetProgramType";

const StudentApplicationForm = () => {
  const ReduxSelectedUniversity = useSelector((state) => state.university);
  const { GetAdmissionSession, AdmissionSession } = UseGetAdmissionSession();
  const { GetAdmissionType, AdmissionType } = useGetProgramType();
  const { GetAllProgramsByPagination, AllProgramsByPagination } =
    UseGetProgramPagination();
  const { GetSpecializationByProgramId, SpecializationByProgramId } =
    UseGetSpecialization();

  const [form, setForm] = useState({
    admissionSession: "",
    admissionType: "",
    course: "",
    specialization: "",
    semester: "",
    studentName: "",
    dob: "",
    email: "",
    whatsapp: "",
    transactionId: "",
    paymentType: "",
    transactionDate: "",
    amount: "",
    discount: "",
    file: null,
  });

  useEffect(() => {
    GetAdmissionSession();
    GetAdmissionType();
    GetAllProgramsByPagination();
  }, [ReduxSelectedUniversity?.id]);

  useEffect(() => {
    if (form.course) {
      GetSpecializationByProgramId(form.course);
    }
  }, [form.course]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <section className="top-0 dark:bg-slate-900 dark:text-white bg-slate-50 py-2 h-auto m-2 rounded-lg">
      <section className="bg-slate-50 mb-10 dark:bg-gray-900 px-2 sm:px-5 text-sm flex flex-col gap-4 h-full">
        <div className="w-full flex justify-between mt-6 rounded-2xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Student Application Form for{" "}
            <span className="text-slate-800 dark:text-slate-300 text-lg capitalize font-extrabold">
              {ReduxSelectedUniversity?.name}
            </span>
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white overflow-y-auto max-h-[calc(100vh-150px)] dark:bg-gray-800 px-6 md:px-7 py-2 md:py-6 rounded-2xl shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSelect
              label="Admission Session *"
              name="admissionSession"
              value={form.admissionSession}
              onChange={handleChange}
              options={AdmissionSession?.filter(
                (a) => a?.university?._id === ReduxSelectedUniversity?.id
              )}
              optionLabel="name"
            />
            <FormSelect
              label="Admission Type *"
              name="admissionType"
              value={form.admissionType}
              onChange={handleChange}
              options={AdmissionType}
              optionLabel="name"
            />
            <FormSelect
              label="Course *"
              name="course"
              value={form.course}
              onChange={handleChange}
              options={AllProgramsByPagination?.filter(
                (p) => p?.university?._id === ReduxSelectedUniversity?.id
              )}
              optionLabel="name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <FormSelect
              label="Specialization *"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              options={SpecializationByProgramId?.filter((s) => !s?.isDeleted)}
              optionLabel="name"
            />
            <FormSelect
              label="Semester *"
              name="semester"
              value={form.semester}
              onChange={handleChange}
              options={[
                { _id: "1", name: "1" },
                { _id: "2", name: "2" },
                { _id: "3", name: "3" },
                { _id: "4", name: "4" },
              ]}
              optionLabel="name"
            />
            <FormField
              label="Date of Birth *"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <FormField
              label="Student Name *"
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
            />
            <FormField
              label="Email *"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <FormField
              label="WhatsApp Number *"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
            />
          </div>

          <div className="mt-8 border-t border-dashed border-gray-400 pt-4">
            <h3 className="text-md font-semibold text-gray-700 dark:text-white mb-2">
              Offline Payment *
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <FormField
                name="transactionId"
                value={form.transactionId}
                onChange={handleChange}
                placeholder="Transaction ID"
              />
              <FormSelect
                name="paymentType"
                value={form.paymentType}
                onChange={handleChange}
                options={[
                  { _id: "UPI", name: "UPI" },
                  { _id: "Cheque", name: "Cheque" },
                  { _id: "Cash", name: "Cash" },
                ]}
                placeholder="Payment Type"
                optionLabel="name"
              />
              <FormField
                type="date"
                name="transactionDate"
                value={form.transactionDate}
                onChange={handleChange}
              />
              <FormField
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Amount"
              />
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Upload File
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="w-full text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-dashed border-gray-400 pt-4">
            <div className="mt-6">
              <FormField
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="Discount Amount (if any)"
                label="Discount (if any)"
              />
            </div>
          </div>

          <div className="text-right pt-8">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded-md transition-all"
            >
              Submit Application
            </button>
          </div>
        </form>
      </section>
    </section>
  );
};

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
    />
  </div>
);

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  optionLabel = "name",
  placeholder = "Select",
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
    >
      <option value="">{placeholder}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt._id}>
          {opt[optionLabel]}
        </option>
      ))}
    </select>
  </div>
);

export default StudentApplicationForm;
