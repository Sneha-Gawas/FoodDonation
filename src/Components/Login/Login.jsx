import React, { useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export default function Login(){
    const navigate = useNavigate();
    const [user,setUser] = useState({
        username:"",
        password:"",
    })

    const onChangeHandler = (e)=>{
        const name=e.target.name
        const value=e.target.value
        setUser((prevUser)=>({...prevUser,[name]:value}))
    }

    const onSubmitHandler=async (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("username",user.username)
        formData.append("email",user.email)
        formData.append("password",user.password)

        try{
            const result = await axios.post(`/info/api/login`,user,{
                withCredentials: true,  
            })
            console.log("Response of User logged in:",result)
            console.log("User logged in data:",result.data.data)
            const userData = result.data.data
            console.log("UserData",userData)
            toast.success("User Logged In successfully!", {
                position: "top-right",
                autoClose: 1000,         
            });
            
            setTimeout(() => {
                if(userData.role ==="Donor"){
                    console.log("Donor",userData)
                    navigate(`/donor/${userData._id}`)
                }else if(userData.role ==="NGO"){
                    navigate(`/ngo/${userData._id}`)
                }else{
                    navigate("/")
                }
                
            }, 2000);
           
            
            setUser({
                username:"",
                password:"",
            })
        }
        catch(error){
            if (error.response && error.response.status === 401) {
                toast.error("Please Log In. Please try again.", { position: "top-right" });
                navigate("/login");  
            } else {
                console.error(error);
                toast.error("Failed to Log In. Please try again.", { position: "top-right" });
            }
            console.log(err.message)
            
        }
    }
    

    return(
        <div className="Login">
      
            <form className="LoginForm" onSubmit={onSubmitHandler}>
            <h2>Login</h2>
                <label htmlFor="username">Username:</label>
                <input 
                  type="text" 
                  name="username"
                  id="username"
                  placeholder="Enter username"
                  onChange={onChangeHandler}
                  value={user.username} required/>

                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  name="password"
                  id="password"
                  placeholder="Enter password"
                  value={user.password}
                  onChange={onChangeHandler}
                  required/>
                
                <button>Log In</button>
               
               <Link to="/signup">I dont' have an account,Create one</Link>
            </form>
            <ToastContainer />
        </div>
    )
}