import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NgoDashBoard.css";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;
export default function NgoDashBoard() {
    const [userData, setUserData] = useState({});
    const [foodItems, setFoodItems] = useState([]);
    const [claimedItems, setClaimedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showClaimedItems, setShowClaimedItems] = useState(false);
    const navigate = useNavigate();

    // Function to fetch food items
    const fetchFoodItems = async () => {
        try {
            console.log("Fetching food items..."); // Add this for debugging
            const result = await axios.get(`${API_URL}/info/donor/availableOrders`, {
                withCredentials: true,
            });
            console.log("Fetched food items:", result.data); // Add this to inspect the API response
            if (result.data && result.data.data) {
                const filteredItems = result.data.data.filter(item => item.assignedNgo?._id === userData._id);
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
            const result = await axios.get(`${API_URL}/info/test`, {
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
                `${API_URL}/info/donor/claim/${foodId}`,
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
    const fetchClaimedItems = async () => {
        try {
            const result = await axios.get(`${API_URL}/info/donor/food`, {
                withCredentials: true,
            });
            if (result.data && result.data.data) {
                const filteredItems = result.data.data.filter(item => item.assignedNgo?.username === userData.username);
                setClaimedItems(filteredItems);
                if (!showClaimedItems) {
                    setFoodItems([]);
                } else {
                    fetchFoodItems();
                }
                setShowClaimedItems(!showClaimedItems);
            } else {
                toast.error("No claimed food items found.");
            }
        } catch (err) {
            toast.error("Failed to fetch claimed food items. Please try again.");
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
            <div className="user-info">
                <h2> {userData.username}</h2>
                
            </div>
            <button className="fetch" onClick={fetchClaimedItems}>View Claimed Items</button>
             <br></br>
            <div className="view">
            

            {showClaimedItems &&claimedItems.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Donor Username</th>
                            <th>Donor Contact</th>
                            <th>Food Name</th>
                            <th>Quantity</th>
                            <th>NGO</th>
                       
                        </tr>
                    </thead>
                    <tbody>
                        {claimedItems.map((item) => (
                            <tr key={item._id}>
                                <td>{item.donor?.username}</td>
                                <td>{item.donor?.contact}</td>
                                <td>{item.foodName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.assignedNgo?.username}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            </div>
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
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Donor Username:</strong> {item.donor?.username}</p>
                            <p><strong>Donor Contact:</strong> {item.donor?.contact}</p>
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
