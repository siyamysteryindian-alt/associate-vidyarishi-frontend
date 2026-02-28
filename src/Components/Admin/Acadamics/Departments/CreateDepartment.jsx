import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import useGetUniversity from "../../../../CustomHooks/UseGetUniversities";
import { useSelector } from "react-redux";

const CreateDepartment = ({
  CloseButtonCreateDepartment,
  FetchDepartmentByPagination,
}) => {
  const { GetUniversity, universities, loading } = useGetUniversity();
  const selectedUniversity = useSelector((state) => state.university);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [DepartmentData, setDepartmentData] = useState({
    University: "",
    DepartmentName: "",
  });

  const HandleClose = useCallback(() => {
    if (!isSubmitting && typeof CloseButtonCreateDepartment === "function") {
      CloseButtonCreateDepartment();
    }
  }, [isSubmitting, CloseButtonCreateDepartment]);

  useEffect(() => {
    GetUniversity();
  }, []);

  // Auto pre-select selected university from Redux
  useEffect(() => {
    if (selectedUniversity?.id) {
      setDepartmentData((prev) => ({
        ...prev,
        University: selectedUniversity.id,
      }));
    }
  }, [selectedUniversity?.id]);

  const HandleInputData = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDepartmentData((prev) => ({ ...prev, [name]: value }));
  };

  const HandleDepartmentCreate = async (e) => {
    e.preventDefault();

    if (!DepartmentData.University || !DepartmentData.DepartmentName) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/Create-Department`,
        {
          university: DepartmentData.University,
          name: DepartmentData.DepartmentName,
          role: "Department",
        },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success(response.data.message);
        FetchDepartmentByPagination();
        HandleClose();
      } else {
        toast.error(response?.data?.message || "Failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Input Wrapper shared design */
  const InputWrap = ({ children }) => (
    <div
      style={{
        background: "var(--bg)",
        borderRadius: 12,
        padding: "8px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </div>
  );

  const isSaveDisabled =
    isSubmitting ||
    !DepartmentData.University ||
    !DepartmentData.DepartmentName;

  return (
    <section
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center px-3"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        {/* ------------------------ HEADER (STICKY) ------------------------ */}
        <header
          className="sticky top-0 z-20 px-5 py-4 border-b"
          style={{
            background: "linear-gradient(180deg,#fff,#fafafa)",
            borderColor: "rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1
                className="text-lg font-semibold"
                style={{ color: "var(--brand-ink)" }}
              >
                Create Faculty
              </h1>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Add a new Faculty inside your selected university
              </p>
            </div>

            <button
              onClick={HandleClose}
              disabled={isSubmitting}
              className="rounded-full p-2 text-sm"
              style={{
                background: "rgba(239,68,68,0.06)",
                color: "#ef4444",
              }}
            >
              ✕
            </button>
          </div>
        </header>

        {/* ---------------------- SCROLLABLE FORM BODY ---------------------- */}
        <div
          className="overflow-y-auto px-5 pt-5 pb-3"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form
            id="createDepartmentForm"
            onSubmit={HandleDepartmentCreate}
            className="space-y-4"
          >
            {/* University Select */}
            <div>
              <label
                className="text-xs font-medium mb-1 block"
                style={{ color: "var(--brand-ink)" }}
              >
                Select University <span className="text-red-500">*</span>
              </label>

              <InputWrap>
                <select
                  name="University"
                  value={DepartmentData.University}
                  onChange={HandleInputData}
                  className="w-full bg-transparent text-sm px-2 py-2 focus:outline-none"
                  style={{ color: "var(--brand-ink)" }}
                  required
                >
                  <option value="">Select</option>

                  {loading ? (
                    <option>Loading...</option>
                  ) : (
                    universities?.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))
                  )}
                </select>
              </InputWrap>
            </div>

            {/* Department Name */}
            <div>
              <label
                className="text-xs font-medium mb-1 block"
                style={{ color: "var(--brand-ink)" }}
              >
                Faculty Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="DepartmentName"
                placeholder="Ex: Information Technology"
                // value={DepartmentData.DepartmentName}
                onChange={HandleInputData}
                className="w-full bg-transparent text-sm px-2 py-2 focus:outline-none"
                style={{
                  background: "var(--bg)",
                  borderRadius: 12,
                  padding: "8px",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
                required
              />
            </div>

            {/* Bottom space for scroll */}
            <div className="h-6" />
          </form>
        </div>

        {/* ------------------------ FOOTER (STICKY) ------------------------ */}
        <footer
          className="sticky bottom-0 px-5 py-4 flex justify-end gap-3"
          style={{
            background: "var(--surface)",
            borderTop: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <button
            onClick={HandleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs rounded-full border"
            style={{
              borderColor: "rgba(0,0,0,0.06)",
              color: "var(--muted)",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="createDepartmentForm"
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

export default CreateDepartment;
