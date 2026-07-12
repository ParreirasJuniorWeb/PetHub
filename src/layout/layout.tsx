import { Outlet } from "react-router-dom";

//  Components
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SideBar from "../components/layout/Sidebar";

export const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Header />
            <Outlet />
            <SideBar />
            <Footer />
        </div>
    );
};