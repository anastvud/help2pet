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

  if (loading) return <div className="sitter-page"><p>Loading sitter…</p></div>;
  if (error) return <div className="sitter-page"><p className="error">{error}</p></div>;
  if (!sitter) return <div className="sitter-page"><p>Sitter not found.</p></div>;

  const handleBookNow = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="sitter-page">
      <div className="sitter-card-detail">
        {sitter.image && (
          <img
            src={sitter.image}
            alt={`${sitter.name} ${sitter.surname}`}
            className="sitter-photo"
          />
        )}

        <div className="sitter-info">
          <h2>{sitter.name} {sitter.surname}</h2>
          <ul>
            <li><strong>Location:</strong> {sitter.zipcode} - {sitter.area}</li>
            <li><strong>Gender:</strong> {sitter.gender ? "Woman" : "Man"}</li>
            <li><strong>Price/hr:</strong> {sitter.price_hour} PLN</li>
            <li><strong>Experience:</strong> {sitter.experience}</li>
            <li><strong>Smoker:</strong> {sitter.smoker ? "Yes" : "No"}</li>
            <li><strong>Drives:</strong> {sitter.drives ? "Yes" : "No"}</li>
            <li><strong>Pets:</strong> {sitter.pets ? "Yes" : "No"}</li>
            <li><strong>Languages:</strong> {sitter.languages}</li>
          </ul>

          <button onClick={handleBookNow} className="book-now-button">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default SitterDetails;
