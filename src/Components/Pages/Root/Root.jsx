import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "../Shared/Navbar";
import Footer from "../Shared/Footer";

const Root = () => {
    return (
        <div>
            <ScrollRestoration></ScrollRestoration>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Root;