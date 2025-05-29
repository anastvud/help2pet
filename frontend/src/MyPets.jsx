// MyPets.jsx
import React, { useState } from 'react';

function MyPets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    name: '', breed: '', age: '', medical: '', diet: '', notes: ''
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const addPet = () => {
    setPets([...pets, form]);
    setForm({ name: '', breed: '', age: '', medical: '', diet: '', notes: '' });
  };

  return (
    <div>
      <h2>My Pets</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="breed" placeholder="Breed" value={form.breed} onChange={handleChange} />
      <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
      <input name="medical" placeholder="Medical Conditions" value={form.medical} onChange={handleChange} />
      <input name="diet" placeholder="Dietary Needs" value={form.diet} onChange={handleChange} />
      <textarea name="notes" placeholder="Special Instructions" value={form.notes} onChange={handleChange} />
      <button onClick={addPet}>Add Pet</button>

      <ul>
        {pets.map((pet, idx) => (
          <li key={idx}>
            {pet.name} ({pet.breed}) - Age: {pet.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyPets;
