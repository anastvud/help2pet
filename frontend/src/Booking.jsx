import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./form.css"; // ✅ Reuse shared styling

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

function Booking() {
  const { id } = useParams(); // sitter_id
  const [timeslots, setTimeslots] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [petDetails, setPetDetails] = useState("");
  const ownerId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchTimeslots() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/timeslots/${id}`);
        if (!res.ok) throw new Error("Failed to fetch timeslots");
        const data = await res.json();

        const grouped = {};
        data.forEach((slot) => {
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
        status: "confirmed",
        notes: petDetails,
      };

      const res = await fetch(`http://127.0.0.1:8000/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create booking");
      }

      setPetDetails("");
      setActiveSlotId(null);

      // Update state: mark this slot as booked (do NOT remove it)
      setTimeslots((prev) => {
        const updated = { ...prev };
        const dateKey = slot.start_time.split("T")[0];
        updated[dateKey] = updated[dateKey].map((s) =>
          s.id === slot.id ? { ...s, is_booked: true } : s
        );
        return updated;
      });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="form-page"><p>Loading timeslots...</p></div>;
  if (error) return <div className="form-page"><p style={{ color: "red" }}>{error}</p></div>;
  if (Object.keys(timeslots).length === 0)
    return <div className="form-page"><p>No available timeslots found.</p></div>;

  return (
    <div className="form-page">
      <div className="form-container">
        <h2>Available Timeslots</h2>

        <div className="dashboard">
          {Object.entries(timeslots)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .map(([date, slots]) => (
              <div key={date} className="sitter-card">
                <h3>{formatDate(date)}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {slots.map((slot) => {
                    const isBooked = slot.is_booked;
                    const isActive = activeSlotId === slot.id;

                    return (
                      <li
                        key={slot.id}
                        onMouseEnter={() => setActiveSlotId(slot.id)}
                        onMouseLeave={() => setActiveSlotId(null)}
                        style={{
                          backgroundColor: isBooked
                            ? "rgba(200,200,200,0.3)"
                            : isActive
                            ? "rgba(204, 255, 229, 0.4)"
                            : "rgba(255, 255, 255, 0.2)",
                          color: isBooked ? "#888" : "#2e5d32",
                          padding: "0.7rem",
                          borderRadius: "12px",
                          marginBottom: "0.7rem",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          backdropFilter: "blur(10px)",
                          transition: "background 0.3s, color 0.3s",
                          cursor: isBooked ? "not-allowed" : "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>
                            {formatTime(slot.start_time)} –{" "}
                            {formatTime(slot.end_time)}
                          </span>

                          {!isBooked && isActive && (
                            <button
                              onClick={() => bookNow(slot)}
                              className="form-button"
                              style={{ marginLeft: "1rem", marginTop: "0.5rem" }}
                            >
                              Book Now
                            </button>
                          )}
                        </div>

                        {!isBooked && isActive && (
                          <textarea
                            rows={2}
                            placeholder="Add pet details (name, age, needs...)"
                            value={petDetails}
                            onChange={(e) => setPetDetails(e.target.value)}
                            className="form-input"
                            style={{ resize: "none" }}
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Booking;
