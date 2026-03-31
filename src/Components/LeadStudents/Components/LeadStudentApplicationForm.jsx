import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UseGetAdmissionSession from "../../../CustomHooks/UseGetAdmissionSession";
import UseGetProgramPagination from "../../../CustomHooks/UseGetProgramPagination";
import UseGetSpecialization from "../../../CustomHooks/UseGetSpecialization";
import useGetProgramType from "../../../CustomHooks/UseGetProgramType";
import axios from "axios";

// const StudentApplicationForm = () => {
const StudentApplicationForm = ({ studentId, studentData }) => {
  const ReduxSelectedUniversity = useSelector((state) => state.university);
  const { GetAdmissionSession, AdmissionsessionListData } =
    UseGetAdmissionSession();
  const { GetAdmissionType, AdmissionType } = useGetProgramType();
  const { GetAllProgramsByPagination, AllProgramsByPagination } =
    UseGetProgramPagination();
  const { GetSpecializationByProgramId, SpecializationByProgramId } =
    UseGetSpecialization();

  useEffect(() => {
    if (studentData) {
      setForm((prev) => ({
        ...prev,
        studentName: `${studentData.FirstName} ${studentData.LastName}`,
        email: studentData.EmailAddress,
        whatsapp: studentData.Phone,
        dob: studentData.DateOfBirth
          ? new Date(studentData.DateOfBirth).toISOString().split("T")[0]
          : "",
        // ✅ NEW
        course: studentData.Program || "",
        specialization: studentData.SubCourse || "",
      }));
    }
  }, [studentData]);

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
    paymentPlan: "",
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

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      amount: "",
      paymentPlan: "",
    }));
  }, [form.specialization]);

  useEffect(() => {
    if (!form.paymentPlan || !form.specialization) return;

    const selectedSpecialization = SpecializationByProgramId?.find(
      (s) => s._id === form.specialization,
    );

    if (!selectedSpecialization) return;

    let amount = 0;

    switch (form.paymentPlan) {
      case "TotalFee":
        amount = Number(selectedSpecialization.OneTimeFee || 0);
        // +
        // Number(selectedSpecialization.RegistrationFees || 0) +
        // Number(selectedSpecialization.ExamFees || 0);
        break;

      case "CourseFee":
        amount = Number(selectedSpecialization.CourseFee || 0);
        break;

      case "Semester":
        amount = Number(selectedSpecialization.SemesterFee || 0);
        break;

      case "Annual":
        amount = Number(selectedSpecialization.AnnualFee || 0);
        break;

      default:
        amount = 0;
    }

    setForm((prev) => ({
      ...prev,
      amount,
    }));
  }, [form.paymentPlan, form.specialization, SpecializationByProgramId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", form);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/apply-admission`,
        {
          studentId,
          transactionId: form.transactionId,
          paymentType: form.paymentType, // PaymentMode
          paymentPlan: form.paymentPlan, // NEW
          transactionDate: form.transactionDate,
          amount: form.amount,
          discount: form.discount,
        },
        {
          withCredentials: true,
        },
      );

      alert("Application submitted successfully");
    } catch (error) {
      console.error(error);
      alert("Error submitting application");
    }
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
              options={AdmissionsessionListData?.filter(
                (a) =>
                  a?.university === ReduxSelectedUniversity?.id &&
                  a?.isAvailable,
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
                (p) => p?.university?._id === ReduxSelectedUniversity?.id,
              )}
              optionLabel="name"
              disabled={!!studentData}
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
              disabled={!!studentData}
            />
            <FormSelect
              label="Semester *"
              name="semester"
              value={form.semester}
              onChange={handleChange}
              options={[{ _id: "1", name: "1" }]}
              optionLabel="name"
            />
            <FormField
              label="Date of Birth *"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              disabled={!!studentData}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <FormField
              label="Student Name *"
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              disabled={!!studentData}
            />
            <FormField
              label="Email *"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={!!studentData}
            />
            <FormField
              label="WhatsApp Number *"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              disabled={!!studentData}
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
                name="paymentPlan"
                value={form.paymentPlan}
                onChange={handleChange}
                options={[
                  { _id: "TotalFee", name: "Total Fee" },
                  { _id: "CourseFee", name: "Course Fee" },
                  { _id: "Semester", name: "Semester" },
                  { _id: "Annual", name: "Annual" },
                ]}
                placeholder="Payment Plan"
                optionLabel="name"
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
                readOnly
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

              {form.paymentPlan === "Total Fee" && (
                <p className="text-xs text-green-600">
                  Includes: Registration + Exam + Course Fee
                </p>
              )}

              {form.paymentPlan === "Course Fee" && (
                <p className="text-xs text-pink-600">
                  Course Fee (excluding registration & exam fee)
                </p>
              )}

              {form.paymentPlan === "Semester" && (
                <p className="text-xs text-blue-600">Semester Fee Applied</p>
              )}

              {form.paymentPlan === "Annual" && (
                <p className="text-xs text-purple-600">Annual Fee Applied</p>
              )}
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
  disabled = false,
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
      disabled={disabled}
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
  disabled = false,
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
      disabled={disabled}
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
