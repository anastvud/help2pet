// import React, { useEffect, useState } from "react";
//
// const formatDateTime = (datetimeStr) => {
//   const date = new Date(datetimeStr);
//   return date.toLocaleString(undefined, {
//     weekday: "short",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });
// };
//
// function PetsitterBookings() {
//   const sitterId = localStorage.getItem("userId");
//   const [timeslots, setTimeslots] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//
//   const [showForm, setShowForm] = useState(false);
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//
//   const fetchTimeslots = async () => {
//     try {
//       const res = await fetch(`http://127.0.0.1:8000/timeslots/${sitterId}`);
//       if (!res.ok) throw new Error("Failed to fetch timeslots");
//       const data = await res.json();
//       setTimeslots(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };
//
//   const fetchBookingsWithOwners = async () => {
//     try {
//       const res = await fetch(`http://127.0.0.1:8000/bookings/sitter/${sitterId}`);
//       if (!res.ok) throw new Error("Failed to fetch bookings");
//       const data = await res.json();
//       setBookings(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//
//   useEffect(() => {
//     async function loadAll() {
//       setLoading(true);
//       await fetchTimeslots();
//       await fetchBookingsWithOwners();
//       setLoading(false);
//     }
//     loadAll();
//   }, [sitterId]);
//
//   const handleCreateNewTimeslot = async (e) => {
//     e.preventDefault();
//
//     try {
//       const timeslotData = {
//         sitter_id: Number(sitterId),
//         start_time: new Date(startTime).toISOString(),
//         end_time: new Date(endTime).toISOString(),
//       };
//
//       const res = await fetch("http://127.0.0.1:8000/timeslots", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(timeslotData),
//       });
//
//       if (!res.ok) throw new Error("Failed to create timeslot");
//
//       await res.json();
//       alert("Timeslot created!");
//       setStartTime("");
//       setEndTime("");
//       setShowForm(false);
//       fetchTimeslots();
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     }
//   };
//
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;
//
//   return (
//     <div className="petsitter-bookings" style={{ padding: "1rem" }}>
//       <h2>My Timeslots</h2>
//
//       <button
//         onClick={() => setShowForm((prev) => !prev)}
//         style={{ marginBottom: "1rem", padding: "0.5rem" }}
//       >
//         {showForm ? "Cancel" : "+ Create New Timeslot"}
//       </button>
//
//       {showForm && (
//         <form onSubmit={handleCreateNewTimeslot} style={{ marginBottom: "1rem" }}>
//           <label>
//             Start Time:
//             <input
//               type="datetime-local"
//               value={startTime}
//               onChange={(e) => setStartTime(e.target.value)}
//               required
//             />
//           </label>
//           <label style={{ marginLeft: "1rem" }}>
//             End Time:
//             <input
//               type="datetime-local"
//               value={endTime}
//               onChange={(e) => setEndTime(e.target.value)}
//               required
//             />
//           </label>
//           <button type="submit" style={{ marginLeft: "1rem" }}>
//             Create
//           </button>
//         </form>
//       )}
//
//       <div style={{ marginBottom: "2rem" }}>
//         <h3>Free Timeslots</h3>
//         {timeslots.filter((s) => !s.is_booked).length === 0 ? (
//           <p>No free timeslots.</p>
//         ) : (
//           <ul>
//             {timeslots
//               .filter((slot) => !slot.is_booked)
//               .map((slot) => (
//                 <li key={slot.id}>
//                   {formatDateTime(slot.start_time)} – {formatDateTime(slot.end_time)}
//                 </li>
//               ))}
//           </ul>
//         )}
//       </div>
//
//       <div>
//         <h3>Booked Timeslots</h3>
//         {bookings.length === 0 ? (
//           <p>No booked timeslots.</p>
//         ) : (
//           <ul>
//             {bookings.map((booking) => (
//               <li key={booking.booking_id}>
//                 {formatDateTime(booking.start_time)} – {formatDateTime(booking.end_time)}
//                 <br />
//                 <strong>Owner:</strong> {booking.owner.name} {booking.owner.surname}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
//
// export default PetsitterBookings;


import React, { useEffect, useState } from "react";

const formatDateTime = (datetimeStr) => {
  const date = new Date(datetimeStr);
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
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
      console.error(err);
    }
  };

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      await fetchTimeslots();
      await fetchBookingsWithOwners();
      setLoading(false);
    }
    loadAll();
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="petsitter-bookings" style={{ padding: "1rem" }}>
      <h2>My Timeslots</h2>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      >
        {showForm ? "Cancel" : "+ Create New Timeslot"}
      </button>

      {showForm && (
        <form onSubmit={handleCreateTimeslot} style={{ marginBottom: "1rem" }}>
          <label>
            Start Time:
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label style={{ marginLeft: "1rem" }}>
            End Time:
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
          <button type="submit" style={{ marginLeft: "1rem" }}>
            Create
          </button>
        </form>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h3>Free Timeslots</h3>
        {timeslots.filter((s) => !s.is_booked).length === 0 ? (
          <p>No free timeslots.</p>
        ) : (
          <ul>
            {timeslots
              .filter((slot) => !slot.is_booked)
              .map((slot) => (
                <li key={slot.id}>
                  {formatDateTime(slot.start_time)} – {formatDateTime(slot.end_time)}
                </li>
              ))}
          </ul>
        )}
      </div>

      <div>
        <h3>Booked Timeslots</h3>
        {bookings.length === 0 ? (
          <p>No booked timeslots.</p>
        ) : (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.booking_id}>
                {formatDateTime(booking.start_time)} – {formatDateTime(booking.end_time)}
                <br />
                <strong>Owner:</strong> {booking.owner.name} {booking.owner.surname}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PetsitterBookings;
