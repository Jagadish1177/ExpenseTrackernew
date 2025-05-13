// src/components/Home.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8080/api/expenses')
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);

        // Calculate totals
        const currentMonth = new Date().getMonth();
        let total = 0;
        let monthly = 0;

        data.forEach((expense) => {
          total += expense.amount;
          const expMonth = new Date(expense.expenseDate).getMonth();
          if (expMonth === currentMonth) monthly += expense.amount;
        });

        setTotal(total);
        setMonthlyTotal(monthly);
      })
      .catch((err) => console.error('Failed to fetch expenses:', err));
  }, []);

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))
    .slice(0, 5);

  return (
    <>
    <header>
        <h1>Expense Tracker Dashboard</h1>
    </header>
    <main className="main">
      

      <section className="summary">
        <div className="card">
          <h2>Total Expenses</h2>
          <p>₹{total}</p>
        </div>
        <div className="card">
          <h2>This Month</h2>
          <p>₹{monthlyTotal}</p>
        </div>
      </section>

      <div className="actions">
        <Link to="/expenses" className="button">+ Add Expense</Link>
        <Link to="/categories" className="button">+ Add Category</Link>
      </div>

      <section className="recent-expenses">
        <h2>Recent Expenses</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{new Date(expense.expenseDate).toLocaleDateString()}</td>
                <td>{expense.categoryDto.name}</td>
                <td>₹{expense.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
    </>
  );
};

export default Home;
