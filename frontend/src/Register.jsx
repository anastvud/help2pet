import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './form.css';

function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    role: ''
  });

  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    username: form.username,
    password: form.password,
    name: form.name,
    surname: form.surname,
    email: form.email,
    phone_number: form.phone_number
  };

  const url =
    form.role === "sitter"
      ? "http://127.0.0.1:8001/register/petsitter"
      : "http://127.0.0.1:8001/register/owner";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("✅ " + data.message);

      const id = form.role === "sitter" ? data.petsitter_id : data.owner_id;
      localStorage.setItem("userId", id);

      // Navigate
      if (form.role === "sitter") {
        navigate(`/sitter/${id}`);
      } else {
        navigate("/my-pets");
      }

      setForm({
        username: '',
        password: '',
        name: '',
        surname: '',
        email: '',
        phone_number: '',
        role: ''
      });

    } else {
      setMessage("Error: " + (data.detail || "Registration failed"));
    }

  } catch (error) {
    console.error("Network error during registration:", error);
    setMessage("Network error");
  }
};


  return (
    <div className="form-container">
      <h2>Register</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={form.surname}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="owner">Pet Owner</option>
          <option value="sitter">Pet Sitter</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
