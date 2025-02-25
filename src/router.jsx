import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./features/posts/Home";
import PrivateRoute from "./PrivateRoute";
import Auth from "./features/auth/Auth";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        index: true,
        element: <PrivateRoute><Home /></PrivateRoute>,
      },
      {
        path: "/auth"
        , element: <Auth />
      },
      {
        path: "/create",
        element: <CreatePost />
      }, 
      {
        path: "/edit/:id",
        element: <EditPost />
      }
    ],
  },
]);

export default router;
