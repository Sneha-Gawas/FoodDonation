import React from "react";
import "./Hero.css"
import { useNavigate } from "react-router-dom";

export default function Hero(){
    const navigate = useNavigate();
    return(
        <>
        <div className="Header">
            <h1>Welcome to FoodShare</h1>
            <p>Coonnecting food donors with NGOs to reduce food waste and feed those in need </p>
            <div className="header-btns">
                <button onClick={()=>navigate("/foodlist/donor")}>I want to Donate Food</button>
                
            </div>

        </div>
        
        <div className="works">
            <h1>How It Works</h1>
            <div className="work">
                <div className="dwork">
                    <h1>1.Register</h1>
                    <p>Sign up as a donor or an NGO to get started</p>
                </div>
                <div className="dwork">
                    <h1>2. Post or Browse</h1>
                    <p>Donors post available food, NGOs browse and claim donations</p>
                </div>
                <div className="dwork">
                    <h1>3.Coordinate</h1>
                    <p>Arrange pickup details and complete the donation</p>
                </div>
            </div>
        </div>

        <div className="works">
        <h1>Our Impact</h1>
            <div className="work">
                <div className="dwork">
                    <h1 id="impact">1000+</h1>
                    <p>Meals Donated</p>
                </div>
                <div className="dwork">
                    <h1 id="impact">50+</h1>
                    <p>NGOs Supported</p>
                </div>
                <div className="dwork">
                    <h1 id="impact">500kg</h1>
                    <p>Food Waste Reduced</p>
                </div>
            </div>
        </div>
        <div className="footer">
            <div className="footer-copyright">
                <h2>@ 2024 FoodShare. All rights reserved.</h2>
            </div>
        </div>
        </>
    )
}