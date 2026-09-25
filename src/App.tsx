import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect, type ReactElement } from "react";
import { preloadPoseModel } from "./utils/preloadModel";
import { products } from "./data/products";
// Pages
import Home from "./pages/Home";
import Shirts from "./collections/Shirts";
import CategoryPage from "./pages/CategoryPage";
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
import { useCartStore } from "./store/useCartStore";
import { useCustomizationStore } from "./store/useCustomizationStore";

function RequireAuth({ children }: { children: ReactElement }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

function isAvailableShirt(id: string | undefined) {
  return products.some(
    (product) =>
      product.id === id &&
      product.category === "artisanal-shirt" &&
      product.inStock
  );
}

function RequireShirtProduct({
  children,
  requireCustomization = false,
}: {
  children: ReactElement;
  requireCustomization?: boolean;
}) {
  const { id } = useParams<{ id: string }>();
  const customizationProductId = useCustomizationStore(
    (state) => state.productId
  );
  const isEligible =
    isAvailableShirt(id) &&
    (!requireCustomization || customizationProductId === id);

  if (!isEligible) {
    return <Navigate to="/category/artisanal-shirt" replace />;
  }

  return children;
}

function RequireShirtCart({ children }: { children: ReactElement }) {
  const items = useCartStore((state) => state.items);
  const hasUnavailableItem = items.some(
    (item) => !isAvailableShirt(item.productId)
  );

  if (hasUnavailableItem) {
    return <Navigate to="/cart" replace />;
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
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/product/:id"
            element={
              <RequireShirtProduct>
                <ProductDetails />
              </RequireShirtProduct>
            }
          />
          <Route
            path="/fabric-selection/:id"
            element={
              <RequireShirtProduct>
                <FabricSelection />
              </RequireShirtProduct>
            }
          />
          <Route
            path="/measurements/:id"
            element={
              <RequireShirtProduct>
                <Measurements />
              </RequireShirtProduct>
            }
          />
          <Route
            path="/measurements/manual/:id"
            element={
              <RequireShirtProduct>
                <ManualMeasurements />
              </RequireShirtProduct>
            }
          />
          <Route
            path="/measurements/review/:id"
            element={
              <RequireShirtProduct>
                <MeasurementReview />
              </RequireShirtProduct>
            }
          />
          <Route
            path="/final-review/:id"
            element={
              <RequireShirtProduct requireCustomization>
                <FinalReview />
              </RequireShirtProduct>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <RequireShirtCart>
                  <Checkout />
                </RequireShirtCart>
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
        <Route
          path="/try-on-preview/:id"
          element={
            <RequireShirtProduct>
              <VirtualTryOnPreview />
            </RequireShirtProduct>
          }
        />
      </Routes>
    </>
  );
}
