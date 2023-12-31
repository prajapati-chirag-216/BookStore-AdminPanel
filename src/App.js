import React from "react";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Wrapper from "./components/UI/Wrapper";
import Layout from "./components/UI/Layout";
import Error from "./components/UI/Error";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import "./App.css";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import UsersPage from "./pages/UsersPage";
import ProtectedRoutes, {
  loader as profileLoader,
} from "./routes/ProtectedRoutes";
import { loader as categoryLoader } from "./components/Product/Form";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Wrapper />} errorElement={<Error />}>
      <Route index element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" />} />
        <Route
          element={<ProtectedRoutes destination="/auth" />}
          loader={profileLoader}
        >
          <Route index element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route
            path="/products"
            element={<ProductPage />}
            loader={categoryLoader}
          />
        </Route>
      </Route>
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
