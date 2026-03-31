import React, { useEffect, useState, useCallback, useRef } from "react";
import { BiSolidChevronDown } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import { RiDeleteBin5Line } from "react-icons/ri";
import useGetProgramType from "../../../../CustomHooks/UseGetProgramType";
import useGetUniversity from "../../../../CustomHooks/UseGetUniversities";
import useGetMode from "../../../../CustomHooks/UseGetMode";
import useGetScheme from "../../../../CustomHooks/UseGetScheme";
import useGetProgram from "../../../../CustomHooks/UseGetProgram";
import toast from "react-hot-toast";
import axios from "axios";

/**
 * UpdateSpecialization (full, safe implementation)
 *
 * - Safe calls to fetcher hooks (checks function existence)
 * - Syncs local form state with EditSpecializationUpdate when it arrives
 * - Uses `value` on <select> (no `selected` on <option>)
 * - Sticky header and footer; only form body scrolls
 * - Accessible multi-select (search, click-outside, keyboard enter)
 * - Basic validation and error display
 *
 * NOTE:
 * - Confirm your custom hook import paths/names; adjust the imports at top if names differ.
 * - Replace `import` hook paths if your hooks live in slightly different locations.
 * - Fallback preview constant uses a local uploaded image path (tooling will transform this).
 */
const FALLBACK_PREVIEW = "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png";

const UpdateSpecialization = ({
  CloseCreateSpecialization,
  FetchSpecializationByPagination,
  EditSpecializationUpdate,
}) => {
  // Hooks that load lists/data
  const {
    GetUniversity,
    loading: loadingUnis,
    universities,
    GetDepartment,
    AllDepartmentLoading,
    AllDepartment,
  } = useGetUniversity();

  const { GetProgramType, LoadingProgramTypes, ProgramTypes } =
    useGetProgramType();
  const { GetAllProgram, loadingProgram, Program } = useGetProgram();
  const { GetAllMode, loadingMode, Mode } = useGetMode();
  const { GetAllScheme, loadingScheme, Scheme } = useGetScheme();

  // UI state
  const [isOpen, setIsOpen] = useState(false);
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

  // Form state (initialized empty; will sync with EditSpecializationUpdate when it arrives)
  const [formData, setFormData] = useState({
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
    OneTimeFee: "",
    AnnualFee: "",
    SemesterFee: "",
  });

  // Selected items array used by multi-select UI (keeps consistent with formData.Academic)
  const [selectedItems, setSelectedItems] = useState([]);

  // flags
  const [declareFeesVisible, setDeclareFeesVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SAFE fetch: call hook fetchers only if they exist and are functions.
  useEffect(() => {
    async function loadAll() {
      try {
        if (typeof GetAllProgram === "function") await GetAllProgram();
        else console.warn("GetAllProgram not a function", GetAllProgram);

        if (typeof GetAllMode === "function") await GetAllMode();
        else console.warn("GetAllMode not a function", GetAllMode);

        if (typeof GetAllScheme === "function") await GetAllScheme();
        else console.warn("GetAllScheme not a function", GetAllScheme);

        if (typeof GetDepartment === "function") await GetDepartment();
        else console.warn("GetDepartment not a function", GetDepartment);

        if (typeof GetProgramType === "function") await GetProgramType();
        else console.warn("GetProgramType not a function", GetProgramType);

        if (typeof GetUniversity === "function") await GetUniversity();
        else console.warn("GetUniversity not a function", GetUniversity);
      } catch (err) {
        console.error("Error loading reference lists:", err);
        toast.error("Failed to load dropdown data. See console/network.");
      }
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync local form data when EditSpecializationUpdate (the prop) arrives or changes.
  useEffect(() => {
    if (!EditSpecializationUpdate) return;

    const initialAcademic = Array.isArray(
      EditSpecializationUpdate?.admissionEligibility,
    )
      ? EditSpecializationUpdate.admissionEligibility.slice()
      : [];

    setFormData({
      University: EditSpecializationUpdate?.university?._id || "",
      Program: EditSpecializationUpdate?.Program?._id || "",
      Name: EditSpecializationUpdate?.name || "",
      Shortname: EditSpecializationUpdate?.shortName || "",
      Schema: EditSpecializationUpdate?.scheme?._id || "",
      Mode: EditSpecializationUpdate?.mode?._id || "",
      Academic: initialAcademic,
      MinDuration: EditSpecializationUpdate?.minDuration ?? "",
      MaxDuration: EditSpecializationUpdate?.maxDuration ?? "",
      ExamFees: EditSpecializationUpdate?.ExamFees ?? "",
      RegistrationFees: EditSpecializationUpdate?.RegistrationFees ?? "",
      Lateral: EditSpecializationUpdate?.lateral ?? "",
      LEstart: EditSpecializationUpdate?.startLE ?? "",
      LESOL: EditSpecializationUpdate?.solLE ?? "",
      CreditTransfer: EditSpecializationUpdate?.creditTransfer ?? "",
      CTstart: EditSpecializationUpdate?.startCT ?? "",
      CTSOL: EditSpecializationUpdate?.solCT ?? "",
      CourseFee: EditSpecializationUpdate?.CourseFee ?? "",
      AnnualFee: EditSpecializationUpdate?.AnnualFee ?? "",
      SemesterFee: EditSpecializationUpdate?.SemesterFee ?? "",
      OneTimeFee: EditSpecializationUpdate?.OneTimeFee ?? "",
    });

    setSelectedItems(initialAcademic);
  }, [EditSpecializationUpdate]);

  // keep declareFeesVisible in sync with durations
  useEffect(() => {
    setDeclareFeesVisible(
      Boolean(formData.MinDuration && formData.MaxDuration),
    );
  }, [formData.MinDuration, formData.MaxDuration]);

  // click-outside to close dropdown
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Escape to close modal (safe)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (!isSubmitting && typeof CloseCreateSpecialization === "function")
          CloseCreateSpecialization();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSubmitting, CloseCreateSpecialization]);

  // generic change handler
  const handleOnchangeInputField = (e) => {
    const { name, value } = e.target;
    setFormTouched(false);
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // multi-select handlers
  const toggleDropdown = () => {
    setIsOpen((v) => !v);
    if (!isOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItems((prev) => {
      const updated = prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item];
      setFormData((p) => ({ ...p, Academic: updated }));
      return updated;
    });
  };

  const removeItem = (item) => {
    setSelectedItems((prev) => {
      const updated = prev.filter((i) => i !== item);
      setFormData((p) => ({ ...p, Academic: updated }));
      return updated;
    });
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // validation: simple required checks
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
      const val = formData[f];
      if (Array.isArray(val)) {
        if (val.length === 0) errors[f] = "This field is required";
      } else if (val === "" || val === null || val === undefined) {
        errors[f] = "This field is required";
      }
    });

    if (declareFeesVisible) {
      [
        "CourseFee",
        "AnnualFee",
        "SemesterFee",
        "ExamFees",
        "RegistrationFees",
         "OneTimeFee",
      ].forEach((f) => {
        if (!formData[f]) errors[f] = "This field is required";
      });
    }

    return errors;
  };

  // submit handler
  const HandleSubmitCreateSpecialization = async (e) => {
    e?.preventDefault?.();
    setFormTouched(true);

    const errors = validateFields();
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      // scroll to first invalid
      const first = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${first}"], #Academics`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        id: EditSpecializationUpdate?._id,
        university: formData.University,
        Program: formData.Program,
        name: formData.Name,
        shortName: formData.Shortname,
        admissionEligibility: formData.Academic,
        scheme: formData.Schema,
        mode: formData.Mode,
        minDuration: formData.MinDuration,
        maxDuration: formData.MaxDuration,
        lateral:
          formData.Lateral === true ||
          formData.Lateral === "true" ||
          formData.Lateral === true,
        startLE: formData.LEstart,
        solLE: formData.LESOL,
        creditTransfer:
          formData.CreditTransfer === true ||
          formData.CreditTransfer === "true",
        startCT: formData.CTstart,
        solCT: formData.CTSOL,
        RegistrationFees: formData.RegistrationFees,
        ExamFees: formData.ExamFees,
        CourseFee: formData.CourseFee,
        OneTimeFee: formData.OneTimeFee,
        AnnualFee: formData.AnnualFee,
        SemesterFee: formData.SemesterFee,
      };

      const Response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/UpdateSpecialization`,
        payload,
        {
          withCredentials: true,
        },
      );

      if (Response?.data?.success) {
        toast.success(Response.data.message || "Specialization updated");
        CloseCreateSpecialization && CloseCreateSpecialization();
        FetchSpecializationByPagination && FetchSpecializationByPagination();
      } else {
        toast.error(Response?.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("UpdateSpecialization error:", err);
      toast.error(
        err?.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // small visual wrapper that follows your design tokens
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
      className="fixed inset-0 z-50 flex items-center justify-center px-3"
      style={{ background: "rgba(0,0,0,0.45)" }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        {/* sticky header */}
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
                Update Specialization
              </h2>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Edit specialization details. Required fields marked *
              </p>
            </div>

            <div>
              <button
                onClick={() => {
                  if (!isSubmitting)
                    CloseCreateSpecialization && CloseCreateSpecialization();
                }}
                disabled={isSubmitting}
                aria-label="Close"
                className="rounded-full p-2 text-sm"
                style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444" }}
              >
                ✕
              </button>
            </div>
          </div>
        </header>

        {/* scrollable form body */}
        <div
          className="overflow-y-auto px-5 py-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form
            id="updateSpecializationForm"
            onSubmit={HandleSubmitCreateSpecialization}
            className="space-y-4"
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
                    value={formData.University}
                    onChange={handleOnchangeInputField}
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  >
                    <option value="">Select</option>
                    {loadingUnis ? (
                      <option value="">Loading...</option>
                    ) : Array.isArray(universities) && universities.length ? (
                      universities.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No universities</option>
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
                    value={formData.Program}
                    onChange={handleOnchangeInputField}
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  >
                    <option value="">Select</option>
                    {loadingProgram ? (
                      <option value="">Loading...</option>
                    ) : Array.isArray(Program) && Program.length ? (
                      Program.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.shortName || p.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No programs</option>
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
                  value={formData.Name}
                  onChange={handleOnchangeInputField}
                  placeholder="Ex: MECHANICAL ENGINEERING"
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
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
                  value={formData.Shortname}
                  onChange={handleOnchangeInputField}
                  placeholder="Ex: ME"
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
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

            {/* Scheme & Mode */}
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
                    value={formData.Schema}
                    onChange={handleOnchangeInputField}
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  >
                    <option value="">Select</option>
                    {loadingScheme ? (
                      <option value="">Loading...</option>
                    ) : Array.isArray(Scheme) && Scheme.length ? (
                      Scheme.filter((s) => !s?.isDeleted).map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No schemes</option>
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
                    value={formData.Mode}
                    onChange={handleOnchangeInputField}
                    className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  >
                    <option value="">Select</option>
                    {loadingMode ? (
                      <option value="">Loading...</option>
                    ) : Array.isArray(Mode) && Mode.length ? (
                      Mode.filter((m) => !m?.isDeleted).map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No modes</option>
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

            {/* Academic Eligibility (multi-select) */}
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
                          No results
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

            {/* Durations */}
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
                  value={formData.MinDuration}
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
                  value={formData.MaxDuration}
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

            {/* Fees shown conditionally */}
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
                    value={formData.CourseFee}
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
                    value={formData.AnnualFee}
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
                    value={formData.SemesterFee}
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
                    value={formData.ExamFees}
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
                    value={formData.RegistrationFees}
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
                    value={formData.OneTimeFee}
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

            {/* Lateral / LE / Credit Transfer / CT */}
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
                    value={String(formData.Lateral ?? "")}
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
                  value={formData.LEstart}
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
                  value={formData.LESOL}
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
                    value={String(formData.CreditTransfer ?? "")}
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
                  value={formData.CTstart}
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
                  value={formData.CTSOL}
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
          </form>
        </div>

        {/* sticky footer */}
        <footer
          className="sticky bottom-0 z-20 px-5 py-4 flex justify-end gap-3"
          style={{
            background: "var(--surface)",
            borderTop: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <button
            onClick={() => {
              if (!isSubmitting)
                CloseCreateSpecialization && CloseCreateSpecialization();
            }}
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

export default UpdateSpecialization;
