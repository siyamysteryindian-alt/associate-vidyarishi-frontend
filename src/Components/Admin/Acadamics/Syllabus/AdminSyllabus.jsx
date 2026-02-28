import React from "react";
import ListOfSyllabus from "./ListOfSyllabus";

const AdminSyllabus = () => {
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
            Syllabus
          </div>
        </div>
        <section>
          <ListOfSyllabus />
        </section>
      </section>
    </>
  );
};

export default AdminSyllabus;
