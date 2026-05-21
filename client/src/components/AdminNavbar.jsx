import { Link, NavLink, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "rounded-full bg-red-700 px-4 py-2 text-sm font-bold text-white"
      : "rounded-full px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-red-900/40 bg-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/admin" className="text-2xl font-black text-white">
          The <span className="text-red-700">Queens</span>Men Admin
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/admin" end className={navLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/models" className={navLinkClass}>
            Models
          </NavLink>

          <NavLink to="/admin/flyers" className={navLinkClass}>
            Flyers
          </NavLink>

          <NavLink to="/admin/applications" className={navLinkClass}>
            Applications
          </NavLink>

          <NavLink to="/admin/bookings" className={navLinkClass}>
            Bookings
          </NavLink>

          <NavLink to="/admin/messages" className={navLinkClass}>
            Messages
          </NavLink>

          <NavLink to="/admin/settings" className={navLinkClass}>
            Settings
          </NavLink>

          <Link
            to="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white hover:text-black"
          >
            View Site
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-red-700 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-700 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}