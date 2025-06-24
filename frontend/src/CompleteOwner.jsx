import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './form.css'; // ✅ reuse the same styles as your other forms

function CompleteOwner() {
  const [ownerForm, setOwnerForm] = useState({
    zipcode: '',
    area: '',
    gender: '', // true or false (boolean)
  });

  const [message, setMessage] = useState(null);

  const ownerId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e) => {
    setOwnerForm(prev => ({ ...prev, gender: e.target.value === 'true' }));
  };

  const handleSubmit = async () => {
    const payload = {
      zipcode: ownerForm.zipcode,
      area: ownerForm.area,
      gender: ownerForm.gender,
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/register/owner/${ownerId}/complete`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setMessage('Profile updated: ' + response.data.message);
      setTimeout(() => navigate('/home'), 1500);
    } catch (error) {
      console.error(error);
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2>Complete Your Profile</h2>
        {message && <p className="message">{message}</p>}

        <input
          name="zipcode"
          placeholder="Zipcode"
          value={ownerForm.zipcode}
          onChange={handleOwnerChange}
        />
        <input
          name="area"
          placeholder="Area"
          value={ownerForm.area}
          onChange={handleOwnerChange}
        />

        <div>
          <label>Gender: </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="true"
              checked={ownerForm.gender === true}
              onChange={handleGenderChange}
            /> Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="false"
              checked={ownerForm.gender === false}
              onChange={handleGenderChange}
            /> Male
          </label>
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default CompleteOwner;
