import React, { useEffect, useState } from "react";
import "./DonorForm.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function DonorForm() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [ngos, setNgos] = useState([]);
    const [FoodDetails, setFoodDetails] = useState({
        foodName: "",
        quantity: "",
        assignedNgo: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            pinCode: "",
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get("http://localhost:8080/test", { withCredentials: true });
                if (!data.data || !data.data._id) return navigate("/login");
                setUserData(data.data);
            } catch (error) {
                console.error("User fetch error:", error);
                navigate("/login");
            }
        };

        const fetchNgos = async () => {
            try {
                const { data } = await axios.get("http://localhost:8080/api/ngos");
                setNgos(data.data);
            } catch (error) {
                console.error("NGO fetch error:", error);
            }
        };

        fetchUserData();
        fetchNgos();
    }, [navigate]);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setFoodDetails((prev) => ({
                ...prev,
                address: { ...prev.address, [addressField]: value },
            }));
        } else {
            setFoodDetails((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!FoodDetails.assignedNgo) return toast.error("Please select an NGO.");

        try {
            const payload = { ...FoodDetails, donor: userData._id };

            await axios.post("http://localhost:8080/donor/add", payload, { withCredentials: true });
            toast.success("Food Listed Successfully!", { autoClose: 2000 });

            navigate(`/donor/${userData._id}`);
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Food listing failed. Try again.");
        }
    };

    return (
        <div className="DonorForm">
            <form onSubmit={handleSubmit}>
                <h2>List Food</h2>

                <label>Food Name</label>
                <input
                    type="text"
                    name="foodName"
                    placeholder="Enter Food Name"
                    value={FoodDetails.foodName}
                    onChange={onChangeHandler}
                    required
                />

                <label>Quantity</label>
                <input
                    type="text"
                    name="quantity"
                    placeholder="e.g., 2kg, 5 packets"
                    value={FoodDetails.quantity}
                    onChange={onChangeHandler}
                    required
                />

                <label>Select NGO</label>
                <select
                    name="assignedNgo"
                    value={FoodDetails.assignedNgo}
                    onChange={onChangeHandler}
                    required
                >
                    <option value="">-- Select NGO --</option>
                    {ngos.map((ngo) => (
                        <option key={ngo._id} value={ngo._id}>{ngo.username}</option>
                    ))}
                </select>

                <div className="addressDetails">
                    {Object.entries(FoodDetails.address).map(([field, value]) => (
                        <div key={field}>
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type="text"
                                name={`address.${field}`}
                                placeholder={field}
                                value={value}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>
                    ))}
                </div>

                <button type="submit">List Food</button>
            </form>
            <ToastContainer />
        </div>
    );
}
