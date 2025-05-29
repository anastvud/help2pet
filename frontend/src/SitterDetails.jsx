import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./SitterDetails.css";
import useSitter from "./useSitter";

function SitterDetails() {
  const { id } = useParams();

   const { sitter, loading, error } = useSitter(id);

 if (loading) return <p>Loading sitter…</p>;
 if (error)   return <p style={{color:"red"}}>{error}</p>;

  const [selectedDates, setSelectedDates] = useState([]);
  const [petDetails, setPetDetails] = useState({ name: "", type: "", notes: "" });

  if (!sitter) return <p>Sitter not found.</p>;

  const tileDisabled = ({ date }) =>
    !sitter.availability.includes(date.toISOString().split("T")[0]);

  const handleDateChange = (range) => {
    const [start, end] = Array.isArray(range) ? range : [range, range];
    let dates = [];
    let current = new Date(start);
    while (current <= end) {
      const iso = current.toISOString().split("T")[0];
      if (sitter.availability.includes(iso)) dates.push(iso);
      current.setDate(current.getDate() + 1);
    }
    setSelectedDates(dates);
  };

  const handleBookingSubmit = () => {
    console.log("Booking Details:", {
      sitterId: sitter.id,
      dates: selectedDates,
      petDetails,
    });
    alert("Booking confirmed! A confirmation email has been sent.");
    // Simulate backend submission here
  };

  return (
    <div className="sitter-details-container">
      <h2>{sitter.name}</h2>
      <img src={sitter.image} alt={sitter.name} />
      <p><strong>Rating:</strong> ⭐ {sitter.rating}</p>
      <p><strong>Email:</strong> {sitter.email}</p>
      <p><strong>Phone:</strong> {sitter.phone}</p>
      <p><strong>Experience:</strong> {sitter.experience}</p>
      <p><strong>Services:</strong> {sitter.services}</p>
      <p><strong>Bio:</strong> {sitter.bio}</p>
      <p><strong>Pricing:</strong> {sitter.pricing}</p>

      <h3>Availability</h3>
      <Calendar
        selectRange
        onChange={handleDateChange}
        tileDisabled={tileDisabled}
      />
      {selectedDates.length > 0 && (
        <p>Selected dates: {selectedDates.join(", ")}</p>
      )}

      <h3>Book Now</h3>
      <form onSubmit={(e) => { e.preventDefault(); handleBookingSubmit(); }}>
        <input
          type="text"
          placeholder="Pet Name"
          value={petDetails.name}
          onChange={(e) => setPetDetails({ ...petDetails, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Pet Type (e.g. Dog)"
          value={petDetails.type}
          onChange={(e) => setPetDetails({ ...petDetails, type: e.target.value })}
          required
        />
        <textarea
          placeholder="Additional Notes"
          value={petDetails.notes}
          onChange={(e) => setPetDetails({ ...petDetails, notes: e.target.value })}
        />
        <button type="submit">Confirm Booking</button>
      </form>

      <h3>Reviews</h3>
      <ul>
        {sitter.reviews.map((review, idx) => <li key={idx}>{review}</li>)}
      </ul>
    </div>
  );
}

export default SitterDetails;
