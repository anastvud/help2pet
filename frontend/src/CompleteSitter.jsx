import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CompleteSitter() {
  const [sitterForm, setSitterForm] = useState({
    zipcode: '',
    area: '',
    gender: '', // boolean true/false
    profession: '',
    date_of_birth: '',
    price_hour: '',
    experience: '',
    smoker: false,
    drives: false,
    pets: false,
    languages: '',
  });

  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const petsitterId = localStorage.getItem('userId');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSitterForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGenderChange = (e) => {
    setSitterForm((prev) => ({ ...prev, gender: e.target.value === 'true' }));
  };

  const isFormComplete = () => {
    const {
      zipcode,
      area,
      gender,
      profession,
      date_of_birth,
      price_hour,
      experience,
      languages,
    } = sitterForm;

    return (
      zipcode.trim() !== '' &&
      area.trim() !== '' &&
      typeof gender === 'boolean' &&
      profession.trim() !== '' &&
      date_of_birth.trim() !== '' &&
      price_hour.trim() !== '' &&
      !isNaN(parseInt(price_hour, 10)) &&
      experience.trim() !== '' &&
      languages.trim() !== ''
    );
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      setMessage('Please complete all fields before submitting.');
      return;
    }

    const price = parseInt(sitterForm.price_hour, 10);
    const payload = {
      ...sitterForm,
      price_hour: price,
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/register/petsitter/${petsitterId}/complete`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage('OK: ' + response.data.message);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error(error);
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="complete-sitter-form">
      <h2>Complete Your Profile</h2>
      {message && <p className="message">{message}</p>}

      <input
        name="zipcode"
        placeholder="Zipcode"
        value={sitterForm.zipcode}
        onChange={handleChange}
      />
      <input
        name="area"
        placeholder="Area"
        value={sitterForm.area}
        onChange={handleChange}
      />

      <div>
        <label>Gender: </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="true"
            checked={sitterForm.gender === true}
            onChange={handleGenderChange}
          />{' '}
          Female
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="false"
            checked={sitterForm.gender === false}
            onChange={handleGenderChange}
          />{' '}
          Male
        </label>
      </div>

      <input
        name="profession"
        placeholder="Profession"
        value={sitterForm.profession}
        onChange={handleChange}
      />
      <input
        name="date_of_birth"
        type="date"
        placeholder="Date of Birth"
        value={sitterForm.date_of_birth}
        onChange={handleChange}
      />
      <input
        name="price_hour"
        placeholder="Price per hour"
        value={sitterForm.price_hour}
        onChange={handleChange}
      />
      <input
        name="experience"
        placeholder="Experience"
        value={sitterForm.experience}
        onChange={handleChange}
      />
      <input
        name="languages"
        placeholder="Languages"
        value={sitterForm.languages}
        onChange={handleChange}
      />

      <label>
        <input
          name="smoker"
          type="checkbox"
          checked={sitterForm.smoker}
          onChange={handleChange}
        />{' '}
        Smoker
      </label>

      <label>
        <input
          name="drives"
          type="checkbox"
          checked={sitterForm.drives}
          onChange={handleChange}
        />{' '}
        Drives
      </label>

      <label>
        <input
          name="pets"
          type="checkbox"
          checked={sitterForm.pets}
          onChange={handleChange}
        />{' '}
        Has pets
      </label>

      <button onClick={handleSubmit} disabled={!isFormComplete()}>
        Submit All Info
      </button>
    </div>
  );
}

export default CompleteSitter;
