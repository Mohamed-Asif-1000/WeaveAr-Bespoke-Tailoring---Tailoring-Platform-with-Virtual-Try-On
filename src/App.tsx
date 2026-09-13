import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, type ReactElement } from "react";
import { preloadPoseModel } from "./utils/preloadModel";
// Pages
import Home from "./pages/Home";
import Shirts from "./collections/Shirts";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/CheckOut";
import Measurements from "./pages/Measurements";
import ManualMeasurements from "./pages/ManualMeasurements";
import VirtualTryOnPreview from "./pages/VirtualTryOnPreview";
import MeasurementReview from "./pages/MeasurementsReview";
import FabricSelection from "./pages/FabricSelection";
import FinalReview from "./pages/FinalReview";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import { useAuthStore } from "./store/useAuthStore";

function RequireAuth({ children }: { children: ReactElement }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export default function App() {
  useEffect(() => {
    preloadPoseModel().catch(err => console.log("Model preload:", err));
  }, []);

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collections/shirts" element={<Shirts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/fabric-selection/:id" element={<FabricSelection />} />
          <Route path="/measurements/:id" element={<Measurements />} />
          <Route
            path="/measurements/manual/:id"
            element={<ManualMeasurements />}
          />
          <Route
            path="/measurements/review/:id"
            element={<MeasurementReview />}
          />
          <Route path="/final-review/:id" element={<FinalReview />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/try-on-preview/:id" element={<VirtualTryOnPreview />} />
      </Routes>
    </>
  );
}
