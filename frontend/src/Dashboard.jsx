import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   fetch("http://127.0.0.1:8001/sitters")     // ⬅️ GET all sitters
     .then(res => res.json())
     .then(data => setSitters(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading sitters…</p>;

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
             <img src={sitter.image} alt={sitter.name} />
             <h3>{sitter.name}</h3>
             <p>⭐ {sitter.rating ?? "New"}</p>
           </Link>
         ))}
       </div>
     </div>
   );
 }

export default Dashboard;
