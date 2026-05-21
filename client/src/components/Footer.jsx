import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Footer() {
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
        console.error("Fetch footer settings error:", error);

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
  const phone = settings?.phone || "(704) 555-1234";
  const email = settings?.email || "info@thequeensmen.com";
  const instagram = settings?.instagram || "";
  const facebook = settings?.facebook || "";
  const tiktok = settings?.tiktok || "";
  const tagline = settings?.tagline || "Exclusive Professional Male Models";

  return (
    <footer className="border-t border-red-900/40 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        {/* BRAND */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-black">
            {businessName === "The QueensMen" ? (
              <>
                The <span className="text-red-700">Queens</span>Men
              </>
            ) : (
              businessName
            )}
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-400">{tagline}</p>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Classy. Vintage. Bold.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Quick Links
          </h3>

          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-300">
            <Link to="/" className="hover:text-red-500">
              Home
            </Link>
            <Link to="/about" className="hover:text-red-500">
              About
            </Link>
            <Link to="/models" className="hover:text-red-500">
              Models
            </Link>
            <Link to="/flyers" className="hover:text-red-500">
              Flyers
            </Link>
            <Link to="/apply" className="hover:text-red-500">
              Apply
            </Link>
            <Link to="/book" className="hover:text-red-500">
              Book
            </Link>
            <Link to="/contact" className="hover:text-red-500">
              Contact
            </Link>
          </div>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Services
          </h3>

          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-300">
            <p>Fashion Shows</p>
            <p>Photoshoots</p>
            <p>Brand Campaigns</p>
            <p>Luxury Events</p>
            <p>Model Showcases</p>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-600">
            Contact
          </h3>

          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-300">
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="hover:text-red-500"
            >
              {phone}
            </a>

            <a href={`mailto:${email}`} className="hover:text-red-500">
              {email}
            </a>

            <div className="mt-3 flex flex-wrap gap-3">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-black text-white hover:bg-red-700"
                >
                  Instagram
                </a>
              )}

              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-black text-white hover:bg-red-700"
                >
                  Facebook
                </a>
              )}

              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-black text-white hover:bg-red-700"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-sm font-semibold text-slate-500">
        © {new Date().getFullYear()} {businessName}. All rights reserved.
      </div>
    </footer>
  );
}
