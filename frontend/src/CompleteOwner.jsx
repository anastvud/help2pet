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

  const [petForm, setPetForm] = useState({
    name: '',
    breed: '',
    age: '',
    medical: '',
    diet: '',
    notes: '',
  });

  const [pets, setPets] = useState([]);
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

  const handlePetChange = (e) => {
    const { name, value } = e.target;
    setPetForm(prev => ({ ...prev, [name]: value }));
  };

  const addPet = () => {
    if (petForm.name.trim() !== '') {
      setPets([...pets, petForm]);
      setPetForm({
        name: '',
        breed: '',
        age: '',
        medical: '',
        diet: '',
        notes: '',
      });
    }
  };

  const handleSubmit = async () => {
    const petsString = pets
      .map(p =>
        `${p.name} (${p.breed}) - A: ${p.age}, M: ${p.medical}, D: ${p.diet}, N: ${p.notes}`
      )
      .join('; ');

    const payload = {
      ...ownerForm,
      pets: petsString,
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
      setTimeout(() => navigate('/dashboard'), 1500);
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

        <h3>Pet Info</h3>
        <input
          name="name"
          placeholder="Pet Name"
          value={petForm.name}
          onChange={handlePetChange}
        />
        <input
          name="breed"
          placeholder="Breed"
          value={petForm.breed}
          onChange={handlePetChange}
        />
        <input
          name="age"
          placeholder="Age"
          value={petForm.age}
          onChange={handlePetChange}
        />
        <input
          name="medical"
          placeholder="Medical Conditions"
          value={petForm.medical}
          onChange={handlePetChange}
        />
        <input
          name="diet"
          placeholder="Dietary Needs"
          value={petForm.diet}
          onChange={handlePetChange}
        />
        <textarea
          name="notes"
          placeholder="Special Instructions"
          value={petForm.notes}
          onChange={handlePetChange}
        />

        <button onClick={addPet}>Add Pet</button>

        <ul>
          {pets.map((pet, idx) => (
            <li key={idx}>
              {pet.name} ({pet.breed}) - Age: {pet.age}
            </li>
          ))}
        </ul>

        <button onClick={handleSubmit}>Submit All Info</button>
      </div>
    </div>
  );
}

export default CompleteOwner;
