import React, { useState, useEffect } from "react";
import "./CustomerList.css";

const CustomerList = ({ onEdit, onActionComplete }) => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");  
  const [searchResult, setSearchResult] = useState(null); 

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Error loading customers.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSearch = async () => {
    if (!searchId) {
      setSearchResult(null); 
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/customers/${searchId}`);
      if (!response.ok) {
        setError("Customer not found");
        setSearchResult(null);
        return;
      }

      const data = await response.json();
      setSearchResult(data); 
      setError(null);
    } catch (err) {
      console.error("Error searching customer:", err);
      setError("Error searching customer.");
      setSearchResult(null);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/customers/${customerId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete customer");

      alert("Customer deleted successfully!");
      fetchCustomers(); 
      if (onActionComplete) onActionComplete(); 
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Error deleting customer.");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="customer-list-container">
      <h2>Customer List</h2>
      
      <div>
        <input
          type="text"
          placeholder="Search by Customer ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {searchResult ? (
        <div>
          <h3>Search Result:</h3>
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Date of Birth</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr key={searchResult.CustomerID}>
                <td>{searchResult.FullName}</td>
                <td>{searchResult.Email}</td>
                <td>{searchResult.PhoneNumber}</td>
                <td>{searchResult.DateOfBirth}</td>
                <td>{searchResult.Address}</td>
                <td>
                  <button onClick={() => onEdit(searchResult)}>Edit</button>
                  <button onClick={() => handleDelete(searchResult.CustomerID)}>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          {customers.length === 0 ? (
            <p>No customers found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Date of Birth</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.CustomerID}>
                    <td>{customer.FullName}</td>
                    <td>{customer.Email}</td>
                    <td>{customer.PhoneNumber}</td>
                    <td>{customer.DateOfBirth}</td>
                    <td>{customer.Address}</td>
                    <td>
                      <button onClick={() => onEdit(customer)}>Edit</button>
                      <button onClick={() => handleDelete(customer.CustomerID)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
