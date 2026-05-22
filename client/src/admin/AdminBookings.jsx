import { useEffect, useState } from "react";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/bookings");

        if (!ignore) {
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error("Fetch bookings error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading bookings.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    try {
      setUpdatingId(bookingId);

      const { data } = await API.patch(`/api/bookings/${bookingId}/status`, {
        status,
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? data.booking : booking,
        ),
      );
    } catch (error) {
      console.error("Update booking status error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while updating booking status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking request?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(bookingId);

      await API.delete(`/api/bookings/${bookingId}`);

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId),
      );
    } catch (error) {
      console.error("Delete booking error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting this booking.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Approved") {
      return "bg-green-50 text-green-700 ring-green-200";
    }

    if (status === "Declined") {
      return "bg-red-50 text-red-700 ring-red-200";
    }

    if (status === "Reviewed") {
      return "bg-blue-50 text-blue-700 ring-blue-200";
    }

    return "bg-yellow-50 text-yellow-700 ring-yellow-200";
  };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Bookings
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
                  Review <span className="text-red-700">Bookings</span>
                </h1>

                <p className="mt-4 max-w-2xl text-slate-600">
                  Review booking requests, update client status, and manage
                  event details. Approved or declined clients will receive a
                  status email.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-black text-slate-800 shadow-sm">
                  {bookings.length} Total
                </div>

                <div className="rounded-full border border-yellow-200 bg-yellow-50 px-5 py-2 text-sm font-black text-yellow-700 shadow-sm">
                  {pendingCount} Pending
                </div>
              </div>
            </div>
          </section>

          {/* STATES */}
          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="font-bold text-slate-600">Loading bookings...</p>
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-bold">{error}</p>
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                No booking requests yet
              </h2>

              <p className="mt-3 text-slate-600">
                New booking requests will show here after someone submits the
                public booking form.
              </p>
            </div>
          )}

          {/* LIST */}
          {!loading && !error && bookings.length > 0 && (
            <section className="grid gap-6">
              {bookings.map((booking) => (
                <article
                  key={booking._id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ring-1 ${getStatusClass(
                            booking.status,
                          )}`}
                        >
                          {booking.status || "Pending"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                          Submitted{" "}
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString()
                            : "recently"}
                        </span>
                      </div>

                      <h2 className="mt-4 text-3xl font-black text-slate-950">
                        {booking.fullName}
                      </h2>

                      <p className="mt-2 font-bold text-red-700">
                        {booking.eventType || "Event type not provided"}
                      </p>

                      {booking.company && (
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          Company / Brand: {booking.company}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <select
                        value={booking.status || "Pending"}
                        disabled={updatingId === booking._id}
                        onChange={(e) =>
                          handleStatusChange(booking._id, e.target.value)
                        }
                        className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-900 outline-none focus:border-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
                      </select>

                      <button
                        type="button"
                        disabled={deletingId === booking._id}
                        onClick={() => handleDelete(booking._id)}
                        className="rounded-full border border-red-700 px-5 py-3 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === booking._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Email
                      </p>

                      <a
                        href={`mailto:${booking.email}`}
                        className="mt-2 block break-words font-bold text-slate-900 hover:text-red-700"
                      >
                        {booking.email}
                      </a>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Phone
                      </p>

                      <a
                        href={`tel:${String(booking.phone || "").replace(
                          /\D/g,
                          "",
                        )}`}
                        className="mt-2 block font-bold text-slate-900 hover:text-red-700"
                      >
                        {booking.phone || "Not provided"}
                      </a>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Event Date
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.eventDate
                          ? new Date(booking.eventDate).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Models Needed
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.numberOfModels || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Location
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.location || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Budget
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {booking.budget || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {booking.message && (
                    <div className="mt-5 rounded-2xl border-l-4 border-red-700 bg-slate-50 p-5 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Booking Details
                      </p>

                      <p className="mt-2 leading-7 text-slate-700">
                        {booking.message}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
