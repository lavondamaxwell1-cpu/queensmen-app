import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function About() {
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
        console.error("Fetch about settings error:", error);

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

  return (
    <main className="bg-black text-white">
      {/* HEADER */}
      <section className="border-b border-red-900/40 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-bold uppercase tracking-[0.25em] text-red-600">
            About The Brand
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-6xl">
            About{" "}
            {businessName === "The QueensMen" ? (
              <>
                The <span className="text-red-700">Queens</span>Men
              </>
            ) : (
              <span className="text-red-700">{businessName}</span>
            )}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {tagline}
          </p>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="bg-white text-black">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
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
              fashion, media, and luxury experiences.
            </p>

            <div className="mt-8 rounded-2xl border-l-4 border-red-700 bg-slate-50 p-6">
              <p className="text-lg font-semibold italic text-slate-700">
                “{ownerQuote}”
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-100 p-6 shadow-xl">
            <div className="grid gap-5">
              <div className="rounded-2xl bg-white p-6 shadow">
                <h3 className="text-2xl font-black text-slate-950">
                  Professional Presence
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Models who bring refined energy and polished style to every
                  opportunity.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <h3 className="text-2xl font-black text-slate-950">
                  Event Ready
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  Available for fashion shows, photoshoots, campaigns,
                  showcases, and upscale brand experiences.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow">
                <h3 className="text-2xl font-black text-slate-950">
                  Bold Character
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  A brand identity centered around confidence, class, and
                  memorable presentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OWNER SECTION */}
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border border-red-900/40 bg-white/5 shadow-2xl">
            {ownerPhoto ? (
              <img
                src={ownerPhoto}
                alt={`Owner of ${businessName}`}
                className="h-[520px] w-full bg-slate-100 object-contain"
              />
            ) : (
              <div className="flex h-[520px] items-center justify-center bg-slate-900">
                <p className="font-bold text-slate-400">
                  Owner photo not added yet
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-red-600">
              Meet The Owner
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              {ownerTitle}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">{ownerBio}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/models"
                className="rounded-full bg-red-700 px-7 py-3 font-black text-white shadow-lg hover:bg-red-800"
              >
                View Models
              </Link>

              <Link
                to="/book"
                className="rounded-full border border-white/40 px-7 py-3 font-black text-white hover:bg-white hover:text-black"
              >
                Book Talent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-red-900/40 bg-black">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="font-bold uppercase tracking-[0.25em] text-red-600">
            Work With Us
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Ready to connect with {businessName}?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Whether you are booking talent, applying to model, or asking about
            events, The QueensMen is ready to connect.
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
              className="rounded-full border border-white/40 px-8 py-4 font-black text-white hover:bg-white hover:text-black"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
