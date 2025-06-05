import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import {
  Dashboard,
  Home,
  LoginPage,
  ProfilePage,
  SignUp,
  AlertPage,
} from "./views";
import { MainLayout } from "./layout";
import userStore from "./stores/useUserStore";

const Protected = ({ children }) => {
  const user = userStore((state) => state.user);
  if (user.isLoggedin) return <>{children}</>;
  else return <Navigate to={"/login"} replace />;
};

const Authorize = ({ children }) => {
  const user = userStore((state) => state.user);
  if (user.isLoggedin) return <Navigate to={"/profile"} />;
  return <>{children}</>;
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/*",
          element: <>page not found</>,
        },
        {
          path: "/login",
          element: (
            <Authorize>
              <LoginPage />
            </Authorize>
          ),
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/alerts",
          element: (
            <Protected>
              <AlertPage />
            </Protected>
          ),
        },
        {
          path: "/profile",
          element: (
            <Protected>
              <ProfilePage />
            </Protected>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <Protected>
              <Dashboard />
            </Protected>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
