import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SitterDetails.css";

function SitterDetails() {
  const { id } = useParams();
  const [sitter, setSitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSitter() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:8000/petsitters/${id}`);
        if (!res.ok) throw new Error(`Error fetching sitter: ${res.statusText}`);
        const data = await res.json();
        setSitter(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSitter();
  }, [id]);

  if (loading) return <p>Loading sitter…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!sitter) return <p>Sitter not found.</p>;

  return (
    <div className="sitter-details-container">
      <h2>{sitter.first_name} {sitter.last_name}</h2>

      {sitter.image && (
        <img
          src={sitter.image}
          alt={`${sitter.first_name} ${sitter.last_name}`}
        />
      )}

      <p><strong>Email:</strong> {sitter.email}</p>
      <p><strong>Phone:</strong> {sitter.phone}</p>
      <p><strong>Zipcode:</strong> {sitter.zipcode}</p>
      <p><strong>Area:</strong> {sitter.area}</p>
      <p><strong>Price/hour:</strong> ${sitter.price_hour}</p>
      <p><strong>Rating:</strong> ⭐ {sitter.rating ?? "New"}</p>
      <p><strong>Experience:</strong> {sitter.experience}</p>
      <p><strong>Services:</strong> {sitter.services}</p>
      <p><strong>Bio:</strong> {sitter.bio}</p>

      {sitter.availability && sitter.availability.length > 0 && (
        <>
          <h3>Availability Dates</h3>
          <ul>
            {sitter.availability.map((date) => (
              <li key={date}>{date}</li>
            ))}
          </ul>
        </>
      )}

      {sitter.reviews && sitter.reviews.length > 0 && (
        <>
          <h3>Reviews</h3>
          <ul>
            {sitter.reviews.map((review, idx) => (
              <li key={idx}>{review}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default SitterDetails;
