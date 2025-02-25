import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { getCurrentUser } from "./features/auth/authSlice";
import router from "./router";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser()).catch(() => {});
  }, [dispatch]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }
  return <RouterProvider router={router} />;
}
