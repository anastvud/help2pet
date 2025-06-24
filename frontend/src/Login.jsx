import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './form.css';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('owner');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`http://localhost:8000/login/${role}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(`${data.message}`);
      if (data.user_id) {
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('role', role);
      }
      // Navigate based on role:
      if (role === 'petsitter') {
        navigate('/my-bookings');
      } else {
        navigate('/home');
      }
    } else {
      setMessage(data.detail || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    setMessage('Network error');
  }
};

  return (
    <div className="form-page">
      <div className="form-container">
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}

        <div className="role-select">
          <label>
            <input
              type="radio"
              name="role"
              value="owner"
              checked={role === 'owner'}
              onChange={handleRoleChange}
            />
            Owner
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="petsitter"
              checked={role === 'petsitter'}
              onChange={handleRoleChange}
            />
            Petsitter
          </label>
        </div>

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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
