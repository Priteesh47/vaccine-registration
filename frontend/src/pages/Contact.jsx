import React from "react";
import { assets } from "../assets/assets";
import Swal from "sweetalert2";

const Contact = () => {
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // access key of web3 forms
    formData.append("access_key", "58ec7a27-1c38-4335-bb93-6db81a3cd455");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: json,
    }).then((res) => res.json());

    if (res.success) {
      Swal.fire({
        title: "Successful!",
        text: "Message sent Successfully!",
        icon: "success",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full bg-gray-100 font-[Outfit]">
      {/* Left image section of contact */}
      <div className="w-full md:w-1/2 h-screen">
        <img
          src={assets.contact}
          alt="Contact Vaccino"
          className="w-full h-full object-cover rounded-lg shadow-xl"
        />
      </div>

      {/* Form right section of contact */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-16 text-gray-900 bg-blue-100">
        <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-black">
          Contact Us
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-lg font-semibold text-black mb-2"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-black mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-lg font-semibold text-black mb-2"
            >
              Message
            </label>
            <textarea
              name="message"
              placeholder="Enter your message"
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>

            <div className="mt-4 flex justify-start">
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </form>

        {/* Frequently Asked Questions */}
        <div className="mt-10 bg-blue-50 p-8 rounded-lg shadow-lg">
          <h3 className="text-3xl font-semibold text-black mb-6">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <h4 className="font-semibold text-xl text-gray-800 mb-2">
                How do I register for Vaccinations?
              </h4>
              <p className="text-gray-600">
                To register for a vaccine, simply visit our registration page
                and provide the necessary details such as your username. Choose
                a vaccination center based on your location and book an
                appointment.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <h4 className="font-semibold text-xl text-gray-800 mb-2">
                Can I change my Appointment?
              </h4>
              <p className="text-gray-600">
                Yes, you can modify your appointment from the user dashboard.
                Please ensure to reschedule within the available time slots.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <h4 className="font-semibold text-xl text-gray-800 mb-2">
                Is there a way to find nearby vaccination centers?
              </h4>
              <p className="text-gray-600">
                Our system uses geolocation to suggest vaccination centers near
                you.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <h4 className="font-semibold text-xl text-gray-800 mb-2">
                What happens if I miss my Appointment?
              </h4>
              <p className="text-gray-600">
                If you miss your scheduled appointment, please reschedule it as
                soon as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
