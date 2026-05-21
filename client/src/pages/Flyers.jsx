import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Flyers() {
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFlyer, setSelectedFlyer] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchFlyers = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/flyers");

        if (!ignore) {
          setFlyers(data.flyers || []);
        }
      } catch (error) {
        console.error("Fetch flyers error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading flyers.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchFlyers();

    return () => {
      ignore = true;
    };
  }, []);

  const featuredFlyer = flyers[0];

  return (
    <main className="bg-black text-white">
      {/* PAGE HEADER */}
      <section className="border-b border-red-900/40 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-bold uppercase tracking-[0.25em] text-red-600">
            Events & Announcements
          </p>

          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-5xl font-black md:text-6xl">
                Flyers & <span className="text-red-700">Events</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Stay updated with The QueensMen casting calls, showcases, brand
                events, model opportunities, tours, and exclusive announcements.
              </p>
            </div>

            <Link
              to="/contact"
              className="w-fit rounded-full bg-red-700 px-7 py-3 font-bold text-white shadow hover:bg-red-800"
            >
              Ask About Events
            </Link>
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
            <p className="font-bold text-slate-300">Loading flyers...</p>
          </div>
        </section>
      )}

      {/* ERROR */}
      {error && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-bold">{error}</p>
          </div>
        </section>
      )}

      {/* EMPTY */}
      {!loading && !error && flyers.length === 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
            <h2 className="text-2xl font-black text-white">
              No flyers posted yet
            </h2>

            <p className="mt-3 text-slate-300">
              When the owner adds flyers from the admin dashboard, they will
              show here.
            </p>
          </div>
        </section>
      )}

      {/* CONTENT */}
      {!loading && !error && flyers.length > 0 && (
        <>
          {/* FEATURED FLYER */}
          {featuredFlyer && (
            <section className="border-b border-red-900/40 bg-black">
              <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1.1fr_1.4fr]">
                <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 shadow-2xl">
                  <p className="font-bold uppercase tracking-[0.25em] text-red-600">
                    Latest Opportunity
                  </p>

                  <h2 className="mt-4 text-4xl font-black">
                    {featuredFlyer.title}
                  </h2>

                  <p className="mt-4 text-lg leading-8 text-slate-300">
                    {featuredFlyer.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
                    {featuredFlyer.location && (
                      <span className="rounded-full border border-red-900/50 px-4 py-2 text-white">
                        {featuredFlyer.location}
                      </span>
                    )}

                    {featuredFlyer.type && (
                      <span className="rounded-full border border-red-900/50 px-4 py-2 text-white">
                        {featuredFlyer.type}
                      </span>
                    )}

                    {featuredFlyer.date && (
                      <span className="rounded-full border border-red-900/50 px-4 py-2 text-white">
                        {new Date(featuredFlyer.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {featuredFlyer.tourDates &&
                    featuredFlyer.tourDates.length > 0 && (
                      <div className="mt-6 rounded-2xl border border-red-900/40 bg-black p-5">
                        <p className="text-sm font-black uppercase tracking-widest text-red-600">
                          Tour Dates
                        </p>

                        <div className="mt-4 grid gap-3">
                          {featuredFlyer.tourDates.map((stop, index) => (
                            <div
                              key={`${stop.city}-${stop.date}-${index}`}
                              className="rounded-xl border border-white/10 p-4"
                            >
                              <p className="font-black text-white">
                                {stop.city || "City not listed"} —{" "}
                                {stop.date
                                  ? new Date(stop.date).toLocaleDateString()
                                  : "No date"}
                              </p>

                              {stop.venue && (
                                <p className="mt-1 text-sm text-slate-400">
                                  {stop.venue}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      to="/apply"
                      className="rounded-full bg-red-700 px-7 py-3 font-black text-white shadow-lg hover:bg-red-800"
                    >
                      Apply Now
                    </Link>

                    <Link
                      to="/contact"
                      className="rounded-full border border-white/40 px-7 py-3 font-black text-white hover:bg-white hover:text-black"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-red-900/40 bg-white/5 shadow-2xl">
                  {featuredFlyer.image ? (
                    <button
                      type="button"
                      onClick={() => setSelectedFlyer(featuredFlyer)}
                      className="block w-full cursor-zoom-in"
                    >
                      <img
                        src={featuredFlyer.image}
                        alt={featuredFlyer.title}
                        className="h-[420px] w-full object-contain bg-slate-100"
                      />
                    </button>
                  ) : (
                    <div className="flex h-[420px] items-center justify-center bg-slate-900">
                      <p className="font-bold text-slate-400">
                        No flyer image added
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* FLYERS GRID */}
          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-black text-white">
                  Latest Flyers
                </h2>
                <p className="mt-2 text-slate-300">
                  View upcoming opportunities, showcases, tours, and special
                  announcements.
                </p>
              </div>

              <div className="rounded-full border border-red-900/40 bg-white/5 px-5 py-2 text-sm font-bold text-white shadow">
                {flyers.length} Active Flyers
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {flyers.map((flyer) => (
                <article
                  key={flyer._id}
                  className="group overflow-hidden rounded-3xl border border-red-900/30 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden bg-black">
                    {flyer.image ? (
                      <button
                        type="button"
                        onClick={() => setSelectedFlyer(flyer)}
                        className="block w-full cursor-zoom-in"
                      >
                        <img
                          src={flyer.image}
                          alt={flyer.title}
                          className="h-96 w-full object-contain bg-slate-100 transition duration-500 group-hover:scale-105"
                        />
                      </button>
                    ) : (
                      <div className="flex h-96 items-center justify-center bg-slate-900">
                        <p className="font-bold text-slate-400">
                          No flyer image
                        </p>
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-red-700 px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                      {flyer.type}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-transparent p-5">
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
                        The QueensMen Event
                      </p>
                    </div>
                  </div>

                  <div className="p-6 text-black">
                    <h3 className="text-2xl font-black text-slate-950">
                      {flyer.title}
                    </h3>

                    <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-600">
                      {flyer.date && (
                        <p>
                          <span className="font-black text-red-700">Date:</span>{" "}
                          {new Date(flyer.date).toLocaleDateString()}
                        </p>
                      )}

                      {flyer.location && (
                        <p>
                          <span className="font-black text-red-700">
                            Location:
                          </span>{" "}
                          {flyer.location}
                        </p>
                      )}
                    </div>

                    {flyer.tourDates && flyer.tourDates.length > 0 && (
                      <div className="mt-4 rounded-2xl bg-slate-100 p-4">
                        <p className="text-xs font-black uppercase tracking-widest text-red-700">
                          Tour Dates
                        </p>

                        <div className="mt-3 grid gap-3">
                          {flyer.tourDates.map((stop, index) => (
                            <div
                              key={`${stop.city}-${stop.date}-${index}`}
                              className="rounded-xl bg-white p-3"
                            >
                              <p className="font-black text-slate-950">
                                {stop.city || "City not listed"} —{" "}
                                {stop.date
                                  ? new Date(stop.date).toLocaleDateString()
                                  : "No date"}
                              </p>

                              {stop.venue && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {stop.venue}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {flyer.description}
                    </p>

                    <div className="mt-6 flex gap-3">
                      <Link
                        to="/apply"
                        className="flex-1 rounded-full border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-900 hover:border-red-700 hover:text-red-700"
                      >
                        Apply
                      </Link>

                      <Link
                        to="/contact"
                        className="flex-1 rounded-full bg-red-700 px-4 py-3 text-center text-sm font-bold text-white hover:bg-red-800"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="border-t border-red-900/40 bg-black">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="font-bold uppercase tracking-[0.25em] text-red-600">
            Stay Connected
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Don’t miss the next QueensMen opportunity.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Follow upcoming casting calls, fashion showcases, brand events,
            tours, and professional model opportunities.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/apply"
              className="rounded-full bg-red-700 px-8 py-4 font-black text-white shadow-lg hover:bg-red-800"
            >
              Apply to Model
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

      {selectedFlyer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 py-6">
          <button
            type="button"
            onClick={() => setSelectedFlyer(null)}
            className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-black text-black hover:bg-red-700 hover:text-white"
          >
            Close
          </button>

          <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white p-4 shadow-2xl">
            <img
              src={selectedFlyer.image}
              alt={selectedFlyer.title}
              className="mx-auto max-h-[82vh] w-full object-contain"
            />

            <div className="mt-4 text-black">
              <h2 className="text-2xl font-black text-slate-950">
                {selectedFlyer.title}
              </h2>

              <p className="mt-1 text-sm font-bold text-red-700">
                {selectedFlyer.type}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
