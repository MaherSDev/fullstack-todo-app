import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  return (
    <div className="root-layout">
      <Navbar />
      <div className="container max-w-2xl mx-auto md:px-0 px-5">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
