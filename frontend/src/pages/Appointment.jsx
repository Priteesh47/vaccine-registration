import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Appointment = () => {
  const { vacId } = useParams();
  const { vaccines } = useContext(AppContext);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [vacInfo, setVacInfo] = useState(null);
  const [vacSlots, setVacSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Vaccines:", vaccines); // Debugging: Check if vaccines are loaded
    const vacInfo = vaccines.find((vac) => vac._id === vacId);
    if (vacInfo) {
      setVacInfo(vacInfo);
      setLoading(false);
    } else {
      setError("Vaccine information not found.");
      setLoading(false);
    }
  }, [vaccines, vacId]);

  useEffect(() => {
    if (!vacInfo) return;
    const generateSlots = () => {
      let slots = [];
      let today = new Date();

      for (let i = 0; i < 7; i++) {
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        let endTime = new Date(currentDate);
        endTime.setHours(17, 0, 0, 0);

        // Set start time logic
        if (i === 0) {
          currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currentDate.setHours(10, 0, 0, 0);
        }

        let timeSlots = [];
        while (currentDate < endTime) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: currentDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
          currentDate.setMinutes(currentDate.getMinutes() + 50);
        }

        slots.push(timeSlots);
      }

      setVacSlots(slots);
    };

    generateSlots();
  }, [vacInfo]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    vacInfo && (
      <div className="max-w-5xl mx-auto my-10 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="w-full sm:w-1/2 bg-gray-100 flex items-center justify-center p-6 rounded-lg">
            <img
              className="w-full h-80 object-cover rounded-lg"
              src={vacInfo.image}
              alt={vacInfo.name}
            />
          </div>

          <div className="w-full sm:w-1/2 p-6 space-y-4">
            <h1 className="text-3xl font-semibold text-gray-900">
              {vacInfo.name}
            </h1>
            <p className="text-gray-600">
              {vacInfo.features} - {vacInfo.speciality}
            </p>
            <p className="text-gray-700">
              {vacInfo.dose} - {vacInfo.dosage}
            </p>
          </div>
        </div>

        {/* Booking Slots Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Booking Slots</h2>

          {/* Days */}
          <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
            {vacSlots.length > 0 &&
              vacSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-3 px-4 min-w-16 rounded-lg cursor-pointer transition-all 
                  ${
                    slotIndex === index
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                  </p>
                  <p className="text-lg font-semibold">
                    {item[0] && item[0].datetime.getDate()}
                  </p>
                </div>
              ))}
          </div>

          {/* Time Slots */}
          <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
            {vacSlots.length > 0 &&
              vacSlots[slotIndex]?.map((item, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-medium px-5 py-2 rounded-full cursor-pointer transition-all 
                  ${
                    item.time === slotTime
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "text-gray-500 border border-gray-300"
                  }`}
                >
                  {item.time}
                </p>
              ))}
          </div>

          <div className="mt-6 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-10 py-3 rounded-lg shadow-md transition-all">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Appointment;
