import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";
function StatCard({ label, value, note }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-red-700">
        {label}
      </p>
      <h2 className="mt-3 text-4xl font-black text-slate-950">{value}</h2>
      <p className="mt-2 text-sm font-semibold text-slate-500">{note}</p>
    </div>
  );
}

function ChartCard({ title, description, children }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <div className="mt-6 h-[320px] w-full min-w-0">{children}</div>
    </div>
  );
}
export default function AdminAnalytics() {
  const [bookings, setBookings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [models, setModels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          bookingResponse,
          applicationResponse,
          modelResponse,
          messageResponse,
        ] = await Promise.all([
          API.get("/api/bookings"),
          API.get("/api/applications"),
          API.get("/api/models"),
          API.get("/api/contact"),
        ]);

        if (!ignore) {
          setBookings(bookingResponse.data.bookings || []);
          setApplications(applicationResponse.data.applications || []);
          setModels(
            Array.isArray(modelResponse.data)
              ? modelResponse.data
              : modelResponse.data.models || modelResponse.data.data || [],
          );
          setMessages(messageResponse.data.messages || []);
        }
      } catch (error) {
        console.error("Fetch analytics error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading analytics.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(() => {
    const pendingBookings = bookings.filter(
      (booking) => booking.status === "Pending",
    ).length;

    const approvedBookings = bookings.filter(
      (booking) => booking.status === "Approved",
    ).length;

    const pendingApplications = applications.filter(
      (application) => application.status === "Pending",
    ).length;

    const acceptedApplications = applications.filter(
      (application) => application.status === "Accepted",
    ).length;

    const activeModels = models.filter((model) => model.isActive !== false).length;

    const upcomingBookings = bookings.filter((booking) => {
      if (!booking.eventDate) return false;
      return new Date(booking.eventDate) >= new Date();
    }).length;

    return {
      totalBookings: bookings.length,
      pendingBookings,
      approvedBookings,
      upcomingBookings,
      totalApplications: applications.length,
      pendingApplications,
      acceptedApplications,
      totalModels: models.length,
      activeModels,
      messages: messages.length,
    };
  }, [bookings, applications, models, messages]);

  const bookingStatusData = useMemo(() => {
    const statuses = ["Pending", "Approved", "Declined", "Completed", "Canceled"];

    return statuses.map((status) => ({
      name: status,
      value: bookings.filter((booking) => booking.status === status).length,
    }));
  }, [bookings]);

  const applicationStatusData = useMemo(() => {
    const statuses = ["Pending", "Reviewed", "Accepted", "Rejected"];

    return statuses.map((status) => ({
      name: status,
      value: applications.filter((application) => application.status === status)
        .length,
    }));
  }, [applications]);

  const bookingTypeData = useMemo(() => {
    const counts = {};

    bookings.forEach((booking) => {
      const type = booking.eventType || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [bookings]);

  const modelCategoryData = useMemo(() => {
    const counts = {};

    models.forEach((model) => {
      const category = model.category || "Unknown";
      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [models]);

  // const StatCard = ({ label, value, note }) => (
  //   <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
  //     <p className="text-xs font-black uppercase tracking-[0.25em] text-red-700">
  //       {label}
  //     </p>
  //     <h2 className="mt-3 text-4xl font-black text-slate-950">{value}</h2>
  //     <p className="mt-2 text-sm font-semibold text-slate-500">{note}</p>
  //   </div>
  // );

  // const ChartCard = ({ title, description, children }) => (
  //   <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
  //     <h2 className="text-2xl font-black text-slate-950">{title}</h2>
  //     <p className="mt-2 text-sm text-slate-600">{description}</p>
  //     <div className="mt-6 h-[320px] w-full min-w-0">{children}</div>
  //   </div>
  // );

  const pieColors = ["#b91c1c", "#111827", "#ef4444", "#6b7280", "#fca5a5"];

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen overflow-x-hidden bg-slate-50 px-4 py-10 text-black md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Analytics
            </p>

            <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl">
              Business <span className="text-red-700">Insights</span>
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Track bookings, applications, models, and activity across the
              QueensMen platform.
            </p>
          </section>

          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="font-bold text-slate-600">Loading analytics...</p>
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-bold">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Bookings"
                  value={stats.totalBookings}
                  note={`${stats.pendingBookings} pending • ${stats.approvedBookings} approved`}
                />

                <StatCard
                  label="Upcoming"
                  value={stats.upcomingBookings}
                  note="Bookings with future event dates"
                />

                <StatCard
                  label="Applications"
                  value={stats.totalApplications}
                  note={`${stats.pendingApplications} pending • ${stats.acceptedApplications} accepted`}
                />

                <StatCard
                  label="Models"
                  value={stats.totalModels}
                  note={`${stats.activeModels} active models`}
                />
              </section>

              <section className="mt-8 grid min-w-0 gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Booking Status"
                  description="Breakdown of booking workflow statuses."
                >
                  <ResponsiveContainer width="99%" height={300}>
                    <BarChart data={bookingStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#b91c1c"
                        radius={[12, 12, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Application Status"
                  description="Breakdown of model application decisions."
                >
                  <ResponsiveContainer width="99%" height={300}>
                    <BarChart data={applicationStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#111827"
                        radius={[12, 12, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Booking Types"
                  description="Which event types are most requested."
                >
                  <ResponsiveContainer width="99%" height={300}>
                    <PieChart>
                      <Pie
                        data={bookingTypeData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        label
                      >
                        {bookingTypeData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Model Categories"
                  description="Talent categories currently represented."
                >
                  <ResponsiveContainer width="99%" height={300}>
                    <PieChart>
                      <Pie
                        data={modelCategoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        label
                      >
                        {modelCategoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
