// SitterProfile.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function SitterProfile({ sitters }) {
  const { id } = useParams();
  const sitter = sitters.find((s) => s.id.toString() === id);

  const currentUserId = localStorage.getItem("userId"); // Assume this is set on login/registration

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    bio: sitter?.bio || '',
    pricing: sitter?.pricing || '',
    availability: sitter?.availability || ["2025-06-01", "2025-06-02", "2025-06-05"]
  });

  if (!sitter) return <p>Sitter not found.</p>;

  const tileDisabled = ({ date }) =>
    !form.availability.includes(date.toISOString().split("T")[0]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // This would send data to your backend
    console.log("Saving updated sitter profile:", form);
    // Simulate update to sitter object (in-memory only)
    sitter.bio = form.bio;
    sitter.pricing = form.pricing;
    sitter.availability = form.availability;
    setIsEditing(false);
  };

  const handleDateChange = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    let updatedAvailability;

    if (form.availability.includes(dateStr)) {
      // Remove the date
      updatedAvailability = form.availability.filter(d => d !== dateStr);
    } else {
      // Add the date
      updatedAvailability = [...form.availability, dateStr];
    }

    setForm({ ...form, availability: updatedAvailability });
  };

  return (
    <div>
      <h2>{sitter.name}</h2>
      <p><strong>Experience:</strong> {sitter.experience}</p>
      <p><strong>Services:</strong> {sitter.services}</p>
      <p><strong>Email:</strong> {sitter.email}</p>
      <p><strong>Phone:</strong> {sitter.phone}</p>

      {isEditing ? (
        <>
          <h3>Edit Profile</h3>
          <textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
          />
          <input
            name="pricing"
            placeholder="Pricing (e.g. $25/day)"
            value={form.pricing}
            onChange={handleChange}
          />
        </>
      ) : (
        <>
          <p><strong>Bio:</strong> {sitter.bio || "No bio yet."}</p>
          <p><strong>Pricing:</strong> {sitter.pricing || "Not set"}</p>
        </>
      )}

      <h3>Availability</h3>
      <Calendar
        onClickDay={(date) => isEditing && handleDateChange(date)}
        tileDisabled={({ date }) =>
          !form.availability.includes(date.toISOString().split("T")[0])
        }
      />
      <p>
        {isEditing
          ? "Click dates to toggle availability"
          : "Available dates are highlighted"}
      </p>

      {currentUserId === id && (
        <div style={{ marginTop: '1rem' }}>
          {isEditing ? (
            <button onClick={handleSave}>Save Profile</button>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit My Profile</button>
          )}
        </div>
      )}
    </div>
  );
}

export default SitterProfile;
