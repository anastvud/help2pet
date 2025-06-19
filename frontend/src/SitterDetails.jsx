import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SitterDetails.css";

function SitterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleBookNow = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="sitter-details-container">
      <h2>{sitter.name} {sitter.surname}</h2>

      {sitter.image && (
        <img
          src={sitter.image}
          alt={`${sitter.name} ${sitter.surname}`}
        />
      )}

      <p><strong>Zipcode:</strong> {sitter.zipcode}</p>
      <p><strong>Area:</strong> {sitter.area}</p>
      <p><strong>Gender:</strong> {sitter.gender}</p>
      <p><strong>Profession:</strong> {sitter.profession}</p>
      <p><strong>Date of Birth:</strong> {sitter.date_of_birth}</p>
      <p><strong>Price per hour:</strong> ${sitter.price_hour}</p>
      <p><strong>Experience:</strong> {sitter.experience}</p>
      <p><strong>Smoker:</strong> {sitter.smoker ? "Yes" : "No"}</p>
      <p><strong>Drives:</strong> {sitter.drives ? "Yes" : "No"}</p>
      <p><strong>Pets:</strong> {sitter.pets}</p>
      <p><strong>Languages:</strong> {sitter.languages}</p>
      <p><strong>Email:</strong> {sitter.email}</p>
      <p><strong>Phone Number:</strong> {sitter.phone_number}</p>

      <button onClick={handleBookNow} className="book-now-button">
        Book Now
      </button>
    </div>
  );
}

export default SitterDetails;
