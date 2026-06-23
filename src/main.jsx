import React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { HelmetProvider } from "react-helmet-next";
import Root from "./Components/Pages/Root/Root";
import AuthContext from "./Components/AuthProvider/AuthContext";
import Login from "./Components/Pages/Authentication/Login/Login";
import SignUp from "./Components/Pages/Authentication/SignUp/SignUp";
import HomeRoot from "./Components/Pages/HomePages/HomeRoot";
import UserProfile from "./Components/Pages/userAdmin&AgentProfile/userProfileSection/UserProfile";
import Underconstraction from "./Components/Pages/Shared/Underconstraction";
import ProfileDetails from "./Components/Pages/SpecifiqProfile/ProfileDetails";
import UserPrivateRoute from "./Components/Pages/PrivateRoute/UserPrivateRoute";
import Search from "./Components/Pages/Search/Search";
// import SuccessStory from "./Components/Pages/successStory/SuccessStory";
// import Contact from "./Components/Pages/Contact/Contact";
import ForgotPass from "./Components/Pages/Authentication/ForgotPass/ForgotPass";
import LoginSuccess from "./Components/Pages/Authentication/Login/LoginSuccess";
import ContactUs from "./Components/Pages/Shared/ContactUs";
import TermCondition from "./Components/Pages/Shared/TermCondition";
import SuccessStory from "./Components/Pages/successStory/SuccessStory";


const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <HomeRoot></HomeRoot>
      },
      {
        path: "/user-profile",
        element: <UserPrivateRoute><UserProfile></UserProfile></UserPrivateRoute>
      },
      {
        path: "/:fullName/:id",
        element: <ProfileDetails></ProfileDetails>
      },
      {
        path: "/login",
        element: <Login></Login>
      },
      {
        path: "/create-account",
        element: <SignUp></SignUp>
      },
      {
        path: "/find-match",
        element: <Search></Search>
      },
      {
        path: "/forgot-password",
        element: <ForgotPass></ForgotPass>
      },
      {
        path: "/login-success",
        element: <LoginSuccess></LoginSuccess>
      },
      {
        path: "/contact",
        element: <ContactUs></ContactUs>
      },
      {
        path: "/term-condition",
        element: <TermCondition></TermCondition>
      },
      // {
      //   path: "/success-stories",
      //   element: <SuccessStory></SuccessStory>
      // },
      // {
      //   path: "/contact",
      //   element: <Contact></Contact>
      // },
      {
        path: "*",
        element: <Underconstraction></Underconstraction>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthContext>
      <HelmetProvider>
        <React.StrictMode>
          <RouterProvider router={router}></RouterProvider>
        </React.StrictMode>
      </HelmetProvider>
    </AuthContext>
  </QueryClientProvider>,
);
