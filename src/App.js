import React, { useState, useEffect } from "react";
import CustomerForm from "./Components/CustomerForm";
import CustomerList from "./Components/CustomerList";

function App() {
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");

      const data = await response.json();
      setCustomers(data); 
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleActionComplete = () => {
    fetchCustomers();
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="App">
      <h1>Customer Management</h1>
      <CustomerForm
        editingCustomer={editingCustomer}
        onActionComplete={handleActionComplete} 
      />
      <CustomerList
        customers={customers}
        onEdit={handleEdit}
        onActionComplete={handleActionComplete} 
      />
    </div>
  );
}

export default App;
