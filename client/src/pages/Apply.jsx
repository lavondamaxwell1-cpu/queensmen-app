import { useState,useEffect } from "react";
import API from "../api/api";

export default function Apply() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    age: "",
    height: "",
    experience: "",
    instagram: "",
    message: "",
  });
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [settings, setSettings] = useState(null);

useEffect(() => {
  let ignore = false;

  const fetchSettings = async () => {
    try {
      const { data } = await API.get("/api/settings");

      if (!ignore) {
        setSettings(data.settings || null);
      }
    } catch (error) {
      console.error("Fetch apply settings error:", error);

      if (!ignore) {
        setSettings(null);
      }
    }
  };

  fetchSettings();

  return () => {
    ignore = true;
  };
}, []);
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

    await API.post("/api/applications", formData);

    setSuccess("Application submitted successfully!");

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      age: "",
      height: "",
      experience: "",
      instagram: "",
      message: "",
    });
  } catch (error) {
    console.error("Application submit error:", error);

    setError(
      error.response?.data?.message ||
        "Something went wrong while submitting your application.",
    );
  } finally {
    setLoading(false);
  }
};
const businessName = settings?.businessName || "The QueensMen";
const phone = settings?.phone || "(704) 555-1234";
const email = settings?.email || "info@thequeensmen.com";

  return (
    <main className="bg-black text-white">
      {/* HEADER */}
      <section className="border-b border-red-900/40 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-bold uppercase tracking-[0.25em] text-red-600">
            Join The Roster
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-6xl">
            Apply to Become a <span className="text-red-700">QueensMen</span>{" "}
            Model
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            The QueensMen are looking for professional male models who represent
            class, vintage style, confidence, and bold presence. Submit your
            application below.
          </p>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
        {/* SIDE INFO */}
        <aside className="rounded-3xl border border-red-900/40 bg-white/5 p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-white">What We Look For</h2>

          <div className="mt-6 space-y-5 text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-black p-5">
              <h3 className="font-black text-red-600">Class</h3>
              <p className="mt-2 text-sm leading-6">
                A polished look, professional attitude, and strong presence.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black p-5">
              <h3 className="font-black text-red-600">Vintage Style</h3>
              <p className="mt-2 text-sm leading-6">
                The QueensMen brand represents timeless gentleman energy.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black p-5">
              <h3 className="font-black text-red-600">Boldness</h3>
              <p className="mt-2 text-sm leading-6">
                Confidence, creativity, and the ability to stand out.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-red-900/40 bg-white p-6 text-black shadow-2xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Application Info
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Apply to {businessName}
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Submit your application and the team will review your information,
              experience, photos, and availability.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-slate-100 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-red-700">
                  Questions?
                </p>

                <a
                  href={`mailto:${email}`}
                  className="mt-2 block text-lg font-black text-slate-950 hover:text-red-700"
                >
                  {email}
                </a>
              </div>

              <div className="rounded-2xl bg-slate-100 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-red-700">
                  Phone
                </p>

                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="mt-2 block text-lg font-black text-slate-950 hover:text-red-700"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* APPLICATION FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-8 text-black shadow-2xl"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="Enter full name"
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
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="18+"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Height
              </label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="Example: 6'0"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Modeling Experience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
              >
                <option value="">Select experience</option>
                <option value="Beginner">Beginner</option>
                <option value="Some Experience">Some Experience</option>
                <option value="Experienced">Experienced</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Instagram / Social Media
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="@username"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Tell us about yourself
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
              placeholder="Tell us about your style, experience, goals, or why you want to join The QueensMen..."
            />
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
            disabled={loading}
            className="mt-6 w-full rounded-full bg-red-700 px-6 py-4 font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
          <p className="mt-4 text-center text-sm text-slate-500">
            {businessName} will review your application.
          </p>
        </form>
      </section>
    </main>
  );
}
