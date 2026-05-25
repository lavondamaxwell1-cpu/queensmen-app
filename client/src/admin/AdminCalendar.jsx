import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AdminCalendar() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [calendarView, setCalendarView] = useState("week");
const [calendarDate, setCalendarDate] = useState(new Date());
  useEffect(() => {
    let ignore = false;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/api/bookings");

        if (!ignore) {
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error("Fetch calendar bookings error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Something went wrong while loading the calendar."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      ignore = true;
    };
  }, []);

 const getDurationHours = (duration) => {
   if (!duration) return 1;

   if (duration === "1 Hour") return 1;
   if (duration === "2 Hours") return 2;
   if (duration === "3 Hours") return 3;
   if (duration === "4 Hours") return 4;
   if (duration === "Half Day") return 4;
   if (duration === "Full Day") return 8;

   return 1;
 };

 const buildBookingDateTime = (eventDate, eventTime) => {
   const date = new Date(eventDate);

   if (!eventTime) {
     date.setHours(9, 0, 0, 0);
     return date;
   }

   const [hours, minutes] = eventTime.split(":");

   date.setHours(Number(hours || 9), Number(minutes || 0), 0, 0);

   return date;
 };

 const calendarEvents = useMemo(() => {
   return bookings
     .filter((booking) => booking.eventDate)
     .filter((booking) => booking.status === "Approved")
     .map((booking) => {
       const start = buildBookingDateTime(booking.eventDate, booking.eventTime);

       const end = new Date(start);
       end.setHours(end.getHours() + getDurationHours(booking.eventDuration));

       return {
         id: booking._id,
         title: `${booking.eventTime || ""} • ${booking.eventType || "Booking"}`,
         start,
         end,
         resource: booking,
       };
     });
 }, [bookings]);
  const upcomingBookings = useMemo(() => {
    const now = new Date();

   return bookings
     .filter((booking) => booking.eventDate)
     .filter((booking) => booking.status === "Approved")
     .filter((booking) => new Date(booking.eventDate) >= now)
     .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
     .slice(0, 8);
  }, [bookings]);
const eventStyleGetter = (event) => {
  const status = event.resource?.status || "Pending";

  let backgroundColor = "#b91c1c";

  if (status === "Approved") backgroundColor = "#16a34a";
  if (status === "Declined") backgroundColor = "#dc2626";
  if (status === "Completed") backgroundColor = "#2563eb";
  if (status === "Canceled") backgroundColor = "#6b7280";

  return {
    style: {
      backgroundColor,
      borderRadius: "999px",
      border: "none",
      color: "white",
      fontWeight: "700",
      padding: "2px 8px",
    },
  };
};
  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen overflow-x-hidden bg-slate-50 px-4 py-10 text-black md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
            <p className="font-bold uppercase tracking-[0.25em] text-red-700">
              Admin Calendar
            </p>

            <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl">
              Booking <span className="text-red-700">Schedule</span>
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Approved bookings appear on the calendar. Upcoming requests are
              listed on the side so you can review what is coming next.
            </p>
          </section>

          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="font-bold text-slate-600">Loading calendar...</p>
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-bold">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <section className="grid gap-8 xl:grid-cols-[1.6fr_0.9fr]">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl md:p-6">
                <div className="h-[650px]">
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={eventStyleGetter}
                    views={["month", "week", "day", "agenda"]}
                    view={calendarView}
                    date={calendarDate}
                    onView={(view) => setCalendarView(view)}
                    onNavigate={(date) => setCalendarDate(date)}
                    step={30}
                    timeslots={2}
                    min={new Date(1970, 1, 1, 8, 0)}
                    max={new Date(1970, 1, 1, 23, 0)}
                    onSelectEvent={(event) =>
                      setSelectedBooking(event.resource)
                    }
                    popup
                  />
                  
                </div>
              </div>

              <aside className="grid gap-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
                  <h2 className="text-2xl font-black text-slate-950">
                    Upcoming Bookings
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    Next scheduled event dates.
                  </p>

                  <div className="mt-5 grid gap-4">
                    {upcomingBookings.length === 0 ? (
                      <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                        No upcoming bookings yet.
                      </p>
                    ) : (
                      upcomingBookings.map((booking) => (
                        <button
                          key={booking._id}
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-2xl bg-slate-50 p-4 text-left ring-1 ring-slate-200 hover:ring-red-200"
                        >
                          <p className="text-sm font-black text-red-700">
                            {booking.eventDate
                              ? new Date(booking.eventDate).toLocaleDateString()
                              : "No date"}
                          </p>

                          <h3 className="mt-1 font-black text-slate-950">
                            {booking.fullName}
                          </h3>

                          <p className="mt-1 text-sm font-semibold text-slate-600">
                            {booking.eventType || "Booking"}
                          </p>

                          <span className="mt-3 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                            {booking.status || "Pending"}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {selectedBooking && (
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
                    <p className="text-xs font-black uppercase tracking-widest text-red-700">
                      Selected Booking
                    </p>

                    <h2 className="mt-3 text-2xl font-black text-slate-950">
                      {selectedBooking.fullName}
                    </h2>

                    <div className="mt-5 grid gap-3 text-sm">
                      <p>
                        <span className="font-black text-slate-950">
                          Event:
                        </span>{" "}
                        {selectedBooking.eventType || "Not provided"}
                      </p>

                      <p>
                        <span className="font-black text-slate-950">Date:</span>{" "}
                        {selectedBooking.eventDate
                          ? new Date(
                              selectedBooking.eventDate,
                            ).toLocaleDateString()
                          : "Not provided"}
                      </p>
                      <p>
                        <span className="font-black text-slate-950">Time:</span>{" "}
                        {selectedBooking.eventTime || "Not provided"}
                      </p>

                      <p>
                        <span className="font-black text-slate-950">
                          Duration:
                        </span>{" "}
                        {selectedBooking.eventDuration || "Not provided"}
                      </p>
                      <p>
                        <span className="font-black text-slate-950">
                          Status:
                        </span>{" "}
                        {selectedBooking.status || "Pending"}
                      </p>

                      <p>
                        <span className="font-black text-slate-950">
                          Email:
                        </span>{" "}
                        {selectedBooking.email || "Not provided"}
                      </p>

                      <p>
                        <span className="font-black text-slate-950">
                          Phone:
                        </span>{" "}
                        {selectedBooking.phone || "Not provided"}
                      </p>

                      <p>
                        <span className="font-black text-slate-950">
                          Location:
                        </span>{" "}
                        {selectedBooking.location || "Not provided"}
                      </p>
                    </div>
                    {selectedBooking.assignedModels?.length > 0 && (
                      <div className="mt-4">
                        <p className="font-black text-slate-950">
                          Assigned Models:
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedBooking.assignedModels.map((model) => (
                            <span
                              key={model._id}
                              className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700 ring-1 ring-red-200"
                            >
                              {model.name || model.fullName || "Model"}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </aside>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
