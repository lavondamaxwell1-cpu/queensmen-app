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
    isActive ? "text-red-700" : "text-slate-900 hover:text-red-700";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-black shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* BRAND */}
        <Link to="/" className="flex items-center gap-3">
          {logo ? (
            <div className="flex h-16 w-28 items-center justify-center overflow-hidden rounded-xl border border-red-700 bg-white p-1 shadow-sm">
              <img
                src={logo}
                alt={`${businessName} logo`}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-700 bg-white shadow-sm">
              <span className="text-lg font-black text-red-700">Q</span>
            </div>
          )}

          <span className="text-xl font-black tracking-tight text-black">
            {businessName === "The QueensMen" ? (
              <>
                The <span className="text-red-700">Q</span>ueensMen
              </>
            ) : (
              businessName
            )}
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-6 text-sm font-black md:flex">
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

          <NavLink
            to="/book"
            className={({ isActive }) =>
              isActive
                ? "rounded-full bg-red-700 px-5 py-2 text-white"
                : "rounded-full bg-black px-5 py-2 text-white hover:bg-red-700"
            }
          >
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
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-black text-black hover:border-red-700 hover:text-red-700 md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* MOBILE NAV */}
      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-6 py-5 shadow-lg md:hidden">
          <div className="grid gap-4 text-sm font-black">
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
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-red-700 px-5 py-3 text-center text-white"
                  : "rounded-full bg-black px-5 py-3 text-center text-white hover:bg-red-700"
              }
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
