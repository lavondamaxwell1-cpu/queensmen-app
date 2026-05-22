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
  const logo = settings?.logo || "";

  return (
    <footer className="border-t border-slate-200 bg-white text-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        {/* BRAND */}
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-3">
            {logo ? (
              <div className="flex h-16 w-28 items-center justify-center overflow-hidden rounded-xl border border-red-700 bg-white p-1 shadow-sm">
                <img
                  src={logo}
                  alt={`${businessName} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-700 bg-white shadow-sm">
                <span className="text-lg font-black text-red-700">Q</span>
              </div>
            )}

            <h2 className="text-xl font-black">
              {businessName === "The QueensMen" ? (
                <>
                  The <span className="text-red-700">Q</span>ueensMen
                </>
              ) : (
                businessName
              )}
            </h2>
          </Link>

          <p className="mt-4 text-sm leading-6 text-slate-600">{tagline}</p>

          <p className="mt-4 text-sm font-bold text-slate-700">
            Classy. Vintage. Bold.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
            Quick Links
          </h3>

          <div className="mt-4 grid gap-3 text-sm font-bold text-slate-700">
            <Link to="/" className="hover:text-red-700">
              Home
            </Link>
            <Link to="/about" className="hover:text-red-700">
              About
            </Link>
            <Link to="/models" className="hover:text-red-700">
              Models
            </Link>
            <Link to="/flyers" className="hover:text-red-700">
              Flyers
            </Link>
            <Link to="/apply" className="hover:text-red-700">
              Apply
            </Link>
            <Link to="/book" className="hover:text-red-700">
              Book
            </Link>
            <Link to="/contact" className="hover:text-red-700">
              Contact
            </Link>
          </div>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
            Services
          </h3>

          <div className="mt-4 grid gap-3 text-sm font-bold text-slate-700">
            <p>Fashion Shows</p>
            <p>Photoshoots</p>
            <p>Brand Campaigns</p>
            <p>Luxury Events</p>
            <p>Model Showcases</p>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
            Contact
          </h3>

          <div className="mt-4 grid gap-3 text-sm font-bold text-slate-700">
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="hover:text-red-700"
            >
              {phone}
            </a>

            <a href={`mailto:${email}`} className="hover:text-red-700">
              {email}
            </a>

            <div className="mt-3 flex flex-wrap gap-3">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-black text-black hover:border-red-700 hover:bg-red-700 hover:text-white"
                >
                  Instagram
                </a>
              )}

              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-black text-black hover:border-red-700 hover:bg-red-700 hover:text-white"
                >
                  Facebook
                </a>
              )}

              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-black text-black hover:border-red-700 hover:bg-red-700 hover:text-white"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-5 text-center text-sm font-semibold text-slate-500">
        © {new Date().getFullYear()} {businessName}. All rights reserved.
      </div>
    </footer>
  );
}
