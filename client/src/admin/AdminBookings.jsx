import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";
export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/bookings");

        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Fetch bookings error:", error);

        setError(
          error.response?.data?.message ||
            "Something went wrong while loading booking requests.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

const handleStatusUpdate = async (bookingId, newStatus) => {
  try {
    setUpdatingId(bookingId);

    const { data } = await API.patch(`/api/bookings/${bookingId}/status`, {
      status: newStatus,
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
        "Something went wrong while updating the booking status.",
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

    setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
  } catch (error) {
    console.error("Delete booking error:", error);
    alert(
      error.response?.data?.message ||
        "Something went wrong while deleting the booking request.",
    );
  } finally {
    setDeletingId(null);
  }
};
  return (
    <>
      <AdminNavbar />
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Link
              to="/admin"
              className="font-bold text-red-600 hover:text-red-500"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-8 font-bold uppercase tracking-[0.25em] text-red-600">
              Admin Bookings
            </p>

            <h1 className="mt-4 text-4xl font-black md:text-5xl">
              Booking <span className="text-red-700">Requests</span>
            </h1>

            <p className="mt-4 text-slate-300">
              Review client requests for events, photoshoots, campaigns, and
              appearances.
            </p>
          </div>

          <div className="rounded-full border border-red-900/40 bg-white/5 px-5 py-2 text-sm font-bold text-white">
            {bookings.length} Total
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
            <p className="font-bold text-slate-300">Loading bookings...</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
            <h2 className="text-2xl font-black text-white">
              No booking requests yet
            </h2>
            <p className="mt-3 text-slate-300">
              When someone submits the Book a Model form, the request will show
              here.
            </p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="rounded-3xl border border-red-900/40 bg-white p-6 text-black shadow-2xl"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                      {booking.status || "Pending"}
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-slate-950">
                      {booking.fullName}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      Submitted{" "}
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleString()
                        : "recently"}
                    </p>
                  </div>

                  <div className="rounded-full bg-black px-4 py-2 text-sm font-black text-white">
                    {booking.eventType}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Email
                    </p>
                    <a
                      href={`mailto:${booking.email}`}
                      className="mt-2 block break-all font-bold text-slate-900 hover:text-red-700"
                    >
                      {booking.email}
                    </a>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Phone
                    </p>
                    <a
                      href={`tel:${booking.phone}`}
                      className="mt-2 block font-bold text-slate-900 hover:text-red-700"
                    >
                      {booking.phone}
                    </a>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Company / Brand
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {booking.company || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Event Date
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {booking.eventDate
                        ? new Date(booking.eventDate).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Event Location
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {booking.location}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Models Needed
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {booking.numberOfModels}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4 md:col-span-3">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Budget
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {booking.budget || "Not provided"}
                    </p>
                  </div>
                </div>

                {booking.message && (
                  <div className="mt-6 rounded-2xl border-l-4 border-red-700 bg-slate-100 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Booking Details
                    </p>
                    <p className="mt-2 leading-7 text-slate-700">
                      {booking.message}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${booking.email}`}
                    className="rounded-full bg-red-700 px-5 py-3 text-sm font-black text-white hover:bg-red-800"
                  >
                    Email Client
                  </a>

                  <a
                    href={`tel:${booking.phone}`}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-black text-slate-900 hover:border-red-700 hover:text-red-700"
                  >
                    Call Client
                  </a>

                  <button
                    type="button"
                    disabled={deletingId === booking._id}
                    onClick={() => handleDelete(booking._id)}
                    className="rounded-full border border-red-700 px-5 py-3 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === booking._id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-red-700">
                    Update Status
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {["Pending", "Reviewed", "Approved", "Declined"].map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={updatingId === booking._id}
                          onClick={() =>
                            handleStatusUpdate(booking._id, status)
                          }
                          className={`rounded-full px-4 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            booking.status === status
                              ? "bg-black text-white"
                              : "border border-slate-300 text-slate-900 hover:border-red-700 hover:text-red-700"
                          }`}
                        >
                          {updatingId === booking._id ? "Updating..." : status}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
    </>
  );
}
