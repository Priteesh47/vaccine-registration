import React, { useState } from "react";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "John Willams",
    image: assets.profile,
    email: "John12@gmail.com",
    phone: "+1 234567891",
    address: "Nottingham, United Kingdom",
    dob: "2000-01-01",
    gender: "Male",
  });

  const [isEdit, setIsEdit] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!userData.name || !userData.email || !userData.phone) {
      alert("Please fill all fields correctly.");
      return;
    }
    setIsEdit(false);
  };

  const isSaveDisabled = () => {
    return (
      userData.name === "John Willams" &&
      userData.email === "John12@gmail.com" &&
      userData.phone === "+1 234567891" &&
      userData.address === "Nottingham, United Kingdom" &&
      userData.dob === "2000-01-01" &&
      userData.gender === "Male"
    );
  };

  return (
    <div className="flex justify-start items-start min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-2/5 ml-10 mt-10">
        <div className="flex items-center gap-4">
          <img
            src={userData.image}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          {isEdit ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-md p-2"
            />
          ) : (
            <p className="text-lg font-semibold">{userData.name}</p>
          )}
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="space-y-3">
          <div>
            <p className="text-gray-500 font-medium">Email:</p>
            {isEdit ? (
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            ) : (
              <p className="text-gray-700">{userData.email}</p>
            )}
          </div>

          <div>
            <p className="text-gray-500 font-medium">Phone:</p>
            {isEdit ? (
              <input
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            ) : (
              <p className="text-gray-700">{userData.phone}</p>
            )}
          </div>

          <div>
            <p className="text-gray-500 font-medium">Address:</p>
            {isEdit ? (
              <input
                type="text"
                value={userData.address}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            ) : (
              <p className="text-gray-700">{userData.address}</p>
            )}
          </div>

          <div>
            <p className="text-gray-500 font-medium">Gender:</p>
            {isEdit ? (
              <select
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                value={userData.gender}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-700">{userData.gender}</p>
            )}
          </div>

          <div>
            <p className="text-gray-500 font-medium">Date of Birth:</p>
            {isEdit ? (
              <input
                type="date"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                value={userData.dob}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            ) : (
              <p className="text-gray-700">{userData.dob}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex">
          {isEdit ? (
            <button
              onClick={handleSave}
              disabled={isSaveDisabled()}
              className={`${
                isSaveDisabled() ? "bg-gray-400" : "bg-blue-500"
              } text-white px-4 py-2 rounded-md hover:bg-blue-600 transition`}
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
