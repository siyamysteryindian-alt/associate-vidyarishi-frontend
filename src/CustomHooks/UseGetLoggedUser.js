import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../Redux/UserSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { setUniversityDetails } from "../Redux/UniversitySlice";

const UseGetLoggedUser = () => {
  const Dispatch = useDispatch();
  const UserDetails = useSelector((state) => state?.user);
  const UniversityReduxData = useSelector((state) => state?.university);
  const NavigateTo = useNavigate();
  const [CheckingUserLogged, setCheckingUserLogged] = useState(false);
  const [GetLoggedUserLoader, setGetLoggedUserLoader] = useState(false);
  const [LoggedUserData, setLoggedUserData] = useState({});

  const GetLoginUserDetails = async () => {
    try {
      setGetLoggedUserLoader(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/GetLoggeduser`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        const userData = response?.data?.LoginData;
        setLoggedUserData(userData);
        Dispatch(
          setUserDetails({
            id: userData?._id,
            name: userData?.name,
            photo: userData?.photo,
            email: userData?.email,
            role: userData?.role,
          })
        );

        const LocalstorageData = {
          id: userData?._id,
          name: userData?.name,
          photo: userData?.photo,
          email: userData?.email,
          role: userData?.role,
        };

        localStorage.setItem("LoggedUser", JSON.stringify(LocalstorageData));
        localStorage.setItem(
          "authToken",
          JSON.stringify(response?.data?.token)
        );
        if (UniversityReduxData?.id !== "") {
          localStorage.setItem("UniversityChange", JSON.stringify(false));
        } else {
          localStorage.setItem("UniversityChange", JSON.stringify(true));
        }
      } else {
        toast.error(response?.data?.message);
        Dispatch(
          setUserDetails({
            id: "",
            name: "",
            photo: "",
            email: "",
            role: "",
          })
        );
        localStorage.clear("TokenSetIICE");
      }
    } catch (error) {
      if (error?.message === "Request failed with status code 400") {
        localStorage.clear("TokenSetIICE");

        Dispatch(
          setUserDetails({
            id: "",
            name: "",
            photo: "",
            email: "",
            role: "",
          })
        );
      }
    } finally {
      setGetLoggedUserLoader(false);
    }
  };

  return {
    CheckingUserLogged,
    GetLoginUserDetails,
    GetLoggedUserLoader,
    LoggedUserData,
  };
};

export default UseGetLoggedUser;
