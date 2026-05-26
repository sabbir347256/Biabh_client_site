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
