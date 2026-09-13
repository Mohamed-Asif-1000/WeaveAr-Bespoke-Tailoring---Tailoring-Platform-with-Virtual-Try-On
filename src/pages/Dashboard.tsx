import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Package,
  UserRound,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  LogOut,
  PartyPopper,
} from "lucide-react";
import { useAuthStore, newAddressId } from "../store/useAuthStore";
import { useOrdersStore } from "../store/useOrdersStore";
import type { Address } from "../types";
import { ORDER_STATUSES } from "../types";
import { formatINR } from "../data/fabrics";

type Tab = "orders" | "profile" | "addresses";

const EMPTY_ADDRESS: Address = {
  id: "",
  label: "Home",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
  isDefault: false,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [tab, setTab] = useState<Tab>("orders");
  const [showOrderBanner, setShowOrderBanner] = useState(
    Boolean(
      (location.state as { orderPlaced?: boolean } | null)?.orderPlaced
    )
  );

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <>
      <section className="bg-[#FAF9F6] text-gray-900 min-h-screen">
        {/* Hero */}
        <div className="bg-[#1A1A1A] text-[#FAF9F6]">
          <div className="container mx-auto px-6 py-24 max-w-6xl">
            <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-serif">
              Your Account
            </p>

            {showOrderBanner && (
              <div className="flex items-center gap-4 bg-green-600/20 border border-green-500/40 text-green-200 px-6 py-4 mb-8">
                <PartyPopper size={22} className="text-green-400" />
                <p className="text-sm font-medium">
                  Order placed successfully! You can track its status below.
                </p>
                <button
                  onClick={() => setShowOrderBanner(false)}
                  className="ml-auto text-green-200/70 hover:text-white text-xs uppercase tracking-widest"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl lg:text-6xl font-serif mb-4">
                  Hello, {user.name.split(" ")[0]}
                </h1>
                <p className="text-[#FAF9F6]/70 max-w-xl border-l border-[#D4AF37]/30 pl-6">
                  Track your tailored garments, manage your profile and shipping
                  addresses.
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#D4AF37] hover:text-[#FAF9F6] transition self-start"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mt-12 border-t border-[#D4AF37]/20 pt-8">
              {(
                [
                  { key: "orders", label: "Orders", icon: Package },
                  { key: "profile", label: "Profile", icon: UserRound },
                  { key: "addresses", label: "Addresses", icon: MapPin },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs tracking-[3px] uppercase transition-all border ${
                    tab === t.key
                      ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                      : "border-[#D4AF37]/30 text-[#D4AF37] hover:border-[#D4AF37]"
                  }`}
                >
                  <t.icon size={14} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-20 max-w-6xl">
          {tab === "orders" && <OrdersTab />}
          {tab === "profile" && <ProfileTab />}
          {tab === "addresses" && <AddressesTab />}
        </div>
      </section>
    </>
  );
}

/* ============================== ORDERS ============================== */

function OrdersTab() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrdersStore((s) => s.orders);
  const navigate = useNavigate();

  const myOrders = user ? orders.filter((o) => o.userEmail === user.email) : [];

  if (myOrders.length === 0) {
    return (
      <div className="text-center bg-white border border-gray-200 p-16">
        <Package size={48} strokeWidth={1} className="mx-auto mb-6 text-gray-300" />
        <h2 className="text-2xl font-serif mb-4">No orders yet</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          When you place your first order it will appear here with live-style
          status tracking.
        </p>
        <button
          onClick={() => navigate("/collections/shirts")}
          className="inline-block bg-[#1A1A1A] text-[#D4AF37] px-10 py-4 text-xs tracking-[4px] uppercase hover:opacity-90 transition-opacity"
        >
          Explore Shirts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {myOrders.map((order) => {
        const currentIndex = ORDER_STATUSES.indexOf(order.status);
        return (
          <div key={order.id} className="bg-white border border-gray-200 p-8">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-xs tracking-widest uppercase text-[#D4AF37] font-bold">
                  Order {order.id}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on{" "}
                  {new Date(order.placedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="bg-[#1A1A1A] text-[#D4AF37] text-xs tracking-widest uppercase px-4 py-2">
                {order.status}
              </span>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              {ORDER_STATUSES.map((status, i) => {
                const reached = i <= currentIndex;
                return (
                  <div key={status} className="flex items-center gap-2 shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                        reached
                          ? "border-[#D4AF37] bg-[#D4AF37] text-white"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      {reached ? (
                        <Check size={14} />
                      ) : (
                        <span className="text-[10px]">{i + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs uppercase tracking-widest ${
                        reached ? "text-[#D4AF37]" : "text-gray-400"
                      }`}
                    >
                      {status}
                    </span>
                    {i < ORDER_STATUSES.length - 1 && (
                      <div
                        className={`w-8 h-px ${
                          i < currentIndex ? "bg-[#D4AF37]" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 object-cover border"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.fabricName ?? "Standard Fabric"}
                      {item.fit ? ` · ${item.fit} Fit` : ""} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatINR(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-600">
                <p>
                  Deliver to:{" "}
                  <span className="font-medium">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName},{" "}
                    {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                    {order.shippingAddress.postalCode}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-widest">
                    Total
                  </p>
                  <p className="text-lg font-semibold text-[#D4AF37]">
                    {formatINR(order.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================== PROFILE ============================== */

function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    "w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#D4AF37]";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="text-white bg-[#1A1A1A] p-10 h-fit">
        <div className="w-20 h-20 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-3xl font-serif mb-6">
          {(user?.name ?? "U").charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-serif mb-2">{user?.name}</h2>
        <p className="text-[#FAF9F6]/60 text-sm mb-6">{user?.email}</p>
        <p className="text-xs text-[#FAF9F6]/50 leading-relaxed">
          Your profile is stored locally and used to pre-fill your checkout and
          orders.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-gray-200 p-10 lg:col-span-2">
        <h3 className="text-2xl font-serif mb-8">Edit Profile</h3>

        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
            Profile updated successfully.
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="bg-[#D4AF37] text-white px-10 py-3 text-sm tracking-[3px] uppercase hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================== ADDRESSES ============================== */

function AddressesTab() {
  const addresses = useAuthStore((s) => s.addresses);
  const addAddress = useAuthStore((s) => s.addAddress);
  const updateAddress = useAuthStore((s) => s.updateAddress);
  const removeAddress = useAuthStore((s) => s.removeAddress);
  const setDefaultAddress = useAuthStore((s) => s.setDefaultAddress);

  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  const startAdd = () => {
    setEditing({ ...EMPTY_ADDRESS, id: newAddressId() });
    setShowForm(true);
  };

  const startEdit = (addr: Address) => {
    setEditing({ ...addr });
    setShowForm(true);
  };

  const handleSave = (addr: Address) => {
    if (addr.id && addresses.some((a) => a.id === addr.id)) {
      updateAddress(addr);
    } else {
      addAddress(addr);
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Address list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-serif">Saved Addresses</h3>
          <button
            onClick={startAdd}
            className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-4 py-2 hover:bg-[#D4AF37] hover:text-black transition"
          >
            <Plus size={14} /> Add New
          </button>
        </div>

        {addresses.length === 0 && !showForm && (
          <div className="bg-white border border-dashed border-gray-300 p-10 text-center">
            <MapPin size={40} strokeWidth={1} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">
              No saved addresses yet. Add one to pre-fill your checkout.
            </p>
          </div>
        )}

        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs tracking-widest uppercase text-gray-500 font-bold">
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] tracking-widest uppercase px-2 py-1">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(addr)}
                  className="p-2 text-gray-400 hover:text-[#D4AF37] transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => removeAddress(addr.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {addr.firstName} {addr.lastName}
              <br />
              {addr.address}
              <br />
              {addr.city} {addr.postalCode}
              <br />
              {addr.phone}
            </p>
            {!addr.isDefault && (
              <button
                onClick={() => setDefaultAddress(addr.id)}
                className="text-xs tracking-widest uppercase text-[#D4AF37] hover:underline"
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Address form */}
      {showForm && editing && (
        <AddressForm
          addr={editing}
          isNew={!addresses.some((a) => a.id === editing.id)}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function AddressForm({
  addr,
  isNew,
  onSave,
  onCancel,
}: {
  addr: Address;
  isNew: boolean;
  onSave: (a: Address) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Address>(addr);

  const update = (k: keyof Address, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.address || !form.city || !form.postalCode || !form.phone) {
      return;
    }
    onSave(form);
  };

  const inputClass =
    "w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#D4AF37] text-sm";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 p-10 h-fit"
    >
      <h3 className="text-2xl font-serif mb-8">
        {isNew ? "Add Address" : "Edit Address"}
      </h3>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Label</label>
            <select
              value={form.label}
              onChange={(e) => update("label", e.target.value)}
              className={inputClass}
            >
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
            </select>
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => update("isDefault", e.target.checked)}
                className="accent-[#D4AF37]"
              />
              Set as default
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Postal Code</label>
            <input
              type="text"
              value={form.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-[#D4AF37] text-white px-8 py-3 text-sm tracking-[3px] uppercase hover:opacity-90 transition"
          >
            Save Address
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 px-8 py-3 text-sm tracking-[3px] uppercase text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}