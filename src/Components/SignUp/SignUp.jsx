import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css"
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    contact: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      role:""
    },
  });

  const { username, email, password, contact, address } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address")) {
      const addressField = name.split(".")[1]; // Extract address field
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
        const response = await axios.post(`/info/api/signup`, formData,{
          withCredentials: true,  
      });

        toast.success("Sign-up successful! Please log in.");
        setFormData({
            username:"",
            email: "",
            password: "",
            contact: "",
            address: {
              street: "",
              city: "",
              state: "",
              country: "",
               pinCode: "",
               role:""
            },
           })
          navigate("/")
      
    } catch (error) {
        console.log(err)
        toast.error("Error during sign-up. Please try again.");
    }
  };

  return (
    <div className="body-container">
      
      <form onSubmit={handleSubmit}>
      <h2 className="form-title">Sign Up</h2>
        <div className="form-container">
          <label className="label-text">Username</label>
          <br/>
          <input
            className="input-field" 
            type="text"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label-text">Email</label>
          <br/>
          <input
            className="input-field" 
            type="email"
            name="email"
            placeholder="Enter email address"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label-text">Password</label>
          <br/>
          <input
            className="input-field" 
            type="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label-text">Contact</label>
          <br/>
          <input
            className="input-field" 
            type="text"
            name="contact"
            placeholder="Enter contact"
            value={contact}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="label-text">Street</label>
          <br/>
          <input
           className="input-field" 
            type="text"
            name="address.street"
            placeholder="Enter street address"
            value={address.street}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label-text">City</label>
          <br/>
          <input
            className="input-field" 
            type="text"
            name="address.city"
            placeholder="Enter city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label-text">State</label>
          <br/>
          <input
            className="input-field" 
            type="text"
            name="address.state"
            placeholder="Enter state"
            value={address.state}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label-text">Country</label>
          <br/>
          <input
            className="input-field" 
            type="text"
            name="address.country"
            placeholder="Enter Country"
            value={address.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label-text">Postal Code</label>
          <br/>
          <input
            className="input-field" 
            type="text"
            name="address.pinCode"
            placeholder="Enter postal code"
            value={address.postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <select
          className="input-field"
          name="role"
          value={formData.role}
          onChange={(e) =>
          setFormData((prevState) => ({
            ...prevState,
           role: e.target.value,
        }))
        }
        required
        >
       <option value="">Select Role</option>
       <option value="Donor">Donor</option>
       <option value="NGO">NGO</option>
    </select>

        <button className="submit-button" type="submit">Sign Up</button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default SignUp;
