import { useEffect, useState } from "react";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentAdmin = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/api/admin/users");

      setAdmins(data.admins || []);
    } catch (error) {
      console.error("Fetch admins error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while loading admin users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const { data } = await API.post("/api/admin/create-admin", formData);

      setAdmins((prev) => [data.admin, ...prev]);
      setSuccess("Admin account created successfully!");
      resetForm();

      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      console.error("Create admin error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while creating admin account."
      );

      setTimeout(() => setError(""), 5000);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin account?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(adminId);

      await API.delete(`/api/admin/users/${adminId}`);

      setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
    } catch (error) {
      console.error("Delete admin error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting admin account."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
        <div className="mx-auto max-w-6xl">
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Access
            </p>

            <h1 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
              Manage <span className="text-red-700">Admins</span>
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Add or remove admin accounts for people who need access to manage
              the website.
            </p>
          </section>

          <section className="grid gap-10 lg:grid-cols-[0.9fr_1.3fr]">
            <form
              onSubmit={handleCreateAdmin}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl"
            >
              <h2 className="text-3xl font-black text-slate-950">
                Add Admin
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create a temporary password. The new admin can change it after
                logging in.
              </p>

              <div className="mt-7 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Admin name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Temporary password"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={creating}
                className="mt-6 w-full rounded-full bg-red-700 px-6 py-4 font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Creating Admin..." : "Create Admin"}
              </button>
            </form>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="text-3xl font-black text-slate-950">
                    Admin Accounts
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    {admins.length} admin account
                    {admins.length === 1 ? "" : "s"} found.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
                  <p className="font-bold text-slate-600">
                    Loading admins...
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-4">
                  {admins.map((admin) => {
                    const isCurrentAdmin =
                      String(admin._id || admin.id) ===
                      String(currentAdmin._id || currentAdmin.id);

                    return (
                      <div
                        key={admin._id || admin.id}
                        className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200"
                      >
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                          <div>
                            <h3 className="text-xl font-black text-slate-950">
                              {admin.name}
                            </h3>

                            <p className="mt-1 break-words text-sm font-bold text-red-700">
                              {admin.email}
                            </p>

                            {isCurrentAdmin && (
                              <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500">
                                Current logged-in admin
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={
                              deletingId === (admin._id || admin.id) ||
                              isCurrentAdmin
                            }
                            onClick={() =>
                              handleDeleteAdmin(admin._id || admin.id)
                            }
                            className="w-fit rounded-full border border-red-700 px-5 py-3 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === (admin._id || admin.id)
                              ? "Deleting..."
                              : isCurrentAdmin
                              ? "Current Admin"
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
