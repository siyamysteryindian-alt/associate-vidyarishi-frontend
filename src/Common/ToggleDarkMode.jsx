import { useState } from "react";
import { useEffect } from "react";
import { LiaToggleOnSolid, LiaToggleOffSolid } from "react-icons/lia";
import "../App.css";

export default function Togglebtn() {
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode"));
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", JSON.stringify(true));
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", JSON.stringify(false));
    }
  }, [darkMode]);

  return (
    <>
      <button
        title="Darkmode ON/OF"
        onClick={() => setDarkMode(!darkMode)}
        className="rounded-xl font-semibold flex justify-center items-center py-1.5 px-4 border-2 border-slate-200 bg-white dark:text-black"
      >
        {darkMode ? (
          <span>
            <LiaToggleOnSolid size={20} />
          </span>
        ) : (
          <span>
            <LiaToggleOffSolid size={20} />
          </span>
        )}
      </button>
    </>
  );
}
