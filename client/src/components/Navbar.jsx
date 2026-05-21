import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import API from "../api/api";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchSettings = async () => {
      try {
        const { data } = await API.get("/api/settings");

        if (!ignore) {
          setSettings(data.settings || null);
        }
      } catch (error) {
        console.error("Fetch navbar settings error:", error);

        if (!ignore) {
          setSettings(null);
        }
      }
    };

    fetchSettings();

    return () => {
      ignore = true;
    };
  }, []);

  const businessName = settings?.businessName || "The QueensMen";
  const logo = settings?.logo || "";

  const navLinkClass = ({ isActive }) =>
    isActive ? "text-red-600" : "text-white hover:text-red-500";

  return (
    <header className="sticky top-0 z-50 border-b border-red-900/40 bg-black/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* BRAND */}
        <Link to="/" className="flex items-center gap-3">
          {logo ? (
            <div className="flex h-14 w-24 items-center justify-center overflow-hidden rounded-xl border border-red-800 bg-black p-1">
              <img
                src={logo}
                alt={`${businessName} logo`}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-800 bg-black">
              <span className="text-lg font-black text-red-600">QM</span>
            </div>
          )}

          <span className="text-xl font-black">
            {businessName === "The QueensMen" ? (
              <>
                The <span className="text-red-700">Queens</span>Men
              </>
            ) : (
              businessName
            )}
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/models" className={navLinkClass}>
            Models
          </NavLink>

          <NavLink to="/flyers" className={navLinkClass}>
            Flyers
          </NavLink>

          <NavLink to="/apply" className={navLinkClass}>
            Apply
          </NavLink>

          <NavLink to="/book" className={navLinkClass}>
            Book
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* MOBILE NAV */}
      {menuOpen && (
        <nav className="border-t border-red-900/40 bg-black px-6 py-5 md:hidden">
          <div className="grid gap-4 text-sm font-bold">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              About
            </NavLink>

            <NavLink
              to="/models"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Models
            </NavLink>

            <NavLink
              to="/flyers"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Flyers
            </NavLink>

            <NavLink
              to="/apply"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Apply
            </NavLink>

            <NavLink
              to="/book"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Book
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Contact
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
