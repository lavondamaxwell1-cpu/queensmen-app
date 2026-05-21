import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";

export default function ModelDetails() {
  const { id } = useParams();

  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchModel = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get(`/api/models/${id}`);

        if (!ignore) {
          setModel(data.model);
        }
      } catch (error) {
        console.error("Fetch model details error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading this model profile.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchModel();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-bold text-slate-300">Loading model profile...</p>
        </div>
      </main>
    );
  }

  if (error || !model) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-black">Model Not Found</h1>

          <p className="mt-4 text-slate-300">
            {error || "This model profile does not exist."}
          </p>

          <Link
            to="/models"
            className="mt-8 inline-flex rounded-full bg-red-700 px-7 py-3 font-black text-white hover:bg-red-800"
          >
            Back to Models
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-black text-white">
      {/* HEADER */}
      <section className="border-b border-red-900/40 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Link
            to="/models"
            className="font-bold text-red-600 hover:text-red-500"
          >
            ← Back to Models
          </Link>

          <p className="mt-8 font-bold uppercase tracking-[0.25em] text-red-600">
            QueensMen Profile
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-7xl">{model.name}</h1>

          <p className="mt-4 text-xl font-semibold text-slate-300">
            {model.category}
          </p>
        </div>
      </section>

      {/* PROFILE */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.1fr]">
        <div className="overflow-hidden rounded-[2rem] border border-red-900/40 bg-white/5 shadow-2xl">
          {model.image ? (
            <img
              src={model.image}
              alt={model.name}
              className="h-[520px] w-full object-contain bg-slate-100"
            />
          ) : (
            <div className="flex h-[650px] items-center justify-center bg-slate-900">
              <p className="font-bold text-slate-400">No image added</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="rounded-3xl border border-red-900/40 bg-white/5 p-8 shadow-2xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-600">
              Model Details
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              Classy. Vintage. Bold.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">{model.bio}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-black p-5">
                <p className="text-sm font-bold uppercase tracking-widest text-red-600">
                  Location
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {model.location}
                </p>
              </div>

              <div className="rounded-2xl bg-black p-5">
                <p className="text-sm font-bold uppercase tracking-widest text-red-600">
                  Height
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {model.height || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-black p-5">
                <p className="text-sm font-bold uppercase tracking-widest text-red-600">
                  Experience
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {model.experience || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-black p-5">
                <p className="text-sm font-bold uppercase tracking-widest text-red-600">
                  Category
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {model.category}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border-l-4 border-red-700 bg-black p-5">
              <p className="text-sm font-bold uppercase tracking-widest text-red-600">
                Available For
              </p>

              <p className="mt-2 leading-7 text-slate-300">
                {model.availability ||
                  "Booking details available upon request."}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/book"
                className="rounded-full bg-red-700 px-8 py-4 font-black text-white shadow-lg hover:bg-red-800"
              >
                Book This Model
              </Link>

              <Link
                to="/contact"
                className="rounded-full border border-white/40 px-8 py-4 font-black text-white hover:bg-white hover:text-black"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="border-t border-red-900/40 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-bold uppercase tracking-[0.25em] text-red-600">
            Portfolio
          </p>

          <h2 className="mt-3 text-4xl font-black">Portfolio Images</h2>

          {model.portfolioImages && model.portfolioImages.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {model.portfolioImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-3xl border border-red-900/40 bg-white/5"
                >
                  <img
                    src={image}
                    alt={`${model.name} portfolio ${index + 1}`}
                    className="h-80 w-full object-contain bg-slate-100"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-red-900/50 bg-white/5 p-8 text-center">
              <h3 className="text-2xl font-black text-white">
                More Photos Coming Soon
              </h3>

              <p className="mt-3 text-slate-300">
                Later, the admin dashboard will allow the owner to upload
                multiple portfolio images for each model.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
