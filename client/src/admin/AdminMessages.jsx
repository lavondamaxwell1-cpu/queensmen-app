import { useEffect, useState } from "react";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/contact");

        if (!ignore) {
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Fetch messages error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading messages.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusChange = async (messageId, status) => {
    try {
      setUpdatingId(messageId);

      const { data } = await API.patch(`/api/contact/${messageId}/status`, {
        status,
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
          "Something went wrong while updating message status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (messageId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(messageId);

      await API.delete(`/api/contact/${messageId}`);

      setMessages((prev) =>
        prev.filter((message) => message._id !== messageId),
      );
    } catch (error) {
      console.error("Delete message error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting this message.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Read") {
      return "bg-green-50 text-green-700 ring-green-200";
    }

    if (status === "Replied") {
      return "bg-blue-50 text-blue-700 ring-blue-200";
    }

    return "bg-yellow-50 text-yellow-700 ring-yellow-200";
  };

  const unreadCount = messages.filter(
    (message) => (message.status || "Unread") === "Unread",
  ).length;

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Messages
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
                  Contact <span className="text-red-700">Messages</span>
                </h1>

                <p className="mt-4 max-w-2xl text-slate-600">
                  Review public contact form messages, mark them as read or
                  replied, and follow up with visitors.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-black text-slate-800 shadow-sm">
                  {messages.length} Total
                </div>

                <div className="rounded-full border border-yellow-200 bg-yellow-50 px-5 py-2 text-sm font-black text-yellow-700 shadow-sm">
                  {unreadCount} Unread
                </div>
              </div>
            </div>
          </section>

          {/* STATES */}
          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="font-bold text-slate-600">Loading messages...</p>
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-bold">{error}</p>
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                No messages yet
              </h2>

              <p className="mt-3 text-slate-600">
                New contact messages will show here after someone submits the
                public contact form.
              </p>
            </div>
          )}

          {/* LIST */}
          {!loading && !error && messages.length > 0 && (
            <section className="grid gap-6">
              {messages.map((message) => (
                <article
                  key={message._id}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ring-1 ${getStatusClass(
                            message.status || "Unread",
                          )}`}
                        >
                          {message.status || "Unread"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                          Submitted{" "}
                          {message.createdAt
                            ? new Date(message.createdAt).toLocaleDateString()
                            : "recently"}
                        </span>
                      </div>

                      <h2 className="mt-4 text-3xl font-black text-slate-950">
                        {message.fullName}
                      </h2>

                      <p className="mt-2 font-bold text-red-700">
                        {message.subject || "No subject provided"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <select
                        value={message.status || "Unread"}
                        disabled={updatingId === message._id}
                        onChange={(e) =>
                          handleStatusChange(message._id, e.target.value)
                        }
                        className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-900 outline-none focus:border-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="Unread">Unread</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                      </select>

                      <button
                        type="button"
                        disabled={deletingId === message._id}
                        onClick={() => handleDelete(message._id)}
                        className="rounded-full border border-red-700 px-5 py-3 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === message._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Email
                      </p>

                      <a
                        href={`mailto:${message.email}`}
                        className="mt-2 block break-words font-bold text-slate-900 hover:text-red-700"
                      >
                        {message.email}
                      </a>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-black uppercase tracking-widest text-red-700">
                        Phone
                      </p>

                      {message.phone ? (
                        <a
                          href={`tel:${String(message.phone).replace(
                            /\D/g,
                            "",
                          )}`}
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
                  </div>

                  <div className="mt-5 rounded-2xl border-l-4 border-red-700 bg-slate-50 p-5 ring-1 ring-slate-200">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Message
                    </p>

                    <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                      {message.message}
                    </p>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
