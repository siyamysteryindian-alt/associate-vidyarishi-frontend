import React, { useEffect, useState } from "react";
import { HiDownload } from "react-icons/hi";
import { MdOutlineAdd } from "react-icons/md";
import ListOfAccountants from "./ListOfAccountants";
import CreateAccountant from "./CreateAccountant";
import UseGetAccountant from "../../../../CustomHooks/UseGetAccountant";
import { useSelector } from "react-redux";

const AdminAccountant = () => {
  const [OpenCreateAccountant, setOpenCreateAccountant] = useState(false);

  const ReduxLoggedUser = useSelector((state) => state?.user);

  const HandleOpenCreateAccountant = () => {
    setOpenCreateAccountant(true);
  };
  const HandleCloseCreateAccountant = () => {
    setOpenCreateAccountant(false);
  };

  const { AccountantLoading, AccountantError, Accountant, GetAccountantData } =
    UseGetAccountant();

  useEffect(() => {
    GetAccountantData();
  }, []);

  return (
    <>
      <section
        className="mt-2 mx-2 rounded-lg"
        style={{ background: "var(--color-bg)" }}
      >
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
            Accountant
          </div>
          <div className="flex flex-row gap-6">
            {ReduxLoggedUser?.role !== "university-manager" && (
              <button
                className="px-4 py-1.5 dark:text-black bg-green-500 tracking-wide uppercase text-white font-bold rounded-lg flex justify-center items-center gap-x-1 text-sm"
                onClick={HandleOpenCreateAccountant}
              >
                Create <MdOutlineAdd size={20} />
              </button>
            )}
          </div>
        </div>
        <ListOfAccountants
          AccountantLoading={AccountantLoading}
          AccountantError={AccountantError}
          Accountant={Accountant}
          GetAccountantData={GetAccountantData}
        />
      </section>

      {OpenCreateAccountant && (
        <>
          <CreateAccountant
            HandleCloseCreateAccountant={HandleCloseCreateAccountant}
            AccountantLoading={AccountantLoading}
            AccountantError={AccountantError}
            Accountant={Accountant}
            GetAccountantData={GetAccountantData}
          />
        </>
      )}
    </>
  );
};

export default AdminAccountant;
