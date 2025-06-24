import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Adjust if needed

const MyPets = () => {
  const [ownerId, setOwnerId] = useState(null);
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: '', breed: '', animal: '' });
  const [editingPetId, setEditingPetId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      alert('You must be logged in.');
      return;
    }
    setOwnerId(parseInt(storedId));
  }, []);

  useEffect(() => {
    if (ownerId) {
      fetchPets();
    }
  }, [ownerId]);

  const fetchPets = async () => {
    try {
      const res = await axios.get(`${API_URL}/pets/${ownerId}`);
      setPets(res.data);
    } catch (error) {
      console.error('Failed to fetch pets', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPet = async () => {
    const petData = {
      name: form.name,
      breed: form.breed,
      animal: form.animal,
      owner_id: ownerId,
    };

    try {
      const res = await fetch(`${API_URL}/pets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to add pet');
      }

      setForm({ name: '', breed: '', animal: '' });
      fetchPets();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeletePet = async (id) => {
    try {
      await axios.delete(`${API_URL}/pets/${id}`);
      fetchPets();
    } catch (error) {
      alert('Failed to delete pet');
    }
  };

  const handleEditPet = (pet) => {
    setEditingPetId(pet.id);
    setForm({ name: pet.name, breed: pet.breed || '', animal: pet.animal });
  };

  const handleUpdatePet = async () => {
    try {
      await axios.put(`${API_URL}/pets/${editingPetId}`, form);
      setEditingPetId(null);
      setForm({ name: '', breed: '', animal: '' });
      fetchPets();
    } catch (error) {
      alert('Failed to update pet');
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2>My Pets</h2>

        {pets.length === 0 ? (
          <p className="message">No pets found.</p>
        ) : (
          <ul style={{ paddingLeft: '20px', fontSize: '20px' }}>
            {pets.map(pet => (
              <li key={pet.id} style={{ marginBottom: '8px' }}>
                <strong>{pet.name}</strong> ({pet.animal}) {pet.breed && <>- {pet.breed}</>}
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button onClick={() => handleEditPet(pet)}>Edit</button>
                  <button onClick={() => handleDeletePet(pet.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '22px' }}>
          {editingPetId ? 'Update Pet' : 'Add New Pet'}
        </h3>

        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="breed"
            placeholder="Breed"
            value={form.breed}
            onChange={handleChange}
          />
          <input
            name="animal"
            placeholder="Animal"
            value={form.animal}
            onChange={handleChange}
          />
          {editingPetId ? (
            <button onClick={handleUpdatePet}>Update</button>
          ) : (
            <button onClick={handleAddPet}>Add</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MyPets;
