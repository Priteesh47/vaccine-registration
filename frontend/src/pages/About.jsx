import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="flex flex-col md:flex-row w-full bg-gray-100 font-[Outfit]">
      {/*Image section of Code*/}
      <div className="w-full md:w-1/2 h-screen">
        <img
          src={assets.about}
          alt="About Vaccino"
          className="w-full h-full object-cover rounded-lg shadow-xl"
        />
      </div>

      {/*Writeen Section of Code  */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-16 text-gray-900 bg-blue-100">
        <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-black">
          Welcome to Vaccino
        </h2>
        <p className="text-lg leading-relaxed mb-6 text-black">
          Vaccino is a comprehensive vaccine registration system designed to
          simplify the vaccination process for both individuals and healthcare
          providers. With our user-friendly platform, you can easily register,
          book appointments, and find nearby vaccination centers using real-time
          geolocation features.
        </p>

        <h3 className="text-2xl md:text-3xl font-semibold text-black mt-6 mb-4">
          Our Features
        </h3>
        <p className="text-lg leading-relaxed mb-6 text-black">
          Vaccino offers a seamless experience with a role-based access system
          for users, healthcare staff, and administrators. Users can track their
          vaccination history, book appointments, and receive timely
          notifications. Healthcare providers can manage vaccine inventory and
          schedules, while administrators have full control to ensure smooth
          coordination.
        </p>
      </div>
    </div>
  );
};

export default About;
