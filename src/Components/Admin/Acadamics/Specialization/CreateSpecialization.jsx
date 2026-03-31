import React, { useEffect, useState, useCallback, useRef } from "react";
import { BiSolidChevronDown } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import useGetUniversity from "../../../../CustomHooks/UseGetUniversities";
import axios from "axios";
import { toast } from "react-hot-toast";
import useGetMode from "../../../../CustomHooks/UseGetMode";
import useGetScheme from "../../../../CustomHooks/UseGetScheme";
import { useSelector } from "react-redux";

/**
 * CreateSpecialization (updated)
 * - Sticky header/footer, only form body scrolls
 * - Responsive, keyboard accessible multi-select dropdown
 * - Uses design tokens via CSS vars
 *
 * NOTE: fallback preview path (local uploaded asset): will be transformed to a URL by your tool.
 * "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png"
 */
const FALLBACK_PREVIEW = "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png";

const CreateSpecialization = ({
  CloseeCreateSpecialization,
  FetchSpecializationByPagination,
}) => {
  const { GetUniversity, loading, error, universities } = useGetUniversity();
  const { GetAllMode, loadingMode, Mode } = useGetMode();
  const { GetAllScheme, loadingScheme, Scheme } = useGetScheme();

  useEffect(() => {
    GetUniversity();
    GetAllMode();
    GetAllScheme();
  }, []);

  const SelectedUniversity = useSelector((state) => state.university);

  const [declareFeesVisible, setDeclareFeesVisible] = useState(false);

  // multi-select dropdown state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const options = [
    "High School - 10th (SSC)",
    "Intermediate - 12th (HSC)",
    "Under Graduation (UG)",
    "Post Graduation (PG)",
    "Other",
  ];

  // main form state
  const [data, setData] = useState({
    University: "",
    Program: "",
    Name: "",
    Shortname: "",
    Schema: "",
    Mode: "",
    Academic: [],
    MinDuration: "",
    MaxDuration: "",
    ExamFees: "",
    RegistrationFees: "",
    Lateral: "",
    LEstart: "",
    LESOL: "",
    CreditTransfer: "",
    CTstart: "",
    CTSOL: "",
    CourseFee: "",
    AnnualFee: "",
    SemesterFee: "",
    OneTimeFee: "",
  });

  // programs for selected university
  const [ProgramsUniversity, setProgramsUniversity] = useState([]);

  // validation
  const [validationErrors, setValidationErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // close safe wrapper
  const handleClose = useCallback(() => {
    if (!isSubmitting && typeof CloseeCreateSpecialization === "function") {
      CloseeCreateSpecialization();
    }
  }, [isSubmitting, CloseeCreateSpecialization]);

  // Escape to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // click outside dropdown to close
  useEffect(() => {
    const onDocumentClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  // update declareFeesVisible based on durations
  useEffect(() => {
    if (data.MinDuration && data.MaxDuration) setDeclareFeesVisible(true);
    else setDeclareFeesVisible(false);
  }, [data.MinDuration, data.MaxDuration]);

  // Preselect redux-selected university (if present)
  useEffect(() => {
    if (SelectedUniversity?.id) {
      setData((p) => ({ ...p, University: SelectedUniversity.id }));
    }
  }, [SelectedUniversity?.id]);

  // get Programs for selected university
  const HandleGetProgramByUniversity = async (universityId) => {
    if (!universityId) {
      setProgramsUniversity([]);
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/GetDepartmentByUniversities`,
        { UniversityId: universityId },
        { withCredentials: true },
      );

      if (response?.data?.success) {
        // API returned programData previously; fall back gracefully
        setProgramsUniversity(
          response?.data?.programData || response?.data?.data || [],
        );
      } else {
        toast.error(response?.data?.message || "Failed to load programs");
        setProgramsUniversity([]);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load programs");
      setProgramsUniversity([]);
    }
  };

  useEffect(() => {
    if (data.University) {
      HandleGetProgramByUniversity(data.University);
      setData((p) => ({ ...p, Program: "" })); // reset program when university changes
    }
  }, [data.University]);

  // input handler
  const handleOnchangeInputField = (e) => {
    const { name, value } = e.target;
    // when selecting boolean via select, capture as string and normalize later
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // multi-select handlers
  const toggleDropdown = () => {
    setIsOpen((v) => !v);
    if (!isOpen) {
      // focus search when opened
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  };

  const handleItemClick = (item) => {
    let updatedSelectedItems;
    if (selectedItems.includes(item)) {
      updatedSelectedItems = selectedItems.filter((i) => i !== item);
    } else {
      updatedSelectedItems = [...selectedItems, item];
    }
    setSelectedItems(updatedSelectedItems);
    setData((prev) => ({ ...prev, Academic: updatedSelectedItems }));
  };

  const removeItem = (item) => {
    const updated = selectedItems.filter((i) => i !== item);
    setSelectedItems(updated);
    setData((prev) => ({ ...prev, Academic: updated }));
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // validation routine (only checks required non-empty fields)
  const validateFields = () => {
    const errors = {};
    const requiredFields = [
      "University",
      "Program",
      "Name",
      "Shortname",
      "Schema",
      "Mode",
      "Academic",
      "MinDuration",
      "MaxDuration",
    ];

    requiredFields.forEach((f) => {
      const val = data[f];
      if (Array.isArray(val)) {
        if (!val.length) errors[f] = "This field is required";
      } else if (val === "" || val === undefined || val === null) {
        errors[f] = "This field is required";
      }
    });

    // if declare fees visible, require at least CourseFee, OneTimeFee, AnnualFee, SemesterFee, ExamFees, RegistrationFees;
    if (declareFeesVisible) {
      [
        "CourseFee",
        "AnnualFee",
        "SemesterFee",
        "ExamFees",
        "RegistrationFees",
        "OneTimeFee",
      ].forEach((f) => {
        if (!data[f]) errors[f] = "This field is required";
      });
    }

    return errors;
  };

  // submit
  const HandleSubmitCreateSpecialization = async () => {
    setFormTouched(true);

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // scroll first invalid field into view
      const firstKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstKey}"], #Academics`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      setIsSubmitting(true);

      // normalize boolean-like fields
      const payload = {
        university: data.University,
        Program: data.Program,
        name: data.Name,
        shortName: data.Shortname,
        admissionEligibility: data.Academic,
        RegistrationFees: data.RegistrationFees,
        ExamFees: data.ExamFees,
        scheme: data.Schema,
        mode: data.Mode,
        minDuration: data.MinDuration,
        maxDuration: data.MaxDuration,
        lateral: data.Lateral === "true" || data.Lateral === true,
        startLE: data.LEstart,
        solLE: data.LESOL,
        creditTransfer:
          data.CreditTransfer === "true" || data.CreditTransfer === true,
        startCT: data.CTstart,
        solCT: data.CTSOL,
        CourseFee: data.CourseFee,
        AnnualFee: data.AnnualFee,
        SemesterFee: data.SemesterFee,
        OneTimeFee: data.OneTimeFee,
        role: "Specialization",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/Create-Specialization`,
        payload,
        { withCredentials: true },
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message || "Specialization created");
        FetchSpecializationByPagination && FetchSpecializationByPagination();
        CloseeCreateSpecialization && CloseeCreateSpecialization();
      } else {
        toast.error(
          response?.data?.message || "Failed to create specialization",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // small consistent input wrapper
  const InputWrap = ({ children }) => (
    <div
      style={{
        background: "var(--bg)",
        borderRadius: 12,
        padding: 8,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </div>
  );

  const isSaveDisabled = isSubmitting;

  return (
    <section
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-3"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        {/* Header (sticky) */}
        <header
          className="sticky top-0 z-20 px-5 py-4 border-b"
          style={{
            background: "linear-gradient(180deg,#fff,#fafafa)",
            borderColor: "rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--brand-ink)" }}
              >
                Create Specialization
              </h2>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Add specialization details. Required fields are marked with *
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-full p-2 text-sm"
                style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444" }}
                aria-label="Close create specialization"
              >
                ✕
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable form body */}
        <div
          className="overflow-y-auto px-5 py-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form
            id="createSpecializationForm"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              HandleSubmitCreateSpecialization();
            }}
          >
            {/* University & Program */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  University <span className="text-red-500">*</span>
                </label>
                <InputWrap>
                  <select
                    name="University"
                    value={data.University}
                    onChange={handleOnchangeInputField}
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    required
                  >
                    <option value="">Select</option>
                    {loading ? (
                      <option>Loading...</option>
                    ) : (
                      universities?.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u?.name}
                        </option>
                      ))
                    )}
                  </select>
                </InputWrap>
                {formTouched && validationErrors.University && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.University}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Program <span className="text-red-500">*</span>
                </label>
                <InputWrap>
                  <select
                    name="Program"
                    value={data.Program}
                    onChange={handleOnchangeInputField}
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    required
                  >
                    <option value="">Select</option>
                    {ProgramsUniversity?.filter((p) => !p?.isDeleted)?.map(
                      (p) => (
                        <option key={p._id} value={p._id}>
                          {p?.name}
                        </option>
                      ),
                    )}
                  </select>
                </InputWrap>
                {formTouched && validationErrors.Program && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.Program}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Shortname */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="Name"
                  value={data.Name}
                  onChange={handleOnchangeInputField}
                  placeholder="Ex: MECHANICAL ENGINEERING"
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  required
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
                {formTouched && validationErrors.Name && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.Name}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Short Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="Shortname"
                  value={data.Shortname}
                  onChange={handleOnchangeInputField}
                  placeholder="Ex: ME"
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  required
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
                {formTouched && validationErrors.Shortname && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.Shortname}
                  </div>
                )}
              </div>
            </div>

            {/* Schema & Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Scheme <span className="text-red-500">*</span>
                </label>
                <InputWrap>
                  <select
                    name="Schema"
                    value={data.Schema}
                    onChange={handleOnchangeInputField}
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    required
                  >
                    <option value="">Select</option>
                    {loadingScheme ? (
                      <option>Loading...</option>
                    ) : (
                      Scheme?.filter((s) => !s?.isDeleted).map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))
                    )}
                  </select>
                </InputWrap>
                {formTouched && validationErrors.Schema && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.Schema}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Mode <span className="text-red-500">*</span>
                </label>
                <InputWrap>
                  <select
                    name="Mode"
                    value={data.Mode}
                    onChange={handleOnchangeInputField}
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    required
                  >
                    <option value="">Select</option>
                    {loadingMode ? (
                      <option>Loading...</option>
                    ) : (
                      Mode?.filter((m) => !m?.isDeleted).map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))
                    )}
                  </select>
                </InputWrap>
                {formTouched && validationErrors.Mode && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.Mode}
                  </div>
                )}
              </div>
            </div>

            {/* Academic eligibility multi-select */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                Academic Eligibility <span className="text-red-500">*</span>
              </label>

              <div ref={dropdownRef} id="Academics" className="relative">
                <div
                  tabIndex={0}
                  role="button"
                  onClick={toggleDropdown}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggleDropdown();
                  }}
                  className="flex items-center justify-between w-full rounded-md p-2"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex flex-wrap gap-2">
                    {selectedItems.length > 0 ? (
                      selectedItems.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs"
                        >
                          <span className="max-w-[280px] truncate">{item}</span>
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              removeItem(item);
                            }}
                            aria-label={`remove ${item}`}
                          >
                            <RiDeleteBin5Line
                              size={14}
                              className="text-red-600"
                            />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-500">
                        Select options...
                      </div>
                    )}
                  </div>

                  <div className="ml-2 p-1">
                    <BiSolidChevronDown size={18} />
                  </div>
                </div>

                {isOpen && (
                  <div
                    className="mt-2 bg-white border rounded-md shadow-sm z-30"
                    style={{ maxHeight: 180, overflow: "auto" }}
                  >
                    <div className="p-2 border-b">
                      <input
                        ref={searchRef}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-2 py-1 text-sm bg-transparent outline-none"
                        placeholder="Search..."
                      />
                    </div>
                    <ul>
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                          <li
                            key={opt}
                            className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm ${
                              selectedItems.includes(opt)
                                ? "bg-purple-50"
                                : "hover:bg-slate-100"
                            }`}
                            onClick={() => handleItemClick(opt)}
                          >
                            <span>{opt}</span>
                            {selectedItems.includes(opt) && (
                              <IoMdCheckmark
                                size={18}
                                className="text-green-600"
                              />
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-sm text-slate-500">
                          No results found
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {formTouched && validationErrors.Academic && (
                <div className="mt-1 text-xs text-red-600">
                  {validationErrors.Academic}
                </div>
              )}
            </div>

            {/* durations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Min Duration <span className="text-red-500">*</span>
                </label>
                <input
                  name="MinDuration"
                  value={data.MinDuration}
                  onChange={handleOnchangeInputField}
                  type="number"
                  min="0"
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
                {formTouched && validationErrors.MinDuration && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.MinDuration}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Max Duration <span className="text-red-500">*</span>
                </label>
                <input
                  name="MaxDuration"
                  value={data.MaxDuration}
                  onChange={handleOnchangeInputField}
                  type="number"
                  min="0"
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
                {formTouched && validationErrors.MaxDuration && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.MaxDuration}
                  </div>
                )}
              </div>
            </div>

            {/* fees (conditionally shown) */}
            {declareFeesVisible && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label
                    className="block mb-1 text-xs font-medium"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    Course Fee <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="CourseFee"
                    value={data.CourseFee}
                    onChange={handleOnchangeInputField}
                    type="number"
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "8px",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                  {formTouched && validationErrors.CourseFee && (
                    <div className="mt-1 text-xs text-red-600">
                      {validationErrors.CourseFee}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block mb-1 text-xs font-medium"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    Annual Fee <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="AnnualFee"
                    value={data.AnnualFee}
                    onChange={handleOnchangeInputField}
                    type="number"
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "8px",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                  {formTouched && validationErrors.AnnualFee && (
                    <div className="mt-1 text-xs text-red-600">
                      {validationErrors.AnnualFee}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block mb-1 text-xs font-medium"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    Semester Fee <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="SemesterFee"
                    value={data.SemesterFee}
                    onChange={handleOnchangeInputField}
                    type="number"
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "8px",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                  {formTouched && validationErrors.SemesterFee && (
                    <div className="mt-1 text-xs text-red-600">
                      {validationErrors.SemesterFee}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block mb-1 text-xs font-medium"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    Exam Fees <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="ExamFees"
                    value={data.ExamFees}
                    onChange={handleOnchangeInputField}
                    type="number"
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "8px",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                  {formTouched && validationErrors.ExamFees && (
                    <div className="mt-1 text-xs text-red-600">
                      {validationErrors.ExamFees}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block mb-1 text-xs font-medium"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    Registration Fees <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="RegistrationFees"
                    value={data.RegistrationFees}
                    onChange={handleOnchangeInputField}
                    type="number"
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "8px",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                  {formTouched && validationErrors.RegistrationFees && (
                    <div className="mt-1 text-xs text-red-600">
                      {validationErrors.RegistrationFees}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block mb-1 text-xs font-medium"
                    style={{ color: "var(--brand-ink)" }}
                  >
                    One Time Fee <span className="text-red-500">* (Includes: Registration + Exam + Course Fee)</span>
                  </label>
                  <input
                    name="OneTimeFee"
                    value={data.OneTimeFee}
                    onChange={handleOnchangeInputField}
                    type="number"
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                    style={{
                      background: "var(--bg)",
                      borderRadius: 12,
                      padding: "8px",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                  {formTouched && validationErrors.OneTimeFee && (
                    <div className="mt-1 text-xs text-red-600">
                      {validationErrors.OneTimeFee}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lateral / LE / Credit Transfer / CT fields */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Lateral <span className="text-red-500">*</span>
                </label>
                <InputWrap>
                  <select
                    name="Lateral"
                    value={data.Lateral}
                    onChange={handleOnchangeInputField}
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </InputWrap>
                {formTouched && validationErrors.Lateral && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.Lateral}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  LE Start <span className="text-red-500">*</span>
                </label>
                <input
                  name="LEstart"
                  value={data.LEstart}
                  onChange={handleOnchangeInputField}
                  type="number"
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
                {formTouched && validationErrors.LEstart && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.LEstart}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  LE SOL <span className="text-red-500">*</span>
                </label>
                <input
                  name="LESOL"
                  value={data.LESOL}
                  onChange={handleOnchangeInputField}
                  type="number"
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
                {formTouched && validationErrors.LESOL && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.LESOL}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  Credit Transfer <span className="text-red-500">*</span>
                </label>
                <InputWrap>
                  <select
                    name="CreditTransfer"
                    value={data.CreditTransfer}
                    onChange={handleOnchangeInputField}
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </InputWrap>
                {formTouched && validationErrors.CreditTransfer && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.CreditTransfer}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  CT Start <span className="text-red-500">*</span>
                </label>
                <input
                  name="CTstart"
                  value={data.CTstart}
                  onChange={handleOnchangeInputField}
                  type="number"
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
                {formTouched && validationErrors.CTstart && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.CTstart}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 text-xs font-medium"
                  style={{ color: "var(--brand-ink)" }}
                >
                  CT SOL <span className="text-red-500">*</span>
                </label>
                <input
                  name="CTSOL"
                  value={data.CTSOL}
                  onChange={handleOnchangeInputField}
                  type="number"
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: "8px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                />
                {formTouched && validationErrors.CTSOL && (
                  <div className="mt-1 text-xs text-red-600">
                    {validationErrors.CTSOL}
                  </div>
                )}
              </div>
            </div>

            <div style={{ height: 12 }} />
          </form>
        </div>

        {/* Footer (sticky) */}
        <footer
          className="sticky bottom-0 z-20 px-5 py-4 flex justify-end gap-3"
          style={{
            background: "var(--surface)",
            borderTop: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs rounded-full border"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--muted)" }}
          >
            Cancel
          </button>

          <button
            onClick={HandleSubmitCreateSpecialization}
            disabled={isSaveDisabled}
            className="px-6 py-2 text-xs font-semibold rounded-full"
            style={{
              background: isSaveDisabled
                ? "rgba(164,245,166,0.35)"
                : "var(--accent-mint)",
              color: "var(--brand-ink)",
              boxShadow: isSaveDisabled ? "none" : "var(--soft-shadow)",
              cursor: isSaveDisabled ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </footer>
      </div>
    </section>
  );
};

export default CreateSpecialization;
