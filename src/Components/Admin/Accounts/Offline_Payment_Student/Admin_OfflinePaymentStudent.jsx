import React, { useEffect, useState } from "react";
import ListOfOflinePayments from "./ListOfOflinePayments";
import FilterList from "./FilterList";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";
import UsePaymentData from "../../../../CustomHooks/UsePaymentData";
import { useSelector } from "react-redux";
import UseGetCenterSubCenter from "../../../../CustomHooks/UseGetCenterSubCenter";
import toast from "react-hot-toast";

const Admin_OfflinePaymentStudent = () => {
  const [filters, setFilters] = useState({
    FromDate: "",
    ToDate: "",
    Center: "",
    SearchKeyWord: "",
  });

  const HandleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const {
    PaymentLoading,
    PaymentError,
    Payment,
    GetAllPaymentData,
    PaymentCurrentPage,
    PaymentTotalPages,
    PaymentLimit,
    PaymentTotalDocs,
    handlePageChange,
  } = UsePaymentData();

  const { GetCenter, CenterError, CenterLoading, Center } =
    UseGetCenterSubCenter();

  const ReduxUniversity = useSelector((state) => state?.university);
  const UserLoggedGetDataFromRedux = useSelector((state) => state?.user);

  // initial fetch
  useEffect(() => {
    GetAllPaymentData(1, 100, "");
    GetCenter();
    // eslint-disable-next-line
  }, []);

  // when university switches, refetch
  useEffect(() => {
    if (ReduxUniversity?.id) {
      GetAllPaymentData(1, 100, "");
    }
    // eslint-disable-next-line
  }, [ReduxUniversity?.id]);

  // search & center filters: fetch when those change
  useEffect(() => {
    const q = filters.SearchKeyWord?.trim();
    if (q && q.length > 0) {
      GetAllPaymentData(1, 100, q);
    }
    // eslint-disable-next-line
  }, [filters.SearchKeyWord]);

  useEffect(() => {
    if (filters.Center) {
      GetAllPaymentData(1, 100, filters.Center);
    }
    // eslint-disable-next-line
  }, [filters.Center]);

  const clearFilters = () =>
    setFilters({ FromDate: "", ToDate: "", Center: "", SearchKeyWord: "" });

  const handlePrevPage = () => {
    if (PaymentCurrentPage > 1) handlePageChange(PaymentCurrentPage - 1);
    else toast.error("Already on first page");
  };

  const handleNextPage = () => {
    if (PaymentCurrentPage < PaymentTotalPages)
      handlePageChange(PaymentCurrentPage + 1);
    else toast.error("No more pages");
  };

  return (
    <>
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
            Offline Payments
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.06)",
                color: "var(--brand-ink)",
              }}
              onClick={() => {
                // placeholder export
                toast("Download triggered (implement export).");
              }}
            >
              Download
            </button>
          </div>
        </div>

        {/* content */}
        <section>
          <div
            className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden mt-4"
            style={{ borderRadius: "var(--card-radius)" }}
          >
            {/* Filters area */}
            <div className="px-4 py-4 border-b">
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="FromDate"
                    value={filters.FromDate}
                    onChange={HandleInputChange}
                    className="w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="ToDate"
                    value={filters.ToDate}
                    onChange={HandleInputChange}
                    className="w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Center
                  </label>
                  <select
                    name="Center"
                    value={filters.Center}
                    onChange={HandleInputChange}
                    className="w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700"
                  >
                    <option value="">All Centers</option>
                    {Center?.length ? (
                      Center.filter((c) =>
                        c?.allotedUniversities?.some(
                          (u) => u?._id === ReduxUniversity?.id && !c?.isDeleted
                        )
                      ).map((c, i) => (
                        <option key={i} value={c?.name}>
                          {c?.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No centers</option>
                    )}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold block mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    name="SearchKeyWord"
                    value={filters.SearchKeyWord}
                    onChange={HandleInputChange}
                    placeholder="Search by student, transaction id, etc."
                    className="w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="flex items-end justify-end gap-2">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-3 py-2 rounded border text-sm"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* table */}
            <div
              className="overflow-auto pb-2.5 px-4"
              style={{ maxHeight: "calc(100vh - 320px)" }}
            >
              <div className="min-w-full overflow-x-auto">
                <table className="min-w-full text-base text-left text-slate-900">
                  <thead className="text-xs sticky top-0 p-4 text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      {[
                        "Sr No",
                        "Center Name",
                        "Student Name",
                        "Photo Proof",
                        "Transaction ID",
                        "Mode",
                        "Bank Name",
                        "Amount",
                        "Discounted Amount",
                        "Final Amount",
                        "Payment By",
                        "Date",
                        "Payment Remark",
                        "Status",
                        ...(UserLoggedGetDataFromRedux?.role === "Admin" ||
                        UserLoggedGetDataFromRedux?.role === "Accountant"
                          ? ["Action"]
                          : []),
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-3 py-2 whitespace-nowrap text-xs"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* list body component (keeps behaviour) */}
                  <ListOfOflinePayments
                    PaymentLoading={PaymentLoading}
                    PaymentError={PaymentError}
                    Payment={Payment}
                    GetAllPaymentData={GetAllPaymentData}
                  />
                </table>
              </div>
            </div>

            {/* pagination / footer */}
            <div className="px-4 py-3 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <strong className="text-gray-900">
                  {Payment?.length || 0}
                </strong>{" "}
                of{" "}
                <strong className="text-gray-900">
                  {PaymentTotalDocs || 0}
                </strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, PaymentCurrentPage - 1))
                  }
                  className="px-3 py-1 rounded border text-sm"
                >
                  <IoChevronBack />
                </button>

                <div className="text-sm">
                  Page {PaymentCurrentPage} / {PaymentTotalPages || 1}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(PaymentTotalPages || 1, PaymentCurrentPage + 1)
                    )
                  }
                  className="px-3 py-1 rounded border text-sm"
                >
                  <IoChevronForwardOutline />
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Admin_OfflinePaymentStudent;
