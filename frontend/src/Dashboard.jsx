import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/petsitters/nearby?user_id=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch sitters");
        return res.json();
      })
      .then(data => setSitters(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>Loading sitters…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Available Pet Sitters Near You</h2>
      <div className="dashboard">
        {sitters.map((sitter) => (
          <Link
            to={`/sitter-details/${sitter.id}`}
            key={sitter.id}
            className="sitter-card"
          >
            <h3>{sitter.name} {sitter.surname}</h3>
            <p>📍 {sitter.zipcode} - {sitter.area}</p>
            <p>💰 {sitter.price_hour} PLN/hr</p>
            <p>⭐ {sitter.rating ?? "New"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}


export default Dashboard;
