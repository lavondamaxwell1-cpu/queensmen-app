import { useEffect, useState } from "react";
import API from "../api/api";
export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
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
        console.error("Fetch contact settings error:", error);

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

      await API.post("/api/contact", formData);

      setSuccess("Message sent successfully!");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact submit error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while sending your message.",
      );
    } finally {
      setLoading(false);
    }
  };
  const businessName = settings?.businessName || "The QueensMen";
  const phone = settings?.phone || "(704) 555-1234";
  const email = settings?.email || "info@thequeensmen.com";
  const instagram = settings?.instagram || "";
  const facebook = settings?.facebook || "";
  const tiktok = settings?.tiktok || "";
  return (
    <main className="bg-black text-white">
      {/* HEADER */}
      <section className="border-b border-red-900/40 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-bold uppercase tracking-[0.25em] text-red-600">
            Contact The QueensMen
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-6xl">
            Let’s Connect
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Reach out for bookings, collaborations, casting opportunities,
            business questions, or general inquiries.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
        {/* CONTACT INFO */}
        <aside className="rounded-3xl border border-red-900/40 bg-white/5 p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-white">Business Info</h2>

          <div className="mt-8 space-y-5">
            <div className="rounded-3xl border border-red-900/40 bg-white p-6 text-black shadow-2xl">
              <p className="font-bold uppercase tracking-[0.25em] text-red-700">
                Contact Info
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Reach {businessName}
              </h2>

              <div className="mt-6 grid gap-4">
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

                <div className="rounded-2xl bg-slate-100 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-red-700">
                    Email
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
                    Socials
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {instagram ? (
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                      >
                        Instagram
                      </a>
                    ) : (
                      <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-bold text-slate-500">
                        Instagram
                      </span>
                    )}

                    {facebook ? (
                      <a
                        href={facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                      >
                        Facebook
                      </a>
                    ) : (
                      <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-bold text-slate-500">
                        Facebook
                      </span>
                    )}

                    {tiktok ? (
                      <a
                        href={tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                      >
                        TikTok
                      </a>
                    ) : (
                      <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-bold text-slate-500">
                        TikTok
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTACT FORM */}
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
                placeholder="Enter your name"
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
                placeholder="Enter your email"
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
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                placeholder="Enter your phone"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
              >
                <option value="">Select subject</option>
                <option value="Booking Question">Booking Question</option>
                <option value="Model Application">Model Application</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Event Inquiry">Event Inquiry</option>
                <option value="General Question">General Question</option>
              </select>
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
              required
              rows="7"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
              placeholder="Type your message here..."
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
            {loading ? "Sending..." : "Send Message"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            The QueensMen team will review your message and follow up.
          </p>
        </form>
      </section>
    </main>
  );
}
