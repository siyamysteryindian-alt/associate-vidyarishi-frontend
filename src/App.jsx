import { Toaster } from "react-hot-toast";
import "./App.css";
import { Outlet } from "react-router-dom";
import UseGetLoggedUser from "./CustomHooks/UseGetLoggedUser";
import { useEffect } from "react";
function App() {
  const { GetLoginUserDetails, CheckingUserLogged, GetLoggedUserLoader } =
    UseGetLoggedUser();

  useEffect(() => {
    GetLoginUserDetails();
  }, []);

  return (
    <>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
