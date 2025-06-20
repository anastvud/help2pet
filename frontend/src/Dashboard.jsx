import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import "./Dashboard.css";

function Dashboard() {
  const [sitters, setSitters] = useState([]);
  const [filteredSitters, setFilteredSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
      .then(data => {
        setSitters(data);
        setFilteredSitters(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  // Update filtered sitters when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSitters(sitters);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredSitters(
        sitters.filter(sitter =>
          sitter.zipcode?.toLowerCase().includes(term) ||
          sitter.area?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, sitters]);

  if (loading) return <p>Loading sitters…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Available Pet Sitters Near You</h2>
      <input
        type="text"
        placeholder="Search by Zip code or Area"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "0.5rem",
          marginBottom: "1rem",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "1rem"
        }}
      />
      <div className="dashboard">
        {filteredSitters.length > 0 ? (
          filteredSitters.map((sitter) => (
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
          ))
        ) : (
          <p>No sitters found in this area.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
