import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, UserRound } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const from =
    (location.state as { from?: string } | null)?.from ||
    new URLSearchParams(location.search).get("from") ||
    "/dashboard";

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (mode === "register") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (!phone.trim()) {
        setError("Please enter your phone number.");
        return;
      }
      const result = register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      if (!result.ok) {
        setError(result.error ?? "Registration failed.");
        return;
      }
    } else {
      const result = login(email, password);
      if (!result.ok) {
        setError(result.error ?? "Sign in failed.");
        return;
      }
    }
    navigate(from, { replace: true });
  };

  const inputClass =
    "w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#D4AF37]";

  return (
    <section className="bg-[#FAF9F6] min-h-dvh text-gray-900">
      <div className="container mx-auto px-6 py-24 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: intro */}
          <div className="pt-10">
            <p className="text-[10px] tracking-[6px] uppercase text-[#D4AF37] mb-6 font-bold">
              Member Access
            </p>
            <h1 className="text-4xl lg:text-5xl font-serif mb-6 leading-tight">
              Welcome Back to
              <span className="text-[#D4AF37] italic"> WeaveAR</span>
            </h1>
            <p className="text-gray-600 leading-relaxed border-l border-[#D4AF37]/30 pl-6 max-w-md mb-10">
              Sign in to track your orders, save your measurements, and manage
              your tailored garments in one place.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <ShieldCheck size={18} className="text-[#D4AF37]" />
                Your details stay safe with us
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <UserRound size={18} className="text-[#D4AF37]" />
                Order tracking & saved addresses
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white border border-gray-200 shadow-md p-10">
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-10">
              {(["signin", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError(null);
                  }}
                  className={`py-3 text-xs tracking-[3px] uppercase transition-all border ${
                    mode === m
                      ? "bg-[#1A1A1A] text-[#D4AF37] border-[#1A1A1A]"
                      : "bg-transparent text-gray-500 border-gray-200 hover:border-[#D4AF37]"
                  }`}
                >
                  {m === "signin" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-serif mb-8">
              {mode === "signin" ? "Sign In to Your Account" : "Create Your Account"}
            </h2>

            {error && (
              <div className="mb-6 border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "register" && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              {mode === "register" && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-600 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-white py-4 text-sm tracking-[3px] uppercase hover:opacity-90 transition"
              >
                {mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-8 text-center leading-relaxed">
              This is a frontend-only demo — your details and orders are stored
              locally in your browser.
            </p>
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-xs tracking-widest uppercase text-[#D4AF37] hover:underline"
              >
                ← Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}