import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';       // ✅ Importing from external file
import Register from './Register'; // ✅ Importing from external file
import Dashboard from './Dashboard';
import SitterProfile from './SitterProfile';
import MyPets from './MyPets';
import SitterDetails from './SitterDetails';
import Home from "./Home";
import './App.css';

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sitter/:id" element={<SitterProfile />} />
        <Route path="/my-pets" element={<MyPets />} />
        <Route path="/sitter-details/:id" element={<SitterDetails />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
