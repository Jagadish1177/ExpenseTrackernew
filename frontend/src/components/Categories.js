import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const categoriesEndpoint = 'http://localhost:8080/api/categories';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch(categoriesEndpoint)
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.error("Failed to fetch categories:", err));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    fetch(categoriesEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory.trim() })
    })
      .then(fetchCategories)
      .catch(err => console.error("Failed to add category:", err));

    setNewCategory('');
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSave = (id) => {
    if (!editingName.trim()) return alert('Category name cannot be empty');

    fetch(`${categoriesEndpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName.trim() })
    })
      .then(() => {
        setEditingId(null);
        setEditingName('');
        fetchCategories();
      })
      .catch(err => console.error("Failed to update category:", err));
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    fetch(`${categoriesEndpoint}/${deleteId}`, {
      method: 'DELETE'
    })
      .then(() => {
        setShowModal(false);
        setDeleteId(null);
        fetchCategories();
      })
      .catch(err => console.error("Failed to delete category:", err));
  };

  return (
    <>
      <header><h1>Manage Categories</h1></header>
    <div className="main">
      <form className="card" onSubmit={handleAddCategory}>
        <input
          type="text"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />
        <button className="button" type="submit">Add Category</button>
      </form>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td>
                {editingId === cat.id ? (
                  <>
                    <button className="table-btn" onClick={() => handleSave(cat.id)}>Save</button>
                    <button className="table-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="table-btn" onClick={() => handleEdit(cat.id, cat.name)}>Edit</button>
                    <button className="table-btn" onClick={() => handleDelete(cat.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="back-button-container">
       <button onClick={() => navigate('/')}>⬅ Back to Dashboard</button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this category?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmDelete}>Delete</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>

  );
};

export default Categories;
