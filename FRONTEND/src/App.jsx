import React from "react";
import {Routes,Route} from "react-router-dom"
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/HeroSection/Hero";
import SignUp from "./Components/SignUp/SignUp";
import Login from "./Components/Login/Login";
import DonerDashBoard from "./Components/DonerDashBoard/DonerDashBoard";
import NgoDashBoard from "./Components/NgoDashBoard/NgoDashBoard";
import DonorForm from "./Components/DonorForm/DonorForm";

export default function App(){
  return(
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Hero/>}></Route>
        <Route path="/signup" element={<SignUp/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/donor/:id" element={<DonerDashBoard/>}></Route>
        <Route path="/ngo/:id" element={<NgoDashBoard/>}></Route>
        <Route path="/foodlist/donor" element={<DonorForm/>}></Route>
      </Routes>
    </div>
  )
}
