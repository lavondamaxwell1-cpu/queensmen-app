import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";

export default function AdminResetPassword() {
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);

        const { data } = await API.get("/api/settings");

        if (!ignore) {
          setSettings(data.settings || null);
        }
      } catch (error) {
        console.error("Fetch reset password settings error:", error);

        if (!ignore) {
          setSettings(null);
        }
      } finally {
        if (!ignore) {
          setSettingsLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      ignore = true;
    };
  }, []);

  const businessName = settings?.businessName || "The QueensMen";
  const tagline = settings?.tagline || "Exclusive Professional Male Models";
  const logo = settings?.logo || "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const { data } = await API.put(
        `/api/admin/reset-password/${token}`,
        formData,
      );

      setSuccess(data.message || "Password reset successfully.");

      setFormData({
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Reset password error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while resetting password.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-36 items-center justify-center rounded-2xl border-2 border-red-700 bg-white p-2 shadow-xl">
              <span className="text-3xl font-black text-red-700">Q</span>
            </div>

            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Loading Reset Page
            </p>

            <p className="mt-3 text-slate-500">Preparing password reset...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-black">
      <section className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-28 w-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-red-700 bg-white p-2 shadow-xl">
              {logo ? (
                <img
                  src={logo}
                  alt={`${businessName} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-3xl font-black text-red-700">Q</span>
              )}
            </div>

            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Password
            </p>

            <h1 className="mt-3 text-4xl font-black text-slate-950">
              Reset Password
            </h1>

            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              {tagline}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl"
          >
            <p className="mb-5 text-sm font-semibold leading-6 text-slate-600">
              Enter and confirm your new admin password.
            </p>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  New Password
                </label>

                <input
                  type={showPasswords ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                  placeholder="New password"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Confirm Password
                </label>

                <input
                  type={showPasswords ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPasswords((prev) => !prev)}
              className="mt-4 rounded-full border border-slate-300 px-5 py-2 text-sm font-black text-slate-900 hover:border-black hover:bg-black hover:text-white"
            >
              {showPasswords ? "Hide Passwords" : "Show Passwords"}
            </button>

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
              disabled={loading}
              className="mt-6 w-full rounded-full bg-red-700 px-6 py-4 font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            {success && (
              <Link
                to="/admin/login"
                className="mt-4 block w-full rounded-full border border-slate-300 px-6 py-3 text-center font-black text-slate-950 hover:border-black hover:bg-black hover:text-white"
              >
                Back to Login
              </Link>
            )}
          </form>

          <p className="mt-6 text-center text-xs font-semibold text-slate-500">
            {businessName} admin recovery.
          </p>
        </div>
      </section>
    </main>
  );
}
