import React, { useState } from "react";
import ListOfStudents from "./ListOfStudents";
import CreateStudent from "./CreateStudent";

const AdminStudent = () => {
  const [CreateStudentButton, setCreateStudentButton] = useState(false);

  const HandleOpenCreateStudent = () => {
    setCreateStudentButton(true);
  };
  const HandleCloseCreateStudent = () => {
    setCreateStudentButton(true);
  };

  return (
    <>
      <section className="top-0 dark:bg-slate-900 dark:text-white bg-slate-200 py-2 h-[calc(100vh-115px)] m-2 rounded-lg">
        <div className="px-8 w-full dark:bg-slate-900 dark:text-white h-16 bg-slate-100 flex items-center justify-between">
          <div className="text-lg font-bold tracking-wide">Student</div>
          <div className="flex flex-row gap-6">
            <button
              className="px-4 py-1.5 dark:text-black bg-green-500 tracking-wide uppercase text-white font-bold rounded-lg flex justify-center items-center gap-x-1 text-sm"
              onClick={HandleOpenCreateStudent}
            >
              Create
            </button>
          </div>
        </div>
        <section>
          <ListOfStudents />
        </section>
      </section>

      {CreateStudentButton && (
        <span>
          <CreateStudent HandleCloseCreateStudent={HandleCloseCreateStudent} />
        </span>
      )}
    </>
  );
};

export default AdminStudent;
