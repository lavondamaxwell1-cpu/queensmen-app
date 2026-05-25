import { useState } from "react";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [suggestedPassword, setSuggestedPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const generateStrongPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{}?";

    const allChars = uppercase + lowercase + numbers + symbols;

    let password = "";

    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = password.length; i < 14; i += 1) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    const shuffledPassword = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setSuggestedPassword(shuffledPassword);

    setFormData((prev) => ({
      ...prev,
      newPassword: shuffledPassword,
      confirmPassword: shuffledPassword,
    }));
  };

  const copySuggestedPassword = async () => {
    try {
      await navigator.clipboard.writeText(suggestedPassword);
      setSuccess("Suggested password copied!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Copy password error:", error);
      setError("Could not copy password. Please copy it manually.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setSuggestedPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await API.put("/api/admin/change-password", formData);

      setSuccess("Password changed successfully!");
      resetForm();

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Change password error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while changing the password."
      );

      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
        <div className="mx-auto max-w-3xl">
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Security
            </p>

            <h1 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
              Change <span className="text-red-700">Password</span>
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Update the admin password for this account. Use a strong password
              that is not shared publicly.
            </p>
          </section>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl"
          >
            <div className="grid gap-5">
              {/* CURRENT PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Current Password
                </label>

                <div className="flex gap-2">
                  <input
                    type={showPasswords.currentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    onClick={() => toggleShowPassword("currentPassword")}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-800 hover:border-black hover:bg-black hover:text-white"
                  >
                    {showPasswords.currentPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  New Password
                </label>

                <div className="flex gap-2">
                  <input
                    type={showPasswords.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    onClick={() => toggleShowPassword("newPassword")}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-800 hover:border-black hover:bg-black hover:text-white"
                  >
                    {showPasswords.newPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Confirm New Password
                </label>

                <div className="flex gap-2">
                  <input
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Confirm new password"
                  />

                  <button
                    type="button"
                    onClick={() => toggleShowPassword("confirmPassword")}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-800 hover:border-black hover:bg-black hover:text-white"
                  >
                    {showPasswords.confirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {/* STRONG PASSWORD TOOL */}
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                Strong Password Helper
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Generate a strong password and save it somewhere safe before
                changing it.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className="rounded-full bg-black px-5 py-3 text-sm font-black text-white hover:bg-red-700"
                >
                  Generate Strong Password
                </button>

                {suggestedPassword && (
                  <button
                    type="button"
                    onClick={copySuggestedPassword}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-black text-slate-900 hover:border-red-700 hover:text-red-700"
                  >
                    Copy Password
                  </button>
                )}
              </div>

              {suggestedPassword && (
                <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <p className="text-xs font-black uppercase tracking-widest text-red-700">
                    Suggested Password
                  </p>

                  <p className="mt-2 break-all font-mono text-lg font-black text-slate-950">
                    {suggestedPassword}
                  </p>

                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    This password was also placed into the New Password and
                    Confirm Password fields.
                  </p>
                </div>
              )}
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
              disabled={saving}
              className="mt-6 w-full rounded-full bg-red-700 px-6 py-4 font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}