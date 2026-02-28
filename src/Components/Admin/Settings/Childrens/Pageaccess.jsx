import React from "react";
import ListOfPageAccess from "../ChildrenComps/PageAccess/ListOfPageAccess";

const Pageaccess = () => {



  return (
    <>
      <section className="top-0  py-1 h-[calc(80vh-115px)]  rounded-lg">
        <div className="px-8 w-full h-14 rounded-t-lg dark:bg-slate-900 dark:text-white bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">Page Access</div>
        </div>
        <div className="bg-white dark:bg-slate-900 dark:text-white h-full overflow-auto">
          <ListOfPageAccess />
        </div>
      </section>
    </>
  );
};

export default Pageaccess;
