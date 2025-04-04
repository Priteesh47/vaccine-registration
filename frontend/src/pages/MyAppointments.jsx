import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { vaccines, setVaccines } = useContext(AppContext);
  const [showMore, setShowMore] = useState(false);

  const cancelAppointment = (id) => {
    const updatedVaccines = vaccines.filter((vaccine) => vaccine.id !== id);
    setVaccines(updatedVaccines);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <p className="pb-3 text-lg font-semibold text-gray-700 border-b">
        Vaccination Appointments
      </p>

      <div className="mt-4 space-y-6">
        {vaccines
          .slice(0, showMore ? vaccines.length : 3)
          .map((item, index) => (
            <div
              className="flex flex-col sm:flex-row items-start gap-6 p-4 border rounded-lg shadow-sm"
              key={item.id}
            >
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.image}
                  alt="Vaccine"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-lg font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">{item.speciality}</p>
                <p className="text-sm text-gray-600">Dosage: {item.dosage}</p>
                <p className="text-sm text-gray-600">{item.address}</p>

                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Date and Time:</span>{" "}
                  {new Date(item.date).toLocaleDateString()} |{" "}
                  {new Date(item.date).toLocaleTimeString()}
                </p>
              </div>

              <div>
                <button
                  onClick={() => cancelAppointment(item.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          ))}

        {vaccines.length > 3 && !showMore && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowMore(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              Show More
            </button>
          </div>
        )}
      </div>

      {vaccines.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No appointments scheduled.
        </p>
      )}
    </div>
  );
};

export default MyAppointments;
