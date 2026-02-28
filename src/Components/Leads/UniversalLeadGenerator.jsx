import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UseGetCenterSubCenter from "../../CustomHooks/UseGetCenterSubCenter";
import UseGetSpecialization from "../../CustomHooks/UseGetSpecialization";
import UseGetProgramPagination from "../../CustomHooks/UseGetProgramPagination";
import UseGetAdmissionSession from "../../CustomHooks/UseGetAdmissionSession";
import useGetProgramType from "../../CustomHooks/UseGetProgramType";
import useGetUniversity from "../../CustomHooks/UseGetUniversities";

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

const UniversalLeadGenerator = ({
  ReduxGetDataFromRedux,
  SubCenter,
  CounsellorManager,
  SubCounsellorManager,
}) => {
  const ReduxSelectedUniversity = useSelector((state) => state.university);
  const { GetUniversity, universities } = useGetUniversity();
  const { GetCenter, Center, GetSubCenter } = UseGetCenterSubCenter();
  const { GetAllProgramsByPagination, AllProgramsByPagination } =
    UseGetProgramPagination();
  const { GetSpecializationByProgramId, SpecializationByProgramId } =
    UseGetSpecialization();
  const { GetAdmissionType } = useGetProgramType();
  const { GetAdmissionSession } = UseGetAdmissionSession();

  const [form, setForm] = useState({
    leadOwner: "",
    fullName: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    dob: "",
    state: "",
    district: "",
  });

  const [universityEntries, setUniversityEntries] = useState([
    { universityId: "", programId: "", streamId: "" },
  ]);

  useEffect(() => {
    GetUniversity();
    GetCenter();
    GetSubCenter();
    GetAllProgramsByPagination();
    GetAdmissionType();
    GetAdmissionSession();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUniversityEntryChange = (index, field, value) => {
    const updatedEntries = [...universityEntries];
    updatedEntries[index][field] = value;
    if (field === "universityId") {
      updatedEntries[index].programId = "";
      updatedEntries[index].streamId = "";
    }
    if (field === "programId") {
      updatedEntries[index].streamId = "";
    }
    setUniversityEntries(updatedEntries);
  };

  const addUniversityEntry = () => {
    if (universityEntries.length < 5) {
      setUniversityEntries([
        ...universityEntries,
        { universityId: "", programId: "", streamId: "" },
      ]);
    }
  };

  const deleteUniversityEntry = (idx) => {
    const updated = universityEntries.filter((_, i) => i !== idx);
    setUniversityEntries(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullMobile = `${form.countryCode}${form.mobile}`;
    console.log("Lead Data:", {
      ...form,
      mobile: fullMobile,
      universityEntries,
    });
  };

  const usedUniversityIds = universityEntries.map((e) => e.universityId);

  return (
    <section className="h- bg-slate-50 dark:bg-slate-900 p-4 space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100  ">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b pb-4">
          Universal Lead Generator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Lead Owner (Center)
            </label>
            <select
              name="leadOwner"
              value={form.leadOwner}
              onChange={handleChange}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Center</option>
              {Center?.filter((c) => !c?.isDeleted)?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
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
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Mobile
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                {["+91", "+1", "+44", "+971", "+61"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter number"
                className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Universities, Courses & Streams (Max 5)
          </h3>
          <div className="space-y-4">
            {universityEntries.map((entry, index) => {
              const selectedUniversity = universities.find(
                (u) => u._id === entry.universityId
              );
              const programs = selectedUniversity?.program || [];
              const specializations =
                selectedUniversity?.specialization?.filter(
                  (s) => s.Program === entry.programId
                ) || [];

              const availableUniversities = universities.filter(
                (u) =>
                  !usedUniversityIds.includes(u._id) ||
                  u._id === entry.universityId
              );

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-md"
                >
                  <select
                    value={entry.universityId}
                    onChange={(e) =>
                      handleUniversityEntryChange(
                        index,
                        "universityId",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select University</option>
                    {availableUniversities.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={entry.programId}
                    onChange={(e) =>
                      handleUniversityEntryChange(
                        index,
                        "programId",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    disabled={!entry.universityId}
                  >
                    <option value="">Select Course</option>
                    {programs.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={entry.streamId}
                    onChange={(e) =>
                      handleUniversityEntryChange(
                        index,
                        "streamId",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    disabled={!entry.programId}
                  >
                    <option value="">Select Stream</option>
                    {specializations.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  {universityEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteUniversityEntry(index)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}

            {universityEntries.length < 5 && (
              <button
                type="button"
                onClick={addUniversityEntry}
                className="text-blue-600 hover:underline"
              >
                + Add Another
              </button>
            )}
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
          >
            Submit Lead
          </button>
        </div>
      </form>
    </section>
  );
};

export default UniversalLeadGenerator;
