import { useEffect, useState } from "react";
import API from "../api/api";
import ImageUpload from "../components/ImageUpload";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    businessName: "",
    tagline: "",
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    logo: "",
    ownerPhoto: "",
    heroDescription: "",
    ownerTitle: "",
    ownerBio: "",
    ownerQuote: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/settings");

        if (!ignore) {
          setFormData({
            businessName: data.settings?.businessName || "",
            tagline: data.settings?.tagline || "",
            phone: data.settings?.phone || "",
            email: data.settings?.email || "",
            instagram: data.settings?.instagram || "",
            facebook: data.settings?.facebook || "",
            tiktok: data.settings?.tiktok || "",
            logo: data.settings?.logo || "",
            ownerPhoto: data.settings?.ownerPhoto || "",
            heroDescription: data.settings?.heroDescription || "",
            ownerTitle: data.settings?.ownerTitle || "",
            ownerBio: data.settings?.ownerBio || "",
            ownerQuote: data.settings?.ownerQuote || "",
          });
        }
      } catch (error) {
        console.error("Fetch settings error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading business settings.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
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

  const hydrateSettings = (settings) => {
    setFormData({
      businessName: settings?.businessName || "",
      tagline: settings?.tagline || "",
      phone: settings?.phone || "",
      email: settings?.email || "",
      instagram: settings?.instagram || "",
      facebook: settings?.facebook || "",
      tiktok: settings?.tiktok || "",
      logo: settings?.logo || "",
      ownerPhoto: settings?.ownerPhoto || "",
      heroDescription: settings?.heroDescription || "",
      ownerTitle: settings?.ownerTitle || "",
      ownerBio: settings?.ownerBio || "",
      ownerQuote: settings?.ownerQuote || "",
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const { data } = await API.put("/api/settings", formData);

      hydrateSettings(data.settings);

      setSuccess("Business settings saved successfully!");

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Save settings error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while saving business settings.",
      );

      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />

        <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
          <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="font-bold text-slate-600">Loading settings...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
        <div className="mx-auto max-w-6xl">
          {/* HEADER */}
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Settings
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
                  Business <span className="text-red-700">Settings</span>
                </h1>

                <p className="mt-4 max-w-2xl text-slate-600">
                  Update the public website logo, owner photo, phone, email,
                  socials, homepage text, and brand messaging.
                </p>
              </div>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-fit rounded-full bg-black px-6 py-3 font-black text-white shadow hover:bg-red-700"
              >
                View Public Site
              </a>
            </div>
          </section>

          <form
            onSubmit={handleSaveSettings}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 text-black shadow-xl"
          >
            <div className="grid gap-8">
              {/* BASIC INFO */}
              <section className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <p className="font-bold uppercase tracking-[0.25em] text-red-700">
                  Basic Info
                </p>

                <h2 className="mt-3 text-3xl font-black text-slate-950">
                  Business Information
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  These details appear across the homepage, footer, contact
                  page, booking page, and application page.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-700"
                      placeholder="The QueensMen"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Tagline
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-700"
                      placeholder="Exclusive Professional Male Models"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-700"
                      placeholder="(704) 555-1234"
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
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-700"
                      placeholder="info@thequeensmen.com"
                    />
                  </div>
                </div>
              </section>

              {/* SOCIAL LINKS */}
              <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <p className="font-bold uppercase tracking-[0.25em] text-red-700">
                  Social Media
                </p>

                <h2 className="mt-3 text-3xl font-black text-slate-950">
                  Social Links
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Leave a social field blank if you do not want it shown on the
                  public site.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      TikTok URL
                    </label>
                    <input
                      type="url"
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>
                </div>
              </section>

              {/* IMAGES */}
              <section className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <p className="font-bold uppercase tracking-[0.25em] text-red-700">
                  Brand Images
                </p>

                <h2 className="mt-3 text-3xl font-black text-slate-950">
                  Logo & Owner Photo
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The logo appears in the navbar, footer, and homepage. The
                  owner photo appears on the homepage and about page.
                </p>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  {/* LOGO */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                      Logo
                    </p>

                    <div className="mt-4">
                      <ImageUpload
                        label="Upload Logo"
                        onUpload={(imageUrl) =>
                          setFormData((prev) => ({
                            ...prev,
                            logo: imageUrl,
                          }))
                        }
                      />
                    </div>

                    <label className="mb-2 mt-4 block text-sm font-bold text-slate-700">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="https://..."
                    />

                    {formData.logo ? (
                      <div className="mt-4 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <img
                          src={formData.logo}
                          alt="Logo preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                        <p className="font-bold text-slate-500">
                          No logo uploaded yet
                        </p>
                      </div>
                    )}
                  </div>

                  {/* OWNER PHOTO */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                      Owner Photo
                    </p>

                    <div className="mt-4">
                      <ImageUpload
                        label="Upload Owner Photo"
                        onUpload={(imageUrl) =>
                          setFormData((prev) => ({
                            ...prev,
                            ownerPhoto: imageUrl,
                          }))
                        }
                      />
                    </div>

                    <label className="mb-2 mt-4 block text-sm font-bold text-slate-700">
                      Owner Photo URL
                    </label>
                    <input
                      type="url"
                      name="ownerPhoto"
                      value={formData.ownerPhoto}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="https://..."
                    />

                    {formData.ownerPhoto ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <img
                          src={formData.ownerPhoto}
                          alt="Owner preview"
                          className="h-96 w-full bg-slate-100 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 flex h-96 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                        <p className="font-bold text-slate-500">
                          No owner photo uploaded yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* HOMEPAGE TEXT */}
              <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <p className="font-bold uppercase tracking-[0.25em] text-red-700">
                  Homepage Text
                </p>

                <h2 className="mt-3 text-3xl font-black text-slate-950">
                  Public Website Wording
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  These fields control the homepage and about page wording.
                </p>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Hero Description
                    </label>
                    <textarea
                      name="heroDescription"
                      value={formData.heroDescription}
                      onChange={handleChange}
                      rows="4"
                      className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="Main homepage description..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Owner Section Title
                    </label>
                    <input
                      type="text"
                      name="ownerTitle"
                      value={formData.ownerTitle}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="The Vision Behind The QueensMen"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Owner Bio
                    </label>
                    <textarea
                      name="ownerBio"
                      value={formData.ownerBio}
                      onChange={handleChange}
                      rows="5"
                      className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="Owner bio..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Owner Quote
                    </label>
                    <textarea
                      name="ownerQuote"
                      value={formData.ownerQuote}
                      onChange={handleChange}
                      rows="3"
                      className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="Classy. Vintage. Bold..."
                    />
                  </div>
                </div>
              </section>

              {/* MESSAGES */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                  {success}
                </div>
              )}

              {/* SAVE */}
              <div className="sticky bottom-4 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-full bg-red-700 px-6 py-4 font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving Settings..." : "Save Business Settings"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
