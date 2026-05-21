import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Models() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/models");

        setModels(data.models || []);
      } catch (error) {
        console.error("Fetch models error:", error);

        setError(
          error.response?.data?.message ||
            "Something went wrong while loading models.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return (
    <main className="bg-black text-white">
      {/* PAGE HEADER */}
      <section className="border-b border-red-900/40 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-bold uppercase tracking-[0.25em] text-red-600">
            Talent Roster
          </p>

          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-5xl font-black md:text-6xl">
                Meet <span className="text-red-700">The QueensMen</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Browse professional male models available for runway,
                commercial, promotional, luxury brand, photoshoot, and event
                work.
              </p>
            </div>

            <Link
              to="/book"
              className="w-fit rounded-full bg-red-700 px-7 py-3 font-bold text-white shadow hover:bg-red-800"
            >
              Book Talent
            </Link>
          </div>
        </div>
      </section>

      {/* MODELS GRID */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black text-white">Featured Talent</h2>
            <p className="mt-2 text-slate-300">
              Select a model to view more details or request a booking.
            </p>
          </div>

          <div className="rounded-full border border-red-900/40 bg-white/5 px-5 py-2 text-sm font-bold text-white shadow">
            {models.length} Models Available
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
            <p className="font-bold text-slate-300">Loading models...</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && models.length === 0 && (
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 text-center">
            <h2 className="text-2xl font-black text-white">
              No models added yet
            </h2>
            <p className="mt-3 text-slate-300">
              Once the owner adds model profiles from the admin dashboard, they
              will show here.
            </p>
          </div>
        )}

        {!loading && !error && models.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <article
                key={model._id}
                className="group overflow-hidden rounded-3xl border border-red-900/30 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden bg-black">
                  {model.image ? (
                    <img
                      src={model.image}
                      alt={model.name}
                      className="h-[430px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-[430px] items-center justify-center bg-slate-900">
                      <p className="font-bold text-slate-400">No image added</p>
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-red-700 px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                    {model.category}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-5">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
                      QueensMen Talent
                    </p>
                  </div>
                </div>

                <div className="p-6 text-black">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-950">
                        {model.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-red-700">
                        {model.location}
                      </p>
                    </div>

                    {model.height && (
                      <div className="rounded-2xl bg-black px-3 py-2 text-sm font-bold text-white">
                        {model.height}
                      </div>
                    )}
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {model.bio}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/models/${model._id}`}
                      className="flex-1 rounded-full border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-900 hover:border-red-700 hover:text-red-700"
                    >
                      View Profile
                    </Link>

                    <Link
                      to="/book"
                      className="flex-1 rounded-full bg-red-700 px-4 py-3 text-center text-sm font-bold text-white hover:bg-red-800"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-red-900/40 bg-black">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="font-bold uppercase tracking-[0.25em] text-red-600">
            Need Talent?
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Bring The QueensMen to your next event.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Submit a booking request and tell us what type of models, event,
            style, and presence you need.
          </p>

          <Link
            to="/book"
            className="mt-8 inline-flex rounded-full bg-red-700 px-8 py-4 font-black text-white shadow-lg hover:bg-red-800"
          >
            Request Booking
          </Link>
        </div>
      </section>
    </main>
  );
}
