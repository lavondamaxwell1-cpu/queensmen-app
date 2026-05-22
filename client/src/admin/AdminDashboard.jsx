import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
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
      title: "Active Models",
      total: stats.activeModels || 0,
      attention: null,
      attentionLabel: "Active",
      link: "/admin/models",
    },
    {
      title: "Active Flyers",
      total: stats.activeFlyers || 0,
      attention: null,
      attentionLabel: "Active",
      link: "/admin/flyers",
    },
  ];

  const quickActions = [
    {
      title: "Add or Edit Models",
      description:
        "Create profiles, upload photos, feature models, and manage portfolios.",
      link: "/admin/models",
      button: "Manage Models",
    },
    {
      title: "Upload Flyers",
      description:
        "Add finished flyer designs, tour dates, event details, and announcements.",
      link: "/admin/flyers",
      button: "Manage Flyers",
    },
    {
      title: "Review Requests",
      description:
        "Check new applications, bookings, and messages that need follow-up.",
      link: "/admin/applications",
      button: "Review Applications",
    },
    {
      title: "Business Settings",
      description:
        "Update logo, owner photo, phone, email, socials, and homepage wording.",
      link: "/admin/settings",
      button: "Edit Settings",
    },
  ];

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Dashboard
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
                  Welcome back
                  {adminUser?.name ? (
                    <span className="text-red-700">, {adminUser.name}</span>
                  ) : (
                    <span className="text-red-700">, Admin</span>
                  )}
                </h1>

                <p className="mt-4 max-w-2xl text-slate-600">
                  Manage model profiles, flyers, applications, bookings,
                  messages, business settings, images, and site content.
                </p>
              </div>

              <Link
                to="/"
                className="w-fit rounded-full bg-black px-6 py-3 font-black text-white shadow hover:bg-red-700"
              >
                View Public Site
              </Link>
            </div>
          </section>

          {/* LOADING / ERROR */}
          {loading && (
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="font-bold text-slate-600">
                Loading dashboard stats...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-bold">{error}</p>
            </div>
          )}

          {/* STATS */}
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="rounded-3xl border border-slate-200 bg-white p-6 text-black shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
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
                    <div className="rounded-2xl bg-red-50 px-4 py-3 text-center ring-1 ring-red-100">
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

          {/* ATTENTION */}
          <section className="mt-10 grid gap-6 lg:grid-cols-3">
            <Link
              to="/admin/applications"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-2xl"
            >
              <p className="font-bold uppercase tracking-[0.2em] text-red-700">
                Applications
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                {stats.pendingApplications || 0} Pending
              </h2>
              <p className="mt-3 text-slate-600">
                Review new model applications and update applicant statuses.
              </p>
            </Link>

            <Link
              to="/admin/bookings"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-2xl"
            >
              <p className="font-bold uppercase tracking-[0.2em] text-red-700">
                Bookings
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                {stats.pendingBookings || 0} Pending
              </h2>
              <p className="mt-3 text-slate-600">
                Review booking requests and send status updates to clients.
              </p>
            </Link>

            <Link
              to="/admin/messages"
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-2xl"
            >
              <p className="font-bold uppercase tracking-[0.2em] text-red-700">
                Messages
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                {stats.unreadMessages || 0} Unread
              </h2>
              <p className="mt-3 text-slate-600">
                Check contact messages and follow up with visitors.
              </p>
            </Link>
          </section>

          {/* QUICK ACTIONS */}
          <section className="mt-10">
            <div className="mb-6">
              <p className="font-bold uppercase tracking-[0.25em] text-red-700">
                Quick Actions
              </p>

              <h2 className="mt-3 text-4xl font-black text-slate-950">
                Manage the site faster.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.link}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <h3 className="text-2xl font-black text-slate-950">
                    {action.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {action.description}
                  </p>

                  <span className="mt-6 inline-flex rounded-full bg-red-700 px-5 py-3 text-sm font-black text-white hover:bg-red-800">
                    {action.button}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
