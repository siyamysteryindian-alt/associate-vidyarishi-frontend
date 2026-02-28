import React, { useEffect, useState } from "react";
import LiftOfOnlinePayment from "./LiftOfOnlinePayment";
import FilterList from "./FilterList";
import { IoChevronBack, IoChevronForwardOutline } from "react-icons/io5";

const Admin_OnlinePaymentStudent = () => {
  const [FilterListBoolean, setFilterListBoolean] = useState(false);
  const [MainListBoolean, setMainListBoolean] = useState(true);

  const [OnlinePaymentData, setOnlinePaymentData] = useState({
    FromDate: "",
    ToDate: "",
    Center: "",
    SearchKeyWord: "",
  });

  const HandleInputChange = (e) => {
    const { name, value } = e.target;
    setOnlinePaymentData((prev) => ({ ...prev, [name]: value }));
  };

  // re-evaluate when filters change
  useEffect(() => {
    const dateRange =
      OnlinePaymentData?.FromDate !== "" && OnlinePaymentData?.ToDate !== "";
    if (
      dateRange ||
      (OnlinePaymentData?.Center && OnlinePaymentData?.Center !== "") ||
      (OnlinePaymentData?.SearchKeyWord &&
        OnlinePaymentData?.SearchKeyWord.trim() !== "")
    ) {
      setFilterListBoolean(true);
      setMainListBoolean(false);
    } else {
      setFilterListBoolean(false);
      setMainListBoolean(true);
    }
  }, [OnlinePaymentData]);

  const HandleDisplayAllOnlinePayments = () => {
    setOnlinePaymentData({
      FromDate: "",
      ToDate: "",
      Center: "",
      SearchKeyWord: "",
    });
    setFilterListBoolean(false);
    setMainListBoolean(true);
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
          Online Payments
        </div>
      </div>

      <div className="rounded-xl w-full mt-2">
        <section className="dark:bg-gray-900 px-1 text-base">
          <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
            {/* Search / Filters */}
            <div className="px-4 py-4">
              <form
                className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="md:col-span-2">
                  <label
                    htmlFor="FromDate"
                    className="font-semibold block text-sm"
                  >
                    From Date - To Date
                  </label>
                  <div className="flex gap-2 mt-2">
                    <input
                      id="FromDate"
                      name="FromDate"
                      type="date"
                      value={OnlinePaymentData.FromDate}
                      onChange={HandleInputChange}
                      className="w-1/2 text-sm bg-gray-50 border border-gray-300 rounded-l px-2 py-1.5 dark:bg-gray-700"
                      aria-label="From date"
                    />
                    <div className="inline-flex items-center px-2 bg-gray-50 border-t border-b border-gray-300 text-sm">
                      To
                    </div>
                    <input
                      id="ToDate"
                      name="ToDate"
                      type="date"
                      value={OnlinePaymentData.ToDate}
                      onChange={HandleInputChange}
                      className="w-1/2 text-sm bg-gray-50 border border-gray-300 rounded-r px-2 py-1.5 dark:bg-gray-700"
                      aria-label="To date"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="Center"
                    className="font-semibold block text-sm"
                  >
                    Center
                  </label>
                  <select
                    id="Center"
                    name="Center"
                    value={OnlinePaymentData.Center}
                    onChange={HandleInputChange}
                    className="mt-2 block w-full rounded border border-gray-300 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
                    aria-label="Select center"
                  >
                    <option value="">Select</option>
                    <option value="Sk center">Sk center</option>
                    <option value="Sk center 2">Sk center 2</option>
                    <option value="Sk center 3">Sk center 3</option>
                    <option value="Sk center 4">Sk center 4</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="SearchKeyWord"
                    className="font-semibold block text-sm"
                  >
                    Search
                  </label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 4a4 4 0 100 8 4 4 0 000-8z" />
                        <path d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                      </svg>
                    </div>
                    <input
                      id="SearchKeyWord"
                      name="SearchKeyWord"
                      type="text"
                      value={OnlinePaymentData.SearchKeyWord}
                      onChange={HandleInputChange}
                      placeholder="Search"
                      className="pl-10 pr-3 py-1.5 w-full rounded border border-gray-300 text-sm bg-gray-50 dark:bg-gray-700"
                      aria-label="Search payments"
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={HandleDisplayAllOnlinePayments}
                    className="mt-2 rounded-lg px-4 py-1.5 bg-pink-200 border-pink-500 border-2 font-semibold text-pink-800 hover:bg-pink-100 text-sm"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      /* you can wire apply behavior here if needed */
                      setFilterListBoolean(
                        Boolean(
                          OnlinePaymentData.SearchKeyWord ||
                            OnlinePaymentData.Center ||
                            (OnlinePaymentData.FromDate &&
                              OnlinePaymentData.ToDate)
                        )
                      );
                      setMainListBoolean(false);
                    }}
                    className="mt-2 rounded-lg px-4 py-1.5 bg-[var(--color-purple)] text-white text-sm"
                  >
                    Apply
                  </button>
                </div>
              </form>
            </div>

            {/* table */}
            <div
              className="overflow-auto pb-2.5 px-4"
              // style={{ maxHeight: "50vh" }}
            >
              <div className="min-w-full">
                <table className="min-w-full text-base text-left text-slate-900">
                  <thead className="text-xs sticky top-0 p-10 text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      {[
                        "Sr No",
                        "Receipt",
                        "Transaction ID",
                        "Gateway ID",
                        "Mode",
                        "Bank Name",
                        "Amount",
                        "Payment By",
                        "Owner",
                        "Date",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          scope="col"
                          className="px-4 py-2 whitespace-nowrap text-xs"
                        >
                          <div className="flex gap-3">
                            <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {header}
                            </h1>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Body */}
                  {FilterListBoolean ? (
                    <FilterList />
                  ) : MainListBoolean ? (
                    <LiftOfOnlinePayment />
                  ) : (
                    <tbody>
                      <tr>
                        <td
                          colSpan={12}
                          className="p-6 text-center text-sm text-gray-500"
                        >
                          Not Found
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>

            {/* pagination */}
            <nav
              className="flex text-sm flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 px-4 py-3"
              aria-label="Table navigation"
            >
              <span className="font-normal text-gray-500 dark:text-gray-400 flex gap-1">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  1-10
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  1000
                </span>
              </span>

              <ul className="inline-flex items-stretch -space-x-px">
                <li>
                  <button className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100">
                    <IoChevronBack />
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-center py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300">
                    1
                  </div>
                </li>
                <li>
                  <button className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100">
                    <IoChevronForwardOutline />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Admin_OnlinePaymentStudent;
