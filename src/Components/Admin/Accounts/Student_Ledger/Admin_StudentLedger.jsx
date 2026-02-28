import React, { useEffect, useMemo, useState } from "react";
import ListOf_StudentLedger from "./ListOf_StudentLedger";
import UseGetAllStudents from "../../../../CustomHooks/UseGetStudentsPagination";
import { useSelector } from "react-redux";
import { IoDownloadOutline, IoPrint } from "react-icons/io5";

const Admin_StudentLedger = () => {
  const [StudentDataFromLedger, setStudentDataFromLedger] = useState({
    StudentId: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const {
    FetchAllStudentByPagination,
    AllStudentListData = [],
    AllStudentCurrentPage,
    AllStudentTotalPages,
    AllStudentLimit,
    AllStudentLoading,
    AllStudentTotalDocs,
    handlePageChange,
  } = UseGetAllStudents();

  const UniversityReduxData = useSelector((state) => state?.university);

  // initial fetch
  useEffect(() => {
    // call once (keeps parity with your previous behavior)
    FetchAllStudentByPagination(
      AllStudentCurrentPage || 1,
      AllStudentLimit || 10
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // fetch whenever university id appears/changes
    if (UniversityReduxData?.id) {
      FetchAllStudentByPagination(
        AllStudentCurrentPage || 1,
        AllStudentLimit || 10
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UniversityReduxData?.id]);

  // filtered students for the select and quick search
  const filteredStudents = useMemo(() => {
    const students = AllStudentListData || [];
    if (!searchTerm?.trim()) return students;
    const s = searchTerm.trim().toLowerCase();
    return students.filter(
      (st) =>
        (st?.fullName || "").toLowerCase().includes(s) ||
        (st?.studentId || "").toLowerCase().includes(s)
    );
  }, [AllStudentListData, searchTerm]);

  const HandleInputData = (e) => {
    const { name, value } = e.target;
    setStudentDataFromLedger((prev) => ({ ...prev, [name]: value }));
  };

  const clearSelection = () =>
    setStudentDataFromLedger({
      StudentId: "",
    });

  // Utility: export current student's ledger view as CSV (basic)
  const handleExportCsv = () => {
    if (!StudentDataFromLedger?.StudentId) {
      return;
    }

    // create a simple CSV by asking the ledger component to fetch student data again (we'll build lightweight CSV from AllStudentListData if possible)
    // Try to locate student in list (fallback to empty)
    const student = AllStudentListData.find(
      (s) => s?._id === StudentDataFromLedger?.StudentId
    );

    if (!student) {
      // fallback: notify
      return;
    }

    // Build CSV rows from student's payments (normalize to array)
    const payments = Array.isArray(student?.payments)
      ? student.payments
      : student?.payments
      ? [student.payments]
      : [];

    const headers = [
      "Date",
      "Particular",
      "Source",
      "Transaction ID",
      "Fee",
      "Center",
      "Center %",
      "Discounted",
      "Final Paid Amount",
    ];

    const rows = payments.map((p) => [
      p.paymentDate || "",
      p.particular || "",
      p.source || "",
      p.transactionId || "",
      p.paymentAmount || "",
      p.createdByPayment?.name || "",
      p.CenterPercentage || "",
      p.DiscountAmount || "",
      p.FinalAmount || p.paymentAmount || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (student?.fullName || "student").replace(/\s+/g, "_");
    a.download = `${safeName}_ledger.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      className="mt-2 mx-2 rounded-lg"
      style={{ background: "var(--color-bg)" }}
    >
      {/* header */}
      <div
        className="w-full h-16 flex items-center justify-between px-6 rounded-lg"
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
          <div>Student Ledger</div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            View and export individual student payment ledger
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border rounded text-sm hover:shadow"
            title="Export CSV (selected student)"
            aria-label="Export CSV"
          >
            <IoDownloadOutline /> Export
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border rounded text-sm hover:shadow"
            title="Print ledger"
            aria-label="Print ledger"
          >
            <IoPrint /> Print
          </button>
        </div>
      </div>

      <div
        className="rounded-xl w-full mt-3"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--soft-shadow)",
          borderRadius: "var(--card-radius)",
        }}
      >
        <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label
              htmlFor="StudentSelect"
              className="font-semibold text-sm block"
            >
              Select Student
            </label>

            <div className="mt-2 flex gap-2">
              <select
                id="StudentSelect"
                name="StudentId"
                onChange={HandleInputData}
                value={StudentDataFromLedger.StudentId}
                className="flex-1 px-3 py-2 text-sm rounded-lg dark:bg-slate-700 dark:text-white border border-gray-200"
                aria-label="Select Student"
              >
                <option value="">-- Select Student --</option>

                {AllStudentLoading ? (
                  <option value="" disabled>
                    Loading...
                  </option>
                ) : (
                  AllStudentListData.filter(
                    (s) =>
                      s?.university?._id === UniversityReduxData?.id &&
                      !s?.isDeleted
                  ).map((s) => (
                    <option key={s?._id} value={s?._id}>
                      {s?.fullName} {s?.studentId ? `(${s.studentId})` : ""}
                    </option>
                  ))
                )}
              </select>

              <input
                type="text"
                placeholder="Search by name / id"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-3 py-2 text-sm rounded-lg border border-gray-200"
                aria-label="Search students"
              />

              <button
                onClick={() => {
                  // If user typed search, try to find first matching student and select it
                  if (!searchTerm?.trim()) {
                    clearSelection();
                    return;
                  }
                  const q = searchTerm.trim().toLowerCase();
                  const found = AllStudentListData.find(
                    (s) =>
                      (s?.fullName || "").toLowerCase().includes(q) ||
                      (s?.studentId || "").toLowerCase().includes(q)
                  );
                  if (found) {
                    setStudentDataFromLedger({ StudentId: found._id });
                  }
                }}
                className="px-3 py-2 bg-[var(--color-purple)] text-white rounded text-sm"
                aria-label="Apply search"
              >
                Go
              </button>
            </div>

            <div className="mt-2 flex gap-2">
              <button
                onClick={clearSelection}
                className="px-3 py-1 text-sm rounded border"
              >
                Clear
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="md:col-span-1 flex flex-col gap-2">
            {/* We'll render KPIs based on selected student if present; otherwise show defaults */}
            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow">
              <div className="text-xs text-gray-500">Total Paid</div>
              <div className="text-lg font-semibold">
                {(() => {
                  const student = AllStudentListData.find(
                    (s) => s?._id === StudentDataFromLedger?.StudentId
                  );
                  const payments = student?.payments
                    ? Array.isArray(student.payments)
                      ? student.payments
                      : [student.payments]
                    : [];
                  const totalPaid = payments.reduce((acc, p) => {
                    const v = Number(p?.FinalAmount ?? p?.paymentAmount ?? 0);
                    return acc + (Number.isFinite(v) ? v : 0);
                  }, 0);
                  return `₹ ${totalPaid || 0}`;
                })()}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow">
              <div className="text-xs text-gray-500">Total Discount</div>
              <div className="text-lg font-semibold">
                {(() => {
                  const student = AllStudentListData.find(
                    (s) => s?._id === StudentDataFromLedger?.StudentId
                  );
                  const payments = student?.payments
                    ? Array.isArray(student.payments)
                      ? student.payments
                      : [student.payments]
                    : [];
                  const totalDiscount = payments.reduce((acc, p) => {
                    const v = Number(p?.DiscountAmount ?? 0);
                    return acc + (Number.isFinite(v) ? v : 0);
                  }, 0);
                  return `₹ ${totalDiscount || 0}`;
                })()}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow">
              <div className="text-xs text-gray-500">Balance (approx.)</div>
              <div className="text-lg font-semibold">
                {(() => {
                  // Best-effort: if student has SubCourse admissionFee and payments, compute difference
                  const student = AllStudentListData.find(
                    (s) => s?._id === StudentDataFromLedger?.StudentId
                  );
                  if (!student) return "₹ 0";
                  const fee = Number(
                    student?.SubCourse?.admissionFeeId?.feeAmount ?? 0
                  );
                  const payments = student?.payments
                    ? Array.isArray(student.payments)
                      ? student.payments
                      : [student.payments]
                    : [];
                  const paid = payments.reduce((acc, p) => {
                    const v = Number(p?.FinalAmount ?? p?.paymentAmount ?? 0);
                    return acc + (Number.isFinite(v) ? v : 0);
                  }, 0);
                  const bal = Math.max(0, fee - paid);
                  return `₹ ${bal}`;
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 px-4 bg-white rounded-2xl  h-[calc(100vh-380px)] min-h-[175px] overflow-y-scroll ">
          {StudentDataFromLedger?.StudentId ? (
            <ListOf_StudentLedger
              StudentDataFromLedger={StudentDataFromLedger}
            />
          ) : (
            <div className="w-full h-[40vh] flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                Select a student to view ledger
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Admin_StudentLedger;
