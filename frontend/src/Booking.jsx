import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const formatTime = (datetimeStr) => {
  return new Date(datetimeStr).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

function Booking() {
  const { id } = useParams(); // sitter_id
  const [timeslots, setTimeslots] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSlotId, setHoveredSlotId] = useState(null);

  const ownerId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchTimeslots() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/timeslots/${id}`);
        if (!res.ok) throw new Error("Failed to fetch timeslots");
        const data = await res.json();

        const unbooked = data.filter(slot => slot.is_booked === false);

        const grouped = {};
        unbooked.forEach(slot => {
          const dateKey = slot.start_time?.split("T")[0];
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(slot);
        });

        setTimeslots(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeslots();
  }, [id]);

  const bookNow = async (slot) => {
    try {
      const bookingData = {
        timeslot_id: slot.id,
        owner_id: ownerId,
        status: "confirmed", // or your default status if different
      };

      const res = await fetch(`http://127.0.0.1:8000/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create booking");
      }

      alert("Booking confirmed! Confirmation emails have been sent.");

      // Remove booked timeslot from list without full reload
      setTimeslots(prev => {
        const updated = { ...prev };
        updated[slot.start_time.split("T")[0]] = updated[slot.start_time.split("T")[0]].filter(s => s.id !== slot.id);
        if (updated[slot.start_time.split("T")[0]].length === 0) {
          delete updated[slot.start_time.split("T")[0]];
        }
        return updated;
      });

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading timeslots...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (Object.keys(timeslots).length === 0) return <p>No available timeslots found.</p>;

  return (
    <div className="booking-container">
      <h2>Available Timeslots</h2>
      <div className="timeslot-group">
        {Object.entries(timeslots).map(([date, slots]) => (
          <div key={date} className="timeslot-card">
            <h3>{formatDate(date)}</h3>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {slots.map((slot) => (
                <li
                  key={slot.id}
                  onMouseEnter={() => setHoveredSlotId(slot.id)}
                  onMouseLeave={() => setHoveredSlotId(null)}
                  style={{
                    backgroundColor: hoveredSlotId === slot.id ? "#e6f0ff" : "#f9f9f9",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    marginBottom: "0.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "background-color 0.3s"
                  }}
                >
                  <span>
                    {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                  </span>

                  {hoveredSlotId === slot.id && (
                    <button
                      onClick={() => bookNow(slot)}
                      style={{
                        padding: "0.3rem 0.6rem",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Book Now
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Booking;
