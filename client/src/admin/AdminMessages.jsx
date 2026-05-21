import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";import AdminNavbar from "../components/AdminNavbar";


export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/contact");

        setMessages(data.messages || []);
      } catch (error) {
        console.error("Fetch messages error:", error);

        setError(
          error.response?.data?.message ||
            "Something went wrong while loading contact messages.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);
const handleStatusUpdate = async (messageId, newStatus) => {
  try {
    setUpdatingId(messageId);

    const { data } = await API.patch(`/api/contact/${messageId}/status`, {
      status: newStatus,
    });

    setMessages((prev) =>
      prev.map((message) =>
        message._id === messageId ? data.message : message,
      ),
    );
  } catch (error) {
    console.error("Update message status error:", error);
    alert(
      error.response?.data?.message ||
        "Something went wrong while updating the message status.",
    );
  } finally {
    setUpdatingId(null);
  }
};

const handleDelete = async (messageId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this contact message?",
  );

  if (!confirmDelete) return;

  try {
    setDeletingId(messageId);

    await API.delete(`/api/contact/${messageId}`);

    setMessages((prev) => prev.filter((message) => message._id !== messageId));
  } catch (error) {
    console.error("Delete message error:", error);
    alert(
      error.response?.data?.message ||
        "Something went wrong while deleting the contact message.",
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
              Admin Messages
            </p>

            <h1 className="mt-4 text-4xl font-black md:text-5xl">
              Contact <span className="text-red-700">Messages</span>
            </h1>

            <p className="mt-4 text-slate-300">
              Review messages submitted from the Contact page.
            </p>
          </div>

          <div className="rounded-full border border-red-900/40 bg-white/5 px-5 py-2 text-sm font-bold text-white">
            {messages.length} Total
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
            <p className="font-bold text-slate-300">Loading messages...</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
            <h2 className="text-2xl font-black text-white">No messages yet</h2>
            <p className="mt-3 text-slate-300">
              When someone sends a message from the Contact page, it will show
              here.
            </p>
          </div>
        )}

        {!loading && !error && messages.length > 0 && (
          <div className="grid gap-6">
            {messages.map((message) => (
              <article
                key={message._id}
                className="rounded-3xl border border-red-900/40 bg-white p-6 text-black shadow-2xl"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                      {message.status || "Unread"}
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-slate-950">
                      {message.fullName}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      Submitted{" "}
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleString()
                        : "recently"}
                    </p>
                  </div>

                  <div className="rounded-full bg-black px-4 py-2 text-sm font-black text-white">
                    {message.subject}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Email
                    </p>

                    <a
                      href={`mailto:${message.email}`}
                      className="mt-2 block break-all font-bold text-slate-900 hover:text-red-700"
                    >
                      {message.email}
                    </a>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Phone
                    </p>

                    {message.phone ? (
                      <a
                        href={`tel:${message.phone}`}
                        className="mt-2 block font-bold text-slate-900 hover:text-red-700"
                      >
                        {message.phone}
                      </a>
                    ) : (
                      <p className="mt-2 font-bold text-slate-900">
                        Not provided
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Subject
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {message.subject}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border-l-4 border-red-700 bg-slate-100 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-red-700">
                    Message
                  </p>

                  <p className="mt-2 leading-7 text-slate-700">
                    {message.message}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${message.email}`}
                    className="rounded-full bg-red-700 px-5 py-3 text-sm font-black text-white hover:bg-red-800"
                  >
                    Reply by Email
                  </a>

                  {message.phone && (
                    <a
                      href={`tel:${message.phone}`}
                      className="rounded-full border border-slate-300 px-5 py-3 text-sm font-black text-slate-900 hover:border-red-700 hover:text-red-700"
                    >
                      Call Contact
                    </a>
                  )}

                  <button
                    type="button"
                    disabled={deletingId === message._id}
                    onClick={() => handleDelete(message._id)}
                    className="rounded-full border border-red-700 px-5 py-3 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === message._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
                <div className="mt-5 rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-red-700">
                    Update Status
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {["Unread", "Read", "Archived"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={updatingId === message._id}
                        onClick={() => handleStatusUpdate(message._id, status)}
                        className={`rounded-full px-4 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          message.status === status
                            ? "bg-black text-white"
                            : "border border-slate-300 text-slate-900 hover:border-red-700 hover:text-red-700"
                        }`}
                      >
                        {updatingId === message._id ? "Updating..." : status}
                      </button>
                    ))}
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
