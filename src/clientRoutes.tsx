import { createBrowserRouter } from "react-router-dom";
import { HomeLayout } from "./pages/home/HomeLayout";

export const clientRoutes = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
  },
  {
    path: "/auth/callback",
    element: <HomeLayout />,
  },
]);
