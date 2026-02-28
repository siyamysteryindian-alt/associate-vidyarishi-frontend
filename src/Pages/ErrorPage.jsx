import React from "react";
import "./ErrorPage.css";
import { NavLink, useNavigate } from "react-router-dom";

const ErrorPage = () => {

  const navigate = useNavigate();

  const goBack =() => {
    navigate(-1);
  }

  return (
    <>
      <div
        className=" text-center flex-col flex justify-center items-center h-screen 
      font-bold "
      >
        <div className="text-[150px]">4O4</div>
        <div className="text-lg capitalize">PAGE NOT FOUND</div>
        <div>
          <button onClick={goBack} className="px-8 py-3 m-5 rounded-lg border-4 border-green-400 hover:bg-green-400 text-sm">
            Go Back
          </button>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
