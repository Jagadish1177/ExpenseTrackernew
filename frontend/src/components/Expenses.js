// src/components/Expenses.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ amount: '', expenseDate: '', categoryId: '' });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_BASE}/expenses`);
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error('Failed to load expenses', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: formData.amount,
          expenseDate: formData.expenseDate,
          categoryDto: { id: formData.categoryId },
        }),
      });
      setFormData({ amount: '', expenseDate: '', categoryId: '' });
      fetchExpenses();
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleEditClick = (expense) => {
    setEditId(expense.id);
    setEditData({
      amount: expense.amount,
      expenseDate: expense.expenseDate,
      categoryId: expense.categoryDto?.id || '',
    });
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveExpense = async (id) => {
    try {
      await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: editData.amount,
          expenseDate: editData.expenseDate,
          categoryDto: { id: editData.categoryId },
        }),
      });
      setEditId(null);
      fetchExpenses();
    } catch (err) {
      console.error('Error saving expense:', err);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`${API_BASE}/expenses/${deleteId}`, { method: 'DELETE' });
      setShowModal(false);
      setDeleteId(null);
      fetchExpenses();
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  return (
    <>
      <header><h1>Manage Expenses</h1></header>
    <div className="main">

      <form className="card" onSubmit={handleAddExpense}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleFormChange}
          required
        />
        <input
          type="date"
          name="expenseDate"
          value={formData.expenseDate}
          onChange={handleFormChange}
          required
        />
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleFormChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button className="button" type="submit">Add Expense</button>
      </form>

      <table border="1">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              {editId === exp.id ? (
                <>
                  <td><input type="number" name="amount" value={editData.amount} onChange={handleEditChange} /></td>
                  <td><input type="date" name="expenseDate" value={editData.expenseDate} onChange={handleEditChange} /></td>
                  <td>
                    <select name="categoryId" value={editData.categoryId} onChange={handleEditChange}>
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="table-btn" onClick={() => handleSaveExpense(exp.id)}>Save</button>
                    <button className="table-btn" onClick={() => setEditId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{exp.amount}</td>
                  <td>{new Date(exp.expenseDate).toISOString().split('T')[0]}</td>
                  <td>{exp.categoryDto?.name}</td>
                  <td>
                    <button className="table-btn" onClick={() => handleEditClick(exp)}>Edit</button>
                    <button className="table-btn" onClick={() => handleDeleteClick(exp.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="back-button-container">
        <button onClick={() => navigate('/')}>⬅ Back to Dashboard</button>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this item?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmDelete}>Delete</button>
              <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>

  );
};

export default Expenses;
