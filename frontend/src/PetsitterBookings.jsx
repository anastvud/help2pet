import React, { useEffect, useState } from "react";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (datetimeStr) => {
  return new Date(datetimeStr).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

function PetsitterBookings() {
  const sitterId = localStorage.getItem("userId");
  const [timeslots, setTimeslots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchTimeslots = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/timeslots/${sitterId}`);
      if (!res.ok) throw new Error("Failed to fetch timeslots");
      const data = await res.json();
      setTimeslots(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBookingsWithOwners = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/bookings/sitter/${sitterId}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setError(null);
      await Promise.all([fetchTimeslots(), fetchBookingsWithOwners()]);
      setLoading(false);
    }
    if (sitterId) loadAll();
    else {
      setError("No sitter ID found");
      setLoading(false);
    }
  }, [sitterId]);

  const handleCreateTimeslot = async (e) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      alert("Please fill out both start and end times.");
      return;
    }

    const timeslotData = {
      sitter_id: Number(sitterId),
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/timeslots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timeslotData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create timeslot");
      }

      alert("Timeslot created!");
      setStartTime("");
      setEndTime("");
      setShowForm(false);
      fetchTimeslots();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Group bookings by date
  const groupedBookings = bookings.reduce((acc, booking) => {
    const dateKey = booking.start_time.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(booking);
    return acc;
  }, {});

  // Group free timeslots by date
  const groupedFreeSlots = timeslots
    .filter((slot) => !slot.is_booked)
    .reduce((acc, slot) => {
      const dateKey = slot.start_time.split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(slot);
      return acc;
    }, {});

  // Sort dates ascending for both
  const sortedBookingDates = Object.keys(groupedBookings).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const sortedFreeDates = Object.keys(groupedFreeSlots).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="form-page">
      <div className="form-container">
        <h2>My Timeslots</h2>

        <button onClick={() => setShowForm((prev) => !prev)} className="form-button">
          {showForm ? "Cancel" : "+ Create New Timeslot"}
        </button>

        {showForm && (
          <form onSubmit={handleCreateTimeslot} style={{ marginTop: "10px" }}>
            <label className="label">
              Start Time:
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </label>
            <label className="label">
              End Time:
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="form-button">
              Create
            </button>
          </form>
        )}

        <section className="timeslots-section">
          <h3>Free Timeslots</h3>
          {sortedFreeDates.length === 0 ? (
            <p>No free timeslots.</p>
          ) : (
            sortedFreeDates.map((date) => (
              <div key={date} className="booking-day-group">
                <h4 className="booking-date">{formatDate(date)}</h4>
                <ul className="booking-list">
                  {groupedFreeSlots[date].map((slot) => (
                    <li key={slot.id} className="booking-item free">
                      <span className="booking-time">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </span>
                      <span className="booking-owner free-label">Free</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>

        <section className="bookings-section" style={{ marginTop: "2rem" }}>
          <h3>Booked Timeslots</h3>
          {sortedBookingDates.length === 0 ? (
            <p>No booked timeslots.</p>
          ) : (
            sortedBookingDates.map((date) => (
              <div key={date} className="booking-day-group">
                <h4 className="booking-date">{formatDate(date)}</h4>
                <ul className="booking-list">
                  {groupedBookings[date].map((booking) => (
                    <li key={booking.booking_id} className="booking-item booked">
                      <span className="booking-time">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </span>
                      <span className="booking-owner">
                        Owner: {booking.owner.name} {booking.owner.surname}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default PetsitterBookings;
