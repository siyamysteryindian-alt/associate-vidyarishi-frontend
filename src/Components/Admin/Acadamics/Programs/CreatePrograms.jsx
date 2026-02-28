import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useGetUniversity from "../../../../CustomHooks/UseGetUniversities";
import useGetProgramType from "../../../../CustomHooks/UseGetProgramType";
import { useSelector } from "react-redux";

/**
 * CreatePrograms (updated)
 * - Sticky header & footer; only form body scrolls
 * - Responsive and matches project design tokens
 *
 * NOTE: fallback preview path (local uploaded asset) — tooling will transform this to a URL:
 * "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png"
 */
const FALLBACK_PREVIEW = "/mnt/data/2f284af6-deb0-4c5f-91d6-997cb24eaf68.png";

const CreatePrograms = ({
  CloseButtonCreateProgram,
  FetchProgramByPagination,
}) => {
  const { GetUniversity, loading, universities } = useGetUniversity();
  const { GetProgramType, LoadingProgramTypes, ProgramTypes } =
    useGetProgramType();

  const SelectedUniversity = useSelector((state) => state.university);

  const [ProgramInputSetData, setProgramInPutSetData] = useState({
    University: "",
    Department: "",
    ProgramType: "",
    ProgramName: "",
    ShortName: "",
  });

  const [DepartmentUniversity, setDepartmentUniversity] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingDepartments, setIsFetchingDepartments] = useState(false);

  // safe close wrapper
  const HandleClose = useCallback(() => {
    if (!isSubmitting && typeof CloseButtonCreateProgram === "function") {
      CloseButtonCreateProgram();
    }
  }, [isSubmitting, CloseButtonCreateProgram]);

  // Escape-to-close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") HandleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [HandleClose]);

  useEffect(() => {
    GetUniversity();
    GetProgramType();
  }, []);

  // preselect redux selected university when available
  useEffect(() => {
    if (SelectedUniversity?.id) {
      setProgramInPutSetData((p) => ({
        ...p,
        University: SelectedUniversity.id,
      }));
    }
  }, [SelectedUniversity?.id]);

  const HandleInputChangeData = (e) => {
    const { name, value } = e.target;
    setProgramInPutSetData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch departments for a university
  const HandleGetDepartmentByUniversity = async (universityId) => {
    if (!universityId) {
      setDepartmentUniversity([]);
      return;
    }

    try {
      setIsFetchingDepartments(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/GetDepartmentByUniversities`,
        { UniversityId: universityId },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        setDepartmentUniversity(response.data.data || []);
      } else {
        toast.error(response?.data?.message || "Failed to load departments");
        setDepartmentUniversity([]);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load departments");
      setDepartmentUniversity([]);
    } finally {
      setIsFetchingDepartments(false);
    }
  };

  // when university changes, fetch its departments
  useEffect(() => {
    if (ProgramInputSetData?.University) {
      HandleGetDepartmentByUniversity(ProgramInputSetData.University);
      // clear department selection when university changes
      setProgramInPutSetData((p) => ({ ...p, Department: "" }));
    } else {
      setDepartmentUniversity([]);
      setProgramInPutSetData((p) => ({ ...p, Department: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ProgramInputSetData?.University]);

  const HandleSubmitCreateProgram = async (e) => {
    e.preventDefault();
    // client-side validation
    const { University, Department, ProgramType, ProgramName, ShortName } =
      ProgramInputSetData;
    if (
      !University ||
      !Department ||
      !ProgramType ||
      !ProgramName ||
      !ShortName
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const Response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/Create-Program`,
        {
          programType: ProgramInputSetData.ProgramType,
          Department: ProgramInputSetData.Department,
          university: ProgramInputSetData.University,
          name: ProgramInputSetData.ProgramName,
          shortName: ProgramInputSetData.ShortName,
          role: "Program",
        },
        { withCredentials: true }
      );

      if (Response?.data?.success) {
        toast.success(Response.data.message || "Program created");
        FetchProgramByPagination && FetchProgramByPagination();
        HandleClose();
      } else {
        toast.error(Response?.data?.message || "Create failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // small input wrapper using your variables
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

  const isSaveDisabled =
    isSubmitting ||
    !ProgramInputSetData.University ||
    !ProgramInputSetData.Department ||
    !ProgramInputSetData.ProgramType ||
    !ProgramInputSetData.ProgramName ||
    !ProgramInputSetData.ShortName;

  return (
    <section
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center px-3"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        {/* Sticky header */}
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
                Create Program
              </h2>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Add a new program under selected university & department
              </p>
            </div>

            <button
              onClick={HandleClose}
              disabled={isSubmitting}
              className="rounded-full p-2 text-sm"
              style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444" }}
              aria-label="Close create program"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Scrollable form body */}
        <div
          className="overflow-y-auto px-5 py-4"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form
            id="createProgramForm"
            onSubmit={HandleSubmitCreateProgram}
            className="space-y-4"
          >
            {/* University */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                University <span className="text-red-500">*</span>
              </label>

              <InputWrap>
                <select
                  id="University"
                  name="University"
                  value={ProgramInputSetData.University}
                  onChange={HandleInputChangeData}
                  required
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{ color: "var(--brand-ink)" }}
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
            </div>

            {/* Department */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                Department <span className="text-red-500">*</span>
              </label>

              <InputWrap>
                <select
                  id="Department"
                  name="Department"
                  value={ProgramInputSetData.Department}
                  onChange={HandleInputChangeData}
                  required
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{ color: "var(--brand-ink)" }}
                >
                  <option value="">Select</option>
                  {isFetchingDepartments ? (
                    <option>Loading...</option>
                  ) : DepartmentUniversity &&
                    DepartmentUniversity.length > 0 ? (
                    DepartmentUniversity.filter((d) => !d?.isDeleted).map(
                      (dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      )
                    )
                  ) : (
                    <option value="">No departments created</option>
                  )}
                </select>
              </InputWrap>
            </div>

            {/* Program Type */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                Program Type <span className="text-red-500">*</span>
              </label>

              <InputWrap>
                <select
                  id="ProgramType"
                  name="ProgramType"
                  value={ProgramInputSetData.ProgramType}
                  onChange={HandleInputChangeData}
                  required
                  className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                  style={{ color: "var(--brand-ink)" }}
                >
                  <option value="">Select</option>
                  {LoadingProgramTypes ? (
                    <option>Loading...</option>
                  ) : (
                    ProgramTypes?.filter((p) => !p?.isDeleted).map((pt) => (
                      <option key={pt._id} value={pt._id}>
                        {pt.name}
                      </option>
                    ))
                  )}
                </select>
              </InputWrap>
            </div>

            {/* Program Name */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                Name <span className="text-red-500">*</span>
              </label>

              <input
                id="ProgramName"
                name="ProgramName"
                type="text"
                value={ProgramInputSetData.ProgramName}
                onChange={HandleInputChangeData}
                placeholder="EX : BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY"
                required
                className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                style={{
                  background: "var(--bg)",
                  borderRadius: 12,
                  padding: "8px",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            </div>

            {/* Short Name */}
            <div>
              <label
                className="block mb-1 text-xs font-medium"
                style={{ color: "var(--brand-ink)" }}
              >
                Short Name <span className="text-red-500">*</span>
              </label>

              <input
                id="ShortName"
                name="ShortName"
                type="text"
                value={ProgramInputSetData.ShortName}
                onChange={HandleInputChangeData}
                placeholder="Ex : BSC IT"
                required
                className="w-full bg-transparent text-sm px-2 py-2 rounded-md focus:outline-none"
                style={{
                  background: "var(--bg)",
                  borderRadius: 12,
                  padding: "8px",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            </div>

            <div style={{ height: 12 }} />
          </form>
        </div>

        {/* Sticky footer */}
        <footer
          className="sticky bottom-0 z-20 px-5 py-4 flex justify-end gap-3"
          style={{
            background: "var(--surface)",
            borderTop: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <button
            onClick={HandleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs rounded-full border"
            style={{ borderColor: "rgba(0,0,0,0.06)", color: "var(--muted)" }}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="createProgramForm"
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

export default CreatePrograms;
