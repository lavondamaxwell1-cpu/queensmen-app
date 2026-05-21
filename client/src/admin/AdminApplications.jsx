import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";
export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/applications");

        setApplications(data.applications || []);
      } catch (error) {
        console.error("Fetch applications error:", error);

        setError(
          error.response?.data?.message ||
            "Something went wrong while loading applications.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);

      const { data } = await API.patch(
        `/api/applications/${applicationId}/status`,
        {
          status: newStatus,
        },
      );

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId ? data.application : application,
        ),
      );
    } catch (error) {
      console.error("Update application status error:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong while updating the status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };
const handleDelete = async (applicationId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this application?",
  );

  if (!confirmDelete) return;

  try {
    setDeletingId(applicationId);

    await API.delete(`/api/applications/${applicationId}`);

    setApplications((prev) =>
      prev.filter((application) => application._id !== applicationId),
    );
  } catch (error) {
    console.error("Delete application error:", error);
    alert(
      error.response?.data?.message ||
        "Something went wrong while deleting the application.",
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
              Admin Applications
            </p>

            <h1 className="mt-4 text-4xl font-black md:text-5xl">
              Model <span className="text-red-700">Applications</span>
            </h1>

            <p className="mt-4 text-slate-300">
              Review people who submitted the Apply to Model form.
            </p>
          </div>

          <div className="rounded-full border border-red-900/40 bg-white/5 px-5 py-2 text-sm font-bold text-white">
            {applications.length} Total
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
            <p className="font-bold text-slate-300">Loading applications...</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
            <h2 className="text-2xl font-black text-white">
              No applications yet
            </h2>
            <p className="mt-3 text-slate-300">
              When someone applies to become a QueensMen model, their
              application will show here.
            </p>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="grid gap-6">
            {applications.map((application) => (
              <article
                key={application._id}
                className="rounded-3xl border border-red-900/40 bg-white p-6 text-black shadow-2xl"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                      {application.status || "Pending"}
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-slate-950">
                      {application.fullName}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      Submitted{" "}
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleString()
                        : "recently"}
                    </p>
                  </div>

                  <div className="rounded-full bg-black px-4 py-2 text-sm font-black text-white">
                    {application.experience}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Email
                    </p>
                    <a
                      href={`mailto:${application.email}`}
                      className="mt-2 block break-all font-bold text-slate-900 hover:text-red-700"
                    >
                      {application.email}
                    </a>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Phone
                    </p>
                    <a
                      href={`tel:${application.phone}`}
                      className="mt-2 block font-bold text-slate-900 hover:text-red-700"
                    >
                      {application.phone}
                    </a>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Location
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {application.location}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Age
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {application.age}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Height
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {application.height || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Social
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {application.instagram || "Not provided"}
                    </p>
                  </div>
                </div>

                {application.message && (
                  <div className="mt-6 rounded-2xl border-l-4 border-red-700 bg-slate-100 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Message
                    </p>
                    <p className="mt-2 leading-7 text-slate-700">
                      {application.message}
                    </p>
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${application.email}`}
                    className="rounded-full bg-red-700 px-5 py-3 text-sm font-black text-white hover:bg-red-800"
                  >
                    Email Applicant
                  </a>

                  <a
                    href={`tel:${application.phone}`}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-black text-slate-900 hover:border-red-700 hover:text-red-700"
                  >
                    Call Applicant
                  </a>

                  <button
                    type="button"
                    disabled={deletingId === application._id}
                    onClick={() => handleDelete(application._id)}
                    className="rounded-full border border-red-700 px-5 py-3 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === application._id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-red-700">
                    Update Status
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {["Pending", "Reviewed", "Accepted", "Rejected"].map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={updatingId === application._id}
                          onClick={() =>
                            handleStatusUpdate(application._id, status)
                          }
                          className={`rounded-full px-4 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            application.status === status
                              ? "bg-black text-white"
                              : "border border-slate-300 text-slate-900 hover:border-red-700 hover:text-red-700"
                          }`}
                        >
                          {updatingId === application._id
                            ? "Updating..."
                            : status}
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
