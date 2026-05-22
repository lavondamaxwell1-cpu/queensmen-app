import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function About() {
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

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
        console.error("Fetch about settings error:", error);

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
  const ownerPhoto = settings?.ownerPhoto || "";

  const ownerTitle = settings?.ownerTitle || "The Vision Behind The QueensMen";

  const ownerBio =
    settings?.ownerBio ||
    "The QueensMen was created to showcase exclusive professional male models who carry themselves with class, vintage style, confidence, and bold character.";

  const ownerQuote =
    settings?.ownerQuote ||
    "Classy. Vintage. Bold. That is the standard of The QueensMen.";

  const heroDescription =
    settings?.heroDescription ||
    "The Queensmen are a set of exclusive professional male models. They represent classy and vintage Gentle Men with a touch of boldness.";

  if (settingsLoading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-red-700 bg-white shadow-xl">
              <span className="text-3xl font-black text-red-700">Q</span>
            </div>

            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Loading About Page
            </p>

            <p className="mt-3 text-slate-500">
              Preparing the brand details...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white text-black">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            About The Brand
          </p>

          <h1 className="mt-4 text-5xl font-black text-slate-950 md:text-7xl">
            About{" "}
            {businessName === "The QueensMen" ? (
              <>
                The <span className="text-red-700">Q</span>ueensMen
              </>
            ) : (
              <span>{businessName}</span>
            )}
          </h1>

          <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-600">
            {tagline}
          </p>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Our Standard
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">
              Classy. Vintage. Bold.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {heroDescription}
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              The brand was built to represent polished male talent with
              confidence, professionalism, and timeless presentation for events,
              fashion, media, photoshoots, and luxury experiences.
            </p>

            <div className="mt-8 rounded-2xl border-l-4 border-red-700 bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-lg font-semibold italic text-slate-700">
                “{ownerQuote}”
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
            <div className="grid gap-5">
              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <h3 className="text-2xl font-black text-slate-950">
                  Professional Presence
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Models who bring refined energy, polished style, and reliable
                  professionalism to every opportunity.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <h3 className="text-2xl font-black text-slate-950">
                  Event Ready
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Available for fashion shows, photoshoots, brand campaigns,
                  showcases, promotional events, and upscale experiences.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <h3 className="text-2xl font-black text-slate-950">
                  Bold Character
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  A brand identity centered around confidence, class, vintage
                  presentation, and memorable impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OWNER SECTION */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl">
            {ownerPhoto ? (
              <img
                src={ownerPhoto}
                alt={`Owner of ${businessName}`}
                className="h-[560px] w-full bg-slate-100 object-contain"
              />
            ) : (
              <div className="flex h-[560px] items-center justify-center bg-slate-100">
                <p className="font-bold text-slate-500">
                  Owner photo not added yet
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Meet The Owner
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">
              {ownerTitle}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">{ownerBio}</p>

            <div className="mt-8 rounded-2xl border-l-4 border-red-700 bg-slate-50 p-6 ring-1 ring-slate-200">
              <p className="text-lg font-semibold italic text-slate-700">
                “{ownerQuote}”
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/models"
                className="rounded-full bg-red-700 px-7 py-3 font-black text-white shadow-lg hover:bg-red-800"
              >
                View Models
              </Link>

              <Link
                to="/book"
                className="rounded-full border border-slate-300 px-7 py-3 font-black text-slate-950 hover:border-black hover:bg-black hover:text-white"
              >
                Book Talent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Brand Values
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">
              Built on presentation, professionalism, and confidence.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
              <h3 className="text-2xl font-black text-slate-950">Class</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Every model represents the brand with polished style, respect,
                and elevated presence.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
              <h3 className="text-2xl font-black text-slate-950">
                Vintage Style
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                The QueensMen identity blends timeless fashion energy with a
                modern bold edge.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow ring-1 ring-slate-200">
              <h3 className="text-2xl font-black text-slate-950">Boldness</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Confidence, character, and memorable presentation are part of
                the brand standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="font-bold uppercase tracking-[0.25em] text-red-700">
            Work With Us
          </p>

          <h2 className="mt-4 text-4xl font-black text-slate-950 md:text-5xl">
            Ready to connect with{" "}
            {businessName === "The QueensMen" ? (
              <>
                The <span className="text-red-700">Q</span>ueensMen?
              </>
            ) : (
              <>{businessName}?</>
            )}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Whether you are booking talent, applying to model, or asking about
            events, we are ready to connect.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/apply"
              className="rounded-full bg-red-700 px-8 py-4 font-black text-white shadow-lg hover:bg-red-800"
            >
              Apply Now
            </Link>

            <Link
              to="/contact"
              className="rounded-full border border-slate-300 px-8 py-4 font-black text-slate-950 hover:border-black hover:bg-black hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
