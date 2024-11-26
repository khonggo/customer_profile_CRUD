import React, { useState, useEffect } from "react";
import "./CustomerForm.css";

const CustomerForm = ({ editingCustomer, onActionComplete }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingCustomer) {
      setFullName(editingCustomer.FullName || "");
      setEmail(editingCustomer.Email || "");
      setPhoneNumber(editingCustomer.PhoneNumber || "");
      setDateOfBirth(editingCustomer.DateOfBirth || "");
      setAddress(editingCustomer.Address || "");
    }
  }, [editingCustomer]);

  const validateForm = () => {
    if (!fullName || fullName.length < 5 || fullName.length > 100) {
      setError("Full Name must be between 5 and 100 characters.");
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!phoneNumber || !/^\d{10,15}$/.test(phoneNumber)) {
      setError("Phone Number must be between 10 and 15 digits.");
      return false;
    }
    if (!dateOfBirth || isNaN(new Date(dateOfBirth).getTime())) {
      setError("Please enter a valid Date of Birth.");
      return false;
    }
    if (address && address.length > 255) {
      setError("Address cannot exceed 255 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const customerData = { fullName, email, phoneNumber, dateOfBirth, address };

    try {
      const method = editingCustomer ? "PUT" : "POST";
      const url = editingCustomer
        ? `http://localhost:5000/api/customers/${editingCustomer.CustomerID}`
        : "http://localhost:5000/api/customers";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An unknown error occurred.");
        return;
      }

      alert(editingCustomer ? "Customer updated successfully!" : "Customer created successfully!");

      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setDateOfBirth("");
      setAddress("");

      onActionComplete();
      window.location.reload();
    } catch (err) {
      console.error("Error during submission:", err);
      setError("An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{editingCustomer ? "Edit Customer" : "Create Customer"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            maxLength="255"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : editingCustomer ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
