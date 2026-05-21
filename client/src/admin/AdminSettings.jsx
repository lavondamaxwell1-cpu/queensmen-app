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

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const { data } = await API.put("/api/settings", formData);

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

      setSuccess("Business settings saved successfully!");
    } catch (error) {
      console.error("Save settings error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while saving business settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
          <p className="font-bold text-slate-300">Loading settings...</p>
        </div>
      </main>
    );
  }

  return (
     <>
    <AdminNavbar />
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          

          <p className="mt-8 font-bold uppercase tracking-[0.25em] text-red-600">
            Admin Settings
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Business <span className="text-red-700">Settings</span>
          </h1>

          <p className="mt-4 text-slate-300">
            Update the business info shown across the public website.
          </p>
        </div>

        <form
          onSubmit={handleSaveSettings}
          className="rounded-3xl border border-red-900/40 bg-white p-6 text-black shadow-2xl"
        >
          <div className="grid gap-8">
            {/* BASIC INFO */}
            <section>
              <h2 className="text-2xl font-black text-slate-950">
                Basic Business Info
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="info@thequeensmen.com"
                  />
                </div>
              </div>
            </section>

            {/* SOCIAL LINKS */}
            <section>
              <h2 className="text-2xl font-black text-slate-950">
                Social Links
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
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
            <section>
              <h2 className="text-2xl font-black text-slate-950">
                Brand Images
              </h2>

              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <ImageUpload
                    label="Upload Logo"
                    onUpload={(imageUrl) =>
                      setFormData((prev) => ({
                        ...prev,
                        logo: imageUrl,
                      }))
                    }
                  />

                  <label className="mt-4 mb-2 block text-sm font-bold text-slate-700">
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

                  {formData.logo && (
                    <div className="mt-4 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-black p-4">
                      <img
                        src={formData.logo}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <ImageUpload
                    label="Upload Owner Photo"
                    onUpload={(imageUrl) =>
                      setFormData((prev) => ({
                        ...prev,
                        ownerPhoto: imageUrl,
                      }))
                    }
                  />

                  <label className="mt-4 mb-2 block text-sm font-bold text-slate-700">
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

                  {formData.ownerPhoto && (
                    <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={formData.ownerPhoto}
                        alt="Owner preview"
                        className="h-72 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* HOMEPAGE TEXT */}
            <section>
              <h2 className="text-2xl font-black text-slate-950">
                Homepage Text
              </h2>

              <div className="mt-5 grid gap-4">
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
                    rows="4"
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

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-red-700 px-6 py-4 font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Settings..." : "Save Business Settings"}
            </button>
          </div>
        </form>
      </div>
    </main>
    </>
  );
}
