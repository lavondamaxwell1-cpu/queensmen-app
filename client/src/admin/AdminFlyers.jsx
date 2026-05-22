import { useEffect, useState } from "react";
import API from "../api/api";
import ImageUpload from "../components/ImageUpload";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminFlyers() {
  const [flyers, setFlyers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    location: "",
    tourDates: [],
    description: "",
    image: "",
    isActive: true,
  });

  const [tourStop, setTourStop] = useState({
    city: "",
    date: "",
    venue: "",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchFlyers = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/flyers/admin/all");

        if (!ignore) {
          setFlyers(data.flyers || []);
        }
      } catch (error) {
        console.error("Fetch admin flyers error:", error);

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

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      date: "",
      location: "",
      tourDates: [],
      description: "",
      image: "",
      isActive: true,
    });

    setTourStop({
      city: "",
      date: "",
      venue: "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTourStopChange = (e) => {
    const { name, value } = e.target;

    setTourStop((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTourStop = () => {
    if (!tourStop.city || !tourStop.date) {
      alert("Please add at least a city and date for the tour stop.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tourDates: [...prev.tourDates, tourStop],
    }));

    setTourStop({
      city: "",
      date: "",
      venue: "",
    });
  };

  const removeTourStop = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tourDates: prev.tourDates.filter((_, index) => index !== indexToRemove),
    }));
  };

  const startEdit = (flyer) => {
    setEditingId(flyer._id);

    setFormData({
      title: flyer.title || "",
      type: flyer.type || "",
      date: flyer.date ? flyer.date.slice(0, 10) : "",
      location: flyer.location || "",
      tourDates:
        flyer.tourDates?.map((stop) => ({
          city: stop.city || "",
          date: stop.date ? stop.date.slice(0, 10) : "",
          venue: stop.venue || "",
        })) || [],
      description: flyer.description || "",
      image: flyer.image || "",
      isActive: flyer.isActive ?? true,
    });

    setTourStop({
      city: "",
      date: "",
      venue: "",
    });

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
    setError("");
    setSuccess("");
  };

  const handleSubmitFlyer = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      if (editingId) {
        const { data } = await API.put(`/api/flyers/${editingId}`, formData);

        setFlyers((prev) =>
          prev.map((flyer) => (flyer._id === editingId ? data.flyer : flyer)),
        );

        setSuccess("Flyer updated successfully!");
        setEditingId(null);
      } else {
        const { data } = await API.post("/api/flyers", formData);

        setFlyers((prev) => [data.flyer, ...prev]);

        setSuccess("Flyer created successfully!");
      }

      resetForm();

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Submit flyer error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while saving the flyer.",
      );

      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (flyerId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this flyer?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(flyerId);

      await API.delete(`/api/flyers/${flyerId}`);

      setFlyers((prev) => prev.filter((flyer) => flyer._id !== flyerId));
    } catch (error) {
      console.error("Delete flyer error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while deleting the flyer.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-slate-50 px-6 py-16 text-black">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Flyers
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
                  Manage <span className="text-red-700">Flyers</span>
                </h1>

                <p className="mt-4 max-w-2xl text-slate-600">
                  Upload finished flyer designs, add casting calls, events,
                  announcements, and tour dates for multiple cities.
                </p>
              </div>

              <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-black text-slate-800 shadow-sm">
                {flyers.length} Total Flyers
              </div>
            </div>
          </section>

          <section className="grid gap-10 xl:grid-cols-[1fr_1.25fr]">
            {/* FORM */}
            <form
              onSubmit={handleSubmitFlyer}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 text-black shadow-xl"
            >
              <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                  {editingId ? "Editing Mode" : "Create Mode"}
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {editingId ? "Edit Flyer" : "Add New Flyer"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Upload a finished flyer image or paste an image URL. Use tour
                  dates for flyers with multiple cities or event stops.
                </p>
              </div>

              <div className="mt-6 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="QueensMen Casting Call"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Type *
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Casting Call, Fashion Event, Tour"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Single Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Single Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      placeholder="Charlotte, NC"
                    />
                  </div>
                </div>

                {/* TOUR DATES */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                    Tour / Multiple Dates
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Use this if the flyer is for a tour or multiple cities.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={tourStop.city}
                        onChange={handleTourStopChange}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                        placeholder="Charlotte, NC"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={tourStop.date}
                        onChange={handleTourStopChange}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Venue
                      </label>
                      <input
                        type="text"
                        name="venue"
                        value={tourStop.venue}
                        onChange={handleTourStopChange}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addTourStop}
                    className="mt-4 rounded-full bg-black px-5 py-3 text-sm font-black text-white hover:bg-red-700"
                  >
                    Add Tour Date
                  </button>

                  {formData.tourDates.length > 0 && (
                    <div className="mt-5 grid gap-3">
                      {formData.tourDates.map((stop, index) => (
                        <div
                          key={`${stop.city}-${stop.date}-${index}`}
                          className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center"
                        >
                          <div>
                            <p className="font-black text-slate-950">
                              {stop.city} —{" "}
                              {stop.date
                                ? new Date(stop.date).toLocaleDateString()
                                : "No date"}
                            </p>

                            <p className="text-sm font-semibold text-slate-500">
                              {stop.venue || "No venue added"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeTourStop(index)}
                            className="w-fit rounded-full border border-red-700 px-4 py-2 text-xs font-black text-red-700 hover:bg-red-700 hover:text-white"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* IMAGE */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                    Flyer Image
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Best format: PNG, JPG, JPEG, or WEBP. Finished flyer designs
                    will show fully without cropping.
                  </p>

                  <div className="mt-4 grid gap-4">
                    <ImageUpload
                      label="Upload Flyer Image"
                      onUpload={(imageUrl) =>
                        setFormData((prev) => ({
                          ...prev,
                          image: imageUrl,
                        }))
                      }
                    />

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                        placeholder="https://..."
                      />
                    </div>

                    {formData.image && (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <img
                          src={formData.image}
                          alt="Flyer preview"
                          className="h-96 w-full bg-slate-100 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-700"
                    placeholder="Describe the event, tour, casting call, or announcement..."
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    Active/Public
                  </label>
                </div>

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
                  disabled={creating}
                  className="rounded-full bg-red-700 px-6 py-4 font-black text-white shadow-lg hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                      ? "Update Flyer"
                      : "Create Flyer"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-full border border-slate-300 px-6 py-4 font-black text-slate-900 hover:border-black hover:bg-black hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* FLYERS LIST */}
            <section>
              {loading && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <p className="font-bold text-slate-600">Loading flyers...</p>
                </div>
              )}

              {!loading && flyers.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <h2 className="text-2xl font-black text-slate-950">
                    No flyers yet
                  </h2>

                  <p className="mt-3 text-slate-600">
                    Add the first flyer using the form.
                  </p>
                </div>
              )}

              {!loading && flyers.length > 0 && (
                <div className="grid gap-6">
                  {flyers.map((flyer) => (
                    <article
                      key={flyer._id}
                      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-black shadow-xl"
                    >
                      {flyer.image ? (
                        <img
                          src={flyer.image}
                          alt={flyer.title}
                          className="h-[500px] w-full bg-slate-100 object-contain"
                        />
                      ) : (
                        <div className="flex h-[500px] items-center justify-center bg-slate-100">
                          <p className="font-bold text-slate-500">
                            No image added
                          </p>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
                              {flyer.isActive ? "Active" : "Hidden"} •{" "}
                              {flyer.type}
                            </p>

                            <h2 className="mt-2 text-3xl font-black text-slate-950">
                              {flyer.title}
                            </h2>

                            <p className="mt-2 text-sm font-semibold text-slate-500">
                              {flyer.date
                                ? new Date(flyer.date).toLocaleDateString()
                                : "No single date"}
                              {flyer.location ? ` • ${flyer.location}` : ""}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => startEdit(flyer)}
                              className="rounded-full bg-black px-5 py-3 text-sm font-black text-white hover:bg-red-700"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled={deletingId === flyer._id}
                              onClick={() => handleDelete(flyer._id)}
                              className="rounded-full border border-red-700 px-5 py-3 text-sm font-black text-red-700 hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === flyer._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>

                        {flyer.tourDates && flyer.tourDates.length > 0 && (
                          <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            <p className="text-xs font-black uppercase tracking-widest text-red-700">
                              Tour Dates
                            </p>

                            <div className="mt-3 grid gap-3">
                              {flyer.tourDates.map((stop, index) => (
                                <div
                                  key={`${stop.city}-${stop.date}-${index}`}
                                  className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                                >
                                  <p className="font-black text-slate-950">
                                    {stop.city || "City not listed"} —{" "}
                                    {stop.date
                                      ? new Date(stop.date).toLocaleDateString()
                                      : "No date"}
                                  </p>

                                  {stop.venue && (
                                    <p className="mt-1 text-sm font-semibold text-slate-500">
                                      {stop.venue}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="mt-5 leading-7 text-slate-600">
                          {flyer.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
