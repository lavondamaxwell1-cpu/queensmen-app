import { useEffect, useState } from "react";
import API from "../api/api";
import ImageUpload from "../components/ImageUpload";
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
    portfolio: "",
    availability: "",
    message: "",
    profileImage: "",
  });

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
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
        console.error("Fetch apply settings error:", error);

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
  const phone = settings?.phone || "(704) 555-1234";
  const email = settings?.email || "info@thequeensmen.com";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      age: "",
      height: "",
      experience: "",
      instagram: "",
      portfolio: "",
      availability: "",
      message: "",
      profileImage: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.post("/api/applications", formData);

      setSuccess("Application submitted successfully!");

      resetForm();

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Application submit error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while submitting your application.",
      );

      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-red-700 bg-white shadow-xl">
              <span className="text-3xl font-black text-red-700">Q</span>
            </div>

            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Loading Application
            </p>

            <p className="mt-3 text-slate-500">
              Preparing the application form...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full overflow-x-hidden bg-white text-black">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-700 sm:text-sm">
            Model Application
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl md:text-7xl">
            Apply to{" "}
            {businessName === "The QueensMen" ? (
              <>
                The <span className="text-red-700">Q</span>ueensMen
              </>
            ) : (
              businessName
            )}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
            Submit your information for review. The team will look over your
            experience, availability, social links, and professional details.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-6 md:py-16 lg:grid-cols-[1fr_1.4fr]">
        {/* SIDE INFO */}
        <aside className="grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-xl md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-700 sm:text-sm">
              Application Info
            </p>

            <h2 className="mt-3 text-2xl font-black text-slate-950 md:text-3xl">
              Apply to {businessName}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              Complete the form with accurate contact information and model
              details. If selected, the team will follow up with next steps.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <p className="text-xs font-black uppercase tracking-widest text-red-700">
                  Questions?
                </p>

                <a
                  href={`mailto:${email}`}
                  className="mt-2 block break-words text-base font-black text-slate-950 transition hover:text-red-700 md:text-lg"
                >
                  {email}
                </a>
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <p className="text-xs font-black uppercase tracking-widest text-red-700">
                  Phone
                </p>

                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="mt-2 block text-base font-black text-slate-950 transition hover:text-red-700 md:text-lg"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
            <h3 className="text-2xl font-black text-slate-950">
              What to include
            </h3>

            <div className="mt-5 grid gap-4 text-sm font-semibold leading-6 text-slate-600">
              <p>• Your current city and availability.</p>
              <p>• Modeling experience or related event experience.</p>
              <p>• Instagram, portfolio, or photo link if available.</p>
              <p>• Any special skills, style, or interests.</p>
            </div>
          </div>

          <div className="rounded-3xl border-l-4 border-red-700 bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
            <p className="text-sm leading-6 text-slate-600">
              Please use your real contact information so the owner can reach
              you if your application is selected.
            </p>
          </div>
        </aside>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 text-black shadow-2xl md:p-8"
        >
          <h2 className="text-2xl font-black text-slate-950 md:text-3xl">
            Application Form
          </h2>

          <p className="mt-2 text-sm text-slate-600 md:text-base">
            Fields marked with required validation must be completed before
            submitting.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-700"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-700"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Phone *
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-700"
                placeholder="Your phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Location *
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-700"
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
                min="18"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-700"
                placeholder="Example: 25"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-700"
                placeholder={`Example: 6'1"`}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Experience
              </label>

              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-700"
              >
                <option value="">Select experience level</option>
                <option value="New Model">New Model</option>
                <option value="Some Experience">Some Experience</option>
                <option value="Professional">Professional</option>
                <option value="Runway Experience">Runway Experience</option>
                <option value="Photoshoot Experience">
                  Photoshoot Experience
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Availability
              </label>

              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-700"
                placeholder="Weekends, evenings, flexible..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Instagram
              </label>

              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-700"
                placeholder="@username or profile link"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Portfolio / Photo Link
              </label>

              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-700"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Profile Photo
              </label>

              <ImageUpload
                label="Upload Profile Photo"
                onUpload={(imageUrl) =>
                  setFormData((prev) => ({
                    ...prev,
                    profileImage: imageUrl,
                  }))
                }
              />

              {formData.profileImage && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <img
                    src={formData.profileImage}
                    alt="Profile preview"
                    className="mx-auto h-64 w-full rounded-xl object-contain"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Message
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-700"
              placeholder="Tell us why you want to model with The QueensMen..."
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
            className="mt-6 w-full rounded-full bg-red-700 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60 md:px-6 md:py-4 md:text-base"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            {businessName} will review your application and follow up if your
            profile is a good fit.
          </p>
        </form>
      </section>
    </main>
  );
}
