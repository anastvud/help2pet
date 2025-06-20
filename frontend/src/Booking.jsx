import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const [activeSlotId, setActiveSlotId] = useState(null); // for hover or click
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

      alert("Booking confirmed! Confirmation emails have been sent.");
      setPetDetails("");
      setActiveSlotId(null);
      window.location.reload();


      setTimeslots((prev) => {
        const updated = { ...prev };
        updated[slot.start_time.split("T")[0]] = updated[
          slot.start_time.split("T")[0]
        ].filter((s) => s.id !== slot.id);
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
  if (Object.keys(timeslots).length === 0)
    return <p>No available timeslots found.</p>;

  return (
    <div className="booking-container">
      <h2>Available Timeslots</h2>

      <div className="timeslot-group">
        {Object.entries(timeslots).map(([date, slots]) => (
          <div key={date} className="timeslot-card">
            <h3>{formatDate(date)}</h3>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {slots.map((slot) => {
                const isBooked = slot.is_booked;
                const isActive = activeSlotId === slot.id;

                return (
                  <li
                    key={slot.id}
                    onMouseEnter={() => setActiveSlotId(slot.id)}
                    onMouseLeave={() =>
                      activeSlotId !== slot.id && setActiveSlotId(null)
                    }
                    style={{
                      backgroundColor: isBooked
                        ? "#d3d3d3"
                        : isActive
                        ? "#e6f0ff"
                        : "#f9f9f9",
                      color: isBooked ? "#777" : "#000",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      marginBottom: "0.5rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3rem",
                      transition: "background-color 0.3s, color 0.3s",
                      cursor: isBooked ? "not-allowed" : "pointer",
                      userSelect: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        {formatTime(slot.start_time)} –{" "}
                        {formatTime(slot.end_time)}
                      </span>

                      {!isBooked && isActive && (
                        <button
                          onClick={() => bookNow(slot)}
                          style={{
                            padding: "0.3rem 0.6rem",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
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
                        style={{
                          width: "100%",
                          padding: "0.4rem",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                        }}
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
  );
}

export default Booking;
