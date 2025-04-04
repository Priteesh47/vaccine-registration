import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Vaccines from "./pages/Vaccines";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import About from "./pages/About";
import Center from "./pages/Center";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <div className="w-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vaccines" element={<Vaccines />} />
        <Route path="/vaccines/:speciality" element={<Vaccines />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/center" element={<Center />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointment/:vacId" element={<Appointment />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
