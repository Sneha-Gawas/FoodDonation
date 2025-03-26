import React from "react";
import "./Navbar.css"
import { useNavigate ,useLocation} from "react-router-dom";
import { useState,useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Navbar(){
    const location = useLocation();
    const navigate = useNavigate();
    const [login,setLogin] = useState(false)
    const[userData,setUserData]= useState({})
    const [isLoading, setIsLoading] = useState(true);  


    const checkLoginStatus = async () => {
        try {
            const result = await axios.get("http://localhost:8080/test", {
                withCredentials: true, 
            });
            if (result.data.data) {
                console.log(result.data.data)
                setLogin(true);
                setUserData(result.data.data); 
            } else {
                setLogin(false); 
            }
        } catch (err) {
            console.error("Error checking login status:", err.message);
            setLogin(false);
        } finally {
            setIsLoading(false); 
        }
    };

    useEffect(() => {
        checkLoginStatus();
        console.log("User Data is : ", userData);
    }, [location]);
    
    const handleDonationClaim = async()=>{
        if (userData.role === "Donor") {
            console.log("Navigating to donor dashboard");
            navigate(`/donor/${userData._id}`);
          } else if (userData.role === "NGO") {
            console.log("Navigating to NGO dashboard");
            navigate(`/ngo/${userData._id}`);
          } else {
            console.log("Userdata",userData)
            console.log("User role not recognized");
          }
    }
    const handleLogout = async () => {
        try {
            const result = await axios.get("http://localhost:8080/api/logout",{
                withCredentials: true,  
            });
            setLogin(false)
            console.log(result)
            toast.success("User LogOut",{
                autoClose: 3000}
            )
            navigate("/")
        } catch (err) {
            console.error("Logout failed:", err.message);
        }
    };

    return(
        <div className="Navbar">
            <div className="foodLogo">
                <h1 onClick={()=>navigate("/")}>FoodShare</h1>
            </div>
            <div className="Nav-links">
            {login ? (
                <>
                    <h3 onClick={handleLogout}>Log Out</h3>
                    <h3 onClick={handleDonationClaim}>My Donations/Claims</h3>
                </>
                ) : (
                    <>
                    <h3 onClick={() => { console.log("Navigating to login"); navigate("/login"); }}>Login</h3>
                    <h3 onClick={() => { console.log("Navigating to Sign Up"); navigate("/signup"); }}>Sign Up</h3>
                    </>
                )}
            </div>
            <ToastContainer />
        </div>
    )
}