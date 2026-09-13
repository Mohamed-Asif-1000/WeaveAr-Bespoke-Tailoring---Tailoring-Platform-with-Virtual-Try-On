import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ArrowUp,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import gsap from "gsap";
import { searchProducts } from "../data/products";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore, cartSelectors } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

export default function Header() {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef = useRef(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartSelectors.itemCount(cartItems);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const searchResults = searchProducts(searchQuery);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-item", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2,
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setSearchQuery("");
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowDropdown(value.trim().length > 0);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      navigate(`/product/${searchResults[0].id}`);
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
    setSearchExpanded(false);
  };

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname === "/") {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#" + sectionId);
      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  const handleLogoClick = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 150);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#FAF9F6]">
      <nav
        className={`${isHomePage ? "fixed top-0 left-0 right-0" : "static"} h-auto w-full z-50 bg-white/95 backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg shadow-stone-900/20`}
      >
        <div className="container mx-auto px-4 py-4" ref={navRef}>
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <button
              onClick={handleLogoClick}
              className="text-center nav-item block no-underline bg-transparent border-none px-0 py-0 m-0 cursor-pointer"
            >
              <div
                style={{ fontFamily: "'Great Vibes', cursive" }}
                className="text-[#D4AF37] text-5xl leading-none"
              >
                WeaveAR
              </div>
              <div
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-[10px] tracking-[4px] -mt-1 uppercase text-gray-600 font-medium"
              >
                Bespoke Tailoring
              </div>
            </button>

            {/* Navigation */}
            <div
              className="hidden lg:flex items-center gap-10"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <Link
                to="/"
                className="nav-item group relative text-[12px] tracking-[3px] uppercase text-gray-700 no-underline transition-colors duration-500 hover:text-[#D4AF37]!"
              >
                Home
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#D4AF37]! transition-all duration-500 ease-in-out group-hover:w-full" />
              </Link>
              <button
                onClick={() => scrollToSection("collections")}
                className="nav-item group relative text-[12px] tracking-[3px] uppercase text-gray-700 no-underline transition-colors duration-500 hover:text-[#D4AF37]! bg-transparent border-none px-0 py-0 m-0 cursor-pointer"
                style={{ fontFamily: "inherit" }}
              >
                Collections
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#D4AF37]! transition-all duration-500 ease-in-out group-hover:w-full" />
              </button>
              <Link
                to="/collections/shirts"
                className="nav-item group relative text-[12px] tracking-[3px] uppercase text-gray-700 no-underline transition-colors duration-500 hover:text-[#D4AF37]!"
              >
                Virtual Try-On
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#D4AF37]! transition-all duration-500 ease-in-out group-hover:w-full" />
              </Link>
              <button
                onClick={() => scrollToSection("bespoke")}
                className="nav-item group relative text-[12px] tracking-[3px] uppercase text-gray-700 no-underline transition-colors duration-500 hover:text-[#D4AF37]! bg-transparent border-none px-0 py-0 m-0 cursor-pointer"
                style={{ fontFamily: "inherit" }}
              >
                Bespoke
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#D4AF37]! transition-all duration-500 ease-in-out group-hover:w-full" />
              </button>
            </div>

            {/* Icons Section */}
            <div className="flex items-center gap-6 nav-item">
              {/* Search with Dropdown */}
              <div ref={searchRef} className="relative">
                <div className="flex items-center gap-2 transition-all duration-300">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => {
                      if (searchQuery.trim()) setShowDropdown(true);
                    }}
                    className={`border-b border-[#D4AF37]/30 focus:border-[#D4AF37] bg-transparent outline-none px-2 py-1 transition-all duration-500 text-sm font-light italic ${
                      searchExpanded
                        ? "w-40 opacity-100"
                        : "w-0 opacity-0 pointer-events-none"
                    }`}
                    placeholder="Search garments..."
                  />
                  <button
                    onClick={() => setSearchExpanded(!searchExpanded)}
                    className="text-gray-700 hover:text-[#D4AF37] transition-transform hover:scale-110"
                  >
                    <Search size={18} strokeWidth={1.2} />
                  </button>
                </div>

                {/* Search Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-sm shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#D4AF37]/10">
                      <p className="text-[10px] tracking-[3px] uppercase text-[#D4AF37]/70">
                        {searchResults.length} result
                        {searchResults.length > 1 ? "s" : ""} found
                      </p>
                    </div>
                    {searchResults.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={clearSearch}
                        className="flex items-center gap-4 p-3 hover:bg-[#2D2A26] transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[#FAF9F6] text-sm font-medium truncate">
                            {product.name}
                          </p>
                          <p className="text-[#D4AF37] text-xs">
                            {product.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                    {searchResults.length > 6 && (
                      <div className="p-3 border-t border-[#D4AF37]/10 text-center">
                        <button
                          onClick={() => {
                            navigate(
                              `/collections/shirts?search=${encodeURIComponent(searchQuery)}`,
                            );
                            clearSearch();
                          }}
                          className="text-[10px] tracking-[3px] uppercase text-[#D4AF37] hover:text-[#FAF9F6] transition-colors"
                        >
                          View All Results
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist with Count Badge */}
              <Link
                to="/wishlist"
                className="relative text-gray-700 hover:text-[#D4AF37] transition-transform hover:scale-110"
              >
                <Heart
                  size={18}
                  strokeWidth={1.2}
                  className={
                    wishlistCount > 0 ? "fill-[#D4AF37] text-[#D4AF37]" : ""
                  }
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart with Count Badge */}
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-[#D4AF37] transition-transform hover:scale-110"
                title="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.2} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account Menu */}
              <div ref={userMenuRef} className="relative">
                {isAuthenticated && user ? (
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#D4AF37] transition-colors"
                    title="Your account"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black  flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden md:block text-sm max-w-28 truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} strokeWidth={1.5} />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-[#D4AF37] transition-transform hover:scale-110 inline-flex"
                    title="Sign in"
                  >
                    <User size={18} strokeWidth={1.2} />
                  </Link>
                )}

                {userMenuOpen && isAuthenticated && (
                  <div className="absolute top-full right-0 mt-3 w-56 bg-[#1A1A1A] border border-[#D4AF37]/30 shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#D4AF37]/10">
                      <p className="text-[#FAF9F6] text-sm font-medium truncate">
                        {user?.name}
                      </p>
                      <p className="text-[10px] text-[#D4AF37] truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#FAF9F6]/80 hover:bg-[#2D2A26] hover:text-[#D4AF37] transition-colors"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        navigate("/");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FAF9F6]/80 hover:bg-[#2D2A26] hover:text-[#D4AF37] transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {isHomePage && <div className="h-22" />}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all duration-300 cursor-pointer"
          style={{ borderRadius: "9999px" }}
          title="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
