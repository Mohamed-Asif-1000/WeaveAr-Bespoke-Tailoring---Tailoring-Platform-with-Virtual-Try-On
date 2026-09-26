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
  Menu,
  X,
} from "lucide-react";
import gsap from "gsap";
import { searchAvailableProducts, searchProducts } from "../data/products";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore, cartSelectors } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { withMotion } from "../utils/motion";

export default function Header() {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navRef = useRef(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const mobileNavToggleRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartSelectors.itemCount(cartItems);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  // Roadmap and sold-out garments cannot be opened from search, so only
  // actionable products are offered. The withheld count keeps the header
  // honest about what the query actually matched.
  const allMatches = searchProducts(searchQuery);
  const searchResults = searchAvailableProducts(searchQuery);
  const hiddenCount = allMatches.length - searchResults.length;

  useLayoutEffect(() => {
    return withMotion(navRef.current, () => {
      gsap.from(".nav-item", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2,
      });
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const insideDesktop = searchRef.current?.contains(target);
      const insideMobile = mobileSearchRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) {
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

  // Escape closes the drawer, and the page behind it must not scroll while it
  // is open or the content slides out from under the panel.
  useEffect(() => {
    if (!mobileNavOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileNavOpen(false);
        mobileNavToggleRef.current?.focus();
      }
      if (e.key !== "Tab") return;

      const panel = mobileNavRef.current;
      const toggle = mobileNavToggleRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        toggle?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        toggle?.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileNavOpen]);

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

  const closeMobileNav = () => setMobileNavOpen(false);

  const scrollToSection = (sectionId: string) => {
    setMobileNavOpen(false);
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

  const navLinkClass =
    "group relative inline-block whitespace-nowrap py-3 text-left text-[12px] tracking-[3px] uppercase text-gray-700 no-underline transition-colors duration-500 hover:text-[#D4AF37]!";
  const navUnderline =
    "absolute -bottom-1 left-0 h-px w-0 bg-[#D4AF37]! transition-all duration-500 ease-in-out group-hover:w-full";
  const iconClass =
    "grid h-11 w-11 shrink-0 place-items-center rounded-full text-gray-700 transition-colors hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]";

  return (
    <div className="bg-[#FAF9F6]">
      <nav
        aria-label="Main"
        className={`${isHomePage ? "fixed top-0 left-0 right-0" : "static"} h-auto w-full z-50 bg-white/95 backdrop-blur-md border-b-2 border-[#D4AF37] shadow-lg shadow-stone-900/20`}
      >
        <div
          className="container mx-auto px-4 py-3 sm:px-6 sm:py-4"
          ref={navRef}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Logo Section */}
            <button
              onClick={handleLogoClick}
              aria-label="WeaveAR, go to homepage"
              className="text-center nav-item block no-underline bg-transparent border-none p-0 m-0 cursor-pointer min-w-0"
            >
              <div
                style={{ fontFamily: "'Great Vibes', cursive" }}
                className="text-[#D4AF37] text-3xl sm:text-4xl lg:text-5xl leading-none"
              >
                WeaveAR
              </div>
              <div
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-[8px] sm:text-[10px] tracking-[2px] sm:tracking-[4px] -mt-1 uppercase text-gray-600 font-medium"
              >
                Bespoke Tailoring
              </div>
            </button>

            {/* Desktop Navigation */}
            <div
              className="hidden lg:flex items-center gap-10"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <Link to="/" className={`${navLinkClass} w-auto py-0`}>
                Home
                <span className={navUnderline} />
              </Link>
              <button
                onClick={() => scrollToSection("collections")}
                className={`${navLinkClass} w-auto py-0 bg-transparent border-none cursor-pointer`}
                style={{ fontFamily: "inherit" }}
              >
                Collections
                <span className={navUnderline} />
              </button>
              <Link
                to="/collections/shirts"
                className={`${navLinkClass} w-auto py-0`}
              >
                Virtual Try-On
                <span className={navUnderline} />
              </Link>
              <button
                onClick={() => scrollToSection("bespoke")}
                className={`${navLinkClass} w-auto py-0 bg-transparent border-none cursor-pointer`}
                style={{ fontFamily: "inherit" }}
              >
                Bespoke
                <span className={navUnderline} />
              </button>
            </div>

            {/* Icons Section */}
            <div className="flex items-center gap-0 sm:gap-2 nav-item">
              {/* Search with Dropdown */}
              <div ref={searchRef} className="relative hidden sm:block">
                <div className="flex items-center gap-2 transition-all duration-300">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => {
                      if (searchQuery.trim()) setShowDropdown(true);
                    }}
                    aria-label="Search garments"
                    className={`border-b border-[#D4AF37]/30 focus:border-[#D4AF37] bg-transparent outline-none px-2 py-1 transition-all duration-500 text-sm font-light italic ${
                      searchExpanded
                        ? "w-40 opacity-100"
                        : "w-0 opacity-0 pointer-events-none"
                    }`}
                    placeholder="Search garments..."
                  />
                  <button
                    onClick={() => setSearchExpanded(!searchExpanded)}
                    className={iconClass}
                    aria-label="Search"
                    title="Search"
                  >
                    <Search size={18} strokeWidth={1.2} />
                  </button>
                </div>

                {/* Search Dropdown */}
                {showDropdown && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full right-0 mt-3 w-72 max-w-[calc(100vw-2rem)] bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-sm shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#D4AF37]/10">
                      <p className="text-[10px] tracking-[3px] uppercase text-[#D4AF37]/70">
                        {searchResults.length === 0
                          ? "No available garments"
                          : `${searchResults.length} result${
                              searchResults.length > 1 ? "s" : ""
                            } found`}
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
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={48}
                          height={48}
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
                    {searchResults.length === 0 && hiddenCount > 0 && (
                      <p className="p-3 text-[11px] text-[#FAF9F6]/60">
                        {hiddenCount} matching item
                        {hiddenCount > 1 ? "s are" : " is"} on our roadmap and
                        cannot be opened yet.
                      </p>
                    )}
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
                className={`${iconClass} relative`}
                aria-label={`Wishlist, ${wishlistCount} item${
                  wishlistCount === 1 ? "" : "s"
                }`}
                title="Wishlist"
              >
                <Heart
                  size={18}
                  strokeWidth={1.2}
                  className={
                    wishlistCount > 0 ? "fill-[#D4AF37] text-[#D4AF37]" : ""
                  }
                />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart with Count Badge */}
              <Link
                to="/cart"
                className={`${iconClass} relative`}
                aria-label={`Cart, ${cartCount} item${
                  cartCount === 1 ? "" : "s"
                }`}
                title="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.2} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account Menu */}
              <div ref={userMenuRef} className="relative">
                {isAuthenticated && user ? (
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-[#D4AF37] transition-colors h-11 pl-1 pr-2 rounded-full hover:bg-[#D4AF37]/10"
                    title="Your account"
                    aria-label="Your account"
                    aria-expanded={userMenuOpen}
                  >
                    <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black shrink-0 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden md:block text-sm max-w-28 truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className="hidden sm:block"
                    />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={iconClass}
                    title="Sign in"
                    aria-label="Sign in"
                  >
                    <User size={18} strokeWidth={1.2} />
                  </Link>
                )}

                {userMenuOpen && isAuthenticated && (
                  <div className="absolute top-full right-0 mt-3 w-56 max-w-[calc(100vw-2rem)] bg-[#1A1A1A] border border-[#D4AF37]/30 shadow-2xl z-50 overflow-hidden">
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

              {/* Drawer toggle, below the lg breakpoint where the inline nav
                  disappears. Without this, tablets have no navigation at all. */}
              <button
                ref={mobileNavToggleRef}
                onClick={() => setMobileNavOpen((o) => !o)}
                className={`${iconClass} lg:hidden`}
                aria-label="Menu"
                title="Menu"
                aria-expanded={mobileNavOpen}
                aria-controls="mobile-nav"
              >
                {mobileNavOpen ? (
                  <X size={18} strokeWidth={1.5} />
                ) : (
                  <Menu size={18} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Below sm the search field has no room beside the icons, so it gets
              its own full-width row instead of collapsing to zero width. */}
          <div className="sm:hidden mt-2">
            <div className="relative" ref={mobileSearchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => {
                  if (searchQuery.trim()) setShowDropdown(true);
                }}
                aria-label="Search garments"
                className="w-full border-b border-[#D4AF37]/30 focus:border-[#D4AF37] bg-transparent outline-none py-2 text-sm font-light italic"
                placeholder="Search garments..."
              />
              {showDropdown && searchQuery.trim().length > 0 && (
                <div className="absolute left-4 right-4 mt-1 bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-sm shadow-2xl z-50 overflow-hidden max-h-[60vh] overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <p className="p-4 text-[11px] text-[#FAF9F6]/70">
                      {hiddenCount > 0
                        ? `${hiddenCount} matching item${
                            hiddenCount > 1 ? "s are" : " is"
                          } on our roadmap and cannot be opened yet.`
                        : "No available garments match that search."}
                    </p>
                  ) : (
                    searchResults.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={clearSearch}
                        className="flex items-center gap-4 p-3 hover:bg-[#2D2A26] transition-colors"
                      >
                        <img
                          src={product.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={48}
                          height={48}
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
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile / tablet navigation drawer */}
          {mobileNavOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={closeMobileNav}
                aria-hidden="true"
              />
              <div
                id="mobile-nav"
                ref={mobileNavRef}
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-[#1A1A1A] border-l border-[#D4AF37]/30 overflow-y-auto lg:hidden"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/20">
                  <span
                    className="text-[#D4AF37] text-2xl"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  >
                    WeaveAR
                  </span>
                  <button
                    onClick={closeMobileNav}
                    className="grid h-11 w-11 place-items-center rounded-full text-[#FAF9F6] hover:bg-white/10"
                    aria-label="Close menu"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <nav className="px-5 py-4">
                  <Link
                    to="/"
                    onClick={closeMobileNav}
                    className={navLinkClass}
                  >
                    Home
                    <span className={navUnderline} />
                  </Link>
                  <button
                    onClick={() => scrollToSection("collections")}
                    className={`${navLinkClass} bg-transparent border-none cursor-pointer`}
                  >
                    Collections
                    <span className={navUnderline} />
                  </button>
                  <Link
                    to="/collections/shirts"
                    onClick={closeMobileNav}
                    className={navLinkClass}
                  >
                    Virtual Try-On
                    <span className={navUnderline} />
                  </Link>
                  <button
                    onClick={() => scrollToSection("bespoke")}
                    className={`${navLinkClass} bg-transparent border-none cursor-pointer`}
                  >
                    Bespoke
                    <span className={navUnderline} />
                  </button>
                </nav>

                <nav className="px-5 py-4 border-t border-[#D4AF37]/20">
                  <p className="text-[10px] tracking-[3px] uppercase text-[#D4AF37]/70 pb-1">
                    Account
                  </p>
                  <Link
                    to="/wishlist"
                    onClick={closeMobileNav}
                    className="flex items-center gap-3 py-3 text-[12px] tracking-[3px] uppercase text-[#FAF9F6]/80 hover:text-[#D4AF37] transition-colors"
                  >
                    <Heart size={16} strokeWidth={1.2} /> Wishlist
                    {wishlistCount > 0 && (
                      <span className="text-[#D4AF37] normal-case tracking-normal">
                        ({wishlistCount})
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeMobileNav}
                    className="flex items-center gap-3 py-3 text-[12px] tracking-[3px] uppercase text-[#FAF9F6]/80 hover:text-[#D4AF37] transition-colors"
                  >
                    <ShoppingBag size={16} strokeWidth={1.2} /> Cart
                    {cartCount > 0 && (
                      <span className="text-[#D4AF37] normal-case tracking-normal">
                        ({cartCount})
                      </span>
                    )}
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={closeMobileNav}
                        className="flex items-center gap-3 py-3 text-[12px] tracking-[3px] uppercase text-[#FAF9F6]/80 hover:text-[#D4AF37] transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setMobileNavOpen(false);
                          logout();
                          navigate("/");
                        }}
                        className="flex items-center gap-3 py-3 w-full text-left text-[12px] tracking-[3px] uppercase text-[#FAF9F6]/80 hover:text-[#D4AF37] transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMobileNav}
                      className="flex items-center gap-3 py-3 text-[12px] tracking-[3px] uppercase text-[#FAF9F6]/80 hover:text-[#D4AF37] transition-colors"
                    >
                      <User size={16} strokeWidth={1.2} /> Sign In
                    </Link>
                  )}
                </nav>
              </div>
            </>
          )}
        </div>
      </nav>
      {/* Reserves the fixed header's height on the home page so the hero is not
          hidden underneath it. */}
      {isHomePage && <div className="h-20 sm:h-24 lg:h-28" />}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 w-12 h-12 bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all duration-300 cursor-pointer"
          style={{ borderRadius: "9999px" }}
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
