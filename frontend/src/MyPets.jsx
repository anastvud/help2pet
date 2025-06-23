import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Update this if your backend uses a different URL

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
    <div>
      <h2>My Pets</h2>
      {pets.length === 0 ? (
        <p>No pets found.</p>
      ) : (
        <ul>
          {pets.map(pet => (
            <li key={pet.id}>
              <strong>{pet.name}</strong> ({pet.animal}) {pet.breed && <>- {pet.breed}</>}
              <button onClick={() => handleEditPet(pet)}>Edit</button>
              <button onClick={() => handleDeletePet(pet.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <h3>{editingPetId ? 'Update Pet' : 'Add New Pet'}</h3>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="breed" placeholder="Breed" value={form.breed} onChange={handleChange} />
      <input name="animal" placeholder="Animal" value={form.animal} onChange={handleChange} />
      {editingPetId ? (
        <button onClick={handleUpdatePet}>Update</button>
      ) : (
        <button onClick={handleAddPet}>Add</button>
      )}
    </div>
  );
};

export default MyPets;
