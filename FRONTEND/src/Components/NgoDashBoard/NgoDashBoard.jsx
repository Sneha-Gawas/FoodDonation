import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NgoDashBoard.css";
import { useNavigate } from "react-router-dom";

export default function NgoDashBoard() {
    const [userData, setUserData] = useState({});
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to fetch food items
    const fetchFoodItems = async () => {
        try {
            console.log("Fetching food items..."); // Add this for debugging
            const result = await axios.get("http://localhost:8080/donor/availableOrders", {
                withCredentials: true,
            });
            console.log("Fetched food items:", result.data); // Add this to inspect the API response
            if (result.data && result.data.data) {
                setFoodItems(result.data.data);  // Update state only if data exists
            } else {
                toast.error("No food items found.");
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching food items:", err); // Detailed logging
            toast.error("Failed to fetch available food items. Please try again.");
            setLoading(false);
        }
    };

    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const result = await axios.get("http://localhost:8080/test", {
                withCredentials: true,
            });
            console.log("Fetched user data:", result.data); // Inspect user data response
            if (result.data.success) {
                setUserData(result.data.data);
            } else {
                toast.error("User not authenticated. Redirecting to login.");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error fetching user data:", error); // Detailed logging
            toast.error("Failed to fetch user data. Redirecting to login.");
            navigate("/login");
        }
    };

    // Function to claim food
    const claimFood = async (foodId) => {
        try {
            console.log("Claiming food item:", foodId);
            const result = await axios.post(
                `http://localhost:8080/donor/claim/${foodId}`,
                {},
                {
                    withCredentials: true,
                }
            );
            toast.success("Food item claimed successfully!");
            // Re-fetch food items after claiming
            fetchFoodItems();
        } catch (err) {
            console.error("Error claiming food:", err);
            if (err.response && err.response.status === 401) {
                toast.error("Please log in to access this page.");
                navigate("/login");
            } else {
                toast.error("Food truck not found or failed to fetch data.");
            }
        }
    };

    // Fetch food items and user data on component mount
    useEffect(() => {
        fetchFoodItems();
        fetchUserData();  // Fetch user data after component mount
    }, []);

    return (
        <div className="NGODashboard">
            <h1>NGO Dashboard</h1>
            <ToastContainer />
            {loading ? (
                <p>Loading available food items...</p>
            ) : foodItems.length === 0 ? (
                <p>No food items available to claim.</p>
            ) : (
                <div className="food-items">
                    {foodItems.map((item) => (
                        <div key={item._id} className="food-item-card">
                            <h3>{item.foodName}</h3>
                            
                            <p><strong>Organization:</strong> {item.assignedNgo}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <div className="address">
                                <p><strong>Street:</strong> {item.address?.street}</p>
                                <p><strong>City:</strong> {item.address?.city}</p>
                                <p><strong>State:</strong> {item.address?.state}</p>
                                <p><strong>Country:</strong> {item.address?.country}</p>
                                <p><strong>Pin Code:</strong> {item.address?.pinCode}</p>
                            </div>
                            <button
                                className="claim-button"
                                onClick={() => claimFood(item._id)}
                            >
                                Claim Food
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
