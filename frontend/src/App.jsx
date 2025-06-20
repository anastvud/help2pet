import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';      
import Register from './Register'; 
import Dashboard from './Dashboard';
import SitterProfile from './SitterProfile';
import MyPets from './CompleteOwner.jsx';
import SitterDetails from './SitterDetails';
import Home from "./Home";
import './App.css';
import CompleteOwner from "./CompleteOwner.jsx";
import CompleteSitter from "./CompleteSitter.jsx";
import Booking from "./Booking.jsx";
import PetsitterBookings from "./PetsitterBookings.jsx";

function Welcome() {
  return (
    <div className="welcome-container">
      <h1 className="title">help2pet</h1>
      <div className="button-group">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>


      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-owner" element={<CompleteOwner />} />
        <Route path="/complete-sitter" element={<CompleteSitter />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sitter-details/:id" element={<SitterDetails />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/my-bookings" element={<PetsitterBookings />} />


        <Route path="/sitter/:id" element={<SitterProfile />} />
        <Route path="/my-pets" element={<MyPets />} />

        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
