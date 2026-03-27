import React, { useEffect, useMemo } from "react";
import logo from "../../../../../public/logo.jpg";
import UseGetStudentById from "../../../../CustomHooks/UseGetStudentById";

/**
 * ListOf_StudentLedger
 * - receives StudentDataFromLedger: { StudentId }
 * - uses UseGetStudentById() to fetch student details (keeps your hook)
 * - renders student card + ledger table with running balance, totals and responsive layout
 */
const ListOf_StudentLedger = ({ StudentDataFromLedger }) => {
  const {
    StudentByIdLoading,
    StudentByIdError,
    StudentDataById,
    GetStudentById,
  } = UseGetStudentById();

  useEffect(() => {
    if (StudentDataFromLedger?.StudentId) {
      GetStudentById(StudentDataFromLedger.StudentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StudentDataFromLedger?.StudentId]);

  // Normalize payments to an array and sort by date (oldest first) for running balance
  const payments = useMemo(() => {
    if (!StudentDataById?.payments) return [];
    const arr = Array.isArray(StudentDataById.payments)
      ? StudentDataById.payments.slice()
      : [StudentDataById.payments];
    // Try sorting by paymentDate if present
    arr.sort((a, b) => {
      const da = a?.paymentDate ? new Date(a.paymentDate) : new Date(0);
      const db = b?.paymentDate ? new Date(b.paymentDate) : new Date(0);
      return da - db;
    });
    return arr;
  }, [StudentDataById]);

  // totals
  const totals = useMemo(() => {
    const t = payments.reduce(
      (acc, p) => {
        const fee = Number(p?.paymentAmount ?? 0);
        const discount = Number(p?.DiscountAmount ?? 0);
        const final = Number(p?.FinalAmount ?? p?.paymentAmount ?? 0);
        acc.totalFee += Number.isFinite(fee) ? fee : 0;
        acc.totalDiscount += Number.isFinite(discount) ? discount : 0;
        acc.totalFinal += Number.isFinite(final) ? final : 0;
        return acc;
      },
      { totalFee: 0, totalDiscount: 0, totalFinal: 0 }
    );
    return t;
  }, [payments]);

  // compute running balance: assume starting balance is admission fee if present else 0
  const initialFee = Number(
    StudentDataById?.SubCourse?.admissionFeeId?.feeAmount ?? 0
  );
  const rowsWithRunning = useMemo(() => {
    let balance = initialFee;
    return payments.map((p) => {
      const paid = Number(p?.FinalAmount ?? p?.paymentAmount ?? 0);
      // subtract paid from balance
      balance = +(balance - (Number.isFinite(paid) ? paid : 0));
      if (balance < 0) balance = 0;
      return {
        ...p,
        runningBalance: balance,
      };
    });
  }, [payments, initialFee]);

  if (StudentByIdLoading) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="text-sm text-gray-600">Loading student data...</div>
      </div>
    );
  }

  if (StudentByIdError) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="text-sm text-red-600">Failed to load student data</div>
      </div>
    );
  }

  return (
    <div className="p-4 dark:bg-slate-800 dark:text-white">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Student card */}
        <div className="w-full md:w-[36rem] flex-shrink-0 bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-sm">
          <div className="flex gap-4">
            <div className="w-28 h-28 flex items-center justify-center bg-gray-50 rounded-lg border">
              <img src={logo} alt="logo" className="w-24 h-24 object-contain" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">
                {StudentDataById?.fullName || "—"}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {StudentDataById?.Course?.shortName || "Course"} •{" "}
                {StudentDataById?.SubCourse?.shortName || "SubCourse"}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Admission Session</div>
                  <div className="font-medium">
                    {StudentDataById?.admissionSession?.name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Admission Type</div>
                  <div className="font-medium">
                    {StudentDataById?.admissionType?.name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Admission Fee</div>
                  <div className="font-medium">₹ {initialFee}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="font-medium">
                    {StudentDataById?.payments?.paymentStatus || "Not Paid"}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                  onClick={() => {
                    // if you want to hook to your payment modal, you can pass a callback prop; for now it's a placeholder
                    // example: open payment modal
                    // eslint-disable-next-line no-console
                    console.log(
                      "Pay offline clicked for",
                      StudentDataById?._id
                    );
                  }}
                >
                  Pay Offline
                </button>
              </div>
            </div>
          </div>

          {/* summary totals */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded text-center">
              <div className="text-xs text-gray-500">Total Fee</div>
              <div className="font-semibold">₹ {totals.totalFee || 0}</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded text-center">
              <div className="text-xs text-gray-500">Total Discount</div>
              <div className="font-semibold">₹ {totals.totalDiscount || 0}</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded text-center">
              <div className="text-xs text-gray-500">Total Paid</div>
              <div className="font-semibold">₹ {totals.totalFinal || 0}</div>
            </div>
          </div>
        </div>

        {/* Right: Ledger table */}
        <div className="flex-1 min-w-0">
          <div className="text-center bg-slate-200 dark:bg-slate-700 rounded-lg py-2 font-semibold text-lg mb-3 shadow-sm">
            Student Ledger
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-slate-800 sticky top-0">
                <tr>
                  {[
                    "Date",
                    "Particular",
                    "Source",
                    "Transaction ID",
                    "Fee",
                    "Center",
                    "%",
                    "Discounted",
                    "Final Paid",
                    "Running Bal",
                  ].map((c) => (
                    <th
                      key={c}
                      className="px-3 py-2 text-xs font-semibold whitespace-nowrap"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="">
                {rowsWithRunning.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-8 text-center text-gray-600 dark:text-gray-300"
                    >
                      No payments processed yet.
                    </td>
                  </tr>
                ) : (
                  rowsWithRunning.map((p, idx) => (
                    <tr
                      key={p._id ?? idx}
                      className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-900 dark:even:bg-slate-800"
                    >
                      <td className="px-3 py-2 align-top">
                        {p.paymentDate || "-"}
                      </td>
                      <td className="px-3 py-2 align-top">
                        {p.particular || "Admission Fee"}
                      </td>
                      <td className="px-3 py-2 align-top">
                        {p.source || "Offline"}
                      </td>
                      <td className="px-3 py-2 align-top">
                        {p.transactionId || "-"}
                      </td>
                      <td className="px-3 py-2 align-top font-semibold text-green-600">
                        {p.paymentAmount ? `₹ ${p.paymentAmount}` : "₹ 0"}
                      </td>
                      <td className="px-3 py-2 align-top">
                        {p.createdByPayment?.name || "-"}
                      </td>
                      <td className="px-3 py-2 align-top">
                        {p.CenterPercentage ?? 0}%
                      </td>
                      <td className="px-3 py-2 align-top font-semibold text-green-600">
                        {p.DiscountAmount ? `₹ ${p.DiscountAmount}` : "₹ 0"}
                      </td>
                      <td className="px-3 py-2 align-top font-semibold text-green-600">
                        {p.FinalAmount ? `₹ ${p.FinalAmount}` : "₹ 0"}
                      </td>
                      <td className="px-3 py-2 align-top font-medium">
                        {typeof p.runningBalance === "number"
                          ? `₹ ${p.runningBalance}`
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              {/* totals footer */}
              {rowsWithRunning.length > 0 && (
                <tfoot className="bg-gray-50 dark:bg-slate-800">
                  <tr>
                    <td colSpan={4} className="px-3 py-3 font-semibold">
                      Totals
                    </td>
                    <td className="px-3 py-3 font-semibold">
                      ₹ {totals.totalFee}
                    </td>
                    <td className="px-3 py-3" />
                    <td className="px-3 py-3" />
                    <td className="px-3 py-3 font-semibold">
                      ₹ {totals.totalDiscount}
                    </td>
                    <td className="px-3 py-3 font-semibold">
                      ₹ {totals.totalFinal}
                    </td>
                    <td className="px-3 py-3" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOf_StudentLedger;
