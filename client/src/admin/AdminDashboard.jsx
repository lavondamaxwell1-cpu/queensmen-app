import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalMessages: 0,
    unreadMessages: 0,
    activeModels: 0,
    activeFlyers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  useEffect(() => {
    let ignore = false;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/dashboard/stats");

        if (!ignore) {
          setStats(data.stats || {});
        }
      } catch (error) {
        console.error("Fetch dashboard stats error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading dashboard stats.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const cards = [
    {
      title: "Applications",
      total: stats.totalApplications || 0,
      attention: stats.pendingApplications || 0,
      attentionLabel: "Pending",
      link: "/admin/applications",
    },
    {
      title: "Bookings",
      total: stats.totalBookings || 0,
      attention: stats.pendingBookings || 0,
      attentionLabel: "Pending",
      link: "/admin/bookings",
    },
    {
      title: "Messages",
      total: stats.totalMessages || 0,
      attention: stats.unreadMessages || 0,
      attentionLabel: "Unread",
      link: "/admin/messages",
    },
    {
      title: "Models",
      total: stats.activeModels || 0,
      attention: null,
      attentionLabel: "Active",
      link: "/admin/models",
    },
    {
      title: "Flyers",
      total: stats.activeFlyers || 0,
      attention: null,
      attentionLabel: "Active",
      link: "/admin/flyers",
    },
  ];

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-bold uppercase tracking-[0.25em] text-red-600">
                Admin Dashboard
              </p>

              <h1 className="mt-4 text-4xl font-black md:text-5xl">
                Welcome back
                {adminUser?.name ? (
                  <span className="text-red-700">, {adminUser.name}</span>
                ) : (
                  <span className="text-red-700">, Admin</span>
                )}
              </h1>

              <p className="mt-4 max-w-2xl text-slate-300">
                Manage model profiles, flyers, applications, bookings, messages,
                and business settings.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-fit rounded-full border border-red-700 px-6 py-3 font-black text-red-500 hover:bg-red-700 hover:text-white"
            >
              Logout
            </button>
          </div>

          {loading && (
            <div className="mb-8 rounded-3xl border border-red-900/40 bg-white/5 p-6 text-center">
              <p className="font-bold text-slate-300">
                Loading dashboard stats...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-bold">{error}</p>
            </div>
          )}

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="rounded-3xl border border-red-900/40 bg-white p-6 text-black shadow-2xl transition hover:-translate-y-1 hover:shadow-red-950/30"
              >
                <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                  {card.title}
                </p>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-5xl font-black text-slate-950">
                      {card.total}
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      Total / Active
                    </p>
                  </div>

                  {card.attention !== null && (
                    <div className="rounded-2xl bg-red-50 px-4 py-3 text-center">
                      <p className="text-2xl font-black text-red-700">
                        {card.attention}
                      </p>
                      <p className="text-xs font-black uppercase tracking-wide text-red-700">
                        {card.attentionLabel}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-3">
            <Link
              to="/admin/models"
              className="rounded-3xl border border-red-900/40 bg-white/5 p-8 shadow-2xl hover:bg-white/10"
            >
              <h2 className="text-2xl font-black text-white">Manage Models</h2>
              <p className="mt-3 text-slate-300">
                Add, edit, feature, hide, or delete model profiles.
              </p>
            </Link>

            <Link
              to="/admin/flyers"
              className="rounded-3xl border border-red-900/40 bg-white/5 p-8 shadow-2xl hover:bg-white/10"
            >
              <h2 className="text-2xl font-black text-white">Manage Flyers</h2>
              <p className="mt-3 text-slate-300">
                Upload finished flyers, create tour dates, and manage events.
              </p>
            </Link>

            <Link
              to="/admin/settings"
              className="rounded-3xl border border-red-900/40 bg-white/5 p-8 shadow-2xl hover:bg-white/10"
            >
              <h2 className="text-2xl font-black text-white">
                Business Settings
              </h2>
              <p className="mt-3 text-slate-300">
                Update logo, owner photo, phone, email, socials, and homepage
                text.
              </p>
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
